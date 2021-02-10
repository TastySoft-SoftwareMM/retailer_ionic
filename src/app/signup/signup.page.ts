import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';
import { OnlineService } from '../services/online/online.service';
import { NetworkService } from '../services/network/network.service';
import { LoadingService } from '../services/Loadings/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  // userID:any;
  name: any;
  phoneNumber: any;
  email: any;
  password: any;
  confirmPassword: any;
  passcode: any;
  confirmPasscode: any = "";
  active: any = true;
  params: any = this.getSecondparam();//this.getParam();

  status: any = 1;

  constructor(
    private navCtrl: NavController,
    public messageService: MessageService,
    public onlineService: OnlineService,
    private networkService: NetworkService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  loginFun() {
    this.navCtrl.navigateRoot(['login_username']);
  }
  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }
  signUP() {
    if (this.name == "" || this.name == undefined || this.name == null || this.phoneNumber == "" || this.phoneNumber == undefined || this.phoneNumber == null
      || this.password == "" || this.password == undefined || this.password == null || this.confirmPassword == "" || this.confirmPassword == undefined || this.confirmPassword == null) {
      this.messageService.showToast("Please, fill all fields");
    } else {
      if (this.password != this.confirmPassword) {
        this.messageService.showToast("Password doesn't match.");
      } else {
        this.loadingService.loadingPresent();
        var phone = this.phoneNumber.substring(0, 4);
        if (phone.includes("+959")) {
        } else if (phone.includes("959")) {
          this.phoneNumber = "+" + this.phoneNumber;
        } else if (phone.includes("09")) {
          this.phoneNumber = "+959" + this.phoneNumber.slice(2, this.phoneNumber.length);
        } else {
          this.phoneNumber = "+959" + this.phoneNumber;
        }
        // // this.params.status = this.status;
        // // this.params.loginUserId = this.phoneNumber;
        // // this.params.loginUserName = this.name;
        // // this.params.phone = this.phoneNumber;
        // // this.params.email = this.email;
        this.params.userId = this.phoneNumber;
        this.params.userName = this.name;
        this.params.password = this.confirmPassword;
        this.params.passcode = this.confirmPasscode;
        console.log("pa-->" + JSON.stringify(this.params));
        this.onlineService.saveUser(this.params).subscribe((res: any) => {
          console.log("aa-->" + JSON.stringify(res));
          if (res.message === "SUCCESS") {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Saved successfully.");
            this.navCtrl.navigateRoot(['login_username']);
          } else if (res.message === "IDEXIST") {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("User already exists.");
          } else if (res.message === "PCEXIST") {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Passcode already exists.");
          } else if (res.message === "FAIL") {
            this.loadingService.loadingDismiss();
            this.messageService.showToast("Saving fail.");
          }
        },
          err => {
            console.log("err-->" + JSON.stringify(err));
            this.loadingService.loadingDismiss();
            this.messageService.showNetworkToast(err);
          })
      }
    }
    // this.navCtrl.navigateRoot(['login_username']);
  }

  activeEvent(event) {
    this.active = event;
    if (this.active == true) {
      this.status = 1;
    } else {
      this.status = 0;
    }
  }

  getParam() {
    return { "syskey": "0", "u12Syskey": "0", "loginUserId": "", "loginUserName": "", "userId": "", "userName": "", "password": "", "orgId": "", "passcode": "", "status": "1", "phone": "", "otp": "", "location": "", "deviceId": "", "email": "" };
  }

  getSecondparam() {
    return { "userId": "", "userName": "", "password": "", "passcode": "" };
  }
}
