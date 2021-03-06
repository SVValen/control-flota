import { Component,Input,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilService } from '../../servicios/movil.service';
import { Movil } from '../../modelo/movil';

import { MovilGrupo} from '../../modelo/movil-grupos';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BuscadorService } from 'src/app/servicios/buscador.service';


@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit {

  items : Movil[] = [];
  seleccionado = new Movil();

  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones'];
  dataSource = new MatTableDataSource<Movil>();

  form = new FormGroup({});

  mostrarFormularioAgregarMovil = false;
  mostrarFormularioMantenimiento = false;
  mostrarFormularioEditarMovil = false;
  editarMovilF = false;

  gruposMovil: MovilGrupo[] = [];

  constructor(
    private movilServicio : MovilService,
    private movilGrupoService: MovilGrupoService,
    private buscadorService: BuscadorService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      moviId: [''],
      moviModoFecha: [''],
      moviModoOdometro: [''],
      moviFechaAlta: [''],
      moviBorrado: [''],
      patente: [''],
      descripcion: [''],
      dependencia: [''],
      marca: [''],
      modelo: [''],
      anio: [''],
      chasis: [''],
      numeromovil: [''],
      color: [''],
      seguro: [''],
      poliza: [''],
      numeromotor: ['']
    })

    this.buscadorService.getBuscador$().subscribe(
      (filtro) => {
        filtro = filtro + `activo=1`;
        this.movilServicio.get(filtro).subscribe(
          (movil) => {
            this.items = movil;
            this.actualizarTabla();
          }
        )
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verMas(seleccionado:Movil) {
    this.mostrarFormularioMantenimiento = true;
    this.seleccionado = seleccionado;
    this.movilServicio.item = seleccionado;
    this.movilGrupoService.get(`mogrMoviId=${this.seleccionado.moviId}`).subscribe(
      (grupos) => {
        this.gruposMovil = grupos;
      }
    )
  }

  agregar() {
    this.mostrarFormularioAgregarMovil = true;
  }

  edit(seleccionado : Movil){
    this.mostrarFormularioEditarMovil = true;
    this.seleccionado = seleccionado;
  }

  editarMovil(){
    this.editarMovilF = true;
  }

  delete(movil : Movil) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result => {

      console.log(`Dialog result: ${result}`);

      if (result) {

        this.seleccionado = movil;

        this.movilServicio.delete(this.seleccionado.moviId).subscribe();

        this.items = this.items.filter(x => x.moviId != this.seleccionado.moviId);
        this.actualizarTabla();

      }else{
        this.cancelar();
      }
    });
  }

  cancelar() {
    this.mostrarFormularioAgregarMovil = false;
    this.mostrarFormularioMantenimiento = false;
    this.mostrarFormularioEditarMovil = false;
    this.editarMovilF = false;
  }

  guardarMovil(){
    
  }
}
