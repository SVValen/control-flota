import { Component,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { AgregarMovilService } from '../../servicios/agregar-movil.service';
import { Movil } from '../../modelo/movil';
import { MovilGrupo } from '../../modelo/movil-grupos';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';
import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';
import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';

import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';

import { Servicio } from 'src/app/modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

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
  selecServ = new MovilServicio();
  selecBit = new MovilBitacora();
  selecOdo = new MovilOdometro();

  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones'];
  dataSource = new MatTableDataSource<Movil>();

  //formularios
  formMovil = new FormGroup({});
  formGrupo = new FormGroup({});
  formServicio = new FormGroup({});
  formBitacora = new FormGroup({});
  formOdometro = new FormGroup({});

  //modelos
  grupos: Grupo[] = []; 
  servicios: Servicio[] = [];

  mostrarFormulario = false;
  mostrarFormularioMantenimiento = false;

  constructor(
    private agregarMovilServicio : AgregarMovilService,
    private grupoServicio: GrupoService,
    private servicioService: ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog) { }

  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {
    //form movil
    this.formMovil = this.formBouilder.group({
      moviId: [''],
      moviModoFecha: [''],
      moviModoOdometro: [''],
      moviFechaAlta: [''],
      moviBorrado: ['']
    })
    //form Grupo
    this.formGrupo = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: ['']
    })
    //form Servicios
    this.formServicio = this.formBouilder.group({
      moseId: [''],
      moseServId: [''],
      moseMoviId: [''],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseFechaAlta: [''],
      moseBorrado: ['']
    })

    //form Bitacora
    this.formBitacora = this.formBouilder.group({
      mobiId: [''],
      mobiMoseId: [''],
      mobiMoviId: [''],
      mobiServId: [''],
      mobiFecha: [''],
      mobiObservaciones: [''],
      mobiOdometro: [''],
      mobiProximoOdometro: [''],
      mobiProximaFecha: [''],
      mobiIdAnterior: [''],
      mobiIdSiguiente: [''], 
      mobiPendiente: [''],
      mobiFechaAlta: [''],
      mobiBorrado: ['']
    })
    //se deberia agregar bitacora? , se deberia poder agregar mas de un registro a bitacora?

    //form Odometro
    this.formOdometro = this.formBouilder.group({
      modoId: [''],
      modoMoviId: [''],
      modoFecha: [''],
      modoOdometro: [''],
      modoFechaAlta: [''],
      modoBorrado: ['']
    })


    this.agregarMovilServicio.get().subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    )

    this.grupoServicio.get().subscribe(
      (grup) => {
        this.grupos = grup;
      }
    )

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items.filter(
      borrado => !(borrado.moviBorrado)
    );
  }

  agregar(seleccionado:Movil) {
    this.mostrarFormularioMantenimiento = true;
    
    this.formMovil.reset();
    this.seleccionado = new Movil();
    
    this.formGrupo.reset();
    this.selecGrupo = new MovilGrupo();
    
    this.formServicio.reset();
    this.selecServ = new MovilServicio();
    
    this.formBitacora.reset();
    this.selecBit = new MovilBitacora();
    
    this.formOdometro.reset();
    this.selecOdo = new MovilOdometro();

    this.seleccionado = seleccionado;
    this.seleccionado.moviId;

    
    
  }

  guardar() {

    Object.assign(this.seleccionado, this.formMovil.value);
    debugger

  }

  delete(row: Movil) {

  }

  edit(seleccionado: Movil) {
   
  }


  cancelar() {
    this.mostrarFormularioMantenimiento = false;
  }


  actualizarMantenimiento(moviId: number) {

  }

}
