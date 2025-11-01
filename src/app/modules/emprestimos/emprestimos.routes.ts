import { Routes } from '@angular/router';
import { EmprestimoList } from './emprestimo-list/emprestimo-list';
import { EmprestimoForm } from './emprestimo-form/emprestimo-form';

export const EMPRESTIMOS_ROUTES: Routes = [
  { path: '', component: EmprestimoList },
  { path: 'new', component: EmprestimoForm },
  { path: 'edit/:id', component: EmprestimoForm }
];
