import { Component, OnInit } from '@angular/core';
import { OfflineService } from '../services/offline/offline.service';
import { UtilService } from '../services/util.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CartService } from '../services/cart/cart.service';
import { OnlineService } from '../services/online/online.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { NavController, ModalController } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';
import { ShopService } from '../services/shop/shop.service';
import { OrderService } from '../services/order/order.service';

@Component({
  selector: 'app-shopmodal',
  templateUrl: './shopmodal.page.html',
  styleUrls: ['./shopmodal.page.scss'],
})
export class ShopmodalPage implements OnInit {
  shoplist: any = [];
  loginData: any;
  selectedRadioGroup: any;
  selectedRadioItem: any;

  selectshopdata: any;
  constructor(private offlineService: OfflineService, private util: UtilService,
    private nativeStorage: NativeStorage,
    private cartService: CartService,
    private onlineService: OnlineService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private shopService: ShopService,
    private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.nativeStorage.getItem("loginData").then(res => {
      this.loginData = res;
      console.log("loginData -->" + JSON.stringify(this.loginData));
      this.getShopList();
    });
  }

  getShopList() {
    var shop_res = this.shopService.getShopByUser();
    for (var qe = 0; qe < shop_res.length; qe++) {
      this.shoplist.push(
        {
          id: shop_res[qe].id,
          shopcode: shop_res[qe].shopcode,
          address: shop_res[qe].address,
          phoneno: shop_res[qe].phoneno,
          shopsyskey: shop_res[qe].shopsyskey,
          shopname: shop_res[qe].shopname,
          checked: false
        }
      );
    }
  }

  radioGroupChange(event) {
    console.log("radioGroupChange", event.detail);
    this.selectedRadioGroup = event.detail;
  }

  radioFocus() {
    console.log("radioFocus");
  }
  radioSelect(event) {
    console.log("radioSelect", event.detail);
    this.selectedRadioItem = event.detail;
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  selectShop() {
    console.log("selectedRadio>" + this.selectedRadioGroup);
    if (this.selectedRadioGroup) {
      this.modalCtrl.dismiss();

      var shop = this.shoplist.filter(el => el.shopcode == this.selectedRadioGroup.value);
      shop.filter(obj => {
        this.selectshopdata = {
          'shopsyskey': obj.shopsyskey,
          'shopcode': obj.shopcode,
          'shopname': obj.shopname,
          'address': obj.address,
          'phoneno': obj.phoneno
        }
      })
      console.log("selectshopdata>>>" + JSON.stringify(this.selectshopdata));

      this.nativeStorage.remove("ordershop");
      var data = {
        'shopsyskey': this.selectshopdata.shopsyskey,
        'shopname': this.selectshopdata.shopname,
        'shopCode': this.selectshopdata.shopcode,
        'address': this.selectshopdata.address,
        'phoneno': this.selectshopdata.phoneno
      }
      this.nativeStorage.setItem("ordershop", data);
      this.loadingService.loadingDismiss();
      this.navCtrl.navigateForward(['order-list']);

    }
    else {
      this.messageService.showToast("Select shop");
      this.loadingService.loadingDismiss();
    }
  }
}
