import { Component, OnInit, HostBinding } from '@angular/core';
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
import { resolve } from 'url';

@Component({
  selector: 'app-inventorycheck',
  templateUrl: './inventorycheck.page.html',
  styleUrls: ['./inventorycheck.page.scss'],
})
export class InventorycheckPage implements OnInit {

  stocks: any = [];
  stocksall: any = [];
  investocks: any = [];

  inventorystatus: any;
  shop_info: any;
  checkinShopdata: any;
  loginData: any;


  slice: number = 10;

  imgurl: any;
  isLoading: any = false;

  hiddenSearch: any = true;
  searchterm: any = "";

  params: any = this.getParams();
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
  ) {
    this.isLoading = true;
    this.imgurl = localStorage.getItem('imgurl');
  }

  /*****
  *Note :: Inventory List => Update Inventory => Status(Completed)
  ******** Smart List     => Save Inventory => Status(Pending / INCOMPLETE)
  */

  async ngOnInit() {
    this.inventoryService.getStockAll();
    await this.getUserAndShop();
    await this.getStockAll();
  }
  ionViewDidEnter() {
    console.log("All Stock === " + JSON.stringify(this.stocksall));

    this.stocks = this.inventoryService.getDataInventory();

    var stocks = this.stocks;
    this.stocksall = stocks;
    console.log("All Stock1 === " + JSON.stringify(this.stocksall));

    this.investocks = this.inventoryService.getDataInventory();
  }

  async getUserAndShop() {
    return new Promise(resolve => {
      /********Checkin Shop Data ***************/
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

      /********User Data ***************/
      this.nativeStorage.getItem("loginData").then(res => {
        this.loginData = res;
        console.log("loginData -->" + JSON.stringify(this.loginData));
      });
      resolve();
    });

  }

  async getStockAll() {
    console.log("resolve");
    await this.getInventoryList();
    console.log("resolved");
    setTimeout(() => {
      console.log("Stocks == " + JSON.stringify(this.stocks));
      const stocks = this.stocks;
      this.stocksall = stocks;
      this.isLoading = false;
    }, 2000);
  }

  getInventoryList() {
    return new Promise(resolve => {
      this.stocks = [];
      var investock = this.inventoryService.getDataInventory();
      var stocks = this.dataTransfer.getData();
      if (investock.length == 0) {//check
        if (stocks.length > 0) {
          stocks.filter(obj => {
            this.inventorystatus = sessionStorage.getItem("Inventory");
            if (this.inventorystatus == "smartlist") {
              var res = this.inventoryService.getStockByStocksyskey(obj.stocksyskey);
              console.log("res>>" + JSON.stringify(res));
              if (res.length > 0) {
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
                    'amount': 1,
                    'expqty': 0,
                    'total': re.price
                  });

                  this.inventoryService.setDataInventory({
                    'id': re.id,
                    'syskey': re.syskey,
                    'img': re.img,
                    'desc': re.desc,
                    'code': re.code,
                    'brandOwnerName': re.brandOwnerName,
                    'brandOwnerSyskey': re.brandOwnerSyskey,
                    "whSyskey": re.whSyskey,
                    'price': re.price,
                    "packSizeCode": re.packSizeCode,
                    "categoryCode": re.categoryCode,
                    "subCategoryCode": re.subCategoryCode,
                    'amount': 1,
                    'expqty': 0
                  });
                });
                resolve();
              }
              else {
                resolve();
              }
            }
            else {
              var res = this.inventoryService.getStockByStocksyskey(obj.stockSyskey);
              console.log("res>>" + JSON.stringify(res));
              if (res.length > 0) {
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
                    "categoryDesc": re.categoryDesc,
                    "subCategoryDesc": re.subCategoryDesc,
                    'price': re.price,
                    'amount': obj.quantity,
                    'expqty': obj.expiredQuantity,
                    'total': re.price,
                    'headerSyskey': obj.headerSyskey,
                    'binSyskey': obj.binSyskey,
                    'transHeaderSyskey': obj.transHeaderSyskey,
                    'transDetailSyskey': obj.transDetailSyskey,
                    'isactive': 'yes'
                  });
                  this.investocks.push({
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
                    "categoryDesc": re.categoryDesc,
                    "subCategoryDesc": re.subCategoryDesc,
                    'price': re.price,
                    'amount': obj.quantity,
                    'expqty': obj.expiredQuantity,
                    'total': re.price,
                    'headerSyskey': obj.headerSyskey,
                    'binSyskey': obj.binSyskey,
                    'transHeaderSyskey': obj.transHeaderSyskey,
                    'transDetailSyskey': obj.transDetailSyskey,
                    'isactive': 'yes'
                  });
                  this.inventoryService.setDataInventory({
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
                    "categoryDesc": re.categoryDesc,
                    "subCategoryDesc": re.subCategoryDesc,
                    'price': re.price,
                    'amount': obj.quantity,
                    'expqty': obj.expiredQuantity,
                    'headerSyskey': obj.headerSyskey,
                    'binSyskey': obj.binSyskey,
                    'transHeaderSyskey': obj.transHeaderSyskey,
                    'transDetailSyskey': obj.transDetailSyskey,
                    'isactive': 'yes'
                  });
                });
                resolve();
              }
              else {
                resolve();
              }
            }
          });
        }
        else {
          resolve();
        }
      }
      else {
        this.stocks = investock;
        let status = sessionStorage.getItem('Inventory');
        if (status == "inventorylist") {
          this.investocks = investock;
        }
        resolve();
      }
    })
  }
  doInfinite(ev) { // Browse All Items
    console.log(this.stocks.length + '------' + this.slice);
    if (this.slice < this.stocks.length) {
      this.slice += 10;
    }
    ev.target.complete();
  }
  goBack() {
    this.navCtrl.navigateBack(["main"]);
  }
  addStock() {
    this.navCtrl.navigateForward(['inventorystock']);
  }


  /***********************Search Fun ****************/
  closeSearchfun() {
    this.hiddenSearch = true;
    this.isLoading = true;
    this.stocks = this.stocksall;
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

      this.stocks = this.stocksall.filter((item) => {
        return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else {
      this.stocks = this.stocksall;
    }
    setTimeout(() => {
      this.isLoading = false;
      console.log("Stocks ==" + JSON.stringify(this.stocks));
      console.log("All Stocks ==" + JSON.stringify(this.stocksall));
    }, 1000);
  }

  /***********************Search Fun ****************/
  async removeItem(i) {
    this.loadingService.loadingPresent();
    if (this.inventorystatus == "inventorylist") {
      this.stocks[i].isactive = "no";
      this.investocks[i].recordStatus = 4;
      this.stocksall.filter(el => el.code == this.stocks[i].code).map(val => {
        val.isactive = "no";
      });
      console.log("updateinvestock");
      await this.inventoryService.updateInveStock(this.stocks[i].code);
      this.stocks = this.stocks.filter(el => el.isactive == "yes");
      this.stocksall = this.stocksall.filter(el => el.isactive == "yes");
      console.log("...");
    }
    else {
      for (var index = 0; index < this.stocksall.length; index++) {
        if (this.stocksall[index].code == this.stocks[i].code) {
          this.stocksall.splice(index, 1);
          break;
        }
      }
    }
    setTimeout(() => {
      this.loadingService.loadingDismiss();
    }, 100);
  }


  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }



  inputChange(event) {
    event.target.value = Number(event.target.value.toString().replace(/[^0-9]*/g, ''));
  }
  handleImgError(ev: any, item: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }
  incrementAmount(p) {
    p.total = p.price * p.amount;
    this.inventoryService.increaseAmount(p);
  }
  incrementexpAmount(p) {
    p.total = p.price * p.expqty;
    this.inventoryService.incrementexpAmount(p);
  }
  decreaseAmount(p) {
    p.total = p.price * p.amount;
    this.inventoryService.decreaseAmount(p);
  }
  decreaseexpAmount(p) {
    p.total = p.price * p.expqty;
    this.inventoryService.decreaseexpAmount(p);
  }
  getParams() {
    return { "syskey": '', "n1": "", "transType": '', "userid": '', "username": '', 't4': '', 'userSysKey': '', 'ic002': [] };
  }
  done() {
    this.checkStep("save");
  }
  save() {
    if (this.stocks.length == 0) {
    }
    else {
      var status = sessionStorage.getItem("Inventory");
      if (status == "smartlist") {
        this.saveInventory();
      }
      else {
        this.updateInventory();
      }
    }
  }
  saveInventory() {
    this.investocks = this.stocks;
    this.loadingService.loadingPresent();
    this.offlineService.deleteInventory().then(res => {
      /*******Create Array */
      this.params.syskey = "0";
      this.params.n1 = this.checkinShopdata.shopcode;
      this.params.transType = 211;
      this.params.userid = this.loginData.userId;
      this.params.username = this.loginData.userName;
      this.params.t4 = this.util.getTodayDate();
      this.params.userSysKey = this.loginData.syskey;
      /** Unique Value By Brand */
      var brandary = [], check: any = false;
      Array.from(new Set(this.investocks.map(s => s.brandOwnerSyskey))).map(syskey => {
        return brandary.push({
          'brandOwnerName': this.investocks.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
          'brandOwnerSyskey': syskey,
        });
      });
      brandary.filter(bobj => {
        var stockbybrand = [];
        var transDetailsData = [];
        var stockdata;
        stockbybrand.push({
          n1: bobj.brandOwnerSyskey,
          syskey: "0",
          transDetailsData: []
        });
        /***   transDetailsData ----------  [start]**/
        stockdata = this.investocks.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);
        stockdata.filter(sobj => {
          transDetailsData.push({
            't2': sobj.code,
            'n2': sobj.whSyskey,
            'n3': "0",
            'syskey': "0",
            'n13': sobj.amount,
            'n14': sobj.expqty,
            'recordStatus': 1
          });
        });
        transDetailsData.filter(obj => {
          stockbybrand.reduce((i, j) => i + j.transDetailsData.push(obj), 0);
        });
        /***   transDetailsData ----------  [end]**/
        stockbybrand.filter(sbobj => {
          if (sbobj) {
            this.params.ic002.push(sbobj);
          }
        });
      });
      this.onlineService.saveInventory(this.params).subscribe((res: any) => {
        if (res.status == "SUCCESS") {
          this.investocks.filter(el => el.amount >= 1 || el.expqty >= 1).map(val => {
            check = true;
          });
          if (check) {
            for (var i = 0; i < this.investocks.length; i++) {
              if (this.investocks[i].amount == "") {
                this.investocks[i].amount = 0;
              }
              if (this.investocks[i].expqty == "") {
                this.investocks[i].expqty = 0;
              }
              if ((this.investocks[i].amount != 0 || this.investocks[i].amount != "") || (this.investocks[i].expqty != 0 || this.investocks[i].expqty != "")) {
                if (this.investocks[i].expqty != 0 || this.investocks[i].expqty != "") {
                  this.cartService.addToCartReturnProduct(this.investocks[i]);
                  this.offlineService.insertInventory(this.investocks[i].code, "33298", this.investocks[i].img, this.investocks[i].desc, "332", this.investocks[i].brandOwnerName, this.investocks[i].brandOwnerSyskey, "1", this.investocks[i].price, this.investocks[i].whSyskey, this.investocks[i].expqty, this.investocks[i].amount).then(res => {
                  });
                }
              }
              else {
              }
            }
            this.checkStep("save");
          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Please check SKU qty");
          }
        }
        else {
          this.loadingService.loadingDismiss();
          this.messageService.showToast("Something wrong!");
        }
      });
    })
  }
  updateInventory() {
    this.loadingService.loadingPresent();
    this.offlineService.deleteInventory().then(res => {
      /*******Create Array */
      this.params.syskey = this.investocks[0].headerSyskey;
      this.params.n1 = this.checkinShopdata.shopcode;
      this.params.transType = 211;
      this.params.userid = this.loginData.userId;
      this.params.username = this.loginData.userName;
      this.params.t4 = this.util.getTodayDate();
      this.params.userSysKey = this.loginData.syskey;
      /** Unique Value By Brand */
      var brandary = [], check: any = false;
      Array.from(new Set(this.investocks.map(s => s.brandOwnerSyskey))).map(syskey => {
        return brandary.push({
          'brandOwnerName': this.investocks.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
          'transHeaderSyskey': this.investocks.find(s => s.brandOwnerSyskey === syskey).transHeaderSyskey,
          'brandOwnerSyskey': syskey,
        });
      });
      brandary.filter(bobj => {
        var stockbybrand = [];
        var transDetailsData = [];
        var stockdata;
        var transHeaderSyskey;
        if (bobj.transHeaderSyskey) {
          transHeaderSyskey = bobj.transHeaderSyskey;
        }
        else {
          transHeaderSyskey = "0";
        }
        stockbybrand.push({
          n1: bobj.brandOwnerSyskey,
          syskey: transHeaderSyskey,
          transDetailsData: []
        });
        /***   transDetailsData ----------  [start]***********/
        stockdata = this.investocks.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);
        stockdata.filter(sobj => {
          var binSyskey;
          var transDetailSyskey;
          var recordStatus;
          if (sobj.binSyskey) {
            binSyskey = sobj.binSyskey;
          }
          else {
            binSyskey = "0";
          }
          if (sobj.transDetailSyskey) {
            transDetailSyskey = sobj.transDetailSyskey;
          }
          else {
            transDetailSyskey = "0";
          }
          if (sobj.recordStatus) {
            recordStatus = sobj.recordStatus;
          }
          else {
            recordStatus = 1;
          }
          transDetailsData.push({
            't2': sobj.code,
            'n2': sobj.whSyskey,
            'n3': binSyskey,
            'syskey': transDetailSyskey,
            'n13': sobj.amount,
            'n14': sobj.expqty,
            'recordStatus': recordStatus
          });
        });
        transDetailsData.filter(obj => {
          stockbybrand.reduce((i, j) => i + j.transDetailsData.push(obj), 0);
        });
        /***   transDetailsData ----------  [end]**/
        stockbybrand.filter(sbobj => {
          if (sbobj) {
            this.params.ic002.push(sbobj);
          }
        });
      });
      this.onlineService.saveInventory(this.params).subscribe((res: any) => {
        if (res.status == "SUCCESS") {
          this.investocks.filter(el => el.amount >= 1 || el.expqty >= 1).map(val => {
            check = true;
          });
          if (check) {
            for (var i = 0; i < this.investocks.length; i++) {
              if (this.investocks[i].amount == "") {
                this.investocks[i].amount = 0;
              }
              if (this.investocks[i].expqty == "") {
                this.investocks[i].expqty = 0;
              }
              if ((this.investocks[i].amount != 0 || this.investocks[i].amount != "") || (this.investocks[i].expqty != 0 || this.investocks[i].expqty != "")) {
                if (this.investocks[i].expqty != 0 || this.investocks[i].expqty != "") {
                  this.cartService.addToCartReturnProduct(this.investocks[i]);
                  this.offlineService.insertInventory(this.investocks[i].code, "33298", this.investocks[i].img, this.investocks[i].desc, "332", this.investocks[i].brandOwnerName, this.investocks[i].brandOwnerSyskey, "1", this.investocks[i].price, this.investocks[i].whSyskey, this.investocks[i].expqty, this.investocks[i].amount).then(res => {
                  });
                }
              }
              else {
              }
            }
            this.checkStep("save");
          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Please check SKU qty");
          }
        }
      }, err => {
        this.loadingService.loadingDismiss();
        this.messageService.showNetworkToast(err);
      });
    })
  }
  checkStep(status) {
    this.nativeStorage.getItem("checkSteps").then(res => {
      console.log("checkSteps ===" + JSON.stringify(res));
      var data, task;
      if (this.loginData.userType == "storeowner") {
        data = {
          "checkin": "true",
          "inventorycheck": "COMPLETED",
          "orderplacement": res.orderplacement,
        };
        task = {
          "sessionId": sessionStorage.getItem('sessionid'),
          "task": {
            "inventoryCheck": "COMPLETED",
            "orderPlacement": res.orderplacement,
          }
        }
      }
      else {
        data = {
          "checkin": "true",
          "inventorycheck": "COMPLETED",
          "merchandizing": res.merchandizing,
          "orderplacement": res.orderplacement,
          "date": this.util.getTodayDate()
        };
        task = {
          "sessionId": sessionStorage.getItem('sessionid'),
          "task": {
            "inventoryCheck": "COMPLETED",
            "merchandizing": res.merchandizing,
            "orderPlacement": res.orderplacement,
            "print": "INCOMPLETE"
          }
        }
      }


      this.onlineService.setTask(task).subscribe((val: any) => {
        if (val.status == "SUCCESS") {
          this.nativeStorage.setItem("checkSteps", data);
          if (status == "save") {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Saved successfully.");
          }
          this.navCtrl.navigateBack(["main"]);
        }
        else {
          this.loadingService.loadingDismiss();
          this.messageService.showToast("Something wrong!");
        }
      });
    });
  }



  // async openPopover(ev, p) {
  //   const popover = await this.popoverCtrl.create({
  //     component: MerchTaskModalPage,
  //     cssClass: "taskModal",
  //     componentProps: {
  //       status: "return"
  //     }
  //   });
  //   await popover.present();
  //   var data = await popover.onDidDismiss();
  //   if (data.role == "backdrop") {
  //     p.amount = p.amount;
  //   }
  //   else {
  //     p.amount = data.data;
  //   }
  //   console.log("data>>" + JSON.stringify(data));
  // }
  // async openPopoverExp(ev, p) {
  //   const popover = await this.popoverCtrl.create({
  //     component: MerchTaskModalPage,
  //     cssClass: "taskModal",
  //     componentProps: {
  //       status: "return"
  //     }
  //   });
  //   await popover.present();
  //   var data = await popover.onDidDismiss();
  //   if (data.role == "backdrop") {
  //     p.expqty = p.expqty;
  //   }
  //   else {
  //     p.expqty = data.data;
  //   }
  //   console.log("data>>" + JSON.stringify(data));
  // }
}
