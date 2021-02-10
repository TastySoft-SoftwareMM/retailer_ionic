import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventorystockPageRoutingModule } from './inventorystock-routing.module';

import { InventorystockPage } from './inventorystock.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    InventorystockPageRoutingModule
  ],
  declarations: [InventorystockPage]
})
export class InventorystockPageModule { }
