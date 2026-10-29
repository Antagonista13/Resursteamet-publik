# Nästa version – gemensam planering och 4–6 veckors helhetsbild

Status: produktförslag för separat implementation, **inte livekopplad**. Använd bara syntetisk data i detta offentliga repo.

## Mål
Kollegor (fem personer) ska kunna lägga in och ändra sin egen planering från mobil/dator inom några klick. Alla med behörighet ska se samma uppdaterade kalender och en 4–6 veckors överblick. Ingen direkt Microsoft 365/SharePoint-anslutning ska krävas för demo.

## Vyer
- Standard: rullande sex kalenderveckor, föregående vecka + innevarande + fyra kommande veckor, måndag–söndag.
- Växla mellan 4, 5 och 6 veckor; föregående veckan ingår som standard, återstående veckor framåt.
- Veckokort med veckonummer, datumspann, aktiviteter uppdelade per dag, kompakt färgkodning och dagens markering.
- Filter medarbetare (alla eller en), typ av aktivitet, och ev. kalendertyp (egen/gemensam).
- Knapp "Ny aktivitet", klick på dag och snabbval person/datum/tidspass/aktivitet. Bekräfta sparad/ej sparad; stöd redigera och ta bort med tydliga rättigheter.
- Utöver sexveckorsvyn: behåll dagens, veckans och befintligt 1920×1080 TV-läge; nya vyer får inte orsaka horisontell scroll på mobil.

## Personalschema
- Fem personer; pass 08–10, 10–12, 12–14, 14–16.
- På plats standard; val: Inledande möte, Pedagogiskt möte, Uppföljningsmöte, Avslutande möte, Utskolning, Observation, Handledning, Privat, Annat, Frånvarande.
- Visa vem som är upptagen över veckorna, med färgkodning och legend. Snabbkopiering av tidigare veckas planering är en framtida förbättring.
- Skilj aktiviteter med exakta klockslag från passbaserad närvaro; definiera prioritet om båda finns.

## Arkitektur och säkerhet
- Nuvarande GitHub-repo är offentligt och frontend saknar autentisering. **Använd aldrig skarp planeringsdata, elevkoder eller personuppgifter här**.
- Gemensam lagring kräver autentiserad backend med användarkonton, databas, åtkomstkontroll och regler för vem som får läsa/redigera; `localStorage`/frontend-JSON är inte tillräckligt.
- Utvärdera först möjligheten till intern, godkänd datalagring som arbetsgivaren redan tillåter. Ingen 'kringgå IT'-lösning; en privat extern molntjänst är inte automatiskt lämplig för arbetsuppgifter.
- Demo kan implementeras nu med fiktiva medarbetare och minnes-/webbläsarlagring, klart märkt DEMO. Låtsas inte att delad synk fungerar förrän backend finns.
- Datakontrakt för test: `{id, staffId, date: YYYY-MM-DD, slot, activity, calendarType, updatedAt}`. För exakta möten: `startTime/endTime` separat, tillåtet intervall definieras.

## Godkännandekriterier
1. Standardvyn visar rätt antal veckor vid årsskifte; växla 4/5/6.
2. Fem personer och fyra pass per vardag; filtrering och snabbregistrering använder samma testdata.
3. Mobil 390x844, dator 1440x900, TV 1920x1080 utan horisontell överbredd. TV-läget oförändrat.
4. Testa överlapp, samtidiga redigeringar (vid backend), otillåtna ändringar, felaktiga datum, tidszon, tomt formulär och lagringsfel.
5. Dra inte in riktig SharePoint/Outlook-information i GitHub eller i publik testhosting.
6. Separat branch/PR, testkör och granska innan merge.

## Öppet beslut
Välj var den **behörighetsskyddade gemensamma databasen** får köras och om endast generell personalplanering (utan elev- eller mötesdetaljer) får registreras. Detta kräver verksamhetens godkännande före verklig användning.
