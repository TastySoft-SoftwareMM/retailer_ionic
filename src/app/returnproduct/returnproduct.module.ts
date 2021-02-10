import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReturnproudctPageRoutingModule } from './returnproduct-routing.module';

import { ReturnproudctPage } from './returnproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnproudctPageRoutingModule
  ],
  declarations: [ReturnproudctPage]
})
export class ReturnproudctPageModule {}
