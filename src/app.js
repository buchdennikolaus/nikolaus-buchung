// ==========================================
// Nikolaus Booking System - Supabase Integration
// ==========================================

const SUPABASE_URL = 'https://ggxvvzhtwmklkpeflopv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneHZ2emh0d21rbGtwZWZsb3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTk4MTIsImV4cCI6MjA5NTg3NTgxMn0.j4PYHOnBK65jKBGIngpgwjXc4IAXl7mF78BkF4KneyY';

// Supabase client (loaded via CDN in index.html)
// Named 'db' to avoid conflict with window.supabase global
let db;

const app = {
    state: {
        currentScreen: 'landing',
        bookingData: {
            firstName: '', lastName: '', address: '', zip: '', city: '',
            phone: '', email: '', numChildren: 0, duration: 0, notes: '',
            selectedDate: '2026-12-05', selectedTime: ''
        },
        currentDateTab: 0,
        // Cache der Buchungen für die Slot-Anzeige
        bookingsCache: { '2026-12-05': [], '2026-12-06': [] },
    },

    // ==========================================
    // INIT
    // ==========================================
    async init() {
        // Supabase initialisieren
        db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        // Buchungsschluss prüfen
        const bookingDeadline = new Date('2026-12-01T00:00:00');
        if (new Date() >= bookingDeadline) {
            const bookingButton = document.querySelector('#screen-landing .btn-primary');
            if (bookingButton) {
                bookingButton.textContent = 'Buchungszeitraum beendet';
                bookingButton.disabled = true;
                bookingButton.style.backgroundColor = 'var(--medium-grey)';
            }
        }

        // Admin-Zugang via URL-Hash (mit Auth-Check)
        if (window.location.hash === '#admin') {
            await this.checkAdminAuth();
        }

        window.addEventListener('hashchange', async () => {
            if (window.location.hash === '#admin') {
                await this.checkAdminAuth();
            } else if (!window.location.hash) {
                this.navigateTo('landing');
            }
        });
    },

    // ==========================================
    // NAVIGATION
    // ==========================================
    navigateTo(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`screen-${screenName}`);
        if (target) {
            target.classList.add('active');
            this.state.currentScreen = screenName;
            if (screenName === 'slots') {
                this.loadAndRenderSlots();
                this.updateBookingSummary();
            } else if (screenName === 'confirm') {
                this.populateConfirmation();
            } else if (screenName === 'success') {
                this.populateSuccess();
            } else if (screenName === 'admin') {
                this.loadAdminData();
            }
            window.scrollTo(0, 0);
        }
    },

    // ==========================================
    // SUPABASE: Buchungen laden
    // ==========================================
    async loadBookingsForDate(date) {
        const { data, error } = await db
            .from('bookings')
            .select('booking_date, booking_time, duration')
            .eq('booking_date', date);

        if (error) {
            console.error('Fehler beim Laden der Buchungen:', error);
            return [];
        }
        return data || [];
    },

    async loadAllBookingsForAdmin() {
        const { data, error } = await db
            .from('bookings')
            .select('*')
            .order('booking_date', { ascending: true })
            .order('booking_time', { ascending: true });

        if (error) {
            console.error('Fehler beim Laden der Admin-Buchungen:', error);
            return [];
        }
        return data || [];
    },

    async loadWaitlistForAdmin() {
        const { data, error } = await db
            .from('waitlist')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Fehler beim Laden der Warteliste:', error);
            return [];
        }
        return data || [];
    },

    // ==========================================
    // FORMULAR
    // ==========================================
    calculateDuration() {
        const numChildren = parseInt(document.getElementById('numChildren').value) || 0;
        let duration = 0;
        if (numChildren >= 1 && numChildren <= 3) duration = 20;
        else if (numChildren >= 4 && numChildren <= 6) duration = 40;
        else if (numChildren >= 7 && numChildren <= 9) duration = 60;

        this.state.bookingData.numChildren = numChildren;
        this.state.bookingData.duration = duration;

        const durationDisplay = document.getElementById('duration-display');
        const durationValue = document.getElementById('duration-value');
        if (duration > 0) {
            durationValue.textContent = `${duration} Minuten`;
            durationDisplay.style.display = 'block';
        } else {
            durationDisplay.style.display = 'none';
        }
    },

    async submitForm(event) {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();

        this.showLoading(true, 'Prüfe Daten...');

        // Doppelbuchungs-Prüfung in Supabase
        const { data, error } = await db
            .from('bookings')
            .select('id')
            .eq('email', email)
            .limit(1);

        this.showLoading(false);

        if (error) {
            this.showModal('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            return;
        }
        if (data && data.length > 0) {
            this.showModal('Sie haben bereits eine Buchung durchgeführt. Es ist nur eine Buchung pro Familie möglich.');
            return;
        }

        // Daten speichern
        this.state.bookingData.firstName = document.getElementById('firstName').value.trim();
        this.state.bookingData.lastName = document.getElementById('lastName').value.trim();
        this.state.bookingData.address = document.getElementById('address').value.trim();
        this.state.bookingData.zip = document.getElementById('zip').value.trim();
        this.state.bookingData.city = document.getElementById('city').value.trim();
        this.state.bookingData.phone = document.getElementById('phone').value.trim();
        this.state.bookingData.email = email;
        this.state.bookingData.notes = document.getElementById('notes').value.trim();

        this.navigateTo('slots');
    },

    // ==========================================
    // SLOT-ANZEIGE
    // ==========================================
    generateTimeSlots() {
        const slots = [];
        for (let hour = 17; hour < 20; hour++) {
            for (let min = 0; min < 60; min += 20) {
                slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
            }
        }
        slots.push('20:00');
        return slots;
    },

    isSlotBooked(bookings, date, time, duration) {
        const requiredSlots = duration / 20;
        for (let i = 0; i < requiredSlots; i++) {
            const checkTime = new Date(`${date}T${time}`);
            checkTime.setMinutes(checkTime.getMinutes() + i * 20);
            const timeStr = `${checkTime.getHours().toString().padStart(2, '0')}:${checkTime.getMinutes().toString().padStart(2, '0')}`;

            const conflict = bookings.some(b => {
                const bStart = new Date(`${date}T${b.booking_time}`);
                const bEnd = new Date(bStart.getTime() + b.duration * 60000);
                const slotStart = new Date(`${date}T${timeStr}`);
                return slotStart >= bStart && slotStart < bEnd;
            });
            if (conflict) return true;
        }
        return false;
    },

    hasAvailableSlotsOnDate(bookings, date, duration) {
        const slots = this.generateTimeSlots();
        return slots.some(time => !this.isSlotBooked(bookings, date, time, duration));
    },

    async loadAndRenderSlots() {
        const container = document.getElementById('slots-container');
        const waitlistContainer = document.getElementById('waitlist-container');
        container.innerHTML = '<p style="padding:16px;color:var(--medium-grey)">Lade Termine...</p>';
        waitlistContainer.style.display = 'none';

        const date = this.state.bookingData.selectedDate;
        const duration = this.state.bookingData.duration;

        // Buchungen für BEIDE Tage laden (für Wartelisten-Check)
        const [bookingsDay1, bookingsDay2] = await Promise.all([
            this.loadBookingsForDate('2026-12-05'),
            this.loadBookingsForDate('2026-12-06'),
        ]);

        this.state.bookingsCache['2026-12-05'] = bookingsDay1;
        this.state.bookingsCache['2026-12-06'] = bookingsDay2;

        const availableDay1 = this.hasAvailableSlotsOnDate(bookingsDay1, '2026-12-05', duration);
        const availableDay2 = this.hasAvailableSlotsOnDate(bookingsDay2, '2026-12-06', duration);
        const bothDaysFull = !availableDay1 && !availableDay2;

        if (bothDaysFull) {
            // Warteliste anzeigen wenn BEIDE Tage voll
            container.innerHTML = '';
            container.style.display = 'none';
            waitlistContainer.style.display = 'block';
            return;
        }

        // Slots für aktuell gewählten Tag rendern
        this.renderSlotsForDate(date);
    },

    renderSlotsForDate(date) {
        const container = document.getElementById('slots-container');
        container.innerHTML = '';
        container.style.display = 'grid';

        const bookings = this.state.bookingsCache[date] || [];
        const duration = this.state.bookingData.duration;
        const slots = this.generateTimeSlots();

        slots.forEach(time => {
            const isBooked = this.isSlotBooked(bookings, date, time, duration);
            const button = document.createElement('button');
            button.className = 'slot-btn';

            if (!isBooked) {
                button.onclick = () => this.selectSlot(date, time);
                button.innerHTML = `<span class="slot-time">${time}</span><span class="slot-status">Verfügbar</span>`;
            } else {
                button.classList.add('full');
                button.disabled = true;
                button.innerHTML = `<span class="slot-time">${time}</span><span class="slot-status">Ausgebucht</span>`;
            }

            if (this.state.bookingData.selectedTime === time && this.state.bookingData.selectedDate === date) {
                button.classList.add('selected');
            }
            container.appendChild(button);
        });
    },

    async switchDate(dateIndex) {
        this.state.currentDateTab = dateIndex;
        this.state.bookingData.selectedDate = dateIndex === 0 ? '2026-12-05' : '2026-12-06';

        document.querySelectorAll('#screen-slots .date-tabs .tab-btn').forEach((btn, index) => {
            btn.classList.toggle('active', index === dateIndex);
        });

        // Slots aus Cache rendern (bereits geladen)
        this.renderSlotsForDate(this.state.bookingData.selectedDate);
    },

    selectSlot(date, time) {
        this.state.bookingData.selectedDate = date;
        this.state.bookingData.selectedTime = time;
        this.renderSlotsForDate(date);
        setTimeout(() => this.navigateTo('confirm'), 300);
    },

    updateBookingSummary() {
        const { firstName, lastName, numChildren, duration } = this.state.bookingData;
        document.getElementById('summary-name').textContent = `${firstName} ${lastName}`;
        document.getElementById('summary-children').textContent = numChildren;
        document.getElementById('summary-duration').textContent = duration;
    },

    // ==========================================
    // BUCHUNG BESTÄTIGEN
    // ==========================================
    populateConfirmation() {
        const data = this.state.bookingData;
        document.getElementById('confirm-name').textContent = `${data.firstName} ${data.lastName}`;
        document.getElementById('confirm-address').textContent = `${data.address}, ${data.zip} ${data.city}`;
        document.getElementById('confirm-contact').textContent = `Tel: ${data.phone} · E-Mail: ${data.email}`;

        const dateObj = new Date(data.selectedDate + 'T00:00:00');
        document.getElementById('confirm-date-day').textContent = dateObj.getDate() + '.';
        document.getElementById('confirm-date-month').textContent = dateObj.toLocaleDateString('de-DE', { month: 'long' });
        document.getElementById('confirm-time').textContent = data.selectedTime + ' Uhr';
        document.getElementById('confirm-duration').textContent = `${data.numChildren} Kinder · ${data.duration} Minuten`;

        const notesSection = document.getElementById('confirm-notes-section');
        if (data.notes) {
            document.getElementById('confirm-notes').textContent = data.notes;
            notesSection.style.display = 'block';
        } else {
            notesSection.style.display = 'none';
        }
    },

    async confirmBooking() {
        const data = this.state.bookingData;
        this.showLoading(true, 'Buchung wird gespeichert...');

        const bookingPayload = {
            first_name: data.firstName,
            last_name: data.lastName,
            address: data.address,
            zip: data.zip,
            city: data.city,
            phone: data.phone,
            email: data.email,
            num_children: data.numChildren,
            duration: data.duration,
            notes: data.notes,
            booking_date: data.selectedDate,
            booking_time: data.selectedTime,
            team: '',
            word_received: false,
            internal_note: ''
        };

        const { error } = await db.from('bookings').insert(bookingPayload);

        if (error) {
            this.showLoading(false);
            console.error('Buchungsfehler:', error);
            this.showModal('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per E-Mail.');
            return;
        }

        // E-Mail-Bestätigung via Edge Function senden (Fehler hier stoppen die Buchung nicht)
        try {
            this.showLoading(true, 'Bestätigungs-E-Mail wird gesendet...');
            await db.functions.invoke('send-booking-email', {
                body: { booking: bookingPayload }
            });
        } catch (emailErr) {
            console.warn('E-Mail konnte nicht gesendet werden:', emailErr);
            // Buchung trotzdem als erfolgreich anzeigen
        }

        this.showLoading(false);
        this.navigateTo('success');
    },

    // ==========================================
    // WARTELISTE
    // ==========================================
    async addToWaitlist() {
        const data = this.state.bookingData;
        this.showLoading(true, 'Wird gespeichert...');

        const { error } = await db.from('waitlist').insert({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            num_children: data.numChildren,
            requested_date: null // Beide Tage voll, daher kein spezifisches Datum
        });

        this.showLoading(false);

        if (error) {
            console.error('Wartelisten-Fehler:', error);
            this.showModal('Ein Fehler ist aufgetreten. Bitte kontaktieren Sie uns per E-Mail.');
            return;
        }

        // selectedTime leer lassen = Wartelisten-Erfolg
        this.state.bookingData.selectedTime = '';
        this.navigateTo('success');
    },

    // ==========================================
    // ERFOLGSSEITE
    // ==========================================
    populateSuccess() {
        const messageText = document.getElementById('success-message-text');
        const bookingDetails = document.getElementById('success-details-booking');
        const downloadSection = document.getElementById('success-download-section');
        const heading = document.querySelector('#screen-success h1');

        if (this.state.bookingData.selectedTime) {
            // Echte Buchung
            heading.textContent = 'Buchung bestätigt!';
            messageText.innerHTML = 'Vielen Dank für Ihre Buchung. Sie erhalten in Kürze eine Bestätigungs-E-Mail.';
            bookingDetails.style.display = 'block';
            if (downloadSection) downloadSection.style.display = 'block';

            const data = this.state.bookingData;
            const dateObj = new Date(data.selectedDate + 'T00:00:00');
            document.getElementById('success-date').textContent =
                dateObj.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('success-time').textContent = data.selectedTime + ' Uhr';
        } else {
            // Warteliste
            heading.textContent = 'Erfolgreich auf Warteliste gesetzt';
            messageText.innerHTML = 'Wir haben Ihre Anfrage erhalten und melden uns, falls ein Termin frei wird.';
            bookingDetails.style.display = 'none';
            if (downloadSection) downloadSection.style.display = 'none';
        }
    },

    // ==========================================
    // WORD-DOKUMENT DOWNLOAD
    // ==========================================
    downloadFormular() {
        const link = document.createElement('a');
        link.href = 'documents/nikolaus-formular.docx';
        link.download = 'Nikolaus-Formular-Kolpingsfamilie-Eichenau.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // ==========================================
    // ADMIN AUTH
    // ==========================================
    async checkAdminAuth() {
        const { data: { session } } = await db.auth.getSession();
        if (session) {
            this.navigateTo('admin');
        } else {
            this.navigateTo('admin-login');
        }
    },

    async adminLogin(event) {
        event.preventDefault();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('admin-password').value;
        const loginBtn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');

        loginBtn.disabled = true;
        loginBtn.textContent = 'Wird eingeloggt...';
        errorDiv.style.display = 'none';

        const { error } = await db.auth.signInWithPassword({ email, password });

        if (error) {
            errorDiv.textContent = 'Falsches Passwort oder E-Mail. Bitte erneut versuchen.';
            errorDiv.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Einloggen';
            return;
        }

        this.navigateTo('admin');
    },

    async adminLogout() {
        await db.auth.signOut();
        window.location.hash = '';
        this.navigateTo('landing');
    },

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================
    async loadAdminData() {
        this.renderAdminTableLoading();
        const [bookings, waitlist] = await Promise.all([
            this.loadAllBookingsForAdmin(),
            this.loadWaitlistForAdmin()
        ]);
        this.state.adminBookings = bookings;
        this.state.adminWaitlist = waitlist;
        this.renderAdminTable();
        this.renderWaitlistTable();
    },

    renderAdminTableLoading() {
        const tbody = document.getElementById('admin-table-body');
        if (tbody) tbody.innerHTML = '<tr><td colspan="12" style="padding:16px;text-align:center;color:var(--medium-grey)">Lade Daten...</td></tr>';
    },

    renderAdminTable() {
        const tbody = document.getElementById('admin-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        let bookings = this.state.adminBookings || [];

        // Filter
        const dateFilter = document.getElementById('filter-date')?.value;
        if (dateFilter && dateFilter !== 'all') {
            bookings = bookings.filter(b => b.booking_date === dateFilter);
        }
        const searchTerm = document.getElementById('search-field')?.value.toLowerCase();
        if (searchTerm) {
            bookings = bookings.filter(b =>
                `${b.first_name} ${b.last_name}`.toLowerCase().includes(searchTerm) ||
                (b.address || '').toLowerCase().includes(searchTerm)
            );
        }

        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" style="padding:16px;text-align:center;color:var(--medium-grey)">Keine Buchungen gefunden.</td></tr>';
            return;
        }

        bookings.forEach(b => {
            const row = document.createElement('tr');
            row.dataset.id = b.id;
            const dateStr = new Date(b.booking_date + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
            const timeStr = b.booking_time ? b.booking_time.substring(0, 5) : '';
            row.innerHTML = `
                <td><strong>${b.first_name} ${b.last_name}</strong></td>
                <td>${b.address || ''}, ${b.zip || ''} ${b.city || ''}</td>
                <td><a href="mailto:${b.email}">${b.email}</a></td>
                <td><a href="tel:${b.phone}">${b.phone}</a></td>
                <td>${dateStr}</td>
                <td>${timeStr}</td>
                <td>${b.duration} min</td>
                <td>${b.num_children}</td>
                <td>
                    <select onchange="app.updateAdminField('${b.id}', 'team', this.value)">
                        <option value="" ${!b.team ? 'selected' : ''}>-</option>
                        <option value="Team 1" ${b.team === 'Team 1' ? 'selected' : ''}>Team 1</option>
                        <option value="Team 2" ${b.team === 'Team 2' ? 'selected' : ''}>Team 2</option>
                        <option value="Team 3" ${b.team === 'Team 3' ? 'selected' : ''}>Team 3</option>
                    </select>
                </td>
                <td style="text-align:center;">
                    <input type="checkbox" ${b.word_received ? 'checked' : ''} 
                           onchange="app.updateAdminField('${b.id}', 'word_received', this.checked)">
                </td>
                <td>
                    <input type="text" placeholder="Notiz..." value="${b.internal_note || ''}" 
                           onchange="app.updateAdminField('${b.id}', 'internal_note', this.value)">
                </td>
                <td>
                    <button class="btn-save" id="save-${b.id}" style="display:none;" 
                            onclick="app.saveAdminRow('${b.id}')">Speichern</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    renderWaitlistTable() {
        const tbody = document.getElementById('waitlist-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const waitlist = this.state.adminWaitlist || [];
        document.getElementById('waitlist-count').textContent = waitlist.length;

        if (waitlist.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding:16px;text-align:center;color:var(--medium-grey)">Keine Einträge.</td></tr>';
            return;
        }

        waitlist.forEach(entry => {
            const row = document.createElement('tr');
            const timestamp = entry.created_at
                ? new Date(entry.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '-';
            row.innerHTML = `
                <td><strong>${entry.first_name} ${entry.last_name}</strong></td>
                <td><a href="mailto:${entry.email}">${entry.email}</a></td>
                <td><a href="tel:${entry.phone}">${entry.phone}</a></td>
                <td>${entry.num_children}</td>
                <td>${entry.requested_date ? new Date(entry.requested_date + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long' }) : 'Beide Tage'}</td>
                <td>${timestamp}</td>
            `;
            tbody.appendChild(row);
        });
    },

    // Lokales Update der Admin-Tabelle (vor dem Speichern)
    updateAdminField(id, field, value) {
        const booking = (this.state.adminBookings || []).find(b => b.id === id);
        if (booking) {
            booking[field] = value;
            const saveBtn = document.getElementById(`save-${id}`);
            if (saveBtn) saveBtn.style.display = 'inline-block';
        }
    },

    async saveAdminRow(id) {
        const booking = (this.state.adminBookings || []).find(b => b.id === id);
        if (!booking) return;

        const { error } = await db.from('bookings').update({
            team: booking.team,
            word_received: booking.word_received,
            internal_note: booking.internal_note
        }).eq('id', id);

        if (error) {
            this.showModal('Fehler beim Speichern. Bitte erneut versuchen.');
            return;
        }

        const saveBtn = document.getElementById(`save-${id}`);
        if (saveBtn) saveBtn.style.display = 'none';
        this.showModal(`Änderungen für "${booking.first_name} ${booking.last_name}" gespeichert.`);
    },

    filterBookings() { this.renderAdminTable(); },
    searchBookings() { this.renderAdminTable(); },

    showAdminView(viewName) {
        document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
        document.getElementById(`admin-view-${viewName}`).classList.add('active');
        document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`tab-${viewName}`).classList.add('active');
    },

    downloadExcel() {
        this.showModal('In einer finalen Version werden die Buchungsdaten als Excel-Datei heruntergeladen.');
    },

    // ==========================================
    // HILFSFUNKTIONEN
    // ==========================================
    showModal(text) {
        document.getElementById('modal-text').textContent = text;
        document.getElementById('custom-modal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('custom-modal').style.display = 'none';
    },

    showLoading(visible, text = 'Bitte warten...') {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2000;';
            overlay.innerHTML = `<div style="font-size:48px;animation:spin 1s linear infinite;">⏳</div><p style="margin-top:16px;font-weight:600;color:var(--dark-grey)">${text}</p>`;
            document.body.appendChild(overlay);
        }
        overlay.style.display = visible ? 'flex' : 'none';
        if (visible) overlay.querySelector('p').textContent = text;
    },
};

document.addEventListener('DOMContentLoaded', () => app.init());
window.app = app;