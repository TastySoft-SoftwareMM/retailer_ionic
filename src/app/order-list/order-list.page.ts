import { Component, OnInit } from '@angular/core';

import { OfflineService } from '../services/offline/offline.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { OrderService } from '../services/order/order.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { OnlineService } from '../services/online/online.service';
import { ThrowStmt } from '@angular/compiler';
import { CartService } from '../services/cart/cart.service';
import { MessageService } from '../services/Messages/message.service';
import { async } from '@angular/core/testing';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  order = [];
  suborder = [];
  shop_info: any = [];
  loginData: any;
  imgurl: any;
  isLoading: any = false;

  discount: any = 0;
  shopsyskey: any;

  constructor(private offlineService: OfflineService,
    private onlineService: OnlineService,
    public utilService: UtilService,
    private nativeStorage: NativeStorage,
    private navCtrl: NavController,
    private orderService: OrderService,
    private loadingService: LoadingService,
    private cartService: CartService,
    private modalCtrl: ModalController,
    private messageService: MessageService,
    private toastCtrl: ToastController) { }
  ngOnInit() {

  };
  async ionViewWillEnter() {
    this.isLoading = true;

    this.order = [];
    this.imgurl = localStorage.getItem('imgurl');
    await this.nativeStorage.getItem("loginData").then(async (res) => {
      this.loginData = res;
      await this.getOrderShopInfo();
    });
    await this.downloadOrderList();
    console.log("GetOrderlist resolve")
  }
  async downloadOrderList() {
    await this.nativeStorage.getItem("ordershop").then(async (res: any) => {
      var param = {
        'shopcode': res.shopCode,
        'date': '',
        'trantype': 'SalesOrder',
        'usersyskey': this.loginData.syskey
      };
      this.orderService.clearOrderList();
      this.onlineService.getOrderList(param).subscribe((res: any) => {
        var data = res.list;

        if (data.length == 0) {
          this.loadingService.loadingDismiss();
          this.messageService.showToast("No order list");
          this.navCtrl.back();
        }
        else {
          this.orderService.copyOrderList(data);
          console.log("GetOrder resolved")
          this.getOrderList();
        }
      }, err => {
        this.loadingService.loadingDismiss();
        this.messageService.showNetworkToast(err);
        this.navCtrl.back();
      });
    });
  }
  async getOrderList() {
    this.order = await this.orderService.getOrderList();
    this.isLoading = false;
    this.loadingService.loadingDismiss();
  }
  getOrderShopInfo() {
    return new Promise(resolve => {
      this.nativeStorage.getItem("ordershop").then((res: any) => {
        console.log("Res>>" + JSON.stringify(res))
        this.shopsyskey = res.shopsyskey;
        this.shop_info = [
          {
            'shop_name': res.shopname,
            'address': res.address,
            'phone': res.phoneno
          }
        ];
        resolve();
      }, err => {
        resolve();
      });
    });
  }
  async photoViewer(img, stock) {
    console.log("img>" + img);
    if (img == "") {
    }
    else {
      var image = [{
        'img': img
      }]
      const modal = await this.modalCtrl.create({
        component: StockImageViewerPage,
        componentProps: {
          src: image,
          stock: stock,
          index: 1
        },
      });
      await modal.present();
      modal.onDidDismiss().then((dataReturned) => {
      });
    }
  }


  async presentToastWithOptions(message) {
    const toast = await this.toastCtrl.create({
      header: "#Discount",
      message: message,
      position: 'top',
      buttons: [
        {
          icon: 'refresh',
          handler: () => {
            // this.refreshDiscount();
          }
        },
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }


  handleImgError(ev: any, item: any) {
    console.log("ev >>" + JSON.stringify(ev));

    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
    console.log("source >>" + source);
  }
  async toggleSection(data) {
    await this.cartService.addOrderDetail([data], 'orderlist');
    console.log("detail" + JSON.stringify(data));
    this.navCtrl.navigateForward(['order-detail/forordershop']);
  }



  async updateOrderPage(order) {

    this.loadingService.loadingPresent();
    this.orderService.clearData();

    // Price Zone
    const pricezone = await this.cartService.downloadPricezone(this.shopsyskey);

    const result = await this.cartService.getPromotionItmes(this.shopsyskey);

    const multipleskuspromo = await this.cartService.downloadMultipleSKUs(this.shopsyskey);

    // Set Order Data
    this.orderService.setData(order);
    this.loadingService.loadingDismiss();

    this.navCtrl.navigateForward([`orderupdate/${order.syskey}`]);
  }
}
