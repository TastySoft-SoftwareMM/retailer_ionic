import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProImageViewerPageRoutingModule } from './pro-image-viewer-routing.module';

import { ProImageViewerPage } from './pro-image-viewer.page';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { IonicHeaderParallaxModule } from 'ionic-header-parallax';
import { ComponentsModule } from '../components/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ProImageViewerPageRoutingModule,
    SharedDirectivesModule,
    IonicHeaderParallaxModule
  ],
  declarations: [ProImageViewerPage]
})
export class ProImageViewerPageModule { }
