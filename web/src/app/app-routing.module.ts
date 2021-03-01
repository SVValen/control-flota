import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GruposComponent } from './componentes/grupos/grupos.component';
import { HomeComponent } from './componentes/home/home.component'
import { MovilComponent } from './componentes/movil/movil.component';
import { ServicioComponent } from './componentes/servicio/servicio.component';
import { TareasComponent } from './componentes/tareas/tareas.component';

const routes: Routes = [
  { path: 'home', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'grupos', component: GruposComponent},
  { path: 'servicios', component: ServicioComponent},
  { path: 'tareas', component: TareasComponent},
  { path: 'movil', component: MovilComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
