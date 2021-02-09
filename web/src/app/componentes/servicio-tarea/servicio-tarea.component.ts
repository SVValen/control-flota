import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GlobalService } from '../../servicios/global.service';
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

  columnas: string[] = ['tareNombre','setaServId','setaTareId', 'acciones'];
  dataSource = new MatTableDataSource<ServicioTarea>();

  form = new FormGroup({});

  mostrarFormulario = false;

  tarea: Tarea[] = [];

  AuxId = -1;

  constructor(
    public global: GlobalService,
    private servicioTareaService: ServicioTareaService,
    private tareaService: TareaService,
    private formBouilder: FormBuilder,
    public matDialog: MatDialog
  ) { }

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
        this.global.items = servTare;
        this.actualizarTabla();
      });

    this.tareaService.get().subscribe(
      (tareas) => {
        this.tarea = tareas;
      });
  }

  actualizarTabla() {
    this.dataSource.data = this.global.items.filter(
      borrado => !(borrado.setaBorrado));
  }

  agregar() {
    this.AuxId--;
    this.seleccionado = new ServicioTarea();
    this.seleccionado.setaId = this.AuxId;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
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

    this.global.items = this.global.items.filter(x => x.setaId != this.seleccionado.setaId);
    this.global.items.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  cancelar(){
    this.mostrarFormulario = false;
  }
}
