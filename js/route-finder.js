// Bus stops array for route suggestions
const bus = [
    'Central Bus Stand', 'Rankala Lake', 'Railway Station', 'New Palace',
    'Tarabai Park', 'Rajarampuri', 'Shivaji Peth', 'Sambhaji Nagar',
    'Kasba Bawada', 'Udyam Nagar', 'Laxmipuri', 'Jaysingpur',
    'Ichalkaranji', 'Bindu Chowk', 'Shahupuri', 'Kalamba',
    'Market Yard', 'Shivaji University', 'Mahadwar Road',
    'Line Bazaar', 'Gangavesh'
].sort();

function initializeSearchSuggestions() {
    const fromInput = document.getElementById('from-location');
    const toInput = document.getElementById('to-location');
    const fromSuggestions = document.getElementById('from-suggestions');
    const toSuggestions = document.getElementById('to-suggestions');

    function showSuggestions(input, suggestionsList) {
        const value = input.value.toLowerCase();
        if (value.length < 2) {
            suggestionsList.style.display = 'none';
            return;
        }

        const filtered = busStops.filter(stop => 
            stop.toLowerCase().includes(value)
        );

        if (filtered.length > 0) {
            suggestionsList.innerHTML = filtered.map(stop => `
                <div class="suggestion-item">
                    <i class="fas fa-map-marker-alt"></i> ${stop}
                </div>
            `).join('');
            suggestionsList.style.display = 'block';

            // Add click handlers to suggestions
            const items = suggestionsList.getElementsByClassName('suggestion-item');
            Array.from(items).forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.textContent.trim().replace('', '');
                    suggestionsList.style.display = 'none';
                });
            });
        } else {
            suggestionsList.style.display = 'none';
        }
    }

    // Event listeners for inputs
    if (fromInput && fromSuggestions) {
        fromInput.addEventListener('input', () => showSuggestions(fromInput, fromSuggestions));
        fromInput.addEventListener('focus', () => {
            if (fromInput.value.length >= 2) {
                showSuggestions(fromInput, fromSuggestions);
            }
        });
    }

    if (toInput && toSuggestions) {
        toInput.addEventListener('input', () => showSuggestions(toInput, toSuggestions));
        toInput.addEventListener('focus', () => {
            if (toInput.value.length >= 2) {
                showSuggestions(toInput, toSuggestions);
            }
        });
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input-group')) {
            if (fromSuggestions) fromSuggestions.style.display = 'none';
            if (toSuggestions) toSuggestions.style.display = 'none';
        }
    });
}

function findRoutes() {
    const fromLocation = document.getElementById('from-location').value;
    const toLocation = document.getElementById('to-location').value;
    const searchResults = document.getElementById('search-results');
    
    if (!fromLocation || !toLocation) {
        searchResults.innerHTML = '<div class="alert alert-warning">Please enter both starting and destination locations</div>';
        return;
    }
    
    searchResults.innerHTML = '<div class="loading-indicator"></div>';
    
    setTimeout(() => {
        const routes = [
            {
                routeId: 'KMT-01',
                from: fromLocation,
                to: toLocation,
                departureTime: '07:30 AM',
                arrivalTime: '08:15 AM',
                fare: '₹25',
                distance: '7.5 km',
                duration: '45 min',
                stops: 8,
                status: 'On Time'
            },
            {
                routeId: 'KMT-03',
                from: fromLocation,
                to: toLocation,
                departureTime: '08:00 AM',
                arrivalTime: '08:50 AM',
                fare: '₹30',
                distance: '8.2 km',
                duration: '50 min',
                stops: 10,
                status: 'Delayed'
            },
            {
                routeId: 'KMT-05',
                from: fromLocation,
                to: toLocation,
                departureTime: '08:30 AM',
                arrivalTime: '09:10 AM',
                fare: '₹25',
                distance: '7.2 km',
                duration: '40 min',
                stops: 7,
                status: 'On Time'
            }
        ];
        
        displayRoutes(routes);
    }, 1500);
}

function displayRoutes(routes) {
    const searchResults = document.getElementById('search-results');
    
    if (routes.length > 0) {
        let resultsHTML = `
            <h3>Available Routes</h3>
            <div class="routes-container">
        `;
        
        routes.forEach(route => {
            const statusClass = route.status === 'On Time' ? 'on-time' : 'delayed';
            resultsHTML += `
                <div class="route-card">
                    <div class="route-header">
                        <span class="route-id">${route.routeId}</span>
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
                        </div>
                    </div>
                    <div class="route-footer">
                        <button class="btn book-btn" onclick="showTicketingOptions('${route.routeId}', '${route.from}', '${route.to}', '${route.departureTime}')">Book Ticket</button>
                        <button class="btn track-btn" onclick="trackBus('${route.routeId}')">Track Bus</button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        searchResults.innerHTML = resultsHTML;
    } else {
        searchResults.innerHTML = '<div class="alert alert-info">No routes found between these locations. Please try different locations.</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearchSuggestions();
    
    // Add click event listener to the search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            findRoutes();
        });
    }

    // Add enter key event listener to the input fields
    const fromInput = document.getElementById('from-location');
    const toInput = document.getElementById('to-location');
    
    [fromInput, toInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    findRoutes();
                }
            });
        }
    });
});