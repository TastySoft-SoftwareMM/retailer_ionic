import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';
import { NavController, IonSlides } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { OfflineService } from '../services/offline/offline.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { OnlineService } from '../services/online/online.service';
import { NetworkService } from '../services/network/network.service';
import { UtilService } from '../services/util.service';
import { OrderService } from '../services/order/order.service';

@Component({
  selector: 'app-order-placement-fororderupdate',
  templateUrl: './order-placement-fororderupdate.page.html',
  styleUrls: ['./order-placement-fororderupdate.page.scss'],
})
export class OrderPlacementFororderupdatePage implements OnInit {
  products = [];
  sec_products = [];
  recommend = [];
  allrecommend = [];
  secrecommend = [];


  shopsyskey: any;
  imgurl: any;


  hiddenSearch: any;
  searchterm: any;

  searching: any = false;
  isLoading: any = false;
  open: any = true;
  rsopen: any = true;


  isIndeterminate: boolean;
  masterCheck: boolean;

  constructor(private cartService: CartService, private navCtrl: NavController,
    private messageService: MessageService,
    private nativeStorage: NativeStorage,
    private offlineService: OfflineService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private util: UtilService,
    private onlineService: OnlineService,
    private networkService: NetworkService) { }

  ngOnInit() {
    this.hiddenSearch = true;
    this.nativeStorage.getItem("checkinShopdata").then((res: any) => {
      console.log("checkinshopdata>>" + JSON.stringify(res));
      this.shopsyskey = res.shopsyskey;
      this.getRecommend();
    });
    this.imgurl = localStorage.getItem('imgurl');
    this.products = this.orderService.getProducts();
    this.productTotal();
    this.sec_products = this.orderService.getProducts();
    setTimeout(() => {
      this.isLoading = true;
      console.log("Products>>" + JSON.stringify(this.products));
    }, 2000);
  }
  ionViewDidEnter() {
    this.checkNetwork();
  }
  inputChange(event, i) {
    console.log(">>" + event.target.value);

    event.target.value = (event.target.value.replace(/[^0-9]*/g, ''));
    console.log(">>>" + event.target.value);

    if (event.target.value == "" || event.target.value == null || event.target.value == undefined) {
      this.products[i].total = this.products[i].price;
      console.log(">>>>" + event.target.value);
    }
    else if (event.target.value.toString().charAt(0) == 0) {
      event.target.value = 1;
    }
    else {
      console.log("amount");
      this.products[i].total = Number(this.products[i].price) * event.target.value;
    }
  }
  inputChangeRe(event, i) {
    event.target.value = (event.target.value.replace(/[^0-9]*/g, ''));
    if (event.target.value == "" || event.target.value == null || event.target.value == undefined) {
      this.recommend[i].total = this.recommend[i].price;
      event.target.value = 1;
    }
    else {
      this.recommend[i].total = this.recommend[i].price * event.target.value;
    }
  }
  checkNetwork() {
    let type = this.networkService.checkNetworkStatus();
    console.log(type);
    if (!type) {
    }
  }
  navigateBack() {
    this.navCtrl.back();
  }
  save() {
    if (this.products.filter(el => el.isChecked == true).length > 0) {
      this.loadingService.loadingPresent();
      this.products.filter(el => el.isChecked == true).map(val => {
        console.log("val???" + JSON.stringify(val));
        // this.inventoryService.setDataInventory(val);
      });
      this.loadingService.loadingDismiss();
      this.navCtrl.back();
    }
    else {
      this.messageService.showToast("Please select stock");
    }
  }
  getRecommend() {
    // this.recommend = this.cartService.getRecommendStocks();
    // this.secrecommend = this.cartService.getRecommendStocks();
    // this.allrecommend = this.cartService.getRecommendStocks();
  }
  checkEvent() {
    const totalItems = this.products.length;
    let checked = 0;
    this.products.map(obj => {
      if (obj.isChecked) checked++;
    });
    if (checked > 0 && checked < totalItems) {
      //If even one item is checked but not all
      this.isIndeterminate = true;
      this.masterCheck = false;
    } else if (checked == totalItems) {
      //If all are checked
      this.masterCheck = true;
      this.isIndeterminate = false;
    } else {
      //If none is checked
      this.isIndeterminate = false;
      this.masterCheck = false;
    }
  }
  // addToCart(product) {
  //   this.cartService.addToCart(product);
  // }
  // addToCartRe() {
  //   this.loadingService.loadingPresent();
  //   let length = this.recommend.length;
  //   this.recommend.filter((obj, index) => {
  //     this.cartService.addToCart(obj);
  //     if ((length - 1) == index) {
  //       this.loadingService.loadingDismiss();
  //     }
  //   });
  // }
  increaseCart(product) {
    this.cartService.addProduct(product);
  }
  decreseCart(product) {
    this.cartService.decreaseProduct(product);
  }
  removeItem(index) {
    this.recommend.splice(index, 1);
  }
  searchMe() {
    if (this.hiddenSearch == true) {
      this.hiddenSearch = false;
    }
    else {
      this.hiddenSearch = true;
      this.products = this.orderService.getProducts();
      this.productTotal();
      this.recommend = this.allrecommend;
      setTimeout(() => {
        this.isLoading = true;
      }, 2000);
    }
  }



  searchQuery() {
    this.isLoading = false;
    this.filteredData();
  }
  productTotal() {
    for (var i = 0; i < this.products.length; i++) {
      this.products[i].total = Number(this.products[i].price) * Number(this.products[i].amount);
    }
  }
  handleImgError(ev: any, item: any) {
    console.log("ev >>" + JSON.stringify(ev));
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
    console.log("source >>" + source);
  }
  filteredData() {
    console.log("Allinve>>>" + JSON.stringify(this.allrecommend));
    let val = this.searchterm;
    if (val == '') {
      this.products = this.orderService.getProducts();
      this.productTotal();
      this.recommend = this.allrecommend;
      setTimeout(() => {
        this.isLoading = true;
      }, 2000);
    }
    this.products = this.sec_products.filter((item) => {
      return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
    });
    this.recommend = this.secrecommend.filter((item) => {
      return (item.desc.toLowerCase().indexOf(val.toLowerCase()) > -1);
    });
    setTimeout(() => {
      this.isLoading = true;
    }, 1000);
  }
  toggleSection() {
    this.open = !this.open;
  }

  toggleSectionRS() {
    this.rsopen = !this.rsopen;
  }

}
