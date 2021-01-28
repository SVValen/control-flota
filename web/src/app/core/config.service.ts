import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';

import { Config } from './config';



@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private configUrl = 'assets/config.json';

  config = new Config();

  constructor(
    private http: HttpClient
  ) { }

  load() {
    return this.http.get<Config>(this.configUrl)
    .toPromise()
      .then((data) => {
        this.config = data;
      });
  }
}

