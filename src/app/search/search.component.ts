import { Component, OnInit } from '@angular/core';
import {catchError, Observable, of, Subject} from "rxjs";
import {Game, GiantBombResult, SearchService} from "../service/search.service";
import {switchMap} from "rxjs/operators";
import {CartService} from "../service/cart.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm = new Subject<string>();

  results$: Observable<GiantBombResult | null> = this.searchTerm.pipe(
    switchMap(searchTerm => this.giantBombApiService.getResults(searchTerm)),
    catchError(errorResponse => {
      alert("oh no, there was an error when calling the api");
      console.error(errorResponse);
      return of(null);
    })
  );

  constructor(private giantBombApiService: SearchService, private cartService: CartService) {
  }

  onTextChange(changedText: string) {
    this.searchTerm.next(changedText);
  }

  addToCart(item: Game) {
    this.cartService.addToCart(item)
  }
}
