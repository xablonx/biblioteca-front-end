import { Routes } from '@angular/router';
import { LivroList } from './livro-list/livro-list';
import { LivroForm } from './livro-form/livro-form';

export const LIVROS_ROUTES: Routes = [
  { path: '', component: LivroList },
  { path: 'new', component: LivroForm },
  { path: 'edit/:id', component: LivroForm }
];
