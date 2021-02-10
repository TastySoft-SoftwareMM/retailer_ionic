import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpopover',
  templateUrl: './loginpopover.component.html',
  styleUrls: ['./loginpopover.component.scss'],
})
export class LoginpopoverComponent implements OnInit {

  constructor(
    private popCtrl: PopoverController,
    private router: Router,
    private modal: ModalController
  ) { }

  ngOnInit() {}

  openURL(){
    this.popCtrl.dismiss();
    this.router.navigate(['/settingurl']);
  }
 

}
