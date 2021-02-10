import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchanModalPage } from './merchan-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MerchanModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchanModalPageRoutingModule {}
