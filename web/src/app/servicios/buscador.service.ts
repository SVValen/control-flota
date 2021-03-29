import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  private buscador$: Subject<string>;

  constructor() { 
    this.buscador$ = new Subject();
  }

  filtroSeteado(filtros: string){
    this.buscador$.next(filtros);
  }

  getBuscador$(): Observable<string>{
    return this.buscador$.asObservable();
  }
}
