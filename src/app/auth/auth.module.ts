import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimengModule } from '../primeng/primeng-module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing-module';
import { SharedModule } from '../shared/shared-module';



@NgModule({
  declarations: [ LoginPageComponent ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ]
})
export class AuthModule { }
