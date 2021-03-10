import { Component,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { Movil } from '../../modelo/movil';
import { MovilService } from '../../servicios/movil.service';
import { MovilGrupo } from '../../modelo/movil-grupos';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';

import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-agregar-movil',
  templateUrl: './agregar-movil.component.html',
  styleUrls: ['./agregar-movil.component.css']
})
export class AgregarMovilComponent implements OnInit {

  
  items : Movil[] = [];
  seleccionado = new Movil();

  selecGrupo = new MovilGrupo();
  selecOdo = new MovilOdometro();

  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones'];
  dataSource = new MatTableDataSource<Movil>();

  //formularios
  formGrupo = new FormGroup({});

  //modelos
  moviles: Movil[] = [];
  grupos: Grupo[] = []; 

  mostrarFormularioAgregar = false;

  constructor(
    private movilServicio: MovilService,
    private grupoServicio: GrupoService,
    private movilGrupoService : MovilGrupoService,
    private movilOdometroService: MovilOdometroService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog) { }

  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    //form Grupo
    this.formGrupo = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: ['']
    })

    this.movilServicio.get("activo=0").subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
      //TODO habilitar o desabilitar botones 
    )

    this.grupoServicio.get().subscribe(
      (grup) => {
        this.grupos = grup;
      }
    )

  }

  actualizarTabla() {
    this.dataSource.data = this.items.filter(
      borrado => !(borrado.moviBorrado)
    );
  }

  agregar(seleccionado:Movil) {

    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result => {

      console.log(`Dialog result: ${result}`);

      if (result) {

        this.mostrarFormularioAgregar = true;

        this.seleccionado = seleccionado;
        this.seleccionado.moviId = this.seleccionado.movilID;

        this.movilServicio.post(this.seleccionado).subscribe();

        this.formGrupo.reset();
        this.selecGrupo = new MovilGrupo();

      }else{
        this.cancelar();
      }
    });
    
  }


  guardarGrupo() {

    //Object.assign(this.seleccionado, this.formMovil.value);
    this.selecGrupo.mogrGrupId = this.formGrupo.value.mogrGrupId;
    this.selecGrupo.mogrMoviId = this.seleccionado.moviId;

    this.movilGrupoService.post(this.selecGrupo).subscribe();
    debugger
  }

  reactivar(seleccionado: Movil) {
    this.seleccionado = seleccionado;
    this.seleccionado.moviBorrado = 0;
    
    this.movilServicio.put(this.seleccionado).subscribe();
  }

  delete(seleccionado: Movil) {

    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result => {

      console.log(`Dialog result: ${result}`);

      if (result) {
        this.seleccionado = seleccionado;
        this.movilServicio.delete(this.seleccionado.moviId).subscribe();

        this.actualizarTabla();
      }
    });
  }

  cancelar() {
    this.mostrarFormularioAgregar = false;
  }

}
