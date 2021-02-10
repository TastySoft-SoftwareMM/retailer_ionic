import { Injectable } from '@angular/core';
import { UtilService } from '../util.service';
import { IntercomService } from '../intercom.service';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { NetworkService } from '../network/network.service';
import { MessageService } from '../Messages/message.service';
import { LoadingService } from '../Loadings/loading.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineService {
  url: any;
  datas: any;
  constructor(
    public util: UtilService,
    public ics: IntercomService,
    public http: HttpClient,
    private networkService: NetworkService,
    private messageService: MessageService,

    private loadingService: LoadingService
  ) {
    this.url = localStorage.getItem("url");
    // this.url = this.ics.apiurl;
  }

  httpData(linkName, params) {
    this.url = localStorage.getItem("url");
    var link = this.url + linkName;
    let status = this.networkService.checkNetworkStatus();
    if (status) {
      return this.http.post(link, params, this.ics.getOptions()).pipe(timeout(40000), map(result => {
        return result;
      }, err => {
        this.messageService.showNetworkToast(err);
        this.loadingService.loadingDismiss();
      }));
    }
    else {
      this.messageService.showToast("Can't connect right now. [005]");
      this.loadingService.loadingDismiss();
    }
  }


  httpUploadData(linkName, params) {
    this.url = localStorage.getItem("url");
    console.log("Online Url>>>" + this.url);
    var link = this.url + linkName;
    let status = this.networkService.checkNetworkStatus();
    if (status) {
      return this.http.post(link, params, this.ics.getOptions()).pipe(map(result => {
        return result;
      }, err => {
        console.log("erronline==>" + JSON.stringify(err));
        this.messageService.showToast("Can't connect right now [005]");
        this.loadingService.loadingDismiss();
      }));
    }
    else {
      this.messageService.showToast("Can't connect right now. [005]");
      this.loadingService.loadingDismiss();
    }
  }

  httpUrl(linkName) {
    var link = this.url;
    return this.http.post(link, this.ics.getOptions()).pipe(map(result => {
      return result;
    }));
  }
  getStockall() {
    var params = {
      "code": "",
      "desc": "",
      "vendorSyskey": "",
      "brandSyskey": "",
      "categorySyskey": "",
      "packTypeSyskey": "0",
      "packSizeSyskey": "0",
      "flavorSyskey": "0",
      "barcode": []
    }
    return this.httpData("stock/getstockall", params);
  }
  getPricezone(params) {
    return this.httpData("PriceZone/getPriceZoneDownload", params);
  }
  getDiscountPercent(params) {
    return this.httpData("PromoAndDiscount/getDiscountPercent", params);
  }
  getallCustomer() {
    var params = {
      "tnum": "",
      "curroptr": "",
      "docdate": "",
      "docstatus": "",
      "datestatus": "",
      "whsc": "",
      "binsk": "",
      "route": "",
      "code": "",
      "uom": "",
      "usertype": "v5",
      "cvidsyskey": "",
      "customerCode": "",
      "customerName": "",
      "customerCodeOpt": "",
      "customerNameOpt": "",
      "cvc": "",
      "cvn": "",
      "domain": "",
      "docnum": "",
      "status": "",
      "curPage": 0,
      "pageSize": 0,
      "syskey": "",
      "currcode": "",
      "currrate": 1,
      "transtype": 1,
      "fromdate": "",
      "todate": "",
      "ftime": 1,
      "popupList": "",
      "docdateoptr": "",
      "downloadeddate": "",
      "locsk": "",
      "spcashbooks": "",
      "deviceid": "",
      "summaryrpt": "",
      "userid": "",
      "cuslocsyskey": "",
      "pband": "",
      "spSyskey": "200605010640272518"
    }
    return this.httpData("cust/getcusall", params);
  }
  login(params) {
    const salt = this.util.getIvs();
    const iv = this.util.getIvs();
    return this.httpData('main/login/mit/' + iv + '/' + salt, params);
  }
  saveUser(params) {
    return this.httpData("main/signup/mit", params);//main/signup/{domain}
  }
  shopTransfer(params) {
    return this.httpData("shopPerson/insertUJUN002/", params);
  }
  saveOrder(params) {
    return this.httpData("order/save", params);
  }
  checkIn(params) {
    return this.httpData("route/checkin", params);
  }
  setTask(params) {
    return this.httpData("route/settask", params);
  }
  getShopall(params) {
    return this.httpData("shop/getshopall", params);
  }
  getMultipleSKUs(params) {
    return this.httpData("PromoAndDiscount/getMultiRuleDownload", params);
  }
  calculateMultipleSKUs(params) {
    return this.httpData("PromoAndDiscount/getVolDisMultiRuleCalculation", params);
  }
  getPromotionItems(params) {
    return this.httpData("PromoAndDiscount/getPromoItemDetail", params);
  }

  calculatePromotionItems(params) {
    return this.httpData("PromoAndDiscount/getVolDisCalculation", params);
  }

  getInvDis(params) {
    return this.httpData("PromoAndDiscount/getInvoiceDiscountDownload", params);
  }
  calculateInvDis(params) {
    return this.httpData('PromoAndDiscount/getInvDisCalculation', params);
  }
  getMerchandizing(params) {
    return this.httpData("campaign/getshopKey/" + params, "");
  }
  getmerchandizing(params) {
    return this.httpData("campaign/getshopKey/", params);
  }
  getMerchandizingView(params) {
    return this.httpData("campaign/getMerchandising", params);
  }
  getInventory(params) {
    return this.httpData("order/getsmartlist", params);
  }
  getInventoryList(params) {
    return this.httpData("inventory/getinventorylist", params);
  }
  saveInventory(params) {
    return this.httpData("inventory/saveinventory", params);
  }
  getRecommendStock(params) {
    return this.httpData("order/getrecommendedlist", params);
  }
  getOrderList(params) {
    return this.httpData("order/getsolist", params);
  }
  photoUpload(params) {
    return this.httpUploadData("upload/save", params);
  }
  saveCampaign(params) {
    return this.httpUploadData("campaign/saveCampaign", params);
  }
  setPasswordReset(params) {
    return this.httpData("main/reset/" + '  ', params);
  }
}
