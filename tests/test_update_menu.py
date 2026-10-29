"""Updater integration tests; all API responses and menu files are synthetic."""
import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch
import urllib.error

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/update_menu.py'


class MenuTests(unittest.TestCase):
    def run_updater(self, payload, fail=False):
        with tempfile.TemporaryDirectory() as directory:
            previous = Path.cwd()
            os.chdir(directory)
            try:
                Path('menu.json').write_text('previous-menu', encoding='utf-8')
                response = io.BytesIO(json.dumps(payload).encode())
                error = None
                with patch('urllib.request.urlopen', side_effect=urllib.error.URLError('test network error') if fail else None, return_value=response):
                    with contextlib.redirect_stdout(io.StringIO()):
                        try:
                            runpy.run_path(str(SCRIPT), run_name='__main__')
                        except (SystemExit, ValueError, urllib.error.URLError) as caught:
                            error = caught
                return error, Path('menu.json').read_text(encoding='utf-8')
            finally:
                os.chdir(previous)

    def test_courses_response_becomes_existing_dishes_format(self):
        error, contents = self.run_updater({'meals': [{'date': '2026-11-02T00:00:00', 'courses': [{'name': ' Testrätt A '}, {'name': 'Testrätt B'}]}]})
        self.assertIsNone(error)
        self.assertEqual(json.loads(contents)['meals'], [{'date': '2026-11-02', 'name': '', 'dishes': ['Testrätt A', 'Testrätt B']}])

    def test_legacy_dishes_still_supported(self):
        error, contents = self.run_updater({'meals': [{'date': '2026-11-02', 'dishes': [' Testrätt A ', {'title': 'Testrätt B'}]}]})
        self.assertIsNone(error)
        self.assertEqual(json.loads(contents)['meals'][0]['dishes'], ['Testrätt A', 'Testrätt B'])

    def test_invalid_calendar_date_preserves_previous_file(self):
        error, contents = self.run_updater({'meals': [{'date': '2026-02-30', 'dishes': ['Test']} ]})
        self.assertIsNotNone(error)
        self.assertEqual(contents, 'previous-menu')

    def test_empty_payload_preserves_previous_file(self):
        error, contents = self.run_updater({'meals': []})
        self.assertIsNotNone(error)
        self.assertEqual(contents, 'previous-menu')

    def test_malformed_dishes_preserve_previous_file(self):
        error, contents = self.run_updater({'meals': [{'date': '2026-11-02', 'courses': [{'name': None}, 42]}]})
        self.assertIsNotNone(error)
        self.assertEqual(contents, 'previous-menu')

    def test_network_failure_preserves_previous_file(self):
        error, contents = self.run_updater({}, fail=True)
        self.assertIsNotNone(error)
        self.assertEqual(contents, 'previous-menu')
