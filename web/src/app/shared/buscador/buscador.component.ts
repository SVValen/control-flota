import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BuscadorService } from 'src/app/servicios/buscador.service';

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
    private movilServicio: MovilService,
    private buscadorService: BuscadorService
  ) { }

  patente: string = '';
  descripcion: string ='';
  dependencia: string ='';

  filtro: string = '';


  ngOnInit(): void {
  }

  buscar(){

    if(this.patente){
      this.filtro = this.filtro + `patente=${this.patente}&`;
      
    }
    if(this.descripcion){
      this.filtro = this.filtro + `descripcion=${this.descripcion}&`;
      
    }
    if(this.dependencia){
      this.filtro = this.filtro + `dependencia=${this.dependencia}&`;
      
    }

    this.buscadorService.filtroSeteado(this.filtro);
    console.log(this.filtro);

    this.filtro = '';

    console.log(this.filtro);
  }

}
