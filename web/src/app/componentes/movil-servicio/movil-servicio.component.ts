import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';
import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil-servicio.component.html',
  styleUrls: ['./movil-servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() moviId: number = 0;

  items : MovilServicio[] = [];

  seleccionado = new MovilServicio();

  columnas : string[] = ['servNombre','mosePeriodo','moseKM','acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();

  form = new FormGroup({});

  mostrarFormulario = false;

  formularioAgregarBitacora = false;
  
  servicios: Servicio[] = [];
  servicio: Servicio[] = [];

  constructor(
    public global: GlobalService,
    private movilServicioService: MovilServicioService,
    private servicioService: ServicioService,
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
      moseId: [''],
      moseMoviId: [''],
      moseServId: [''],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseFechaAlta: [''],
      moseBorrado: [''],

      servNombre: ['']
    });

    this.movilServicioService.get(`moseMoviId=${this.moviId}`).subscribe(
      (movi) => {
        this.items = movi;
        this.actualizarTabla();
      }
    );

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      }
    );
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilServicio();
    this.mostrarFormulario = true;
  }

  edit(seleccionado: MovilServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    if(this.seleccionado.moseId){
      this.seleccionado.moseServId = this.form.value.moseServId;

      this.movilServicioService.put(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.moseId != this.seleccionado.moseId);
      this.items.push(this.seleccionado);
    }else{
      this.seleccionado.moseMoviId = this.moviId;
      this.seleccionado.moseServId = this.form.value.moseServId;
      this.seleccionado.mosePeriodo = this.servicios.find( x => x.servId == this.seleccionado.moseServId)!.servPeriodo;
      this.seleccionado.moseKM = this.servicios.find(x => x.servId == this.seleccionado.moseServId)!.servKM;
      this.seleccionado.servNombre =this.servicios.find(x => x.servId == this.seleccionado.moseServId)!.servNombre;      
      this.movilServicioService.post(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.moseId != this.seleccionado.moseId);
      this.items.push(this.seleccionado);
    }

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  delete(seleccionado: MovilServicio) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.movilServicioService.delete(seleccionado.moseId).subscribe(
          () => {
            this.items = this.items.filter(x => x.moseId !== seleccionado.moseId);
            this.actualizarTabla();
          });
        }
      });
  }

  agregarBitacora(serv : MovilServicio){
    this.formularioAgregarBitacora = true;
    this.seleccionado = serv;
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.formularioAgregarBitacora = false;
  }

}
