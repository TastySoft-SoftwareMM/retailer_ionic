import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { MessageService } from '../services/Messages/message.service';
import { NavController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { OfflineService } from '../services/offline/offline.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { OnlineService } from '../services/online/online.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { InventoryService } from '../services/inventory/inventory.service';
import { CartService } from '../services/cart/cart.service';
import { UtilService } from '../services/util.service';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';

@Component({
  selector: 'app-inventorycheck-view',
  templateUrl: './inventorycheck-view.page.html',
  styleUrls: ['./inventorycheck-view.page.scss'],
})
export class InventorycheckViewPage implements OnInit {

  stocks: any = [];
  allstocks: any = [];
  investocks: any = [];

  inventorystatus: any;
  shop_info: any;
  checkinShopdata: any;
  loginData: any;


  imgurl: any;
  checkdata: any = false;
  isLoading: any = false;

  hiddenSearch: any = true;
  searchterm: any = "";

  constructor(
    private nativeStorage: NativeStorage,
    private messageService: MessageService,
    private navCtrl: NavController,
    private offlineService: OfflineService,
    private onlineService: OnlineService,
    private dataTransfer: DatatransferService,
    private inventoryService: InventoryService,
    private loadingService: LoadingService,
    private modalCtrl: ModalController,
    private cartService: CartService,
    private util: UtilService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    // this.loadingService.loadingPresent();
    this.isLoading = true;
    this.getStockAll();
    this.imgurl = localStorage.getItem('imgurl');
    this.nativeStorage.getItem("checkinShopdata").then(res => {
      this.checkinShopdata = res;
      this.shop_info = [
        {
          'shop_name': res.shopname,
          'shop_code': res.shopcode,
          "shopsyskey": res.shopsyskey
        }
      ];
    });
    this.nativeStorage.getItem("loginData").then(res => {
      this.loginData = res;
      console.log("loginData -->" + JSON.stringify(this.loginData));
    });
  }
  ionViewDidEnter() {
  }
  goBack() {
    this.navCtrl.navigateBack(["main"]);
  }
  async getStockAll() {
    await this.getStockAllPromise();
    setTimeout(() => {
      var stocks = this.stocks;
      this.allstocks = stocks;
      this.isLoading = false;
    }, 1000);
  }
  getStockAllPromise() {
    return new Promise(resolve => {
      this.stocks = [];
      var stocks = this.dataTransfer.getData();
      if (stocks.length > 0) {
        stocks.filter(obj => {
          var res = this.inventoryService.getStockByStocksyskey(obj.stockSyskey);
          console.log("res>>" + JSON.stringify(res));
          if (res.length > 0) {
            this.checkdata = true;
            res.filter(re => {
              this.stocks.push({
                'id': re.id,
                'syskey': re.syskey,
                'img': re.img,
                'desc': re.desc,
                'code': re.code,
                'brandOwnerName': re.brandOwnerName,
                'brandOwnerSyskey': re.brandOwnerSyskey,
                "whSyskey": re.whSyskey,
                "packSizeCode": re.packSizeCode,
                "categoryCode": re.categoryCode,
                "subCategoryCode": re.subCategoryCode,
                'price': re.price,
                'amount': obj.quantity,
                'expqty': obj.expiredQuantity,
                'total': re.price
              });
            });
            resolve();
          }
          else {
            resolve();
          }
        });
      }
      else {
        resolve();
      }

    })
  }


  closeSearchfun() {
    this.hiddenSearch = true;
    this.isLoading = true;
    this.stocks = this.allstocks;
    if (this.searchterm.toString().length > 0) {
      setTimeout(() => {
        this.isLoading = false;
        this.searchterm = "";
      }, 1000);
    }
    else {
      this.isLoading = false;
    }
  }


  searchQuery() {
    this.isLoading = true;
    var val = this.searchterm;

    if (val !== "" || val !== null || val !== undefined) {

      this.stocks = this.allstocks.filter((item) => {
        return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });


    }
    else {
      this.stocks = this.allstocks;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }

  handleImgError(ev: any, item: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }

}
