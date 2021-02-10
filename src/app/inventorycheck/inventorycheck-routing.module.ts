import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventorycheckPage } from './inventorycheck.page';

const routes: Routes = [
  {
    path: '',
    component: InventorycheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventorycheckPageRoutingModule {}
