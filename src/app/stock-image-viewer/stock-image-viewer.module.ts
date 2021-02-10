import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockImageViewerPageRoutingModule } from './stock-image-viewer-routing.module';

import { StockImageViewerPage } from './stock-image-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockImageViewerPageRoutingModule
  ],
  declarations: [StockImageViewerPage]
})
export class StockImageViewerPageModule {}
