import { Component, OnInit } from '@angular/core';
import {CartService} from "../service/cart.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  getCartItemsCount(): number {
    return this.cartService.getItems().length
  }
}
