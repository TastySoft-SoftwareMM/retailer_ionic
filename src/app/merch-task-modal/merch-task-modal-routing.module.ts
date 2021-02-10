import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchTaskModalPage } from './merch-task-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MerchTaskModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchTaskModalPageRoutingModule {}
