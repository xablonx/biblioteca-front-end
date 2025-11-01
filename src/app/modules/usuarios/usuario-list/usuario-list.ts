import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-usuario-list',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioList implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['nome', 'email', 'telefone', 'acoes'];
  isLoading: boolean = true;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar lista de usuários.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  openDeleteDialog(id: number | undefined): void {
    if (!id) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: 'Tem certeza que deseja remover este usuário?',
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

  edit(usuario: Usuario): void {
    this.router.navigate(['edit', usuario.id], { relativeTo: this.route });
  }

  delete(id: number): void {
    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Erro ao deletar:', error);
        this.snackBar.open('Falha ao excluir o usuário.', 'Fechar', { duration: 3000, panelClass: ['snack-error']});
      }
    });
  }
}
