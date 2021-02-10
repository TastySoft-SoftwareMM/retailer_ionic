import { Component, OnInit } from '@angular/core';
import { OfflineService } from '../services/offline/offline.service';
import { CartService } from '../services/cart/cart.service';
import { MessageService } from '../services/Messages/message.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { NavController, AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { InventoryService } from '../services/inventory/inventory.service';
import { OnlineService } from '../services/online/online.service';
import { Printer } from '@ionic-native/printer/ngx';
import { PrinterService } from '../services/printer/printer.service';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { UtilService } from '../services/util.service';
import { NetworkService } from '../services/network/network.service';

declare var cordova: any;

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.page.html',
  styleUrls: ['./cart-summary.page.scss'],
})

export class CartSummaryPage implements OnInit {

  orderproduct: any = [];
  returnproduct: any = [];
  checkinshop: any = [];

  printing: any;
  printerName: any;


  btnDisabled: any;


  constructor(private cartService: CartService,
    private offlinseService: OfflineService,
    private onlineService: OnlineService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private nativeStorage: NativeStorage,
    private inventoryService: InventoryService,
    private alertCtrl: AlertController,
    private printer: Printer,
    private printerService: PrinterService,
    private offlineService: OfflineService,
    private networkService: NetworkService,
    private base64: Base64,
    private file: File,
    private util: UtilService) {
    this.nativeStorage.getItem("checkinShopdata").then(res => {
      this.checkinshop = res;
    });
    this.btnDisabled = sessionStorage.getItem('checkvisit');
    if (this.btnDisabled == null || this.btnDisabled == undefined) {
      this.btnDisabled = true;
    }
    else {
      this.btnDisabled = false;
    }
  }

  async ngOnInit() {
    var orderpro = await this.cartService.getCart();
    var returnpro = await this.cartService.getReturnCart();
    Array.from(new Set(orderpro.map(s => s.brandOwnerSyskey))).map(syskey => {
      return this.orderproduct.push({
        'name': orderpro.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
        'total': orderpro.filter(s => s.brandOwnerSyskey === syskey).reduce((i, j) => i + j.price * j.amount, 0)
      });
    });
    console.log("Order>>" + JSON.stringify(this.orderproduct));
    // return products
    Array.from(new Set(returnpro.map(s => s.brandOwnerSyskey))).map(syskey => {
      return this.returnproduct.push({
        'name': returnpro.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
        'total': returnpro.filter(s => s.brandOwnerSyskey === syskey).reduce((i, j) => i + j.price * j.amount, 0)
      });
    })
    console.log("Return Order>>" + JSON.stringify(this.returnproduct));
  }
  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }
  getReturnTotal() {
    return this.returnproduct.reduce((i, j) => i + j.total, 0)
  }
  getOrderTotal() {
    return this.orderproduct.reduce((i, j) => i + j.total, 0);
  }

  getSubtotal() {
    var ordertotal = this.orderproduct.reduce((i, j) => i + j.total, 0);
    var returntotal = this.returnproduct.reduce((i, j) => i + j.total, 0);
    return ordertotal - returntotal;
  }
  async orderSubmit() {
    this.loadingService.loadingPresent();
    var param = this.cartService.getOrderParam();
    setTimeout(() => {
      param.map(obj => {
        console.log("Save order param==>" + JSON.stringify(obj));
        this.onlineService.saveOrder(obj).subscribe((res: any) => {
          console.log("Save order==>" + JSON.stringify(res));
          if (res.status == "SUCCESS") {
            this.cartService.updateOrderParam(res.data);
            // this.cartService.clearCart();
            var data: any = {
              "checkin": "true",
              "inventorycheck": "true",
              "merchandizing": "true",
              "orderplacement": "true",
              "date": this.util.getTodayDate()
            };
            this.nativeStorage.remove("checkSteps");
            this.nativeStorage.setItem("checkSteps", data);
            // this.cartService.produceAmount();
            sessionStorage.setItem('routestatus', 'ordersubmit');
            // this.inventoryService.clearDataInventory();
            this.btnDisabled = false;
            sessionStorage.setItem('checkvisit', "false");
            //-------------- part of print  ---------------
            this.printQ();
            this.loadingService.loadingDismiss();
          }
          else {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Something wrong!.");
          }
        }, err => {
          console.log("err=>" + JSON.stringify(err));
          this.loadingService.loadingDismiss();
          this.messageService.showNetworkToast(err);
        });
      })

    }, 100);
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
            console.log('Confirm Cancel: blah');
            // this.navCtrl.navigateBack(['main']);
            this.messageService.showToast("Saved successfully.");
            this.navCtrl.navigateBack(['cart-item']);
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
              // if (this.onoffstate == "online") {
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
              console.log("3-->" + arrDevices);
              this.printerService.connectBT(arrDevices).subscribe((connectStatus) => {
                a = 1;
                console.log("123--->" + JSON.stringify(list));
                for (var s = 0; s < list.length; s++) {
                  if (list[s].value == arrDevices) {
                    this.printerName = list[s].label;
                    break;
                  }
                }
                console.log("--->" + a + "__" + this.printerName);
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

      }).catch((error) => { })
    ).catch(err => { });
  }

  OnlinePrint() {
    console.log("1238363636");
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
    console.log("3<==");
    this.printing = this.printing.replace('{companyname}', "iMart");
    this.printing = this.printing.replace('{address1}', 'Yangon');
    this.printing = this.printing.replace('{address2}', 'test@gmail.com');
    this.printing = this.printing.replace('{open}', "Open Daily : 9:00 AM to 10:00 PM");
    this.printing = this.printing.replace('{saletype}', 'Cash');
    this.printing = this.printing.replace('{reprint}', '');
    this.printing = this.printing.replace('{slipNo}', '1');
    this.printing = this.printing.replace('{dateTime}', '17/05/2020');
    let body = "";
    var data = [
      {
        "Desc": "Test1",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "Test2",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "Test3",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "Test4",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
      {
        "Desc": "Test5",
        "Qty": "1",
        "Price": "1000",
        "lineTotal": "1000"
      },
    ]
    // console.log("body_1===>" + JSON.stringify(data));
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
    console.log("printing999989-->" + this.printing);
    var ae = 0;
    var array;
    if (ae == 0) {
      console.log("aa-->" + this.printerName);
      // cordova.plugins.Bluetooth.list(function (data){
      //   console.log("list==>" + data);
      //   printerName = data;
      //   console.log("Printname==>" + printerName);

      // }, function (err) {
      //   console.log("error=>" + err);
      //   // self.messangeOther.showMessage("Can't find the printer!", 2000);
      //   // self.paymentdata();
      // })
      console.log("12312-->" + self.printerName.toString());
      cordova.plugins.Bluetooth.connect(function (data) {
        ae = 1;
        console.log("res=>" + data + "___" + ae);
      }, function (err) {
        ae = 0;
        console.log("error_1=>" + err);
        // this.messageService.showToast("Can't connect"); 
      }, self.printerName.toString());
    }

    setTimeout(() => {
      if (ae == 1) {
        console.log("129-->" + ae);
        cordova.plugins.Bluetooth.drawCanvas(function (data) {
          ae = 2;
          console.log("Success Canvas ", data + "___" + ae);
        }, function (err) {
          ae = 1;
          console.log("Error Canvas");
          console.log(err);
        }, this.printing);
      }
    }, 2000);

    setTimeout(() => {
      if (ae == 2) {
        console.log("109-->" + ae);
        let fielPatch2 = this.file.externalRootDirectory + "/retailer_mit.png";
        this.base64.encodeFile(fielPatch2).then((bfile: string) => {
          console.log("  " + bfile);
          cordova.plugins.Bluetooth.printImage(function (data) {
            console.log("Success222-->", data);
          }, function (err) {
            // self.paymentdata();
          }, bfile);
          this.loadingService.loadingDismiss();
          this.messageService.showToast('Printed successfully.');
          this.navCtrl.navigateBack(['cart-item']);
          // this.navCtrl.navigateBack(['main']);
        }, (err) => {
          // self.messangeOther.printfailMessage();
          // self.paymentdata();
          this.messageService.showToast("print Fail");
        });
        setTimeout(() => {
          cordova.plugins.Bluetooth.disconnect(function (data) {
            console.log("res_1=>" + data);
            // self.paymentdata();
          }, function (err) {
            console.log("error_1=>" + err);
          }, printerName.toString());
        }, 1000);
      }
    }, 5000);
  }


  async completeVisit() {
    var param = this.cartService.getOrderParam();
    console.log("paramfdjasl>>>" + JSON.stringify(param));
    const alert = await this.alertCtrl.create({
      header: 'Message',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.offlineService.updateshopUser(this.checkinshop.id, 'no', "complete").then(res => {
              console.log("Update shopuser>>" + JSON.stringify(res));
            });

            const check = {
              checkin: 'out',
              date: this.util.getTodayDate()
            }
            this.inventoryService.clearDataInventory();
            this.offlineService.deleteInventory();
            this.cartService.clearCart();
            sessionStorage.setItem("checkin", JSON.stringify(check));
            sessionStorage.removeItem("headersyskey");
            sessionStorage.removeItem("checkvisit");
            this.removeNative();
            this.navCtrl.navigateBack(['main']);
          }
        }
      ]
    });
    await alert.present();
  }
  removeNative() {
    this.nativeStorage.remove("checkSteps");
    this.nativeStorage.remove("checkinShopdata");
  }
}
