export class Product {
    constructor(id, name, price, category, image, description, isNew = false) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.description = description || "Ett fantastiskt instrument av hög kvalitet.";
        this.isNew = isNew;
    }

    renderCard() {
        // Skapa "Nyhet"-badge bara om isNew är true
        const badgeHtml = this.isNew 
            ? '<span class="pill pill-new">Nyhet</span>' 
            : '';

        const formattedPrice = this.price.toLocaleString('sv-SE');

        // VIKTIGT: Vi lade till data-id="${this.id}" här nere i <article>
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

                    <div class="card-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                        <button class="btn btn-primary add-to-cart" data-id="${this.id}" style="padding: 5px 15px; font-size: 0.9rem;">
                            Köp
                        </button>
                        <button class="btn btn-ghost read-more" data-id="${this.id}" style="padding: 5px 15px; font-size: 0.9rem;">
                            Info
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
}