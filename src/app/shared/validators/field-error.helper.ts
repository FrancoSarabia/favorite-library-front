import { FormGroup } from '@angular/forms';

export function isInvalidField(form: FormGroup, field: string): boolean | null {
  return form.controls[field]?.errors && form.controls[field]?.touched;
}

export function getFieldError(form: FormGroup, field: string): string | null {
  if (!form.controls[field]) return null;

  const errors = form.controls[field].errors || {};

  for (const key of Object.keys(errors)) {
    switch (key) {
      case 'minlength':
        return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
      case 'maxlength':
        return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
      case 'email':
        return 'Formato de email inválido.';
      case 'required':
        return 'Este campo es requerido.';
      case 'pattern':
        return 'El formato ingresado no es válido.';
    }
  }

  return null;
}