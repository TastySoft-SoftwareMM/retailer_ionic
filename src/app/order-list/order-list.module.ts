import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderListPageRoutingModule } from './order-list-routing.module';

import { OrderListPage } from './order-list.page';
import { ComponentsModule } from '../components/components/components.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';

// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OrderListPageRoutingModule,
    // NgxDatatableModule
    SharedDirectivesModule
  ],
  declarations: [OrderListPage]
})
export class OrderListPageModule { }
