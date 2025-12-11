export class Cart {
  constructor() {
    // Hämta sparad varukorg eller skapa en tom lista
    this.items = JSON.parse(localStorage.getItem('cart') || '[]');
    this.updateCounter();
  }

  add(product) {
    this.items.push(product);
    this.save();
    this.updateCounter();
  }

  // NY METOD: Tar bort en vara baserat på dess plats i listan (index)
  remove(index) {
    this.items.splice(index, 1);
    this.save();
    this.updateCounter();
  }

  getItems() {
    return this.items;
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCounter() {
    const counter = document.getElementById('cart-count');
    if (counter) {
        counter.textContent = this.items.length;
    }
  }
  
  clear() {
      this.items = [];
      this.save();
      this.updateCounter();
  }
}