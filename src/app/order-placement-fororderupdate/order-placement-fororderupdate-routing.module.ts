import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPlacementFororderupdatePage } from './order-placement-fororderupdate.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPlacementFororderupdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPlacementFororderupdatePageRoutingModule {}
