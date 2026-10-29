# Resursteamet Dashboard

Svensk statisk dashboard för dator, mobil och TV. Bygger vidare på projektets kalender, elevkoder, placeringar och uppdragslista. Ingen backend eller byggprocess behövs.

**Det här är en testversion. Använd bara påhittade personal-, elev-, kalender- och uppdragsuppgifter.** Verkliga initialer är inte tillräcklig anonymisering. Sidan saknar inloggning och är inte en plats för verkliga elevärenden.

## Kör lokalt

Från projektets rot:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Python 3.12 matchar projektets befintliga GitHub-workflow. Använd befintlig checkout i molnmiljön, som redan är isolerad. Ingen extra worktree behövs.

- **Dashboard:** läsbar dag-/veckovy, två kalenderfilter, datumval och planering för fem fiktiva medarbetare. Mobil börjar i dagsvy.
- **Redigera testdata:** lägg till, ändra och ta bort kalenderposter; import/export, testplaceringar, elevkoder och uppdragsstatus. Belastningstest och återställning finns här.
- **Storbildsläge:** befintlig femdagarsvy och automatisk sidväxling var tolfte sekund. Personalplanering visas i dashboardläget.

Testkalendern lagras i `resursteamet_demo_calendar_v1`. Den tidigare nyckeln `resursteamet_public_calendar_v1` läses inte automatiskt och ändras inte. `Återställ testdata` rensar endast testkalendern och laddar om sidan. Personalplanering, uppdrag, placeringar och ändrade elevkoder hålls i minnet och återställs vid omladdning. Kalenderbackup använder fortfarande `resursteamet-calendar`, version 1. Import godtar högst 1 MB och 500 poster, validerar datum/tid/ID och kräver bekräftelse. Importerade ID som redan finns läggs inte till igen.

## Data och anslutningar

- `demo-config.json`: `version: 1`, `demo: true`, `breaks: [{name, start, end}]`. Alla lovdatum i filen är **påhittade exempel**, inte verifierade läsårstider. Lägg till nya exempelperioder när de gamla har passerat.
- `menu.json`: befintlig offentlig matsedel. Endast en rätt med matchande datum visas; gammal meny presenteras inte som dagens. Efter klockan 13 och på helger används nästa vardag; skollov är inte automatiskt undantagna.
- `scripts/update_menu.py`: hämtar offentlig Matilda-data (`courses` eller äldre `dishes`) och behåller föregående meny vid nätverks-/tolkningsfel. Testkör i en temporär katalog för att inte ändra den spårade matsedeln.
- Väder använder det befintliga offentliga Open-Meteo-anropet. Hämtningar har timeout och visar reservtext vid fel.
- **SharePoint är inte anslutet.** En anonymiserad JSON-export eller läsbar liststruktur behövs innan en adapter kan bedömas. Lägg aldrig tokens eller riktiga personuppgifter i detta publika repository.
- **Outlook är inte anslutet.** Det tidigare rapporterade `MailboxNotEnabledForRESTAPI` är inte löst eller verifierat här. Inga Graph-anrop eller kalenderkopplingar utförs.

Befintliga format och granskningsgränser finns i [inventeringen](docs/inventering-2026-10-29.md). Designen finns i [designförslaget](docs/superpowers/specs/2026-10-29-dashboard-design.md).

## Tester

Applikationen kräver ingen paketinstallation. För utvecklingstester används Python unittest, Playwright 1.62.0 och Chromium. I den förberedda molnmiljön finns dessa redan. På en ny maskin:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python -m playwright install chromium
.venv/bin/python -m unittest discover -s tests -v
```

Chromium kan kräva systembibliotek på en ny Linux-maskin; använd Playwrights dokumenterade `install-deps chromium` med lämplig behörighet. Testerna använder `CHROMIUM_PATH` om satt, därefter systemets `chromium`, annars Playwrights installerade webbläsare.

I den befintliga miljön räcker:

```sh
python3 -m unittest discover -s tests -v
node --check dashboard.js
```

Testerna kör den riktiga sidan via en tillfällig lokal HTTP-server. Externa svar och person-/ärendeuppgifter är syntetiska; inga SharePoint-, Outlook- eller produktionsanrop behövs. Matsedelstester använder temporära filer och ersätter bara nätverksgränsen.

Ingen merge, deploy, miljöpublicering eller körning av produktionsworkflow ingår i utvecklingsarbetet. GitHubs API-åtkomst krävs för att skapa en pull request; fungerande Git-push bevisar inte API-åtkomst.
