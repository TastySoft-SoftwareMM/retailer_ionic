import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginwithUsernamePageRoutingModule } from './loginwith-username-routing.module';

import { LoginwithUsernamePage } from './loginwith-username.page';
import { LoginpopoverComponent } from '../components/loginpopover/loginpopover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginwithUsernamePageRoutingModule
  ],
  declarations: [
    LoginwithUsernamePage,
    LoginpopoverComponent
  ],
  entryComponents: [
    LoginpopoverComponent
  ]
})
export class LoginwithUsernamePageModule { }
