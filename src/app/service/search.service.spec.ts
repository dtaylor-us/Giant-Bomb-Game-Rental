import {TestBed} from '@angular/core/testing';

import {GiantBombResult, SearchService} from './search.service';
import {HttpBackend, JsonpClientBackend} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {environment} from "../../environments/environment";

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // Use the HttpBackend instead of the JsonpClientBackend
      providers: [SearchService, {provide: JsonpClientBackend, useExisting: HttpBackend}]
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('#getResults', () => {
    it('should return an Observable<GiantBombResult>', () => {
      const expectedResults: GiantBombResult = {
        results: [
          {
            name: "Metroid Prime",
            image: {
              small_url: "image url"
            }
          }
        ]
      }

      const expectedUrl = `https://www.giantbomb.com/api/search/?api_key=${environment.apiKey}&format=jsonp&field_list=name,image&resources=game&limit=12&query=\"Metroid Prime\"`;


      service.getResults("Metroid Prime").subscribe(data => {
        expect(data).toEqual(expectedResults)
      })

      const req = httpMock.expectOne(request => request.url === expectedUrl);
      // expect(req.request.method).toBe('JSONP');
      req.flush(expectedResults);
    })

    it('should return an Observable<null> if no search term passed in', () => {


      const expectedUrl = `https://www.giantbomb.com/api/search/?api_key=${environment.apiKey}&format=jsonp&field_list=name,image&resources=game&limit=12&query=\"Metroid Prime\"`;


      service.getResults("").subscribe(data => {
        expect(data).toEqual(null)
      })

      httpMock.expectNone(request => request.url === expectedUrl);
      // expect(req.request.method).toBe('JSONP');
    })

  });
});
