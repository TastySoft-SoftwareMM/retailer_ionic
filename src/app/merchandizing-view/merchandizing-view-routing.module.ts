import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MerchandizingViewPage } from './merchandizing-view.page';

const routes: Routes = [
  {
    path: '',
    component: MerchandizingViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchandizingViewPageRoutingModule {}
