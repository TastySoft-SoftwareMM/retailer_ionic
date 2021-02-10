import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinshopComponent } from '../checkinshop/checkinshop.component';
import { IonicModule } from '@ionic/angular';
import { ImageShellComponent } from '../image-shell/image-shell.component';
import { MerchanImageShellComponent } from '../merchan-image-shell/merchan-image-shell.component';
import { AdsComponent } from '../ads/ads.component';

@NgModule({
  declarations: [CheckinshopComponent, ImageShellComponent, MerchanImageShellComponent,AdsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CheckinshopComponent, ImageShellComponent, MerchanImageShellComponent,AdsComponent],
  entryComponents: [CheckinshopComponent, ImageShellComponent, MerchanImageShellComponent,AdsComponent]
})
export class ComponentsModule { }

