import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';

import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service'

import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';

import { ServicioTarea } from '../../modelo/servicio-tarea';
import { ServicioTareaService } from '../../servicios/servicio-tarea.service';

import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service';
import { AlertaExitoComponent } from 'src/app/shared/alerta-exito/alerta-exito.component';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number= 0;

  @Input() servId: number = 0;

  @Input() desdeMS: boolean = false;

  @Input() moseId: number = 0;

  items : MovilBitacora[] = []
  seleccionado= new MovilBitacora();

  columnas : string[] = ['servNombre','mobiFecha','mobiObservaciones','mobiOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});
  formTarea = new FormGroup({});

  servicios: Servicio[] = [];
  bitacoraTarea: BitacoraTarea[] = [];
  movilServicios: MovilServicio[] = [];
  servicioTarea: ServicioTarea[] = [];
  tareas: Tarea[]=[];

  bitaTarea = new BitacoraTarea();

  label = 'Bitacoras Recientes';

  mostrarFormularioAgregarBitacora = false;
  agregarTareasPreestablecidas = false;
  desdeGBitacora = false;
  disbledATP = false;

  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
    private movilServicioService: MovilServicioService,
    private servicioTareaService: ServicioTareaService,
    private tareaService: TareaService,
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
      mobiId: [''],
      mobiMoseId: [''],
      mobiServId: [''],
      mobiMoviId: [''],
      mobiFecha: [''],
      mobiObservaciones: [''],
      mobiOdometro: [''],
      mobiProximoOdometro: [''],
      mobiProximaFecha: [''],
      mobiIdAnterior: [''],
      mobiIdSiguiente: [''], 
      mobiPendiente: [''],
      mobiFechaAlta: [''],
      mobiBorrado: [''],

      servNombre: ['']
    });


    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      }
    );

    this.movilServicioService.get().subscribe(
      (movil) => {
        this.movilServicios = movil;
      }
    )

    this.bitacoraTareaService.get().subscribe(
      (bitare) => {
        this.bitacoraTarea = bitare;
      }
    )

    //agregar bitacora programadas
    if(this.desdeMS){
      this.mostrarFormularioAgregarBitacora = true;
      this.form.get('mobiServId')?.setValue(this.servId);
      this.label = 'Agregar Bitacora';
    }
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  //agregar nueva bitacora (no programada o pendiente)
  agregarNuevaBitacora() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormularioAgregarBitacora = true;
    this.disbledATP = true;
    this.label = 'Agregar nueva Bitacora'; 
  }

  edit(seleccionado: MovilBitacora) {
    this.label ="Editar Bitacora"
    this.mostrarFormularioAgregarBitacora = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  //agregar bitacora pendiente
  realizarServicio(seleccionado: MovilBitacora){
    this.mostrarFormularioAgregarBitacora = true;
    this.agregarTareasPreestablecidas = true;
    this.label = 'Agregar Bitacora Pendiente';
    this.disbledATP= false;
    this.desdeGBitacora = true;
    this.seleccionado = seleccionado;
    this.form.reset();
    this.form.get('mobiServId')!.setValue(this.seleccionado.mobiServId);
  }

   guardar() {
    if (!this.form.valid) {
      return;
    }

    let moseKM = 0;

    if(this.desdeMS){ //desde grilla movil-servicio (nuevo servicio programado)

      alert("Bitacora agregada desde movil servicio. Servicio Programado.")
      this.seleccionado.mobiMoviId = this.moviId;
      this.seleccionado.mobiServId = this.servId;
      this.seleccionado.mobiMoseId = this.moseId;
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      
      
      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;

      //actualizar mobiProximaFecha
      this.actualizarProximaFecha(this.seleccionado);

      this.seleccionado.mobiPendiente = true;
      // this.seleccionado.mobiIdAnterior && this.seleccionado.mobiIdSiguiente null pues estamos creando nueva bitacora

      this.movilBitacoraService.post(this.seleccionado).subscribe();

      //agregar tareas preestablecidas
      if(this.agregarTareasPreestablecidas){
        this.tareasPreestablecidad(this.seleccionado);
      }

      this.desdeMS = false;

    } else if (this.desdeGBitacora){ //nueva bitacora desde grilla de bitacora (servicio pendiente)

      alert("Servicio agregado desde Grilla Bitacora. Servicio Pendiente.")

      //actualizar el estado pendiente de la bitacora anterior a falso
      this.seleccionado.mobiPendiente = false;
      this.movilBitacoraService.put(this.seleccionado).subscribe();

      //cargar bitacora siguiente

      //mobiMoseId, moviMoviId y moseServ id son los mismos de la bitacora anterior
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;

      //actualizar mobiProximaFecha
      this.actualizarProximaFecha(this.seleccionado);

      this.seleccionado.mobiPendiente = true;
      this.seleccionado.mobiIdAnterior = this.seleccionado.mobiId;
      //mobIdSiguiente null

      this.movilBitacoraService.post(this.seleccionado).subscribe();

      //agregar tareas preestablecidas
      if(this.agregarTareasPreestablecidas){
        this.tareasPreestablecidad(this.seleccionado);
      }

      this.desdeGBitacora = false;

    } else if(this.seleccionado.mobiId) { //editar bitacora existente
        alert("Editar Servicio")
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        
        //si edito odometro
        if(this.form.value.mobiOdometro !== this.seleccionado.mobiOdometro ){
          this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

          moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
          this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
        }
        //si edito fecha
        if(this.form.value.mobiFecha !== this.seleccionado.mobiFecha){
          this.seleccionado.mobiFecha = this.form.value.mobiFecha;

          //actualizar mobiProximaFecha
          this.actualizarProximaFecha(this.seleccionado);
        }

        this.movilBitacoraService.put(this.seleccionado).subscribe();

        //agregar tareas preestablecidas
        if(this.agregarTareasPreestablecidas){
          this.tareasPreestablecidad(this.seleccionado);
        }

       }else{ //agregar bitacora no programada ni pendiente

        alert("Servicio agregado desde pantalla Bitacora. Servicio No Programado.")
        this.seleccionado.mobiMoviId = this.moviId;
        // this.seleccionado.mobiMoseId null pues es un servicio no programado
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
        
        
        //  this.seleccionado.mobiProximoOdometro,this.seleccionado.mobiProximaFecha, this.seleccionado.mobiIdAnterior, this.seleccionado.mobiIdSiguiente, this.seleccionado.mobiPendiente null pues es un servicio no programado

        this.movilBitacoraService.post(this.seleccionado).subscribe();
        
      }

      this.mostrarFormularioAgregarBitacora = false;

      this.items = this.items.filter(x => x.mobiId !== this.seleccionado.mobiId);
      this.seleccionado.servNombre = this.servicios.find(
                                                  x => x.servId == this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);

      this.actualizarTabla();
    }

  //actualizar mobiProximaFecha
  actualizarProximaFecha(seleccionado : MovilBitacora){
    let mosePeriodo = this.movilServicios.find(x => x.moseId = seleccionado.mobiMoseId)!.mosePeriodo;
    
    let fecha = new Date(seleccionado.mobiFecha.getFullYear(),
                        seleccionado.mobiFecha.getMonth(),
                        seleccionado.mobiFecha.getDate());

    fecha.setDate(fecha.getDate() + mosePeriodo);
    seleccionado.mobiProximaFecha = fecha;
  }

  delete(seleccionado: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        if(result) {
          this.movilBitacoraService.delete(seleccionado.mobiId).subscribe(
            () => {
              this.items = this.items.filter(x => x.mobiId !== seleccionado.mobiId);
              this.actualizarTabla();
            });
        }
      });
  }

  //confirmar agregar las tareas preestablecidas
  agregarTareasPreestablecidass(){
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        if(result) {
          this.agregarTareasPreestablecidas = true;
          this.matDialog.open(AlertaExitoComponent);
        }
      });
  }

  //agregar tareas preestablecidas
  tareasPreestablecidad(seleccionado: MovilBitacora){

    this.servicioTareaService.get().subscribe(
      (tarea) => {
        this.servicioTarea = tarea;
      }
    )

    this.tareaService.get().subscribe(
      (tareas) => {
        this.tareas = tareas;
      }
    )

    //traigo las tareas correspondientes al servicio mobiServId
    this.servicioTarea = this.servicioTarea.filter(x => x.setaServId == seleccionado.mobiServId);
    
    //por cada tarea de servicioTarea
    this.servicioTarea.forEach((i) => {

      //agregamos una bitacora tarea por cada tarea
      
      this.bitaTarea.bitaTareId = i.setaTareId;
      this.bitaTarea.bitaObservaciones = '';//this.tareas.find(x => x.tareId = i.setaTareId)!.tareDescripcion;
      this.bitaTarea.bitaMobiId = this.items.find(x => x.mobiBorrado == 0)!.mobiId;
      this.bitaTarea.bitaCosto = this.tareas.find(x => x.tareId == i.setaTareId)!.tareCosto;
      this.bitaTarea.bitaCantidad = this.tareas.find(x => x.tareId == i.setaTareId)!.tareCantidad;
    
      this.bitacoraTareaService.post(this.bitaTarea).subscribe();
      this.bitacoraTarea.filter(x => x.bitaId !== this.bitaTarea.bitaId);
      this.bitaTarea.tareNombre = this.tareas.find(x => x.tareId == i.setaTareId)!.tareNombre;
      this.bitacoraTarea.push(this.bitaTarea);

    })

  }

  cancelar() {
    this.form.reset();
    this.mostrarFormularioAgregarBitacora = false;
    this.label = 'Bitacoras Recientes'
  }
 
}
