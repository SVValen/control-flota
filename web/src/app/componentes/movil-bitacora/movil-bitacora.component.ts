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

  mostrarFormulario = false;

  servicios: Servicio[] = [];
  bitacoraTarea: BitacoraTarea[] = [];
  movilServicios: MovilServicio[] = [];

  label = 'Agregar Nueva Bitacora'

  mostrarFormularioAgregarBitacora = false;

  desdeGBitacora = false;

  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
    private movilServicioService: MovilServicioService,
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

    if(this.desdeMS){
      this.mostrarFormularioAgregarBitacora = true;
    }
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  agregarNuevaBitacora() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormularioAgregarBitacora = true;
    this.label = 'Agregar nueva Bitacora'; 
  }

  edit(seleccionado: MovilBitacora) {
    this.label ="Editar Bitacora"
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  realizarServicio(seleccionado: MovilBitacora){
    this.mostrarFormularioAgregarBitacora = true;
    this.desdeGBitacora = true;
    this.form.reset();
    this.seleccionado = seleccionado;
  }

   guardar() {
    if (!this.form.valid) {
      return;
    }

    let moseKM = 0;
    let mosePeriodo =0;

    //desde grilla movil-servicio (nuevo servicio programado)

    if(this.desdeMS){

      alert("Bitacora agregada desde movil servicio. Servicio Programado.")
      this.seleccionado.mobiMoviId = this.moviId;
      this.seleccionado.mobiServId = this.servId;
      this.seleccionado.mobiMoseId = this.moseId;
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
      
      
      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      mosePeriodo = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.mosePeriodo;

      // TODO asignar this.seleccionado.mobiProximaFecha es un bardo D:
      let n1 = this.seleccionado.mobiOdometro;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      this.seleccionado.mobiPendiente = true;
      // this.seleccionado.mobiIdAnterior && this.seleccionado.mobiIdSiguiente null pues estamos creando nueva bitacora

      this.movilBitacoraService.post(this.seleccionado).subscribe();

      this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
      this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);
      this.desdeMS = false;


      //nueva bitacora desde grilla de bitacora (servicio pendiente)

    } else if (this.desdeGBitacora){

      alert("Servicio agregado desde Grilla Bitacora. Servicio Pendiente.")
      //actualizar el estado pendiente de la bitacora anterior a falso
      this.seleccionado.mobiPendiente = false;
      this.seleccionado;
      debugger
      this.movilBitacoraService.put(this.seleccionado).subscribe();

      //cargar bitacora siguiente

      //mobiMoseId, moviMoviId y moseServ id son los mismos de la bitacora anterior
      this.seleccionado.mobiFecha = this.form.value.mobiFecha;
      this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
      this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

      moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
      this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      //mobiProximafecha un bardo calcular
      this.seleccionado.mobiPendiente = true;
      this.seleccionado.mobiIdAnterior = this.seleccionado.mobiId;
      //mobIdSiguiente null

      this.movilBitacoraService.post(this.seleccionado).subscribe();

      this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
      this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
      this.items.push(this.seleccionado);

      this.desdeGBitacora = false;


      // si no entra en ninguno de los casos anteriores es una bitacora no programada, desde la pantalla bitacora o un editar bitacora
    } else if(this.seleccionado.mobiId) {
        alert("Editar Servicio")
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;

        moseKM = this.movilServicios.find(x => x.moseId = this.seleccionado.mobiMoseId)!.moseKM;
        this.seleccionado.mobiProximoOdometro = +this.seleccionado.mobiOdometro + +moseKM;
      
        //TODO actualizar valor mobiProximaFecha

        this.movilBitacoraService.put(this.seleccionado).subscribe();
        this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
        this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
        this.items.push(this.seleccionado);

       }else{

        alert("Servicio agregado desde pantalla Bitacora. Servicio No Programado.")
        this.seleccionado.mobiMoviId = this.moviId;
        // this.seleccionado.mobiMoseId null pues es un servicio no programado
        this.seleccionado.mobiServId = this.form.value.mobiServId;
        this.seleccionado.mobiFecha = this.form.value.mobiFecha;
        this.seleccionado.mobiObservaciones = this.form.value.mobiObservaciones;
        this.seleccionado.mobiOdometro = this.form.value.mobiOdometro;
        
        
        //  this.seleccionado.mobiProximoOdometro,this.seleccionado.mobiProximaFecha, this.seleccionado.mobiIdAnterior, this.seleccionado.mobiIdSiguiente, this.seleccionado.mobiPendiente null pues es un servicio no programado

        this.movilBitacoraService.post(this.seleccionado).subscribe();
        this.items = this.items.filter(x => x.mobiId != this.seleccionado.mobiId);
        this.seleccionado.servNombre = this.servicios.find(x => x.servId = this.seleccionado.mobiServId)!.servNombre;
        this.items.push(this.seleccionado);
      }
      this.mostrarFormularioAgregarBitacora = false;
      this.actualizarTabla();
    }

  delete(seleccionado: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.movilBitacoraService.delete(seleccionado.mobiId).subscribe(
            () => {
              this.items = this.items.filter(x => x.mobiId !== seleccionado.mobiId);
              this.actualizarTabla();
            });
        }
      });
  }


  cancelar() {
    this.form.reset();
    this.mostrarFormularioAgregarBitacora = false;
  }
 
}
