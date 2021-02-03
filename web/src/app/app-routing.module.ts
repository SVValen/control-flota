import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GruposComponent } from './componentes/grupos/grupos.component';
import { HomeComponent } from './componentes/home/home.component'
import { ServicioComponent } from './componentes/servicio/servicio.component';

const routes: Routes = [
  { path: 'home', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'grupos', component: GruposComponent},
  { path: 'servicios', component: ServicioComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
