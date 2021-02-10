import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPlacementUpdatePageRoutingModule } from './order-placement-update-routing.module';

import { OrderPlacementUpdatePage } from './order-placement-update.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OrderPlacementUpdatePageRoutingModule
  ],
  declarations: [OrderPlacementUpdatePage]
})
export class OrderPlacementUpdatePageModule { }
