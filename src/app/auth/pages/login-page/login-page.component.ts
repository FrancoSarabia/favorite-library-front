import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  standalone: false,
})
export class LoginPageComponent { 

  private fb          = inject( FormBuilder );
  private router      = inject(Router)

  public loginForm: FormGroup = this.fb.group({
    username: [ '', [ Validators.required ] ],
    password: [ '', [ Validators.required, Validators.minLength(6) ] ]
  });

  loading: boolean = false;

  login(){
    // const { username, password } = this.loginForm.value;
    // this.loading = true;

    // this.authService.login( username, password )
    //   .pipe(finalize(() => this.loading = false))
    //   .subscribe( {
    //     next: () => {
    //       this.router.navigate(['/dashboard']);
    //     },
    //     error: ( errorMessage ) => {
    //       Swal.fire( 'Error', 'Credenciales Invalidas', 'error' )
    //     }
    //   } );
  }

  goToRegister() {
    this.router.navigate(['/user/register']);
  }

  isInvalidField( field: string ): boolean | null {
    return this.loginForm.controls[field].errors && this.loginForm.controls[field].touched;
  }

  getFieldError( field: string ): string | null {
    if( !this.loginForm.controls[field] ) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for( const key of Object.keys(errors) ) {
      switch( key ){
        case 'required': 
          return 'Este campo es requerido';
        case 'minlength': 
          return `Mínimo ${ errors['minlength'].requiredLength } caracteres.`;
      }
    }
    return null;
  }
}