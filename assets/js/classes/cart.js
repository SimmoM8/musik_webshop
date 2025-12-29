/**
 * Klass som hanterar varukorgen.
 * Sparar innehållet i webbläsarens LocalStorage så att det finns kvar
 * även om användaren laddar om sidan.
 */
export class Cart {
    constructor() {
        // Försök hämta sparad varukorg från minnet, annars skapa en tom lista
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Uppdatera siffran i menyn direkt när sidan laddas
        this.updateCounter();
    }

    /**
     * Lägger till en produkt i varukorgen
     * @param {Object} product - Produktobjektet som ska sparas
     */
    add(product) {
        this.items.push(product);
        this.save();          // Spara till LocalStorage
        this.updateCounter(); // Uppdatera siffran i UI:t
    }

    /**
     * Tar bort en produkt baserat på dess position (index) i listan
     * @param {number} index - Vilken plats i listan produkten har
     */
    remove(index) {
        this.items.splice(index, 1); // Tar bort 1 objekt på angivet index
        this.save();
        this.updateCounter();
    }

    // Tömmer hela varukorgen
    clear() {
        this.items = [];
        this.save();
        this.updateCounter();
    }

    // Returnerar hela listan med produkter
    getItems() {
        return this.items;
    }

    // --- Hjälpfunktioner ---

    // Sparar nuvarande lista till webbläsarens LocalStorage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Uppdatera den lilla siffran (badge) bredvid varukorgs-ikonen
    updateCounter() {
        const counter = document.getElementById('cart-count');
        if (counter) {
            counter.textContent = this.items.length;
        }
    }
}