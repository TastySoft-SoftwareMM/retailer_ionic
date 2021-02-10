import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingurlPageRoutingModule } from './settingurl-routing.module';

import { SettingurlPage } from './settingurl.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingurlPageRoutingModule
  ],
  declarations: [SettingurlPage]
})
export class SettingurlPageModule {}
