# Designförslag: Resursteamet Dashboard

Status: godkänt av användaren i chatten 2026-10-29. Implementation på separat utvecklingsgren.
Underlag: [projektinventeringen](../../inventering-2026-10-29.md).
Användaren granskade och godkände designen före implementation.

## Syfte och föreslagen väg

Bygg vidare på den befintliga svenska informationstavlan för att planera arbetsdag och arbetsvecka på dator och mobil, samtidigt som fungerande TV-visning behålls. All ny person-, elev-, kalender- och uppdragsinformation ska vara påhittad testdata.

Den föreslagna vägen är små ändringar i befintlig HTML/CSS/JavaScript och återanvändning av nuvarande rendering, kalenderhantering och JSON-format. Det följer användarens uttryckliga krav om återanvändning. Ett separat frontendramverk skulle duplicera fungerande delar och tillföra ett onödigt byggsteg. En inloggad backend med SharePoint/Outlook är en möjlig senare etapp, men kräver åtkomst, databeslut och separat godkännande och behövs inte för denna testversion. Ingen sådan integration ingår nu.

Val av teststatusar, testnamn, kalenderfilter och exempeldata nedan är förslag från implementeraren, inte redan godkända verksamhetsregler.

## Föreslagen skärm

På dator, i vanligt dashboardläge:

1. Rubrik, datum och klocka samt val för Dashboard, Storbild och Redigera testdata.
2. Tydlig text om testdata och status ”SharePoint: ej anslutet · Outlook: ej anslutet”.
3. Väder, matsedel och nästa lov i befintliga kort.
4. Kalender med Dag/Vecka, föregående/nästa, Idag och filter för Min kalender respektive Resursteamet. Källnamn syns även i text, inte bara färg.
5. Personalplanering för fem påhittade medarbetare.
6. Anonymiserad elevöversikt/placeringar och uppdragslista, baserade på befintliga paneler.

På mobil staplas samma innehåll i en kolumn. Dag är förval för nya mobilbesök; veckovyn visar alla sju dagar i läsbar lista utan horisontell sidscroll. Formulär och knappar får tillräcklig bredd och synliga etiketter. Ingen sidväxling döljer information i vanligt dashboardläge.

Storbildsläget behåller fem vardagar, befintlig sidväxling, belastningstest och de etablerade informationsrutorna. Personalplaneringen öppnas i vanligt dashboardläge så att TV-layouten inte fylls med ännu en rad och tappar läsbarhet. Detta är ett föreslaget avvägningsbeslut att granska.

## Kalender och navigering

- Återanvänd work och team samt befintliga skapa/redigera/ta bort-funktioner.
- Dag och vecka använder samma valda datum och samma kalenderfilter. ”Idag” återställer båda.
- Dagvyn kan bläddra mellan datum; veckovyn mellan kalenderveckor. Datumhantering ska klara sommar-/vintertidsbyte utan fel vecka.
- Ny demodata innehåller flera händelser i båda kalendrarna relativt en fast testklocka vid automatiska tester.
- Existerande lagringsnyckel får inte raderas eller skrivas över av demoåterställning. Den nya testversionen använder en separat nyckel, resursteamet_demo_calendar_v1, och läser inte automatiskt äldre kalenderinnehåll.
- Behåll befintligt backupformat resursteamet-calendar version 1. Import är uttryckligen för testdata och ska avvisa ogiltiga datum/tider, tomma eller duplicerade ID samt för stora datamängder. Visning använder textContent för importerad text.

## Personalplanering

Fem fiktiva medarbetare, ”Medarbetare A” till ”Medarbetare E”. Dag visar vald dag; vecka visar måndag–fredag. Varje rad visar en medarbetare och varje dag en redigerbar status: På plats, På uppdrag eller Ej tillgänglig. Ingen frånvaroorsak, fritext om hälsa, riktiga namn eller koppling till verkliga elevärenden.

Planeringen behålls endast i minnet i första etappen, liksom befintliga testuppdrag och testplaceringar. Tydlig text anger att den återställs vid omladdning. Delad lagring och bemanningsregler kräver senare beslut. Statusvalen är testexempel och ingen automatisk bemanningsberäkning utlovas.

## Elever och uppdrag

Återanvänd veckans elevkoder, placeringar och utskolningsvisning. Endast påhittade koder; verkliga initialer är inte tillräcklig anonymisering för den publika demon. Förbättra sammanhanget med tydlig testdatamärkning och datum som inte omedelbart blir inaktuella. Behåll kontroll av start/slutdatum och möjligheten att lägga till och ta bort testposter. Ingen verklig elevprofil eller personidentifierande koppling skapas.

Uppdragslistan behåller start, status och borttagning. Lägg till redigerbart statusval i testläget så att ett testuppdrag kan gå från Ny förfrågan till Klar för start. Påhittade skolor och uppdrag ligger kvar endast i minnet.

## Väder, matsedel och lov

- Behåll Open-Meteo, med tydlig tillfälligt otillgänglig-status. Automatiska tester använder syntetiska svar, även för fel och timeout.
- Behåll menu.json och frontendens dishes-format. Rätta Python-uppdateraren att tolka courses från Matilda samtidigt som äldre dishes-svar stöds. Ogiltiga eller tomma svar får inte ersätta tidigare fil. Testa i temporär katalog, inte mot produktion eller genom att köra GitHub-workflow.
- Vid daterad/gammal matsedel ska UI säga att aktuell meny saknas; ingen gammal rätt ska presenteras som dagens. Behåll veckomenylänken.
- Lovlistan görs konfigurerbar med tydligt märkta testperioder. Visa antal kalenderdagar till nästa testlov, pågående testlov eller ”Inget kommande testlov angivet”. Officiella lovdatum får inte hittas på eller presenteras som verifierade. Ingen publicering av skoldatumen utan separat verifiering.

## JSON och SharePoint

Befintliga kalender- och matsedelsformat behålls. Föreslagen lokal testdatamodell för personal:

```json
{"version":1,"staff":[{"id":"staff-a","name":"Medarbetare A"}],"assignments":[{"staffId":"staff-a","date":"2026-11-02","status":"På plats"}]}
```

I den fullständiga testuppsättningen finns exakt fem medarbetare. Föreslaget lovformat:

```json
{"version":1,"demo":true,"breaks":[{"name":"Testlov","start":"2026-11-02","end":"2026-11-06"}]}
```

SharePoint-filer kan återanvändas om deras struktur passar eller kan mappas till dessa modeller. Innan sådan mappning behövs ett anonymiserat JSON-exempel eller en tillgänglig lista med fältnamn och typer. Ingen SharePoint-adress, token, autentiseringshemlighet eller persondata byggs in i HTML. En generell JSON-fil ska inte automatiskt tolkas som betrodd kalender eller körbar kod.

Ingen Graph-anrop eller Outlook-synkning ingår. MailboxNotEnabledForRESTAPI kvarstår som ett separat åtkomst-/kompatibilitetsproblem, inte en fungerande anslutning.

## Genomförande och test efter godkännande

1. Lägg till kontroller för dag/vecka och kalenderfilter, behåll befintliga kalenderfunktioner och TV-läge.
2. Komplettera med fem personers testplanering och statusbyte i testuppdrag.
3. Separera testlagring, validera import och konfigurera märkta testlov.
4. Rätta matsedelns fältmappning med regressionstester som även bevarar tidigare fil vid fel.
5. Testa i Chromium/Playwright på mobil 390×844, dator 1440×900 och TV 1920×1080. Verifiera även dag-/veckonavigering, båda kalenderfiltren, CRUD, backup/import, återställning utan påverkan på tidigare lagring, alla fem medarbetare, uppdragsstatus, elevkoder, lovnedräkning, väderfel och saknad/gammal meny. Lägg till kantfall för datum och sommartidsbyte.
6. Kontrollera textinjektion som text, formuläretiketter och tangentbordsanvändning. Testa TV-sidväxling med belastningsdata och att mobilinnehåll inte kapas.
7. Dokumentera testresultat och kända begränsningar. Pusha endast utvecklingsgrenen och skapa PR mot main när API-åtkomst fungerar. Ingen merge, deploy, miljöpublicering eller produktionsworkflow utan godkännande.

## Kräver åtkomst eller beslut

- Designen är godkänd; produktion och verkliga integrationer kräver fortfarande separat godkännande.
- SharePoint: anonymiserat JSON-exempel eller läsbar länk och fältstruktur. Utveckling med lokala testdata kan fortsätta utan detta efter designgodkännande.
- PR: åtkomst till api.github.com behöver fungera; nuvarande proxy blockerar. Befintlig token får inte antas sakna behörighet enbart på grund av detta. Git-push av utvecklingsgrenen har verifierats.
- Officiella lovdatum, riktig personalplanering, delad lagring, åtkomstkontroll och Outlook/SharePoint-integration är senare beslut. Inga verkliga uppgifter ingår i denna etapp.
