import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceDiscountDetailPageRoutingModule } from './invoice-discount-detail-routing.module';

import { InvoiceDiscountDetailPage } from './invoice-discount-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceDiscountDetailPageRoutingModule
  ],
  declarations: [InvoiceDiscountDetailPage]
})
export class InvoiceDiscountDetailPageModule {}
