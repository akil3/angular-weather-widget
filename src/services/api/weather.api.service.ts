import { Inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoolingService } from '../poling.service';
import { map, filter } from 'rxjs/operators';
import { WeatherQueryParams } from '../../weather.interfaces';

@Injectable()
export abstract class WeatherApiService {
  poollingInterval = 60000 * 60;
  constructor(
    protected http: HttpClient,
    protected poolingService: PoolingService,
    @Inject('WEATHER_CONFIG') public apiConfig: WeatherApiConfig
  ) {}

  currentWeather(queryParams: WeatherQueryParams): Observable<CurrentWeather> {
    return this.callApi(queryParams, '/weather').pipe(
      map(this.mapCurrentWeatherResponse.bind(this))
    );
  }

  forecast(queryParams: WeatherQueryParams): Observable<Forecast[]> {
    return this.callApi(queryParams, '/forecast').pipe(
      map(this.mapForecastResponse.bind(this))
    );
  }

  protected callApi(
    queryParams: WeatherQueryParams,
    endpoint: string
  ): Observable<any> {
    const params = this.mapQueryParams(queryParams);
    const requestOptions = this.getRequestOptions(params);
    const apiCall: Observable<any> = this.http
      .get(`${this.apiConfig.baseUrl}/${endpoint}`, requestOptions)
      .pipe(
        map((resp: any) => resp.json()),
        filter(el => !!el)
      );
    return this.wrapWithPoll(apiCall);
  }

  protected setTokenKey(): string {
    // Implement it in child service
    return '';
  }

  protected mapQueryParams(params: WeatherQueryParams): any {
    // Implement it in child service
    return;
  }

  protected mapCurrentWeatherResponse(response: any): CurrentWeather {
    // Implement it in child service
    return <CurrentWeather>{};
  }

  protected mapForecastResponse(response: any): Forecast[] {
    // Implement it in child service
    return <Forecast[]>[];
  }

  protected mapResponseToIconUrl(response: any): string {
    return '';
  }
  protected mapResponseToIconClass(response: any): string {
    return '';
  }

  private wrapWithPoll(apiCall: Observable<any>) {
    return this.poolingService.execute(() => apiCall, this.poollingInterval);
  }

  private getRequestOptions(queryParams: Object) {
    return {
      headers: new HttpHeaders(),
      params: this.getQueryParams(queryParams)
    };
  }

  private getQueryParams(obj: { [key: string]: any }): HttpParams {
    const queryParams = new HttpParams();
    queryParams.append(this.setTokenKey(), this.apiConfig.key);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        queryParams.append(key.toString(), obj[key]);
      }
    }
    return queryParams;
  }
}

export interface CurrentWeather {
  location: string;
  temp: number;
  pressure?: number;
  humidity?: number;
  minTemp?: number;
  maxTemp?: number;
  sunrise?: number;
  sunset?: number;
  iconClass?: string;
  iconUrl?: string;
  description?: string;
  wind?: {
    deg: number;
    speed: number;
  };
}

export interface Forecast extends CurrentWeather {
  data: Date;
}

export class WeatherApiConfig {
  name: WeatherApiName = WeatherApiName.OPEN_WEATHER_MAP;
  key = 'provide secret key';
  baseUrl = 'http://api.openweathermap.org/data/2.5';
}

export enum WeatherApiName {
  OPEN_WEATHER_MAP = <any>'Open Weather Map'
}
