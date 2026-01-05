/**
 * Huvudfil för logiken i webbshoppen.
 * Hanterar produkter, varukorg, sökning och modal-fönster.
 */

// Justera importerna så de hittar filerna relativt till denna fil
// Vi går NER i mapparna data och classes
import { products } from './data/products.js';
import { Cart } from './classes/cart.js';
import { Catalog } from './classes/catalog.js';

// ==========================================
// 1. STATE & DOM ELEMENTS
// ==========================================

// Initiera varukorgen
const cart = new Cart();

// Initiera katalogen
const catalog = new Catalog(products);

// Hämta viktiga behållare från HTML
const productsContainer = document.getElementById('products-container');
const heroSection = document.getElementById('hero-section');

// Modaler
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const productModal = document.getElementById('product-modal');

// Sök-element
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');
const searchBtn = document.getElementById('search-btn');

// Filter & sort-element
const sortSelect = document.getElementById('sort-select');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const onlyNewToggle = document.getElementById('only-new');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

// Knappar
const homeBtn = document.getElementById('reset-home-btn'); // Loggan
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.querySelector('#cart-modal .close-btn');
const closeProductBtn = document.getElementById('close-product-btn');

// Kategori rubrik
const categoryHeading = document.getElementById('category-heading');

// Produktfilter och vy-tillstånd
const viewState = {
    category: null,
    searchTerm: "",
    onlyNew: false, // Visa endast nya produkter
    minPrice: null,
    maxPrice: null,
    sortBy: "featured" // featured, price-asc, price-desc, name-asc, name-desc
}

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
    viewState.searchTerm = searchInput.value || "";

    // Dölj dropdown-menyn vid sökning
    if (searchDropdown) searchDropdown.style.display = 'none';

    applyFiltersAndSorting();
}

/**
 * Tillämpa filter och sortering baserat på viewState.
 */
function applyFiltersAndSorting() {
    const sortBy = viewState.sortBy || 'featured';
    if (!viewState.sortBy) {
        viewState.sortBy = sortBy;
    }

    const list = catalog.query({ ...viewState, sortBy });
    renderProducts(list);
    const shouldShowHero = !viewState.category &&
        !viewState.searchTerm &&
        !viewState.onlyNew &&
        viewState.minPrice === null &&
        viewState.maxPrice === null;
    toggleHero(shouldShowHero);
}

/**
 * Debounce helper for inputs
 */
function debounce(fn, delay = 250) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Säker tolkning av talvärde
 */
function asNumberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Håller UI-kontroller i synk med state
 */
function syncFilterControls() {
    if (sortSelect) sortSelect.value = viewState.sortBy || 'featured';
    if (minPriceInput) minPriceInput.value = typeof viewState.minPrice === 'number' ? viewState.minPrice : '';
    if (maxPriceInput) maxPriceInput.value = typeof viewState.maxPrice === 'number' ? viewState.maxPrice : '';
    if (onlyNewToggle) onlyNewToggle.checked = Boolean(viewState.onlyNew);
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

                <span>${Number(product.price).toLocaleString()} kr / st</span>

                <div class="cart-item-row">
                    <div class="cart-item-qty">
                    <button class="btn btn-ghost btn-icon qty-btn" data-action="decrement" data-id="${product.id}" aria-label="Minska antal">−</button>
                    <span class="qty-value" aria-label="Antal">${quantity}</span>
                    <button class="btn btn-ghost btn-icon qty-btn" data-action="increment" data-id="${product.id}" aria-label="Öka antal">+</button>

                    <button class="btn btn-ghost btn-icon btn-danger remove-item-btn"
                            data-action="remove"
                            data-id="${product.id}"
                            aria-label="Ta bort">
                        <i class="bi bi-trash3" aria-hidden="true"></i>
                    </button>
                    </div>

                    <span class="cart-item-price">${(Number(product.price) * Number(quantity)).toLocaleString()} kr</span>
                </div>
                </div>
            </div>
        `;
    });

    // Uppdatera totalsumma
    var cartSum = cart.getTotalPrice();
    if (totalSpan) totalSpan.textContent = cartSum.toLocaleString();
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================

function setupEventListeners() {

    syncFilterControls();

    const debouncedPriceFilter = debounce(() => {
        if (minPriceInput) viewState.minPrice = asNumberOrNull(minPriceInput.value);
        if (maxPriceInput) viewState.maxPrice = asNumberOrNull(maxPriceInput.value);
        applyFiltersAndSorting();
    }, 250);

    // --- Filter & sorteringsfält ---
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            viewState.sortBy = e.target.value;
            applyFiltersAndSorting();
        });
    }

    if (minPriceInput) minPriceInput.addEventListener('input', debouncedPriceFilter);
    if (maxPriceInput) maxPriceInput.addEventListener('input', debouncedPriceFilter);

    if (onlyNewToggle) {
        onlyNewToggle.addEventListener('change', (e) => {
            viewState.onlyNew = e.target.checked;
            applyFiltersAndSorting();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            viewState.searchTerm = '';
            viewState.minPrice = null;
            viewState.maxPrice = null;
            viewState.onlyNew = false;
            viewState.sortBy = 'featured';
            if (searchInput) searchInput.value = '';
            if (searchDropdown) searchDropdown.style.display = 'none';
            syncFilterControls();
            applyFiltersAndSorting();
        });
    }

    // --- Kategori-filter (Menyn) ---
    document.querySelectorAll('.categories-list__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;

            viewState.category = category === 'news' ? null : category;
            viewState.onlyNew = category === 'news';
            syncFilterControls();
            applyFiltersAndSorting();
            categoryHeading.textContent = category !== 'all' ? ` ${e.target.textContent}` : '';
        });
    });

    // --- Hem-knapp (Reset) ---
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            viewState.category = null;
            viewState.onlyNew = false;
            viewState.searchTerm = '';
            viewState.minPrice = null;
            viewState.maxPrice = null;
            viewState.sortBy = 'featured';

            if (searchInput) searchInput.value = "";
            syncFilterControls();
            applyFiltersAndSorting();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            categoryHeading.textContent = '';
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

    // Hantera alla klickbara knappar på varukorgsitemen
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const id = btn.dataset.id;
            const action = btn.dataset.action;

            const entry = cart.getItems()[String(id)];
            if (!entry) return;

            const { product, quantity } = entry;

            const confirmRemove = () => confirm("Vill du ta bort " + product.name + " från varukorgen?");

            switch (action) {
                case 'increment':
                    if (product) {
                        cart.add(product);
                    }
                    break;
                case 'decrement':
                    if (quantity <= 1 && !confirmRemove()) return;
                    cart.decrement(id);
                    // Optionally provide feedback that item was removed
                    break;
                case 'remove':
                    if (!confirmRemove()) return;
                    cart.remove(id);
                    break;
                default:
                    return; // Okänd åtgärd
            }
            renderCartContents(); // Rita om korgen
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
