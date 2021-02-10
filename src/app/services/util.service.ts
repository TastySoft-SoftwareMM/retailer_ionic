import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { DatePipe } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})


export class UtilService {
  constantKey: string = '!@#$29!@#$Gk**&*';
  currentDate: any = new Date();

  //target input maxLength
  maxLength: any = 9999;

  constructor(
    public datePie: DatePipe,
    public allertController: AlertController,
    public toast: ToastController
  ) {

  }
  encrypt(keysize, iterationCount, password, iv, salt) {
    if (password == "") return "";
    var mykeysize = keysize / 32;
    var myiterationCount = iterationCount;
    var key = crypto.PBKDF2(this.constantKey, crypto.enc.Hex.parse(salt), { keySize: mykeysize, iterations: myiterationCount });
    var encrypted = crypto.AES.encrypt(password, key, { iv: crypto.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(crypto.enc.Base64);
  }
  getIvs() {
    return crypto.lib.WordArray.random(128 / 8).toString(crypto.enc.Hex);
  }
  passwordChanged(password) {
    let obj = { "flag": false, "ret": "" };
    var strongRegex = new RegExp("^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{5,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{4,}).*", "g");

    if (false == enoughRegex.test(password)) {
      obj.ret = '<span style="font-weight:bold">More Characters</span>';
      obj.flag = true;
    } else if (strongRegex.test(password)) {
      obj.ret = '<span style="font-weight:bold;color:green">Strong!</span>';
    } else if (mediumRegex.test(password)) {
      obj.ret = '<span style="font-weight:bold;color:orange">Medium!</span>';
    } else {
      obj.ret = '<span style="font-weight:bold;color:red">Weak!</span>';
      obj.flag = true;
    }
    return obj;
  }
  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }
  disableScroll() {
    window.onwheel = this.preventDefault; // modern standard
    window.ontouchmove = this.preventDefault; // mobile

  }
  formatDate(date: Date, format: string) {
    return this.datePie.transform(date, format);
  }
  getCurrentDate() {
    var date = new Date();
    return date;
  }
  TimezoneOffsetToDate(dateString: string) {
    return (dateString.substring(0, 10)).replace(/-/gi, "");
  }
  getSkeletonTextCount(count) {
  }
  showAlert(alc: AlertController, header: string, message: string) {
    var alert = alc.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }
    ).then(alert => { alert.present() })
    return alert;
  }
  roundDecimal(number, place) {
    return parseFloat(number).toFixed(place);
  }
  dateFormat(date) {
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    let val = day + '/' + month + '/' + year;
    return val;
  }
  getTodayDate() {
    this.currentDate = new Date();
    let year = this.currentDate.getFullYear();
    var month = ("0" + (this.currentDate.getMonth() + 1)).slice(-2);
    var day = ("0" + this.currentDate.getDate()).slice(-2);
    let date = year.toString() + month.toString() + day.toString();
    console.log("CurrentDate>>" + date);
    return date;
  }

  getforShowDate() {
    this.currentDate = new Date();
    let year = this.currentDate.getFullYear();
    var month = ("0" + (this.currentDate.getMonth() + 1)).slice(-2);
    var day = ("0" + this.currentDate.getDate()).slice(-2);
    let date = day + "/" + month + "/" + year;
    console.log("CurrentDate>>" + date);
    return date;
  }

  getCurrentTime() {
    let date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var time = (hour.toString() + minute.toString() + second.toString());
    console.log("time>>" + time);
    return time;
  }

  truncateCartCount(val) {
    if (val !== null && val !== undefined) {

      if (val.toString().length > 3) {
        return "999" + "+";
      }
      else {
        return val;
      }

    }
    else {
      return "0";
    }
  }

  //Create Thousand Sperator
  thousand_sperator(number) {
    var val = number.toString();
    if (val != "" && val != undefined && val != null) {
      val = val.replace(/,/g, "");
    }
    var data = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (data);
  }

  //check decimal
  checkDecimals(value) {
    var count = this.countDecimals(value);
    if (count == 0 || count == 2) {
      return Number(value);
    }
    else {
      return Number(value.toString().split(".")[0] + "." + value.toString().split(".")[1].substring(0, 2));
    }
  }

  countDecimals(value) {
    if (Math.floor(value) == value) return 0;
    return value.toString().split(".")[1].length || 0;
  }

  fixedPoint(value) {
    var count = this.countDecimals(value);
    if (count == 0 || count == 2) {
      return Number(value);
    }
    else {
      return Number(value).toFixed(2);
    }
  }
}
