import { Injectable } from '@angular/core';
import { ServicioTarea } from '../modelo/servicio-tarea';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  items: ServicioTarea[] = [];
  
  constructor() { }
}
