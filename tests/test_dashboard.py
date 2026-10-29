"""Browser checks against the real static site; only external data is synthetic."""
import datetime as dt
import functools
import http.server
import json
import os
from pathlib import Path
import threading
import unittest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LEGACY = 'resursteamet_public_calendar_v1'
DEMO = 'resursteamet_demo_calendar_v1'
EVENT = {'id': 'import-1', 'date': '2026-10-29', 'time': '11:00', 'source': 'team', 'title': 'Importerat testmöte'}


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class DashboardTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width':1440, 'height':900}, timezone_id='Europe/Stockholm', accept_downloads=True)
        self.page = self.context.new_page()
        self.page.set_default_timeout(1500)
        self.errors = []
        self.page.on('pageerror', lambda e:self.errors.append(str(e)))
        self.page.on('dialog', lambda d:d.accept())
        self.page.clock.install(time=dt.datetime(2026, 10, 29, 8, tzinfo=dt.timezone.utc))
        self.page.route('https://**/*', lambda r:r.fulfill(status=200, content_type='application/json', body=json.dumps({'current': {'temperature_2m': 10, 'wind_speed_10m': 4, 'weather_code': 2}})))
        self.page.route('**/menu.json*', lambda r:r.fulfill(status=200, content_type='application/json', body=json.dumps({'updatedAt':'2026-10-29T08:00:00Z','meals':[{'date':'2026-10-29','dishes':['Testrätt A']},{'date':'2026-10-30','dishes':['Testrätt B']}]})))

    def tearDown(self):
        self.context.close()

    def open(self):
        self.page.goto(f'http://127.0.0.1:{self.server.server_port}/')
        self.page.wait_for_load_state('networkidle')

    def upload(self, events):
        payload = {'format':'resursteamet-calendar', 'version':1, 'events':events}
        self.page.locator('#import-events').set_input_files({'name':'test.json','mimeType':'application/json','buffer':json.dumps(payload).encode()})

    def edit_mode(self):
        self.page.locator('#edit-mode').click()

    def test_desktop_dashboard_week_default(self):
        self.open()
        self.assertTrue(self.page.locator('body').evaluate("e=>e.classList.contains('dashboard-view')"))
        self.assertEqual(self.page.locator('#week-grid .day').count(), 7)
        self.assertFalse(self.page.locator('#entry-form').is_visible())
        self.assertIn('ej anslutet', self.page.locator('#connection-status').inner_text())
        self.assertEqual(self.errors, [])

    def test_mobile_day_and_readable_seven_day_week(self):
        self.page.set_viewport_size({'width':390,'height':844})
        self.open()
        self.assertFalse(self.page.locator('#week-panel').is_visible())
        self.page.locator('#week-view').click()
        self.assertTrue(self.page.locator('#week-panel').is_visible())
        self.assertEqual(self.page.locator('#week-grid .day').count(),7)
        self.assertFalse(self.page.evaluate('document.documentElement.scrollWidth > innerWidth'))

    def test_both_calendar_filters_affect_day_and_week(self):
        self.open()
        self.assertGreaterEqual(self.page.locator('#today-events .activity').count(),2)
        self.page.locator('#filter-work').uncheck()
        self.assertEqual(self.page.locator('#today-events .activity:not(.team)').count(),0)
        self.assertGreater(self.page.locator('#week-grid .week-event.team').count(),0)
        self.page.locator('#filter-team').uncheck()
        self.assertEqual(self.page.locator('#week-grid .week-event').count(),0)
        self.page.locator('#filter-work').check()
        self.assertGreater(self.page.locator('#week-grid .week-event:not(.team)').count(),0)

    def test_selected_day_survives_modes_and_dst_navigation(self):
        self.open()
        self.page.locator('#calendar-date').fill('2026-10-25')
        self.page.locator('#day-view').click()
        self.page.locator('#nav-next').click()
        self.assertEqual(self.page.locator('#calendar-date').input_value(),'2026-10-26')
        self.page.locator('#week-view').click()
        self.page.locator('#nav-prev').click()
        self.assertEqual(self.page.locator('#calendar-date').input_value(),'2026-10-19')
        self.page.locator('#display-mode').click()
        self.page.locator('#dashboard-mode').click()
        self.assertEqual(self.page.locator('#calendar-date').input_value(),'2026-10-19')
        self.page.locator('#nav-today').click()
        self.assertEqual(self.page.locator('#calendar-date').input_value(),'2026-10-29')

    def test_legacy_storage_is_not_read_or_overwritten_on_reset(self):
        self.page.add_init_script("localStorage.setItem('resursteamet_public_calendar_v1',JSON.stringify([{id:'old',date:'2026-10-29',time:'08:00',source:'work',title:'LEGACY SHOULD NOT LOAD'}]));")
        self.open()
        self.assertNotIn('LEGACY SHOULD NOT LOAD',self.page.locator('#today-events').inner_text())
        self.edit_mode()
        self.page.locator('#reset-demo').click()
        self.assertIn('LEGACY SHOULD NOT LOAD',self.page.evaluate(f'localStorage.getItem({json.dumps(LEGACY)})'))

    def test_calendar_crud_export_and_import(self):
        self.open(); self.edit_mode()
        self.page.locator('#entry-date').fill('2026-10-29')
        self.page.locator('#entry-time').fill('12:00')
        self.page.locator('#entry-title').fill('Nytt testmöte')
        self.page.locator('#save-event').click()
        event=self.page.locator('#today-events .activity').filter(has_text='Nytt testmöte')
        self.assertEqual(event.count(),1)
        event.get_by_role('button',name='Redigera').click()
        self.page.locator('#entry-title').fill('Ändrat testmöte')
        self.page.locator('#save-event').click()
        self.assertIn('Ändrat testmöte',self.page.locator('#today-events').inner_text())
        with self.page.expect_download() as downloaded:
            self.page.locator('#export-events').click()
        exported=json.loads(Path(downloaded.value.path()).read_text())
        self.assertEqual(exported['format'],'resursteamet-calendar')
        self.assertTrue(any(x['title']=='Ändrat testmöte' for x in exported['events']))
        self.upload([EVENT])
        self.page.wait_for_function("document.querySelector('#backup-feedback').textContent.includes('lästes in')")
        self.assertIn('Importerat testmöte',self.page.locator('#today-events').inner_text())
        self.page.locator('#week-grid .week-event').filter(has_text='Ändrat testmöte').get_by_role('button',name='Ta bort',exact=False).click()
        self.assertNotIn('Ändrat testmöte',self.page.locator('#today-events').inner_text())
        self.assertEqual(self.errors,[])

    def test_invalid_imports_preserve_calendar(self):
        self.open(); self.edit_mode()
        before=self.page.locator('#today-events').inner_text()
        for overrides in ({'date':'2026-02-30'},{'time':'25:00'},{'id':''},{'id':'   '}):
            with self.subTest(overrides=overrides):
                self.upload([{**EVENT,**overrides}])
                self.page.wait_for_function("document.querySelector('#backup-feedback').textContent.includes('ogiltiga')")
                self.assertEqual(self.page.locator('#today-events').inner_text(),before)
        self.upload([EVENT,EVENT])
        self.page.wait_for_function("document.querySelector('#backup-feedback').textContent.includes('duplicerade')")
        self.assertEqual(self.page.locator('#today-events').inner_text(),before)

    def test_tampered_storage_is_rejected(self):
        self.page.add_init_script("localStorage.setItem('resursteamet_demo_calendar_v1',JSON.stringify([{id:'bad',date:'2026-02-30',time:'25:00',source:'team',title:'BROKEN'}]));")
        self.open()
        self.assertNotIn('BROKEN',self.page.locator('#week-grid').inner_text())
        self.assertIn('ogiltig',self.page.locator('#demo-feedback').inner_text())
