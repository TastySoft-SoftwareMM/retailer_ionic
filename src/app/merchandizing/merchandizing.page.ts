import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController } from '@ionic/angular';
import { MerchanModalPage } from '../merchan-modal/merchan-modal.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { MessageService } from '../services/Messages/message.service';
import { OnlineService } from '../services/online/online.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { parseSelectorToR3Selector } from '@angular/compiler/src/core';
import { OfflineService } from '../services/offline/offline.service';
import { materialize } from 'rxjs/operators';
import { UtilService } from '../services/util.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { MerchandizingService } from '../services/merchandizing/merchandizing.service';

@Component({
  selector: 'app-merchandizing',
  templateUrl: './merchandizing.page.html',
  styleUrls: ['./merchandizing.page.scss'],
})
export class MerchandizingPage implements OnInit {
  loginData: any;

  merch: any = []; //for display ui
  onlinemerch: any = []; // get merchandizing data from server
  parammerch: any = [];  //for generate param                         

  checkinShopdata: any;
  param: any = this.getParam();
  parambrand: any = [];
  paramtask: any = [];
  paramimage: any = [];

  totaltasklength: any = 0;
  isLoading: any = false;
  hiddenSearch: any = true;
  searchterm: any = "";

  check_merchandizing_view_only: any;
  constructor(private modalCtrl: ModalController,
    private nativeStorage: NativeStorage,
    private messageService: MessageService,
    private navCtrl: NavController,
    private onlineService: OnlineService,
    private dataTransfer: DatatransferService,
    private merchandizingService: MerchandizingService,
    private offlineService: OfflineService,
    private util: UtilService,
    private loadingService: LoadingService,
    private loadingController: LoadingController) {
    this.check_merchandizing_view_only = sessionStorage.getItem("MerchandizingViewOnly");
    console.log(this.check_merchandizing_view_only);
  }
  ngOnInit() {
  }
  async ionViewWillEnter() {
    // this.loadingService.loadingPresent();
    this.isLoading = true;
    console.log("await");
    await this.merchandizingService.InitialgetMerchandizing();
    console.log("resolved");
    await this.getCheckInShop();
    await this.getMerchandizing();
  }
  getMerchandizing() {
    return new Promise(resolve => {
      this.onlinemerch = this.merchandizingService.getMerchandizing();
      this.parammerch = this.merchandizingService.getMerchandizing();
      this.isLoading = false;
      resolve();
    });

  }
  getCheckInShop() {
    return new Promise(resolve => {
      this.nativeStorage.getItem("checkinShopdata").then((res: any) => {
        this.checkinShopdata = res;
        this.nativeStorage.getItem("loginData").then(res => {
          this.loginData = res;
          console.log("checkinshop ==" + JSON.stringify(res));
          resolve();
        }, err => {
          resolve();
        });
      }, err => {
        resolve();
      });
    })
  }

  closeSearchfun() {
    this.hiddenSearch = true;
    this.isLoading = true;
    this.onlinemerch = this.parammerch;
    if (this.searchterm.toString().length > 0) {
      this.isLoading = false;
      this.searchterm = "";
    }
    else {
      this.isLoading = false;
    }
  }


  searchQuery() {
    this.isLoading = true;
    var val = this.searchterm;

    if (val !== "" || val !== null || val !== undefined) {

      this.onlinemerch = this.parammerch.map((item) => {
        const data = { ...item }; let status = true; //#  true ? taskCode (ary)  : taskName (ary)

        //####### Search with taskCode
        data.taskList = data.taskList.filter((ch) => {
          return (ch.taskCode.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
        });

        //####### Search with taskName
        const data1 = { ...item }; //# second store ary
        if (data.taskList.length == 0) {
          status = false;
          data1.taskList = data1.taskList.filter((ch) => {
            return (ch.taskName.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
          });
        }

        if (status) {
          return data;
        }
        else {
          return data1;
        }
      });
    }
    else {
      this.onlinemerch = this.parammerch;
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }


  toggleSection(index) {
    this.onlinemerch[index].open = !this.onlinemerch[index].open;
  }
  getParam() {
    return { "shopSysKey": '', "campaignsyskey": "", 'lmc002': [] };
  }
  submit() {
    this.offlineService.getTaskNeedTodo(this.checkinShopdata.shopcode, this.util.getTodayDate()).then((res: any) => {
      if (res.data.length == 0) {
        this.messageService.showToast("Need to do upload task");
      }
      else {
        this.uploadData();
      }
    }, err => {
    });
  }
  async showTaskModal() {
    const popover = await this.modalCtrl.create({
      component: MerchTaskModalPage,
    });
    await popover.present();
  }
  uploadData() {
    this.loadingService.loadingPresent();
    var images;
    this.param = this.getParam();
    this.parambrand = [];
    this.paramimage = [];
    this.paramtask = [];
    this.offlineService.getMerchandizingTask(this.checkinShopdata.shopcode, this.util.getTodayDate()).then((taskres: any) => {
      var offtasks = taskres.data;
      this.offlineService.getMerchImage(this.checkinShopdata.shopcode, this.util.getTodayDate()).then((res: any) => {
        images = res.data;
        this.parammerch.filter(mer => {
          this.param.shopSysKey = this.checkinShopdata.shopsyskey;
          this.param.campaignsyskey = mer.campaignsyskey;
          this.parambrand = [];
          this.paramtask = [];
          this.parambrand.push({
            'campaignId': mer.campaignId,
            'brandOwnerId': mer.brandOwnerId,
            'userKey': mer.userSysKey,
            'mc003': []
          });
          var tasks = offtasks;
          console.log("tasks>>" + JSON.stringify(tasks));
          tasks.filter(taskobj => {
            this.paramimage = [];
            this.paramtask = [];
            this.paramtask.push({
              'n2': taskobj.taskId,
              't1': taskobj.remark,
              't2': taskobj.taskCode,
              't3': taskobj.taskName,
              'picturmaineData': []
            });
            var merchimgs = images.filter(el => el.taskId == taskobj.taskId);
            console.log("merchimgs" + JSON.stringify(merchimgs));
            merchimgs.filter(imgobj => {
              console.log("imgobj" + JSON.stringify(imgobj));
              this.paramimage = [];
              this.paramimage.push({
                't1': imgobj.campaign,
                't2': imgobj.filename + ".jpeg",
                "t3": ""
              });
              this.paramimage.filter((pimgobj, pindex) => {
                this.paramtask.reduce((i, j) => i + j.pictureData.push(pimgobj), 0);
              });
            });
            this.paramtask.filter(obj => {
              this.parambrand.reduce((i, j) => i + j.mc003.push(obj), 0);
            });
          });
          this.parambrand.filter(obj => {
            this.param.lmc002.push(obj);
          });
          console.log("param>" + JSON.stringify(this.param));
          this.offlineService.deleteMerchandizing(this.checkinShopdata.shopsyskey).then((val: any) => {
            if (val) {
              this.offlineService.insertMerchdizing(this.loginData.userId, this.checkinShopdata.shopsyskey, this.checkinShopdata.shopcode, this.util.getTodayDate(), "pending").then((res: any) => {
              });
              this.merchandizingService.addData(this.param, this.checkinShopdata.shopsyskey);
              //-------------- part of CRUD  --------------
              this.nativeStorage.getItem("checkSteps").then(step => {
                var data: any = {
                  "checkin": "true",
                  "inventorycheck": step.inventorycheck,
                  "merchandizing": "COMPLETED",
                  "orderplacement": step.orderplacement,
                  "date": this.util.getTodayDate()
                };
                console.log("data>.");
                var param = {
                  "sessionId": sessionStorage.getItem('sessionid'),
                  "task": {
                    "inventoryCheck": step.inventorycheck,
                    "merchandizing": "COMPLETED",
                    "orderPlacement": step.orderplacement,
                    "print": "INCOMPLETE"
                  }
                }
                this.onlineService.setTask(param).subscribe(((val: any) => {
                  if (val.status == "SUCCESS") {
                    this.nativeStorage.setItem("checkSteps", data);
                    setTimeout(() => {
                      this.loadingController.getTop().then(hasLoading => {
                        if (hasLoading) {
                          this.loadingService.loadingDismiss();
                        }
                      });
                      this.messageService.showToast("Saved successfully.");
                      this.navCtrl.navigateBack(["main"]);
                    }, 1000);
                  }
                  else {
                    this.loadingController.getTop().then(hasLoading => {
                      if (hasLoading) {
                        this.loadingService.loadingDismiss();
                      }
                    });
                    this.messageService.showToast("Something wrong!");
                  }
                }), err => {
                  this.loadingService.loadingDismiss();
                  this.messageService.showToast("Please tray again!");
                });
              });
            }
          }, err => {
            console.log("err>>" + JSON.stringify(err));
          });
        });
      });
    }, err => {
      this.loadingService.loadingDismiss();
      this.messageService.showToast("Please tray again!");
    });
  }
  async showPopup(brand, task) {
    await this.merchandizingService.setTask(brand, task);
    this.navCtrl.navigateForward('merchan-modal');
  }
  // async showPopup(val, val1, t2, t1, t3, brandownername, brandownercode, taskId, taskCode, taskName, remark) {
  //   let modal = await this.modalCtrl.create({
  //     component: MerchanModalPage,
  //     componentProps: {
  //       brandId: val,
  //       campaign: val1,
  //       t2: t2,
  //       t1: t1,
  //       t3: t3,
  //       brandownername: brandownername,
  //       brandownercode: brandownercode,
  //       taskId: taskId,
  //       taskCode: taskCode,
  //       taskName: taskName,
  //       remark: remark
  //     }
  //   });
  //   modal.present();
  //   var data = await modal.onDidDismiss();
  //   if (data) {
  //     this.loadingService.loadingDismiss();
  //   }
  // }

}
