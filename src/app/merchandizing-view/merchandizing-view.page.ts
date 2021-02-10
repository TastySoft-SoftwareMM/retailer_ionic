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
  selector: 'app-merchandizing-view',
  templateUrl: './merchandizing-view.page.html',
  styleUrls: ['./merchandizing-view.page.scss'],
})
export class MerchandizingViewPage implements OnInit {
  merch: any = []; //for display ui
  onlinemerch: any = []; // get merchandizing data from server
  parammerch: any = [];  //for generate param                         

  checkinShopdata: any;
  isLoading: any = false;

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
    private loadingController: LoadingController) { }

  ngOnInit() {
    this.loadingService.loadingPresent();
    this.getMerchandizing();
  }

  getMerchandizing() {
    this.onlinemerch = this.merchandizingService.getMerchandizingView();
    console.log("Merch>>" + JSON.stringify(this.onlinemerch));
    this.onlinemerch.filter(val => {
      val.taskstatus = "saved";
    })
    setTimeout(() => {
      this.loadingService.loadingDismiss();
      this.isLoading = true;
    }, 2000);
  }
  toggleSection(index) {
    this.onlinemerch[index].open = !this.onlinemerch[index].open;
  }
  async showPopup(pictureData, taskCode, taskDesc) {
    let modal = await this.modalCtrl.create({
      component: MerchanModalPage,
      componentProps: {
        images: pictureData,
        taskCode: taskCode,
        taskDesc: taskDesc
      }
    });
    modal.present();
  }
}
