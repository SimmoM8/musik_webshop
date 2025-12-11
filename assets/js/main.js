import { products } from './data/products.js';
import { Cart } from './classes/cart.js';

// Initiera varukorg
const cart = new Cart();

// Hämta viktiga DOM-element
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');

// ---------------------------------------------------------
// 1. HEADER & SÖKFUNKTIONER
// ---------------------------------------------------------

// Återställ allt (Hem-knappen / Loggan)
const homeBtn = document.getElementById('reset-home-btn');
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = "";
        
        renderProducts(products);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Live Sök (Autocomplete)
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');

if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            searchDropdown.style.display = 'none';
            searchDropdown.innerHTML = '';
            return;
        }

        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        if (filtered.length > 0) {
            searchDropdown.style.display = 'block';
            searchDropdown.innerHTML = filtered.map(product => `
                <div class="search-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-item-info">
                        <h4>${product.name}</h4>
                        <span>${product.price.toLocaleString()} kr</span>
                    </div>
                </div>
            `).join('');

            // Gör sökresultaten klickbara
            document.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = Number(item.dataset.id);
                    const product = products.find(p => p.id === id);
                    openProductModal(product);
                    
                    searchDropdown.style.display = 'none';
                    searchInput.value = '';
                });
            });
        } else {
            searchDropdown.style.display = 'block';
            searchDropdown.innerHTML = '<div style="padding:10px; color:#666;">Inga produkter hittades...</div>';
        }
    });

    // Stäng söklistan om man klickar utanför
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
}

// ---------------------------------------------------------
// 2. NAVIGERING & FILTRERING
// ---------------------------------------------------------

// Menyn i headern (Gitarr, Piano, etc.)
document.querySelectorAll('.categories-list__link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;

        if (category) {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            // Scrolla ner till produkterna
            if (productsContainer) {
                productsContainer.parentElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            renderProducts(products);
        }
    });
});

// Hero-knappar och Teaser-bilder (filter-trigger)
document.querySelectorAll('.filter-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category; // currentTarget för att fånga länken även vid klick på bild
        
        if (category) {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            if (productsContainer) {
                productsContainer.parentElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ---------------------------------------------------------
// 3. RENDERING AV PRODUKTER
// ---------------------------------------------------------

function renderProducts(list = products) {
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    list.forEach(product => {
        productsContainer.innerHTML += product.renderCard();
    });

    attachButtonListeners();
}

function attachButtonListeners() {
    // Köp-knappar på produktkorten
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            
            cart.add(product);
            
            // Visuell feedback på knappen
            const originalText = e.target.textContent;
            e.target.textContent = "✔ Tillagd";
            setTimeout(() => e.target.textContent = originalText, 1500);
        });
    });

    // Info-knappar
    document.querySelectorAll('.read-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            openProductModal(product);
        });
    });
}

// ---------------------------------------------------------
// 4. MODALER (PRODUKTINFO & VARUKORG)
// ---------------------------------------------------------

// --- PRODUKT MODAL ---
function openProductModal(product) {
    const content = document.getElementById('product-modal-details');
    content.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" style="max-width: 100%; border-radius: 8px; margin-bottom: 15px;">
        <p>${product.description}</p>
        <h3>${product.price.toLocaleString()} kr</h3>
        <button id="modal-buy-btn" class="btn btn-primary">Lägg i varukorg</button>
    `;

    document.getElementById('modal-buy-btn').addEventListener('click', () => {
        cart.add(product);
        productModal.close();
    });

    productModal.showModal();
}

document.getElementById('close-product-btn').addEventListener('click', () => {
    productModal.close();
});

// --- VARUKORG MODAL ---

document.getElementById('open-cart-btn').addEventListener('click', () => {
    renderCartContents();
    cartModal.showModal();
});

document.getElementById('close-cart-btn').addEventListener('click', () => {
    cartModal.close();
});

// Denna funktion ritar ut varukorgen med bilder och ta-bort-knappar
function renderCartContents() {
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    
    const items = cart.getItems();
    
    // Om varukorgen är tom
    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 20px;">Din varukorg är tom just nu. 🎸</div>';
        totalSpan.textContent = "0";
        return;
    }

    // Bygg HTML-listan
    container.innerHTML = items.map((item, index) => `
        <div class="cart-item" style="display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #eee; padding: 10px 0;">
            
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            
            <div style="flex-grow: 1;">
                <h4 style="margin: 0; font-size: 0.95rem;">${item.name}</h4>
                <span style="font-size: 0.85rem; color: #666;">${item.price.toLocaleString()} kr</span>
            </div>

            <button class="remove-item-btn" data-index="${index}" style="background:none; border:none; cursor:pointer; color: #ff4d4d; font-size: 1.5rem; line-height: 1;">
                &times;
            </button>
        </div>
    `).join('');

    // Räkna total
    const total = items.reduce((sum, item) => sum + item.price, 0);
    totalSpan.textContent = total.toLocaleString();

    // Koppla klick-event på alla kryss-knappar
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number(btn.dataset.index);
            cart.remove(index); // Ta bort från logiken
            renderCartContents(); // Rita om direkt
        });
    });
}

// ---------------------------------------------------------
// 5. STARTA APPEN
// ---------------------------------------------------------
renderProducts();