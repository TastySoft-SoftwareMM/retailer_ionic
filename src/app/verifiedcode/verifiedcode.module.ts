import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifiedcodePageRoutingModule } from './verifiedcode-routing.module';

import { VerifiedcodePage } from './verifiedcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifiedcodePageRoutingModule
  ],
  declarations: [VerifiedcodePage]
})
export class VerifiedcodePageModule {}
