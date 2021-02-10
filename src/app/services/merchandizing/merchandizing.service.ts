import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilService } from '../util.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OfflineService } from '../offline/offline.service';

@Injectable({
  providedIn: 'root'
})
export class MerchandizingService {
  merchandizing: any = [];
  checkinshop: any = [];
  merchandizingview: any = [];
  _task: any = this.createTaskParam();
  _img: any;

  constructor(private storage: Storage, private util: UtilService, private nativeStorage: NativeStorage,
    private offlineService: OfflineService) { }
  //---------------------- Pass Merchandizing Task data  => Merchan Modal Page
  setTask(brand, task) {
    return new Promise(resolve => {
      this._task.brandId = brand.brandOwnerId;
      this._task.campaign = brand.campaignId;
      this._task.t2 = task.t2;
      this._task.t1 = task.t1;
      this._task.t3 = task.t3;
      this._task.brandownername = brand.brandOwnerName;
      this._task.brandownercode = brand.brandOwnerCode;
      this._task.taskId = task.syskey;
      this._task.taskCode = task.taskCode;
      this._task.taskName = task.taskName;
      this._task.remark = task.remark;
      resolve();
    });
  }
  getTask() {
    return this._task;
  }
  createTaskParam() {
    return { "brandId": "", "campaign": "", "t2": "", "t1": "", "t3": "", "brandownername": "", "brandownercode": "", "taskId": "", "taskCode": "", "taskName": "", "remark": "" };
  }

  //--------------------- Take Image Store ----------------------------
  setImg(img) {
    return new Promise(resolve => {
      this._img = img;
      resolve();
    })
  }
  getImg() {
    return this._img;
  }
  clearImg() {
    return new Promise(resolve => {
      this._img = "";
      resolve();
    });
  }
  //---------------------- Merchandizing Upload To Server[store data] -----------ယာယီသိမ်းဆည်းထား
  addData(data, storesyskey): Promise<any> {
    var STORE_KEY = storesyskey.toString() + this.util.getTodayDate();
    this.storage.remove(STORE_KEY);
    return this.storage.set(STORE_KEY, data);
  }
  getData(storesyskey): Promise<any> {
    var STORE_KEY = storesyskey.toString() + this.util.getTodayDate();
    return this.storage.get(STORE_KEY);
  }
  //---------------------- Merchandizing Get From Server[create param] --------------

  setMerchandizing(data) {
    console.log("set merchandizing in catch === " + JSON.stringify(data));
    this.nativeStorage.setItem("merchandizing", data);
  }
  getMerchandizing() {
    return this.merchandizing;
  }


  /*****
   * Generate Array For Merchandizing
   * ##Status(added status) and Remark
   */
  async InitialgetMerchandizing() {
    return new Promise(resolve => {
      this.nativeStorage.getItem('merchandizing').then(val => {
        this.merchandizing = val;
        this.merchandizing.filter(obj => {
          obj.taskList.filter(el => {
            el.taskstatus = "";
            el.remark = "";
          });
        })
        this.nativeStorage.getItem("checkinShopdata").then((res: any) => {
          this.checkinshop = res;
          this.offlineService.getMerchandizingTask(this.checkinshop.shopcode, this.util.getTodayDate()).then((res: any) => {
            for (var i = 0; i < this.merchandizing.length; i++) {
              var data = res.data;
              for (var ii = 0; ii < this.merchandizing[i].taskList.length; ii++) {
                for (var r = 0; r < data.length; r++) {
                  if (this.merchandizing[i].taskList[ii].syskey == data[r].taskId) {
                    this.merchandizing[i].taskList[ii].taskstatus = "saved";
                    this.merchandizing[i].taskList[ii].remark = data[r].remark;
                  }
                }
              }
            };

            resolve();
          }, err => {
            resolve();
          });
        }, err => {
          resolve();
        });
      }, err => {
        console.log("initialmercherr>>" + JSON.stringify(err));
        resolve();
      });
    });

  }
  /******** Merchandizing ********/
  updateTaskStatus(taskId) {
    console.log("taskID" + taskId);
    this.merchandizing.filter(obj => {
      obj.taskList.filter(tobj => tobj.syskey == taskId).map(val => {
        console.log("val>>" + JSON.stringify(val));
        val.taskstatus = "";
      });
    });
    console.log("Merchandizing>>>" + JSON.stringify(this.merchandizing));
    this.nativeStorage.setItem('merchandizing', this.merchandizing);
  }
  addTaskRemark(taskId, remark) {
    this.merchandizing.filter(obj => {
      obj.taskList.filter(tobj => tobj.syskey == taskId).map(val => {
        val.remark = remark;
      });
    });
    this.nativeStorage.setItem('merchandizing', this.merchandizing);
  }
  setTaskStatus(taskId) {
    this.merchandizing.filter(obj => {
      obj.taskList.filter(tobj => tobj.syskey == taskId).map(val => {
        val.taskstatus = "saved";
      });
    });
    this.nativeStorage.setItem('merchandizing', this.merchandizing);
  }

  /****************** Merchandizing Online [View Only] => shop complete  ********************/
  setMerchandizingView(data) {
    this.merchandizingview = data;
  }
  getMerchandizingView() {
    return this.merchandizingview;
  }
}
