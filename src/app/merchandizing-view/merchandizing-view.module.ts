import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MerchandizingViewPageRoutingModule } from './merchandizing-view-routing.module';

import { MerchandizingViewPage } from './merchandizing-view.page';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MerchandizingViewPageRoutingModule
  ],
  declarations: [MerchandizingViewPage]
})
export class MerchandizingViewPageModule { }
