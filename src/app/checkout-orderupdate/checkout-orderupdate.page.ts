

import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { NavParams, NavController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OfflineService } from '../services/offline/offline.service';
import { OrderService } from '../services/order/order.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { MessageService } from '../services/Messages/message.service';
import { OnlineService } from '../services/online/online.service';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { CartService } from '../services/cart/cart.service';
import { ProImageViewerPage } from '../pro-image-viewer/pro-image-viewer.page';
import { InvoiceDiscountDetailPage } from '../invoice-discount-detail/invoice-discount-detail.page';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-checkout-orderupdate',
  templateUrl: './checkout-orderupdate.page.html',
  styleUrls: ['../checkout/checkout.page.scss'],
})
export class CheckoutOrderupdatePage implements OnInit {

  order: any = [];
  allorder: any = [];
  suborder: any = [];
  returnedproduct: any = [];
  tabs: any = [];


  params: any = this.getParams();
  child: any = [];
  subchild: any = []; //for orderlist offline
  stockbybrand: any = [];
  stockreturndata: any = [];


  checkinshop: any;
  shopinfo: any = [];

  orderno: any;
  segment: any;
  imgurl: any;
  remark: any = "";

  isLoading: any = false;
  open: any = false;
  returnsubtotal: any = 0;

  orderdiscountamount: any = 0;
  ordersubtotal: any = 0;

  discount: any = 0;
  constructor(private nativeStorage: NativeStorage,
    public util: UtilService,
    private activateRoute: ActivatedRoute,
    private offlineService: OfflineService,
    private orderService: OrderService,
    private navCtrl: NavController,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private alertCtrl: AlertController,
    private onlineService: OnlineService,
    private cartService: CartService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    this.loadingService.loadingPresent();
  }
  async ngOnInit() {
    this.imgurl = localStorage.getItem('imgurl');
    this.segment = 1;
    this.orderno = this.activateRoute.snapshot.paramMap.get('orderno');

    console.log("Order shop await");

    await this.getOrderShopInfo();
    console.log("Order shop resolved");
    this.order = this.cartService.orderdata;
    this.returnedproduct = this.cartService.returnorderdata;
    console.log("order resolved");

    const returncart = this.orderService.orderstocks.filter(el => el.isactive != "no" && el.qtystatus == "exp").map(val => {
      return val;
    });
    this.returnsubtotal = returncart.reduce((i, j) => i + Number(j.total), 0);



    setTimeout(() => {
      this.isLoading = true;
      this.loadingService.loadingDismiss();
      console.log(this.order);
    }, 1000);
  }
  getOrderShopInfo() {
    return new Promise(resolve => {
      this.nativeStorage.getItem("ordershop").then((res: any) => {
        this.checkinshop = res;
        this.shopinfo = [
          {
            'shopsyskey': res.shopsyskey,
            'shopname': res.shopname,
            'address': res.address,
            'shopCode': res.shopCode,
            'date': this.util.getforShowDate()
          }
        ];
        resolve();
      }, err => {
        resolve();
      });
    })

  }


  navigateBack() {
    this.navCtrl.navigateBack([`orderupdate/${this.orderno}`]);
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
    this.order[index].open = !this.order[index].open;
  }
  giftToggleSection(index) {
    console.log("gift click");
    this.order[index].giftopen = !this.order[index].giftopen;
  }
  invToggleSection(index) {
    this.order[index].invopen = !this.order[index].invopen;
  }



  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }
  stocknotfoundAlert() {
    this.alertCtrl.create({
      header: "Can't update",
      message: 'Stock not found (or) Inactive stock'
    }).then(el => {
      el.present();
    })
  }




  dateFormat(date) {
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    let val = day + '/' + month + '/' + year;
    return val;
  }
  getParams() {
    return { "syskey": '', "autokey": "", "createddate": '', "modifieddate": '', "userid": '', 'username': '', 'saveStatus': '', 'recordStatus': '', 'syncStatus': '', 'syncBatch': '', 'transType': '', 'manualRef': '', 'docummentDate': '', 'shopCode': '', 'currRate': '', 'totalamount': '', 'cashamount': '', 'discountamount': '', 'taxSyskey': '', 'taxPercent': '', 'taxAmount': '', 'previousId': '', 'comment': '', 'stockByBrand': [] };
  }
  addStock() {
    this.navCtrl.navigateForward([`order-placement-fororderupdate`]);
  }


  updateOrder() {
    if (this.order.length == 0) {
      this.messageService.showToast("No data in shopping cart");
    }
    else {
      this.params = this.getParams();
      this.loadingService.loadingPresent();
      this.params.syskey = this.orderno.toString();
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
      this.shopinfo.filter(obj => {
        if (obj.shopCode == null) {
          this.params.shopCode = obj.shopCode;
        }
        else {
          this.params.shopCode = obj.shopCode.toString();
        }
      })
      this.params.currRate = 1.0;
      this.params.cashamount = 1.0;
      this.params.discountamount = 1.0;
      this.params.taxSyskey = "0";
      this.params.taxPercent = 1.0;
      this.params.taxAmount = 1.0;
      this.params.previousId = "0";
      this.params.comment = this.remark;


      this.ordersubtotal = this.order.reduce((i, j) => i + Number(j.total), 0);
      var orderproduct = (Number(this.ordersubtotal));
      var returnproduct = (Number(this.returnsubtotal));

      if (!orderproduct) {
        orderproduct = 0;
      }
      if (!returnproduct) {
        returnproduct = 0;
      }

      this.params.totalamount = (Number(orderproduct) - Number(returnproduct));

      //---------part of Stockbybrand [start]-------------

      //Brand List from order and return products

      //Order
      const orderbrandList = Array.from(new Set(this.order.map(s => s.brandOwnerSyskey))).map(syskey => {
        return {
          'brandOwnerSyskey': syskey
        };
      })

      //Return
      const returnbrandList = Array.from(new Set(this.returnedproduct.map(s => s.brandOwnerSyskey))).map(syskey => {
        return {
          'brandOwnerSyskey': syskey
        };
      })

      // Join Array Order product with Return products
      const joinbrandList = orderbrandList.concat(returnbrandList);
      const brandList = Array.from(new Set(joinbrandList.map(s => s.brandOwnerSyskey))).map(syskey => {
        return {
          'brandOwnerSyskey': syskey
        };
      });


      brandList.filter(bobj => {
        this.stockbybrand = [];
        this.stockreturndata = [];
        this.child = [];

        var stockdata, orderbrand;

        //Order By Brand Owner
        orderbrand = this.order.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);

        //Summary order By Brand Owner
        let bordersubtotal = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.subtotal), 0));
        let invdisamount = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisamount), 0));
        let invdisper = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisper), 0));
        let bordertotal = Number(bordersubtotal);


        //Summary return product By Brand Owner
        const returnstockdata = this.orderService.orderstocks.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.statusqty == "exp").map(val => {
          return val;
        });

        let breturnsubtotal = returnstockdata.reduce((i, j) => i + Number(j.total), 0);
        let breturntotal = Number(breturnsubtotal);


        if (!bordertotal) {
          bordertotal = 0;
        }
        if (!breturntotal) {
          breturntotal = 0;
        }


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
          "syskey": this.order.find(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey).brandSyskey,
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
          "brandOwnerCode": "",
          "brandOwnerName": this.cartService.stockdata.find(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey).brandOwnerCode,
          "brandOwnerSyskey": bobj.brandOwnerSyskey,
          "orderSyskey": "",
          "totalamount": this.util.fixedPoint((Number(bordertotal) - Number(breturntotal)) - Number(invdisamount)),
          "orderTotalAmount": Number(bordertotal),
          "returnTotalAmount": breturntotal,
          "cashamount": 0.0,
          "discountamount": 0.0,
          "taxSyskey": "",
          "taxAmount": 0.0,
          "orderDiscountPercent": invdisper,
          "returnDiscountPercent": 0,
          "orderDiscountAmount": invdisamount,
          "returnDiscountAmount": '0',
          'promotionList': promotItemsByBrand,
          "stockData": [],
          "stockReturnData": []
        });


        //--------part of order [start]---------
        if (orderbrand.length > 0) {
          orderbrand[0].child.map(hrule => {
            hrule.rule.map(sobj => {

              var recordStatus;
              if (sobj.isactive == "no") {
                recordStatus = 4; // deleted stock
              }
              else {
                recordStatus = 1; // new stock
              }

              //---- Promotion Items [gifts] -------
              var promotItems = [];

              // Single SKUs Promotion
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

              // Multiple SKUs Promotion
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
                "syskey": sobj.returnsyskey,
                "recordStatus": recordStatus,
                "stockCode": sobj.code,
                "saleCurrCode": "MMK",
                "n1": "",
                "wareHouseSyskey": sobj.whSyskey,
                "binSyskey": "0",
                "qty": sobj.amount,
                "lvlSyskey": "390398473894233",
                "lvlQty": parseInt('0'),
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
        }


        this.child.filter(obj => {
          this.stockbybrand.reduce((i, j) => i + j.stockData.push(obj), 0);
        });
        //--------part of order [end]---------


        //--------part of return [start]---------
        console.log("Returnstockdata>>" + JSON.stringify(returnstockdata));
        returnstockdata.filter(sobj => {
          var recordStatus;
          if (sobj.isactive == "no") {
            recordStatus = 4;
          }
          else {
            recordStatus = 1;
          }
          this.stockreturndata.push({
            "syskey": sobj.syskey,
            "recordStatus": recordStatus,
            "stockCode": sobj.code,
            "saleCurrCode": "MMK",
            "n1": "",
            "wareHouseSyskey": sobj.whSyskey,
            "binSyskey": "0",
            "qty": sobj.amount,
            "lvlSyskey": "390398473894233",
            "lvlQty": parseInt('0'),
            "n8": 0.0,
            "n9": 0.0,
            "taxAmount": 0.0,
            "totalAmount": parseInt(sobj.price) * parseInt(sobj.amount),
            "taxCodeSK": "0",
            "isTaxInclusice": 0,
            "taxPercent": 0.0
          });
        });

        this.stockreturndata.filter(obj => {
          if (obj) {
            this.stockbybrand.reduce((i, j) => i + j.stockReturnData.push(obj), 0);
          }
        })
        this.stockbybrand.filter(obj => {
          if (obj) {
            console.log("stockfdskjl>" + JSON.stringify(obj));
            this.params.stockByBrand.push(obj);
          }
        });
      });

      console.log("Data>>" + JSON.stringify(this.params));

      setTimeout(() => {
        this.onlineService.saveOrder(this.params).subscribe((res: any) => {
          console.log("Save order==>" + JSON.stringify(res));
          if (res.status == "SUCCESS") {
            var orderno = res.data.syskey;
            this.loadingService.loadingDismiss();
            this.navCtrl.back();
            this.messageService.showToast("Updated successfully.");
          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Something wrong!.");
          }
        }, err => {
          console.log("err=>" + JSON.stringify(err));
          this.messageService.showNetworkToast(err);
          this.loadingService.loadingDismiss();
        });
      }, 100);
    }
  }

}

