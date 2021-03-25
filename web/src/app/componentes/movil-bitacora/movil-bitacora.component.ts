import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { AlertaExitoComponent } from 'src/app/shared/alerta-exito/alerta-exito.component';

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
import { MovilService } from 'src/app/servicios/movil.service';


@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() desdeMS: boolean = false;

  items : MovilBitacora[] = []
  seleccionado= new MovilBitacora();

  columnas : string[] = ['servNombre','mobiFecha','mobiObservaciones','mobiProximoOdometro','mobiProximaFecha','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});
  formTarea = new FormGroup({});

  servicios: Servicio[] = [];
  bitacoraTarea: BitacoraTarea[] = [];
  movilServicios: MovilServicio[] = [];

  bitaTarea = new BitacoraTarea();

  label = 'Bitacoras Recientes';

  mostrarFormularioAgregarBitacora = false;
  agregarTareasPreestablecidas = false;
  desdeGBitacora = false;
  disbledATP = false;

  constructor(
    public movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
    private movilServicioService: MovilServicioService,
    private movilService: MovilService,
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


    this.movilBitacoraService.get(`mobiMoviId=${this.movilService.item.moviId}`).subscribe(
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

    this.movilServicioService.get(`moseMoviId=${this.movilService.item.moviId}`).subscribe(
      (movil) => {
        this.movilServicios = movil;
      }
    )

    //agregar bitacora programadas
    if(this.desdeMS){
      this.movilBitacoraService.mobiSelected.mobiServId = this.movilServicioService.items.moseServId;
      this.mostrarFormularioAgregarBitacora = true;
      this.form.get('mobiServId')?.setValue(this.movilServicioService.items.moseServId);
      this.label = 'Agregar Bitacora';
    }
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  //agregar nueva bitacora (no programada ni pendiente)
  agregarNuevaBitacora() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormularioAgregarBitacora = true;
    this.disbledATP = true;
    this.label = 'Agregar nueva Bitacora'; 
  }

  edit(seleccionado: MovilBitacora) {
    this.movilBitacoraService.mobiSelected.mobiServId = seleccionado.mobiServId;
    this.label ="Editar Bitacora"
    this.mostrarFormularioAgregarBitacora = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  //agregar bitacora pendiente
  realizarServicio(seleccionado: MovilBitacora){
    this.movilBitacoraService.mobiSelected.mobiServId = seleccionado.mobiServId;
    this.mostrarFormularioAgregarBitacora = true;
    this.label = 'Agregar Bitacora Pendiente';
    this.desdeGBitacora = true;
    this.seleccionado = seleccionado;
    this.movilBitacoraService.mobiSelected = seleccionado;
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
      this.seleccionado.mobiMoviId = this.movilServicioService.items.moseMoviId;
      this.seleccionado.mobiServId = this.movilServicioService.items.moseServId;
      this.seleccionado.mobiMoseId = this.movilServicioService.items.moseId;
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

      this.items = this.items.filter(x => x.mobiId !== this.seleccionado.mobiId);
      this.items.push(this.seleccionado);
      this.agregarTareas(this.seleccionado.mobiId);

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
      this.agregarTareas(this.seleccionado.mobiId);

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

        this.movilBitacoraService.put(this.seleccionado).subscribe(
          () => {
            this.items = this.items.filter(x => x.mobiId !== this.seleccionado.mobiId);
            this.items.push(this.seleccionado);
            this.agregarTareas(this.seleccionado.mobiId);
          }
        );

       }else{ //agregar bitacora no programada ni pendiente

        alert("Servicio agregado desde pantalla Bitacora. Servicio No Programado.")
        this.seleccionado.mobiMoviId = this.movilService.item.moviId;
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
      this.seleccionado.servNombre = this.servicios.find(x => x.servId == this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);
      this.actualizarTabla();
      
    }

  agregarTareas(mobiId: number){
    this.bitacoraTareaService.items.forEach((i) => {
      i.bitaMobiId = mobiId;

      if(i.bitaBorrado){
        this.bitacoraTareaService.delete(i.bitaId).subscribe();
      }
      if(i.bitaId > 0){
        this.bitacoraTareaService.put(i).subscribe();
      }
      if(i.bitaId < 0){
        this.bitacoraTareaService.post(i).subscribe();
      }
    });
    this.mostrarFormularioAgregarBitacora = false;
    this.actualizarTabla;
  }

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

  mobiServIdChange(event: any){
    console.log(event.value);

    this.movilBitacoraService.mobiSelected.mobiServId = event.value;
  }

  cancelar() {
    this.form.reset();
    this.mostrarFormularioAgregarBitacora = false;
    this.label = 'Bitacoras Recientes'
    this.movilBitacoraService.mobiSelected.mobiServId = 0;
  }
 
}
