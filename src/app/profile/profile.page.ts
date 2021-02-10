import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DummyDataService } from '../services/dummydata/dummy-data.service';
import { MessageService } from '../services/Messages/message.service';
import { OfflineService } from '../services/offline/offline.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OnlineService } from '../services/online/online.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { NetworkService } from '../services/network/network.service';
import { ShopService } from '../services/shop/shop.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any = {};
  usershop: any = [];
  shopUser: any = [];
  users: any = [];
  teamBody: any = [];
  segment: any = 1;
  teams: any = [];
  shopName: any = "";
  userName: any = "";
  storeowner: any = false;
  isLoading: any = false;

  selectUsers: any = [];
  selectShops: any = [];
  selectTeams: any = [];
  loginData: any;


  currentDate: String = new Date().toISOString();


  curpass: any;
  newpass: any;
  conpass: any;
  constructor(private navCtrl: NavController, private dummyService: DummyDataService,
    private messageService: MessageService,
    private offlineservice: OfflineService,
    private nativeStorage: NativeStorage,
    private onlineService: OnlineService,
    private networkService: NetworkService,
    private loadingService: LoadingService,
    private util: UtilService,
    private shopService: ShopService) {
    this.loadingService.loadingPresent();
    this.nativeStorage.getItem("loginData").then(res => {
      this.loginData = res;
      console.log("loginData -->" + JSON.stringify(this.loginData));
      this.getProfile();
    });
  }

  ngOnInit() {
    this.usershop = this.dummyService.getUserShop();

  }
  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }

  getProfile() {
    this.nativeStorage.getItem("loginData").then(val => {
      this.profile = val;
      if (this.profile.userType == "storeowner") {
        this.storeowner = true;
      } else {
        this.storeowner = false;
      }
    });
    this.shopUser = this.shopService.getShopByUser();
    this.teams = this.shopService.getShopByTeam();
    this.selectShops = this.shopUser.filter(el => el.checkinStatus == '');
    this.selectUsers = Array.from(new Set(this.teams.map(s => s.usercode))).map(syskey => {
      return {
        'username': this.teams.find(s => s.usercode === syskey).username,
        'user': this.teams.find(s => s.usercode === syskey).user,
        'usercode': syskey
      };
    });
    setTimeout(() => {
      console.log("select users1 >>" + JSON.stringify(this.selectUsers));
      console.log("select teams1 >>" + JSON.stringify(this.selectTeams));
      console.log("teams1 >>" + JSON.stringify(this.teams));
      this.loadingService.loadingDismiss();
      this.isLoading = true;
    }, 1000);
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  goDetail(data) {
    setTimeout(() => {
      this.navCtrl.navigateForward([`shop-detail/usershop/${data.shopsyskey}`])
    }, 1000);
  }
  goTeamDetail(data) {
    setTimeout(() => {
      this.navCtrl.navigateForward([`shop-detail/userteam/${data.shopsyskey}`])
    }, 1000);
  }
  toggleSection(index, code) {
    this.teams[index].open = !this.teams[index].open;
  }
  shopSelected() {

  }
  submit() {
    console.log("SHop name == " + this.shopName + "---- username" + this.userName);
    if (this.shopName == "" || this.userName == "") {
      this.messageService.showToast("Please choose fields");
    } else {
      this.loadingService.loadingPresent();
      var param =
      {
        "date": this.util.getTodayDate(),
        "t1": "",
        "userSyskey": this.loginData.syskey,
        "shopSyskey": this.shopName,
        "n1": this.userName,
        "n2": "",
        "n3": ""
      };
      this.onlineService.shopTransfer(param).subscribe((res: any) => {
        if (res.status == "SUCCESS") {
          sessionStorage.setItem('routestatus', 'ordersubmit'); //for shop list reload in mainpate.ts 
          setTimeout(() => {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Transfered successfully");
            this.navCtrl.navigateBack(['main']);
          }, 1000);
        }
        else {
          this.loadingService.loadingDismiss();
          this.messageService.showToast("Something wrong!");
        }
      }, err => {
        this.loadingService.loadingDismiss();
        this.messageService.showNetworkToast(err);
      });
    }
  }
  resetPassword() {
    if (this.curpass == "" || this.newpass == "" || this.conpass == "") {
      this.messageService.showToast("Please, fill all fields");
    }
    else if (this.newpass != this.conpass) {
      this.messageService.showToast("Password doesn't match.");
    }
    else {
      this.loadingService.loadingPresent();
      var param = {
        id: this.loginData.userId,
        oldpass: this.loginData.password,
        newpass: this.newpass
      };
      this.onlineService.setPasswordReset(param).subscribe((res: any) => {
        console.log("res>>" + JSON.stringify(res));
        if (res.status == "SUCCESS!") {
          sessionStorage.removeItem("loginData");
          sessionStorage.removeItem("login");
          sessionStorage.removeItem("checkin")
          this.nativeStorage.remove("checkSteps");
          this.nativeStorage.remove("checkinShopdata");
          this.navCtrl.navigateRoot(["login_username"]);
          this.messageService.showToast("Reset password successfully");
        }
        else if (res.status == "Userid does not exist") {
          this.messageService.showToast("Userid does not exist");
        }
        else if (res.status == "Invalid password combination") {
          this.messageService.showToast("Current password doesn't match");
        }
        this.loadingService.loadingDismiss();

      });
    }
  }
}
