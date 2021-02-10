import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventorycheckPageRoutingModule } from './inventorycheck-routing.module';

import { InventorycheckPage } from './inventorycheck.page';
import { ComponentsModule } from '../components/components/components.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    InventorycheckPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [InventorycheckPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class InventorycheckPageModule { }
