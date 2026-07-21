# Konzept V2: Nikolaus Buchungssystem

**Domain:** www.buchdennikolaus.de  
**Status:** ✅ Vollständig implementiert und produktiv  
**Letzte Aktualisierung:** 2026-07-21

> Dieses Dokument beschreibt das implementierte Nikolaus-Buchungssystem. Es wurde ausgehend vom Planungsdokument (April 2026) fortlaufend ergänzt und spiegelt den aktuellen Funktionsumfang wider.

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

1.  **Vereinfachte Slot-Anzeige:** Ein Termin-Slot ist entweder **"verfügbar"** (buchbar) oder **"ausgebucht"** (nicht buchbar).

2.  **Dauerabhängige Slot-Verfügbarkeit:**
    - Die Dauer des Besuchs wird basierend auf der Anzahl der Kinder berechnet (1-3: 20min, 4-6: 40min, 7-9: 60min).
    - Das System prüft, ob für die berechnete Dauer (z.B. 40 Min = 2 aufeinanderfolgende 20-Min-Slots) genügend zusammenhängende Zeit frei ist.
    - Ist ein für die Buchung notwendiger Folgetermin bereits belegt, wird der Starttermin als "ausgebucht" angezeigt.

3.  **3-Team-Kapazität:** Ein Slot gilt erst als ausgebucht, wenn **alle 3 Teams** für diesen Zeitpunkt gleichzeitig belegt sind. Das ermöglicht bis zu 3 parallele Buchungen pro Slot.

4.  **Sonderregel 20:00 Uhr:** Der letzte buchbare Starttermin ist immer **20:00 Uhr**. Dieser Termin kann unabhängig von der Kinderanzahl (bis max. 9) und der daraus resultierenden Dauer (bis 60 Min.) gebucht werden. Die Buchung kann also bis 21:00 Uhr andauern.

5.  **Buchungsschluss:** Buchungen sind nur **bis einschließlich 30.11.2026** möglich. Ab dem 01.12.2026 wird der Buchungs-Button deaktiviert und ein entsprechender Hinweis angezeigt.

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

**Login:** `www.buchdennikolaus.de/#admin` – gesichert mit Supabase Auth (E-Mail + Passwort).  
**Login-Daten:** buchdennikolaus@gmail.com, Passwort über Supabase Dashboard verwaltbar (siehe DEPLOYMENT_GUIDE.md).

### Tabs

1.  **Tab „Übersicht"** (Standard):
    - Statistik-Kacheln: Buchungen gesamt, Kinder gesamt, Buchungen pro Tag, freie Team-Slots
    - Slot-Ansicht: beide Tage (5. + 6. Dez) nebeneinander mit allen 20-Min-Zeitblöcken
    - Gebuchte Slots: Name, Kinderanzahl, Dauer + **Team-Dropdown direkt in der Karte**
    - Team-Dropdown mit **Konflikt-Anzeige**: belegte Teams werden grau + `✗ belegt` markiert
    - **Auto-Save**: Team-Änderung wird sofort in Supabase gespeichert

2.  **Tab „Buchungen"**: Tabellarische Vollansicht aller Buchungen
    - Filterung nach Datum, Team-Filter, Volltextsuche
    - Team-Zuweisung, Word-Eingang, Interne Notizen pro Zeile
    - **Team-Konflikt-Warnung**: Wenn zwei Buchungen im selben Slot dem gleichen Team zugewiesen sind, erscheint eine rote Warnung inline
    - Speichern-Button pro Zeile (für Notizen und Checkbox)
    - Spaltenbreiten per Drag & Drop anpassbar

3.  **Tab „Warteliste"**: Alle Wartelisten-Einträge (Name, Kontakt, Kinderanzahl, gewünschtes Datum, Zeitstempel)

4.  **Excel-Export**: Formatierter Download aller Buchungen als `.xlsx` via SheetJS

## 4. E-Mail-System

- **Bestätigungs-E-Mail** an Buchenden: Termindetails, besondere Hinweise (falls angegeben), Download-Link für Formular, Hinweis zum digitalen Ausfüllen
- **Admin-Benachrichtigung** bei jeder neuen Buchung: alle Buchungsdetails inkl. Hinweise
- Absender: buchdennikolaus@gmail.com (Gmail SMTP via Supabase Edge Function)
