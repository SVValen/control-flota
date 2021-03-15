import { AfterViewInit,Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Grupo } from '../../modelo/grupo';
import { GrupoService } from '../../servicios/grupo.service'
import { ConfirmarComponent } from '../../shared/confirmar/confirmar.component';
import { GrupoServicioService} from '../../servicios/grupo-servicio.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GrupoServicio } from 'src/app/modelo/grupo-servicio';


@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit, AfterViewInit {

  items : Grupo[] = [];
  seleccionado = new Grupo();

  itemsServicios : GrupoServicio[] = [];

  label = '';

  columnas: string[] = ['grupNombre','grupDescripcion','acciones'];
  dataSource = new MatTableDataSource<Grupo>();

  form = new FormGroup({});

  mostrarFormulario = false;
  mostrarFormServ = false;

  

  constructor(
    private grupoService: GrupoService,
    private grupoServicioService: GrupoServicioService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    
    this.form= this.formBuilder.group({
      grupId: [''],
      grupNombre: [''],
      grupDescripcion: ['', Validators.required],
      grupBorrado: [''],
      grupFechaAlta: ['']
    });

    this.grupoService.get().subscribe(
      (grupo) => {
        this.items = grupo;
        this.actualizarTabla();
      }
    )  
  }

  actualizarTabla() {
    this.dataSource.data = this.items;
    this.dataSource.paginator = this.paginator;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.label = 'Agregar grupo'
    this.form.reset();
    this.seleccionado = new Grupo();
    this.mostrarFormulario = true;
  }
  edit(seleccionado: Grupo) {
    this.label = 'Editar grupo';
    this.mostrarFormulario = true;
    this.mostrarFormServ = true;
    this.seleccionado = seleccionado;
    this.form.setValue(seleccionado);
  }
  
  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);

    if(this.seleccionado.grupId) {
      this.grupoService.put(this.seleccionado)
        .subscribe(() => {
          this.actualizarDetalle(this.seleccionado.grupId);
        });
    } else {
      this.grupoService.post(this.seleccionado)
        .subscribe((grupo) => {
          this.items = grupo;
          this.actualizarDetalle(this.seleccionado.grupId);
        });
    }
  }


  delete(row: Grupo) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(`Dialog Result: ${result}`);

        if(result) {
          this.grupoService.delete(row.grupId)
            .subscribe(() => {
              this.items = this.items.filter((item) => {
                if (item.grupId != row.grupId) {
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

  actualizarDetalle(grupId:number){
    this.itemsServicios.forEach((i) => {
      i.grusGrupId = grupId;
  
      if (i.grusBorrado){
        this.grupoServicioService.delete(i.grusId).subscribe();
      }
  
      if(i.grusId < 0){
        this.grupoServicioService.post(i).subscribe();
      }
  
      if (i.grusId > 0){
        this.grupoServicioService.put(i).subscribe();
      }
    });
  
    this.mostrarFormulario = false;
    this.actualizarTabla();
  }

  cancelar(){
    this.mostrarFormulario = false;
  }


}
