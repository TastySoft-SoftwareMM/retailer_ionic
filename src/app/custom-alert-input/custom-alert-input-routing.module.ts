import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomAlertInputPage } from './custom-alert-input.page';

const routes: Routes = [
  {
    path: '',
    component: CustomAlertInputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomAlertInputPageRoutingModule {}
