import { Injectable } from '@angular/core';
import { OnlineService } from '../online/online.service';
import { MessageService } from '../Messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  shopbyuser: any = [];

  shopbyteam: any = [];

  constructor(private onlineService: OnlineService,
    private messageService: MessageService) { }

  setShopByUser(data) {
    console.log("SHOPDATA>>" + JSON.stringify(data));
    this.shopbyuser = [];
    if (data.length > 0) {
      data.filter(el => {
        var shopname;
        if (el.shopnamemm == "") {
          shopname = el.shopname;
        }
        else {
          shopname = `${el.shopname} (${el.shopnamemm})`;
        }
        this.shopbyuser.push({
          id: el.shopsyskey,
          address: el.address,
          shopsyskey: el.shopsyskey,
          shopname: shopname,
          long: el.long,
          phoneno: el.phoneno,
          zonecode: el.zonecode,
          shopcode: el.shopcode,
          teamcode: el.teamcode,
          location: el.location,
          usercode: el.usercode,
          user: el.user,
          lat: el.lat,
          email: el.email,
          username: el.username,
          checkinStatus: el.status.currentType,
          task: el.status.task
        });
      });
    }
  }
  getShopByUser() {
    console.log("getshopbyuser>>" + JSON.stringify(this.shopbyuser));
    return this.shopbyuser;
  }
  getShopProfile(syskey) {
    for (var i = 0; i < this.shopbyuser.length; i++) {
      if (this.shopbyuser[i].shopsyskey == syskey) {
        return this.shopbyuser[i];
      }
    }
  }
  getShopTeamProfile(syskey) {
    for (var i = 0; i < this.shopbyteam.length; i++) {
      for (var ii = 0; ii < this.shopbyteam[i].child.length; ii++) {
        if (this.shopbyteam[i].child[ii].shopsyskey == syskey) {
          return this.shopbyteam[i].child[ii];
        }
      }
    }
  }

  setShopByTeam(data) {
    this.shopbyteam = [];
    const teams = Array.from(new Set(data.map(s => s.usercode))).map(syskey => {
      return {
        'name': data.find(s => s.usercode === syskey).username,
        'user': data.find(s => s.usercode === syskey).user,
        'usercode': syskey
      };
    })
    var teamshop;
    teams.filter(tobj => {
      var shop = [];
      var count;
      teamshop = data.filter(el => el.usercode == tobj.usercode);
      count = teamshop.filter(el => el.status.currentType == "CHECKOUT").length;
      console.log("count>>" + count);
      teamshop.filter(el => {
        console.log("start");
        var shopname;
        if (el.shopnamemm == "") {
          shopname = el.shopname;
        }
        else {
          shopname = `${el.shopname} (${el.shopnamemm})`;
        }
        shop.push({
          id: el.shopsyskey,
          address: el.address,
          shopsyskey: el.shopsyskey,
          shopname: shopname,
          long: el.long,
          phoneno: el.phoneno,
          zonecode: el.zonecode,
          shopcode: el.shopcode,
          teamcode: el.teamcode,
          location: el.location,
          usercode: el.usercode,
          user: el.user,
          lat: el.lat,
          email: el.email,
          username: el.username,
          checkinStatus: el.status.currentType,
          task: el.status.task,
        })
      });
      console.log("end" + JSON.stringify(shop));
      this.shopbyteam.push({
        'username': tobj.name,
        'user': tobj.user,
        'usercode': tobj.usercode,
        'shopcountbyteam': count,
        'open': false,
        'child': shop
      });
      console.log("SHOPteam>>" + JSON.stringify(this.shopbyteam));
    })
  }
  getShopByTeam() {
    console.log("getshopbyteam>>" + JSON.stringify(this.shopbyteam));
    return this.shopbyteam;
  }


}
