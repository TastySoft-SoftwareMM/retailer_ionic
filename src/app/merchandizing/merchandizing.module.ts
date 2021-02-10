import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchandizingPageRoutingModule } from './merchandizing-routing.module';

import { MerchandizingPage } from './merchandizing.page';
import { ComponentsModule } from '../components/components/components.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MerchandizingPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [MerchandizingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MerchandizingPageModule { }
