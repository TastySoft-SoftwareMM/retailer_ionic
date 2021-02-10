import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { OfflineService } from '../services/offline/offline.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { ShopService } from '../services/shop/shop.service';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.page.html',
  styleUrls: ['./shop-detail.page.scss'],
})
export class ShopDetailPage implements OnInit {
  shopcode: any;
  shop: any;

  isLoading: any = false;
  constructor(private activatedRoute: ActivatedRoute,
    private nativeStorage: NativeStorage,
    private util: UtilService,
    private activateRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private offlineService: OfflineService,
    private shopService: ShopService) {
    this.loadingService.loadingPresent();
    // this.shop = this.nativeStorage.getItem('shopdetail');
    var id = this.activateRoute.snapshot.paramMap.get('id');
    var shopsyskey = this.activateRoute.snapshot.paramMap.get('syskey');
    console.log("shopsyskey>>" + shopsyskey);
    if (id == "usershop") {
      this.shop = this.shopService.getShopProfile(shopsyskey);
    }
    else {
      this.shop = this.shopService.getShopTeamProfile(shopsyskey);
    }
    setTimeout(() => {
      this.isLoading = true;
      this.loadingService.loadingDismiss();
    }, 1000);
    console.log("loginData -->" + JSON.stringify(this.shop));
  }
  ngOnInit() {

  }
  shopDetail() {
  }
}
