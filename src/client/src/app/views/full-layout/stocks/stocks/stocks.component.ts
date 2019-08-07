import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Stock }                                      from '@shared/models/stock.model';
import { StocksAbstract }                             from './../stocks-abstract';

const STOCKS_TABLE = {
  headers: {
    label: {label: 'Label', type: 'text', isSortable: true},
    price: {label: 'Buy price', type: 'rounded-number', isSortable: true},
    amount: {label: 'Amount', type: 'rounded-number', isSortable: true},
    total: {label: 'Total', type: 'rounded-number', isSortable: true},
    diff: {label: 'Gain', type: 'diff', isSortable: true}
  }
};

@Component({
  selector: 'app-stocks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'stocks.component.html',
})
export class StocksComponent extends StocksAbstract implements OnInit {

  headers = STOCKS_TABLE['headers'];
  stockList: Stock[] = [];

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.loadingService.isLoading(true);
    this.stockService.getItems()
      .subscribe(res => {
        this.stockList = res;
        const labels = this.stockList.map(x => x.label);
        this.stocksService.loadRealtimePrices(labels)
          .subscribe(responses => responses.forEach(
            realtime => {
              const row = this.stockList.filter(x => x.label === realtime.symbol)[0];
              row.diff = realtime.price * row.amount - row.total;
            }))
          .add(() => {
            this.loadingService.isLoading(false);
            this.cdr.markForCheck();
          });
      });
  }
}
