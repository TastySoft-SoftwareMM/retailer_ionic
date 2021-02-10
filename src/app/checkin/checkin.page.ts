import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OnlineService } from '../services/online/online.service';
import { MessageService } from '../services/Messages/message.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { OfflineService } from '../services/offline/offline.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { NetworkService } from '../services/network/network.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { ShopService } from '../services/shop/shop.service';
import { CartService } from '../services/cart/cart.service';
import { async } from '@angular/core/testing';
import { InventoryService } from '../services/inventory/inventory.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {

  lat: any;
  long: any;
  userName: any;
  spcode: any;
  shopbyUser: any = [];
  shopbyTeam: any = [];
  shopList: any = [];
  users: any = [];



  datetime: any;
  date: any;
  time: any;

  shopName: any;
  currentType: any;
  task: any;

  address: any;
  shopsyskey: any;
  shopcode: any;
  loginData: any;
  currentDate: String = new Date().toISOString();
  searchToday: any;

  checkinDisabled: any = true;
  isLoading: any = false;

  checkintype: any;
  checkintypes: any = [{
    'id': 1,
    'name': "Check In",
  },
  {
    'id': 2,
    'name': "Store Closed",
  }
  ];

  constructor(
    private nativeStorage: NativeStorage,
    public modalCtrl: ModalController,
    public onlineService: OnlineService,
    public messageService: MessageService,
    public geolocation: Geolocation,
    public offlineService: OfflineService,
    private networkService: NetworkService,
    private locationAccuracy: LocationAccuracy,
    private util: UtilService,
    private dataTransfer: DatatransferService,
    private loadingService: LoadingService,
    private cartService: CartService,
    private shopService: ShopService,
    private inventoryService: InventoryService
  ) {
    this.nativeStorage.getItem("loginData").then(res => {
      this.loginData = res;
      console.log("loginData -->" + JSON.stringify(this.loginData));
      this.today();
      this.getDatasforthispage();
    });
  }
  ngOnInit() {
    this.isLoading = false;
    console.log(">>" + this.shopsyskey);
    this.locationAccuracy.canRequest().then((canRequest: any) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          console.log('Request successful');
          this.getLatandLong();
        },
        error => {
          this.getLatandLongDefault();
          console.log('Error requesting location permissions', error)
        }
      );
    }, err => {
      this.getLatandLongDefault();
    });
  }
  retryGetLocation() {
    this.ngOnInit();
  }

  getLatandLongDefault() {
    this.lat = 16.91464,
      this.long = 96.14268;
    this.isLoading = true;
  }

  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }
  today() {
    let year = this.currentDate.substring(0, 4);
    let month = this.currentDate.substring(5, 7);
    let day = this.currentDate.substring(8, 10);
    this.searchToday = year + month + day;
  }

  async closeModal() {
    this.nativeStorage.remove("checkinShopdata");
    await this.modalCtrl.dismiss();
  }

  saveData() {
    if ((this.lat == "" || this.lat == undefined || this.lat == null) && (this.long == "" || this.long == undefined || this.long == null)) {
      this.messageService.showToast("Please open GPS.");
    }
    else {
      this.getLatandLong();
      this.getDateandtime();
      if (this.currentType == 'TEMPCHECKOUT' || this.currentType == 'CHECKIN' || this.currentType == "STORECLOSED") {
        this.checkintype = 'Check In';
        this.loadingService.loadingPresent();
        var task;
        if (this.loginData.userType == "storeowner") {
          task = {
            "orderPlacement": this.task.orderPlacement,
            "inventoryCheck": this.task.inventoryCheck,
          }
        }
        else {
          task = {
            "inventoryCheck": this.task.inventoryCheck,
            "merchandizing": this.task.merchandizing,
            "orderPlacement": this.task.orderPlacement,
            "print": "COMPLETED"
          };
        }

        var params = {
          "lat": this.lat,
          "lon": this.long,
          "address": this.address,
          "shopsyskey": this.shopsyskey,
          "usersyskey": this.loginData.syskey,
          "checkInType": "CHECKIN",
          "register": false,
          "task": task
        }
        console.log("checkinparam " + JSON.stringify(params));
        this.onlineService.checkIn(params).subscribe(async (res: any) => {
          console.log("-->" + JSON.stringify(res));
          if (res.status == "SUCCESS") {
            sessionStorage.setItem("sessionid", res.data.sessionid);
            for (var q = 0; q < this.shopbyUser.length; q++) {
              if (this.shopsyskey == this.shopbyUser[q].shopsyskey) {
                this.nativeStorage.setItem("checkinShopdata", this.shopbyUser[q]);
                break;
              }
            }
            var data: any = {
              "checkin": "true",
              "inventorycheck": this.task.inventoryCheck,
              "merchandizing": this.task.merchandizing,
              "orderplacement": this.task.orderPlacement,
              "date": this.util.getTodayDate()
            };

            this.nativeStorage.setItem("checkSteps", data);
            if (this.currentType == "TEMPCHECKOUT" || this.currentType == "CHECKIN") {
              var param = {
                'shopcode': this.shopcode,
                'date': this.util.getTodayDate(),
                'trantype': 'SalesOrder',
                'usersyskey': this.loginData.syskey
              };
              this.onlineService.getOrderList(param).subscribe(async (res: any) => {
                console.log("RES>>" + JSON.stringify(res));
                if (res.list.length > 0) {
                  await this.cartService.getPromotionItmes(this.shopsyskey);
                  console.log('await multi');
                  
                  await this.cartService.downloadMultipleSKUs(this.shopsyskey);
                }

                console.log('await multi resolved');

                // Checking Return Product By InventoryCheckList
                const returndata = await this.checkingReturnProduct();
                this.cartService.addToCartOrder(res.list);
                const check = {
                  checkin: 'In',
                  date: this.util.getTodayDate()
                }
                sessionStorage.setItem("checkin", JSON.stringify(check));

                // Price Zone
                const pricezone = await this.cartService.downloadPricezone(this.shopsyskey);
                this.loadingService.loadingDismiss();
                this.messageService.showToast("Checkin successfully.");


                this.modalCtrl.dismiss({ 'status': 'checkin' });
              });
            }
            else {
              // Price Zone
              const pricezone = await this.cartService.downloadPricezone(this.shopsyskey);
              this.loadingService.loadingDismiss();
              this.messageService.showToast("Checkin successfully.");
              const check = {
                checkin: 'In',
                date: this.util.getTodayDate()
              }
              sessionStorage.setItem("checkin", JSON.stringify(check));

              this.modalCtrl.dismiss({ 'status': 'checkin' });
            }

          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Invalid checkin.");
          }
        },
          err => {
            console.log("err-->" + JSON.stringify(err));
            this.messageService.showNetworkToast(err);
            this.loadingService.loadingDismiss();
          })
      }

      else {
        if (this.checkintype == null || this.checkintype == "" || this.checkintype == undefined) {
          this.messageService.showToast("Please choose checkin type.");
        }
        else {
          console.log("checkintype" + this.checkintype);
          if (this.checkintype == 'Check In') {
            this.loadingService.loadingPresent();

            var ctask;
            if (this.loginData.userType == "storeowner") {
              if (this.task == "") {
                ctask = "INCOMPLETE";
              }
              else {
                ctask = this.task;
              }
            }
            else {
              ctask = {
                "inventoryCheck": this.task.inventoryCheck,
                "merchandizing": this.task.merchandizing,
                "orderPlacement": this.task.orderPlacement,
                "print": "COMPLETED"
              };
            }


            var checkinparam = {
              "lat": this.lat,
              "lon": this.long,
              "address": this.address,
              "shopsyskey": this.shopsyskey,
              "usersyskey": this.loginData.syskey,
              "checkInType": "CHECKIN",
              "register": false,
              "task": ctask
            }
            console.log("param>><<<<<" + JSON.stringify(params));
            this.onlineService.checkIn(checkinparam).subscribe(async (res: any) => {
              console.log("-->" + JSON.stringify(res));
              if (res.status == "SUCCESS") {
                sessionStorage.setItem("sessionid", res.data.sessionid);
                for (var q = 0; q < this.shopbyUser.length; q++) {
                  if (this.shopName == this.shopbyUser[q].shopname) {
                    console.log("aa-->" + JSON.stringify(this.shopbyUser[q]));
                    this.nativeStorage.setItem("checkinShopdata", this.shopbyUser[q]);
                    break;
                  }
                }
                var data: any = {
                  "checkin": "true",
                  "inventorycheck": this.task.inventoryCheck,
                  "merchandizing": this.task.merchandizing,
                  "orderplacement": this.task.orderPlacement,
                  "date": this.util.getTodayDate()
                };
                this.nativeStorage.setItem("checkSteps", data);
                if (this.currentType == "TEMPCHECKOUT" || this.currentType == "CHECKIN") {
                  var param = {
                    'shopcode': this.shopcode,
                    'date': this.util.getTodayDate(),
                    'trantype': 'SalesOrder',
                    'usersyskey': this.loginData.syskey
                  };
                  this.onlineService.getOrderList(param).subscribe(async (res: any) => {
                    console.log("RES>>" + JSON.stringify(res));
                    if (res.list.length > 0) {
                      await this.cartService.getPromotionItmes(this.shopsyskey);
                      await this.cartService.downloadMultipleSKUs(this.shopsyskey);
                    }

                    // Checking Return Product By InventoryCheckList
                    const returndata = await this.checkingReturnProduct();


                    this.cartService.addToCartOrder(res.list);
                    const check = {
                      checkin: 'In',
                      date: this.util.getTodayDate()
                    }
                    sessionStorage.setItem("checkin", JSON.stringify(check));


                    // Price Zone
                    const pricezone = await this.cartService.downloadPricezone(this.shopsyskey);
                    this.loadingService.loadingDismiss();
                    this.messageService.showToast("Checkin successfully.");

                    this.modalCtrl.dismiss({ 'status': 'checkin' });

                  });
                }
                else {
                  // Price Zone
                  const pricezone = await this.cartService.downloadPricezone(this.shopsyskey);
                  this.loadingService.loadingDismiss();
                  this.messageService.showToast("Checkin successfully.");
                  const check = {
                    checkin: 'In',
                    date: this.util.getTodayDate()
                  }
                  sessionStorage.setItem("checkin", JSON.stringify(check));

                  this.modalCtrl.dismiss({ 'status': 'checkin' });
                }

              }
              else {
                this.loadingService.loadingDismiss();
                this.messageService.showToast("Invalid checkin.");
              }
            },
              err => {
                console.log("err-->" + JSON.stringify(err));
                this.messageService.showNetworkToast(err);
                this.loadingService.loadingDismiss();
              })
          }
          else {
            for (var q = 0; q < this.shopbyUser.length; q++) {
              if (this.shopName == this.shopbyUser[q].shopname) {
                this.offlineService.updateshopUser(this.shopbyUser[q].id, "no", 'storeclosed').then(res => {
                  console.log("Update shopuser>>" + JSON.stringify(res));
                  this.modalCtrl.dismiss({ 'status': 'storeclosed', 'shop': this.shopbyUser[q] });
                });
                break;
              }
            }
          }
        }
      }
    }
  }


  checkingReturnProduct() {
    return new Promise(resolve => {
      if (this.task.inventoryCheck == "COMPLETED") {

        var inventoryparams = {
          "shopSyskey": this.shopsyskey,
          "userSyskey": this.loginData.syskey,
          "date": this.util.getTodayDate()
        }


        this.onlineService.getInventoryList(inventoryparams).subscribe((data: any) => {
          var res = JSON.parse(JSON.stringify(data));
          if (res.inventoryList && res.inventoryList.length > 0) {
            res.inventoryList.map(async (obj, index) => {
              var stocks = this.inventoryService.getStockByStocksyskey(obj.stockSyskey);

              if (stocks.length > 0) {
                stocks.map(re => {
                  var returndata = [{
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
                    'isactive': 'yes',
                  }]

                  returndata.map((rd, rindex) => {
                    if (rd.expqty != 0 || rd.expqty != "") {
                      this.cartService.addToCartReturnProduct(rd);
                    }

                    if (res.inventoryList.length == index + 1) {
                      resolve();
                    }

                  })
                });
              }
              else {
                resolve();
              }
            });
          }
          else {
            resolve();
          }
        }, err => {
          resolve();
        });
      }
      else {
        resolve();
      }
    })

  }
  getDatasforthispage() {
    this.shopbyUser = this.shopService.getShopByUser();
    this.userName = this.loginData.userName;
    console.log("userName -->" + this.userName);
    this.getDateandtime();
    var status = 0;
    for (var s = 0; s < this.shopbyUser.length; s++) {
      if (this.shopbyUser[s].shopsyskey == this.shopsyskey) {
        // this.address = this.shopbyUser[s].address;
        this.shopsyskey = this.shopbyUser[s].shopsyskey;
        this.shopcode = this.shopbyUser[s].shopcode;
        this.address = this.shopbyUser[s].address;
        // status = 1;
        break;
      }
    }

    // if (status == 0) {
    //   this.address = "Unregister";
    //   this.shopsyskey = "Unregister";
    // }
    // this.datetime = this.date + " - " + this.time;
  }
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  getDateandtime() {
    this.datetime = this.util.getforShowDate() + '-' + this.formatAMPM(new Date);
    this.date = new Date().toLocaleDateString();
    this.time = new Date().toLocaleTimeString();
  }
  getLatandLong() {
    this.geolocation.getCurrentPosition({ timeout: 40000 }).then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
      this.isLoading = true;
    }).catch((error) => {
      this.getLatandLongDefault();
      console.log('Error getting location', error);
    });
  }

  checkAddress() {
    for (var s = 0; s < this.shopbyUser.length; s++) {
      if (this.shopsyskey == this.shopbyUser[s].shopsyskey) {
        this.address = this.shopbyUser[s].address;
        this.shopsyskey = this.shopbyUser[s].shopsyskey;
      }
    }
  }

}
