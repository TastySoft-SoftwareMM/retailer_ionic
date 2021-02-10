import { Injectable } from '@angular/core';
import { OnlineService } from '../online/online.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OfflineService } from '../offline/offline.service';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  stockdata: any = [];
  invedata: any = [];
  pricezone: any = [];

  constructor(private onlineService: OnlineService,
    private nativeStorage: NativeStorage,
    private offlineService: OfflineService,
    private utilService: UtilService) {
    this.offlineService.getStocks().then((res: any) => {
      var results = [];
      this.stockdata = res.data;
      this.stockdata.filter((obj, index) => {
        this.stockdata[index].isChecked = false;
      });

    });
  }

  /*****
   *Note :: Inventory List => Update Inventory (second time and more)
   ******** Smart List     => Save Inventory(first time)
   */

  setDataInventory(data) {
    console.log("setdatainventroy>>" + JSON.stringify(data));
    let added = false;
    for (let p of this.invedata) {
      if (p.code === data.code) {
        added = true;
        console.log("pamount။" + p.amount);
        p.amount = p.amount + data.amount;
        p.expqty = p.expqty + data.expqty;
      }
    }

    var status = sessionStorage.getItem('Inventory');
    if (!added && status == "smartlist") {
      this.invedata.push({
        "id": data.id,
        'syskey': data.syskey,
        "img": data.img,
        "desc": data.desc,
        "code": data.code,
        "brandOwnerName": data.brandOwnerName,
        "brandOwnerSyskey": data.brandOwnerSyskey,
        "whSyskey": data.whSyskey,
        "packSizeCode": data.packSizeCode,
        "categoryCode": data.categoryCode,
        "subCategoryCode": data.subCategoryCode,
        "categoryDesc": data.categoryDesc,
        "subCategoryDesc": data.subCategoryDesc,
        "price": data.price,
        "amount": data.amount,
        "expqty": data.expqty,
        "isChecked": true
      });
    }
    if (!added && status == "inventorylist") {
      this.invedata.push({
        "id": data.id,
        'syskey': data.syskey,
        "img": data.img,
        "desc": data.desc,
        "code": data.code,
        "brandOwnerName": data.brandOwnerName,
        "brandOwnerSyskey": data.brandOwnerSyskey,
        "whSyskey": data.whSyskey,
        "packSizeCode": data.packSizeCode,
        "categoryCode": data.categoryCode,
        "subCategoryCode": data.subCategoryCode,
        "categoryDesc": data.categoryDesc,
        "subCategoryDesc": data.subCategoryDesc,
        "price": data.price,
        "amount": data.amount,
        "expqty": data.expqty,
        "isChecked": true,
        'headerSyskey': data.headerSyskey,
        'binsyskey': data.binSyskey,
        'transHeaderSyskey': data.transHeaderSyskey,
        'transDetailSyskey': data.transDetailSyskey,
        'isactive': 'yes'
      });
    }
  }
  clearDataInventory() {
    this.invedata = [];
  }
  getDataInventory() {
    console.log("service inventory>>" + this.invedata);
    var status = sessionStorage.getItem('Inventory');
    if (status == "smartlist") {
      return this.invedata;
    }
    else {
      return this.invedata.filter(el => el.isactive == "yes");
    }
  }
  getStockByStocksyskey(syskey) {
    return this.stockdata.filter(el => el.syskey == syskey);
  }
  updateInveStock(code) { //Inventory List
    return new Promise(resolve => {
      this.invedata.filter(el => el.code == code).map(val => {
        val.isactive = "no";
      });
      resolve();
    })
  }

  /**
   * => Return Product => addtocardorder => change different id
   */
  updateStockId(code, syskey) {
    this.stockdata.filter(el => el.code == code).map(val => {
      val.id = syskey;
    })
  }



  updateStockPriceByPriceZone() {
    return new Promise(resolve => {
      if (this.pricezone.length > 0) {
        this.pricezone.map((zitem, index) => {
          console.log(zitem);
          this.stockdata.filter(item => item.syskey == zitem.StockSyskey).map(el => {
            el.price = zitem.ChangedPrice;
            console.log(el);
          });
          if (this.pricezone.length == index + 1) {
            console.log('..');
            resolve();
          }
        })
      }
      else {
        resolve();
      }
    })
  }


  //for inventory stock page [Group by]
  getStockAll() {
    return new Promise(resolve => {
      console.log(".");
      const stockPromise = new Promise(async (resolve) => {
        this.offlineService.getStocks().then(async (res: any) => {
          console.log("..");
          this.stockdata = res.data;
          this.stockdata.filter((el, index) => {
            el.isChecked = false; el.amount = 0; el.expqty = 0;
          });

          // update price zone 
          console.log('.');
          const anawait = await this.updateStockPriceByPriceZone();
          console.log('...');
          resolve();
        }, err => {
          resolve();
        });
      });

      stockPromise.then(() => {
        console.log("...");

        var status = sessionStorage.getItem('Inventory');
        if (status == "inventorylist") {
          this.invedata.filter(iobj => {
            this.stockdata.filter(sobj => sobj.brandOwnerSyskey == iobj.brandOwnerSyskey).map(val => {
              val.transHeaderSyskey = iobj.transHeaderSyskey;
            });
            this.stockdata.filter(sobj => sobj.code == iobj.code).map(val => {
              val.headerSyskey = iobj.headerSyskey;
              val.binSyskey = iobj.binSyskey;
              val.transDetailSyskey = iobj.transDetailSyskey;
            });
          });
        }


        var category = new Set(this.stockdata.map(item => item.categoryCode));

        var results = [];
        category.forEach(categoryCode => {
          var sortedcategoryCodeArray = this.stockdata.filter(i => i.categoryCode === categoryCode);
          var subCategory = new Set(sortedcategoryCodeArray.map(item => item.subCategoryCode)), subdata = [];

          subCategory.forEach((subCategoryCode, index) => {
            var subindex = false;
            if (index == 0) {
              subindex = true;
            }
            subdata.push({
              subCategoryDesc: this.stockdata.find(s => s.subCategoryCode === subCategoryCode).subCategoryDesc,
              subCategoryOpen: subindex,
              subitems: this.stockdata.filter(i => i.subCategoryCode === subCategoryCode)
            });
          })


          results.push({
            categoryDesc: this.stockdata.find(s => s.categoryCode === categoryCode).categoryDesc,
            categoryOpen: true,
            items: subdata
          });

        });



        console.log("Results ===" + JSON.stringify(results));
        resolve(results);
      })
    })
  }

  increaseAmount(product) {
    product.amount = Number(product.amount);
    if (product.amount < this.utilService.maxLength) {
      product.amount += 1;
    }
  }
  incrementexpAmount(product) {
    product.expqty = Number(product.expqty);

    if (product.expqty < this.utilService.maxLength) {
      product.expqty += 1;
    }
  }
  decreaseAmount(product) {
    if (product.amount == 0) {
      product.amount = 0;
    }
    else {
      product.amount -= 1;
    }
  }
  decreaseexpAmount(product) {
    if (product.expqty == 0) {
      product.expqty = 0;
    }
    else {
      product.expqty -= 1;
    }
  }
}
