import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/Messages/message.service';
import { NavController, LoadingController } from '@ionic/angular';
import { OnlineService } from '../services/online/online.service';
import { OfflineService } from '../services/offline/offline.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { ShopService } from '../services/shop/shop.service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoadingService } from '../services/Loadings/loading.service';
import { timeStamp } from 'console';
import { resolve } from 'url';


@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})

export class SyncPage implements OnInit {
  stockall: any;
  shopbyUser: any = [];
  shopbyTeam: any = [];
  btnDisabled: any = true;
  downloadbtnDisabled: any = false;
  downloadStatus: any;
  downloadPercent: any = 0;
  showProgress: any = { 'display': 'none' };

  imgdownloadStatus: any = 0;
  imgdownloadPercent: any = 0;
  showimgProgress: boolean = false;
  imgProgress: any = { 'display': 'none' };
  loginData: any = [];
  currentDate: String = new Date().toISOString();
  currenttoday: any;

  path: any = [];
  filedownloaderr: any = [];
  stockimages: any = [];

  startButton: boolean = false;

  coutdown: any = 0;

  constructor(
    private nativeStorage: NativeStorage,
    private messageService: MessageService,
    private navCtrl: NavController,
    public onlineService: OnlineService,
    public offlineService: OfflineService,
    private util: UtilService,
    private shopService: ShopService,
    private loadingCtrl: LoadingController,
    private filetransfer: FileTransfer,
    private file: File,
    private filepath: FilePath,
    private downloader: Downloader,
    private webview: WebView,
    private loadingService: LoadingService
  ) {

    this.downloadPercentfun(0, "start");
    this.nativeStorage.getItem("loginData").then(res => {
      console.log("LoginData ->" + JSON.stringify(res))
      this.loginData = res;
    });

  }
  ngOnInit() {
    this.getStockImages();
    this.today();
  }
  getStockImages() {
    this.offlineService.getStockImages().then((res: any) => {
      this.stockimages = res.data;
    });
  }
  today() {
    let year = this.currentDate.substring(0, 4);
    let month = this.currentDate.substring(5, 7);
    let day = this.currentDate.substring(8, 10);
    this.currenttoday = year + month + day;
  }


  downloadStockImages() {
    var imgurl = localStorage.getItem("imgurl");
    var interval = 0;
    var ref = this;
    var path = ref.file.externalDataDirectory + "/" + "Downloads" + "/";
    ref.downloadbtnDisabled = true;
    ref.imgProgress = { 'display': 'block' };
    ref.imgdownloadStatus = { 'width': 0 + '%' };

    //--------------------- DownLoad Stock Image -------------------
    ref.onlineService.getStockall().subscribe((data: any) => {
      ref.stockall = data.list;
      console.log("Stock All == " + JSON.stringify(ref.stockall));

      //-------------------------------- new stock images    ---------------------
      if (ref.stockimages.length == 0) {
        //------------new stock first time to db -----------------------------/
        function InnerFun() {

          const fileTransfer = ref.filetransfer.create();
          var name = ref.stockall[interval].code + '.png';
          var percent: any = (interval / ref.stockall.length) * 100;
          ref.imgdownloadStatus = { 'width': percent + '%' };
          ref.imgdownloadPercent = parseInt(percent);

          if (ref.stockall[interval].img != "") {
            fileTransfer.download(imgurl + ref.stockall[interval].img, path + name).then(entry => {

              let url = entry.toURL();
              var code = entry.name.substring(0, entry.name.lastIndexOf('.'));
              ref.path.push(code);
              ref.filepath.resolveNativePath(url).then(npath => {
                ref.offlineService.insertStockImg({ code: code, img: ref.webview.convertFileSrc(npath) })
              });

              if (interval + 1 == ref.stockall.length) {
                ref.imgProgress = { 'display': 'none' };
                setTimeout(() => {
                  ref.downloadbtnDisabled = true;
                  ref.btnDisabled = false;
                  ref.startButton = true;
                }, 1000);
              }
              interval++;
              if (interval < ref.stockall.length) {
                InnerFun();
              }

            }, err => {
              console.log(err.target);
              if (err.target) {
                var code = err.target.substring(err.target.lastIndexOf('/') + 1, err.target.lastIndexOf('.'));
                ref.filedownloaderr.push(code);
                ref.offlineService.insertStockImg({ code: code, img: "null" })
              }
              if (interval + 1 == ref.stockall.length) {
                ref.imgProgress = { 'display': 'none' };
                setTimeout(() => {
                  ref.downloadbtnDisabled = true;
                  ref.btnDisabled = false;
                  ref.startButton = true;
                }, 1000);
              }
              if (interval < ref.stockall.length) {
                interval++;
                InnerFun();
              }
            })
          }
          else {
            ref.filedownloaderr.push(ref.stockall[interval].code);
            ref.offlineService.insertStockImg({ code: ref.stockall[interval].code, img: "null" })
            if (interval + 1 == ref.stockall.length) {
              ref.imgProgress = { 'display': 'none' };
              setTimeout(() => {
                ref.downloadbtnDisabled = true;
                ref.btnDisabled = false;
                ref.startButton = true;
              }, 1000);
            }
            if (interval < ref.stockall.length) {
              interval++;
              InnerFun();
            }
          }
        }
        InnerFun();
        /*****new stock first time to db */
      }

      /*****Update */
      else {
        function Innerfun() {
          /*****update [or] download stock check with db */
          var code;
          console.log(interval + "----" + ref.stockall.length);

          /****** Download Percent  */
          var percent: any = (interval / ref.stockall.length) * 100;
          ref.imgdownloadStatus = { 'width': percent + '%' };
          ref.imgdownloadPercent = parseInt(percent);


          if (interval == ref.stockall.length) {
            ref.imgProgress = { 'display': 'none' };
            setTimeout(() => {
              ref.downloadbtnDisabled = true;
              ref.btnDisabled = false;
              ref.startButton = true;
            }, 1000);
          }
         else  {
            const fileTransfer = ref.filetransfer.create();
            ref.stockimages.filter(el => el.code == ref.stockall[interval].code).map(val => {
              code = val;
            });

            if (!code) { //new stock image
              if (ref.stockall[interval].img != "") {
                var name = ref.stockall[interval].code + '.png';
                fileTransfer.download(imgurl + ref.stockall[interval].img, path + name).then(entry => {
                  let url = entry.toURL();
                  var stockcode = entry.name.substring(0, entry.name.lastIndexOf('.'));

                  ref.filepath.resolveNativePath(url).then(nPath => {
                    ref.offlineService.insertStockImg({ code: stockcode, img: ref.webview.convertFileSrc(nPath) });
                  });
                  if (interval < ref.stockall.length) {
                    interval++;
                    Innerfun();
                  }
                }, err => {
                  console.log("Error Target" + err.target);
                  if (err.target) {
                    var stockcode = err.target.substring(err.target.lastIndexOf('/') + 1, err.target.lastIndexOf('.'));
                    ref.offlineService.insertStockImg({ code: stockcode, img: "null" })
                  }
                  if (interval < ref.stockall.length) {
                    interval++;
                    Innerfun();
                  }

                });
              }
              else {
                ref.offlineService.insertStockImg({ code: ref.stockall[interval].code, img: "null" });
                if (interval < ref.stockall.length) {
                  interval++;
                  Innerfun();
                }
              }
            }
            else { //existed stock in db
              if (code.img == "null") {
                if (ref.stockall[interval].img != "") {
                  var name = ref.stockall[interval].code + '.png';
                  fileTransfer.download(imgurl + ref.stockall[interval].img, path + name).then(entry => {
                    let url = entry.toURL();
                    ref.filepath.resolveNativePath(url).then(nPath => {
                      ref.offlineService.updateStockImg({ code: code.code, img: ref.webview.convertFileSrc(nPath) }).then((res: any) => {
                      });
                    });
                    if (interval < ref.stockall.length) {
                      interval++;
                      Innerfun();
                    }
                  }, err => {
                    if (interval < ref.stockall.length) {
                      interval++;
                      Innerfun();
                    }
                  });
                }
                else {
                  if (interval < ref.stockall.length) {
                    interval++;
                    Innerfun();
                  }
                }
              }
              else {
                if (interval < ref.stockall.length) {
                  interval++;
                  Innerfun();
                }
              }
            }
          }


        }
        Innerfun();
      }
    }, err => {
      ref.messageService.showNetworkToast(err);
      ref.loadingService.loadingDismiss();
      ref.imgProgress = { 'display': 'none' };
      ref.downloadbtnDisabled = false;
    });
  }

  removeNative() {
    sessionStorage.removeItem("checkvisit");
    sessionStorage.removeItem("headersyskey");
    sessionStorage.removeItem("printstatus");
  }


  async downloadData() {
    var percent: any = 0, i: any = 0, ref = this;
    this.btnDisabled = true;
    this.showProgress = { 'display': 'block' };
    this.removeNative();
    this.downloadPercent = 0;

    //------------------------- Shops  ----------------
    const result = await this.getShopAll();
    console.log("...");
    console.log(result);

    //------------------------- Shops [end] ---------------


    this.downloadPercent = (i / (this.stockall.length)) * 100;

    if (result == "resolved") {
      //------------------------- Stocks ----------------
      this.offlineService.deletStocks().then(result => {
        this.offlineService.deleteAllstock().then(result => {
          if (result) {

            function innerFun() {
              var details = ref.stockall[i].details;
              var d: any = 0;
              ref.offlineService.insertStock(ref.stockall[i].syskey, ref.stockall[i].code, ref.stockall[i].desc, ref.stockall[i].packTypeCode, ref.stockall[i].packSizeDescription, ref.stockall[i].floverCode, ref.stockall[i].brandCode, ref.stockall[i].brandOwnerCode, ref.stockall[i].brandOwnerName, ref.stockall[i].brandOwnerSyskey, ref.stockall[i].whSyskey, ref.stockall[i].vendorCode, ref.stockall[i].categoryCode, ref.stockall[i].subCategoryCode, ref.stockall[i].categoryCodeDesc, ref.stockall[i].subCategoryCodeDesc).then(res => {
              });


              function subInnerFun() {

                ref.offlineService.insertStockDetail(ref.stockall[i].code, details[d].u31Syskey, details[d].uomSyskey, details[d].barcode, details[d].price, details[d].uomType, details[d].priceType, details[d].ratio).then(res => {
                }, err => {
                  console.log(err);
                });

                d++;
                if (d < details.length) {
                  subInnerFun();
                }
              }
              subInnerFun();


              i++;
              if (i < ref.stockall.length) {
                console.log("count == " + i);
                ref.downloadPercent = ((i / (ref.stockall.length)) * 100).toFixed();
                ref.downloadStatus = { 'width': ref.downloadPercent + '%' };
                console.log("downloadPercent == " + ref.downloadPercent);
                // setTimeout(() => {
                innerFun();
                // }, 10);
              }
              if (ref.stockall.length == i) {
                sessionStorage.removeItem('checkin');
                ref.downloadPercent = 0;
                ref.showProgress = { 'display': 'none' };
                ref.btnDisabled = false;
                ref.navCtrl.navigateRoot(['/main']);

              }
            }
            innerFun();
          }
        });
      });
    }
    else {
      this.downloadPercent = 0;
      this.showProgress = { 'display': 'none' };
      this.btnDisabled = false;
    }
  }

  getShopAll() {
    return new Promise(resolve => {
      var shopParams = {
        "spsyskey": this.loginData.syskey,
        "teamsyskey": this.loginData.teamSyskey,
        "usertype": this.loginData.userType,
        "date": this.util.getTodayDate()
      };

      this.onlineService.getShopall(shopParams).subscribe(data_1 => {
        var shopArray: any;
        shopArray = data_1;
        this.shopbyUser = shopArray.data.shopsByUser;
        this.shopbyTeam = shopArray.data.shopsByTeam;

        this.shopService.setShopByUser(shopArray.data.shopsByUser);
        this.shopService.setShopByTeam(shopArray.data.shopsByTeam);
        resolve("resolved");
      },
        err => {
          this.messageService.showNetworkToast(err);
          resolve('shopdownloaderr');
        })
    })
  }

  downloadPercentfun(data, status) {
    if (this.downloadPercent < 101 && status == "start") {
      this.downloadPercent += data;
      this.downloadStatus = { 'width': this.downloadPercent + '%' };
    }
    else {
      this.downloadStatus = { 'width': 0 + '%' };
    }
  }
}
