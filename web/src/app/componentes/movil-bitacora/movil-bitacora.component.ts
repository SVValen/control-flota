import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { MovilBitacora } from '../../modelo/movil-bitacora';
import { MovilBitacoraService } from '../../servicios/movil-bitacora.service';
import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service';
import { BitacoraTareaService } from '../../servicios/bitacora-tarea.service'
import { BitacoraTarea } from 'src/app/modelo/bitacora-tarea';

@Component({
  selector: 'app-movil-bitacora',
  templateUrl: './movil-bitacora.component.html',
  styleUrls: ['./movil-bitacora.component.css']
})
export class MovilBitacoraComponent implements OnInit {

  @Input() moviId: number= 0;

  items : MovilBitacora[] = []

  itemBitacoraTarea: BitacoraTarea[] = [];

  seleccionado= new MovilBitacora();

  columnas : string[] = ['servNombre','mobiFecha','mobiObservaciones','mobiOdometro','acciones'];
  dataSource = new MatTableDataSource<MovilBitacora>();

  form = new FormGroup({});

  mostrarFormulario = false;

  servicios: Servicio[] = [];

  constructor(
    private movilBitacoraService: MovilBitacoraService,
    private servicioService: ServicioService,
    private bitacoraTareaService: BitacoraTareaService,
    private formBouilder: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.formBouilder.group({
      mobiId: [''],
      mobiMoseId: [''],
      mobiServId: [''],
      mobiMoviId: [''],
      mobiFecha: [''],
      mobiObservaciones: [''],
      mobiOdometro: [''],
      mobiProximoOdometro: [''],
      mobiProximaFecha: [''],
      mobiIdAnterior: [''],
      mobiIdSiguiente: [''], 
      mobiPendiente: [''],
      mobiFechaAlta: [''],
      mobiBorrado: ['']
    });

    this.movilBitacoraService.get(`mobiMoviId=${this.moviId}`).subscribe(
      (movil) => {
        this.items = movil;
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
    this.dataSource.data = this.items;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.seleccionado = new MovilBitacora();
    this.mostrarFormulario = true;
    
  }

  delete(row: MovilBitacora) {
    const dialogRef = this.matDialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.movilBitacoraService.delete(row.mobiId).subscribe(
            () => {
              this.items = this.items.filter(
                (item) => {
                  if (item.mobiId != row.mobiId) {
                    return true
                  } else {
                    return false
                  }
                });
                this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: MovilBitacora) {
   this.mostrarFormulario = true;
   this.seleccionado = seleccionado;
   this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.mobiId) {
      this.movilBitacoraService.put(this.seleccionado).subscribe(
        () => {
          this.actualizarDetalle(this.seleccionado.mobiId);
        });
    }else{
      this.movilBitacoraService.post(this.seleccionado).subscribe(
        (mobi) => {
          this.items = mobi;
          this.actualizarDetalle(this.seleccionado.mobiId);
        });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  actualizarDetalle(mobiId: number){
    this.itemBitacoraTarea.forEach((i) => {
      i.bitaMobiId = mobiId;

      if(i.bitaBorrado) {
        this.bitacoraTareaService.delete(i.bitaId).subscribe();
      }

      if (i.bitaId < 0) {
        this.bitacoraTareaService.post(i).subscribe();
      }

      if (i.bitaId > 0) {
        this.bitacoraTareaService.put(i).subscribe();        
      }
    });

    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

 


}
