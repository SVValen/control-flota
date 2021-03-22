import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { ServicioTareaService } from '../../servicios/servicio-tarea.service';
import { ServicioTarea } from '../../modelo/servicio-tarea'
import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service';

@Component({
  selector: 'app-servicio-tarea',
  templateUrl: './servicio-tarea.component.html',
  styleUrls: ['./servicio-tarea.component.css']
})
export class ServicioTareaComponent implements OnInit {

  @Input() servId: number = 0;

  seleccionado = new ServicioTarea();

  columnas: string[] = ['tareNombre','acciones'];
  dataSource = new MatTableDataSource<ServicioTarea>();

  form = new FormGroup({});

  mostrarFormulario = false;

  tarea: Tarea[] = [];

  AuxId = -1;

  constructor(

    private servicioTareaService: ServicioTareaService,
    private tareaService: TareaService,
    private formBouilder: FormBuilder,
    public matDialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      setaId: [''],
      setaServId: [''],
      setaTareId: [''],
      setaFechaAlta: [''],
      setaBorrado: [''],
      tareNombre: ['']
    });

    this.servicioTareaService.get(`setaServId=${this.servId}`).subscribe(
      (servTare) => {
        this.servicioTareaService.items = servTare;
        this.actualizarTabla();
      });

    this.tareaService.get().subscribe(
      (tareas) => {
        this.tarea = tareas;
      });
  }

  actualizarTabla() {
    this.dataSource.data = this.servicioTareaService.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.AuxId--;
    this.seleccionado = new ServicioTarea();
    this.seleccionado.setaId = this.AuxId;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  edit(seleccionado: ServicioTarea) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.tareNombre = this.tarea.find(tarea => tarea.tareId == this.seleccionado.setaTareId)!.tareNombre;
    this.servicioTareaService.items = this.servicioTareaService.items.filter(x => x.setaId != this.seleccionado.setaId);
    this.servicioTareaService.items.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  delete(row: ServicioTarea) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        row.setaBorrado = 1;
        this.actualizarTabla();
      }
    });
  }

  cancelar(){
    this.mostrarFormulario = false;
  }
}
