import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterPageComponent } from '../user/pages/register-page/register-page.component';

const routes: Routes = [
    {
      path: 'register',
      component: RegisterPageComponent
    },
    {
      path: '**',
      redirectTo: 'register'
    },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [ RouterModule ]
})
export class UserRoutingModule { }
