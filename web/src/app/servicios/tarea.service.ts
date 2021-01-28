import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Tarea } from '../modelo/tarea';

import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';

@Injectable({
  providedIn: 'root'
})
export class TareaService 
  extends ApiService<Tarea>{

  constructor(
    protected http: HttpClient,
    protected app: AppConfigService,
  ) 
  {
    super("tarea", http, app);
   }
}
