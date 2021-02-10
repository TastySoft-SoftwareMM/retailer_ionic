import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/Messages/message.service';
import { NavController } from '@ionic/angular';
import { OfflineService } from '../services/offline/offline.service';
import { UtilService } from '../services/util.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-shoptransfer',
  templateUrl: './shoptransfer.page.html',
  styleUrls: ['./shoptransfer.page.scss'],
})
export class ShoptransferPage implements OnInit {

  shopbyUser: any = [];
  loginData: any;


  constructor(
    public messageService: MessageService,
    public navCtrl: NavController,
    private offlineService: OfflineService,
    private util: UtilService,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    this.nativeStorage.getItem("loginData").then(res => {
      this.loginData = res;
      console.log("loginData -->" + JSON.stringify(this.loginData));
      this.offlineService.getdatasfromShopbyuser(this.util.getTodayDate(), this.loginData.userId).then((shop_res: any) => {
        console.log("shop_res-->" + JSON.stringify(shop_res));
        if (shop_res.rows > 0) {
          for (var qe = 0; qe < shop_res.data.length; qe++) {
            this.shopbyUser.push(
              {
                id: shop_res.data[qe].id,
                address: shop_res.data[qe].address,
                shopsyskey: shop_res.data[qe].shopsyskey,
                shopname: shop_res.data[qe].shopname,
                long: shop_res.data[qe].long,
                phoneno: shop_res.data[qe].phoneno,
                zonecode: shop_res.data[qe].zonecode,
                shopcode: shop_res.data[qe].shopcode,
                teamcode: shop_res.data[qe].teamcode,
                location: shop_res.data[qe].location,
                usercode: shop_res.data[qe].usercode,
                user: shop_res.data[qe].user,
                lat: shop_res.data[qe].lat,
                email: shop_res.data[qe].email,
                username: shop_res.data[qe].username,
                checkinStuats: shop_res.data[qe].status
              }
            );
          }
        } else {
        }
      })
        .catch(shop_err => {
          console.log("shop_err-->" + JSON.stringify(shop_err));
        });
    });
  }
}
