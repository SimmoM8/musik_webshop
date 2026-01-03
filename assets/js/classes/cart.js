/**
 * Klass som hanterar varukorgen.
 * Sparar innehållet i webbläsarens LocalStorage så att det finns kvar
 * även om användaren laddar om sidan.
 */
export class Cart {
    constructor() {
        // Försök hämta sparad varukorg från minnet, annars skapa en tom lista
        this.items = JSON.parse(localStorage.getItem('cart')) || {};

        // Uppdatera siffran i menyn direkt när sidan laddas
        this.updateCounter();
    }

    /**
     * Lägger till en produkt i varukorgen
     * @param {string|number} product - Produktobjektet som ska sparas
     */
    add(product) {
        const id = String(product.id);
        // Kolla om produkten redan finns i varukorgen och öka i så fall mängden
        if (this.items[id]) {
            this.items[id].quantity += 1; // Öka mängden i korgen med 1
        } else {
            this.items[id] = {
                product, quantity: 1 // Lägg till ny produkt i korgen med mängd 1
            };
        }
        this.save();          // Spara till LocalStorage
        this.updateCounter(); // Uppdatera siffran i UI:t
    }

    /**
     * Minskar mängden av en produkt i varukorgen
     * @param {string|number} productId - Produktobjektet som ska minskas
     */
    decrement(productId) {
        const id = String(productId);
        if (!this.items[id]) return; // Om produkten inte finns i korgen, gör inget

        // Kolla om quantity är större än 1 innan vi minskar
        if (this.items[id].quantity > 1) {
            this.items[id].quantity -= 1; // Minska mängden i korgen med 1
        } else {
            delete this.items[id]; // Ta bort produkten helt från korgen om mängden är 1
        }
        this.save();          // Spara till LocalStorage
        this.updateCounter(); // Uppdatera siffran i UI:t
    }

    /**
     * Tar bort en produkt baserat på dess id i listan
     * @param {string|number} productId - Produktobjektet som ska tas bort
     */
    remove(productId) {
        const id = String(productId);
        if (!this.items[id]) return; // Om produkten inte finns i korgen, gör inget
        delete this.items[id]; // Tar bort produkten baserat på id
        this.save();
        this.updateCounter();
    }

    // Tömmer hela varukorgen
    clear() {
        this.items = {};
        this.save();
        this.updateCounter();
    }

    // --- Hjälpfunktioner ---

    // Returnerar hela listan med produkter
    getItems() {
        return this.items;
    }

    // Returnerar total mängd produkter i varukorgen
    getTotalQuantity() {
        return Object.values(this.items).reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return Object.values(this.items).reduce((sum, item) => {
            const itemPrice = Number(item.product.price) || 0;
            return sum + (itemPrice * item.quantity);
        }, 0);
    }

    // Sparar nuvarande lista till webbläsarens LocalStorage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Uppdatera den lilla siffran (badge) bredvid varukorgs-ikonen
    updateCounter() {
        const counter = document.getElementById('cart-count');
        if (!counter) {
            return // Om elementet inte finns, gör inget
        }
        counter.textContent = this.getTotalQuantity(); // Uppdatera textinnehållet med total mängd
    }
}