import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPlacementUpdatePage } from './order-placement-update.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPlacementUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPlacementUpdatePageRoutingModule {}
