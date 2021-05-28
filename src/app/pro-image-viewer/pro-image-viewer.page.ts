import { Component, OnInit, Renderer2 } from '@angular/core';
import { ModalController, DomController, NavController } from '@ionic/angular';
import { CartService } from '../services/cart/cart.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MessageService } from '../services/Messages/message.service';
import { filter } from 'rxjs/operators';
import { LoadingService } from '../services/Loadings/loading.service';
import { CustomAlertInputPage } from '../custom-alert-input/custom-alert-input.page';

@Component({
  selector: 'app-pro-image-viewer',
  templateUrl: './pro-image-viewer.page.html',
  styleUrls: ['./pro-image-viewer.page.scss'],
})
export class ProImageViewerPage implements OnInit {
  stock: any;
  syskey: any;
  isLoading: boolean = true;


  constructor(
    private router: Router,
    private cartService: CartService,
    private activateRoute: ActivatedRoute,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private modalCtrl: ModalController,
    private renderer: Renderer2, private domCtrl: DomController, public navCtrl: NavController) { }

  async ngOnInit() {
    this.isLoading = true;
    this.syskey = this.activateRoute.snapshot.paramMap.get('syskey');
    console.log(this.syskey);

    this.stock = await this.cartService.getStock(this.syskey);

    console.log("Stock ->" + JSON.stringify(this.stock));


    // try {
    if (this.stock.length > 0) {
      this.stock = JSON.parse(JSON.stringify(this.stock[0]));

      if (this.stock.multiplePromo) {
        var data;
        data = await this.cartService.getMultipleSKUSPromoByStocksyskey(this.stock.syskey);
        console.log("Multi->" + JSON.stringify(data));
        this.stock.multipleSKUs = data;

        // if (this.stock.multipleSKUs.length > 0) {

        //   // sort by RulePriority and RuleNumber 
        //   this.stock.multipleSKUs.map(header => {

        //     const uniqueKeys = header.DetailList.filter(
        //       (temp => a =>
        //         (k => !temp[k] && (temp[k] = true))(a.multiplePromo.RulePriority + '|' + a.multiplePromo.RuleNumber)
        //       )(Object.create(null))
        //     );

        //     console.log("UniqueKyes:" + JSON.stringify(uniqueKeys));
        //     var promo_rule = [];
        //     uniqueKeys.map((rule, index) => {

        //       promo_rule.push({
        //         rule: header.DetailList.filter(el => el.multiplePromo.RulePriority == rule.multiplePromo.RulePriority && el.multiplePromo.RuleNumber == rule.multiplePromo.RuleNumber)
        //       })

        //       if (uniqueKeys.length == index + 1) {
        //         header.DetailList = promo_rule;
        //       }
        //     });

        //   })
        // }
        // else {
        //   this.stock.isMultipleskus = false;
        // }

      }

      this.stock.isMultipleskus = true;

    }
    else {
      this.stockNotFound();
    }

    this.isLoading = false;

    console.log(this.stock);

    // } catch (error) {

    //   console.log("error ->" + JSON.stringify(error));

    // }

  }

  stockNotFound() {
    this.messageService.showToast("stock not found (or) inactive stock")
    this.isLoading = false;
    this.dismissModal();
  }
  dismissModal() {
    this.navCtrl.back();
  }

  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";
    source.src = imgSrc;
  }
  dateFormat(date) {
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    let val = day + '/' + month + '/' + year;
    return val;
  }
  async multipleSKUs() {
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
    //   if (event.url.toString().includes('multiple-skus')) {
    //     this.navCtrl.back();
    //   }
    //   else {
    //     this.navCtrl.navigateForward(['multiple-skus']);
    //   }
    // })
  }
  promHeaderClick(pro) {
    pro.open = !pro.open;
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
  headerClick(index) {
    this.stock.multipleSKUs[index].open = !this.stock.multipleSKUs[index].open;
  }

  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
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

}
