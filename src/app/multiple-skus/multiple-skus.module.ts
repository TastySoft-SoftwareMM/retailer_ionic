import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultipleSkusPageRoutingModule } from './multiple-skus-routing.module';

import { MultipleSkusPage } from './multiple-skus.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MultipleSkusPageRoutingModule
  ],
  declarations: [MultipleSkusPage]
})
export class MultipleSkusPageModule {}
