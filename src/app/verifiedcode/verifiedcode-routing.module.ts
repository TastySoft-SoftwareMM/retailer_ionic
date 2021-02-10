import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifiedcodePage } from './verifiedcode.page';

const routes: Routes = [
  {
    path: '',
    component: VerifiedcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifiedcodePageRoutingModule {}
