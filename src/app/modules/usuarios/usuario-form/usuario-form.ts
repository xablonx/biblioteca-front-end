import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../../models/usuario';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-usuario-form',
  imports: [MatInputModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioForm implements OnInit {
  usuarioForm!: FormGroup;
  usuarioId: number | null = null;
  isEdicao: boolean = false;
  isLoading: boolean = false;

  constructor(
    private readonly form: NonNullableFormBuilder,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly location: Location
  ) {
    this.usuarioForm = this.form.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.params['id'];
    this.isEdicao = !!this.usuarioId;

    if (this.isEdicao && this.usuarioId) {
      this.isLoading = true;
      this.usuarioService.getUsuariosById(this.usuarioId).subscribe({
        next: (usuario) => {
          this.usuarioForm.patchValue(usuario);
          this.isLoading = false;
        },
        error: () => {
            this.isLoading = false;
            this.snackBar.open('Erro ao carregar dados do usuário.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.snackBar.open('Formulário inválido. Verifique os campos.', 'Fechar', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    this.isLoading = true;
    const usuario: Usuario = this.usuarioForm.value;

    const action = this.isEdicao && this.usuarioId
      ? this.usuarioService.updateUsuario(this.usuarioId, usuario)
      : this.usuarioService.createUsuario(usuario);

    action.subscribe({
      next: () => {
          this.isLoading = false;
          const message = this.isEdicao ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.router.navigate(['/usuarios']);
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
