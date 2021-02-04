import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Tarea } from '../../modelo/tarea';
import { TareaService } from '../../servicios/tarea.service'
import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Grupo } from 'src/app/modelo/grupo';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit,AfterViewInit {

  items : Tarea[] = [];
  seleccionado = new Tarea();

  label='';

  columnas: string[] = ['tareId','tareNombre','tareDescripcion','tareUnidadMedida','tareCantidad','tareCosto','acciones']
  dataSource = new MatTableDataSource<Tarea>();

  form = new FormGroup({});

  mostrarFormulario = false;

  constructor(
    private tareaService: TareaService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tareId: [''],
      tareNombre: ['',Validators.required],
      tareDescripcion: ['',Validators.required],
      tareUnidadMedida: ['',Validators.required],
      tareCantidad: ['',Validators.required],
      tareCosto: ['']
    });

    this.tareaService.get().subscribe(
      (tarea) => {
        this.items = tarea;
        this.actualizarTabla();
      }
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.label = 'Agregar tarea';
    this.form.reset();
    this.seleccionado = new Tarea();
    this.mostrarFormulario = true;
  }

  delete(row: Tarea) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.tareaService.delete(row.tareId)
            .subscribe(() => {
              this.items = this.items.filter((item) => {
                if (item.tareId != row.tareId) {
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

  edit(seleccionado: Tarea) {
    this.label = 'Editar Tarea';
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.tareId) {
      this.tareaService.put(this.seleccionado)
        .subscribe((tarea) => {
          this.mostrarFormulario = false;
        });
    } else {
      this.tareaService.post(this.seleccionado)
        .subscribe((tarea) => {
          this.items = tarea;
          this.mostrarFormulario= false;
          this.actualizarTabla();
        });
    }
  }

  cancelar(){
    this.mostrarFormulario = false;
  }



  

}
