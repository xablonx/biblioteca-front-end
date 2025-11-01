import { Component, OnInit } from '@angular/core';
import { Livro } from '../../../models/livro';
import { LivroService } from '../../../services/livro.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-livro-list',
  imports: [MatInputModule, MatFormFieldModule, CommonModule, FormsModule, MatListModule, MatDividerModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, DatePipe],
  templateUrl: './livro-list.html',
  styleUrl: './livro-list.scss',
})
export class LivroList implements OnInit {
  livros: Livro[] = [];
  displayedColumns: string[] = ['titulo', 'autor', 'isbn', 'publicacao', 'categoria', 'acoes'];
  isLoading: boolean = true;

  tituloSearch: string = '';
  googleBooks: Livro[] = [];
  isSearchingGoogle: boolean = false;

  constructor(
    private readonly livrosService: LivroService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadLivros();
  }

  loadLivros(): void {
    this.isLoading = true;
    this.livrosService.getLivros().subscribe({
      next: (data) => {
        this.livros = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar lista de livros.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  searchGoogle(): void {
    if (this.tituloSearch.trim() === '') {
      this.googleBooks = [];
      this.snackBar.open('Digite um título para buscar.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isSearchingGoogle = true;
    this.googleBooks = [];

    this.livrosService.searchGoogleBooks(this.tituloSearch).subscribe({
      next: (data) => {
        this.googleBooks = data;
        this.isSearchingGoogle = false;
        if (data.length === 0) {
          this.snackBar.open(`Nenhum livro encontrado para "${this.tituloSearch}".`, 'Fechar', { duration: 4000 });
        }
      },
      error: () => {
        this.isSearchingGoogle = false;
        this.snackBar.open('Falha na comunicação com a API de busca externa.', 'Fechar', { duration: 5000, panelClass: ['snack-error'] });
      }
    });
  }

  adicionarGoogleBook(livro: Livro): void {
    this.isLoading = true;

    this.livrosService.saveGoogleBook(livro).subscribe({
      next: (novoLivro) => {
        this.snackBar.open(`Livro "${novoLivro.titulo}" adicionado à biblioteca!`, 'Fechar', { duration: 4000 });
        this.loadLivros();

        this.googleBooks = this.googleBooks.filter(l => l !== livro);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Erro ao adicionar livro.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000, panelClass: ['snack-error'] });
      }
    });
  }

  openDeleteDialog(id: number | undefined): void {
    if (!id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: 'Tem certeza que deseja excluir este livro?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.delete(id);
      }
    });
  }

  add(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  edit(livro: Livro): void {
    this.router.navigate(['edit', livro.id], { relativeTo: this.route });
  }

  delete(id: number): void {
    this.livrosService.deleteLivro(id).subscribe({
      next: () => {
        this.snackBar.open('Livro excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadLivros();
      },
      error: () => {
        this.snackBar.open('Falha ao excluir o livro.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }
}
