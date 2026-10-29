# Resursteamet mobilapp – godkänd informationsstruktur, 2026-10-29

## Vision
Vid start visas en varm vardagsöversikt: **väder och matsedel överst**, följt av **vilka elever som är på plats idag och under veckan**, sedan **personalens åtaganden och dagens gemensamma händelser**. Planering ska gå att ändra med få tryck.

## Nedersta navigeringen – fem flikar (godkänd)
1. **Idag** – datum och hälsning, väder/matsedel överst, elevnärvaro idag/vecka, personalens åtaganden och dagens gemensamma händelser. Kort för min dag med fyra tidspass.
2. **Planering** – välj datum, eget tidspass och aktivitet; ändra snabbt; överblick 4–6 veckor (standard föregående + aktuell + fyra framåt).
3. **Teamet** – vem är tillgänglig/upptagen/frånvarande, dags- och veckobemanning, filtrering per medarbetare.
4. **Kontakter** – viktiga kollegor, skolor och andra tjänstekontakter med ring-/mailgenvägar. Använd helt fiktiva kontaktuppgifter i offentlig demo.
5. **Mer** – inställningar, informationssidor, interna länkar, övriga inställningar (väder och matsedel ligger redan på Idag).

## Mobil UX
- Fast bottennavigering med tydlig aktiv flik, ikoner och svensk text. Telefonens safe-area respekteras.
- Idag är standard. Prioritet i denna ordning: (1) kompakt väder och matsedel överst, (2) elevnärvaro i dag och veckan med växling, (3) personalens åtaganden och egen planering, (4) gemensamma händelser. Håll korten mobilvänliga.
- Elevöversikt får inte visas med verkliga elevnamn, identifierbara initialkombinationer eller placeringar i offentlig demo. För skarp drift krävs behörighetsstyrd arbetsmiljö, dataminimering och skyddad visning på delad TV; generella summeringar kan vara lämpligare där.
- Tydlig snabbåtgärd för att ändra eget pass, helst max 2–3 interaktioner före sparande.
- Tillgängliga klickytor, läsbar text, tydliga färg- och textetiketter, ingen information bara via färg.
- Välj eget konto vid riktig inloggning; tillåt inte att man ändrar en annan kollegas planering utan rättighet.
- Återanvänd befintliga dashboard- och TV-vyer utan regression.
- Om ingen delad backend finns: märk uttryckligen DEMO; inga påståenden om teamövergripande synk.

## Säkerhet och leverans
Offentligt GitHub-repo används **endast med syntetiska uppgifter**. Ingen elevdata, riktiga kalenderhändelser, arbetskontakter eller privata telefonnummer. Ingen verklig fleranvändardrift innan arbetsgivaren godkänt identitet, lagring och åtkomstregler. Implementera i utvecklingsgren, testa mobil 390×844, dator 1440×900 och TV 1920×1080. Main/produktion orörd tills uttryckligt godkännande.

## Status
Informationsarkitekturen och de fem flikarna är godkända av beställaren. Implementation och mobiltest återstår.
