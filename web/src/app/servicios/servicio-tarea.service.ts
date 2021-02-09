import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { ServicioTarea } from '../modelo/servicio-tarea';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioTareaService
  extends ApiService<ServicioTarea> {

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) 
  { 
    super("servicio-tarea",http, app)
  }
}
