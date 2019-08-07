import { Injectable }           from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { RealtimePrice }        from '@shared/models/stocks-api/realtime-price.model';
import { forkJoin, Observable } from 'rxjs';
import { BaseHttpService }      from '../base-http.service';

const apiUrl = 'https://financialmodelingprep.com/';

@Injectable()
export class StocksService extends BaseHttpService {

  constructor(http: HttpClient) {
    super(http, apiUrl);
  }

  getHistoricalPrice(label: string, from: Date, to: Date): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}api/v3/historical-price-full/${label}?from=${from.toISOString()}&to=${to.toISOString()}`);
  }

  getRealtimePrice(label: string): Observable<RealtimePrice> {
    return this.http.get<RealtimePrice>(
      `${this.apiUrl}api/v3/stock/real-time-price/${label}`);
  }

  loadRealtimePrices(labels: string[]): Observable<RealtimePrice[]> {
    const responses = new Array<Observable<RealtimePrice>>();
    labels.forEach(item => {
      const response = this.getRealtimePrice(item);
      responses.push(response);
    });
    return forkJoin(...responses);
  }
}
