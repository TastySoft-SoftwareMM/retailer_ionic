import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProImageViewerPage } from './pro-image-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: ProImageViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProImageViewerPageRoutingModule {}
