import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from '../services/Loadings/loading.service';
import { OfflineService } from '../services/offline/offline.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OnlineService } from '../services/online/online.service';
import { MessageService } from '../services/Messages/message.service';
import { NavController, AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { UtilService } from '../services/util.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { InventoryService } from '../services/inventory/inventory.service';
import { PrinterService } from '../services/printer/printer.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Ptor } from 'protractor';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { timeStamp } from 'console';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { resolve } from 'url';
import { ProImageViewerPage } from '../pro-image-viewer/pro-image-viewer.page';
import { async } from '@angular/core/testing';
import { InvoiceDiscountDetailPage } from '../invoice-discount-detail/invoice-discount-detail.page';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';
declare var cordova: any;


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  products = [];
  cart = [];
  subcart = [];
  allcart = [];
  shopinfo: any = [];
  returnedproduct: any = [];
  checkinshop: any = [];

  child: any = [];
  subchild: any = []; //for orderlist offline
  stockbybrand: any = [];
  stockreturndata: any = [];

  gifts: any = { "desc": null, "qty": 0, "show": false }

  imgurl: any;
  hiddenSearch: any;
  loginData: any;
  returnsubtotal: any = 0;
  returndiscountamount: any = 0;
  returntotalamount: any = 0;

  remark: any;
  ordersubtotal: any = 0;
  orderdiscountamount: any = 0;
  ordertotalamount: any = 0;
  printing: any;
  printerName: any;

  discount: any = 0; //for by shop
  totalAmountDiscount: any = 0;

  orderno: any;
  btnDisabled: any;
  printDisabled: any = true;
  confirmDisabled: any;

  params: any = this.getParams();
  checkstep: any;

  cartItemCount: BehaviorSubject<number>;
  isLoading: any = false;
  open: any = false;
  checkreturnform: any = false;


  constructor(private cartService: CartService, private loadingService: LoadingService,
    private offlineService: OfflineService,
    private onlineService: OnlineService,
    private nativeStorage: NativeStorage,
    private messageService: MessageService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private inventoryService: InventoryService,
    private printerService: PrinterService,
    private base64: Base64,
    public geolocation: Geolocation,
    private modalCtrl: ModalController,
    private file: File,
    public util: UtilService,
    private popoverCtrl: PopoverController,
    private toastController: ToastController) {
    this.nativeStorage.getItem("checkSteps").then(step => {
      this.checkstep = step;
    });
  }



  async ngOnInit() {
    this.isLoading = true;
    // check skip order
    await this.checkSkipOrder();

    console.log("Skip ==" + this.confirmDisabled);

    // Get checkin shop info 
    console.log("get shop");
    await this.getCheckinShopInfo();
    console.log("resolved shop");

    if (!this.confirmDisabled) {

      this.imgurl = localStorage.getItem('imgurl');
      this.cartItemCount = this.cartService.getCartItemCount();

      console.log("cart data await");
      this.cart = this.cartService.orderdata;
      console.log("cart data resolved");
      this.returnedproduct = this.cartService.returnorderdata;

      const returncart = this.cartService.cart.filter(el => el.isactive != "no" && el.statusqty == "exp").map(val => {
        return val;
      });
      this.returnsubtotal = returncart.reduce((i, j) => i + Number(j.total), 0);


      setTimeout(() => {
        this.isLoading = false;
        console.log(this.cart);
        console.log(this.returnedproduct);

      }, 200);
    }
    else {
      setTimeout(() => {
        this.isLoading = false;
      }, 200);
    }
  }


  ionViewWillEnter() {

    //Remark
    var comment = sessionStorage.getItem('ordercomment');
    if (comment) {
      this.remark = comment;
    }
    else {
      this.remark = "";
    }


    //Check visit
    this.btnDisabled = sessionStorage.getItem('checkvisit');
    if (this.btnDisabled == null || this.btnDisabled == undefined) {
      this.btnDisabled = true;
    }
    else {
      this.btnDisabled = false;
    }

    //Check Print Status
    this.printDisabled = sessionStorage.getItem('printstatus');
    if (this.printDisabled == null || this.printDisabled == undefined) {
      this.printDisabled = true;
    }
    else {
      this.printDisabled = false;
    }
  }


  ionViewDidEnter() {
    this.cartItemCount = this.cartService.getCartItemCount();
    this.btnDisabled = sessionStorage.getItem('checkvisit');
    if (this.btnDisabled == null || this.btnDisabled == undefined) {
      this.btnDisabled = true;
    }
    else {
      this.btnDisabled = false;
    }
  }




  checkSkipOrder() {
    return new Promise(resolve => {

      this.confirmDisabled = sessionStorage.getItem('skiporder');
      if (this.confirmDisabled == null || this.confirmDisabled == undefined) {
        this.confirmDisabled = false;
      }
      else {
        this.confirmDisabled = this.confirmDisabled;
      }
      resolve();

    })
  }


  getCheckinShopInfo() {
    return new Promise(resolve => {

      this.nativeStorage.getItem("checkinShopdata").then(res => {
        this.checkinshop = res;
        this.shopinfo = [
          {
            'shop_name': res.shopname,
            'address': res.address,
            'date': this.util.getforShowDate()
          }
        ]

        //--------------------------- Login User Data --------------------
        this.nativeStorage.getItem("loginData").then(res => {
          this.loginData = res;
          resolve();
        }, err => {
          resolve();
        });
      }, err => {
        resolve();
      });
    });
  }


  navigateBack() {
    this.navCtrl.back();
  }
  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }

  toggleSection() {
    if (this.returnedproduct.length > 0) {
      this.open = !this.open;
    }
    else {
      this.messageService.showToast("No data");
    }
  }
  toggleBrand(index) {
    this.returnedproduct[index].open = !this.returnedproduct[index].open;
  }

  toggleOrder(index) {
    this.cart[index].open = !this.cart[index].open;
  }

  giftToggleSection(index) {
    console.log("gift click");
    this.cart[index].giftopen = !this.cart[index].giftopen;
  }
  invToggleSection(index) {
    this.cart[index].invopen = !this.cart[index].invopen;
  }

  async completeVisit() {
    if (this.checkinshop.checkinStatus == "CHECKOUT") {
      this.messageService.showToast("Completed visit");
    }
    else if (this.loginData.userType == "storeowner") {
      if (this.checkstep.inventorycheck == "INCOMPLETE" || this.checkstep.inventorycheck == "PENDING") {
        this.messageService.showToast("Need to do 2.Inventory Check");
      }
      else {
        const alert = await this.alertCtrl.create({
          header: 'Message',
          message: 'Do you want to complete vist?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
              }
            }, {
              text: 'Yes',
              handler: () => {
                this.loadingService.loadingPresent();
                this.geolocation.getCurrentPosition().then((resp) => {
                  var data: any = {
                    "checkin": "true",
                    "inventorycheck": this.checkstep.inventorycheck,
                    "merchandizing": this.checkstep.merchandizing,
                    "orderplacement": this.checkstep.orderplacement,
                    "date": this.util.getTodayDate()
                  };
                  this.nativeStorage.setItem("checkSteps", data);

                  var orderPlacement;
                  if (this.btnDisabled == true) {
                    orderPlacement = "PASS";
                  }
                  else {
                    orderPlacement = "COMPLETED";
                  }
                  var params = {
                    "lat": resp.coords.latitude,
                    "lon": resp.coords.longitude,
                    "address": this.checkinshop.address,
                    "shopsyskey": this.checkinshop.shopsyskey,
                    "usersyskey": this.loginData.syskey,
                    "checkInType": "CHECKOUT",
                    "register": false,
                    "task": {
                      "inventoryCheck": this.checkstep.inventorycheck,
                      "orderPlacement": orderPlacement,
                    }
                  }
                  this.onlineService.checkIn(params).subscribe((res: any) => {
                    const check = {
                      checkin: 'out',
                      date: this.util.getTodayDate()
                    }
                    this.inventoryService.clearDataInventory();
                    this.offlineService.deleteInventory();
                    this.offlineService.updateMerchandizing({ status: "shopcompleted", shopsyskey: this.checkinshop.shopsyskey });
                    this.cartService.clearCart();
                    sessionStorage.setItem('routestatus', 'ordersubmit');
                    sessionStorage.setItem("checkin", JSON.stringify(check));
                    this.removeNative();
                    this.loadingService.loadingDismiss();
                    this.navCtrl.navigateBack(['main']);

                  }, err => {
                    this.loadingService.loadingDismiss();
                    this.messageService.showNetworkToast(err);
                  });
                }).catch((error) => {
                });
              }
            }
          ]
        });
        await alert.present();
      }
    }
    else {
      if ((this.checkstep.merchandizing == "INCOMPLETE" || this.checkstep.merchandizing == "PENDING") && (this.checkstep.inventorycheck == "INCOMPLETE" || this.checkstep.inventorycheck == "PENDING")) {
        this.messageService.showToast("Need to do 2.Inventory Check  3.Merchandizing");
      }
      else if (this.checkstep.inventorycheck == "INCOMPLETE" || this.checkstep.inventorycheck == "PENDING") {
        this.messageService.showToast("Need to do 2.Inventory Check");
      }
      else if (this.checkstep.merchandizing == "INCOMPLETE" || this.checkstep.merchandizing == "PENDING") {
        this.messageService.showToast("Need to do 3.Merchandizing ");
      }
      else {
        const alert = await this.alertCtrl.create({
          header: 'Message',
          message: 'Do you want to complete vist?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
              }
            }, {
              text: 'Yes',
              handler: () => {
                this.loadingService.loadingPresent();
                this.geolocation.getCurrentPosition().then((resp) => {
                  var data: any = {
                    "checkin": "true",
                    "inventorycheck": this.checkstep.inventorycheck,
                    "merchandizing": this.checkstep.merchandizing,
                    "orderplacement": this.checkstep.orderplacement,
                    "date": this.util.getTodayDate()
                  };
                  this.nativeStorage.setItem("checkSteps", data);

                  var orderPlacement;
                  if (this.btnDisabled == true) {
                    orderPlacement = "PASS";
                  }
                  else {
                    orderPlacement = "COMPLETED";
                  }
                  var params = {
                    "lat": resp.coords.latitude,
                    "lon": resp.coords.longitude,
                    "address": this.checkinshop.address,
                    "shopsyskey": this.checkinshop.shopsyskey,
                    "usersyskey": this.loginData.syskey,
                    "checkInType": "CHECKOUT",
                    "register": false,
                    "task": {
                      "inventoryCheck": this.checkstep.inventorycheck,
                      "merchandizing": this.checkstep.merchandizing,
                      "orderPlacement": orderPlacement,
                      "print": "COMPLETED"
                    }
                  }
                  this.onlineService.checkIn(params).subscribe((res: any) => {
                    const check = {
                      checkin: 'out',
                      date: this.util.getTodayDate()
                    }
                    this.inventoryService.clearDataInventory();
                    this.offlineService.deleteInventory();
                    this.offlineService.updateMerchandizing({ status: "shopcompleted", shopsyskey: this.checkinshop.shopsyskey });
                    this.cartService.clearCart();
                    sessionStorage.setItem('routestatus', 'ordersubmit');
                    sessionStorage.setItem("checkin", JSON.stringify(check));
                    this.removeNative();
                    this.loadingService.loadingDismiss();
                    this.navCtrl.navigateBack(['main']);

                  }, err => {
                    this.loadingService.loadingDismiss();
                    this.messageService.showNetworkToast(err);
                  });
                }).catch((error) => {
                });
              }
            }
          ]
        });
        await alert.present();
      }
    }

  }
  handleImgError(ev: any, item: any) {

    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }


  getParams() {
    return { "syskey": '', "autokey": "", "createddate": '', "modifieddate": '', "userid": '', 'username': '', 'saveStatus': '', 'recordStatus': '', 'syncStatus': '', 'syncBatch': '', 'transType': '', 'manualRef': '', 'docummentDate': '', 'shopCode': '', 'currRate': '', 'totalamount': '', 'cashamount': '', 'discountamount': '', 'taxSyskey': '', 'taxPercent': '', 'taxAmount': '', 'previousId': '', 'comment': '', 'stockByBrand': [] };
  }
  addReturnProduct() {
    this.navCtrl.navigateForward([`returnproduct`]);
  }


  orderSubmit() {
    var checkstatus = sessionStorage.getItem('checkvisit');
    if (checkstatus == null || checkstatus == undefined || checkstatus == "none" || checkstatus == "") {
      this.orderInsert();
    }
    else {
      this.orderUpdate();
    }
  }

  orderInsert() {
    console.log("cart ==" + JSON.stringify(this.cart));

    if (this.cart.length == 0) {
      this.messageService.showToast("No data in shopping cart");
    }
    else {
      sessionStorage.setItem('ordercomment', this.remark);


      this.params = this.getParams();
      this.loadingService.loadingPresent();
      this.params.syskey = "";
      this.params.autokey = "";
      this.params.createddate = "";
      this.params.modifieddate = "";
      this.params.userid = "";
      this.params.username = "";
      this.params.saveStatus = 1;
      this.params.recordStatus = 1;
      this.params.syncStatus = 1;
      this.params.syncBatch = "";
      this.params.transType = "SalesOrder";
      this.params.manualRef = "TBA";
      this.params.docummentDate = this.util.getTodayDate();
      this.params.shopCode = this.checkinshop.shopcode.toString();
      this.params.currRate = 1.0;
      this.params.cashamount = 1.0;
      this.params.discountamount = 1.0;
      this.params.taxSyskey = "0";
      this.params.taxPercent = 1.0;
      this.params.taxAmount = 1.0;
      this.params.previousId = "";
      this.params.comment = this.remark;
      this.ordertotalamount = this.cart.reduce((i, j) => i + Number(j.subtotal), 0);
      var borderinvdiscountamount = this.cart.reduce((i, j) => i + Number(j.invdisamount), 0);
      var orderproduct: any = Number(this.ordertotalamount);
      var returnproduct: any = Number(this.returnsubtotal);
      if (!orderproduct) {
        orderproduct = 0;
      }
      if (!returnproduct) {
        returnproduct = 0;
      }
      if (!borderinvdiscountamount) {
        borderinvdiscountamount = 0;
      }
      this.params.totalamount = (Number(orderproduct) - Number(returnproduct)) - Number(borderinvdiscountamount);

      this.cart.filter(bobj => {

        this.stockbybrand = [];
        this.stockreturndata = [];
        this.child = [];

        //---------part of Stockbybrand [start]-------------
        var orderbrand, stockdata;

        //order product
        orderbrand = this.cart.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);
        console.log("Order Brand --" + JSON.stringify(orderbrand));


        var bordersubtotal = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.subtotal), 0));
        var invdisamount = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisamount), 0));
        var invdisper = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisper), 0));


        // stockdata = this.allcart.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.statusqty == 'sim');
        const returnstockdata = this.cartService.cart.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.statusqty == "exp").map(val => {
          return val;
        });


        //return product
        let breturnsubtotal = returnstockdata.reduce((i, j) => i + Number(j.total), 0);
        let breturntotal = Number(breturnsubtotal);


        //brand gift
        var promotItemsByBrand = [];
        if (orderbrand.length > 0) {
          var gifts = orderbrand[0].gifts;
          console.log(gifts);
          if (gifts.length > 0) {
            gifts.map(gift => {
              promotItemsByBrand.push({
                'syskey': '0',
                'recordStatus': 1,
                'stockCode': '',
                'stockName': gift.GiftDesc,
                'stockSyskey': gift.discountStockSyskey == "" || gift.discountStockSyskey == null || gift.discountStockSyskey == undefined ? 0 : gift.discountStockSyskey,
                'promoStockSyskey': gift.GiftSyskey == "" || gift.GiftSyskey == null || gift.GiftSyskey == undefined ? 0 : gift.GiftSyskey,
                'qty': Number(gift.GiftQty),
                'promoStockType': gift.DiscountItemType
              });
            })
          }
        }


        this.stockbybrand.push({
          "syskey": "",
          "autokey": "",
          "createdate": "",
          "modifieddate": "",
          "userid": "",
          "username": '',
          "saveStatus": 1,
          "recordStatus": 1,
          "syncStatus": 1,
          "syncBatch": "",
          "transType": "SalesOrder",
          "transId": "",
          "docummentDate": this.util.getTodayDate(),
          "brandOwnerCode": this.cartService.stockdata.find(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey).brandOwnerCode,
          "brandOwnerName": bobj.name,
          "brandOwnerSyskey": bobj.brandOwnerSyskey,
          "orderSyskey": "",
          "totalamount": this.util.fixedPoint((Number(bordersubtotal) - Number(breturntotal)) - Number(invdisamount)),
          "orderTotalAmount": this.util.fixedPoint(Number(bordersubtotal)),
          "returnTotalAmount": breturntotal,
          "cashamount": 0.0,
          "discountamount": 0.0,
          "taxSyskey": "",
          "taxAmount": 0.0,
          "orderDiscountPercent": invdisper,
          "returnDiscountPercent": '0',
          "orderDiscountAmount": invdisamount,
          "returnDiscountAmount": 0,
          'promotionList': promotItemsByBrand,
          "stockData": [],
          "stockReturnData": []
        });

        //---- part of order stockData 
        bobj.child.map(hrule => {
          hrule.rule.map(sobj => {
            //---- Promotion Items [gifts] -------

            //Single Rule
            var promotItems = [];
            if (sobj.gifts.length > 0) {
              sobj.gifts.map(gift => {
                promotItems.push({
                  syskey: "0",
                  recordStatus: 1,
                  stockCode: '',
                  stockName: gift.discountItemDesc,
                  stockSyskey: gift.discountStockSyskey == "" || gift.discountStockSyskey == null || gift.discountStockSyskey == undefined ? 0 : gift.discountStockSyskey,
                  promoStockSyskey: gift.discountItemSyskey == "" || gift.discountItemSyskey == null || gift.discountItemSyskey == undefined ? 0 : gift.discountItemSyskey,
                  qty: Number(gift.discountItemQty),
                  promoStockType: gift.discountItemType
                })
              })
            }

            // Multiple rule gift
            if (sobj.multigift) {
              promotItems.push({
                syskey: "0",
                recordStatus: 1,
                stockCode: '',
                stockName: sobj.multigift.discountItemDesc,
                stockSyskey: sobj.multigift.discountStockSyskey == "" || sobj.multigift.discountStockSyskey == null || sobj.multigift.discountStockSyskey == undefined ? 0 : sobj.multigift.discountStockSyskey,
                promoStockSyskey: sobj.multigift.discountItemSyskey == "" || sobj.multigift.discountItemSyskey == null || sobj.multigift.discountItemSyskey == undefined ? 0 : sobj.multigift.discountItemSyskey,
                qty: Number(sobj.multigift.discountItemQty),
                promoStockType: sobj.multigift.discountItemType
              })
            }

            //---- Promotion Items [gifts] -------
            let discountAmount = this.util.fixedPoint((Number(sobj.price) * Number(sobj.discountPercent)) / 100);
            let sellingPrice = this.util.fixedPoint(Number(sobj.price) - Number(discountAmount));

            this.child.push({
              "syskey": "",
              "stockCode": sobj.code,
              "recordStatus": 1,
              "saleCurrCode": "MMK",
              "n1": "",
              "wareHouseSyskey": sobj.whSyskey,
              "binSyskey": "0",
              "qty": Number(sobj.amount),
              "lvlSyskey": "390398473894233",
              "lvlQty": 0,
              "n8": 0.0,
              "normalPrice": Number(sobj.price),
              "price": sellingPrice,
              "n9": 0.0,
              "taxAmount": 0.0,
              "totalAmount": this.util.fixedPoint(Number(sellingPrice) * Number(sobj.amount)),
              "taxCodeSK": "0",
              "isTaxInclusice": 0,
              "taxPercent": 0.0,
              'discountAmount': Number(discountAmount),
              'discountPercent': sobj.discountPercent,
              'promotionStockList': promotItems
            });
          })
        });


        this.child.filter(obj => {
          this.stockbybrand.reduce((i, j) => i + j.stockData.push(obj), 0);
        });


        //--------part of stockbybrand [end]---------


        //--------part of stockreturndata [start]---------
        returnstockdata.map(sobj => {
          this.stockreturndata.push({
            "syskey": "",
            "stockCode": sobj.code,
            "saleCurrCode": "MMK",
            "n1": "",
            "wareHouseSyskey": sobj.whSyskey,
            "binSyskey": "0",
            "qty": Number(sobj.amount),
            "lvlSyskey": "390398473894233",
            "lvlQty": 0,
            "n8": 0.0,
            "price": Number(sobj.price),
            "n9": 0.0,
            "taxAmount": 0.0,
            "totalAmount": sobj.total,
            "taxCodeSK": "0",
            "isTaxInclusice": 0,
            "taxPercent": 0.0
          });
        });
        this.stockreturndata.filter(obj => {
          this.stockbybrand.reduce((i, j) => i + j.stockReturnData.push(obj), 0);
        });
        this.stockbybrand.filter(obj => {
          if (obj) {
            this.params.stockByBrand.push(obj);
          }
        });
        //--------part of stockreturndata [start]---------
      });

      console.log("Save Order == " + JSON.stringify(this.params));
      // this.loadingService.loadingDismiss();

      setTimeout(() => {
        this.onlineService.saveOrder(this.params).subscribe((res: any) => {
          console.log("Return Order == " + JSON.stringify(res));

          if (res.status == "SUCCESS") {
            this.cartService.updateOrderParam(res.data);
            sessionStorage.setItem('printstatus', 'false');
            this.btnDisabled = false;
            this.printDisabled = false;
            sessionStorage.setItem('checkvisit', "false");
            var data: any = {
              "checkin": "true",
              "inventorycheck": this.checkstep.inventorycheck,
              "merchandizing": this.checkstep.merchandizing,
              "orderplacement": "COMPLETED",
              "date": this.util.getTodayDate()
            };
            this.nativeStorage.setItem("checkSteps", data);


            var param;
            // Store Owner
            if (this.loginData.userType == "storeowner") {
              param = {
                "sessionId": sessionStorage.getItem('sessionid'),
                "task": {
                  "inventoryCheck": this.checkstep.inventorycheck,
                  "orderPlacement": "COMPLETED",
                }
              }
            }
            else {
              param = {
                "sessionId": sessionStorage.getItem('sessionid'),
                "task": {
                  "inventoryCheck": this.checkstep.inventorycheck,
                  "merchandizing": this.checkstep.merchandizing,
                  "orderPlacement": "COMPLETED",
                  "print": "INCOMPLETE"
                }
              }
            }

            this.onlineService.setTask(param).subscribe((val: any) => {
            });


            this.messageService.showToast("Order confirm successfully.");
            this.loadingService.loadingDismiss();
            this.navCtrl.back();

          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Something wrong!.");
          }
        }, err => {
          this.loadingService.loadingDismiss();
          this.messageService.showNetworkToast(err);
        });
      }, 100);
    }
  }


  orderUpdate() {
    if (this.cart.length == 0) {
      this.messageService.showToast("No data in shopping cart");
    }
    else {
      sessionStorage.setItem('ordercomment', this.remark);

      this.params = this.getParams();
      this.loadingService.loadingPresent();
      this.orderno = "111" //orderno  update;
      this.params.syskey = sessionStorage.getItem('headersyskey');
      this.params.autokey = "";
      this.params.createddate = "";
      this.params.modifieddate = "";
      this.params.userid = "";
      this.params.username = "";
      this.params.saveStatus = 1;
      this.params.recordStatus = 1;
      this.params.syncStatus = 1;
      this.params.syncBatch = "";
      this.params.transType = "SalesOrder";
      this.params.manualRef = "TBA";
      this.params.docummentDate = this.util.getTodayDate();
      this.params.shopCode = this.checkinshop.shopcode.toString();
      this.params.currRate = 1.0;
      this.params.cashamount = 1.0;
      this.params.discountamount = 1.0;
      this.params.taxSyskey = "0";
      this.params.taxPercent = 1.0;
      this.params.taxAmount = 1.0;
      this.params.previousId = "";
      this.params.comment = this.remark;
      this.ordertotalamount = this.cart.reduce((i, j) => i + Number(j.subtotal), 0);

      var orderproduct = Number(this.ordertotalamount);
      var returnproduct = Number(this.returnsubtotal);
      if (!orderproduct) {
        orderproduct = 0;
      }
      if (!returnproduct) {
        returnproduct = 0;
      }

      this.params.totalamount = (Number(orderproduct) - Number(returnproduct));


      this.cart.filter(bobj => {
        this.stockbybrand = [];
        this.stockreturndata = [];
        this.child = [];
        //------------- part of Stockbybrand [start]------------- 
        var stockdata, orderbrand;

        //order product
        orderbrand = this.cart.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);
        var bordersubtotal = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.subtotal), 0));
        var invdisamount = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisamount), 0));
        var invdisper = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisper), 0));


        //return product
        const returnstockdata = this.cartService.cart.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.statusqty == "exp").map(val => {
          return val;
        });

        let breturnsubtotal = returnstockdata.reduce((i, j) => i + Number(j.total), 0);
        let breturntotal = Number(breturnsubtotal);


        var promotItemsByBrand = [];
        if (orderbrand.length > 0) {
          var gifts = orderbrand[0].gifts;
          console.log(gifts);
          if (gifts.length > 0) {
            gifts.map(gift => {
              promotItemsByBrand.push({
                'syskey': '0',
                'recordStatus': 1,
                'stockCode': '',
                'stockName': gift.GiftDesc,
                'stockSyskey': gift.discountStockSyskey == "" || gift.discountStockSyskey == null || gift.discountStockSyskey == undefined ? 0 : gift.discountStockSyskey,
                'promoStockSyskey': gift.GiftSyskey == "" || gift.GiftSyskey == null || gift.GiftSyskey == undefined ? 0 : gift.GiftSyskey,
                'qty': Number(gift.GiftQty),
                'promoStockType': gift.DiscountItemType
              });
            })
          }
        }


        this.stockbybrand.push({
          "syskey": bobj.returnbrandsyskey,
          "autokey": "",
          "createdate": "",
          "modifieddate": "",
          "userid": "",
          "username": '',
          "saveStatus": 1,
          "recordStatus": 1,
          "syncStatus": 1,
          "syncBatch": "",
          "transType": "SalesOrder",
          "transId": "",
          "docummentDate": this.util.getTodayDate(),
          "brandOwnerCode": bobj.brandOwnerCode,
          "brandOwnerName": bobj.brandOwnerName,
          "brandOwnerSyskey": bobj.brandOwnerSyskey,
          "orderSyskey": "",
          "totalamount": this.util.fixedPoint((Number(bordersubtotal) - Number(breturntotal)) - Number(invdisamount)),
          "orderTotalAmount": this.util.fixedPoint(Number(bordersubtotal)),
          "returnTotalAmount": breturntotal,
          "cashamount": 0.0,
          "discountamount": 0.0,
          "taxSyskey": "",
          "taxAmount": 0.0,
          "orderDiscountPercent": invdisper,
          "returnDiscountPercent": 0,
          "orderDiscountAmount": Number(invdisamount),
          "returnDiscountAmount": 0,
          'promotionList': promotItemsByBrand,
          "stockData": [],
          "stockReturnData": []
        });
        bobj.child.map(hrule => {
          hrule.rule.map(sobj => {
            // check stock => 'delete' or 'new / update'

            var syskey;
            if (sobj.returnsyskey) {
              syskey = sobj.returnsyskey;
            }
            else {
              syskey = "";
            }

            var recordStatus;
            if (sobj.isactive == "no") {
              recordStatus = 4;
            }
            else {
              recordStatus = 1;
            }

            //---- Promotion Items [gifts] -------

            var promotItems = [];
            // Single Rule
            if (sobj.gifts.length > 0) {
              sobj.gifts.map(gift => {
                promotItems.push({
                  syskey: "0",
                  recordStatus: 1,
                  stockCode: '',
                  stockName: gift.discountItemDesc,
                  stockSyskey: gift.discountStockSyskey == "" || gift.discountStockSyskey == null || gift.discountStockSyskey == undefined ? 0 : gift.discountStockSyskey,
                  promoStockSyskey: gift.discountItemSyskey == "" || gift.discountItemSyskey == null || gift.discountItemSyskey == undefined ? 0 : gift.discountItemSyskey,
                  qty: Number(gift.discountItemQty),
                  promoStockType: gift.discountItemType
                })
              })
            }

            // Multiple Rule
            if (sobj.multigift) {
              promotItems.push({
                syskey: "0",
                recordStatus: 1,
                stockCode: '',
                stockName: sobj.multigift.discountItemDesc,
                stockSyskey: sobj.multigift.discountStockSyskey == "" || sobj.multigift.discountStockSyskey == null || sobj.multigift.discountStockSyskey == undefined ? 0 : sobj.multigift.discountStockSyskey,
                promoStockSyskey: sobj.multigift.discountItemSyskey == "" || sobj.multigift.discountItemSyskey == null || sobj.multigift.discountItemSyskey == undefined ? 0 : sobj.multigift.discountItemSyskey,
                qty: Number(sobj.multigift.discountItemQty),
                promoStockType: sobj.multigift.discountItemType
              })
            }

            //---- Promotion Items [gifts] -------
            let discountAmount = this.util.fixedPoint((Number(sobj.price) * Number(sobj.discountPercent)) / 100);
            let sellingPrice = this.util.fixedPoint(Number(sobj.price) - Number(discountAmount));

            this.child.push({
              "syskey": syskey,
              "stockCode": sobj.code,
              "recordStatus": recordStatus,
              "saleCurrCode": "MMK",
              "n1": "",
              "wareHouseSyskey": sobj.whSyskey,
              "binSyskey": "0",
              "qty": Number(sobj.amount),
              "lvlSyskey": "390398473894233",
              "lvlQty": 0,
              "n8": 0.0,
              "normalPrice": Number(sobj.price),
              "price": sellingPrice,
              "n9": 0.0,
              "taxAmount": 0.0,
              "totalAmount": this.util.fixedPoint(Number(sellingPrice) * Number(sobj.amount)),
              "taxCodeSK": "0",
              "isTaxInclusice": 0,
              "taxPercent": 0.0,
              'discountAmount': Number(discountAmount),
              'discountPercent': sobj.discountPercent,
              'promotionStockList': promotItems
            });
          });
        });

        this.child.filter(obj => {
          this.stockbybrand.reduce((i, j) => i + j.stockData.push(obj), 0);
        });
        //--------part of stockbybrand [end]---------


        //--------part of stockreturndata [start]---------
        returnstockdata.filter(sobj => {
          var syskey;
          if (sobj.returnsyskey) {
            syskey = sobj.returnsyskey;
          }
          else {
            syskey = "";
          }
          var recordStatus;
          if (sobj.isactive == "no") {
            recordStatus = 4;
          }
          else {
            recordStatus = 1;
          }
          this.stockreturndata.push({
            "syskey": syskey,
            "stockCode": sobj.code,
            "recordStatus": recordStatus,
            "saleCurrCode": "MMK",
            "n1": "",
            "wareHouseSyskey": sobj.whSyskey,
            "binSyskey": "0",
            "qty": Number(sobj.amount),
            "lvlSyskey": "390398473894233",
            "lvlQty": 0,
            "n8": 0.0,
            "price": Number(sobj.price),
            "n9": 0.0,
            "taxAmount": 0.0,
            "totalAmount": Number(sobj.price) * Number(sobj.amount),
            "taxCodeSK": "0",
            "isTaxInclusice": 0,
            "taxPercent": 0.0
          });
        });
        this.stockbybrand.filter(obj => {
          if (obj) {
            this.params.stockByBrand.push(obj);
          }
        });
        this.stockreturndata.filter(obj => {
          this.stockbybrand.reduce((i, j) => i + j.stockReturnData.push(obj), 0);
        });
        //--------part of stockreturndata [start]---------
      });
      console.log("Update order ==" + JSON.stringify(this.params));


      setTimeout(() => {
        this.onlineService.saveOrder(this.params).subscribe((res: any) => {
          if (res.status == "SUCCESS") {
            this.cartService.updateOrderParam(res.data);
            // this.cartService.clearCart();
            // this.cartService.produceAmount();

            sessionStorage.setItem('printstatus', 'false');
            sessionStorage.setItem('checkvisit', "false");

            // this.inventoryService.clearDataInventory();

            this.btnDisabled = false;
            this.printDisabled = false;

            //-------------- part of print  ---------------
            // this.printQ();
            this.messageService.showToast("Order update successfully.");
            this.loadingService.loadingDismiss();

            this.navCtrl.back();

          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Something wrong!.");
          }
        }, err => {
          this.loadingService.loadingDismiss();
          this.messageService.showNetworkToast(err);
        });

      }, 100);
    }
  }


  async printQ() {
    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'Do you want to Print?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // this.navCtrl.navigateBack(['main']);
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.printing = "1@_T@_C{companyname};@_C{address1};@_C{address2};@_C{open};@_C{saletype};@_C{reprint};Order No. : {slipNo}->{dateTime};@_L-;Qty->              Description->Price->Amount;@_L-;{body}@_L-;{totalTax}->{total};{DiscountAmount}->{discount};Tax Amount->{taxAmount};@_L-;Net Amount->{net};@_L-;@_CThank You!";
            this.connectPrinter();
          }
        }
      ]
    });
    await alert.present();

  }
  connectPrinter() {
    this.printerService.enableBT().then(() => this.printerService.searchBT()
      .then((devicesList) => {
        // Open printer selection
        var list = [];
        devicesList.forEach((devicesList) => {
          list.push(
            {
              name: 'printer',
              value: devicesList.address,
              label: devicesList.name,
              type: 'radio'
            }
          );
        });
        let alert1 = this.alertCtrl.create({
          header: 'Select your bluetooth printer',
          inputs: list,
          buttons: [{
            text: 'CANCEL',
            role: 'cancel',
            handler: () => {
              // this.navCtrl.navigateBack(['main']);
              // if (this.onoffstate == "online"){
              //   this.paymentdata();
              // }
            }
          },
          {
            text: 'SELECT',
            handler: (data) => {
              this.loadingService.loadingPresent();
              let arrDevices = data;
              var a = 0;
              this.printerService.connectBT(arrDevices).subscribe((connectStatus) => {
                a = 1;
                for (var s = 0; s < list.length; s++) {
                  if (list[s].value == arrDevices) {
                    this.printerName = list[s].label;
                    break;
                  }
                }
                // this.printer.print('<h1>Hello World!</h1>');
                // setTimeout(() => {
                if (a == 1) {
                  this.OnlinePrint();
                }
                // }, 1000);
              }, (error) => {
                a = 0;
                if (error != "Device connection was lost") {
                  this.loadingService.loadingDismiss();
                  let alertPrinterError = this.alertCtrl.create({
                    header: error,
                    buttons: ['CLOSE']
                  }).then(a => {
                    a.present();
                  });
                  // this.navCtrl.navigateBack(['main']);
                }
              });
            }
          }
          ]
        }).then(as => {
          as.present();
        });

      }).catch((error) => {
      })
    ).catch(err => {
    });
  }

  OnlinePrint() {
    let printerName: any;
    var dis, serv;
    let self = this;
    dis = "Discount Amount";
    serv = "Service Amount";
    this.printing = this.printing.replace('{taxAmount}', '0');
    this.printing = this.printing.replace('{DiscountAmount}', dis);
    this.printing = this.printing.replace('{ServiceAmount}', serv);
    this.printing = this.printing.replace('{PaidCash}', 'Cash');
    this.printing = this.printing.replace('{totalTax}', "Sub Total");
    this.printing = this.printing.replace('{companyname}', "iMart");
    this.printing = this.printing.replace('{address1}', 'Yangon');
    this.printing = this.printing.replace('{address2}', '237 WINTHROP STREET, မန္တလေး, ချမ်းအေးသာစံ, မန္တလေးခရိုင်, မန္တလေးတိုင်းဒေသကြီ:');
    this.printing = this.printing.replace('{open}', "Open Daily : 9:00 AM to 10:00 PM");
    this.printing = this.printing.replace('{saletype}', 'Cash');
    this.printing = this.printing.replace('{reprint}', '');
    this.printing = this.printing.replace('{slipNo}', '1');
    this.printing = this.printing.replace('{dateTime}', '17/05/2020');
    let body = "";
    var data = [
      {
        "Desc": "ပေါင်မုန့်မီးကင်",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "ကိတ်မုန့်ကိတ်မုန့်",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "စတော်ဘယ်ရီကိတ်",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "ပီဇာ",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "ကော်ဖီအေး",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
    ]
    for (var i = 0; i < data.length; i++) {
      body += data[i].Qty + "->" + data[i].Desc + "->" + data[i].Price + "->" + data[i].lineTotal + ";";
    }

    this.printing = this.printing.replace('{body}', body);
    this.printing = this.printing.replace('{total}', "5000");
    this.printing = this.printing.replace('{net}', "5000");
    this.printing = this.printing.replace('{discount}', '0');
    this.printing = this.printing.replace('{service}', '0');
    this.printing = this.printing.replace('{paid}', '5000');
    this.printing = this.printing.replace('{change}', '0');
    var ae = 0;
    var array;
    if (ae == 0) {
      // cordova.plugins.Bluetooth.list(function (data){
      //   printerName = data;

      // }, function (err) {
      //   // self.messangeOther.showMessage("Can't find the printer!", 2000);
      //   // self.paymentdata();
      // })
      cordova.plugins.Bluetooth.connect(function (data) {
        ae = 1;
      }, function (err) {
        ae = 0;
        // this.messageService.showToast("Can't connect"); 
      }, self.printerName.toString());
    }

    setTimeout(() => {
      if (ae == 1) {
        cordova.plugins.Bluetooth.drawCanvas(function (data) {
          ae = 2;
        }, function (err) {
          ae = 1;
        }, this.printing);
      }
    }, 2000);

    setTimeout(() => {
      if (ae == 2) {
        let fielPatch2 = this.file.externalRootDirectory + "/retailer_mit.png";
        this.base64.encodeFile(fielPatch2).then((bfile: string) => {
          cordova.plugins.Bluetooth.printImage(function (data) {
          }, function (err) {
            // self.paymentdata();
          }, bfile);
          this.loadingService.loadingDismiss();
          this.messageService.showToast('Printed successfully.');
          sessionStorage.setItem('printstatus', 'true');
          this.printDisabled = true;
          // this.navCtrl.navigateBack(['main']);
        }, (err) => {
          this.messageService.showToast("print Fail");
        });
        setTimeout(() => {
          cordova.plugins.Bluetooth.disconnect(function (data) {
            // self.paymentdata();
          }, function (err) {
          }, printerName.toString());
        }, 1000);
      }
    }, 5000);
  }
  removeNative() {
    sessionStorage.removeItem("headersyskey");
    sessionStorage.removeItem("checkvisit");
    sessionStorage.removeItem("printstatus");
    this.nativeStorage.setItem("merchandizing", "");
    this.nativeStorage.remove("checkSteps");
    this.nativeStorage.remove("checkinShopdata");
  }
}


