import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/Loadings/loading.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { CartService } from '../services/cart/cart.service';
import { NavController, ModalController } from '@ionic/angular';
import { StockImageViewerPage } from '../stock-image-viewer/stock-image-viewer.page';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/Messages/message.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {

  products = [];
  cart = [];
  subcart = [];
  allcart = [];
  shopinfo: any = [];
  returnedproduct: any = [];
  checkinshop: any = [];


  imgurl: any;
  hiddenSearch: any;
  loginData: any;
  returnsubtotal: any;
  returndiscountamount: any;

  ordersubtotal: any;
  orderdiscountamount: any;
  printing: any;
  printerName: any;

  discount: any = 0;
  totaldiscount: any = 0;
  returntotalamount: any = 0;
  ordertotalamount: any = 0;

  orderno: any;
  segment: any;
  btnDisabled: any;
  remark: any;
  printDisabled: any = true;


  isLoading: any = false;
  open: any = false;


  constructor(private loadingService: LoadingService,
    private cartService: CartService,
    private nativeStorage: NativeStorage,
    private util: UtilService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private activateRoute: ActivatedRoute,
    private msgService: MessageService
  ) {

  }

  ngOnInit() {
    this.imgurl = localStorage.getItem('imgurl');
    this.loadingService.loadingPresent();
    this.getData();
  }
  navigateBack() {
    this.navCtrl.back();
  }
  handleImgError(ev: any) {

    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";

    source.src = imgSrc;
  }
  async photoViewer(syskey) {
    this.navCtrl.navigateForward([`pro-image-viewer/${syskey}`]);
  }
  getData() {
    var comment = sessionStorage.getItem('orderdetailcomment');
    if (comment) {
      this.remark = comment;
    }
    else {
      this.remark = "";
    }

    var ordercart = [], returncart = [], promoGifts = [];
    ordercart = this.cartService.getOrderDetailSim();
    returncart = this.cartService.getOrderDetailExp();
    promoGifts = this.cartService.getPromotionGIfts();


    // --------------------- Discount / Amount    -------------[start]
    var orderdiscountamount: any = 0, totaldiscount: any = 0, ordertotalamount: any = 0, returndiscountamount: any = 0, returntotaldiscount: any = 0, returntotalamount: any = 0;


    // Total Amount By Discount
    this.totaldiscount = 100 - Number(this.discount);
    var result1 = this.totaldiscount.toString().includes('.');
    if (result1) {
      this.totaldiscount = this.totaldiscount.toFixed(2);
    }
    // Total Amount By Discount


    // --------------------- Discount / Amount    -------------[end]



    //------------ returned product cart  -------------------[start]
    var returnbrand = [];
    Array.from(new Set(returncart.map(s => s.brandOwnerSyskey))).map(syskey => {
      return returnbrand.push({
        'name': returncart.find(s => s.brandOwnerSyskey === syskey).brandOwnerName,
        'brandOwnerSyskey': syskey,
      });
    });
    this.returnedproduct = [];
    this.returndiscountamount = returncart.reduce((i, j) => i + Number(j.total) * (Number(this.discount) / 100), 0);
    this.returnsubtotal = returncart.reduce((i, j) => i + Number(j.total), 0);


    /*****Return Total amount */
    this.returntotalamount = this.returnsubtotal - this.returndiscountamount;
    var result = (this.returntotalamount).toString().includes('.');
    if (result) {
      this.returntotalamount = this.returntotalamount.toFixed(2);
    }

    returnbrand.filter(obj => {
      const val = returncart.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey);
      const total = returncart.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey).reduce((i, j) => i + Number(j.total), 0);
      this.returnedproduct.push({
        'name': obj.name,
        'brandOwnerSyskey': obj.brandOwnerSyskey,
        'child': val,
        'total': total,
        'open': true
      });
    });
    //------------ returned product cart  -------------------[end]


    //------------ order product cart  -------------------[start]

    if (ordercart.length > 0) {
      var orderbrand = [];
      Array.from(new Set(ordercart.map(s => s.brandOwnerSyskey))).map(syskey => {
        return orderbrand.push({
          'name': ordercart.find(s => s.brandOwnerSyskey == syskey).brandOwnerName,
          'brandOwnerSyskey': syskey
        });
      });
      this.cart = [];
      this.orderdiscountamount = ordercart.reduce((i, j) => i + Number(j.total) * (Number(this.discount) / 100), 0);
      this.ordersubtotal = ordercart.reduce((i, j) => i + Number(j.total), 0);


      /*****Order Total amount */
      this.ordertotalamount = this.ordersubtotal - this.orderdiscountamount;
      var result = (this.ordertotalamount).toString().includes('.');
      if (result) {
        this.ordertotalamount = this.ordertotalamount.toFixed(2);
      }

      orderbrand.filter(obj => {
        const val = ordercart.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey);
        const total = ordercart.filter(el => el.brandOwnerSyskey == obj.brandOwnerSyskey).reduce((i, j) => i + Number(j.total), 0);

        var gifts = promoGifts.find(el => el.brandOwnerSyskey == obj.brandOwnerSyskey).promotionList;
        console.log("Val" + JSON.stringify(val));

        this.cart.push({
          'name': obj.name,
          'brandOwnerSyskey': obj.brandOwnerSyskey,
          'child': val,
          'gifts': gifts,
          'gift': gifts.length > 0 ? true : false,
          'subtotal': this.util.fixedPoint(total),
          'total': this.util.fixedPoint(Number(total) - Number(val[0].n2)),
          'invdisamount': val[0].n2,
          'invdisper': val[0].discount,
          'open': true
        })
      })
      //------------ order product cart  -------------------[end]
      //----------- SHop Info -----
      var id = this.activateRoute.snapshot.paramMap.get('id');
      if (id == 'forordershop') {
        this.nativeStorage.getItem("ordershop").then(res => {
          this.shopinfo = [
            {
              'shop_name': res.shopname,
              'address': res.address,
              'date': this.util.dateFormat(ordercart[0].createddate)
            }
          ]
        });
      }
      else {
        this.nativeStorage.getItem("checkinShopdata").then(res => {
          this.shopinfo = [
            {
              'shop_name': res.shopname,
              'address': res.address,
              'date': this.util.getforShowDate()
            }
          ]
        });
      }
    }
    else {
      this.isLoading = true;
      this.loadingService.loadingDismiss();
      this.msgService.showToast("Order product not found !")
    }




    setTimeout(() => {
      console.log(this.cart);
      this.isLoading = true;
      this.loadingService.loadingDismiss();
    }, 1000);
  }

  toggleSection() {
    this.open = !this.open;

  }
  toggleBrand(index) {
    this.returnedproduct[index].open = !this.returnedproduct[index].open;
  }

  toggleOrder(index) {
    this.cart[index].open = !this.cart[index].open;
  }
}
