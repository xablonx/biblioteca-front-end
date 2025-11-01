import { Routes } from '@angular/router';
import { Home } from './modules/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.routes').then(r => r.USUARIOS_ROUTES)
  },
  { path: 'livros',
    loadChildren: () => import('./modules/livros/livros.routes').then(r => r.LIVROS_ROUTES)
  },
  { path: 'emprestimos',
    loadChildren: () => import('./modules/emprestimos/emprestimos.routes').then(r => r.EMPRESTIMOS_ROUTES)
  },
  { path: 'recomendacoes',
    loadChildren: () => import('./modules/recomendacoes/recomendacoe.routes').then(m => m.RECOMENDACOES_ROUTES)
  },
  { path: '**', redirectTo: 'home' }
];
