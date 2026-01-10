import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';

import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserService } from './services/user.service';
import { SharedModule } from '../shared/shared-module';
import { UserRoutingModule } from './user-routing.module';
import { PrimengModule } from '../primeng/primeng-module';



@NgModule({
  declarations: [
    RegisterPageComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    PrimengModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    UserService
  ],
})
export class UserModule { }
