import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventorystockPage } from './inventorystock.page';

const routes: Routes = [
  {
    path: '',
    component: InventorystockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventorystockPageRoutingModule {}
