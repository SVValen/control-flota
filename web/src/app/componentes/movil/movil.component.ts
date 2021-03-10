import { Component,Input,OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilService } from '../../servicios/movil.service';
import { Movil } from '../../modelo/movil';

import { MovilGrupo} from '../../modelo/movil-grupos';
import { MovilGrupoService } from '../../servicios/movil-grupo.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';



@Component({
  selector: 'app-movil',
  templateUrl: './movil.component.html',
  styleUrls: ['./movil.component.css']
})
export class MovilComponent implements OnInit {

  items : Movil[] = [];
  seleccionado = new Movil();

  columnas : string[] = ['patente','descripcion','dependencia','marca','modelo','acciones'];
  dataSource = new MatTableDataSource<Movil>();

  form = new FormGroup({});

  mostrarFormulario = false;
  mostrarFormularioMantenimiento = false;

  gruposMovil: MovilGrupo[] = [];

  constructor(
    private movilServicio : MovilService,
    private movilGrupoService: MovilGrupoService,
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
      moviId: [''],
      moviModoFecha: [''],
      moviModoOdometro: [''],
      moviFechaAlta: [''],
      moviBorrado: [''],
      patente: [''],
      descripcion: [''],
      dependencia: [''],
      marca: [''],
      modelo: ['']
    })
    
    this.movilServicio.get("activo=1").subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    )
  
  }

  actualizarTabla() {
    this.dataSource.data = this.items.filter(
      borrado => !(borrado.moviBorrado)
    );
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verMas(seleccionado:Movil) {
    this.mostrarFormularioMantenimiento = true;
    this.seleccionado = seleccionado;

    this.movilGrupoService.get(`mogrMoviId=${this.seleccionado.moviId}`).subscribe(
      (grupos) => {
        this.gruposMovil = grupos;
      }
    )
  }

  agregar() {
    this.mostrarFormulario = true;
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.mostrarFormularioMantenimiento = false;
  }
}
