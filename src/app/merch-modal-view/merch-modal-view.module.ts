import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchModalViewPageRoutingModule } from './merch-modal-view-routing.module';

import { MerchModalViewPage } from './merch-modal-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchModalViewPageRoutingModule
  ],
  declarations: [MerchModalViewPage]
})
export class MerchModalViewPageModule {}
