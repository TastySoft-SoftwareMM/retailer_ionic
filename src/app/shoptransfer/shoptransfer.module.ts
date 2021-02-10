import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoptransferPageRoutingModule } from './shoptransfer-routing.module';

import { ShoptransferPage } from './shoptransfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoptransferPageRoutingModule
  ],
  declarations: [ShoptransferPage]
})
export class ShoptransferPageModule {}
