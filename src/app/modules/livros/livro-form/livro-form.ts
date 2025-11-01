import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LivroService } from '../../../services/livro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Livro } from '../../../models/livro';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-livro-form',
  imports: [MatInputModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './livro-form.html',
  styleUrl: './livro-form.scss',
})
export class LivroForm implements OnInit {
  livroForm!: FormGroup;
  livroId: number | null = null;
  isEdicao: boolean = false;
  isLoading: boolean = false;

  constructor(
    private readonly form: NonNullableFormBuilder,
    private readonly livroService: LivroService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {
    this.livroForm = this.form.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: ['', Validators.required],
      dataPublicacao: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.livroId = this.route.snapshot.params['id'];
    this.isEdicao = !!this.livroId;

    if (this.isEdicao && this.livroId) {
      this.isLoading = true;
      this.livroService.getLivrosById(this.livroId).subscribe({
        next: (livro) => {
            const dataISO = livro.dataPublicacao.split('T')[0];
            this.livroForm.patchValue({...livro, dataPublicacao: dataISO});
            this.isLoading = false;
        },
        error: () => {
            this.isLoading = false;
            this.snackBar.open('Erro ao carregar dados do livro.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.livroForm.invalid) {
      this.snackBar.open('Formulário inválido. Verifique os campos.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    this.isLoading = true;
    const livro: Livro = this.livroForm.value;

    const action = this.isEdicao && this.livroId
        ? this.livroService.updateLivro(this.livroId, livro)
        : this.livroService.createLivro(livro);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        const msg = this.isEdicao ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.router.navigate(['/livros']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao salvar:', error);
        this.snackBar.open(error.error, 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }

  onCancel() {
    this.location.back();
  }
}
