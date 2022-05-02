import {Injectable} from '@angular/core';
import {Game} from "./search.service";

const LOCAL_STORAGE_KEY = 'GIANTBOMB_KEY';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: Game[];

  constructor() {
    this.items = this.retrieve()
  }

  addToCart(product: Game) {
    if (this.items.includes(product)) {
      window.alert(`${product.name} is already in your shopping cart`);
      return;
    }
    window.alert(`${product.name} has been added to the cart.`)
    this.items.push(product);
    this.save();
  }

  getItems(): Game[] {
    return this.retrieve();
  }

  clearCart(): Game[] {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.items = [];
    return this.items;
  }

  removeItem(item: Game) {
    this.items = this.items.filter(it => it.name !== item.name);
    this.save();
  }

  private retrieve() {
    const itemsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    return itemsStr ? JSON.parse(itemsStr) : [];
  }

  private save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.items));
  }

}
