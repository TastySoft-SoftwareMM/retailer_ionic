import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { NavController, IonContent, ModalController, AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InventoryService } from '../services/inventory/inventory.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { async } from '@angular/core/testing';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';

@Component({
  selector: 'app-inventorystock',
  templateUrl: './inventorystock.page.html',
  styleUrls: ['./inventorystock.page.scss'],
})
export class InventorystockPage implements OnInit {
  isIndeterminate: boolean;
  isLoading: any = false;
  masterCheck: boolean;
  stocks: any = [];
  secstocks: any = [];
  hiddenSearch: any = true;
  searchterm: any;
  imgurl: any;

  slice: any = 10;
  constructor(private inventoryService: InventoryService, private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private loadingController: LoadingController,
    private popoverCtrl: PopoverController) {
  }
  ngOnInit() {
    this.isLoading = true;
    this.imgurl = localStorage.getItem('imgurl');
    setTimeout(async () => {
      this.stocks = await this.inventoryService.getStockAll();
      this.secstocks = await this.inventoryService.getStockAll();
      // this.stocks.filter((obj, index) => {
      //   this.stocks[index].isChecked = false;
      // });
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, 1000);

  }

  doInfinite(ev) {
    console.log(this.stocks.length);
    if (this.slice < this.stocks.length) {
      setTimeout(() => {
        this.slice += 10;
        ev.target.complete();
      }, 200);
    }
    else {
      ev.target.disabled = true;
    }
  }
  headerCreate(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.categoryDesc
    }
    let first_prev = records[recordIndex - 1].categoryCode;
    let first_current = record.categoryCode;

    if (first_prev != first_current) {
      return record.categoryDesc
    }
    return null;
  }
  footerCreate(record, recordIndex, records) {
    if (recordIndex == 0) {
      return record.subCategoryDesc
    }
    let first_prev = records[recordIndex - 1].subCategoryCode;
    let first_current = record.subCategoryCode;

    if (first_prev != first_current) {
      return record.subCategoryDesc
    }
    return null;
  }

  inputChange(qtytype, product) {

    //checking qty type
    var amount = 1;
    if (qtytype == "qty") {
      amount = product.amount;
    }
    else {
      amount = product.expqty;
    }

    //modal configure

    this.modalCtrl.create({
      'component': CustomAlertInputPage,
      'componentProps': {
        'productdesc': product.desc,
        'qty': amount
      },
      'cssClass': 'custom-alert-input-modal'
    }).then(el => {
      //show modal
      el.present();

      //modal will back
      el.onDidDismiss().then((res: any) => {
        console.log(res);

        let data = res.data;

        if (data !== undefined) {

          //check qty type
          if (qtytype == "qty") {
            product.amount = data.qty;
          }
          else {
            product.expqty = data.qty;
          }

        }
      })
    });
  }


  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }
  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }
  searchMe() {
    if (this.hiddenSearch == true) {
      this.hiddenSearch = false;
    }
    else {
      this.stocks = this.secstocks;
      this.hiddenSearch = true;
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss('back');
  }
  searchQuery() {
    this.isLoading = true;
    this.filterSearch();
  }
  async filterSearch() {
    let val = this.searchterm;
    if (val == '') {
      this.stocks = await this.inventoryService.getStockAll();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
    console.log(val);
    this.stocks = this.secstocks.filter((item) => {
      return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  checkbox(item) {
    item.isChecked = !item.isChecked;
  }
  checkEvent(data) {
    // data.isChecked = !data.isChecked;

    console.log("Stock" + JSON.stringify(this.stocks));

    // const totalItems = this.stocks.length;
    // let checked = 0;
    // this.stocks.map(obj => {
    //   if (obj.isChecked) checked++;
    // });
    // if (checked > 0 && checked < totalItems) {
    //   //If even one item is checked but not all
    //   this.isIndeterminate = true;
    //   this.masterCheck = false;
    // } else if (checked == totalItems) {
    //   //If all are checked
    //   this.masterCheck = true;
    //   this.isIndeterminate = false;
    // } else {
    //   //If none is checked
    //   this.isIndeterminate = false;
    //   this.masterCheck = false;
    // }
  }
  incrementAmount(p) {
    this.inventoryService.increaseAmount(p);
  }
  incrementexpAmount(p) {
    this.inventoryService.incrementexpAmount(p);
  }
  decreaseAmount(p) {
    this.inventoryService.decreaseAmount(p);
  }
  decreaseexpAmount(p) {
    this.inventoryService.decreaseexpAmount(p);
  }
  addStock() {
    //---- Loop by group ----
    this.loadingService.loadingPresent();
    this.stocks.map((pBC, stindex) => {
      pBC.items.map((item, iindex) => {
        item.subitems.map((sub, sindex) => {
          if (sub.isChecked == true) {
            console.log("val???" + JSON.stringify(sub));
            this.inventoryService.setDataInventory(sub);
          }

          console.log(stindex + '------' + iindex + '------' + sindex);


          if (this.stocks.length == stindex + 1 && pBC.items.length == iindex + 1 && item.subitems.length == sindex + 1) {
            this.loadingService.loadingDismiss();
            this.navCtrl.navigateBack([`inventorycheck`]);
          }

        }
        );

      })
    })

    // if (this.stocks.filter(el => el.isChecked == true).length > 0) {
    //   this.loadingService.loadingPresent();
    //   this.stocks.filter(el => el.isChecked == true).map(val => {
    //     console.log("val???" + JSON.stringify(val));
    //     this.inventoryService.setDataInventory(val);
    //   });
    //   this.loadingService.loadingDismiss();
    //   this.navCtrl.navigateBack([`inventorycheck`]);
    // }
    // else {
    //   this.messageService.showToast("Please select stock");
    // }
  }

  categoryClicke(pbc) {
    pbc.categoryOpen = !pbc.categoryOpen;
  }
  subCategoryClicke(cat) {
    cat.subCategoryOpen = !cat.subCategoryOpen;
  }

}
