import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultipleSkusPage } from './multiple-skus.page';

const routes: Routes = [
  {
    path: '',
    component: MultipleSkusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipleSkusPageRoutingModule {}
