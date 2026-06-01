# Nikolaus Buchungssystem – Kolpingsfamilie Eichenau

**Status**: ✅ Produktiv  
**Live-URL**: [www.buchdennikolaus.de](https://www.buchdennikolaus.de)  
**Gestartet**: 2026-04-24  
**Produktiv seit**: 2026-05-xx  
**Projekt-Owner**: Kolpingsfamilie Eichenau  

---

## Übersicht

Das Nikolaus Buchungssystem ist eine vollständige Web-Applikation für die Kolpingsfamilie Eichenau zur Online-Buchung von Nikolaus-Hausbesuchen am 5. und 6. Dezember 2026. Das System wurde von einem Front-End-Prototyp zu einem produktionsreifen System mit Backend, Datenbank, E-Mail-Versand und gesichertem Admin-Dashboard weiterentwickelt.

---

## Projektstruktur

```
Project_K/
├── README.md                    # Projektübersicht (dieses Dokument)
├── TASKS_LOG.md                 # Aufgaben- und Änderungsprotokoll
├── CLINE_CONTEXT.md             # KI-Kontext für Cline
├── src/
│   ├── index.html               # Haupt-Applikation (alle Screens als SPA)
│   ├── app.js                   # Applikationslogik (JavaScript)
│   ├── styles.css               # Design-System (Kolping CI)
│   ├── images/
│   │   └── kolping-eichenau.jpg # Kolping Logo
│   └── documents/
│       └── nikolaus-formular.txt # Nikolaus-Formular (Basis für DOCX)
├── docs/
│   ├── KONZEPT_V2.md            # Technisches Konzept & Feature-Spezifikation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment-Anleitung (Vercel + Supabase)
│   ├── STAKEHOLDER_GUIDE.md     # Präsentation für Stakeholder
│   └── supabase_schema.sql      # Datenbankschema
├── supabase/
│   └── functions/
│       └── send-booking-email/  # Edge Function für E-Mail-Versand
├── deliverables/
│   └── Nikolaus-Booking-Prototype/ # Initialer Klick-Dummy (archiviert)
└── vercel.json                  # Vercel-Deployment-Konfiguration
```

---

## Technologie-Stack

| Komponente | Technologie | Details |
|---|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JS | Single Page Application (SPA) |
| Hosting | Vercel | Auto-Deploy via GitHub |
| Datenbank | Supabase (PostgreSQL) | `bookings` + `waitlist` Tabellen |
| Backend/API | Supabase Edge Functions (Deno) | E-Mail-Versand |
| Auth | Supabase Auth | Admin-Login (E-Mail + Passwort) |
| E-Mail | Gmail SMTP via Nodemailer | buchdennikolaus@gmail.com |
| Excel-Export | SheetJS (xlsx) | Formatierter Download im Admin |
| Domain | buchdennikolaus.de | Custom Domain auf Vercel |
| Repository | GitHub | buchdennikolaus/nikolaus-buchung |

---

## Features

### Öffentlicher Bereich (Buchungsflow)

1. **Startseite**
   - Kolping-Logo und Branding
   - Veranstaltungsinformationen (5. + 6. Dezember 2026, 17–20 Uhr)
   - Buchungsschluss-Hinweis (30.11.2026)
   - Kontakt-Footer

2. **Formular (Schritt 1)**
   - Kontaktdaten: Vorname, Nachname, Adresse, PLZ, Ort, Telefon, E-Mail
   - Anzahl Kinder (max. 9) mit automatischer Dauerberechnung
   - Hinweis für Großgruppen (≥10 Kinder per E-Mail)
   - Optionales Notizfeld

3. **Terminauswahl (Schritt 2)**
   - Anzeige verfügbarer Slots (20-Min-Intervalle, 17:00–20:00 Uhr)
   - Dauerbasierte Slot-Prüfung (1–3 Kinder = 20 min, 4–6 = 40 min, 7–9 = 60 min)
   - Sonderregel 20:00 Uhr: Buchbar unabhängig von Dauer
   - Doppelbuchungs-Sperre per E-Mail-Adresse
   - Warteliste wenn beide Tage ausgebucht

4. **Bestätigungsseite (Schritt 3)**
   - Zusammenfassung aller Buchungsdetails
   - Verbindliche Bestätigung

5. **Erfolgsseite**
   - Bestätigungsmeldung
   - Terminübersicht
   - Download-Button für Nikolaus-Formular (.docx)
   - Hinweis zur Rücksendung bis 01.12.2026

### Admin-Dashboard (`/#admin`)

- **Login**: Gesichert mit Supabase Auth (E-Mail + Passwort)
- **Buchungsübersicht**: Alle Buchungen in Echtzeit aus Supabase
- **Filterung**: Nach Datum (5.12 / 6.12 / alle)
- **Suche**: Volltextsuche nach Name und Adresse
- **Datenverwaltung pro Zeile**:
  - Team-Zuweisung (Team 1 / Team 2 / Team 3)
  - Word-Eingang abhaken (Checkbox)
  - Interne Notiz
  - Speichern-Button pro Zeile
- **Warteliste**: Separater Reiter mit allen Wartelisten-Einträgen
- **Excel-Export**: Formatierter Download aller Buchungen als `.xlsx`

### E-Mail-System

- Automatische Bestätigungs-E-Mail nach Buchung
- Absender: buchdennikolaus@gmail.com
- Inhalt: Termindetails, Download-Link für Formular, Hinweise
- Technologie: Gmail SMTP via Supabase Edge Function (Deno)

---

## Datenbankschema

### Tabelle `bookings`

| Spalte | Typ | Beschreibung |
|---|---|---|
| id | UUID | Primärschlüssel |
| first_name | TEXT | Vorname |
| last_name | TEXT | Nachname |
| address | TEXT | Straße + Hausnummer |
| zip | TEXT | Postleitzahl |
| city | TEXT | Ort |
| email | TEXT | E-Mail (unique) |
| phone | TEXT | Telefonnummer |
| booking_date | DATE | Buchungsdatum (2026-12-05 / 06) |
| start_time | TIME | Startzeit des Besuchs |
| duration_minutes | INT | Dauer in Minuten (20/40/60) |
| num_children | INT | Anzahl Kinder |
| notes | TEXT | Besondere Hinweise (optional) |
| team | TEXT | Zugewiesenes Team (Admin) |
| word_received | BOOL | Word-Formular eingegangen |
| admin_notes | TEXT | Interne Notizen (Admin) |
| created_at | TIMESTAMPTZ | Erstellungszeitpunkt |

### Tabelle `waitlist`

| Spalte | Typ | Beschreibung |
|---|---|---|
| id | UUID | Primärschlüssel |
| first_name | TEXT | Vorname |
| last_name | TEXT | Nachname |
| email | TEXT | E-Mail |
| phone | TEXT | Telefon |
| num_children | INT | Anzahl Kinder |
| preferred_date | TEXT | Gewünschter Tag |
| created_at | TIMESTAMPTZ | Anmeldezeitpunkt |

---

## Design-System (Kolping CI)

| Element | Wert |
|---|---|
| Primärfarbe | `#f05a00` (Orange) |
| Hover-Farbe | `#d94e00` |
| Text | `#2c2c2c` (Dunkelgrau) |
| Hintergrund | `#ffffff` (Weiß) |
| Schrift | System-Font-Stack (Sans-Serif) |
| Stil | Clean, minimal, professionell – kein Weihnachts-Kitsch |

---

## Deployment

### Voraussetzungen
- GitHub Account (Repository: `buchdennikolaus/nikolaus-buchung`)
- Vercel-Account (verbunden mit GitHub, Domain `buchdennikolaus.de`)
- Supabase-Projekt mit konfigurierten Tabellen + Edge Function
- Gmail App-Passwort für buchdennikolaus@gmail.com

### Auto-Deployment
Jeder Push auf den `main`-Branch in GitHub löst automatisch ein Deployment auf Vercel aus. Die Live-URL ist innerhalb von ~60 Sekunden aktualisiert.

### Umgebungsvariablen (Supabase Edge Function)
```
GMAIL_USER=buchdennikolaus@gmail.com
GMAIL_APP_PASSWORD=<app-passwort>
```

---

## Termine & Fristen (Betrieb 2026)

| Datum | Ereignis |
|---|---|
| ab sofort | Buchungen möglich |
| 30.11.2026 | **Buchungsschluss** (System deaktiviert Buchungen automatisch) |
| 01.12.2026 | Deadline für Word-Formular-Rücksendung |
| 05.12.2026 | Nikolaus-Besuch Tag 1 (17:00–20:00 Uhr) |
| 06.12.2026 | Nikolaus-Besuch Tag 2 (17:00–20:00 Uhr) |

---

## Administration

- **Admin-URL**: www.buchdennikolaus.de/#admin
- **Login**: buchdennikolaus@gmail.com
- **Passwort**: (separat mitgeteilt)

---

## Entwicklung

### Lokale Vorschau
```bash
# Repository klonen
git clone https://github.com/buchdennikolaus/nikolaus-buchung.git

# Ins src-Verzeichnis wechseln und index.html im Browser öffnen
# Für lokale Entwicklung: Live Server Extension in VS Code empfohlen
```

### Änderungen deployen
```bash
git add .
git commit -m "feat: beschreibung der änderung"
git push
# → Vercel deployed automatisch innerhalb von ~60 Sekunden
```

---

*Zuletzt aktualisiert: 2026-06-01*