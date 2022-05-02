import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckoutComponent} from './checkout.component';
import {CartService} from "../service/cart.service";
import {Game} from "../service/search.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartService: CartService;
  // @ts-ignore
  let routerSpy;

  function getGame(name: string) {
    const item: Game = {
      name: name,
      image: {
        small_url: "image url"
      }
    }
    return item;
  }

  const game = getGame("Game 1")

  class MockCartService {
    items: Game[] = [game]

    addToCart(game: Game) {
      this.items.push(game)
    }

    getItems() {
      return this.items
    }

    clearCart() {
      this.items = []
    }

    removeItem(item: Game) {
      this.items = this.items.filter(it => it !== game)
    }
  }


  beforeEach(() => {
    routerSpy = {navigate: jasmine.createSpy('navigate')};
    spyOn(window, "alert")

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule],
      declarations: [CheckoutComponent],
      providers: [
        {provide: CartService, useClass: MockCartService},
        {provide: Router, useValue: routerSpy}
      ]
    })

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService)
    fixture.detectChanges()
  });

  it('total price and items are set on init', () => {
    expect(component.items).toEqual([game])
    expect(component.totalPrice).toEqual(10)
  });

  it('form fields are required', () => {
    let address = component.checkoutForm.controls['address'];
    expect(address.valid).toBeFalsy();

    let name = component.checkoutForm.controls['name'];
    expect(name.valid).toBeFalsy();
  });

  it('onSubmit should clear cart, alert user and navigate', () => {
    component.checkoutForm.controls['name'].setValue("Saul Goodman")
    component.checkoutForm.controls['address'].setValue("321 Wildwood Ave. Arden Hills, MN 55112")

    component.onSubmit()

    expect(window.alert).toHaveBeenCalledWith(`Order has been submitted for Saul Goodman`)
    // @ts-ignore
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(["/"])

    // form fields are reset
    expect(component.checkoutForm.controls['name'].value).toEqual(null)
    expect(component.checkoutForm.controls['address'].value).toEqual(null)
  })

  it('removeItem should remove it from the cart if user confirms', () => {
    spyOn(window, "confirm").and.callFake(() => true)
    component.removeItem(game)

    expect(component.items).toEqual([])
    expect(window.alert).toHaveBeenCalledWith("Game 1 has been removed from your shopping cart")
    expect(component.totalPrice).toEqual(0)
  })

  it('removeItem should  NOT remove it from the cart if user confirms', () => {
    spyOn(window, "confirm").and.callFake(() => false)
    component.removeItem(game)

    expect(component.items).toEqual([game])
    expect(component.totalPrice).toEqual(10)
  })
});
