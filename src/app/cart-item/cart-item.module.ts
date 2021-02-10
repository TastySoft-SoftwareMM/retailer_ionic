import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartItemPageRoutingModule } from './cart-item-routing.module';

import { CartItemPage } from './cart-item.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CartItemPageRoutingModule,
  ],
  declarations: [CartItemPage]
})
export class CartItemPageModule { }
