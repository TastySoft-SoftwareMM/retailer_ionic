import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoptransferPage } from './shoptransfer.page';

const routes: Routes = [
  {
    path: '',
    component: ShoptransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoptransferPageRoutingModule {}
