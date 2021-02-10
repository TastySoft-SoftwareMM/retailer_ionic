import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPlacementFororderupdatePageRoutingModule } from './order-placement-fororderupdate-routing.module';

import { OrderPlacementFororderupdatePage } from './order-placement-fororderupdate.page';
import { ComponentsModule } from '../components/components/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OrderPlacementFororderupdatePageRoutingModule
  ],
  declarations: [OrderPlacementFororderupdatePage]
})
export class OrderPlacementFororderupdatePageModule { }
