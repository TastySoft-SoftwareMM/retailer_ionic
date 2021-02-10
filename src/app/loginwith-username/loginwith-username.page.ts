import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginpopoverComponent } from '../components/loginpopover/loginpopover.component';
import { MessageService } from '../services/Messages/message.service';
import { UtilService } from '../services/util.service';
import { IntercomService } from '../services/intercom.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NetworkService } from '../services/network/network.service';
import { OnlineService } from '../services/online/online.service';
import { MerchanModalPage } from '../merchan-modal/merchan-modal.page';
import { OfflineService } from '../services/offline/offline.service';

@Component({
  selector: 'app-loginwith-username',
  templateUrl: './loginwith-username.page.html',
  styleUrls: ['./loginwith-username.page.scss'],
})
export class LoginwithUsernamePage implements OnInit {

  userId: any;
  password: any;
  loading: any;
  result: any = {};

  constructor(
    private nativeStorage: NativeStorage,
    private navCtrl: NavController,
    private route: Router,
    private popoverController: PopoverController,
    private messageService: MessageService,
    private util: UtilService,
    private ics: IntercomService,
    public loadingService: LoadingService,
    public loadingController: LoadingController,
    private networkService: NetworkService,
    private http: HttpClient,
    private offlineService: OfflineService,
  ) {

  }

  ngOnInit() {
    //setup merchandizing native storage db
    this.nativeStorage.setItem("merchandizing", "");
  }
  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }
  signup() {
    this.route.navigate(['signup']);
  }
  inputChange(ev) {
    if (ev.target.value.toString().includes('-') || ev.target.value.toString().includes('.')) {
      console.log(">");
      return false;
    } else {
      console.log(">>");
      return true;
    }
  }
  logIn() {
    if (this.userId == "" || this.userId == null || this.userId == undefined || this.password == "" || this.password == null || this.password == undefined) {
      this.messageService.showToast("Please, fill all fields");
    } else {
      var phone = this.userId.substring(0, 4);
      if (phone.includes("+959")) {
      } else if (phone.includes("959")) {
        this.userId = "+" + this.userId;
      } else if (phone.includes("09")) {
        this.userId = "+959" + this.userId.slice(2, this.userId.length);
      } else {
        this.userId = "+959" + this.userId;
      }
      const salt = this.util.getIvs();
      const iv = this.util.getIvs();
      const postparams = {
        userId: this.userId,
        password: this.util.encrypt(128, 1000, this.password, iv, salt),
      };
      const url = this.ics.apiurl + 'main/login/mit/' + iv + '/' + salt;
      console.log("aa-->" + url + "__" + JSON.stringify(postparams));
      this.loadingService.loadingPresent();
      this.http.post(url, postparams).pipe(timeout(30000)).subscribe((data: any) => {
        this.result = data;
        this.result.password = this.password;
        console.log("11-->" + JSON.stringify(this.result));
        if (this.result.orgId !== '' && this.result.u12Syskey !== '' && (this.result.userType == 'storeowner' || this.result.userType == 'saleperson')) {
          // this.events.publish('username', this.result.userId);
          this.ics.orgId = this.result.orgId;
          sessionStorage.setItem('orgId', this.result.orgId);
          this.ics.userName = this.result.userId;
          this.ics.loginUserRoles = this.result.loginUserRoles;

          var aa = JSON.parse(sessionStorage.getItem("sessionDate"));//Session Date
          console.log("AA == ", aa);
          if (aa != null || aa != undefined) {
            if (aa == this.util.getTodayDate()) {
              // alert("Session");
            }
            else {
              this.nativeStorage.clear();
              this.offlineService.cleanMerchandizing();
              this.offlineService.cleanMerchTask();
              this.offlineService.cleanMerchImage();
              sessionStorage.setItem("sessionDate", this.util.getTodayDate());
            }
          }
          else {
            // alert("NewSession");
            sessionStorage.setItem("sessionDate", this.util.getTodayDate());
          }

          this.loadingService.loadingDismiss();
          this.nativeStorage.setItem("loginData", this.result);
          sessionStorage.setItem("login", "true");
          this.navCtrl.navigateForward(['data']);
        } else {

          this.loadingService.loadingDismiss();

          this.messageService.showToast("Invalid User ID or Password");
        }
      },
        err => {
          console.log("err->" + JSON.stringify(err));
          this.loadingService.loadingDismiss();
          this.messageService.showNetworkToast(err);
        })
    }
  }
  async popoverOpen(ev: any) {
    const popover = await this.popoverController.create({
      component: LoginpopoverComponent,
      cssClass: "settingpopover",
      event: ev,
      animated: true,
      translucent: true
    });
    await popover.present();
  }
}
