# Förslag till PR: Responsiv testdashboard med personalplanering

Dashboarden får ett vanligt dator- och mobilläge ovanpå den befintliga informationstavlan. Dag/vecka, valt datum och två kalenderfilter återanvänder kalenderhanteringen. Fem fiktiva medarbetare kan planeras per dag; elevkoder, testplaceringar och uppdrag behålls med redigerbar uppdragsstatus.

Testkalendern använder separat lagring och importen validerar datum, tid, ID, dubbletter och storleksgränser. Den äldre kalenderlagringen lämnas kvar. Matsedelsskriptet kan läsa Matildas courses-format och behåller föregående fil vid fel. Lov är konfigurerbara och tydligt märkta testdata. TV-läge och dess sidväxling behålls.

Validering: 30 tester passerade i Python/Chromium, JavaScript-syntaxkontroller och git diff --check passerade. Mobil 390×844, dator 1440×900 och TV 1920×1080 har kontrollerats. Detaljer finns i docs/validation-2026-10-29.md.

SharePoint och Outlook är frånkopplade. JSON-export/åtkomst krävs för SharePoint-bedömning; MailboxNotEnabledForRESTAPI är inte löst här. Personal- och ärendedata är fiktiva, testlov är inte verifierade läsårstider. Inga produktionsfiler med matsedelsdata, produktionsworkflow eller miljöinställningar ändras. PR:n får inte mergas eller driftsättas utan godkännande.
