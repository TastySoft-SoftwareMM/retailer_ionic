import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReturnproudctPage } from './returnproduct.page';

const routes: Routes = [
  {
    path: '',
    component: ReturnproudctPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnproudctPageRoutingModule {}
