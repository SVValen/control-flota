import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GlobalService } from 'src/app/servicios/global.service';
import { MovilServicio } from '../../modelo/movil-servicio';
import { MovilServicioService } from '../../servicios/movil-servicio.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';

@Component({
  selector: 'app-movil-servicio',
  templateUrl: './movil-servicio.component.html',
  styleUrls: ['./movil-servicio.component.css']
})
export class MovilServicioComponent implements OnInit {

  @Input() moviId: number = 0;

  seleccionado = new MovilServicio();

  columnas : string[] = ['servNombre','mosePeriodo','moseKM','acciones'];
  dataSource = new MatTableDataSource<MovilServicio>();

  form = new FormGroup({});

  mostrarFormulario = false;
  
  servicios: Servicio[] = [];

  AuxId = -1;

  constructor(
    public global: GlobalService,
    private movilServicioService: MovilServicioService,
    private servicioService: ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      moseId: [''],
      moseMoviId: [''],
      moseServId: [''],
      mosePeriodo: [''],
      moseKM: [''],
      moseFecha: [''],
      moseFechaAlta: [''],
      moseBorrado: ['']
    });

    this.movilServicioService.get(`moseMoviId=${this.moviId}`).subscribe(
      (movi) => {
        this.global.itemsMov = movi;
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
    this.dataSource.data = this.global.itemsMov;
  }

  agregar() {
    this.AuxId--;
    this.seleccionado = new MovilServicio();
    this.seleccionado.moseId = this.AuxId;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario = true;
  }

  delete(row: MovilServicio) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        row.moseBorrado = 1;
        this.actualizarTabla();
      }
    });
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

    Object.assign(this.seleccionado, this.form.value);

    this.global.itemsMov = this.global.itemsMov.filter(x => x.moseId != this.seleccionado.moseId);
    this.global.itemsMov.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

}
