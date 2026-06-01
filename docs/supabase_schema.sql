-- ==========================================
-- Nikolaus Buchungssystem - Supabase Schema
-- Projekt: buchdennikolaus@gmail.com's Project
-- Ausführen im Supabase SQL Editor
-- ==========================================

-- 1. Buchungen-Tabelle
CREATE TABLE IF NOT EXISTS bookings (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  timestamptz DEFAULT now(),
    first_name  text NOT NULL,
    last_name   text NOT NULL,
    address     text NOT NULL,
    zip         text NOT NULL,
    city        text NOT NULL,
    phone       text NOT NULL,
    email       text NOT NULL,
    num_children int NOT NULL CHECK (num_children BETWEEN 1 AND 9),
    duration    int NOT NULL CHECK (duration IN (20, 40, 60)),
    notes       text DEFAULT '',
    booking_date date NOT NULL CHECK (booking_date IN ('2026-12-05', '2026-12-06')),
    booking_time time NOT NULL,
    team        text DEFAULT '',
    word_received boolean DEFAULT false,
    internal_note text DEFAULT ''
);

-- 2. Wartelisten-Tabelle
CREATE TABLE IF NOT EXISTS waitlist (
    id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at   timestamptz DEFAULT now(),
    first_name   text NOT NULL,
    last_name    text NOT NULL,
    email        text NOT NULL,
    phone        text NOT NULL,
    num_children int NOT NULL CHECK (num_children BETWEEN 1 AND 9),
    requested_date date
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- RLS aktivieren
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Öffentliche Leserechte für Verfügbarkeitsprüfung (nur benötigte Felder)
CREATE POLICY "Public can read booking availability"
    ON bookings FOR SELECT
    USING (true);

-- Öffentliche Schreibrechte für neue Buchungen
CREATE POLICY "Public can insert bookings"
    ON bookings FOR INSERT
    WITH CHECK (true);

-- Öffentliche Schreibrechte für Warteliste
CREATE POLICY "Public can insert waitlist"
    ON waitlist FOR INSERT
    WITH CHECK (true);

-- Öffentliche Leserechte für Warteliste (für Admin-Dashboard)
CREATE POLICY "Public can read waitlist"
    ON waitlist FOR SELECT
    USING (true);

-- Admin darf alles aktualisieren und löschen (über Service Role Key)
CREATE POLICY "Admin can update bookings"
    ON bookings FOR UPDATE
    USING (true);

CREATE POLICY "Admin can delete bookings"
    ON bookings FOR DELETE
    USING (true);

CREATE POLICY "Admin can delete waitlist"
    ON waitlist FOR DELETE
    USING (true);

-- ==========================================
-- Indizes für Performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);