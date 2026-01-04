/**
 * Klass som representerar en enskild produkt.
 * Ansvarar för att hålla data om produkten och skapa dess HTML-kort.
 */
export class Product {
    constructor(id, name, price, category, image, description, isNew = false) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        // Om ingen beskrivning finns, använd en standardtext
        this.description = description || "Ett fantastiskt instrument av hög kvalitet.";
        this.isNew = isNew;
    }

    /**
     * Skapar HTML-koden för produktkortet som visas på sidan.
     * @returns {string} En sträng med HTML
     */
    renderCard() {
        // Skapa "Nyhet"-badge bara om isNew är true
        const badgeHtml = this.isNew 
            ? '<span class="pill pill-new">Nyhet</span>' 
            : '';

        // Formatera priset snyggt på svenska (t.ex. "10 000" istället för "10000")
        const formattedPrice = this.price.toLocaleString('sv-SE');

        // Returnera HTML-strukturen.
        // VIKTIGT: Vi använder CSS-klasser istället för inline-styles här
        // för att responsiviteten (mobilvyn) ska fungera korrekt.
        return `
            <article class="product-card" data-category="${this.category}" data-id="${this.id}">
                <div class="product-image">
                    <img 
                        src="${this.image}" 
                        alt="${this.name}" 
                        loading="lazy"
                        onerror="this.onerror=null; this.src='https://placehold.co/600x400/png?text=Bild+saknas';"
                    >
                    ${badgeHtml}
                </div>
                
                <div class="product-copy">
                    <h3>${this.name}</h3>
                    <p>${this.description.substring(0, 60)}...</p>
                    
                    <div class="price-row">
                        <span class="price">${formattedPrice} kr</span>
                        <span class="tag tag-green">I lager</span>
                    </div>

                    <div class="card-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${this.id}">
                            Köp
                        </button>
                        <button class="btn btn-ghost read-more" data-id="${this.id}">
                            Info
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
}