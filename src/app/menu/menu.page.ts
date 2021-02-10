import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { CheckinPage } from '../checkin/checkin.page';
import { MessageService } from '../services/Messages/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  shopFlag: any = false;
  checkout: any = false;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public messageService: MessageService,
    private nativeStorage: NativeStorage
  ) {
    this.checkInandout();
  }
  ngOnInit() {
  }
  logOut() {
    sessionStorage.removeItem("loginData");
    sessionStorage.removeItem("login");
    this.navCtrl.navigateRoot(["login_username"]);
  }

  showShopList() {
    if (this.shopFlag == false) {
      this.shopFlag = true;
    } else {
      this.shopFlag = false;
    }
  }

  async  workData_1(data) {
    if (data == "checkin") {
      if (this.checkout == false) {
        const modal = await this.modalCtrl.create({
          component: CheckinPage,
          cssClass: 'modalStyle'
        });
        await modal.present();
        var data: any;
        data = await modal.onWillDismiss();
        if (data) {
          this.checkInandout();
        }
      }
    } else if (data == "inventorycheck") {
      this.navCtrl.navigateForward(['inventorycheck']);
    }
  }

  checkInandout() {
    var aa = sessionStorage.getItem("checkin");
    if (aa == "in") {
      this.checkout = true;
    } else {
      this.checkout = false;
    }
  }

  checkOut() {
    this.messageService.showToast("Checkout successfully.");
    sessionStorage.setItem("checkin", "out");
    this.checkout = false;
  }

}
