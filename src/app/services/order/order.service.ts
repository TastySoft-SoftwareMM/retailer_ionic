import { Injectable } from '@angular/core';
import { OfflineService } from '../offline/offline.service';
import { CartService } from '../cart/cart.service';
import { OnlineService } from '../online/online.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderstocks: any = [];
  // data: any = [];
  orderlist: any = [];

  constructor(private offlineService: OfflineService, private onlineService: OnlineService, private cartService: CartService) {
  }

  //-----------------------Order List ---------
  copyOrderList(ol) {
    this.orderlist = ol;
  }
  getOrderList() {
    return this.orderlist;
  }
  clearOrderList() {
    this.orderlist = [];
  }

  //-----------------------  Multiple SKUs Promotion -------------------------
  //-------------------------MultipleSKUs -----------------------


  //------------------------ Data From Orderlist [start] --------------------
  setData(data) {
    console.log("data>>" + JSON.stringify(data));
    data.stockByBrand.map(bo => {
      if (bo.stockData.length > 0) {
        bo.stockData.filter(sd => {
          this.cartService.stockdata.filter(el => el.code == sd.stockCode).map(obj => {

            //multiple skus promo
            console.log("Multi:" + JSON.stringify(this.cartService.multiple_skus));
            var multiplePromo;
            this.cartService.multiple_skus.map(header => {
              header.DetailList.map(detail => {
                detail.rule.map(p => {
                  if (p.syskey == obj.syskey) {
                    multiplePromo = p.multiplePromo;
                  }
                })
              })
            });


            this.orderstocks.push({
              "id": obj.id,
              "img": obj.img,
              "desc": obj.desc,
              "code": obj.code,
              "syskey": obj.syskey,
              "brandSyskey": bo.syskey,
              "brandOwnerName": obj.brandOwnerName,
              "brandOwnerSyskey": obj.brandOwnerSyskey,
              "whSyskey": obj.whSyskey,
              "packSizeCode": obj.packSizeCode,
              "categoryCode": obj.categoryCode,
              "subCategoryCode": obj.subCategoryCode,
              "categoryDesc": obj.categoryDesc,
              "subCategoryDesc": obj.subCategoryDesc,
              "price": Number(sd.normalPrice),
              "amount": sd.qty,
              "total": Number(sd.totalAmount),
              "qtystatus": 'sim',
              'note': data.comment,
              'discount': 0,
              'orderdiscountamount': 0,
              'returndiscountamount': 0,
              'returnsyskey': sd.syskey,
              "discountPercent": 0,
              'gifts': [],
              'promoItems': obj.promoItems,
              'stockactive': 'active',
              'multiplePromo': multiplePromo
            });

          });

          //product not found
          var checkproduct = this.cartService.stockdata.filter(el => el.code == sd.stockCode);
          if (checkproduct.length == 0 || checkproduct == null || checkproduct == undefined) {

            //brandowner checking
            const brandcount = this.cartService.stockdata.filter(el => el.brandOwnerSyskey == sd.brandOwnerSyskey);

            if (brandcount.length > 0) {
              this.orderstocks.push({
                "id": 'N/A',
                "img": 'null',
                "desc": sd.stockName,
                "code": sd.stockCode,
                "syskey": 'N/A',
                "brandSyskey": bo.syskey,
                "brandOwnerName": brandcount[0].brandOwnerName,
                "brandOwnerSyskey": brandcount[0].brandOwnerSyskey,
                "whSyskey": 'N/A',
                "packSizeCode": 'N/A',
                "categoryCode": 'N/A',
                "subCategoryCode": 'N/A',
                "categoryDesc": 'N/A',
                "subCategoryDesc": 'N/A',
                "price": Number(sd.normalPrice),
                "amount": sd.qty,
                "total": Number(sd.totalAmount),
                "qtystatus": 'sim',
                'note': data.comment,
                'discount': 0,
                'orderdiscountamount': 0,
                'returndiscountamount': 0,
                'returnsyskey': sd.syskey,
                "discountPercent": 0,
                'gifts': [],
                'promoItems': [],
                'stockactive': 'inactive'
              });
            }
            else {
              this.orderstocks.push({
                "id": 'N/A',
                "img": 'null',
                "desc": sd.stockName,
                "code": sd.stockCode,
                "syskey": 'N/A',
                "brandSyskey": bo.syskey,
                "brandOwnerName": 'N/A',
                "brandOwnerSyskey": 'N/A',
                "whSyskey": 'N/A',
                "packSizeCode": 'N/A',
                "categoryCode": 'N/A',
                "subCategoryCode": 'N/A',
                "categoryDesc": 'N/A',
                "subCategoryDesc": 'N/A',
                "price": Number(sd.normalPrice),
                "amount": sd.qty,
                "total": Number(sd.totalAmount),
                "qtystatus": 'sim',
                'note': data.comment,
                'discount': 0,
                'orderdiscountamount': 0,
                'returndiscountamount': 0,
                'returnsyskey': sd.syskey,
                "discountPercent": 0,
                'gifts': [],
                'promoItems': [],
                'stockactive': 'inactive'

              });
            }

          }
        })
      }


      if (bo.stockReturnData.length > 0) {
        bo.stockReturnData.filter(srd => {
          this.cartService.stockdata.filter(el => el.code == srd.stockCode).map(obj => {
            this.orderstocks.push({
              "id": obj.id,
              "img": obj.img,
              "desc": obj.desc,
              "code": obj.code,
              "syskey": obj.syskey,
              "brandSyskey": bo.syskey,
              "brandOwnerName": obj.brandOwnerName,
              "brandOwnerSyskey": obj.brandOwnerSyskey,
              "whSyskey": obj.whSyskey,
              "packSizeCode": obj.packSizeCode,
              "categoryCode": obj.categoryCode,
              "subCategoryCode": obj.subCategoryCode,
              "categoryDesc": obj.categoryDesc,
              "subCategoryDesc": obj.subCategoryDesc,
              "price": Number(srd.price),
              "amount": srd.qty,
              "total": Number(srd.totalAmount),
              "qtystatus": 'exp',
              'note': data.comment,
              'discount': 0,
              'orderdiscountamount': 0,
              'returndiscountamount': 0,
              'returnsyskey': srd.syskey
            })
          });
        })
      }

    });
  }


  getData() {
    console.log("orderdata>>" + JSON.stringify(this.orderstocks));
    return this.orderstocks.filter(el => el.isactive != "no");
  }
  getAllOrder() {
    return this.orderstocks;
  }
  getReturnData() {
    return this.orderstocks.filter(el => el.qtystatus == "exp");
  }
  getOrderData() {
    return this.orderstocks.filter(el => el.qtystatus == "sim");
  }
  clearData() {
    this.orderstocks = [];
  }
  deleteCart(product) {
    for (let [index, p] of this.orderstocks.entries()) {
      if (p.id === product.id) {
        p.isactive = "no";
      }
    }
  }
  increaseProduct(product) {
    product.amount = Number(product.amount);
    product.amount += 1;
  }
  decreaseProduct(product) {
    product.amount = Number(product.amount);
    product.amount -= 1;
    if (product.amount == 0) {
      product.amount = 1;
    }
  }

  //------------------------ Data From Orderlist [end]  --------------------

  getProducts() {
    return [];
  }
}
