import {Component, OnInit} from '@angular/core';
import {CartService} from "../service/cart.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {Game} from "../service/search.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  items: Game[] = [];

  checkoutForm: FormGroup = new FormGroup({});
  totalPrice: number = 0;
  dueDate: Date = new Date(Date.now() + 12096e5);

  constructor(private cartService: CartService, private router: Router) {
  }

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required])
    })
    this.items = this.cartService.getItems();
    this.totalPrice = this.calculatePrice();
  }

  onSubmit(): void {
    this.items = this.cartService.clearCart();
    window.alert(`Order has been submitted for ${this.checkoutForm.controls['name'].value}`)
    this.checkoutForm.reset();
    this.router.navigate(['/'])
  }


  removeItem(item: Game) {
    const shouldDelete = window.confirm("Are you sure you want to delete this item from cart?");
    if (shouldDelete) {
      this.cartService.removeItem(item);
      window.alert(`${item.name} has been removed from your shopping cart`)
      this.items = this.cartService.getItems()
      this.totalPrice = this.calculatePrice()
    }
  }

  private calculatePrice() {
    return this.items.length * 10;
  }
}
