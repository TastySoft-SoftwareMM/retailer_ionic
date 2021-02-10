import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchModalViewPage } from './merch-modal-view.page';

const routes: Routes = [
  {
    path: '',
    component: MerchModalViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchModalViewPageRoutingModule {}
