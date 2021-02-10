import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
   form:any  = [
     { val: 'Customers', isChecked: true },
     { val: 'Stocks', isChecked: true },
   ];
  constructor() { }

  ngOnInit() {
  }

}
