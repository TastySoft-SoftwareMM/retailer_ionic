import { Component, OnInit, ViewChild, ViewChildren, HostBinding, Input, Renderer2 } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { IonInfiniteScroll, PopoverController, DomController, AlertController, IonContent } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NavController, IonSlides, ModalController } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { OfflineService } from '../services/offline/offline.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { OnlineService } from '../services/online/online.service';
import { NetworkService } from '../services/network/network.service';
import { UtilService } from '../services/util.service';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { ShopService } from '../services/shop/shop.service';
import { ProImageViewerPage } from '../pro-image-viewer/pro-image-viewer.page';
import { ThrowStmt } from '@angular/compiler';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';
import { MultipleSkusPage } from '../multiple-skus/multiple-skus.page';

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.page.html',
  styleUrls: ['./order-placement.page.scss'],
})
export class OrderPlacementPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  products: any = [];
  sec_products: any = [];
  cart: any = [];
  recommend: any = [];

  promotionitems: any = [];
  multiple_skus = [];

  categoryList: any = [];
  subcategoryList: any = [];
  promotionTypeList: any = [];

  shopsyskey: any;
  imgurl: any;
  cartItemCount: BehaviorSubject<number>;

  slice: number = 10;
  slicere: number = 10;
  loadmore: any = false;

  hiddenSearch: any;
  searchterm: any;
  searhctrl: FormControl;

  searching: any = false;
  isLoading: any = false;
  loadingSpinner: any = false;
  showshopdetail: any = true;
  open: any = true;
  rsopen: any = false;
  proopen: any = false;
  slideOpts = {
    zoom: false
  };

  ismultiple: boolean = false;
  headerkey: any = 3;
  categorykey: any;
  subkey: any;
  promoHeaderkey: any;
  @ViewChild('infinitescroll', { static: false }) infiniteScrollBAI: IonInfiniteScroll;
  @ViewChild('infinitescrollrs', { static: false }) infiniteScrollRS: IonInfiniteScroll;

  constructor(private cartService: CartService, private navCtrl: NavController,
    private messageService: MessageService,
    private nativeStorage: NativeStorage,
    private offlineService: OfflineService,
    private loadingService: LoadingService,
    public util: UtilService,
    private onlineService: OnlineService,
    private networkService: NetworkService,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private shopService: ShopService,
    private renderer: Renderer2,
    private alertController: AlertController,
    private domCtrl: DomController) {
    this.searhctrl = new FormControl;
    console.log("Constructor");
  }

  ngOnInit() {
    console.log("Oninit");
    this.isLoading = true;
    this.imgurl = localStorage.getItem('imgurl');
    this.hiddenSearch = true;
    this.headerkey = 3;
    this.searchterm = "";
    this.subkey = "";
    this.categorykey = "";
    this.rsopen = false;
    this.proopen = false;
    this.getRecommend();
    this.products = this.cartService.getProducts("allstock", "allstock", "", "Stock");
    this.cartItemCount = this.cartService.getCartItemCount();
    // this.promotionitems = this.cartService.getProducts("allstock", "allstock", "", "Promo");
    console.log("Generate Promo");

    this.getpromotion();
    console.log("Generate Promo Resolved");

    setTimeout(() => {
      this.isLoading = false;
      this.loadingService.loadingDismiss();
      console.log(this.promotionitems);
    }, 1000);
  }

  ionViewWillEnter() {
    console.log("View Will Enter");
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.loadingService.loadingDismiss();
    }, 800);
  }


  async getpromotion() {
    // await this.cartService.generatePromotion();
    this.promotionitems = await this.cartService.getPromotion('', this.searchterm);
    this.promotionTypeList = await this.cartService.getPromotionHeaderListForDropDown();

    // multiple skus to promotion items
    this.multiple_skus = this.cartService.multiple_skus;
    console.log("Multi:" + JSON.stringify(this.multiple_skus));
  }



  private lastY: number = 0;
  // logScrolling(event) {
  //   this.domCtrl.read(() => {

  //     const el = document.querySelector('.segment-wrap');
  //     if (event.detail.scrollTop > this.lastY) {
  //       // console.log(el.clientHeight);
  //       this.domCtrl.write(() => {
  //         // this.renderer.setStyle(el, 'margin-top', `-${el.clientHeight}px`);
  //         // this.renderer.setStyle(el, 'z-index', `4`);

  //       })
  //       // this.showshopdetail = false;
  //     }
  //     else {
  //       this.domCtrl.write(() => {
  //         // this.renderer.setStyle(el, 'margin-top', `0`);
  //         // this.renderer.setStyle(el, 'z-index', `0`);
  //       })

  //       // this.showshopdetail = true;
  //     }
  //     this.lastY = event.detail.scrollTop;
  //   });

  // }
  getRecommend() {
    this.recommend = this.cartService.getRecommendStocks('');
  }


  async multipleSKUs() {
    this.navCtrl.navigateForward(['multiple-skus']);
    // const modal = await this.modalCtrl.create({
    //   component: MultipleSkusPage,
    // });
    // await modal.present();
    // modal.onDidDismiss().then((dataReturned) => {
    // });
  }


  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }

  customPopoverOptions: any = {
    header: 'Select Header',
  };


  async openPopover(ev, p) {
    const popover = await this.popoverCtrl.create({
      component: MerchTaskModalPage,
      cssClass: "taskModal",
      componentProps: {
        status: "order"
      }
    });
    await popover.present();
    var data = await popover.onDidDismiss();
    if (data.role == "backdrop") {
      p.amount = p.amount;
      p.total = Number(p.price) * Number(p.amount);
    }
    else {
      p.amount = data.data;
      p.total = Number(p.price) * Number(p.amount);
    }
    console.log("data>>" + JSON.stringify(data));
  }



  async inputChange(event, product) {
    this.util.disableScroll();

    this.modalCtrl.create({
      'component': CustomAlertInputPage,
      'componentProps': {
        'productdesc': product.desc,
        'qty': product.amount
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
          product.total = Number(product.price) * Number(data.qty);
          product.amount = data.qty;
        }
      })
    });
  }


  inputChangeRe(event, i) {
    event.target.value = (event.target.value.toString().replace(/[^0-9]*/g, ''));
    if (event.target.value == "" || event.target.value == null || event.target.value == undefined) {
      this.recommend[i].total = this.recommend[i].price;
      event.target.value = 1;
    }
    else {
      this.recommend[i].total = this.recommend[i].price * Number(event.target.value);
    }
    return Number(event.target.value);
  }

  checkNetwork() {
    let type = this.networkService.checkNetworkStatus();
    console.log(type);
    if (!type) {
    }
  }
  navigateBack() {
    this.navCtrl.navigateBack(['main']);
  }

  doInfinite(ev) { // Browse All Items
    console.log(this.products.length);
    if (this.slice < this.products.length) {
      setTimeout(() => {
        this.slice += 10;
        this.infiniteScrollBAI.complete();
      }, 100);
    }
    else {
      this.infiniteScrollBAI.disabled = true;
    }
  }

  doInfiniteRe(ev) { // Recommend Stcok
    this.loadmore = true;
    if (this.slicere < this.recommend.length) {
      this.loadmore = false;
      setTimeout(() => {
        this.slicere += 10;
      }, 100);
    }
    else {
      this.loadmore = false;
    }
  }

  getExCart(product) {
    return new Promise(resolve => {

      return { "price": 0, "amount": 0 }
    });
  }

  // calculatePromotion(product) {
  //   /******** Calculate Promotion Item [Service]  */
  //   return new Promise(resolve => {
  //     this.nativeStorage.getItem("checkinShopdata").then(async (shop) => {

  //       //-------get excart [by stock]
  //       // var excart: any = await this.getExCart(product);


  //       const cartdata = await this.cartService.getCart();
  //       const excart = cartdata.filter(el => el.syskey == product.syskey);

  //       console.log("Ex cart == " + JSON.stringify(excart));
  //       var total, amount;
  //       if (excart.length > 0) {
  //         amount = (Number(excart[0].amount) + Number(product.amount));
  //         total = amount * product.price;
  //       }
  //       else {
  //         amount = product.amount;
  //         total = product.total;
  //       }


  //       var param = {
  //         "itemSyskey": product.syskey,
  //         "itemDesc": product.desc,
  //         "itemAmount": product.price,
  //         "itemTotalAmount": total,
  //         "itemQty": amount,
  //         "shopSyskey": shop.shopsyskey
  //       }
  //       this.onlineService.calculatePromotionItems(param).subscribe((val: any) => {
  //         console.log(val);
  //         if (val.status == "Promotion Available") {
  //           product.afterDiscountTotal = val.data.afterDiscountTotal;
  //           product.discountPercent = val.data.discountPercent;
  //           if (val.data.giftList.length > 0) {
  //             val.data.giftList.map(gift => {
  //               if (product.gifts.length > 0) {
  //                 product.gifts.filter(ex => ex.discountItemSyskey == gift.discountItemSyskey).map(matchedgift => {
  //                   matchedgift.discountItemQty = gift.discountItemQty;
  //                 });
  //               } else {
  //                 product.gifts.push(gift);
  //               }
  //             });
  //           }
  //         }
  //         else {
  //           product.gifts = [];
  //           product.afterDiscountTotal = 0;
  //           product.discountPercent = 0;
  //         }

  //         this.cartService.storeGiftsCache(product);


  //         resolve();
  //       }, err => {
  //         resolve();
  //       })
  //     });
  //   });

  // }
  async addToCart(product) {
    product.discountPercent = 0;
    this.loadingService.loadingPresent();

    // if (product.promoItems.length > 0) {
    //   const calculatedData = await this.calculatePromotion(product);
    // }

    this.cartService.addToCart(product, false);
    this.loadingService.loadingDismiss();

  }
  addToCartRe() {
    this.loadingService.loadingPresent();
    let length = this.recommend.length;
    this.recommend.filter((obj, index) => {
      this.cartService.addToCart(obj, true);
      if ((length - 1) == index) {
        setTimeout(() => {
          this.loadingService.loadingDismiss();
        }, 1000);
      }
    });
  }
  increaseCart(product) {
    this.cartService.addProduct(product);
  }
  decreseCart(product) {
    this.cartService.decreaseProduct(product);
  }
  removeItem(index) {
    this.recommend.splice(index, 1);
  }

  goPage(id) {
    if (id == "cart") {
      if (this.cartItemCount.value == 0) {
        this.messageService.showToast("No data in shopping cart");
      }
      else {
        setTimeout(() => {
          this.navCtrl.navigateForward(['cart-item']);
        }, 1000);
      }
    }
  }

  // productTotal() {
  //   for (var i = 0; i < this.products.length; i++) {
  //     this.products[i].total = Number(this.products[i].price) * Number(this.products[i].amount);
  //   }
  // }
  handleImgError(ev: any, item: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";
    source.src = imgSrc;
  }
  toggleSectionPromo() {
    this.proopen = !this.proopen;
  }
  /******** Dropdrown Section */
  toggleSection() {
    // this.slice = 10;
    this.open = !this.open;
    // this.loadingSpinner = true;
    // if (!this.open) {
    //   this.products = [];
    //   this.loadingSpinner = false;
    // }
    // else {
    //   setTimeout(() => {
    //     this.products = this.cartService.getProducts();
    //     setTimeout(() => {
    //       this.loadingSpinner = false;
    //     }, 1000);
    //   }, 100);
    // }
  }
  toggleSectionRS() {
    this.slicere = 10;
    this.rsopen = !this.rsopen;
  }
  proHeaderClick(pH) {
    pH.headeropen = !pH.headeropen;
  }
  categoryClicke(pbc) {
    this.ismultiple = false;
    pbc.categoryOpen = !pbc.categoryOpen;
    setTimeout(() => {
      this.ismultiple = true;
    }, 2000);
  }
  subCategoryClicke(cat) {
    cat.subCategoryOpen = !cat.subCategoryOpen;
  }
  headerClick(index) {
    this.multiple_skus[index].open = !this.multiple_skus[index].open;
  }

  promoToggle(p) {
    p.giftopen = !p.giftopen;
  }
  /******** Dropdrown Section */

  checkCategory() {
    const cat = this.categoryList.filter(el => el.code == this.categorykey);
    if (cat.length > 0) {
      this.categorykey = cat[0].code;
      this.subcategoryList = cat[0].subCategoryList;
      this.subkey = this.subcategoryList[0].code;
    }

  }

  /************ Search Section */
  async searchMe() {
    // this.messageService.showToast("Disabled in this version!")
    this.isLoading = true;
    if (this.hiddenSearch == true) {
      this.headerkey = 0;
      this.hiddenSearch = false;
      this.rsopen = true;
      this.proopen = true;
      this.categoryList = this.cartService.categoryList;
      if (this.categoryList.length > 0) {
        this.categorykey = this.categoryList[0].code;
      }
      await this.selectCategory();
      this.isLoading = false;
    }
    else {
      this.ngOnInit();
    }
  }
  async selectType() {
    if (this.headerkey == 2) {
      if (this.promotionitems.length > 0) {
        this.promoHeaderkey = this.promotionitems[0].HeaderSyskey;
        this.promotionitems = await this.cartService.getPromotion(this.promoHeaderkey, this.searchterm);
      }
    }
  }
  async selectCategory() {
    this.isLoading = true;
    console.log(this.categorykey + '----' + this.subkey);
    this.checkCategory();
    if (this.headerkey == 0) {
      this.products = await this.cartService.getProducts(this.categorykey, this.subkey, this.searchterm, "Stock");
    }
    else if (this.headerkey == 2) {
      // this.promotionitems = await this.cartService.getProducts(this.categorykey, this.subkey, this.searchterm, "Promo");
    }
    this.isLoading = false;
  }
  async selectSubcategory() {
    this.isLoading = true;

    if (this.headerkey == 0) {
      this.products = await this.cartService.getProducts(this.categorykey, this.subkey, this.searchterm, "Stock");
    }
    else if (this.headerkey == 2) {
      // this.promotionitems = await this.cartService.getProducts(this.categorykey, this.subkey, this.searchterm, "Promo");
    }
    this.isLoading = false;
  }
  async selectPromo() {
    console.log(this.promoHeaderkey);
    this.promotionitems = await this.cartService.getPromotion(this.promoHeaderkey, this.searchterm);
  }
  searchQuery() {
    this.isLoading = true;
    this.filteredData();
  }
  async filteredData() {
    let val = this.searchterm;
    if (this.headerkey == 0) {
      if (val == '') {
        this.products = this.cartService.getProducts(this.categorykey, this.subkey, "", "Stock");
      }
      else {
        this.products = this.cartService.getProducts(this.categorykey, this.subkey, this.searchterm, "Stock");
      }
    }
    else if (this.headerkey == 2) {
      this.promotionitems = await this.cartService.getPromotion(this.promoHeaderkey, this.searchterm);
    }
    else {
      this.recommend = this.cartService.getRecommendStocks(this.searchterm);
    }

    this.isLoading = false;
  }
  /************ Search Section */
}
