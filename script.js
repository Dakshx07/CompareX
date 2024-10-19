
const productForm = document.getElementById('productForm');
const comparisonTable = document.getElementById('comparisonTable').querySelector('tbody');


const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');


let products = [];

productForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const product = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quality: parseInt(document.getElementById('productQuality').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        features: document.getElementById('productFeatures').value.split(',').map(f => f.trim())
    };

    products.push(product);
    productForm.reset();
    updateComparisonTable();
});


function updateComparisonTable() {
    comparisonTable.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.classList.add('fade-in');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quality}/10</td>
            <td>${product.quantity}</td>
            <td>${product.features.join(', ')}</td>
            <td>
                <button onclick="deleteProduct(${index})" class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        comparisonTable.appendChild(row);
    });
}

// Function to highlight the cheapest product
function highlightCheapestProduct() {
    let cheapestIndex = 0;

    // Find the index of the product with the lowest price
    products.forEach((product, index) => {
        if (product.price < products[cheapestIndex].price) {
            cheapestIndex = index;
        }
    });

    // Highlight the row with the cheapest product
    comparisonTable.querySelectorAll('tr').forEach((row, index) => {
        if (index === cheapestIndex) {
            row.classList.add('highlight');
        } else {
            row.classList.remove('highlight');
        }
    });
}

// Function to delete a product
function deleteProduct(index) {
    products.splice(index, 1);
    updateComparisonTable();
}

// Sidebar functionality
function openSidebar() {
    sidebar.style.right = '0';
    content.style.marginRight = '250px';
}

function closeSidebar() {
    sidebar.style.right = '-250px';
    content.style.marginRight = '0';
}

sidebarToggleBtn.addEventListener('click', openSidebar);
sidebarCloseBtn.addEventListener('click', closeSidebar);

// Close sidebar when clicking outside of it
document.addEventListener('click', function(event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggleBtn = sidebarToggleBtn.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnToggleBtn && window.innerWidth <= 768) {
        closeSidebar();
    }
});

// Adjust layout on window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

// Initialize the sidebar state on page load
window.addEventListener('load', function() {
    closeSidebar();
});

// New comparison tool functions
function comparePrice() {
    const cheapestProduct = products.reduce((min, p) => p.price < min.price ? p : min);
    return `The cheapest product is ${cheapestProduct.name} at $${cheapestProduct.price.toFixed(2)}.`;
}

function compareQuality() {
    const highestQualityProduct = products.reduce((max, p) => p.quality > max.quality ? p : max);
    return `The highest quality product is ${highestQualityProduct.name} with a rating of ${highestQualityProduct.quality}/10.`;
}

function compareQuantity() {
    const highestQuantityProduct = products.reduce((max, p) => p.quantity > max.quantity ? p : max);
    return `The product with the highest quantity is ${highestQuantityProduct.name} with ${highestQuantityProduct.quantity} units.`;
}

function compareFeatures() {
    const allFeatures = new Set(products.flatMap(p => p.features));
    const featureComparison = Array.from(allFeatures).map(feature => {
        const productsWithFeature = products.filter(p => p.features.includes(feature));
        return `${feature}: ${productsWithFeature.map(p => p.name).join(', ')}`;
    });
    return `Feature Comparison:\n${featureComparison.join('\n')}`;
}

function compareOverall() {
    const scores = products.map(p => ({
        name: p.name,
        score: (10 - p.price/100) + p.quality + (p.quantity/10)
    }));
    const bestProduct = scores.reduce((max, p) => p.score > max.score ? p : max);
    return `Based on an overall score (considering price, quality, and quantity), the best product is ${bestProduct.name}.`;
}

// Update the quality output when the range input changes
document.getElementById('productQuality').addEventListener('input', function() {
    document.querySelector('output[for="productQuality"]').value = this.value;
});

// Smooth scroll to comparison results
function scrollToResults() {
    document.getElementById('comparisonResults').scrollIntoView({ behavior: 'smooth' });
}

// Update event listeners for comparison buttons
document.getElementById('comparePriceBtn').addEventListener('click', () => {
    document.getElementById('resultsText').textContent = comparePrice();
    scrollToResults();
});

document.getElementById('compareQualityBtn').addEventListener('click', () => {
    document.getElementById('resultsText').textContent = compareQuality();
    scrollToResults();
});

document.getElementById('compareQuantityBtn').addEventListener('click', () => {
    document.getElementById('resultsText').textContent = compareQuantity();
    scrollToResults();
});

document.getElementById('compareFeaturesBtn').addEventListener('click', () => {
    document.getElementById('resultsText').textContent = compareFeatures();
    scrollToResults();
});

document.getElementById('compareOverallBtn').addEventListener('click', () => {
    document.getElementById('resultsText').textContent = compareOverall();
    scrollToResults();
});
