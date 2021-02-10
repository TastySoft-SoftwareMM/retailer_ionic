import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderupdatePage } from './orderupdate.page';

const routes: Routes = [
  {
    path: '',
    component: OrderupdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderupdatePageRoutingModule {}
