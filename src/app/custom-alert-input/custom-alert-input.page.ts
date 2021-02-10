import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';





@Component({
  selector: 'app-custom-alert-input',
  templateUrl: './custom-alert-input.page.html',
  styleUrls: ['./custom-alert-input.page.scss'],
})


export class CustomAlertInputPage implements OnInit {

  productdesc: any;
  qty: any;



  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    this.checkQty();
  }

  checkQty() {
    console.log(this.qty);

    if (this.qty == "" || this.qty == null || this.qty == undefined) {
      this.qty = 1;
    }
    console.log(!this.router.url.toString().includes("inventory"));
    if (!this.router.url.toString().includes("inventory")) {

      console.log(this.router.url);

      if (Number(this.qty) == 0 || this.qty == "" || this.qty == null || this.qty == undefined) {
        this.qty = 1;
      }
    }
  

  }

  done() {
    this.checkQty();

    this.modalCtrl.dismiss({ 'qty': Number(this.qty) });
  }


  keyboardClick() {


  }
  onInput1(event) {
    event.target.value = Number(event.target.value.toString().replace(/[^0-9]*/g, ''));
  }

}
