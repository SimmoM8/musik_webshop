import { products } from './data/products.js';
import { Cart } from './classes/cart.js';

// Klick på loggan: Nollställ allt och gå till startsidan
const homeBtn = document.getElementById('reset-home-btn');

if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        // 1. Töm sökfältet
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = "";

        // 2. Visa alla produkter igen
        renderProducts(products); // Se till att 'products' är importerad!

        // 3. Scrolla högst upp
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- LIVE SÖK (Autocomplete) ---
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');

if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // 1. Om sökfältet är tomt, dölj listan och avsluta
        if (searchTerm.length === 0) {
            searchDropdown.style.display = 'none';
            searchDropdown.innerHTML = '';
            return;
        }

        // 2. Filtrera produkter
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        // 3. Om vi hittar produkter -> Visa listan
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

            // 4. Gör resultaten klickbara (Öppna modal)
            document.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = Number(item.dataset.id);
                    const product = products.find(p => p.id === id);
                    
                    openProductModal(product); // Öppna din produkt-popup
                    
                    // Rensa sökningen efter klick
                    searchDropdown.style.display = 'none';
                    searchInput.value = '';
                });
            });
        } else {
            // Inga träffar
            searchDropdown.style.display = 'block';
            searchDropdown.innerHTML = '<div style="padding:10px; color:#666;">Inga produkter hittades...</div>';
        }
    });

    // 5. Stäng listan om man klickar utanför
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
}
// --- 3. MENY-NAVIGERING (Kategorier i headern) ---
document.querySelectorAll('.categories-list__link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Hindra sidan från att hoppa/ladda om
        
        // Hämta kategorin som vi skrev i HTML (t.ex. "guitars")
        const category = e.target.dataset.category;

        if (category) {
            // 1. Filtrera listan
            const filteredProducts = products.filter(product => product.category === category);
            
            // 2. Visa produkterna
            renderProducts(filteredProducts);

            // 3. Scrolla ner smidigt så man ser resultatet
            const productSection = document.getElementById('products-container');
            if (productSection) {
                // Vi scrollar till sektionens rubrik istället för själva grid:et, 
                // så man ser "Produkt highlights"-rubriken också.
                productSection.parentElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Om man klickar på "Nyheter" eller "Tillbehör" som vi inte har produkter till än:
            // Visa allt, eller visa ett tomt meddelande? Vi visar allt så länge:
            renderProducts(products);
        }
    });
});

// Initiera varukorg
const cart = new Cart();

// Hämta DOM-element
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const productModal = document.getElementById('product-modal');

// --- RENDERA PRODUKTER ---
function renderProducts(list = products) {
    // Töm containern först
    productsContainer.innerHTML = '';
    
    // Loopa igenom och skapa HTML för varje produkt
    list.forEach(product => {
        // Vi måste göra om strängen från renderCard() till ett riktigt DOM-element 
        // för att kunna lägga det i listan snyggt, men innerHTML funkar bra här:
        productsContainer.innerHTML += product.renderCard();
    });

    // Sätt igång lyssnare på de nya knapparna
    attachButtonListeners();
}

function attachButtonListeners() {
    // KÖP-KNAPPAR
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            cart.add(product);
            
            // Visuell feedback
            const originalText = e.target.textContent;
            e.target.textContent = "✔ Tillagd";
            setTimeout(() => e.target.textContent = originalText, 1500);
        });
    });

    // INFO-KNAPPAR
    document.querySelectorAll('.read-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            const product = products.find(p => p.id === id);
            openProductModal(product);
        });
    });
}

// --- NAVIGERING / FILTRERING ---
document.querySelectorAll('.categories-list__link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;

        if (category) {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        } else {
            // Om man klickar på "Nyheter" eller liknande som saknar kategori, visa allt
            renderProducts(products);
        }
    });
});

// --- MODALER ---

// Öppna varukorg
document.getElementById('open-cart-btn').addEventListener('click', () => {
    renderCartContents();
    cartModal.showModal();
});

// Stäng varukorg
document.getElementById('close-cart-btn').addEventListener('click', () => {
    cartModal.close();
});

// Rendera varukorgens innehåll
function renderCartContents() {
    const container = document.getElementById('cart-items');
    const items = cart.getItems();
    const totalSpan = document.getElementById('cart-total');

    container.innerHTML = items.map(item => `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0;">
            <div>
                <strong>${item.name}</strong>
                <br><small>${item.price} kr</small>
            </div>
            <span>${item.price} kr</span>
        </div>
    `).join('');

    if(items.length === 0) container.innerHTML = "<p>Din varukorg är tom.</p>";

    const total = items.reduce((sum, item) => sum + item.price, 0);
    totalSpan.textContent = total.toLocaleString();
}

// Produkt-Modal
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

// Starta appen
renderProducts();