# Konzept V2: Nikolaus Buchungssystem

**Domain:** www.buchdennikolaus.de

Dieses Dokument beschreibt die Weiterentwicklung des Nikolaus-Buchungssystems von einem reinen Prototyp zu einer produktionsreifen Anwendung unter Berücksichtigung des Feedbacks vom 30.04.2026.

## 1. Architektur

- **Frontend:** Bestehender Click-Dummy (HTML, CSS, JS), gehostet auf **Vercel**.
- **Backend & Datenbank:** **Supabase** wird als "Backend-as-a-Service" genutzt. Es liefert die PostgreSQL-Datenbank, eine Auto-generierte API und ein Authentifizierungssystem.
- **E-Mail-Versand:** **Gmail SMTP** wird für den E-Mail-Versand verwendet (buchdennikolaus@gmail.com). 
  - SMTP-Server: `smtp.gmail.com`
  - Port: `587` (TLS)
  - Authentifizierung: Gmail App-Passwort
  - Limit: 500 E-Mails pro Tag (ausreichend für das Projekt)
  - Integration über Supabase Edge Functions
- **Domain:** www.buchdennikolaus.de (bereits registriert, wird mit Vercel verbunden)

## 2. Überarbeitete Features & Logik

### 2.1. Buchungslogik & Slot-Anzeige

1.  **Vereinfachte Slot-Anzeige:** Die Anzeige "begrenzt verfügbar" wird entfernt. Ein Termin-Slot ist entweder **"verfügbar"** (buchbar) oder **"ausgebucht"** (nicht buchbar).

2.  **Dauerabhängige Slot-Verfügbarkeit:**
    - Die Dauer des Besuchs wird basierend auf der Anzahl der Kinder berechnet (1-3: 20min, 4-6: 40min, 7-9: 60min).
    - Das System prüft, ob für die berechnete Dauer (z.B. 40 Min = 2 aufeinanderfolgende 20-Min-Slots) genügend zusammenhängende Zeit frei ist.
    - Ist ein für die Buchung notwendiger Folgetermin bereits belegt, wird der Starttermin als "ausgebucht" angezeigt.

3.  **Sonderregel 20:00 Uhr:** Der letzte buchbare Starttermin ist immer **20:00 Uhr**. Dieser Termin kann unabhängig von der Kinderanzahl (bis max. 9) und der daraus resultierenden Dauer (bis 60 Min.) gebucht werden, sofern er noch frei ist. Die Buchung kann also bis 21:00 Uhr andauern.

4.  **Buchungsschluss:** Buchungen sind nur **bis einschließlich 30.11.2026** möglich. Ab dem 01.12.2026 wird der Buchungs-Button deaktiviert und ein entsprechender Hinweis angezeigt.

### 2.2. Benutzerführung & Formular

1.  **Doppelbuchungs-Sperre:** Vor dem Speichern einer neuen Buchung prüft das System, ob die angegebene E-Mail-Adresse bereits eine Buchung getätigt hat. Falls ja, wird die Buchung abgelehnt und die Meldung *"Sie haben bereits eine Buchung durchgeführt. Es ist nur eine Buchung pro Familie möglich."* angezeigt.

2.  **Maximale Kinderanzahl:**
    - Das Eingabefeld für die Anzahl der Kinder ist auf **maximal 9** begrenzt.
    - Darunter wird ein Hinweistext platziert: *"Für Gruppen ab 10 Kindern (z.B. in Kindergärten) kontaktieren Sie uns bitte direkt per E-Mail."*

3.  **Validierung der Eingabefelder:**
    - `E-Mail`: Standard-HTML5-Validierung (`type="email"`) prüft auf ein gültiges Format (mit @-Zeichen).
    - `Telefonnummer`: Das Feld wird so konfiguriert, dass primär numerische Eingaben erwartet werden (`type="tel"`).

### 2.3. Wartelisten-Funktion

1.  **Angebot der Warteliste:** Die Wartelisten-Option wird **nur angezeigt, wenn an beiden Tagen (5. und 6. Dezember)** für die gewählte Kinderanzahl (und damit die Dauer) kein passender Termin mehr frei ist.
2.  **Prozess:**
    - Nachricht: *"Für die gewünschte Anzahl an Kindern sind leider keine Termine mehr verfügbar."*
    - Button: *"Auf die Warteliste setzen"*
    - Bei Klick werden die bereits eingegebenen Kontaktdaten in eine separate `waitlist`-Tabelle in der Datenbank gespeichert.
    - Erfolgsmeldung für den Nutzer: *"Sie wurden erfolgreich auf die Warteliste gesetzt."*

### 2.4. Word-Dokument Download

1.  **Download nach Buchung:** Nach erfolgreicher Buchungsbestätigung wird ein **Download-Button** für das Word-Dokument angezeigt.
2.  **Funktion:** 
    - Button: *"Nikolaus-Formular herunterladen"*
    - Das Word-Dokument wird als .docx-Datei heruntergeladen
    - Das Formular enthält Felder für Informationen über die Kinder (Name, Alter, Wünsche, etc.)
3.  **Hinweis:** Der Nutzer wird darauf hingewiesen, das ausgefüllte Dokument bis spätestens 01.12.2026 per E-Mail zurückzusenden.

### 2.5. Texte & Informationen

1.  **Hinweis Word-Dokument:** Auf der Start- und/oder Erfolgsseite wird ein gut sichtbarer Hinweis platziert: *"Wichtig: Bitte senden Sie uns das ausgefüllte Word-Dokument mit Informationen zu Ihren Kindern bis spätestens 01.12.2026 per E-Mail an: buchdennikolaus@gmail.com"*
2.  **Allgemeiner Kontakt:** Im Footer der Webseite wird ein genereller Kontakt-Hinweis hinzugefügt: *"Bei Fragen können Sie uns gerne unter folgender Email-Adresse kontaktieren: buchdennikolaus@gmail.com"*

## 3. Admin-Dashboard

1.  **Erweiterte Tabellenansicht:** Die Hauptansicht der Buchungen wird um die Spalten **"E-Mail-Adresse"** und **"Telefonnummer"** ergänzt.

2.  **Speichern-Button für Änderungen:** Wenn ein Admin Daten direkt in der Tabelle ändert (z.B. Notizen, Team-Zuweisung), wird die Zeile als "geändert" markiert und ein **"Speichern"-Button** erscheint für diese Zeile. Erst durch Klick auf diesen Button werden die Änderungen in die Datenbank geschrieben.

3.  **Wartelisten-Ansicht:**
    - Das Admin-Dashboard erhält einen neuen Reiter oder eine separate Sektion namens **"Warteliste"**.
    - Diese Ansicht zeigt alle Einträge aus der `waitlist`-Tabelle übersichtlich an (Name, Kontaktdaten, Kinderanzahl, gewünschtes Datum).
    - **Zeitstempel:** Jeder Wartelisten-Eintrag enthält einen Zeitstempel, der anzeigt, wann sich die Person auf die Warteliste gesetzt hat (Format: TT.MM.JJJJ, HH:MM).

4.  **Download-Funktion:**
    - Ein "Download (Excel)"-Button ermöglicht es Admins, die Buchungsdaten zu exportieren (in der finalen Version als Excel-Datei).
    - Der Button ist in der Steuerleiste des Admin-Dashboards prominent platziert.
