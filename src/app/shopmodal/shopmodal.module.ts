import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopmodalPageRoutingModule } from './shopmodal-routing.module';

import { ShopmodalPage } from './shopmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopmodalPageRoutingModule
  ],
  declarations: [ShopmodalPage]
})
export class ShopmodalPageModule {}
