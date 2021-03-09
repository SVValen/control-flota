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


  constructor(
    private movilGrupoService: MovilGrupoService,
    private gruposService: GrupoService,
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
      mogrId: [''],
      mogrMoviId: [''],
      mogrGrupId: [''],
      mogrFechaAlta: [''],
      mogrBorrado: ['']
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
  }

  agregar() {

  }

  delete() {

  }

  camcelar() {

  }

  edit() {

  }
}
