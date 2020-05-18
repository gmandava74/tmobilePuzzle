import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  StocksAppConfig,
  StocksAppConfigToken
} from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError,
  FetchPriceByDatesQuery
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
       /* return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
              action.period
            }?token=${this.env.apiKey}`
          ) */

          return this.httpClient
          .get(
            `${this.env.apiURL}/api/fetchStocks/${action.symbol}/${
              action.period
            }?token=${this.env.apiKey}`
          )
          .pipe(
            map(resp => {
              console.log(resp)
              return new PriceQueryFetched(resp as PriceQueryResponse[]);
            })
          );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  @Effect() loadPriceDateQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceDatesQuery,
    {
      run: (action: FetchPriceByDatesQuery, state: PriceQueryPartialState) => {
        /*return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/${
              action.period
            }?token=${this.env.apiKey}`
          )*/

          return this.httpClient
          .get(
            `${this.env.apiURL}/api/fetchStocks/${action.symbol}/max?token=${this.env.apiKey}`
          )
          .pipe(
            map(resp => {
              const fullResponse : PriceQueryResponse[] = resp as PriceQueryResponse[]
              const filterResponse : PriceQueryResponse[] =  fullResponse.filter( (res :PriceQueryResponse) => res.date && new Date(res.date) > new Date(action.startDate)
               &&  new Date(res.date) < new Date(action.endDate))
              return new PriceQueryFetched(filterResponse);
            })
          );
      },
      onError: (action: FetchPriceByDatesQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {}
}