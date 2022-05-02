import {TestBed} from '@angular/core/testing';

import {CartService} from './cart.service';
import {Game} from "./search.service";

function getGame(name: string) {
  const item: Game = {
    name: name,
    image: {
      small_url: "image url"
    }
  }
  return item;
}

const LOCAL_STORAGE_KEY = 'GIANTBOMB_KEY';
describe('CartService', () => {
  let cartService: CartService;
  const game1 = getGame("Metroid Prime");
  const game2 = getGame("Legend of Zelda");

  let store: Object;

  beforeEach(() => {
    let store = {}
    const mockLocalStorage = {
      getItem: (key: string): string => {
        // @ts-ignore
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        // @ts-ignore
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        // @ts-ignore
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);


    TestBed.configureTestingModule({
      providers: [
        CartService,
      ]
    });

    cartService = TestBed.inject(CartService);
  });

  describe('#addItem', () => {
    it('item should be added to cart', () => {
      const item = game1;

      cartService.addToCart(item)
      expect(cartService.items).toContain(item)
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(JSON.stringify([game1]))
    });

    it('should alert user when addItem is called and item exists in cart', () => {
      cartService.items = [game1]
      const item = game1;

      spyOn(window, "alert")

      cartService.addToCart(item)
      expect(cartService.items).toContain(item)
      expect(window.alert).toHaveBeenCalledOnceWith("Metroid Prime is already in your shopping cart")
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null)

    })
  })

  describe('#getItems', () => {
    it('should return items from cart', () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([game1]))
      expect(cartService.getItems()).toEqual([game1])
    });
  })

  describe('#clearCart', () => {
    it('items are removed from cart', () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([game1]))
      expect(cartService.clearCart()).toEqual([])
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(null)
    });
  })

  describe('#removeItem', () => {
    it('item is removed from cart', () => {
      cartService.items = [game1, game2]

      cartService.removeItem(game1)
      expect(cartService.items).toEqual([game2])
      expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toEqual(JSON.stringify([game2]))
    });
  })
});
