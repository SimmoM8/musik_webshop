export class Catalog {
    constructor(products) {
        this.products = products; // Array av produktobjekt
    }

    /**
     * Hämtar alla produkter i katalogen baserat på aktuellt filter och sortering
     * @param {Object} state - Objekt som innehåller filter- och sorteringskriterier
     * @returns {Array} - Array av produktobjekt
     */
    query(state = {}) {
        let catalog = [...this.products]; // Skapa en kopia för att undvika att ändra originalet

        // FILTER: Kategori
        if (state.category) {
            catalog = catalog.filter(product => product.category === state.category);
        }

        // FILTER: Endast nya produkter
        if (state.onlyNew) {
            catalog = catalog.filter(product => product.isNew);
        }

        // FILTER: sökterm
        if (state.searchTerm) {
            const term = state.searchTerm.toLowerCase();
            catalog = catalog.filter(product =>
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
            );
        }

        // FILTER: prisintervall
        if (typeof state.minPrice === 'number') {
            catalog = catalog.filter(product => product.price >= state.minPrice);
        }
        if (typeof state.maxPrice === 'number') {
            catalog = catalog.filter(product => product.price <= state.maxPrice);
        }

        return this.sortProducts(catalog, state.sortBy);
    }

    /**
     * Sorterar produkter baserat på ett givet kriterium
     * @param {string} sortBy - Kriteriet att sortera efter (t.ex. 'price-asc', 'price-desc', 'name-asc', 'name-desc')
     * @returns {Array} - Array av sorterade produktobjekt
     */
    sortProducts(list, sortBy) {
        const sortedProducts = [...list]; // Skapa en kopia för att undvika att ändra originalet

        switch (sortBy) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Om okänt sorteringskriterium, returnera osorterat
                break;
        }

        return sortedProducts;
    }
}