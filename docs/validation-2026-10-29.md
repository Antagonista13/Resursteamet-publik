# Verifiering 2026-10-29

Utvecklingsgren: `utveckling/dashboard-demo-2026-10-29`. Designen godkändes i chatten före implementation. Ingen produktionsändring ingår.

## Genomförda kontroller

`python3 -m unittest discover -s tests -v`: **28 tester passerade**, inga överhoppade. Python 3.12.14, Playwright 1.62.0, Chromium.

- 22 webbläsartester kör den riktiga sidan på en tillfällig HTTP-server med syntetiska externa svar och påhittade aktiviteter.
- 6 Python-integrationstester kör matsedelsskriptet med temporära filer och ersatt nätverksgräns.
- Både `dashboard.js` och de inline-script som finns i `index.html` klarar `node --check`.
- `git diff --check` passerar.
- Skärmbilder från 390×844, 1440×900 och 1920×1080 har granskats visuellt. Automatiska kontroller täcker också alla tre lägen på dessa skärmstorlekar, utan horisontell sidscroll och med TV-panelerna inom skärmen.

Testerna omfattar dags-/veckoval, två kalenderfilter, datumval över vintertids-/årsskifte, kalender-CRUD, export/import, importgränser, ogiltiga datum/tider/ID, dubbletter, lagringsfel, skydd av tidigare localStorage och textinjektion som text. Personalplanering för fem personer, datumbunden status och återställning, uppdragsstatus, placeringar, testlovens gränsdatum, gammal matsedel, nästa vardags meny, HTTP-fel, verklig vädertimeout och TV-sidväxling under belastning ingår.

## Återanvändning och begränsningar

Befintlig TV-layout, kalendermekanik, backupformat och elev-/uppdragspaneler har återanvänts. Ingen frontendplattform eller runtimepaketinstallation har införts. `.github/workflows/update-menu.yml` och den spårade `menu.json` är oförändrade.

Ingen SharePoint-anslutning, lista eller export har varit tillgänglig. Ett anonymiserat JSON-exempel behövs för formatmappning. Ingen Outlook-anslutning har verifierats; det rapporterade MailboxNotEnabledForRESTAPI kvarstår som separat integrationsfråga.

Kalenderexempel ligger i separat testlagring. Personal, placeringar, elevkoder och uppdrag ligger i minnet. Testlov är uttryckligen fiktiva. Offentliga väder- och matsedelsanrop återanvänder befintliga integrationer; testerna använder syntetiska svar och verifierar inte extern drifttillgänglighet.

Endast Chromium har automatiserats; Safari, Firefox, riktiga telefoner och fysisk TV är inte testade. Ingen automatisk tillgänglighetscertifiering eller skollovs-/bemanningsregelverifiering görs. Tangentbordsanvändning och synliga etiketter har kontrollerats i utvalda flöden.

## Leverans

Utvecklingsgrenen ska granskas genom pull request. Ingen merge, deploy, ändring av miljökonfiguration eller körning av schemalagt produktionsworkflow har gjorts. GitHubs API var blockerat av proxy vid inventeringen; aktuell PR-status redovisas i chatten efter leveransförsöket.
