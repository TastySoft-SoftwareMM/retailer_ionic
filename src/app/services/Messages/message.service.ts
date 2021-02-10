import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private toastController: ToastController,
  ) { }

  async showToast(data) {
    this.toastController.dismiss().then((obj) => {
    }).catch(() => {
    }).finally(() => {
      this.showToastMsg(data);
    });
  }
  async showToastMsg(data) {
    await this.toastController.create({
      message: data,
      duration: 2000,
      position: 'top',
      cssClass: "toast-scheme ",
    }).then(e => {
      e.present();
    });

  }
  async showNetworkToast(error) {
    let code;
    if (error.status == 404) {
      code = '001';
    }
    else if (error.status == 500) {
      code = '002';
    }
    else if (error.status == 403) {
      code = '003';
    }
    else if (error.status == -1) {
      code = '004';
    }
    else if (error.status == 0) {
      code = '005';
    }
    else if (error.status == 502) {
      code = '006';
    }
    else {
      code = '000';
    }
    console.log("errstatus>>" + error.status);

    if (error.status == undefined && error.status == null) {
      const toast = await this.toastController.create({
        message: "Request Timeout, Please try again",
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }
    else {
      const toast = await this.toastController.create({
        message: "Can't connect right now. [" + code + "]",
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }

  }

}
