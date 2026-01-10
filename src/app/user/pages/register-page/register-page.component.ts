import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { isInvalidField, getFieldError } from '../../../shared/validators/field-error.helper';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  standalone: false,
})
export class RegisterPageComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public showPassword = false;
  public passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  public passwordStrengthPercent = '33%';
  public registerForm!: FormGroup;
  public loading: boolean = false;
  public getFieldError: Function = getFieldError;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSave() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formValues = this.registerForm.value;
    const fullName = `${this.registerForm.get('firstName')?.value || ''} ${
      this.registerForm.get('lastName')?.value || ''
    }`;
    Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Desea registrar al usuario: <b>${fullName}</b>?`,
      icon: 'question',
      iconColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;

        this.userService.userRegister(formValues).pipe(finalize(() => (this.loading = false))).subscribe({
            next: (res) => {
              Swal.fire('Éxito', `Usuario registrado correctamente`, 'success');
              this.clear();

              this.router.navigate(['/book/book-catalog']);
            },
            error: (err) => {
              Swal.fire('Hubo un problema', err.error.message || 'Error inesperado', 'error');
              console.error('Error en el registro', err);
            },
          });
      }
    });
  }

  public clear() {
    this.registerForm.reset();
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  public cancel() {
    this.router.navigate(['/auth/login']);
  }

  public isValidField(field: string): boolean {
    if (isInvalidField(this.registerForm, field)) return false;
    return true;
  }

  checkPasswordStrength() {
    const value = this.registerForm.get('password')?.value || '';

    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;

    if (strength <= 1) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = '33%';
    } else if (strength === 2) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = '66%';
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = '100%';
    }
  }
}
