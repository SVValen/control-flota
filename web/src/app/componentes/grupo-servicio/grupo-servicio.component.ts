import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GrupoServicio } from '../../modelo/grupo-servicio';
import { GrupoServicioService } from '../../servicios/grupo-servicio.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';


@Component({
  selector: 'app-grupo-servicio',
  templateUrl: './grupo-servicio.component.html',
  styleUrls: ['./grupo-servicio.component.css']
})
export class GrupoServicioComponent implements OnInit {

  @Input() grupId: number = 0;

  seleccionado = new GrupoServicio();

  columnas: string [] = ['servNombre','grusPeriodo','grusKM','acciones'];
  dataSource = new MatTableDataSource<GrupoServicio>();
  
  form = new FormGroup({});

  mostrarFormulario = false;
  
  servicios: Servicio[] = [];

  AuxId = -1;

  constructor(
    private grupoServicioService: GrupoServicioService,
    private servicioService : ServicioService,
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
      grusId: [''],
      grusGrupId: [''],
      grusServId: [''],
      grusPeriodo: [''],
      grusKM: [''],
      grusFecha: [''],
      grusFechaAlta: [''],
      grusBorrado: [''],
      servNombre: ['']
    });

    this.grupoServicioService.get(`grusGrupId=${this.grupId}`).subscribe(
      (grus) => {
        this.grupoServicioService.items = grus;
        this.actualizarTabla();
      });

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      });
  }

  actualizarTabla() {
    this.dataSource.data = this.grupoServicioService.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.AuxId--;
    this.seleccionado = new GrupoServicio();
    this.seleccionado.grusId = this.AuxId;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario= true;
  }

  edit(seleccionado: GrupoServicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;

    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    this.seleccionado.servNombre = this.servicios.find(serv => serv.servId == this.seleccionado.grusServId)!.servNombre;
    this.grupoServicioService.items = this.grupoServicioService.items.filter(x => x.grusId !== this.seleccionado.grusId);
    this.grupoServicioService.items.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  delete(row: GrupoServicio) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        row.grusBorrado = 1;
        this.actualizarTabla();
      }
    });
  }
  
  cancelar(){
    this.mostrarFormulario = false;
  }


}
