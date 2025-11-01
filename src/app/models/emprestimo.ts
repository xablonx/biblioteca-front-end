import { Livro } from './livro';
import { Usuario } from './usuario';

export interface Emprestimo {
  id: number;
  usuario: Usuario;
  livro: Livro;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  status: 'Disponivel' | 'Emprestado';
}
