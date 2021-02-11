import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GrupoServicio } from '../../modelo/grupo-servicio';
import { GrupoServicioService } from '../../servicios/grupo-servicio.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { Grupo } from 'src/app/modelo/grupo';

@Component({
  selector: 'app-grupo-servicio',
  templateUrl: './grupo-servicio.component.html',
  styleUrls: ['./grupo-servicio.component.css']
})
export class GrupoServicioComponent implements OnInit {

  @Input() grupId: number = 0;

  seleccionado = new GrupoServicio();

  columnas: string [] = ['servNombre','grusPeriodo','grusKM','grusFecha','acciones'];
  dataSource = new MatTableDataSource<GrupoServicio>();
  
  form = new FormGroup({});

  mostrarFormulario = false;
  
  servicios: Servicio[] = [];

  AuxId = -1;

  constructor(
    public global: GlobalService,
    private grupoServicioService: GrupoServicioService,
    private servicioService : ServicioService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog

  ) { }

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
        this.global.itemsServ = grus;
        this.actualizarTabla();
      });

    this.servicioService.get().subscribe(
      (serv) => {
        this.servicios = serv;
      });
  }

  actualizarTabla() {
    this.dataSource.data = this.global.itemsServ.filter(
      borrado => !(borrado.grusBorrado));
  }

  agregar() {
    this.AuxId--;
    this.seleccionado = new GrupoServicio();
    this.seleccionado.grusId = this.AuxId;

    this.form.setValue(this.seleccionado);
    this.mostrarFormulario= true;
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
    this.global.itemsServ = this.global.itemsServ.filter(x => x.grusId != this.seleccionado.grusId);
    this.global.itemsServ.push(this.seleccionado);

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  cancelar(){
    this.mostrarFormulario = false;
  }


}
