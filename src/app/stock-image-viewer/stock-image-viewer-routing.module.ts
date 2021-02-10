import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockImageViewerPage } from './stock-image-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: StockImageViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockImageViewerPageRoutingModule {}
