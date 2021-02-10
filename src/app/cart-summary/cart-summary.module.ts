import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartSummaryPageRoutingModule } from './cart-summary-routing.module';

import { CartSummaryPage } from './cart-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartSummaryPageRoutingModule
  ],
  declarations: [CartSummaryPage]
})
export class CartSummaryPageModule {}
