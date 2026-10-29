# Inventering av Resursteamet Dashboard

Inventerat 2026-10-29. Repository: Antagonista13/Resursteamet-publik.
Bas: main, b97e4c7b5d109319f81d1b08ee1531e796f967f6.
Utvecklingsgren: utveckling/dashboard-demo-2026-10-29.

## Omfattning

Alla fyra spårade filer har lästs. Alla 25 lokalt tillgängliga commits och deras fillistor har inventerats; samma fyra sökvägar förekommer i historiken. Den läsbara remote-grenen main pekade på samma commit vid kontrollen. GitHub-API:t är blockerat av proxy med CONNECT 403, så serverinställningar, PR-lista och eventuella ospårade SharePoint-resurser är inte inventerade. Inga AGENTS.md, README, paketmanifest, låsfiler, tester, byggverktyg eller SharePoint-referenser finns i projektet.

| Fil | Innehåll | Återanvändning |
| --- | --- | --- |
| index.html | All HTML, CSS och JavaScript; svensk statisk dashboard | Behåll befintliga komponenter och hanterare |
| menu.json | Publik matsedel, senast daterad 2026-10-15, måltider 12–23 oktober | Behåll format; använd syntetisk fixture vid test |
| scripts/update_menu.py | Standardbibliotek i Python; hämtar offentlig Matilda-meny | Rätta fältmappning separat med regressionstest |
| .github/workflows/update-menu.yml | Python 3.12; vardagar 05:25 UTC och manuell körning; uppdaterar menu.json genom commit/push | Behåll, kör inte produktionsworkflow under utveckling |

## Befintligt beteende

- Storbildsläge och redigeringsläge. TV-läget visar fem vardagar, redigeringsläget sju dagar.
- Dagens aktiviteter och veckokalender; navigering mellan veckor.
- Två lokala kalenderkällor: work (Min kalender) och team (Resursteamet).
- Skapa, redigera och ta bort kalenderhändelser; lokal lagring och JSON-säkerhetskopia/import.
- Påhittade elevkoder per veckodag, testuppdrag och testplaceringar med utskolning och slutdatumsnedräkning. Dessa hålls i minnet.
- Belastningstest, automatisk sidväxling var tolfte sekund och indikator för TV.
- Publikt väder från Open-Meteo, lokal menu.json, byte till nästa skoldags matsedel efter kl. 13 och preliminär höstlovsnedräkning för 2026.
- Outlook anges uttryckligen som frånkopplat. Ingen Graph-, OAuth- eller SharePoint-implementation finns.

## Befintliga dataformat

### Kalender

LocalStorage: resursteamet_public_calendar_v1, lista av objekt:

```json
[{"id":"test-1","date":"2026-11-02","time":"09:00","source":"team","title":"Fiktivt planeringsmöte"}]
```

Exportformat:

```json
{"format":"resursteamet-calendar","version":1,"exportedAt":"2026-10-29T09:00:00Z","events":[{"id":"test-1","date":"2026-11-02","time":"09:00","source":"team","title":"Fiktivt planeringsmöte"}]}
```

Import begränsar filstorlek till 1 MB och högst 500 händelser. Datum och tid kontrolleras med reguljära uttryck, inte fullständig kalenderkontroll; duplicerade ID inom samma importfil filtreras inte. Detta är förbättringspunkter att testa.

### Matsedel

```json
{"updatedAt":"2026-10-29T09:00:00Z","source":"https://example.invalid/test-menu","meals":[{"date":"2026-11-02","name":"","dishes":["Testrätt A","Testrätt B"]}]}
```

Befintliga datum kan inkludera tidsdel. Frontend använder de första tio tecknen. Nuvarande Matilda-svar innehåller meals[].courses[].name; Python-skriptet läser endast dishes. Detta förklarar det reproducerade felet ”No valid menu dishes”. API-åtkomsten fungerar efter miljöpublicering; parsningen behöver rättas.

### Tillfälliga poster i JavaScript

- Elevkoder: lista med sju strängar, en per veckodag.
- Uppdrag: {school, start, status}; status är Ny förfrågan, Inväntar beslut, Under planering eller Klar för start.
- Placering: {code, start, end, phase}; phase är Pågående eller Utskolning.
- Personalplanering och konfigurerbar lovlista saknas.

## Utförda kontroller av oförändrad bas

- Git-arbetskatalogen var ren innan utvecklingsgrenen skapades.
- Git read-only åtkomst och remote main verifierade.
- Chromium/Playwright med syntetiska nätverkssvar vid 390×844, 1440×900 och 1920×1080: inga pageerror och ingen horisontell överbredd; fem kalenderdagar i befintligt storbildsläge.
- Tidigare miljökontroll: HTTP 200 för HTML och menu.json; JavaScript-syntax godkänd; väder-API HTTP 200; Matilda HTTP 200 men uppdateringsskriptet avslutas med fel på fältmappningen.
- Dessa kontroller bevisar inte att samtliga redigerings-, backup- eller TV-interaktioner fungerar; de ska regressionstestas vid implementation.

## Åtkomst och avgränsningar

- Ingen SharePoint-anslutning tillgänglig i sessionens verktyg. Ingen webbplatsadress, lista, export eller schema tillhandahållet. Befintliga SharePoint-filer kan inte bedömas ännu.
- Ett anonymiserat JSON-exempel räcker för lokal formatanalys och kräver ingen SharePoint-inloggning. Hemligheter eller verkliga personuppgifter ska inte läggas i det publika projektet.
- MailboxNotEnabledForRESTAPI är uppgivet av användaren, inte reproducerat här. Outlook-anslutning är inte verifierad; ingen synkning planeras i demoversionen.
- gh och en GH_TOKEN-bindning finns, men gh api och en oautentiserad kontroll mot api.github.com får proxy/403. Det bevisar inte att token saknar behörighet. PR-skapande kräver fungerande API-åtkomst. Git-pushbehörighet är ännu inte prövad.
- Ingen produktion, main-gren, miljökonfiguration eller schemalagd körning har ändrats i denna inventering.
