import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  orgId: string = "";
  userName: string = "";
  domain: string = "mit2";
  apiurl: string = "";
  wsurl: string = "";
  rpturl: string = "";
  title: string = "";
  app: string = "";
  appname: string = "";
  version: string = "";
  invEditCur: boolean = true;
  isDownloadAllStock: boolean = true;
  decimalPlace: number = 2;
  companyObj: any;
  language: any;
  defaultLanguage: any;
  defaultLanCode: any = "E";
  loginUserRoles: any;
  constructor(private router: Router,
  ) {
    var aa = localStorage.getItem("url");
    console.log("url>>" + aa);
    if (aa == undefined || aa == null || aa == "") {
      // http://52.255.142.115:8084/madbrepository/ ==> ForQC [old]
      // http://52.253.88.71:8084/madbrepository/   ==> ForCustomer[old]

      // For Customer_Testing
      // http://52.253.88.71:8084/madbrepository/

      // For Customer GoLive Server
      // http://54.255.17.88:8084/madbrepository/


      /****** QC Server *****/
      // this.apiurl = "http://52.255.142.115:8084/madbrepository/";
      // localStorage.setItem("url", "http://52.255.142.115:8084/madbrepository/");
      // localStorage.setItem("imgurl", "http://52.255.142.115:8084/");

      // For Customer_Testing
      // this.apiurl = "http://52.253.88.71:8084/madbrepository/";
      // localStorage.setItem("url", "http://52.253.88.71:8084/madbrepository/");
      // localStorage.setItem("imgurl", "http://52.253.88.71:8084/");


      //--- Go liver server for dec7      
      this.apiurl = "http://18.136.44.90:8084/madbrepository/";
      localStorage.setItem("url", "http://18.136.44.90:8084/madbrepository/");
      localStorage.setItem("imgurl", "http://18.136.44.90:8084/");


      // http://18.136.44.90:8084/madbrepository/
      /******GO Live Server ***/
      // this.apiurl = "http://54.255.17.88:8084/madbrepository/";
      // localStorage.setItem("url", "http://54.255.17.88:8084/madbrepository/");
      // localStorage.setItem("imgurl", "http://54.255.17.88:8084/");



      // this.apiurl = "http://52.253.88.71:8084/mymadbrepository/";
      // localStorage.setItem("url", "http://52.253.88.71:8084/mymadbrepository/");
      // localStorage.setItem("imgurl", "http://52.253.88.71:8084/");

      console.log("QC testing == " + "http://52.255.142.115:8084/madbrepository/");
      console.log("Customer testing == " + "http://52.253.88.71:8084/madbrepository/");

    } else {
      this.apiurl = aa;
    }
    this.orgId = sessionStorage.getItem("orgId");
    if (this.orgId == null || this.orgId == undefined) {
      this.orgId = "";
    }
  }


  profile = {
    "userName": "",
    "bid": "",
    "role": 1,
    "userSk": "0",
    "u12Sk": "0",
    "logoText": "NG",
    "logoLink": "Menu00",
    "commandCenter": "true",
    "btndata": [],
    "menus": [],
    "rightMenus": [],
    "userId": "",
    "t1": "",
    "t2": "",
    "t3": "",
    "t4": "",
    "n1": 10
  };

  getRole(): number {
    return this.profile.role;
  }
  isLoginUser() {
    if (this.userName == "") {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
  getOptions() {
    const options = {
      headers: new HttpHeaders({
        'Accept': 'text/html,application/json',
        'Content-Type': 'application/json',
        'Content-Over': this.orgId.toString()
      })
    };
    return options;
  }
  checkSaveRout() {
    if (this.orgId == '' || this.orgId == "" || this.orgId == 'undefinied') {
      return false;
    } else return true;
  }
}
