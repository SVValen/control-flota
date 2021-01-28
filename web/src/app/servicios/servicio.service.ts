import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Servicio } from '../modelo/servicio';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService 
  extends ApiService<Servicio>{

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) 
  {
    super("servicio", http, app) 
   }
}
