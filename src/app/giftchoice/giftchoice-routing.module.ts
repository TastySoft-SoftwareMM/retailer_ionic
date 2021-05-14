import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GiftchoicePage } from './giftchoice.page';

const routes: Routes = [
  {
    path: '',
    component: GiftchoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiftchoicePageRoutingModule {}
