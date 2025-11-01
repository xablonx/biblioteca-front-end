import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { Livro } from '../../../models/livro';
import { EmprestimoService } from '../../../services/emprestimo.service';
import { UsuarioService } from '../../../services/usuario.service';
import { LivroService } from '../../../services/livro.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmprestimoDTO } from '../../../models/emprestimoDto';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-emprestimo-form',
  imports: [CommonModule, MatSelectModule, MatInputModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './emprestimo-form.html',
  styleUrl: './emprestimo-form.scss',
})
export class EmprestimoForm implements OnInit {
  emprestimoForm!: FormGroup;
  usuarios: Usuario[] = [];
  livros: Livro[] = [];
  isLoading: boolean = true;

  constructor(
    private readonly form: NonNullableFormBuilder,
    private readonly emprestimoService: EmprestimoService,
    private readonly usuarioService: UsuarioService,
    private readonly livroService: LivroService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {
    this.emprestimoForm = this.form.group({
      usuarioId: [null, Validators.required],
      livroId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.usuarioService.getUsuarios().subscribe(data => this.usuarios = data);
    this.livroService.getLivros().subscribe({
      next: (data) => {
        this.livros = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar dados. Verifique a API.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  onSubmit(): void {
    if (this.emprestimoForm.invalid) {
      this.snackBar.open('Selecione um usuário e um livro.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    this.isLoading = true;
    const request: EmprestimoDTO = this.emprestimoForm.value;
    this.emprestimoService.createEmprestimo(request).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Empréstimo registrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/emprestimos']);
      },
      error: ({ error }) => {
        this.isLoading = false;
        this.snackBar.open(error, 'Fechar', { duration: 5000, panelClass: ['snack-error'] });
      }
    });
  }

  onCancel() {
    this.location.back();
  }
}
