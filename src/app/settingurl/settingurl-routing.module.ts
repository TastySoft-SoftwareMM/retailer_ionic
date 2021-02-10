import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingurlPage } from './settingurl.page';

const routes: Routes = [
  {
    path: '',
    component: SettingurlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingurlPageRoutingModule {}
