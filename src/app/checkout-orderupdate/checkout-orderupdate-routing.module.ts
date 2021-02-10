import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutOrderupdatePage } from './checkout-orderupdate.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutOrderupdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutOrderupdatePageRoutingModule {}
