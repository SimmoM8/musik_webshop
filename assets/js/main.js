import { products } from './data/products.js';
import { Cart } from './classes/cart.js';

// Initiera varukorg
const cart = new Cart();

// Hämta viktiga DOM-element
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');

// ---------------------------------------------------------
// HJÄLPFUNKTION: Toggle Hero (Dölj/Visa bannern)
// ---------------------------------------------------------
function toggleHero(show) {
    const hero = document.getElementById('hero-section');
    if (hero) {
        if (show) {
            hero.style.display = 'block'; 
        } else {
            hero.style.display = 'none';
        }
    }
}

// ---------------------------------------------------------
// 1. HEADER & SÖKFUNKTIONER
// ---------------------------------------------------------

// Återställ allt (Hem-knappen / Loggan)
const homeBtn = document.getElementById('reset-home-btn');
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        // 1. Töm sökfältet
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = "";
        
        // 2. Visa alla produkter och visa Hero-bannern igen
        renderProducts(products);
        toggleHero(true); // <--- VISA HERO
        
        // 3. Scrolla högst upp
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Live Sök (Autocomplete)
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');

if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Om sökfältet är tomt
        if (searchTerm.length === 0) {
            searchDropdown.style.display = 'none';
            searchDropdown.innerHTML = '';
            return;
        }

        // Filtrera produkter
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        // Visa resultatet i dropdown
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
                    
                    openProductModal(product); // Öppna modal
                    
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
// NYTT: HANTERA "SÖK"-KNAPPEN & ENTER-TANGENTEN
// ---------------------------------------------------------
const searchBtn = document.getElementById('search-btn');

// Gemensam funktion för att utföra "Stor sökning"
function performFullSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const dropdown = document.getElementById('search-dropdown');

    // 1. Dölj dropdown-menyn (vi ska titta på stora listan nu)
    if (dropdown) dropdown.style.display = 'none';

    if (searchTerm.length > 0) {
        // 2. Filtrera produkter
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        // 3. Visa resultatet i stora rutnätet
        renderProducts(filtered);

        // 4. Dölj Hero-bannern och scrolla ner
        toggleHero(false);
        if (productsContainer) {
            productsContainer.parentElement.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // Om fältet är tomt och man klickar sök: Återställ allt
        renderProducts(products);
        toggleHero(true);
    }
}

// Koppla klick på knappen
if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stoppa formuläret från att ladda om sidan
        performFullSearch();
    });
}

// Koppla "Enter"-tangenten i sökfältet
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performFullSearch();
            // Ta bort fokus från rutan så tangentbordet fälls ner (på mobil)
            searchInput.blur();
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
            // Filtrera listan
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            // Dölj Hero-bannern så produkterna hamnar i fokus
            toggleHero(false); // <--- DÖLJ HERO
            
            // Scrolla upp till toppen av produkterna
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            // Om man klickar på "Nyheter" eller liknande
            renderProducts(products);
            toggleHero(true); // <--- VISA HERO
        }
    });
});

// Hero-knappar och Teaser-bilder (filter-trigger)
document.querySelectorAll('.filter-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        
        if (category) {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
            
            // Dölj Hero-bannern
            toggleHero(false); // <--- DÖLJ HERO
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Vi lägger in HTML för modalen
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

    // 1. KOPPLA KÖP-KNAPPEN (Sök inuti 'content' för säkerhets skull)
    content.querySelector('#modal-buy-btn').addEventListener('click', () => {
        cart.add(product);
        const btn = content.querySelector('#modal-buy-btn');
        btn.textContent = "✔ Tillagd!";
        btn.style.background = "#10b981";
        setTimeout(() => productModal.close(), 800);
    });

    // 2. KOPPLA STÄNG-KNAPPEN (Här är den viktiga ändringen!)
    // Vi använder 'content.querySelector' för att vara 100% säkra på att vi tar RÄTT knapp
    const closeBtn = content.querySelector('#close-product-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            productModal.close();
        });
    }

    productModal.showModal();
}

// --- HANTERA VARUKORGEN ---

document.getElementById('open-cart-btn').addEventListener('click', () => {
    renderCartContents();
    cartModal.showModal();
});

document.getElementById('close-cart-btn').addEventListener('click', () => {
    cartModal.classList.add('closing');

    cartModal.addEventListener('animationend', () => {

        cartModal.close();
 
        cartModal.classList.remove('closing');
    }, { once: true }); 
});


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


    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.dataset.index);
            cart.remove(index); 
            renderCartContents(); 
        });
    });
}

// ---------------------------------------------------------
// 5. STARTA APPEN
// ---------------------------------------------------------
renderProducts();