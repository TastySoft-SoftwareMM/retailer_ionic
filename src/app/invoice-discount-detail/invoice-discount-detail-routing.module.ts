import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceDiscountDetailPage } from './invoice-discount-detail.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceDiscountDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceDiscountDetailPageRoutingModule {}
