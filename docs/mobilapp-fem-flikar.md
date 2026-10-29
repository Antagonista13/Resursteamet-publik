# Resursteamet mobilapp – godkänd informationsstruktur, 2026-10-29

## Vision
Vid start: "Vad väntar mig och teamet idag?" Användaren ska utan scroll till ett separat kalenderverktyg förstå dagens viktigaste händelser och kunna ändra ett av sina fyra planeringspass med få tryck.

## Nedersta navigeringen – fem flikar (godkänd)
1. **Idag** – startskärm: datum, min dag 08–10/10–12/12–14/14–16, teamets status just nu, dagens gemensamma händelser.
2. **Planering** – välj datum, eget tidspass och aktivitet; ändra snabbt; överblick 4–6 veckor (standard föregående + aktuell + fyra framåt).
3. **Teamet** – vem är tillgänglig/upptagen/frånvarande, dags- och veckobemanning, filtrering per medarbetare.
4. **Kontakter** – viktiga kollegor, skolor och andra tjänstekontakter med ring-/mailgenvägar. Använd helt fiktiva kontaktuppgifter i offentlig demo.
5. **Mer** – inställningar, informationssidor, interna länkar, eventuellt väder/matsedel.

## Mobil UX
- Fast bottennavigering med tydlig aktiv flik, ikoner och svensk text. Telefonens safe-area respekteras.
- Idag är standard, visa min planering först, teamets läge sedan dagens gemensamma aktiviteter.
- Tydlig snabbåtgärd för att ändra eget pass, helst max 2–3 interaktioner före sparande.
- Tillgängliga klickytor, läsbar text, tydliga färg- och textetiketter, ingen information bara via färg.
- Välj eget konto vid riktig inloggning; tillåt inte att man ändrar en annan kollegas planering utan rättighet.
- Återanvänd befintliga dashboard- och TV-vyer utan regression.
- Om ingen delad backend finns: märk uttryckligen DEMO; inga påståenden om teamövergripande synk.

## Säkerhet och leverans
Offentligt GitHub-repo används **endast med syntetiska uppgifter**. Ingen elevdata, riktiga kalenderhändelser, arbetskontakter eller privata telefonnummer. Ingen verklig fleranvändardrift innan arbetsgivaren godkänt identitet, lagring och åtkomstregler. Implementera i utvecklingsgren, testa mobil 390×844, dator 1440×900 och TV 1920×1080. Main/produktion orörd tills uttryckligt godkännande.

## Status
Informationsarkitekturen och de fem flikarna är godkända av beställaren. Implementation och mobiltest återstår.
