// ==========================================
// Nikolaus Booking System - Application Logic
// ==========================================

const app = {
    // Application State
    state: {
        currentScreen: 'landing',
        bookingData: {
            firstName: '',
            lastName: '',
            address: '',
            zip: '',
            city: '',
            phone: '',
            email: '',
            numChildren: 0,
            duration: 0,
            notes: '',
            selectedDate: '',
            selectedTime: ''
        },
        currentDateTab: 0, // 0 = Dec 5, 1 = Dec 6
        allBookings: [] // For admin view
    },

    // Initialize the application
    init() {
        this.generateMockBookings();
        this.renderAdminTable();
        
        // Check URL hash for admin access
        if (window.location.hash === '#admin') {
            this.navigateTo('admin');
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            if (window.location.hash === '#admin') {
                this.navigateTo('admin');
            }
        });
    },

    // Navigation
    navigateTo(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`screen-${screenName}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenName;
            
            // Screen-specific actions
            if (screenName === 'slots') {
                this.renderSlots();
                this.updateBookingSummary();
            } else if (screenName === 'confirm') {
                this.populateConfirmation();
            } else if (screenName === 'success') {
                this.populateSuccess();
            } else if (screenName === 'admin') {
                this.renderAdminTable();
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    },

    // Calculate visit duration based on number of children
    calculateDuration() {
        const numChildren = parseInt(document.getElementById('numChildren').value) || 0;
        let duration = 0;
        
        if (numChildren >= 1 && numChildren <= 3) {
            duration = 20;
        } else if (numChildren >= 4 && numChildren <= 6) {
            duration = 40;
        } else if (numChildren >= 7) {
            duration = 60;
        }
        
        this.state.bookingData.numChildren = numChildren;
        this.state.bookingData.duration = duration;
        
        // Show duration display
        const durationDisplay = document.getElementById('duration-display');
        const durationValue = document.getElementById('duration-value');
        
        if (duration > 0) {
            durationValue.textContent = `${duration} Minuten`;
            durationDisplay.style.display = 'block';
        } else {
            durationDisplay.style.display = 'none';
        }
    },

    // Submit form and save data
    submitForm(event) {
        event.preventDefault();
        
        // Collect form data
        this.state.bookingData.firstName = document.getElementById('firstName').value;
        this.state.bookingData.lastName = document.getElementById('lastName').value;
        this.state.bookingData.address = document.getElementById('address').value;
        this.state.bookingData.zip = document.getElementById('zip').value;
        this.state.bookingData.city = document.getElementById('city').value;
        this.state.bookingData.phone = document.getElementById('phone').value;
        this.state.bookingData.email = document.getElementById('email').value;
        this.state.bookingData.notes = document.getElementById('notes').value;
        
        // Navigate to slot selection
        this.navigateTo('slots');
    },

    // Update booking summary on slots screen
    updateBookingSummary() {
        const { firstName, lastName, numChildren, duration } = this.state.bookingData;
        
        document.getElementById('summary-name').textContent = `${firstName} ${lastName}`;
        document.getElementById('summary-children').textContent = numChildren;
        document.getElementById('summary-duration').textContent = duration;
    },

    // Switch between date tabs
    switchDate(dateIndex) {
        this.state.currentDateTab = dateIndex;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach((btn, index) => {
            if (index === dateIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Re-render slots
        this.renderSlots();
    },

    // Generate time slots (17:00 - 20:00 in 20-min intervals)
    generateTimeSlots() {
        const slots = [];
        const startHour = 17;
        const endHour = 20;
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let min = 0; min < 60; min += 20) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        
        return slots;
    },

    // Simulate slot availability (realistic booking patterns)
    getSlotAvailability(date, time) {
        // Create a seed based on date and time for consistent "random" results
        const seed = date + time;
        const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = (hash % 100) / 100;
        
        // Simulate realistic booking patterns:
        // - Early slots (17:00-18:00) are popular
        // - Peak time (18:00-19:00) is most booked
        // - Late slots (19:00-20:00) have better availability
        const hour = parseInt(time.split(':')[0]);
        
        let threshold;
        if (hour === 17) {
            threshold = 0.3; // 30% chance of being available
        } else if (hour === 18) {
            threshold = 0.2; // 20% chance of being available (most popular)
        } else {
            threshold = 0.5; // 50% chance of being available
        }
        
        if (random < threshold) {
            return 'available';
        } else if (random < threshold + 0.3) {
            return 'limited';
        } else {
            return 'full';
        }
    },

    // Render time slots for current date
    renderSlots() {
        const container = document.getElementById('slots-container');
        container.innerHTML = '';
        
        const dateStr = this.state.currentDateTab === 0 ? '2026-12-05' : '2026-12-06';
        const slots = this.generateTimeSlots();
        
        slots.forEach(time => {
            const availability = this.getSlotAvailability(dateStr, time);
            
            const button = document.createElement('button');
            button.className = `slot-btn ${availability}`;
            button.onclick = () => this.selectSlot(dateStr, time);
            
            // Disable if full
            if (availability === 'full') {
                button.disabled = true;
            }
            
            // Mark as selected if this is the current selection
            if (this.state.bookingData.selectedDate === dateStr && 
                this.state.bookingData.selectedTime === time) {
                button.classList.add('selected');
            }
            
            // Slot content
            const timeSpan = document.createElement('span');
            timeSpan.className = 'slot-time';
            timeSpan.textContent = time;
            
            const statusSpan = document.createElement('span');
            statusSpan.className = 'slot-status';
            statusSpan.textContent = availability === 'available' ? 'Verfügbar' : 
                                    availability === 'limited' ? 'Begrenzt' : 
                                    'Ausgebucht';
            
            button.appendChild(timeSpan);
            button.appendChild(statusSpan);
            container.appendChild(button);
        });
    },

    // Select a time slot
    selectSlot(date, time) {
        this.state.bookingData.selectedDate = date;
        this.state.bookingData.selectedTime = time;
        
        // Update UI to show selection
        this.renderSlots();
        
        // Navigate to confirmation after short delay
        setTimeout(() => {
            this.navigateTo('confirm');
        }, 300);
    },

    // Populate confirmation screen
    populateConfirmation() {
        const data = this.state.bookingData;
        
        // Contact details
        document.getElementById('confirm-name').textContent = 
            `${data.firstName} ${data.lastName}`;
        document.getElementById('confirm-address').textContent = 
            `${data.address}, ${data.zip} ${data.city}`;
        document.getElementById('confirm-contact').textContent = 
            `Tel: ${data.phone} · E-Mail: ${data.email}`;
        
        // Appointment details
        const dateObj = new Date(data.selectedDate);
        const dateDay = dateObj.getDate();
        const dateMonth = dateObj.toLocaleDateString('de-DE', { month: 'long' });
        
        document.getElementById('confirm-date-day').textContent = dateDay + '.';
        document.getElementById('confirm-date-month').textContent = dateMonth;
        document.getElementById('confirm-time').textContent = data.selectedTime + ' Uhr';
        document.getElementById('confirm-duration').textContent = 
            `${data.numChildren} Kinder · ${data.duration} Minuten`;
        
        // Notes (optional)
        if (data.notes) {
            document.getElementById('confirm-notes').textContent = data.notes;
            document.getElementById('confirm-notes-section').style.display = 'block';
        } else {
            document.getElementById('confirm-notes-section').style.display = 'none';
        }
    },

    // Confirm booking and add to mock database
    confirmBooking() {
        const data = this.state.bookingData;
        
        // Add to bookings array (mock persistence)
        this.state.allBookings.push({
            id: Date.now(),
            name: `${data.firstName} ${data.lastName}`,
            address: `${data.address}, ${data.zip} ${data.city}`,
            date: data.selectedDate,
            time: data.selectedTime,
            duration: data.duration,
            children: data.numChildren,
            phone: data.phone,
            email: data.email,
            notes: data.notes,
            team: '',
            wordReceived: false,
            internalNote: ''
        });
        
        // Navigate to success
        this.navigateTo('success');
    },

    // Populate success screen
    populateSuccess() {
        const data = this.state.bookingData;
        
        const dateObj = new Date(data.selectedDate);
        const formattedDate = dateObj.toLocaleDateString('de-DE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        document.getElementById('success-date').textContent = formattedDate;
        document.getElementById('success-time').textContent = data.selectedTime + ' Uhr';
    },

    // Simulate download template
    downloadTemplate() {
        alert('In der finalen Version würde hier die Nikolaus-Vorlage als Word-Dokument heruntergeladen werden.');
    },

    // Generate mock bookings for admin view
    generateMockBookings() {
        const mockNames = [
            'Max Mustermann', 'Anna Schmidt', 'Peter Weber', 'Lisa Müller',
            'Thomas Fischer', 'Sarah Becker', 'Michael Wagner', 'Julia Klein',
            'Daniel Hoffmann', 'Laura Zimmermann'
        ];
        
        const mockAddresses = [
            'Hauptstraße 12, 80331 München',
            'Bahnhofstraße 5, 80335 München',
            'Kirchweg 8, 80337 München',
            'Schulstraße 15, 80339 München',
            'Gartenweg 3, 80469 München'
        ];
        
        const dates = ['2026-12-05', '2026-12-06'];
        const times = this.generateTimeSlots();
        
        // Generate 8-12 mock bookings
        const numBookings = 8 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numBookings; i++) {
            const children = 1 + Math.floor(Math.random() * 5);
            let duration;
            if (children <= 3) duration = 20;
            else if (children <= 6) duration = 40;
            else duration = 60;
            
            this.state.allBookings.push({
                id: Date.now() + i,
                name: mockNames[Math.floor(Math.random() * mockNames.length)],
                address: mockAddresses[Math.floor(Math.random() * mockAddresses.length)],
                date: dates[Math.floor(Math.random() * dates.length)],
                time: times[Math.floor(Math.random() * times.length)],
                duration: duration,
                children: children,
                team: '',
                wordReceived: Math.random() > 0.5,
                internalNote: ''
            });
        }
        
        // Sort by date and time
        this.state.allBookings.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
        });
    },

    // Render admin table
    renderAdminTable() {
        const tbody = document.getElementById('admin-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Get filtered bookings
        const bookings = this.getFilteredBookings();
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${booking.name}</strong></td>
                <td>${booking.address}</td>
                <td>${new Date(booking.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</td>
                <td>${booking.time}</td>
                <td>${booking.duration} min</td>
                <td>${booking.children}</td>
                <td>
                    <select onchange="app.updateTeam(${booking.id}, this.value)">
                        <option value="" ${booking.team === '' ? 'selected' : ''}>-</option>
                        <option value="Team 1" ${booking.team === 'Team 1' ? 'selected' : ''}>Team 1</option>
                        <option value="Team 2" ${booking.team === 'Team 2' ? 'selected' : ''}>Team 2</option>
                        <option value="Team 3" ${booking.team === 'Team 3' ? 'selected' : ''}>Team 3</option>
                    </select>
                </td>
                <td style="text-align: center;">
                    <input type="checkbox" ${booking.wordReceived ? 'checked' : ''} 
                           onchange="app.updateWordStatus(${booking.id}, this.checked)">
                </td>
                <td>
                    <input type="text" placeholder="Notiz..." value="${booking.internalNote}"
                           onchange="app.updateNote(${booking.id}, this.value)">
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Get filtered bookings based on date filter and search
    getFilteredBookings() {
        let bookings = [...this.state.allBookings];
        
        // Date filter
        const dateFilter = document.getElementById('filter-date')?.value;
        if (dateFilter && dateFilter !== 'all') {
            bookings = bookings.filter(b => b.date === dateFilter);
        }
        
        // Search filter
        const searchTerm = document.getElementById('search-field')?.value.toLowerCase();
        if (searchTerm) {
            bookings = bookings.filter(b => 
                b.name.toLowerCase().includes(searchTerm) || 
                b.address.toLowerCase().includes(searchTerm)
            );
        }
        
        return bookings;
    },

    // Update team assignment
    updateTeam(bookingId, team) {
        const booking = this.state.allBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.team = team;
        }
    },

    // Update word received status
    updateWordStatus(bookingId, status) {
        const booking = this.state.allBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.wordReceived = status;
        }
    },

    // Update internal note
    updateNote(bookingId, note) {
        const booking = this.state.allBookings.find(b => b.id === bookingId);
        if (booking) {
            booking.internalNote = note;
        }
    },

    // Filter bookings in admin view
    filterBookings() {
        this.renderAdminTable();
    },

    // Search bookings in admin view
    searchBookings() {
        this.renderAdminTable();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Make app globally available for inline event handlers
window.app = app;