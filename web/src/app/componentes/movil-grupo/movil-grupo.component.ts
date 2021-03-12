import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { MovilGrupo } from '../../modelo/movil-grupos';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';

import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmarComponent } from 'src/app/shared/confirmar/confirmar.component';

@Component({
  selector: 'app-movil-grupo',
  templateUrl: './movil-grupo.component.html',
  styleUrls: ['./movil-grupo.component.css']
})
export class MovilGrupoComponent implements OnInit {

  @Input() moviId: number = 0;

  items : MovilGrupo[] = [];

  seleccionado = new MovilGrupo();

  columnas: string[] = ['grupNombre','grupDescripcion','acciones'];

  dataSource = new MatTableDataSource<MovilGrupo>();

  form = new FormGroup({});

  mostrarFormulario = false;

  grupos: Grupo[] = [];

  label = '';


  constructor(
    private movilGrupoService: MovilGrupoService,
    private gruposService: GrupoService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog,
    
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: [''],
      grupNombre:[''],
      grupDescripcion: ['']
    });

    this.movilGrupoService.get(`mogrMoviId=${this.moviId}`).subscribe(
      (grup) => {
        this.items = grup;
        this.actualizarTabla();
      }
    )

    this.gruposService.get().subscribe(
      (grupos) => {
        this.grupos = grupos;
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilGrupo();
    this.mostrarFormulario = true;
    this.label = 'Agregar Grupo'
  }

  editar(selec: MovilGrupo) {
    this.mostrarFormulario = true;
    this.seleccionado = selec;
    this.form.setValue(selec);
    this.label = 'Editar Grupo'
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    if(this.seleccionado.mogrId) {
      this.seleccionado.mogrGrupId = this.form.value.mogrGrupId;

      this.movilGrupoService.put(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.mogrId != this.seleccionado.mogrId);
      this.items.push(this.seleccionado);

    }else{
      this.seleccionado.mogrMoviId = this.moviId;
      this.seleccionado.mogrGrupId = this.form.value.mogrGrupId;

      this.movilGrupoService.post(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.mogrId != this.seleccionado.mogrId);
      this.items.push(this.seleccionado);
    }

    this.mostrarFormulario = false;
    this.actualizarTabla();

  }

  delete(seleccionado: MovilGrupo) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);

        if (result) {
          this.movilGrupoService.delete(seleccionado.mogrId).subscribe(
            () => {
              this.items = this.items.filter( x => x.mogrId !== seleccionado.mogrId);
              this.actualizarTabla();
            });
        }
      });
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

}
