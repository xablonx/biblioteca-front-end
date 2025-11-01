import { Component, OnInit } from '@angular/core';
import { Emprestimo } from '../../../models/emprestimo';
import { EmprestimoService } from '../../../services/emprestimo.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emprestimo-list',
  imports: [MatChipListbox, MatChipsModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule, DatePipe],
  templateUrl: './emprestimo-list.html',
  styleUrl: './emprestimo-list.scss',
})
export class EmprestimoList implements OnInit {
  emprestimos: Emprestimo[] = [];
  displayedColumns: string[] = ['usuario', 'livro', 'dataEmprestimo', 'dataDevolucao', 'status', 'acoes'];
  isLoading: boolean = true;

  constructor(
    private readonly emprestimoService: EmprestimoService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadEmprestimos();
  }

  loadEmprestimos(): void {
    this.isLoading = true;
    this.emprestimoService.getEmprestimos().subscribe({
      next: (data) => {
        this.emprestimos = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar lista de empréstimos.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  openReturnDialog(id: number | undefined, titulo: string): void {
    if (!id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: `Confirma a devolução do livro "${titulo}"?`
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.return(id);
      }
    });
  }

  return(id: number): void {
    this.emprestimoService.returnEmprestimo(id).subscribe({
      next: () => {
        this.snackBar.open('Livro devolvido com sucesso!', 'Fechar', { duration: 3000 });
        this.loadEmprestimos();
      },
      error: ({ error } ) => {
        this.snackBar.open(error, 'Fechar', { duration: 5000, panelClass: ['snack-error'] });
      }
    });
  }

  add(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
