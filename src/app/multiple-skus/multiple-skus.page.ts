import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonVirtualScroll } from '@ionic/angular';
import { CartService } from '../services/cart/cart.service';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';
import { LoadingService } from '../services/Loadings/loading.service';
import { UtilService } from '../services/util.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { MessageService } from '../services/Messages/message.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ProImageViewerPage } from '../pro-image-viewer/pro-image-viewer.page';

const SELECTOR = 'scroll-fix-example';

@Component({
  selector: 'app-multiple-skus',
  templateUrl: './multiple-skus.page.html',
  styleUrls: ['./multiple-skus.page.scss'],
})
export class MultipleSkusPage implements OnInit {
  isLoading: boolean = true;
  cartItemCount: BehaviorSubject<number>;

  multiple_skus = [];
  private routerSub: Subscription;

  @ViewChild("ordersVirtualScroll", { static: false }) ordersVirtualScroll: IonVirtualScroll;

  constructor(public modalCtrl: ModalController, public cartService: CartService, public loadingService: LoadingService, public util: UtilService,
    public navCtrl: NavController, public messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.multiple_skus = this.cartService.multiple_skus;
    this.cartItemCount = this.cartService.getCartItemCount();
    console.log(this.multiple_skus);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
  ionViewWillEnter() {

  }

  async inputChange(event, product) {
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

  dismissModal() {
    this.navCtrl.back();
  }
  goCart() {
    if (this.cartItemCount.value == 0) {
      this.messageService.showToast("No data in shopping cart");
    }
    else {
      setTimeout(() => {
        this.navCtrl.navigateForward(['cart-item']);
      }, 1000);
    }
  }
  headerClick(index) {
    this.multiple_skus[index].open = !this.multiple_skus[index].open;
  }

  async addToCart(product) {
    this.loadingService.loadingPresent();
    this.cartService.addToCart(product, false);
    this.loadingService.loadingDismiss();
  }
  increaseCart(product) {
    this.cartService.addProduct(product);
  }
  decreseCart(product) {
    this.cartService.decreaseProduct(product);
  }

  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }
}
