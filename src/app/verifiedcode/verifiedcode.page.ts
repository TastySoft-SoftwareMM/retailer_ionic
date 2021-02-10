import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../services/Loadings/loading.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-verifiedcode',
  templateUrl: './verifiedcode.page.html',
  styleUrls: ['./verifiedcode.page.scss'],
})
export class VerifiedcodePage implements OnInit {
  otpCodes: any = [
    "-",
    "-",
    "-",
    "-",
    "-",
    "-"
  ];
  phoneNumber: any;
  loading: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.phoneNumber) {
        this.phoneNumber = params.phoneNumber;
      }
    });
  }

  ngOnInit() {
  }

  resendOTP() {
    alert("OK");
  }

  addPasscode(data) {
    var index = 0;
    var check = 0
    for (var i = 0; i < this.otpCodes.length; i++) {
      if (this.otpCodes[i] == "-") {
        index = i;
        check = 1;
        break;
      }
    }
    if (check == 1) {
      if (data == "back") {
        if (index != 0) {
          this.removeOtp(index - 1);
        }
      } else {
        if (index < 6) {
          this.otpCodes[index] = data;
          if (index == 5) {
            this.loadingService.loadingPresent();
            setTimeout(() => {
              this.loadingService.loadingDismiss();
              this.navCtrl.navigateRoot(['/data']);
            }, 3000);
          }
        }
      }
    } else {
      if (data == "back") {
        this.removeOtp(5);
      }
    }
  }

  removeOtp(index) {
    this.otpCodes[index] = "-";
  }

}
