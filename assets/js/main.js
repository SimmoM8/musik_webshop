import { products } from './data/products.js';
import { Cart } from './classes/cart.js';

// ==========================================
// 1. STATE & DOM ELEMENTS
// ==========================================
const cart = new Cart();

// Containers & Modaler
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');
const heroSection = document.getElementById('hero-section');

// Sök-element
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const searchBtn = document.getElementById('search-btn');
const homeBtn = document.getElementById('reset-home-btn');

// Knappar
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

// Visa/Dölj Hero-bannern
function toggleHero(show) {
    if (heroSection) {
        heroSection.style.display = show ? 'block' : 'none';
    }
}

// Rendera produktlistan
function renderProducts(list = products) {
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    list.forEach(product => {
        productsContainer.innerHTML += product.renderCard();
    });

    attachProductButtonListeners();
}

// Koppla lyssnare (Köp-knapp & Klick på hela kortet)
function attachProductButtonListeners() {
    
    // 1. Hantera klick på hela produktkortet (Öppna modal)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = Number(card.dataset.id);
            const product = products.find(p => p.id === id);
            openProductModal(product);
        });
    });

    // 2. Hantera klick på Köp-knappen
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // VIKTIGT: Stoppa klicket från att "bubbla upp" till kortet.
            // Detta gör att modalen INTE öppnas när vi klickar på Köp.
            e.stopPropagation();

            const id = Number(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            
            cart.add(product);
            
            // Visuell feedback på knappen
            const originalText = e.target.textContent;
            e.target.textContent = "✔ Tillagd";
            btn.style.background = "#10b981"; // Grön
            
            setTimeout(() => {
                e.target.textContent = originalText;
                btn.style.background = ""; // Återställ
            }, 1500);
        });
    });

    // (Info-knappen behöver ingen egen lyssnare längre eftersom den är en del av kortet, 
    // men vi låter den vara kvar visuellt)
}

// Utför "Stor Sökning" (Döljer hero, visar resultat i grid)
function performFullSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchDropdown) searchDropdown.style.display = 'none';

    if (searchTerm.length > 0) {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        renderProducts(filtered);
        toggleHero(false);
        
        if (productsContainer) {
            productsContainer.parentElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        renderProducts(products);
        toggleHero(true);
    }
}

// ==========================================
// 3. MODAL FUNCTIONS
// ==========================================

// --- Produkt Modal ---
function openProductModal(product) {
    const content = document.getElementById('product-modal-details');

    content.innerHTML = `
        <button id="close-product-btn" aria-label="Stäng">&times;</button>
        <div class="modal-image-wrapper">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-info-wrapper">
            <div class="modal-badges">
                <span class="tag tag-green">● I lager</span>
                <span class="tag tag-gray" style="text-transform: capitalize;">${product.category}</span>
            </div>
            <h2>${product.name}</h2>
            <p class="modal-description">${product.description}</p>
            <div class="modal-footer">
                <h3 class="modal-price">${product.price.toLocaleString()} kr</h3>
                <button id="modal-buy-btn" class="btn btn-primary btn-full">Lägg i varukorg</button>
            </div>
            <div class="modal-meta">
                <small>Fri frakt • 3 års garanti • 30 dagars öppet köp</small>
            </div>
        </div>
    `;

    // Koppla modalens knappar
    content.querySelector('#modal-buy-btn').addEventListener('click', (e) => {
        cart.add(product);
        const btn = e.target;
        btn.textContent = "✔ Tillagd!";
        btn.style.background = "#10b981";
        setTimeout(() => productModal.close(), 800);
    });

    const closeBtn = content.querySelector('#close-product-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => productModal.close());
    }

    productModal.showModal();
}

// --- Varukorg Modal ---
function renderCartContents() {
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    const items = cart.getItems();

    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 20px; color: #666;">Din varukorg är tom just nu. 🎸</div>';
        totalSpan.textContent = "0";
        return;
    }

    container.innerHTML = items.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            <div style="flex-grow: 1;">
                <h4 style="margin: 0; font-size: 0.95rem;">${item.name}</h4>
                <span style="font-size: 0.85rem; color: #666;">${item.price.toLocaleString()} kr</span>
            </div>
            <button class="remove-item-btn close-btn" data-index="${index}" style="width: 30px; height: 30px; font-size: 1.2rem; background: none;">
                &times;
            </button>
        </div>
    `).join('');

    const total = items.reduce((sum, item) => sum + item.price, 0);
    totalSpan.textContent = total.toLocaleString();

    // Koppla "Ta bort"-knappar
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.dataset.index);
            cart.remove(index); 
            renderCartContents(); 
        });
    });
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// --- Navigation & Filter ---
document.querySelectorAll('.categories-list__link, .filter-trigger').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.category;

        if (category) {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            toggleHero(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            renderProducts(products);
            toggleHero(true);
        }
    });
});

// --- Hem-knapp (Reset) ---
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = "";
        renderProducts(products);
        toggleHero(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Live Sök ---
if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length === 0) {
            searchDropdown.style.display = 'none';
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

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
}

// --- Sök-knapp & Enter ---
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        performFullSearch();
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performFullSearch();
            searchInput.blur();
        }
    });
}

// --- Varukorg Hantering ---
if (openCartBtn) {
    openCartBtn.addEventListener('click', () => {
        renderCartContents();
        cartModal.showModal();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.add('closing');
        cartModal.addEventListener('animationend', () => {
            cartModal.close();
            cartModal.classList.remove('closing');
        }, { once: true });
    });
}
// ==========================================
// DARK MODE TOGGLE
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// 1. Kolla om användaren valt mörkt läge tidigare
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if(themeToggleBtn) themeToggleBtn.textContent = '☀️';
}

// 2. Lyssna på klick
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });
}
// ==========================================
// 5. INITIALIZATION
// ==========================================
renderProducts();