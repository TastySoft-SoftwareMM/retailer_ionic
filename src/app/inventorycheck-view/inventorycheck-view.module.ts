import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventorycheckViewPageRoutingModule } from './inventorycheck-view-routing.module';

import { InventorycheckViewPage } from './inventorycheck-view.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    InventorycheckViewPageRoutingModule
  ],
  declarations: [InventorycheckViewPage]
})
export class InventorycheckViewPageModule { }
