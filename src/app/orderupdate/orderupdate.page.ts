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
  selector: 'app-orderupdate',
  templateUrl: './orderupdate.page.html',
  styleUrls: ['./orderupdate.page.scss'],
})
export class OrderupdatePage implements OnInit {
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

    await this.getOrder();
    console.log("order resolved");


    setTimeout(() => {
      this.isLoading = true;
      this.loadingService.loadingDismiss();
      console.log(this.order
      );

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




  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      header: "#Discount",
      message: message,
      position: 'top',
      buttons: [
        {
          icon: 'refresh',
          handler: () => {
          }
        },
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }
  navigateBack() {
    this.navCtrl.navigateBack(['order-list']);
  }
  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }
  async getOrder() {
    return new Promise(async (resolve) => {

      this.order = [];
      this.returnedproduct = [];
      var order: any = this.orderService.getData().filter(el => el.qtystatus == "sim");
      this.allorder = this.orderService.getAllOrder();
      this.suborder = this.orderService.getData();
      var returnedproduct = this.orderService.getData().filter(el => el.qtystatus == "exp");


      //------------ returned product cart  -------------------[start]
      var returnbrand = [];
      Array.from(new Set(returnedproduct.map(s => s.brandOwnerSyskey))).map(syskey => {
        return returnbrand.push({
          'name': returnedproduct.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
          'brandOwnerSyskey': syskey,
        });
      });
      this.returnsubtotal = returnedproduct.reduce((i, j) => i + Number(j.total), 0);
      returnbrand.filter(obj => {
        const val = returnedproduct.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey);
        const total = returnedproduct.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey).reduce((i, j) => i + Number(j.total), 0);
        this.returnedproduct.push({
          'name': obj.name,
          'brandOwnerSyskey': obj.brandOwnerSyskey,
          'brandSyskey': val[0].brandSyskey,
          'child': val,
          'total': total,
          'open': true
        });
      });
      //------------ returned product cart  -------------------[end]





      //------------ order product cart  -------------------[start]
      if (order.length > 0) {
        this.remark = order[0].note;


        var orderbrand = [];
        Array.from(new Set(order.map(s => s.brandOwnerSyskey))).map(syskey => {
          return orderbrand.push({
            'name': order.find(s => s.brandOwnerSyskey == syskey).brandOwnerName,
            'brandOwnerSyskey': syskey
          });
        });

        this.orderdiscountamount = order[0].orderdiscountamount;
        this.ordersubtotal = order.reduce((i, j) => i + Number(j.total), 0);
        orderbrand.filter(obj => {
          const val = order.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey);
          const total = order.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey).reduce((i, j) => i + Number(j.total), 0);
          console.log(total);

          this.order.push({
            'name': obj.name,
            'brandOwnerSyskey': obj.brandOwnerSyskey,
            'brandSyskey': val[0].brandSyskey,
            'child': val,
            'subtotal': this.util.fixedPoint(total),
            'total': this.util.fixedPoint(total),
            'invdisamount': 0,
            'invdisper': 0,
            'availableInvList': [],
            'checkavailableInvList': false,
            'invopen': false,
            'gifts': [],
            'gift': false,
            'giftopen': false,
            'open': true
          });
        });



        //VolumeDiscount Await
        console.log("Volume await");
        const volumeData = new Promise(async (resolvev) => {
          //order products
          this.order.map(async (cat, index) => {
            cat.child.map(async (product: any, ci) => {
              if (product.promoItems.length > 0) {
                await this.calculatePromotion(product);
              }
              else {
                product.total = (Number(product.price) * Number(product.amount));
              }

              //resolve
              if (this.order.length == index + 1 && cat.child.length == ci + 1) {
                resolvev();
              }
            });
          })
        })
        const volumeAwait = await volumeData;
        console.log("Volume resolved");


        //Invoice Discount Await
        console.log("Invoice await");
        const invoiceData = new Promise(async (resolvei) => {
          await this.getInvDiscount();
          this.order.map(async (bo, index) => {
            console.log(bo.checkavailableInvList);

            if (bo.checkavailableInvList) {
              await this.calculateInvDiscount(bo);
            }

            //resolve
            if (this.order.length == index + 1) {
              resolvei();
            }
          });
        })

        const invoiceAwait = await invoiceData;
        console.log("Invoice resolved");
        //------------ order product cart  -------------------[end]

        resolve();

      }
      else {
        resolve();
      }
    })
  }

  calculatePromotion(product) {
    /******** Calculate Promotion Item [Service]  */
    return new Promise(resolve => {

      var param = {
        "itemSyskey": product.syskey,
        "itemDesc": product.desc,
        "itemAmount": product.price,
        "itemTotalAmount": Number(product.amount) * Number(product.price),
        "itemQty": product.amount,
        "shopSyskey": this.checkinshop.shopsyskey
      }

      this.onlineService.calculatePromotionItems(param).subscribe(async (val: any) => {
        console.log("Promo" + JSON.stringify(val));
        if (val.status == "Promotion Available") {
          product.gifts = [];
          product.afterDiscountTotal = val.data.afterDiscountTotal;
          product.discountPercent = val.data.discountPercent;

          product.total = val.data.afterDiscountTotal;

          //inkind promotion gift list
          if (val.data.giftList.length > 0) {


            product.gifts = val.data.giftList;

            // Auto Selected Gift
            product.chosen_multiple_gift = [];


            var gift_amount_ary = [];

            const gifts_count = product.gifts.length;
            const end_gift = product.gifts[gifts_count - 1].filter(el => el.discountItemEndType == "END");


            const total_gift_amount = end_gift[0].discountItemQty;
            console.log("Total Gift Amount -> " + total_gift_amount);


            product.gifts.map((giftlist, giftlist_index) => {

              giftlist.map((gift, index) => {

                if (end_gift[0].discountItemRuleType == "Total Item") {
                  product.total_gift_amount = Number(total_gift_amount);

                  //Calculate Gift Amount
                  const gift_quotient_amount = Math.floor(total_gift_amount / product.gifts.length);
                  const gift_remainder_amount = total_gift_amount % product.gifts.length;

                  console.log("Quotient ->" + gift_quotient_amount + ', Remainder ->' + gift_remainder_amount + ', Qty ->' + end_gift[0].discountItemQty + ', Length ->' + product.gifts.length);

                  if (product.gifts.length == giftlist_index + 1) {
                    gift.discountItemQty = gift_quotient_amount + gift_remainder_amount;
                  }
                  else {
                    gift.discountItemQty = gift_quotient_amount;
                  }
                }

                if (index == 0) {
                  product.chosen_multiple_gift.push(gift);
                }

              });
            });
          }
        }
        else {
          product.gifts = [];
          product.afterDiscountTotal = 0;
          product.discountPercent = 0;
          product.total = Number(product.price) * Number(product.amount);
        }


        product.discountPercent = this.util.checkDecimals(product.discountPercent);
        var discountamount = this.util.fixedPoint((Number(product.price) * Number(product.amount) * Number(product.discountPercent)) / 100);
        product.total = this.util.fixedPoint((Number(product.price) * Number(product.amount)) - Number(discountamount));
        this.cartService.storeGiftsCache(product);

        //Calculation Total Amount
        await this.getOrderSubTotalOnly();

        resolve();
      }, async (err) => {
        product.gifts = [];
        product.afterDiscountTotal = 0;
        product.discountPercent = 0;
        product.total = (Number(product.price) * Number(product.amount));

        //Calculation Total Amount
        await this.getOrderSubTotalOnly();

        resolve();
      })
    });
  }
  getInvDiscount() {
    return new Promise(resolve => {
      this.order.map((bo, bindex) => {
        var param = {
          "shopSyskey": this.checkinshop.shopsyskey,
          "boSyskey": bo.brandOwnerSyskey,
        };

        this.onlineService.getInvDis(param).subscribe((val: any) => {
          console.log("Inv --" + JSON.stringify(val));
          if (val.status == "SUCCESS") {
            if (val.list.length > 0) {
              val.list.map(list => {
                if (list.InvoiceDiscountHeader.length > 0) {
                  bo.availableInvList = list.InvoiceDiscountHeader;
                  bo.checkavailableInvList = true;
                }
                else {
                  bo.checkavailableInvList = false;
                }
              })
            }
            else {
              bo.checkavailableInvList = false;
            }

          }
          if (this.order.length == bindex + 1) {
            resolve();
          }
        }, err => {
          resolve();
        })
      })
    });
  }
  calculateInvDiscount(bo) {
    return new Promise(async (resolve) => {

      console.log("ci await");
      await this.getOrderSubTotalOnly();
      console.log("ci resolved");


      var param = {
        "shopSyskey": this.checkinshop.shopsyskey,
        "boSyskey": bo.brandOwnerSyskey,
        "Total": bo.subtotal
      };
      this.onlineService.calculateInvDis(param).subscribe(async (val: any) => {
        console.log("Inv list --" + JSON.stringify(val));


        if (val.status == "Promo Available") {
          //------- Infind Discount [Gifts] ------
          bo.gifts = [];
          if (val.data.GiftList.length > 0) {
            bo.gift = true;
            val.data.GiftList.map(gift => {
              bo.gifts.push(gift);
            })
          }

          //-------Discount -------
          if (val.data.AfterDiscountTotal > 0) {
            bo.total = val.data.AfterDiscountTotal;
            bo.invdisper = val.data.DiscountPercent;
          } else {
            bo.total = bo.subtotal;
            bo.invdisper = 0;
          }


          //check decimal point 
          bo.invdisper = this.util.fixedPoint(bo.invdisper);
          bo.total = this.util.fixedPoint(bo.total);
          bo.subtotal = this.util.fixedPoint(bo.subtotal);


          bo.invdisamount = this.util.fixedPoint(Number(bo.subtotal) - Number(bo.total));
          resolve();
          console.log(bo);
        }
        else {
          await this.notAvailableInvoice(bo);
          resolve();
          console.log(bo);
        }


      }, async (err) => {
        await this.notAvailableInvoice(bo);
        resolve();
      })

    });
  }
  notAvailableInvoice(bo) {
    return new Promise(async (resolve) => {
      await this.getOrderSubTotalOnly();
      bo.gifts = [];
      bo.gift = false;
      bo.total = bo.subtotal;
      bo.invdisper = 0;
      bo.invdisamount = 0;
      resolve();
    })
  }

  async viewInvoiceDiscount() {
    const modal = await this.modalCtrl.create({
      component: InvoiceDiscountDetailPage,
      componentProps: {
        cart: this.order,
      },
    });
    await modal.present();
    modal.onDidDismiss().then((dataReturned) => {
    });
  }


  segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    if (this.segment == 1) {
      this.order = this.allorder.filter(el => el.qtystatus == "sim");
    }
    else {
      this.order = this.suborder.filter(el => el.brandOwnerSyskey == this.segment && el.qtystatus == "sim");
    }
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
  async increseCart(bo, product) {
    this.loadingService.loadingPresent();
    await this.orderService.increaseProduct(product);
    await this.getOrderSubtotal(bo, product);
    this.loadingService.loadingDismiss();
  }
  increseCartRe(product) {
    this.orderService.increaseProduct(product);
  }
  async decreseCart(bo, product) {
    this.loadingService.loadingPresent();
    await this.orderService.decreaseProduct(product);
    await this.getOrderSubtotal(bo, product);
    this.loadingService.loadingDismiss();
  }
  decreseCartRe(product) {
    this.orderService.decreaseProduct(product);
  }
  deleteCart(product) {
    this.loadingService.loadingPresent();
    this.orderService.deleteCart(product);
    this.getOrder();
    setTimeout(() => {
      this.loadingService.loadingDismiss();
    }, 2000);
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

  //InputChange ALert Custom
  async inputChange(bo, p) {

    this.modalCtrl.create({
      'component': CustomAlertInputPage,
      'componentProps': {
        'productdesc': p.desc,
        'qty': p.amount
      },
      'cssClass': 'custom-alert-input-modal'
    }).then(el => {
      //modal show
      el.present();

      //modal will back
      el.onDidDismiss().then(async (res: any) => {
        let data = res.data;

        if (data !== undefined) {
          this.loadingService.loadingPresent();

          p.amount = data.qty;
          await this.getOrderSubtotal(bo, p);

          this.loadingService.loadingDismiss();
        }
        console.log('Confirm Ok');
      })
    });
  }



  // async inputChange(bo, p) {
  //   const alert = await this.alertCtrl.create({
  //     cssClass: 'custom-alert-class',
  //     header: null,
  //     message: p.desc,
  //     subHeader: null,
  //     inputs: [
  //       {
  //         name: 'amount',
  //         type: 'number',
  //         value: p.amount,
  //         max: 5,
  //         placeholder: 'Enter qty'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Ok',
  //         handler: async (data) => {
  //           p.amount = data.amount;
  //           this.loadingService.loadingPresent();
  //           console.log('Confirm Ok');
  //           if (data.amount == "") {
  //             p.total = p.price;
  //           }
  //           else {
  //             await this.getOrderSubtotal(bo, p);
  //           }
  //           this.loadingService.loadingDismiss();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  //   // return Number(event.target.value);
  // }



  getReturnSubtotal() {
    var returncart = [];
    returncart = this.orderService.getReturnData();
    this.returnsubtotal = returncart.reduce((i, j) => i + Number(j.total), 0);
  }
  async getOrderSubtotal(bo, p) {

    //--- Calculation Price [Promotion Item]
    console.log("Cal Promo init");

    if (p != "deletecart") {
      if (p.promoItems.length > 0) {
        console.log("Cal Promo");
        const calculatedData = await this.calculatePromotion(p);
      }
      else {
        p.discountPercent = 0;
        p.total = Number(p.price) * Number(p.amount);

      }
      console.log("Cal Promo end");
    }


    //--- Calculation Price [Promotion Item]

    var totalamount = bo.child.reduce((i, j) => i + Number(j.total), 0);
    bo.subtotal = this.util.fixedPoint(totalamount);
    bo.total = this.util.fixedPoint(totalamount);


    //----Inv discount ---
    if (bo.checkavailableInvList) {
      await this.calculateInvDiscount(bo);
    }

    var result = this.orderdiscountamount.toString().includes('.');
    if (result) {
      this.orderdiscountamount = this.orderdiscountamount.toFixed(2);
    }
  }

  getOrderSubTotalOnly() {
    return new Promise(resolve => {
      if (this.order.lenght > 0) {
        this.order.map((bo, index) => {
          var totalamount = bo.child.reduce((i, j) => i + Number(j.total), 0);
          bo.subtotal = this.util.fixedPoint(totalamount);
          if (this.order.length == index + 1) {
            resolve();
          }
        });
      }
      else {
        resolve();
      }
    })

  }
  inputChangeRe(event, product) {
    event.target.value = Number(event.target.value.toString().replace(/[^0-9]*/g, ''));
    if (event.target.value == "" || event.target.value == null || event.target.value == undefined) {
      product.total = 0;
    }
    else {
      product.total = Number(product.price) * event.target.value;
    }
    this.getReturnSubtotal();
  }
  getSubTotal() {
    return this.allorder.reduce((i, j) => i + j.price * j.amount, 0);
  }
  getTotal() {
    return this.allorder.reduce((i, j) => i + j.price * j.amount, 0);
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
    this.navCtrl.navigateForward([`order-placement-fororderupdate/${this.orderno}`]);
  }


  previewMultipleSKUsPromo() {
    console.log(this.order);
    this.loadingService.loadingPresent();
    var itemInfoList = [];

    const stockPromise = new Promise((resolve32) => {

      if (this.order.length > 0) {
        this.order.map((bo, hi) => {
          bo.child.map((detail, di) => {
            if (detail.multiplePromo) {
              itemInfoList.push({
                "itemSyskey": detail.syskey,
                "itemDesc": detail.desc,
                "itemAmount": detail.price,
                "itemTotalAmount": detail.total,
                "itemQty": detail.amount
              });
            }
            if (this.order.length == hi + 1 && bo.child.length == di + 1) {
              resolve32();
            }

          });
        });

      }
      else {
        resolve32();
      }

    });

    stockPromise.then(() => {
      const param = {
        "itemInfoList": itemInfoList,
        "shopSyskey": this.checkinshop.shopsyskey,
        "date": this.util.getTodayDate()
      }
      console.log("Param: " + JSON.stringify(param));

      this.onlineService.calculateMultipleSKUs(param).subscribe(async (res: any) => {
        console.log(res);
        await this.cartService.updateCartByMultipleSKUsPromotion(this.order, this.returnedproduct, res.data);
        this.loadingService.loadingDismiss();
        this.navCtrl.navigateForward([`checkout-orderupdate/${this.orderno}`]);
      }, async (err) => {
        console.log(err);
        await this.cartService.updateCartByMultipleSKUsPromotion(this.order, this.returnedproduct, []);
        this.loadingService.loadingDismiss();

        this.navCtrl.navigateForward([`checkout-orderupdate/${this.orderno}`]);
      });
    })
  }



  updateOrder() {
    if (this.allorder.length == 0) {
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
      const data = Array.from(new Set(this.allorder.map(s => s.brandOwnerSyskey))).map(syskey => {
        return {
          'brandOwnerName': this.allorder.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
          'whSyskey': this.allorder.find(s => s.brandOwnerSyskey === syskey).whSyskey,
          'brandOwnerSyskey': syskey,
          'brandSyskey': this.allorder.find(s => s.brandOwnerSyskey === syskey).brandSyskey
        };
      })
      data.filter(bobj => {
        this.stockbybrand = [];
        this.stockreturndata = [];
        this.child = [];

        var stockdata, orderbrand;
        stockdata = this.allorder.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.qtystatus == "sim");
        orderbrand = this.order.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey);

        var bordersubtotal = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.subtotal), 0));
        var invdisamount = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisamount), 0));
        var invdisper = this.util.fixedPoint(orderbrand.reduce((i, j) => i + Number(j.invdisper), 0));



        // let borderdiscountamount = stockdata.reduce((i, j) => i + Number(j.total) * (this.discount / 100), 0); //discount
        let bordertotal = Number(bordersubtotal);


        const returnstockdata = this.allorder.filter(el => el.brandOwnerSyskey == bobj.brandOwnerSyskey && el.qtystatus == "exp").map(val => {
          return val;
        });
        let breturnsubtotal = returnstockdata.reduce((i, j) => i + Number(j.total), 0);
        // let breturndiscountamount = returnstockdata.reduce((i, j) => i + Number(j.total) * (this.discount / 100), 0); //discount
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
          "syskey": bobj.brandSyskey,
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
          "brandOwnerName": bobj.brandOwnerName,
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
        stockdata.filter(sobj => {
          var recordStatus;
          if (sobj.isactive == "no") {
            recordStatus = 4;
          }
          else {
            recordStatus = 1;
          }

          //---- Promotion Items [gifts] -------
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
