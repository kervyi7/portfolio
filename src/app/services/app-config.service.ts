import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppConfig } from '../interfaces/app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public config!: IAppConfig;

  constructor(private _http: HttpClient) { }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this._http.get<IAppConfig>('./assets/config.json').subscribe({
        next: (data: IAppConfig) => {
          this.config = data;
          resolve(true);
        }
      });
    });
  }
}