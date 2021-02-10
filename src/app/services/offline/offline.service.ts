import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  database: SQLiteObject;
  private databaseReady = new BehaviorSubject<boolean>(false);
  constructor(
    public sqlite: SQLite,
    public platform: Platform
  ) {
    this.Database();
  }
  // -------------------------- Create Database [Start] ---------------------
  Database() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'retailer.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createOrderhdr().then(() => {
          this.databaseReady.next(true);
        });
        this.createOrderbdy().then(() => {
          this.databaseReady.next(true);
        });
        this.createshopUser().then(() => {
          this.databaseReady.next(true);
        });
        this.createshopTeam().then(() => {
          this.databaseReady.next(true);
        });
        this.createInventory().then(() => {
          this.databaseReady.next(true);
        });
        this.createStock().then(() => {
          this.databaseReady.next(true);
        });
        this.createStockDetail().then(() => {
          this.databaseReady.next(true);
        });
        this.createStockImg().then(() => {
          this.databaseReady.next(true);
        });
        this.createMerchandizing().then(() => {
          this.databaseReady.next(true);
        });
        this.createMerchandizingTask().then(() => {
          this.databaseReady.next(true);
        });
        this.createMerchandizingImage().then(() => {
          this.databaseReady.next(true);
        });
      });
    });
  }
  // -------------------------- Create Database [End] -----------------------

  // ------------------------- shopByUser [Start] -----------------------------
  createshopUser() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbshopuser (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            status TEXT,
            is_active TEXT,
            address TEXT,
            shopsyskey TEXT,
            shopname TEXT,
            long TEXT,
            phoneno TEXT,
            zonecode TEXT,
            shopcode TEXT,
            teamcode TEXT,
            location TEXT,
            usercode TEXT,
            user TEXT,
            lat TEXT,
            email TEXT,
            username TEXT,
            n1 TEXT,
            n2 TEXT,
            n3 TEXT,
            n4 TEXT,
            n5 TEXT,
            n6 TEXT,
            n7 TEXT,
            n8 TEXT,
            n9 TEXT,
            n10 TEXT
          );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertshopUser(date, is_active, address, shopsyskey, shopname, long, phoneno, zonecode, shopcode, teamcode, location, usercode, user, lat, email, username, status) {
    let data = [date, is_active, address, shopsyskey, shopname, long, phoneno, zonecode, shopcode, teamcode, location, usercode, user, lat, email, username, status];
    return this.database.executeSql("Insert into R_dbshopuser (date,is_active,address,shopsyskey,shopname,long,phoneno,zonecode,shopcode,teamcode,location,usercode,user,lat,email,username , status) values (? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  updateshopUser(id, is_active, status) {
    return this.database.executeSql("Update R_dbshopuser set status= ? , is_active= ?  where id=?", [status, is_active, id]).then(res => {
      var data = { "status": "success", "data": res };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      })
  }
  deleteShopUser() {
    return this.database.executeSql("DELETE  FROM R_dbshopuser", []).then(resu => {
      return resu;
    });
  }
  getShopUserByIsActive(date, is_active, usercode) {
    console.log("date" + date + " --- " + "is_active" + is_active);
    return this.database.executeSql("SELECT * FROM R_dbshopuser Where date=? And is_active=? And usercode=?", [date, is_active, usercode]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            status: resu.rows.item(i).status,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }
  getdatasfromShopbyuser(date, usercode) {

    return this.database.executeSql("SELECT * FROM R_dbshopuser Where date=? And usercode=?", [date, usercode]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            status: resu.rows.item(i).status,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }
  checkNewShop(date, usercode) {
    return this.database.executeSql("SELECT * FROM R_dbshopuser Where date=? And usercode=?", [date, usercode]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        return param = {
          "status": "have",
        }
      }
      else {
        return param = {
          "status": "new",
        }
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }
  getdatasfromShopbyuserDistinct(date, is_active, usercode) {
    return this.database.executeSql("SELECT DISTINCT usercode,username FROM R_dbshopuser Where date=? And is_active=? And usercode=?", [date, is_active, usercode]).then(resu => {
      // this.database.executeSql("")
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }
  getshopdatabyteam(usercode) {
    return this.database.executeSql("SELECT * FROM R_dbshopteam Where usercode=?", [usercode]).then(resu => {
      // this.database.executeSql("")
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }
  // ------------------------- shopByUser [End]  -----------------------------

  // ------------------------- shopByTeam [Start]  -----------------------------

  createshopTeam() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbshopteam (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            address TEXT,
            date TEXT,
            is_active TEXT,
            shopsyskey TEXT,
            shopname TEXT,
            long TEXT,
            phoneno TEXT,
            zonecode TEXT,
            shopcode TEXT,
            teamcode TEXT,
            location TEXT,
            usercode TEXT,
            user TEXT,
            lat TEXT,
            email TEXT,
            username TEXT,
            n1 TEXT,
            n2 TEXT,
            n3 TEXT,
            n4 TEXT,
            n5 TEXT,
            n6 TEXT,
            n7 TEXT,
            n8 TEXT,
            n9 TEXT,
            n10 TEXT
          );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertshopTeam(date, is_active, address, shopsyskey, shopname, long, phoneno, zonecode, shopcode, teamcode, location, usercode, user, lat, email, username) {
    let data = [date, is_active, address, shopsyskey, shopname, long, phoneno, zonecode, shopcode, teamcode, location, usercode, user, lat, email, username];
    return this.database.executeSql("Insert into R_dbshopteam (date,is_active,address,shopsyskey,shopname,long,phoneno,zonecode,shopcode,teamcode,location,usercode,user,lat,email,username) values (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deleteShopTeam() {
    return this.database.executeSql("DELETE  FROM R_dbshopteam", []).then(resu => {
      return resu;
    });
  }
  getdatasfromShopbyteam(date, is_active, usercode) {
    return this.database.executeSql("SELECT * FROM R_dbshopteam Where date=? And is_active=? And usercode=?", [date, is_active, usercode]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getdatafrombyteamDistinct(date, is_active) {
    return this.database.executeSql("SELECT DISTINCT usercode,username FROM R_dbshopteam Where date=? And is_active=?", [date, is_active]).then(resu => {
      // this.database.executeSql("")
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            address: resu.rows.item(i).address,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopname: resu.rows.item(i).shopname,
            long: resu.rows.item(i).long,
            phoneno: resu.rows.item(i).phoneno,
            zonecode: resu.rows.item(i).zonecode,
            shopcode: resu.rows.item(i).shopcode,
            teamcode: resu.rows.item(i).teamcode,
            location: resu.rows.item(i).location,
            usercode: resu.rows.item(i).usercode,
            user: resu.rows.item(i).user,
            lat: resu.rows.item(i).lat,
            email: resu.rows.item(i).email,
            username: resu.rows.item(i).username
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    })
  }

  // ------------------------- shopByTeam [End]  -----------------------------



  //  -------------------------- order [Start] ----------------------------

  // --- order header [start] ----
  createOrderhdr() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dborderhdr(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        syskey TEXT,
        date TEXT,
        orderno TEXT,
        shopname TEXT,
        shopCode TEXT,
        address TEXT,
        usercode TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }

  insertOrderhdr({ syskey, date, orderno, shopname, shopCode, address, usercode, n1, n2 }) { //n1 for saveStatus && n2 for discount
    let data = [syskey, date, orderno, shopname, shopCode, address, usercode, n1, n2];
    return this.database.executeSql("Insert into R_dborderhdr (syskey,date,orderno,shopname,shopCode,address,usercode,n1,n2) values (?, ?,?, ?,?,?,?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  getOrderHdr(usercode) {
    return this.database.executeSql("SELECT * FROM R_dborderhdr Where usercode=?", [usercode]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).address,
            date: resu.rows.item(i).date,
            orderno: resu.rows.item(i).orderno,
            shopname: resu.rows.item(i).shopname,
            shopCode: resu.rows.item(i).shopCode,
            address: resu.rows.item(i).address,
            userId: resu.rows.item(i).usercode,
            saveStatus: resu.rows.item(i).n1,
            n2: resu.rows.item(i).n2
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }

  getOrderHdrByorderno(orderno) {
    return this.database.executeSql("SELECT * FROM R_dborderhdr Where orderno=?", [orderno]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).address,
            date: resu.rows.item(i).date,
            orderno: resu.rows.item(i).orderno,
            shopname: resu.rows.item(i).shopname,
            shopCode: resu.rows.item(i).shopCode,
            address: resu.rows.item(i).address
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }


  // --- order header [end] ----

  createOrderbdy() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dborderbdy(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        img TEXT,
        orderno TEXT,
        stocksyskey TEXT,
        stockcode TEXT,
        stockname TEXT,
        brandSyskey TEXT,
        brandOwnerSyskey TEXT,
        brandOwnerName TEXT,
        whSyskey TEXT,
        packSizeCode TEXT,
        categoryCode TEXT,
        subCategoryCode TEXT,
        qty TEXT,
        price TEXT,
        brandowner TEXT,
        owner TEXT,
        note TEXT,
        qtystatus TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  //n1 = discount,n2 = orderdiscountamount, n3 = returndiscountamount
  insertOrderbdy({ img, orderno, stocksyskey, stockcode, stockname, brandSyskey, brandOwnerName, brandOwnerSyskey, whSyskey, qty, price, brandowner, owner, note, qtystatus, packSizeCode, categoryCode, subCategoryCode, n1, n2, n3 }) {
    let data = [img, orderno, stocksyskey, stockcode, stockname, brandSyskey, brandOwnerName, brandOwnerSyskey, whSyskey, qty, price, brandowner, owner, note, qtystatus, packSizeCode, categoryCode, subCategoryCode, n1, n2, n3];
    return this.database.executeSql("Insert into R_dborderbdy (img,orderno,stocksyskey,stockcode,stockname,brandSyskey,brandOwnerName,brandOwnerSyskey,whSyskey,qty,price,brandowner,owner,note,qtystatus,packSizeCode,categoryCode,subCategoryCode,n1,n2,n3) values (?,?, ?,?,?, ?, ?,?, ?,?, ?,? ,?,?,?,?,?,?,?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  updateOrderbdy(setorderno, orderno) {
    return this.database.executeSql("Update R_dborderbdy set orderno= ? where orderno=?", [setorderno, orderno]).then(res => {
      var data = { "status": "success", "data": res };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      })
  }
  getOrderBdy(orderno) {
    return this.database.executeSql("SELECT * FROM R_dborderbdy Where orderno=?", [orderno]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            img: resu.rows.item(i).img,
            orderno: resu.rows.item(i).orderno,
            stocksyskey: resu.rows.item(i).stocksyskey,
            desc: resu.rows.item(i).stockname,
            stockcode: resu.rows.item(i).stockcode,
            qty: Number(resu.rows.item(i).qty),
            price: Number(resu.rows.item(i).price),
            brandSyskey: resu.rows.item(i).brandSyskey,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            whSyskey: resu.rows.item(i).whSyskey,
            packSizeCode: resu.rows.item(i).packSizeCode,
            categoryCode: resu.rows.item(i).categoryCode,
            subCategoryCode: resu.rows.item(i).subCategoryCode,
            owner: resu.rows.item(i).owner,
            note: resu.rows.item(i).note,
            qtystatus: resu.rows.item(i).qtystatus,
            discount: resu.rows.item(i).n1,
            orderdiscountamount: resu.rows.item(i).n2,
            returndiscountamount: resu.rows.item(i).n3
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  //----- order body [end] --
  //-----order part of delete ----
  deleteOrderHdr(orderno) {
    return this.database.executeSql("DELETE  FROM R_dborderhdr Where  orderno=?", [orderno]).then(resu => {
      return resu;
    });
  }
  deleteOrderBdy(orderno) {
    return this.database.executeSql("DELETE  FROM R_dborderbdy Where  orderno=?", [orderno]).then(resu => {
      return resu;
    });
  }
  deleteAllOrderHdr() {
    return this.database.executeSql("DELETE  FROM R_dborderhdr", []).then(resu => {
      return resu;
    });
  }
  deleteAllOrderBdy() {
    return this.database.executeSql("DELETE  FROM R_dborderbdy", []).then(resu => {
      return resu;
    });
  }
  //-----order part of delete ----

  //  --------- inventory check -------------
  createInventory() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbinventory(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      stocksyskey TEXT,
      img TEXT,
      stockname TEXT,
      brandname TEXT,
      brandOwnerName TEXT,
      brandOwnerSyskey TEXT,
      whSyskey TEXT,
      count TEXT,
      stockcode TEXT,
      amount TEXT,
      price TEXT,
      expqty TEXT,
      n1 TEXT,
      n2 TEXT,
      n3 TEXT,
      n4 TEXT,
      n5 TEXT,
      n6 TEXT,
      n7 TEXT,
      n8 TEXT,
      n9 TEXT,
      n10 TEXT
    );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertInventory(code, stocksyskey, img, stockname, brandname, brandOwnerName, brandOwnerSyskey, count, price, whSyskey, expqty, amount) {
    let data = [code, stocksyskey, img, stockname, brandname, brandOwnerName, brandOwnerSyskey, count, price, whSyskey, expqty, amount];
    return this.database.executeSql("Insert into R_dbinventory (code,stocksyskey,img, stockname, brandname,brandOwnerName,brandOwnerSyskey, count,price,whSyskey,expqty) values (?,?,?,?,?,?,?,?,?,?,?,?)", data).then(re => {
      var data = { "status": "succe.ss", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deleteInventory() {
    return this.database.executeSql("DELETE  FROM R_dbinventory", []).then(resu => {
      return resu;
    });
  }
  getInventory() {
    return this.database.executeSql("SELECT * FROM R_dbinventory", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            img: resu.rows.item(i).img,
            desc: resu.rows.item(i).stockname,
            code: resu.rows.item(i).code,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            whSyskey: resu.rows.item(i).whSyskey,
            price: Number(resu.rows.item(i).price),
            amount: Number(resu.rows.item(i).amount),
            expqty: Number(resu.rows.item(i).expqty)
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }

  // ------- Brand Owner ------------

  /****** Code [packsize,category,subcategory] ===== Description */
  createStock() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbstock(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        syskey TEXT,
        code TEXT,
        desc TEXT,
        packTypeCode TEXT,
        packSizeCode TEXT,
        floverCode TEXT, 
        brandCode TEXT,
        brandOwnerCode TEXT,
        brandOwnerName TEXT,
        brandOwnerSyskey TEXT,
        whSyskey TEXT,
        vendorCode TEXT, 
        categoryCode TEXT,
        subCategoryCode TEXT,
        categoryDesc TEXT,
        subCategoryDesc TEXT,
        whCode TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  /****** Code [packsize,category,subcategory] ===== Description */
  insertStock(syskey, code, desc, packTypeCode, packSizeCode, floverCode, brandCode, brandOwnerCode, brandOwnerName, brandOwnerSyskey, whSyskey, vendorCode, categoryCode, subCategoryCode, categoryDesc, subCategoryDesc) {
    let data = [syskey, code, desc, packTypeCode, packSizeCode, floverCode, brandCode, brandOwnerCode, brandOwnerName, brandOwnerSyskey, whSyskey, vendorCode, categoryCode, subCategoryCode, categoryDesc, subCategoryDesc];
    return this.database.executeSql("Insert into R_dbstock (syskey, code, desc, packTypeCode, packSizeCode, floverCode, brandCode,brandOwnerCode,brandOwnerName,brandOwnerSyskey,whSyskey,vendorCode,categoryCode,subCategoryCode,categoryDesc,subCategoryDesc) values (?,?, ?, ?, ?, ? ,?, ?, ?, ? ,?,?,?,?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deleteAllstock() {
    return this.database.executeSql("DELETE  FROM R_dbstock", []).then(resu => {
      return resu;
    });
  }

  getBrandOwner() {
    return this.database.executeSql("SELECT * FROM R_dbstock", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).syskey,
            desc: resu.rows.item(i).desc,
            code: resu.rows.item(i).code
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  // return this.database.executeSql("SELECT * FROM R_dbstock a  LEFT JOIN R_dbstockdetail b ON a.code = b.code AND b.uomType='Confirm' , R_dbstockimg c ON a.code = c.code ", []).then(resu => {

  getStockByStockCode(syskey) {
    return this.database.executeSql("SELECT * FROM R_dbstock a  LEFT JOIN R_dbstockdetail b  ON a.code = b.code AND b.uomType='Confirm' , R_dbstockimg c ON a.code = c.code  Where a.syskey=? ", [syskey]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).syskey,
            img: resu.rows.item(i).img,
            desc: resu.rows.item(i).desc,
            code: resu.rows.item(i).code,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            whSyskey: resu.rows.item(i).whSyskey,
            packSizeCode: resu.rows.item(i).packSizeCode,
            categoryCode: resu.rows.item(i).categoryCode,
            subCategoryCode: resu.rows.item(i).subCategoryCode,
            price: Number(resu.rows.item(i).price),
            amount: 1
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }

  getStock() {
    return this.database.executeSql("SELECT * FROM R_dbstock  ", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).syskey,
            desc: resu.rows.item(i).desc,
            payTypeCode: resu.rows.item(i).payTypeCode,
            packSizeCode: resu.rows.item(i).packSizeCode,
            floverCode: resu.rows.item(i).floverCode,
            brandCode: resu.rows.item(i).brandCode,
            brandOwnerCode: resu.rows.item(i).brandOwnerCode,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            vendorCode: resu.rows.item(i).vendorCode,
            categoryCode: resu.rows.item(i).categoryCode,
            whCode: resu.rows.item(i).whCode,
            whSyskey: resu.rows.item(i).whSyskey,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getStocks() {
    return this.database.executeSql(`SELECT * FROM R_dbstock a  LEFT JOIN R_dbstockdetail b ON a.code = b.code AND b.uomType='Confirm' , R_dbstockimg c ON a.code = c.code`, []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        console.log("Resu Stock ==" + JSON.stringify(resu.rows.item));

        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).syskey,
            desc: resu.rows.item(i).desc,
            code: resu.rows.item(i).code,
            img: resu.rows.item(i).img,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            // payTypeCode: resu.rows.item(i).payTypeCode,
            // packSizeCode: resu.rows.item(i).packSizeCode,
            // floverCode: resu.rows.item(i).floverCode,
            // brandCode: resu.rows.item(i).brandCode,
            brandOwnerCode: resu.rows.item(i).brandOwnerCode,
            // brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            // vendorCode: resu.rows.item(i).vendorCode,
            // categoryCode: resu.rows.item(i).categoryCode,
            // whCode: resu.rows.item(i).whCode,
            whSyskey: resu.rows.item(i).whSyskey,
            packSizeCode: resu.rows.item(i).packSizeCode,
            categoryCode: resu.rows.item(i).categoryCode,
            subCategoryCode: resu.rows.item(i).subCategoryCode,
            categoryDesc: resu.rows.item(i).categoryDesc,
            subCategoryDesc: resu.rows.item(i).subCategoryDesc,
            price: Number(resu.rows.item(i).price),
            // uomType: resu.rows.item(i).uomType,
            amount: 1
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  updateStocksId(id, code) {
    return this.database.executeSql("Update R_dbstock set id= ? where code=?", [id, code]).then(res => {
      var data = { "status": "success", "data": res };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      })
  }

  /******** Stock images  *******/
  createStockImg() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbstockimg(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        img TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertStockImg({ code, img }) {
    let data = [code, img];
    return this.database.executeSql("Insert into R_dbstockimg (code,img) values (?, ?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  updateStockImg({ code, img }) {
    return this.database.executeSql("Update R_dbstockimg set img= ? where code=?", [img, code]).then(res => {
      var data = { "status": "success", "data": res };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      })
  }

  getStockImages() {
    return this.database.executeSql("SELECT * FROM R_dbstockimg", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            code: resu.rows.item(i).code,
            img: resu.rows.item(i).img
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }


  // ------- Stocks Owner [detail]------------
  createStockDetail() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbstockdetail(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        u31Syskey TEXT,
        uomSyskey TEXT,
        barcode TEXT,
        price TEXT,
        uomType TEXT,
        priceType TEXT,  
        ratio TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }

  insertStockDetail(code, u31Syskey, uomSyskey, barcode, price, uomType, priceType, ratio) {
    let data = [code, u31Syskey, uomSyskey, barcode, price, uomType, priceType, ratio];
    return this.database.executeSql("Insert into R_dbstockdetail (code, u31Syskey, uomSyskey, barcode, price, uomType, priceType, ratio) values (?, ?, ?, ?, ?, ? ,?, ?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deletStocks() {
    return this.database.executeSql("DELETE  FROM R_dbstockdetail", []).then(resu => {
      return resu;
    });
  }
  getstockdetail() {
    return this.database.executeSql("SELECT * FROM R_dbstockdetail", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            syskey: resu.rows.item(i).syskey,
            desc: resu.rows.item(i).desc,
            payTypeCode: resu.rows.item(i).payTypeCode,
            packSizeCode: resu.rows.item(i).packSizeCode,
            floverCode: resu.rows.item(i).floverCode,
            brandCode: resu.rows.item(i).brandCode,
            brandOwnerCode: resu.rows.item(i).brandOwnerCode,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            brandOwnerSyskey: resu.rows.item(i).brandOwnerSyskey,
            vendorCode: resu.rows.item(i).vendorCode,
            categoryCode: resu.rows.item(i).categoryCode,
            whCode: resu.rows.item(i).whCode,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  //------------------------------------------- Merchandizing [Start] --------------------------------------

  createMerchandizing() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbmerch(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        shopsyskey TEXT,
        shopCode TEXT,
        campaignId TEXT,
        campaignSyskey TEXT,
        brandOwnerCode TEXT,
        brandOwnerName TEXT,
        brandOwnerId TEXT,
        date TEXT,
        status TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertMerchdizing(userId, shopsyskey, shopCode, date, status) {
    let data = [userId, shopsyskey, shopCode, date, status];
    return this.database.executeSql("Insert into R_dbmerch (userId,shopsyskey,shopCode,date,status) values (?,?,?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  updateMerchandizing({ status, shopsyskey }) {
    return this.database.executeSql("Update R_dbmerch set status= ? where shopsyskey=?", [status, shopsyskey]).then(res => {
      var data = { "status": "success", "data": res };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      })
  }
  deleteMerchandizing(syskey) {
    return this.database.executeSql("DELETE  FROM R_dbmerch Where shopsyskey=?", [syskey]).then(resu => {
      return resu;
    });
  }
  getMerchdizingwithID(brandOwnerId, date) {
    var data = [brandOwnerId, date];
    return this.database.executeSql("SELECT * FROM R_dbmerch Where brandOwnerId=? and date=?", data).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            imageName: resu.rows.item(i).imageName,
            filePath: resu.rows.item(i).filePath,
            status: resu.rows.item(i).status,
            date: resu.rows.item(i).date,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  test() {
    return this.database.executeSql("SELECT * FROM R_dbmerch ", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            imageName: resu.rows.item(i).imageName,
            filePath: resu.rows.item(i).filePath,
            status: resu.rows.item(i).status,
            date: resu.rows.item(i).date,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getMerchdizing(userId, date, status) {
    return this.database.executeSql("SELECT * FROM R_dbmerch Where userId=? And date=? And status=?", [userId, date, status]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            campaignId: resu.rows.item(i).campaignId,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            date: resu.rows.item(i).date,
            status: resu.rows.item(i).status,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getMerchandizingByShopCode(shopcode, date, status) {
    return this.database.executeSql("SELECT * FROM R_dbmerch Where shopCode=? And date=? And status=?", [shopcode, date, status]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopsyskey: resu.rows.item(i).shopsyskey,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            campaignId: resu.rows.item(i).campaignId,
            brandOwnerName: resu.rows.item(i).brandOwnerName,
            date: resu.rows.item(i).date,
            status: resu.rows.item(i).status,

          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }

  //-------------------------- Merchandizing [End] -------------------------- 

  //-------------------------- Merchandizing Task [Start] -------------------
  createMerchandizingTask() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbmerchtask(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shopCode TEXT,
        brandOwnerId TEXT,
        taskId TEXT,
        t1 TEXT,
        t2 TEXT,
        t3 TEXT,
        taskCode TEXT,
        taskName TEXT,
        date TEXT,
        status TEXT,
        dir TEXT,
        remark TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertMerchTask(shopCode, brandOwnerId, taskId, t1, t2, t3, taskCode, taskName, date, status, dir, remark) {
    let data = [shopCode, brandOwnerId, taskId, t1, t2, t3, taskCode, taskName, date, status, dir, remark];
    return this.database.executeSql("Insert into R_dbmerchtask (shopCode, brandOwnerId, taskId, t1, t2, t3,taskCode,taskName,date ,status,dir,remark) values (?, ?,?,?,?, ?, ?, ?,?,?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deleteMerchTask(shopCode, brandOwnerId, taskId, date) {
    return this.database.executeSql("DELETE  FROM R_dbmerchtask Where shopCode=? And brandOwnerId=? And taskId=? And date=?", [shopCode, brandOwnerId, taskId, date]).then(resu => {
      return resu;
    });
  }
  getTask() {
    return this.database.executeSql("SELECT * FROM R_dbmerchimage", []).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
            filename: resu.rows.item(i).filename,
            filedata: resu.rows.item(i).filedata,
            onlineimagename: resu.rows.item(i).onlineimagename,
            campaign: resu.rows.item(i).campaign,
            date: resu.rows.item(i).date,
            remark: resu.rows.item(i).remark
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getMerchandizingTask(shopcode, date) {
    return this.database.executeSql("SELECT * FROM R_dbmerchtask Where shopCode=? And date=?", [shopcode, date]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
            t1: resu.rows.item(i).t1,
            t2: resu.rows.item(i).t2,
            t3: resu.rows.item(i).t3,
            taskCode: resu.rows.item(i).taskCode,
            taskName: resu.rows.item(i).taskName,
            status: resu.rows.item(i).status,
            dir: resu.rows.item(i).dir,
            date: resu.rows.item(i).date,
            remark: resu.rows.item(i).remark
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getMerchTask(shopCode, taskId, date) {
    return this.database.executeSql("SELECT * FROM R_dbmerchtask Where shopCode=? And taskId=? And date=?", [shopCode, taskId, date]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
            t1: resu.rows.item(i).t1,
            t2: resu.rows.item(i).t2,
            t3: resu.rows.item(i).t3,
            taskCode: resu.rows.item(i).taskCode,
            taskName: resu.rows.item(i).taskName,
            status: resu.rows.item(i).status,
            dir: resu.rows.item(i).dir,
            date: resu.rows.item(i).date,
            remark: resu.rows.item(i).remark
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getTaskNeedTodo(shopCode, date) {
    return this.database.executeSql("SELECT * FROM R_dbmerchtask Where shopCode=? And date=?", [shopCode, date]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  //-------------------------- Merchandizing Task [End] -------------------


  //-------------------------- Merchandizing Image [Start] -------------------
  createMerchandizingImage() {
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS R_dbmerchimage(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shopCode TEXT,
        brandOwnerId TEXT,
        taskId TEXT,
        filename TEXT,
        filedata TEXT,
        onlineimagename TEXT,
        campaign TEXT,
        date TEXT,
        n1 TEXT,
        n2 TEXT,
        n3 TEXT,
        n4 TEXT,
        n5 TEXT,
        n6 TEXT,
        n7 TEXT,
        n8 TEXT,
        n9 TEXT,
        n10 TEXT
      );`
      , [])
      .catch((err) => console.log("error detected creating tables", err));
  }
  insertMerchImage(shopCode, brandOwnerId, taskId, filename, filedata, onlineimagename, campaign, date) {
    let data = [shopCode, brandOwnerId, taskId, filename, filedata, onlineimagename, campaign, date];
    return this.database.executeSql("Insert into R_dbmerchimage (shopCode, brandOwnerId, taskId,filename, filedata,onlineimagename,campaign,date) values ( ?, ?, ?, ?, ?, ?,?,?)", data).then(re => {
      var data = { "status": "success", "data": re };
      return data;
    })
      .catch(err => {
        var data = { "status": "err", "data": err };
        return data;
      });
  }
  deleteMerchImage(id, date) {
    return this.database.executeSql("DELETE  FROM R_dbmerchimage Where id=? And date=?", [id, date]).then(resu => {
      return resu;
    });
  }
  getMerchImageByTaskID(shopCode, taskId, date) {
    return this.database.executeSql("SELECT * FROM R_dbmerchimage Where shopCode=? And taskId =? And date=?", [shopCode, taskId, date]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
            onlineimagename: resu.rows.item(i).onlineimagename,
            campaign: resu.rows.item(i).campaign,
            date: resu.rows.item(i).date,
            filename: resu.rows.item(i).filename,
            filedata: resu.rows.item(i).filedata
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  getMerchImage(shopCode, date) {
    return this.database.executeSql("SELECT * FROM R_dbmerchimage Where shopCode=?  And date=?", [shopCode, date]).then(resu => {
      let param = {};
      let data = [];
      if (resu.rows.length > 0) {
        for (let i = 0; i < resu.rows.length; i++) {
          data.push({
            id: resu.rows.item(i).id,
            shopCode: resu.rows.item(i).shopCode,
            brandOwnerId: resu.rows.item(i).brandOwnerId,
            taskId: resu.rows.item(i).taskId,
            filename: resu.rows.item(i).filename,
            // filedata: resu.rows.item(i).filedata,
            onlineimagename: resu.rows.item(i).onlineimagename,
            campaign: resu.rows.item(i).campaign,
            date: resu.rows.item(i).date,
          });
        }
      }
      return param = {
        "data": data,
        "rows": resu.rows.length
      }
    }, err => {
      console.log("Error: ", err);
      return { "err": err };
    });
  }
  //-------------------------- Merchandizing Image [End] -------------------


  // _--------------------- Merchandizing Session Clean -----------------
  cleanMerchandizing() {
    return this.database.executeSql("DELETE  FROM R_dbmerch", []).then(resu => {
      return resu;
    });
  }
  cleanMerchTask() {
    return this.database.executeSql("DELETE  FROM R_dbmerchtask", []).then(resu => {
      return resu;
    });
  }
  cleanMerchImage() {
    return this.database.executeSql("DELETE  FROM R_dbmerchimage", []).then(resu => {
      return resu;
    });
  }
}
