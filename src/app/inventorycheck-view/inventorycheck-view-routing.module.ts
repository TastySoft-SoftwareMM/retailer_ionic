import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventorycheckViewPage } from './inventorycheck-view.page';

const routes: Routes = [
  {
    path: '',
    component: InventorycheckViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventorycheckViewPageRoutingModule {}
