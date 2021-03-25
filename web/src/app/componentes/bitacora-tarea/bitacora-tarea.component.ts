import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';
import { AlertaExitoComponent } from 'src/app/shared/alerta-exito/alerta-exito.component';

import { BitacoraTarea } from '../../modelo/bitacora-tarea';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service';

import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service';


import { ServicioTarea } from 'src/app/modelo/servicio-tarea';
import { ServicioTareaService } from 'src/app/servicios/servicio-tarea.service';
import { MovilBitacoraService } from 'src/app/servicios/movil-bitacora.service';
 


@Component({
  selector: 'app-bitacora-tarea',
  templateUrl: './bitacora-tarea.component.html',
  styleUrls: ['./bitacora-tarea.component.css']
})
export class BitacoraTareaComponent implements OnInit {

  @Input() mobiId: number = 0;

  seleccionado = new BitacoraTarea();

  form = new FormGroup({});
  columnas: string[] = ['tareNombre','bitaObservaciones','bitaCantidad','bitaCosto','acciones'];
  dataSource = new MatTableDataSource<BitacoraTarea>();

  mostrarFormularioBitacoraTarea = false;

  tareas: Tarea[] = [];
  servicioTarea: ServicioTarea[] = [];

  AuxId = -1;

  constructor(
    private bitacoraTareaService : BitacoraTareaService,
    private tareaService: TareaService,
    private servicioTareaService: ServicioTareaService,
    private movilBitacoraService : MovilBitacoraService,
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
      bitaId: [''],
      bitaMobiId: [''],
      bitaTareId: [''],
      bitaObservaciones: [''],
      bitaCantidad: [''],
      bitaCosto: [''],
      bitaFechaAlta: [''],
      bitaBorrado: [''],

      tareNombre: ['']
    })

    this.bitacoraTareaService.get(`bitaMobiId=${this.mobiId}`).subscribe(
      (bitatare) => {
        this.bitacoraTareaService.items = bitatare;
        this.actualizartabla();
      }
    )

    this.tareaService.get().subscribe(
      (tarea) => {
        this.tareas = tarea;
      }
    )

    this.servicioTareaService.get(`setaServId=${this.movilBitacoraService.mobiSelected.mobiServId}`).subscribe(
      (servTare) => {
        this.servicioTarea = servTare;
      }
    )
  }

  actualizartabla(){
    this.dataSource.data = this.bitacoraTareaService.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar(){
    this.AuxId--;
    this.seleccionado = new BitacoraTarea();
    this.seleccionado.bitaId = this.AuxId;

    this.mostrarFormularioBitacoraTarea = true;
    this.form.reset(this.seleccionado);
  }

  edit(seleccionado: BitacoraTarea){
    this.mostrarFormularioBitacoraTarea = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }


  guardar(){
    if(!this.form.valid){
      return
    }

    Object.assign(this.seleccionado, this.form.value);
    
    this.seleccionado.bitaMobiId = this.mobiId;

    this.seleccionado.tareNombre = this.tareas.find(x => x.tareId == this.seleccionado.bitaTareId)!.tareNombre;
    this.bitacoraTareaService.items = this.bitacoraTareaService.items.filter(x => x.bitaId !== this.seleccionado.bitaId);
    this.bitacoraTareaService.items.push(this.seleccionado);
    
    this.mostrarFormularioBitacoraTarea = false;
    this.actualizartabla();
  }

  delete(seleccionado: BitacoraTarea){
    const dialog = this.matDialog.open(ConfirmarComponent);

    dialog.afterClosed().subscribe(
      (result) => {
        if(result) {
          seleccionado.bitaBorrado = 1;
          this.actualizartabla();
        }
      });
  }

  cancelar(){
    this.mostrarFormularioBitacoraTarea = false;
  }
}
