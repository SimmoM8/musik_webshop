/**
 * Huvudfil för logiken i webbshoppen.
 * Hanterar produkter, varukorg, sökning och modal-fönster.
 */

// Justera importerna så de hittar filerna relativt till denna fil
// Vi går NER i mapparna data och classes
import { products } from './data/products.js';
import { Cart } from './classes/cart.js';

// ==========================================
// 1. STATE & DOM ELEMENTS
// ==========================================

// Initiera varukorgen
const cart = new Cart();

// Hämta viktiga behållare från HTML
const productsContainer = document.getElementById('products-container');
const heroSection = document.getElementById('hero-section');

// Modaler
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');

// Sök-element
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const searchBtn = document.getElementById('search-btn');

// Knappar
const homeBtn = document.getElementById('reset-home-btn'); // Loggan
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.querySelector('#cart-modal .close-btn');
const closeProductBtn = document.getElementById('close-product-btn');

// ==========================================
// 2. HELPER FUNCTIONS (Hjälpfunktioner)
// ==========================================

/**
 * Visar eller döljer den stora "Hero"-bannern på startsidan.
 * @param {boolean} show - True för att visa, False för att dölja.
 */
function toggleHero(show) {
    if (heroSection) {
        heroSection.style.display = show ? 'block' : 'none';
    }
}

/**
 * Ritar ut produktkorten i rutnätet.
 * @param {Array} list - Listan med produkter som ska visas (default = alla).
 */
function renderProducts(list = products) {
    if (!productsContainer) return;

    // Töm behållaren först
    productsContainer.innerHTML = '';

    if (list.length === 0) {
        productsContainer.innerHTML = '<p class="ta-center">Inga produkter hittades.</p>';
        return;
    }

    // Skapa HTML för varje produkt
    list.forEach(product => {
        productsContainer.innerHTML += product.renderCard();
    });

    // Aktivera knappar på de nya korten
    attachProductButtonListeners();
}

/**
 * Kopplar klick-lyssnare till produktkorten och köp-knapparna.
 * Körs varje gång vi ritar om produkterna.
 */
function attachProductButtonListeners() {

    // 1. Hantera klick på hela kortet (Öppna modal)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Om man klickar på Köp-knappen ska INTE modalen öppnas (hanteras nedan)
            if (e.target.classList.contains('add-to-cart')) return;

            const id = parseInt(card.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) openProductModal(product);
        });
    });

    // 2. Hantera klick på "Köp"-knappen
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stoppa klicket från att bubbla upp till kortet

            const id = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === id);

            if (product) {
                cart.add(product);

                // Visuell feedback (Knappen blir grön en kort stund)
                const originalText = e.target.textContent;
                e.target.textContent = "✔";
                e.target.style.background = "#10b981"; // Grön färg

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = ""; // Återställ
                }, 1000);
            }
        });
    });
}

/**
 * Utför en sökning och uppdaterar sidan.
 */
function performFullSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    // Dölj dropdown-menyn vid sökning
    if (searchDropdown) searchDropdown.style.display = 'none';

    if (searchTerm.length > 0) {
        // Filtrera listan
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );

        renderProducts(filtered);
        toggleHero(false); // Dölj bannern för att visa resultat

        // Scrolla ner till resultaten
        if (productsContainer) {
            productsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Om sökfältet är tomt, visa allt igen
        renderProducts(products);
        toggleHero(true);
    }
}

// ==========================================
// 3. MODAL FUNCTIONS
// ==========================================

function openProductModal(product) {
    // Fyll modalen med data
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.description;
    document.getElementById('modal-price').textContent = product.price.toLocaleString() + ' kr';

    // Hantera Köp-knappen inuti modalen
    const modalBuyBtn = document.getElementById('modal-buy-btn');

    // Klona knappen för att rensa gamla event listeners (viktigt hack!)
    const newBtn = modalBuyBtn.cloneNode(true);
    modalBuyBtn.parentNode.replaceChild(newBtn, modalBuyBtn);

    // Återställ knappen till originalskick varje gång modalen öppnas
    newBtn.textContent = "Lägg i varukorg";
    newBtn.style.background = "";

    // Lägg till klick-lyssnare med animation
    newBtn.addEventListener('click', () => {
        cart.add(product);

        // --- VISUELL FEEDBACK (Här är det nya!) ---
        const originalText = newBtn.textContent;
        newBtn.textContent = "✔ Tillagd i varukorg";
        newBtn.style.background = "#10b981"; // Grön färg

        // Vänta 1.5 sekund, sen återställ
        setTimeout(() => {
            newBtn.textContent = "Lägg i varukorg";
            newBtn.style.background = ""; // Ta bort den gröna färgen

            // Valfritt: Stäng modalen automatiskt efter köp?
            // productModal.style.display = 'none'; 
        }, 1500);
    });

    // Visa modalen
    productModal.style.display = 'flex';
}

function renderCartContents() {
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total-price');
    const items = Object.values(cart.getItems());

    // Töm listan först
    container.innerHTML = '';

    if (items.length < 1) {
        container.innerHTML = '<p class="ta-center">Din varukorg är tom.</p>';
        if (totalSpan) totalSpan.textContent = "0";
        return;
    }

    // Loopa igenom varukorgen och skapa HTML
    items.forEach((item) => {
        const product = item.product;
        const quantity = item.quantity;
        container.innerHTML += `
            <div class="cart-item" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">
                  <h4>${product.name}</h4>

                  <div class="cart-item-qty">
                    <button class="btn btn-ghost qty-btn" data-action="decrement" data-id="${product.id}">−</button>
                    <span class="qty-value">${quantity}</span>
                    <button class="btn btn-ghost qty-btn" data-action="increment" data-id="${product.id}">+</button>
                  </div>
                  <span>${product.price.toLocaleString()} kr</span>
                </div>
                
                <button class="btn btn-ghost remove-item-btn" data-id="${product.id}">&times;</button>
            </div>
        `;
    });

    // Uppdatera totalsumma
    var cartSum = cart.getTotalPrice();
    if (totalSpan) totalSpan.textContent = cartSum.toLocaleString();

    // Koppla "Ta bort"-knappar
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            cart.remove(id);
            renderCartContents(); // Rita om korgen
        });
    });
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

function setupEventListeners() {

    // --- Kategori-filter (Menyn) ---
    document.querySelectorAll('.categories-list__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;

            if (category === 'news') {
                renderProducts(products.filter(p => p.isNew));
            } else if (category) {
                renderProducts(products.filter(p => p.category === category));
            } else {
                renderProducts(products);
            }
            toggleHero(false);
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

    // --- Live Sök (Dropdown) ---
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

            // Visa resultat i dropdown
            searchDropdown.style.display = 'block';
            if (filtered.length > 0) {
                searchDropdown.innerHTML = filtered.slice(0, 5).map(product => `
                    <div class="search-item" data-id="${product.id}" style="display:flex; gap:10px; padding:8px; cursor:pointer; border-bottom:1px solid #eee;">
                        <img src="${product.image}" style="width:30px; height:30px; object-fit:contain;">
                        <div>
                            <div style="font-weight:bold; font-size:0.9rem;">${product.name}</div>
                            <div style="font-size:0.8rem;">${product.price.toLocaleString()} kr</div>
                        </div>
                    </div>
                `).join('');

                document.querySelectorAll('.search-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const id = parseInt(item.dataset.id);
                        const product = products.find(p => p.id === id);
                        openProductModal(product);
                        searchDropdown.style.display = 'none';
                        searchInput.value = '';
                    });
                });
            } else {
                searchDropdown.innerHTML = '<div style="padding:10px; color:#666;">Inga träffar...</div>';
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

    // --- MODALER (Den viktiga fixen!) ---

    // Öppna varukorg
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            renderCartContents();
            // HÄR ÄR ÄNDRINGEN: Vi använder showModal() så animationen startar
            cartModal.showModal();
        });
    }

    // Stäng varukorg (med animation)
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.add('closing'); // Trigga stäng-animation i CSS
            cartModal.addEventListener('animationend', () => {
                cartModal.close();
                cartModal.classList.remove('closing');
            }, { once: true });
        });
    }

    // Stäng produktmodal
    if (closeProductBtn) closeProductBtn.addEventListener('click', () => productModal.style.display = 'none');

    // Stäng vid klick utanför (Varukorg)
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('closing');
            cartModal.addEventListener('animationend', () => {
                cartModal.close();
                cartModal.classList.remove('closing');
            }, { once: true });
        }
    });

    // Stäng vid klick utanför (Produktmodal)
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.style.display = 'none';
    });
}

// ==========================================
// 5. DARK MODE
// ==========================================
function setupDarkMode() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    }

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
}

// ==========================================
// 6. INITIALIZATION (Starta allt)
// ==========================================
function init() {
    console.log('Webshop startad...');
    renderProducts();      // Rita ut produkter
    setupEventListeners(); // Starta alla knappar och sök
    setupDarkMode();       // Kolla färgtema
}

// Kör igång!
init();