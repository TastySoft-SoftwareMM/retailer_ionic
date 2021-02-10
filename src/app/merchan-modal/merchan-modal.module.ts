import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchanModalPageRoutingModule } from './merchan-modal-routing.module';


import { MerchanModalPage } from './merchan-modal.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MerchanModalPageRoutingModule,
  ],
  declarations: [MerchanModalPage]
})
export class MerchanModalPageModule { }
