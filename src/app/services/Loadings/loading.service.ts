import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;
  isLoadingmsg = false;
  currentDate: String = new Date().toISOString();
  currenttoday: any;
  constructor(
    public loadingController: LoadingController
  ) { }
  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController.create({
      spinner: "circular",
      cssClass: "loading",
      message: 'Please wait...',
    }).then((a) => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });

  }
  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.getTop().then((hasLoading) => {
      if (hasLoading) {
        this.loadingController.dismiss().then(() => console.log('dismissed'))
      }
    });
  }




  async loadingPresentWithMsg() {
    this.isLoadingmsg = true;
    return await this.loadingController.create({
      // spinner: "lines",
      cssClass: "loading",
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoadingmsg) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async loadingDismissWithMsg() {
    this.isLoadingmsg = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}
