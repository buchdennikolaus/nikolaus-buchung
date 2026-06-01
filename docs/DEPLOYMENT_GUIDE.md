# Deployment-Anleitung: Nikolaus Buchungssystem

## Voraussetzungen
- [x] Supabase-Account: buchdennikolaus@gmail.com's Project
- [x] Vercel-Account
- [x] Gmail App-Passwort erstellt
- [x] Domain: www.buchdennikolaus.de

---

## Schritt 1: Supabase Datenbank einrichten

1. Gehen Sie zu [supabase.com](https://supabase.com) → Ihr Projekt
2. Klicken Sie auf **SQL Editor** (linke Seitenleiste)
3. Klicken Sie auf **New query**
4. Kopieren Sie den Inhalt von `docs/supabase_schema.sql` und fügen Sie ihn ein
5. Klicken Sie auf **Run** (grüner Button)
6. ✅ Fertig – Tabellen `bookings` und `waitlist` sind erstellt

---

## Schritt 2: Supabase CLI installieren & einloggen

```bash
# Supabase CLI installieren (einmalig)
npm install -g supabase

# Bei Supabase einloggen
supabase login

# Projekt verlinken (im Projektordner ausführen)
supabase link --project-ref ggxvvzhtwmklkpeflopv
```

---

## Schritt 3: Gmail Secrets in Supabase speichern

```bash
# Gmail-Zugangsdaten als sichere Secrets speichern
supabase secrets set GMAIL_USER=buchdennikolaus@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=<Ihr-16-stelliges-App-Passwort>
```

> ⚠️ Das App-Passwort niemals in Code oder Git committen!

---

## Schritt 4: Edge Function deployen

```bash
# E-Mail-Funktion auf Supabase deployen
supabase functions deploy send-booking-email
```

**Testen der Funktion:**
```bash
supabase functions serve send-booking-email
```

---

## Schritt 5: Vercel Deployment

### Option A: Über Vercel Dashboard (empfohlen)
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf **Add New Project**
3. Verbinden Sie Ihr GitHub-Repository
4. Vercel erkennt die `vercel.json` automatisch
5. Klicken Sie auf **Deploy**

### Option B: Über Vercel CLI
```bash
# Vercel CLI installieren
npm install -g vercel

# Deployen
vercel

# Für Produktion
vercel --prod
```

---

## Schritt 6: Domain verbinden

1. Vercel Dashboard → Ihr Projekt → **Settings** → **Domains**
2. Domain eingeben: `www.buchdennikolaus.de`
3. Vercel zeigt DNS-Einträge an – diese bei Ihrem Domain-Anbieter eintragen:
   - **CNAME**: `www` → `cname.vercel-dns.com`
   - (oder die angezeigten A-Records)
4. Warten Sie 5-30 Minuten auf DNS-Propagierung

---

## Schritt 7: Word-Dokument austauschen

Wenn Sie das echte Word-Dokument haben:
1. Speichern Sie die `.docx`-Datei als `src/documents/nikolaus-formular.docx`
2. Aktualisieren Sie `src/app.js`, Zeile ~287:
   ```javascript
   link.href = 'documents/nikolaus-formular.docx';
   link.download = 'Nikolaus-Formular-Kolping.docx';
   ```
3. Neu deployen: `vercel --prod`

---

## Schritt 8: Testen

1. Öffnen Sie `www.buchdennikolaus.de`
2. Führen Sie eine Test-Buchung durch
3. Prüfen Sie, ob Sie eine Bestätigungs-E-Mail erhalten
4. Prüfen Sie das Admin-Dashboard: `www.buchdennikolaus.de#admin`
5. Löschen Sie die Test-Buchung in Supabase → prüfen Sie, ob der Slot wieder verfügbar ist

---

## Admin-Zugang

URL: `www.buchdennikolaus.de#admin`

> ⚠️ In der aktuellen Version ist das Admin-Dashboard öffentlich zugänglich.
> Teilen Sie diese URL nur intern. Für einen echten Passwortschutz kann 
> später eine einfache HTTP-Basic-Auth in Vercel eingerichtet werden.

---

## Zusammenfassung der Dienste

| Dienst | Zweck | Kosten |
|--------|-------|--------|
| Supabase | Datenbank + Edge Functions | Kostenlos (Free Tier) |
| Vercel | Hosting | Kostenlos (Hobby Plan) |
| Gmail SMTP | E-Mail-Versand | Kostenlos |

---

## Projektstruktur

```
Project_K/
├── src/
│   ├── index.html          # Hauptseite
│   ├── styles.css          # Styles
│   ├── app.js              # JavaScript + Supabase-Integration
│   └── documents/
│       └── nikolaus-formular.txt  # ← Durch echte .docx ersetzen!
├── supabase/
│   └── functions/
│       └── send-booking-email/
│           └── index.ts    # E-Mail Edge Function
├── docs/
│   ├── supabase_schema.sql # Datenbank-Schema
│   ├── KONZEPT_V2.md       # Konzeptdokument
│   └── DEPLOYMENT_GUIDE.md # Diese Anleitung
├── vercel.json             # Vercel-Konfiguration
└── .gitignore              # Git-Ausschlüsse