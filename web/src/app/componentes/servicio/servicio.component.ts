import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Servicio } from '../../modelo/servicio';
import { ServicioService } from '../../servicios/servicio.service'
import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, AfterViewInit {
  
  items : Servicio[] = [];
  seleccionado = new Servicio();

  label = '';

  columnas: string[] = ['servId','servNombre','servDescripcion','servPeriodo','servKM','servFecha','acciones'];
  dataSource = new MatTableDataSource<Servicio>();

  form = new FormGroup({});

  mostrarFormulario = false;

  constructor(
    private servicioService: ServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog

  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      servId: [''],
      servNombre: ['',Validators.required],
      servDescripcion: ['',Validators.required],
      servPeriodo: ['',Validators.required],
      servKM: ['',Validators.required],
      servFecha: ['',Validators.required],
      servFechaAlta: [''],
      servBorrado: ['']
    })

    this.servicioService.get().subscribe(
      (servicio) => {
        this.items = servicio;
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
    this.label = 'Agregar servicio';
    this.form.reset();
    this.seleccionado = new Servicio();
    this.mostrarFormulario = true;
  }

  delete(row: Servicio) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      result =>{
        console.log(`Dialog resulr: ${result}`);

        if (result) {
          this.servicioService.delete(row.servId).subscribe(
            () => {
              this.items = this.items.filter( x => x !== row);

              this.actualizarTabla();
            });
        }
      });
  }

  edit(seleccionado: Servicio) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if (this.seleccionado.servId) {
      this.servicioService.put(this.seleccionado)
        .subscribe((servicio) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.servicioService.post(this.seleccionado)
        .subscribe((servicio) => {
          this.items = servicio;
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });
  }

}

cancelar() {
  this.mostrarFormulario = false;
}

}
