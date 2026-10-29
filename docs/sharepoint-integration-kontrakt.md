# SharePoint-koppling – integrationskontrakt (endast testdata)

Status: **Ej ansluten**. Offentligt GitHub-repo – inga skarpa elev-, personal- eller kalenderuppgifter, token, autentiseringscookies eller interna dokumentlänkar får checkas in.

## Befintlig arbetsmiljö

Användarens SharePoint-webbplats heter `Resursteamet`. Befintliga listor beskrivs som **Personalplanering**, **Elevunderlag** och **Uppdrag**. Rapporterade personalplaneringsfält: `Personal`, `Datum`, `Tidspass`, `Aktivitet` (möjligen Choice med `Value`). Exakta interna kolumnnamn och rättigheter ska valideras i en behörig session innan integration.

## Föreslagen säker dataväg

1. Separat autentiserad intern app/Power Apps läser SharePoint-listorna med organisationens tillåtna anslutning. Ingen åtkomstnyckel eller intern åtkomsttoken får byggas in i `index.html`.
2. För intern, behörighetsstyrd dashboard används en skyddad backend/listkoppling som visar endast nödvändiga uppgifter, helst fritextfri personalstatus. Den offentliga demoappen fortsätter med *enbart fiktiva data*.
3. Om säker liveanslutning inte är möjlig: använd en manuell, uttryckligen granskad **helt syntetisk** JSON-fil för att testa schema, inte ett publicerat exportflöde för riktiga data.
4. Automatisk synk från Outlook är **inte genomförd**; `MailboxNotEnabledForRESTAPI` behöver separat lösning i Borås Stads Exchange-miljö.

## Mappning för personalplanering (utkast)

| SharePoint-logik | Demo / internt format | Kommentar |
|---|---|---|
| Personal | `staffId` | använd anonym testkod i demo |
| Datum | `date` (YYYY-MM-DD, lokal dag) | verifiera datum/tidszon |
| Tidspass | `slot`: `08–10`, `10–12`, `12–14`, `14–16` | verifiera befintliga val |
| Aktivitet | `activity` | standard `På plats` vid tomt värde; validera Choices |
| SharePoint-ID | `sourceId` | internt, för uppdatering och dubbletter |

Exempel (helt påhittade uppgifter):

```json
{
  "schemaVersion": 1,
  "demo": true,
  "staffPlanning": [
    {"sourceId": 1, "staffId": "staff-a", "date": "2026-11-02", "slot": "08–10", "activity": "På plats"},
    {"sourceId": 2, "staffId": "staff-b", "date": "2026-11-02", "slot": "10–12", "activity": "Handledning"}
  ]
}
```

## Kontrollpunkter innan skarp koppling

- Verifiera lista, namn på interna fält, datatyper och delegationsbegränsningar i Power Apps.
- Säkerställ åtkomstkontroll, sekretessklassning, dataminimering och loggning enligt arbetsgivarens regler.
- Bestäm om personalens ändringar ska skrivas tillbaka till SharePoint, vem som får ändra och hur konflikter hanteras.
- Testa uppdatering utan sidomladdning och händelser när nätverk saknas. Separera redigeringsvyn från informations-TV och visa inte känsliga elevuppgifter på offentlig demo.
- Kör regressionstester före merge. Publicera inte till main utan godkännande.
