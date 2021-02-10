import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchTaskModalPageRoutingModule } from './merch-task-modal-routing.module';

import { MerchTaskModalPage } from './merch-task-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MerchTaskModalPageRoutingModule
  ],
  declarations: [MerchTaskModalPage]
})
export class MerchTaskModalPageModule {}
