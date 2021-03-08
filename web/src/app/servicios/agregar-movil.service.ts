import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ApiService } from '../core/api-service';
import {AppConfigService} from '../core/config.service';

import { Movil } from '../modelo/movil';

@Injectable({
  providedIn: 'root'
})
export class AgregarMovilService
  extends ApiService<Movil> {

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) 
  { super('agregar-movil',http,app)}
}
