import { Routes } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';

export const routes: Routes = [
  { path: '', component: UsuarioComponent },
  { path: '**', redirectTo: '' }
];