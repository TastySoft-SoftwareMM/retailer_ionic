import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopmodalPage } from './shopmodal.page';

const routes: Routes = [
  {
    path: '',
    component: ShopmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopmodalPageRoutingModule {}
