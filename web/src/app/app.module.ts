import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER,NgModule } from '@angular/core';
import { HttpClientModule} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import {MatSelectModule } from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ConfirmarComponent } from '../app/shared/confirmar/confirmar.component';
import { AlertaExitoComponent } from './shared/alerta-exito/alerta-exito.component';
import { AlertaErrorComponent } from './shared/alerta-error/alerta-exito.component';

import { AppConfigService } from './core/config.service';
import { GruposComponent } from './componentes/grupos/grupos.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareasComponent } from './componentes/tareas/tareas.component';
import { HomeComponent } from './componentes/home/home.component';
import { ServicioTareaComponent } from './componentes/servicio-tarea/servicio-tarea.component';
import { GrupoServicioComponent } from './componentes/grupo-servicio/grupo-servicio.component';
import { MovilServicioComponent } from './componentes/movil-servicio/movil-servicio.component';
import { MovilBitacoraComponent } from './componentes/movil-bitacora/movil-bitacora.component';
import { BitacoraTareaComponent } from './componentes/bitacora-tarea/bitacora-tarea.component';
import { MovilComponent } from './componentes/movil/movil.component';
import { MovilOdometroComponent } from './componentes/movil-odometro/movil-odometro.component';
import { MovilGrupoComponent } from './componentes/movil-grupo/movil-grupo.component';
import { AgregarMovilComponent } from './componentes/agregar-movil/agregar-movil.component';
import { PendientesComponent } from './componentes/pendientes/pendientes.component';
import { BuscadorComponent } from './shared/buscador/buscador.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmarComponent,
    GruposComponent,
    ServicioComponent,
    TareasComponent,
    HomeComponent,
    ServicioTareaComponent,
    GrupoServicioComponent,
    MovilServicioComponent,
    MovilBitacoraComponent,
    BitacoraTareaComponent,
    MovilComponent,
    MovilOdometroComponent,
    MovilGrupoComponent,
    AgregarMovilComponent,
    AlertaExitoComponent,
    AlertaErrorComponent,
    PendientesComponent,
    BuscadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatOptionModule,
    MatSelectModule,
    MatStepperModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatGridListModule,
    MatCheckboxModule
  ],
  providers: [AppConfigService,
    { provide: APP_INITIALIZER, useFactory: loadConfig, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function loadConfig(config: AppConfigService) {
  return () => config.load();
}
