import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutOrderupdatePageRoutingModule } from './checkout-orderupdate-routing.module';

import { CheckoutOrderupdatePage } from './checkout-orderupdate.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CheckoutOrderupdatePageRoutingModule
  ],
  declarations: [CheckoutOrderupdatePage]
})
export class CheckoutOrderupdatePageModule { }
