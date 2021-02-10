import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-checkinshop',
  templateUrl: './checkinshop.component.html',
  styleUrls: ['./checkinshop.component.scss'],
})
export class CheckinshopComponent implements OnInit {
  shop_info: any;
  constructor(private nativeStorage: NativeStorage) { }

  ngOnInit() {
    this.nativeStorage.getItem("checkinShopdata").then((res: any) => {
      this.shop_info = [
        {
          'shop_name': res.shopname,
          'shop_code': res.shopcode,
          'address': res.address,
          'phone': res.phoneno
        }
      ]
    });
  }

}
