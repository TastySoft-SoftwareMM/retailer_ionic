import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartSummaryPage } from './cart-summary.page';

const routes: Routes = [
  {
    path: '',
    component: CartSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartSummaryPageRoutingModule {}
