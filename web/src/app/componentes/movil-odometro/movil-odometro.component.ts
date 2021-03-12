import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilOdometro } from '../../modelo/movil-odometro';
import { MovilOdometroService } from '../../servicios/movil-odometro.service';
import { Movil } from '../../modelo/movil';
import { MovilService } from '../../servicios/movil.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-movil-odometro',
  templateUrl: './movil-odometro.component.html',
  styleUrls: ['./movil-odometro.component.css']
})
export class MovilOdometroComponent implements OnInit {

  @Input() moviId: number = 0;

  items : MovilOdometro[] = [];
  seleccionado = new MovilOdometro();

  moviles: Movil[] = [];
  movil = new Movil();


  columnas : string[] = ['modoFecha','modoOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilOdometro>();
  form = new FormGroup({});

  constructor(
    private movilOdometroService: MovilOdometroService,
    private movilService: MovilService,
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
      modoId:[''],
      modoMoviId:[''],
      modoFecha:[''],
      modoOdometro:[''],
      modoFechaAlta:[''],
      modoBorrado:[''],

      moviModoOdometro: [''],
      moviModoFecha: [''],
      moviId: ['']
    });

    this.movilOdometroService.get(`modoMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.items = movil;
        this.actualizarTabla();
      }
    )

    this.movilService.get("activo=1").subscribe(
     (movil) => {
       this.moviles = movil;
     } 
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilOdometro();
  }

  edit(seleccionado: MovilOdometro) {
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    if(this.seleccionado.modoId){
      // editar odometro
      this.seleccionado.modoOdometro = this.form.value.modoOdometro;
      this.seleccionado.modoFecha = this.form.value.modoFecha;

      this.movilOdometroService.put(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.modoId != this.seleccionado.modoId);
      this.items.push(this.seleccionado);
    }else{
      //agregar odometro
      this.seleccionado.modoOdometro = this.form.value.modoOdometro;
      this.seleccionado.modoFecha = this.form.value.modoFecha;
      this.seleccionado.modoMoviId = this.moviId;

      // actualizar odometro y fecha odometro de movil
      
      this.movil.moviBorrado = this.moviles.find(x => x.moviId == this.seleccionado.modoMoviId)!.moviBorrado;
      this.movil.moviId = this.seleccionado.modoMoviId;
      this.movil.moviModoOdometro = this.seleccionado.modoOdometro;
      this.movil.moviModoFecha = this.seleccionado.modoFecha;

      this.movilService.put(this.movil).subscribe();

      this.movilOdometroService.post(this.seleccionado).subscribe();
      this.items = this.items.filter(x => x.modoId != this.seleccionado.modoId);
      this.items.push(this.seleccionado);
    }

    this.form.reset();
    this.actualizarTabla();

  }

  delete(seleccionado: MovilOdometro) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);

        if (result) {
          this.movilOdometroService.delete(seleccionado.modoId).subscribe(
            () => {
              this.items = this.items.filter( x => x.modoId !== seleccionado.modoId);
              this.actualizarTabla();
            });
        }
      });
  }

  cancelar() {
    this.form.reset();
    this.actualizarTabla();
  }

}
