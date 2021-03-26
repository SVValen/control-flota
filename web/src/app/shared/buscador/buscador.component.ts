import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { Movil } from '../../modelo/movil';
import { MovilService } from '../../servicios/movil.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  @Output() buscando = new EventEmitter<Movil[]>();

  @Input() desdeMovil : boolean = false;

  constructor(
    private movilServicio: MovilService
  ) { }

  patente: string = '';
  descripcion: string ='';
  dependencia: string ='';

  Buscar = false;

  ngOnInit(): void {
  }

  buscar(){

    if(this.desdeMovil){
      console.log(true);
      if(!this.patente && !this.descripcion && !this.dependencia){
        alert("Busque por algun filtro")
        this.movilServicio.items = [];
      }
      if(this.patente && !this.descripcion && !this.dependencia){
        this.movilServicio.get(`patente=${this.patente}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items = moviles;
          }
        )
      } else if(this.descripcion && !this.patente && !this.dependencia){
        this.movilServicio.get(`descripcion=${this.descripcion}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items;
          }
        )
      } else if(this.dependencia && !this.patente && !this.descripcion ){
        this.movilServicio.get(`dependencia=${this.dependencia}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items = moviles;
          }
        )
      }
  
      if(this.patente && this.descripcion){
      } else if (this.patente && this.dependencia){
        this.movilServicio.get(`patente=${this.patente}&dependencia=${this.dependencia}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items = moviles;
          }
        )
      } else if(this.descripcion && this.dependencia){
        this.movilServicio.get(`descripcion=${this.descripcion}&dependencia=${this.dependencia}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items = moviles;
          }
        )
      } else if(this.patente && this.descripcion && this.dependencia){
        this.movilServicio.get(`patente=${this.patente}&descripcion=${this.descripcion}&dependencia=${this.dependencia}&activo=1`).subscribe(
          (moviles) => {
            this.movilServicio.items = moviles;
          }
        )
      }
    }

    this.buscando.emit(this.movilServicio.items);
  }

  
}
