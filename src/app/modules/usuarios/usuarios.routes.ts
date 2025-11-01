import { Routes } from '@angular/router';
import { UsuarioList } from './usuario-list/usuario-list';
import { UsuarioForm } from './usuario-form/usuario-form';

export const USUARIOS_ROUTES: Routes = [
  { path: '', component: UsuarioList },
  { path: 'new', component: UsuarioForm },
  { path: 'edit/:id', component: UsuarioForm }
];
