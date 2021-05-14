import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GiftchoicePageRoutingModule } from './giftchoice-routing.module';

import { GiftchoicePage } from './giftchoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GiftchoicePageRoutingModule
  ],
  declarations: [GiftchoicePage]
})
export class GiftchoicePageModule {}
