import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPlacementPage } from './order-placement.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPlacementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPlacementPageRoutingModule {}
