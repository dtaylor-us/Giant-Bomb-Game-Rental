import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";

export interface Game {
  name: string;
  image: {
    small_url: string
  }
}

export interface GiantBombResult {
  results: Game[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private httpClient: HttpClient) {}

  getResults(searchTerm: string): Observable<GiantBombResult | null> {
    // NOTE: If no search term is present in input. The API accepts "" as a valid query param and returns records.
    return searchTerm ? this.httpClient.jsonp<GiantBombResult>(this.getSearchUrl(searchTerm), 'json_callback') : of(null);
  }

   getSearchUrl(searchTerm: string) {
    return environment.apiUrl + "/search/?api_key=" + environment.giantBombApiKey + "&format=jsonp&field_list=name,image&resources=game&limit=12&query=" + "\"" + searchTerm + "\"";
  }
}


