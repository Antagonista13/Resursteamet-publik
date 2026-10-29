# Granskning av fyra tidspass, 2026-10-29

Gren: `utveckling/dashboard-demo-2026-10-29`.
De senaste remote-ändringarna hämtades och snabbspolades från `a44242f` till `466674b` utan att skriva över lokala ändringar. De tre nya commitsen lade till fyra tidspass, aktivitetsval och anpassade grundtestet.

## Slutresultat

Hela testsviten kördes om efter rättningen:

```sh
python3 -m unittest discover -s tests -v
```

**34 tester passerade på 53,8 sekunder: 28 webbläsartester och 6 Python-tester. Inga tester överhoppade.** Även `node --check dashboard.js`, syntaxkontroll av inline-JavaScript och `git diff --check` passerade.

Den först hämtade versionens befintliga 30 tester passerade också. Fyra nya regressionstester tillkom vid granskningen. En separat kodgranskare kontrollerade ändringen och godkände den utan ytterligare fel; granskaren körde inte hela sviten en andra gång.

## Personalplanering och aktiviteter

- Fem fiktiva medarbetare: A–E.
- Fyra separata tidspass: **08–10, 10–12, 12–14, 14–16**.
- Dagsvy: 20 aktivitetsval. Vardagsveckan: 100 aktivitetsval.
- Samtliga elva alternativ kontrollerades för alla dagskontroller: På plats, Inledande möte, Pedagogiskt möte, Uppföljningsmöte, Avslutande möte, Utskolning, Observation, Handledning, Privat, Annat och Frånvarande.
- Ändringar verifierades separat för alla 20 kombinationer av medarbetare och tidspass. Ett val påverkar inte andra personer, datum eller tidspass.
- Valen behålls mellan dag/vecka och datumnavigering. En annan dag börjar med egna standardvärden. Omladdning återställer de tillfälliga personalvalen.
- På vardagar är På plats standard. I dagsvyn för en helgdag är Frånvarande standard; detta läcker inte över till vardagsveckan.

## Fel som hittades och rättades

Kalenderns minutuppdatering ersatte alla personalens aktivitetskontroller i DOM, även när datum och vy var oförändrade. Det gjorde att tangentbordsfokus försvann mitt i ett aktivitetsval. Redan bekräftade värden låg kvar i minnet; felet gällde kontrollens fokus.

Ett nytt regressionstest reproducerade felet före rättningen. `renderStaff` återanvänder nu den befintliga vyn när samma rot, datum och vy redan har renderats. Ändrat datum eller dag-/veckovy renderas fortfarande på nytt, och omladdning återställer personalvalen. Fokusregressionen och hela sviten passerar efter rättningen.

## Visuell och responsiv granskning

| Vy | Storlek | Kontroller |
| --- | --- | --- |
| Mobil | 390 × 844 | Fyra läsbara tidspass per person i dagsvy; hela veckan nås genom vanlig vertikal scroll |
| Dator | 1440 × 900 | Alla fem personer och 20/100 aktivitetsval, inklusive långa val som Uppföljningsmöte |
| Full HD | 1920 × 1080 | Dashboard och personalplanering samt befintlig femdagars TV-visning |

Skärmbilder granskades från samtliga storlekar. Automatiska tester kontrollerar att personalvalen håller sig inom respektive personkort och att sidan saknar horisontell överbredd i dag- och veckovy. TV-panelernas placering och sidväxling under belastning ingår i den fullständiga sviten. Personalplaneringen döljs fortsatt i TV-läget enligt den godkända designen.

## Avgränsningar

Alla person-, ärende-, meny- och vädersvar i kontrollerna var testdata. Ingen SharePoint-, Outlook- eller produktionsintegration användes. Testerna kördes i Chromium/Playwright; fysisk mobil/TV, Safari och Firefox verifierades inte.

Endast utvecklingsgrenen ändrades. Ingen merge till main, produktionsdeploy, miljöpublicering eller körning av produktionsworkflow ingick. Den tidigare separata nedladdningsgrenen för förhandsgranskning ingick inte i denna kodgranskning och ändrades inte.
