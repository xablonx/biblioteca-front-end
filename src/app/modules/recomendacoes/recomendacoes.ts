import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { Livro } from '../../models/livro';
import { UsuarioService } from '../../services/usuario.service';
import { RecomendacaoService } from '../../services/recomendacao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recomendacoes',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, MatListModule, MatChip, MatChipListbox, MatCardModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './recomendacoes.html',
  styleUrl: './recomendacoes.scss',
})
export class Recomendacoes implements OnInit {
  recomendacaoForm!: FormGroup;
  usuarios: Usuario[] = [];
  livrosRecomendados: Livro[] = [];
  isLoading: boolean = false;
  usuarioSelecionado: Usuario | undefined;

  constructor(
    private readonly form: NonNullableFormBuilder,
    private readonly usuarioService: UsuarioService,
    private readonly recomendacaoService: RecomendacaoService,
    private readonly snackBar: MatSnackBar
  ) {
    this.recomendacaoForm = this.form.group({
      usuarioId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();

    this.recomendacaoForm.get('usuarioId')?.valueChanges.subscribe(id => {
      if (id) {
        this.usuarioSelecionado = this.usuarios.find(u => u.id === id);
        this.buscarRecomendacoes(id);
      } else {
        this.livrosRecomendados = [];
        this.usuarioSelecionado = undefined;
      }
    });
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

  buscarRecomendacoes(usuarioId: number): void {
    this.isLoading = true;
    this.livrosRecomendados = [];

    this.recomendacaoService.getRecomendacoesByUsuario(usuarioId).subscribe({
      next: (data) => {
        this.livrosRecomendados = data;
        this.isLoading = false;
        if (data.length === 0) {
          this.snackBar.open('Nenhuma recomendação encontrada para este usuário.', 'Fechar', { duration: 3000 });
        }
      },
      error: (error) => {
        this.isLoading = false;
        const msg = error.error?.message || 'Erro ao buscar recomendações.';
        this.snackBar.open(msg, 'Fechar', { duration: 5000, panelClass: ['snack-error'] });
      }
    });
  }
}
