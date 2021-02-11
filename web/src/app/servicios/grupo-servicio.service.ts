import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ApiService } from '../core/api-service';
import {AppConfigService} from '../core/config.service';

import { GrupoServicio } from '../modelo/grupo-servicio'


@Injectable({
  providedIn: 'root'
})
export class GrupoServicioService
  extends ApiService<GrupoServicio> {

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) 
  { 
    super("grupo-servicio", http, app);
  }
}
