import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomAlertInputPageRoutingModule } from './custom-alert-input-routing.module';

import { CustomAlertInputPage } from './custom-alert-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomAlertInputPageRoutingModule
  ],
  declarations: [CustomAlertInputPage]
})
export class CustomAlertInputPageModule {}
