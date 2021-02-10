import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginwithUsernamePage } from './loginwith-username.page';

const routes: Routes = [
  {
    path: '',
    component: LoginwithUsernamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginwithUsernamePageRoutingModule {}
