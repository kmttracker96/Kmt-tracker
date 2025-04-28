// Bus stops array for route suggestions
const busStops = [
    'Central Bus Stand', 'Rankala Lake', 'Railway Station', 'New Palace',
    'Tarabai Park', 'Rajarampuri', 'Shivaji Peth', 'Sambhaji Nagar',
    'Kasba Bawada', 'Udyam Nagar', 'Laxmipuri', 'Jaysingpur',
    'Ichalkaranji', 'Bindu Chowk', 'Shahupuri', 'Kalamba',
    'Market Yard', 'Shivaji University', 'Mahadwar Road',
    'Line Bazaar', 'Gangavesh'
].sort();

// Fixed schedule for each route (24-hour format)
const routeSchedules = {
    'KMT-01': ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00'],
    'KMT-02': ['06:15', '06:45', '07:15', '07:45', '08:15', '08:45', '09:15', '09:45', '10:15'],
    'KMT-03': ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30'],
    'KMT-04': ['06:45', '07:15', '07:45', '08:15', '08:45', '09:15', '09:45', '10:15', '10:45'],
    'KMT-05': ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00']
};

function initializeSearchDropdowns() {
    const fromSelect = document.getElementById('from-location');
    const toSelect = document.getElementById('to-location');

    // Populate dropdowns with bus stops
    busStops.forEach(stop => {
        const fromOption = new Option(stop, stop);
        const toOption = new Option(stop, stop);
        fromSelect.add(fromOption);
        toSelect.add(toOption);
    });

    // Add event listeners for dropdowns
    [fromSelect, toSelect].forEach(select => {
        select.addEventListener('change', () => {
            if (fromSelect.value && toSelect.value) {
                findRoutes();
            }
        });
    });
}

function findRoutes() {
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    const searchResults = document.getElementById('search-results');
    
    if (!fromLocation || !toLocation) {
        searchResults.innerHTML = '<div class="alert alert-warning">Please select both starting and destination locations</div>';
        return;
    }
    
    searchResults.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Finding available routes...</div>';
    
    // Get routes based on current time
    const routes = getAvailableRoutes(fromLocation, toLocation);
    displayRoutes(routes);
}

function getAvailableRoutes(from, to) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    const routes = [];
    const baseDistance = calculateDistance(from, to);
    const baseFare = Math.max(Math.floor(baseDistance * 2.5), 10); // Minimum fare of ₹10
    
    // Find next available departures across all routes
    Object.entries(routeSchedules).forEach(([routeId, schedule]) => {
        schedule.forEach(time => {
            if (isTimeAfter(time, currentTimeString)) {
                const departureTime = new Date(currentTime);
                const [hours, minutes] = time.split(':');
                departureTime.setHours(parseInt(hours), parseInt(minutes), 0);
                
                const duration = Math.ceil(baseDistance * 4); // 4 minutes per km
                const arrivalTime = new Date(departureTime.getTime() + duration * 60000);
                
                routes.push({
                    routeId: routeId,
                    from: from,
                    to: to,
                    departureTime: formatTime(departureTime),
                    arrivalTime: formatTime(arrivalTime),
                    fare: `₹${baseFare}`,
                    distance: `${baseDistance} km`,
                    duration: `${duration} min`,
                    stops: Math.floor(baseDistance / 2) + 1,
                    status: Math.random() > 0.8 ? 'Delayed' : 'On Time',
                    seatsAvailable: Math.floor(Math.random() * 30) + 10,
                    busType: routeId.endsWith('1') || routeId.endsWith('3') ? 'Express' : 'Regular'
                });
            }
        });
    });
    
    // Sort by departure time and return next 5 departures
    return routes
        .sort((a, b) => parseTime(a.departureTime) - parseTime(b.departureTime))
        .slice(0, 5);
}

function calculateDistance(from, to) {
    // Simple distance calculation (can be enhanced with actual distances)
    const locations = {
        'Central Bus Stand': { lat: 16.7050, lng: 74.2433 },
        'Rankala Lake': { lat: 16.7100, lng: 74.2300 },
        'Railway Station': { lat: 16.7080, lng: 74.2350 }
        // Add more locations as needed
    };
    
    // Default distance if locations not found
    if (!locations[from] || !locations[to]) {
        return 5;
    }
    
    // Calculate actual distance using coordinates
    const R = 6371; // Earth's radius in km
    const lat1 = locations[from].lat * Math.PI / 180;
    const lat2 = locations[to].lat * Math.PI / 180;
    const dLat = (locations[to].lat - locations[from].lat) * Math.PI / 180;
    const dLon = (locations[to].lng - locations[from].lng) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
}

function isTimeAfter(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    
    if (hours1 > hours2) return true;
    if (hours1 < hours2) return false;
    return minutes1 > minutes2;
}

function parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return new Date(2025, 0, 1, hours, minutes);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function displayRoutes(routes) {
    const searchResults = document.getElementById('search-results');
    
    if (routes.length > 0) {
        let resultsHTML = `
            <h3>Available Routes</h3>
            <div class="routes-container">
        `;
        
        routes.forEach(route => {
            const statusClass = route.status.toLowerCase().replace(' ', '-');
            const seatsClass = route.seatsAvailable < 15 ? 'limited-seats' : '';
            
            resultsHTML += `
                <div class="route-card ${seatsClass}">
                    <div class="route-header">
                        <div class="route-id-type">
                            <span class="route-id">${route.routeId}</span>
                            <span class="bus-type ${route.busType.toLowerCase()}">${route.busType}</span>
                        </div>
                        <span class="status-badge ${statusClass}">${route.status}</span>
                    </div>
                    
                    <div class="route-body">
                        <div class="route-stations">
                            <div class="station-from">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <span class="time">${route.departureTime}</span>
                                    <span class="name">${route.from}</span>
                                </div>
                            </div>
                            <div class="route-line">
                                <span class="stops">${route.stops} stops</span>
                            </div>
                            <div class="station-to">
                                <i class="fas fa-map-marker"></i>
                                <div>
                                    <span class="time">${route.arrivalTime}</span>
                                    <span class="name">${route.to}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="route-info">
                            <span><i class="fas fa-clock"></i> ${route.duration}</span>
                            <span><i class="fas fa-road"></i> ${route.distance}</span>
                            <span><i class="fas fa-ticket-alt"></i> ${route.fare}</span>
                            <span class="seats-info ${seatsClass}">
                                <i class="fas fa-chair"></i> ${route.seatsAvailable} seats available
                            </span>
                        </div>
                    </div>
                    
                    <div class="route-footer">
                        <button class="btn book-btn" onclick="showTicketingOptions('${route.routeId}', '${route.from}', '${route.to}', '${route.departureTime}', '${route.fare}', ${route.seatsAvailable})">
                            Book Ticket <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="btn track-btn" onclick="trackBus('${route.routeId}')">
                            <i class="fas fa-map-marker-alt"></i> Track Bus
                        </button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        searchResults.innerHTML = resultsHTML;
    } else {
        searchResults.innerHTML = '<div class="alert alert-info">No routes available at this time. Please try again later.</div>';
    }
}

function showTicketingOptions(routeId, from, to, departureTime, fare, seatsAvailable) {
    const modalContent = document.getElementById('modal-content-container');
    if (!modalContent) return;
    
    const ticketId = generateTicketId();
    
    modalContent.innerHTML = `
        <div class="ticket-booking">
            <h2>Book Your Ticket</h2>
            <div class="ticket-details">
                <div class="route-summary">
                    <div class="detail-item">
                        <span class="label">Route:</span>
                        <span class="value">${routeId}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">From:</span>
                        <span class="value">${from}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">To:</span>
                        <span class="value">${to}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Departure:</span>
                        <span class="value">${departureTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Fare:</span>
                        <span class="value">${fare}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Available Seats:</span>
                        <span class="value">${seatsAvailable}</span>
                    </div>
                </div>
                
                <div class="passenger-details">
                    <h3>Passenger Details</h3>
                    <div class="form-group">
                        <label for="passenger-name">Name</label>
                        <input type="text" id="passenger-name" required>
                    </div>
                    <div class="form-group">
                        <label for="passenger-phone">Phone</label>
                        <input type="tel" id="passenger-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="passenger-email">Email</label>
                        <input type="email" id="passenger-email" required>
                    </div>
                    <div class="form-group">
                        <label for="seat-count">Number of Seats</label>
                        <input type="number" id="seat-count" min="1" max="${seatsAvailable}" value="1" required>
                    </div>
                </div>
                
                <div class="payment-options">
                    <h3>Payment Method</h3>
                    <div class="payment-methods">
                        <label class="payment-method">
                            <input type="radio" name="payment" value="upi" checked>
                            <span class="method-name"><i class="fas fa-mobile-alt"></i> UPI</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="card">
                            <span class="method-name"><i class="fas fa-credit-card"></i> Card</span>
                        </label>
                        <label class="payment-method">
                            <input type="radio" name="payment" value="netbanking">
                            <span class="method-name"><i class="fas fa-university"></i> Net Banking</span>
                        </label>
                    </div>
                </div>
                
                <button class="btn btn-primary book-ticket-btn" onclick="processTicketBooking('${ticketId}', '${routeId}', '${from}', '${to}', '${departureTime}', '${fare}')">
                    Proceed to Payment
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('feature-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function generateTicketId() {
    return 'KMT-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function processTicketBooking(ticketId, routeId, from, to, departureTime, fare) {
    const passengerName = document.getElementById('passenger-name').value;
    const passengerPhone = document.getElementById('passenger-phone').value;
    const passengerEmail = document.getElementById('passenger-email').value;
    const seatCount = document.getElementById('seat-count').value;
    
    if (!passengerName || !passengerPhone || !passengerEmail || !seatCount) {
        alert('Please fill in all passenger details');
        return;
    }
    
    const modalContent = document.getElementById('modal-content-container');
    
    // Show loading state
    modalContent.innerHTML = `
        <div class="payment-processing">
            <i class="fas fa-spinner fa-spin"></i>
            <h2>Processing Payment</h2>
            <p>Please wait while we process your payment...</p>
        </div>
    `;
    
    // Simulate payment processing
    setTimeout(() => {
        modalContent.innerHTML = `
            <div class="booking-confirmation">
                <i class="fas fa-check-circle"></i>
                <h2>Booking Confirmed!</h2>
                <div class="ticket-info">
                    <p><strong>Ticket ID:</strong> ${ticketId}</p>
                    <p><strong>Route:</strong> ${routeId}</p>
                    <p><strong>From:</strong> ${from}</p>
                    <p><strong>To:</strong> ${to}</p>
                    <p><strong>Departure:</strong> ${departureTime}</p>
                    <p><strong>Passenger:</strong> ${passengerName}</p>
                    <p><strong>Seats:</strong> ${seatCount}</p>
                    <p><strong>Total Amount:</strong> ${fare}</p>
                </div>
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}" alt="Ticket QR Code">
                    <p>Show this QR code while boarding</p>
                </div>
                <p class="confirmation-message">
                    A copy of your ticket has been sent to ${passengerEmail}
                </p>
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        `;
    }, 2000);
}

function closeModal() {
    const modal = document.getElementById('feature-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchDropdowns();
    
    // Add click event listener to the search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            findRoutes();
        });
    }
});