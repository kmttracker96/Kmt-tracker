// Define bus stops array
// Change the variable name from 'buses' to 'busStops' to match usage in functions
const busStops = [
    'Central Bus Stand', 'Rankala Lake', 'Railway Station', 'New Palace',
    'Tarabai Park', 'Rajarampuri', 'Shivaji Peth', 'Sambhaji Nagar',
    'Kasba Bawada', 'Udyam Nagar', 'Laxmipuri', 'Jaysingpur',
    'Ichalkaranji', 'Bindu Chowk', 'Shahupuri', 'Kalamba',
    'Market Yard', 'Shivaji University', 'Mahadwar Road',
    'Line Bazaar', 'Gangavesh'
].sort();

// Complete distance matrix for all locations
const distanceMatrix = {
    "Central Bus Stand": {
        "Railway Station": 3, "Rankala Lake": 5, "New Palace": 2,
        "Tarabai Park": 4, "Rajarampuri": 4, "Shivaji Peth": 3,
        "Sambhaji Nagar": 5, "Kasba Bawada": 4, "Udyam Nagar": 7,
        "Laxmipuri": 2, "Jaysingpur": 25, "Ichalkaranji": 30,
        "Bindu Chowk": 1, "Shahupuri": 3, "Kalamba": 6,
        "Market Yard": 4, "Shivaji University": 8, "Mahadwar Road": 2,
        "Line Bazaar": 3, "Gangavesh": 4
    }
    // Add other locations' distances here
};

// Goods type charges with descriptions
const goodsTypeCharges = {
    documents: { charge: 15, description: "Documents (Letters, Certificates, etc.)" },
    electronics: { charge: 25, description: "Electronics (Gadgets, Devices)" },
    clothing: { charge: 18, description: "Clothing and Textiles" },
    food: { charge: 20, description: "Food Items (Perishable)" },
    other: { charge: 10, description: "Other Items" }
};

// Update pricing constants
const PRICING = {
    PER_KM_RATE: 5,
    PER_KG_RATE: 3,
    MIN_WEIGHT: 0.1,
    MAX_WEIGHT: 50
};

function calculateDistance(pickup, delivery) {
    if (pickup === delivery) return 0;
    
    if (distanceMatrix[pickup]?.[delivery]) {
        return distanceMatrix[pickup][delivery];
    }
    if (distanceMatrix[delivery]?.[pickup]) {
        return distanceMatrix[delivery][pickup];
    }
    return 5; // Default distance
}

function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

function calculatePrice() {
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const pickup = document.getElementById('pickupLocation').value;
    const delivery = document.getElementById('deliveryLocation').value;
    const goodsType = document.getElementById('goodsType').value;

    const distance = calculateDistance(pickup, delivery);
    const distanceCharge = distance * PRICING.PER_KM_RATE;
    const weightCharge = weight * PRICING.PER_KG_RATE;
    const typeCharge = goodsTypeCharges[goodsType].charge;
    
    const totalCost = distanceCharge + weightCharge + typeCharge;

    updatePriceDisplay(distance, weight, goodsType, distanceCharge, weightCharge, typeCharge, totalCost);
    return totalCost;
}

function updatePriceDisplay(distance, weight, goodsType, distanceCharge, weightCharge, typeCharge, totalCost) {
    const priceDisplay = document.getElementById('price-display');
    if (!priceDisplay) return;

    const priceBreakdown = [
        { label: `Distance Charge (${distance}km × ${formatCurrency(PRICING.PER_KM_RATE)}/km)`, value: distanceCharge },
        { label: `Weight Charge (${weight}kg × ${formatCurrency(PRICING.PER_KG_RATE)}/kg)`, value: weightCharge },
        { label: `Additional ${goodsTypeCharges[goodsType].description}`, value: typeCharge },
        { label: 'Total Cost', value: totalCost, isTotal: true }
    ];

    priceDisplay.innerHTML = `
        <div class="price-breakdown">
            <h4>Price Breakdown</h4>
            ${priceBreakdown.map(item => `
                <div class="price-item ${item.isTotal ? 'total' : ''}">
                    <span>${item.label}:</span>
                    <span>${formatCurrency(item.value)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function createServiceHighlights() {
    return `
        <div class="service-highlights">
            <div class="highlight-item">
                <i class="fas fa-truck"></i>
                <h4>Express Delivery</h4>
                <p>Same-day delivery within Kolhapur city limits</p>
            </div>
            <div class="highlight-item">
                <i class="fas fa-box"></i>
                <h4>Package Types</h4>
                <p>Handle various goods: ${Object.values(goodsTypeCharges)
                    .map(type => type.description.split(' (')[0]).join(', ')}</p>
            </div>
            <div class="highlight-item">
                <i class="fas fa-rupee-sign"></i>
                <h4>Pricing Structure</h4>
                <ul class="pricing-list">
                    <li>Distance Rate: ${formatCurrency(PRICING.PER_KM_RATE)}/km</li>
                    <li>Weight Rate: ${formatCurrency(PRICING.PER_KG_RATE)}/kg</li>
                    <li>Additional charges vary by goods type</li>
                </ul>
            </div>
        </div>
    `;
}

function createBookingForm() {
    return `
        <form id="goodsBookingForm" onsubmit="submitGoodsBooking(event)">
            <div class="form-group">
                <label for="pickupLocation">Pickup Location</label>
                <select id="pickupLocation" required>
                    ${busStops.map(stop => `<option value="${stop}">${stop}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="deliveryLocation">Delivery Location</label>
                <select id="deliveryLocation" required>
                    ${busStops.map(stop => `<option value="${stop}">${stop}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="goodsType">Type of Goods</label>
                <select id="goodsType" required>
                    ${Object.entries(goodsTypeCharges).map(([value, { description }]) => 
                        `<option value="${value}">${description}</option>`).join('')}
                </select>
            </div>

            <div id="price-display" class="price-display"></div>
            
            <div class="form-group">
                <label for="weight">Approximate Weight (kg)</label>
                <input type="number" id="weight" 
                    min="${PRICING.MIN_WEIGHT}" 
                    max="${PRICING.MAX_WEIGHT}" 
                    step="0.1" required>
            </div>
            
            <div class="form-group">
                <label for="pickupDate">Pickup Date</label>
                <input type="date" id="pickupDate" required>
            </div>
            
            <div class="form-group">
                <label for="pickupTime">Preferred Pickup Time</label>
                <select id="pickupTime" required>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 7 PM)</option>
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Book Transport</button>
        </form>
    `;
}

function openGoodsBooking() {
    const modalContent = `
        <div class="goods-booking-form">
            <div class="modal-header">
                <h2>Book Goods Transport</h2>
                <button type="button" class="close-modal" onclick="closeGoodsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="goods-info-section">
                <h3>Our Goods Transport Services</h3>
                ${createServiceHighlights()}
                <div class="transport-guidelines">
                    <h4>Important Guidelines:</h4>
                    <ul>
                        <li>Maximum weight per package: ${PRICING.MAX_WEIGHT} kg</li>
                        <li>Prohibited items: Flammable materials, illegal substances</li>
                        <li>Proper packaging required for fragile items</li>
                        <li>Valid ID proof required for pickup/delivery</li>
                    </ul>
                </div>
            </div>
            ${createBookingForm()}
        </div>
    `;

    document.getElementById('modal-content-container').innerHTML = modalContent;
    document.getElementById('feature-modal').style.display = 'block';

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;

    // Add event listeners
    ['weight', 'pickupLocation', 'deliveryLocation', 'goodsType'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculatePrice);
    });

    calculatePrice();
}

function closeGoodsModal() {
    const modal = document.getElementById('feature-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function submitGoodsBooking(event) {
    event.preventDefault();
    
    const formElements = ['pickupLocation', 'deliveryLocation', 'goodsType', 'weight', 'pickupDate', 'pickupTime'];
    const formData = Object.fromEntries(
        formElements.map(id => [id, document.getElementById(id).value])
    );

    const totalCost = calculatePrice();

    const confirmationContent = `
        <div class="booking-confirmation">
            <div class="modal-header">
                <h2>Booking Confirmation</h2>
                <button type="button" class="close-modal" onclick="closeGoodsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="confirmation-details">
                ${Object.entries(formData).map(([key, value]) => 
                    `<p><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</p>`
                ).join('')}
                <p><strong>Total Cost:</strong> ${formatCurrency(totalCost)}</p>
            </div>
            <p class="success-message">Your booking has been confirmed!</p>
            <p>A confirmation email will be sent to your registered email address.</p>
            <button onclick="closeGoodsModal()" class="btn btn-primary">Close</button>
        </div>
    `;

    document.getElementById('modal-content-container').innerHTML = confirmationContent;
}

// Styles
const styles = `
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 5px;
        color: #666;
        transition: color 0.3s;
    }

    .close-modal:hover {
        color: #000;
    }

    .price-breakdown {
        margin: 15px 0;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .price-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }

    .price-item.total {
        font-weight: bold;
        border-top: 2px solid #ddd;
        border-bottom: none;
        margin-top: 5px;
        padding-top: 10px;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);