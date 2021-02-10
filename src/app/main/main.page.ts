import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { AlertController, ModalController, NavController, MenuController, LoadingController, DomController } from '@ionic/angular';
import { CheckinPage } from '../checkin/checkin.page';
import { OfflineService } from '../services/offline/offline.service';
import { MessageService } from '../services/Messages/message.service';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../services/cart/cart.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../services/util.service';
import { OnlineService } from '../services/online/online.service';
import { DataService } from '../services/data.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { NetworkService } from '../services/network/network.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../services/Loadings/loading.service';
import { ShopmodalPage } from '../shopmodal/shopmodal.page';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { PrinterService } from '../services/printer/printer.service';
import { InventoryService } from '../services/inventory/inventory.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ShopService } from '../services/shop/shop.service';
import { MerchandizingService } from '../services/merchandizing/merchandizing.service';
import { async } from '@angular/core/testing';
import { VariableAst } from '@angular/compiler';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

declare var cordova: any;
@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss']
})

export class MainPage implements OnInit {
    checkinShopdata: any;
    loginData: any;
    checkinandoutStatus: any;
    searchterm: any = "";

    merchandizing: any = false;
    storeowner: any = false;
    checkout: any = false;
    open: any = true;
    isLoading: any = false;
    hiddenSearch: any = true;

    shopbyUser: any = [];
    shopcountbyUser: any = 0;
    shopbyTeam: any = [];
    cart: any = [];

    selectshop: any;
    invoicecompleted: any;
    skiporder: any;
    skiporderDisabled: any = false;
    profile: any;
    cartItemCount: BehaviorSubject<number>;
    cartItemCountOrderDetail: BehaviorSubject<number>;
    checkstep: any = {};
    shopDatalength: any;

    countofmerchandizing = {
        'donecount': "0",
        'total': "0"
    }
    countofmerchandizingLoading: any = false;


    /** Merchandizing Upload */
    param: any = this.getParam();

    constructor(
        private printerService: PrinterService,
        private base64: Base64,
        private file: File,
        private onlineService: OnlineService,
        private nativeStorage: NativeStorage,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        public offlineService: OfflineService,
        public navCtrl: NavController,
        public messageService: MessageService,
        private menu: MenuController,
        private cartService: CartService,
        public util: UtilService,
        private dataTransfer: DatatransferService,
        private merchandizingService: MerchandizingService,
        private networkService: NetworkService,
        private activateRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private loadingController: LoadingController,
        private inventoryService: InventoryService,
        private geolocation: Geolocation,
        private shopService: ShopService,
        private renderer: Renderer2,
        private backgroundmode: BackgroundMode,
        private domCtrl: DomController,
        private locationAccuracy: LocationAccuracy,
    ) {
    }

    async ngOnInit() {

        console.log("Init");
        await this.getLoginData();
        console.log("Init resolved");
        this.getAllDataforMain("");
        this.cartItemCount = this.cartService.getCartItemCount();
        this.cartItemCountOrderDetail = this.cartService.getCartItemCountOrderDetail();
        this.getProfile();

    }
    async ionViewWillEnter() {
        this.countofmerchandizingLoading = true;

        //------------- Login Data   [start] ------------------/
        console.log("willenter");
        await this.getLoginData();
        console.log("willenter resolved");

        //------------- Login Data   [end] ------------------/

        this.invoicecompleted = sessionStorage.getItem("Invoicecompleted");
        this.checkInandout();
        if (sessionStorage.getItem('routestatus') == "ordersubmit") {  // for route from order submit && shop transfer reload data
            this.menu.close('first');

            // this.loadingService.loadingPresent();
            this.isLoading = true;
            var shopParams = {
                "spsyskey": this.loginData.syskey,
                "teamsyskey": this.loginData.teamSyskey,
                "usertype": this.loginData.userType,
                "date": this.util.getTodayDate()
            };

            this.shopbyTeam = [];
            this.shopbyUser = [];

            this.onlineService.getShopall(shopParams).subscribe(data_1 => {
                var shopArray: any
                shopArray = data_1;
                console.log("-->" + JSON.stringify(shopArray));
                this.shopService.setShopByUser(shopArray.data.shopsByUser);
                this.shopService.setShopByTeam(shopArray.data.shopsByTeam);
                setTimeout(() => {
                    console.log("ordersubmit");
                    this.shopbyUser = [];
                    this.checkout = false;
                    this.getAllDataforMain("");
                }, 100);
            }, err => {
                console.log("err>>" + JSON.stringify(err));
                // this.loadingService.loadingDismiss();
                this.isLoading = false;
            });
        }
        else {
            //------------- Check price zone update from orderlist   [start] ------------------/
            if (this.cartService.pricezone.length > 0 && this.checkout == true) {
                if (this.cartService.pricezone[0].shopSyskey != this.checkinShopdata.shopsyskey) {
                    // Price Zone
                    this.isLoading = true;
                    const pricezone = await this.cartService.downloadPricezone(this.checkinShopdata.shopsyskey);
                    this.isLoading = false;
                }
            }

            console.log('...');

            this.loadingService.loadingDismiss();
            this.countofmerchandizingLoading = false;
        }
    }

    async getLoginData() {
        return new Promise(resolve => {
            /**** Login Data */
            this.nativeStorage.getItem("loginData").then(res => {
                this.loginData = res;
                if (this.loginData.merchandizer == "Yes") {
                    this.merchandizing = true;
                } else {
                    this.merchandizing = false;
                }
                if (this.loginData.userType == "storeowner") {
                    this.storeowner = true;
                } else {
                    this.storeowner = false;
                }
                resolve();
            }, err => {
                resolve();
            });
        });
    }
    closeSearchfun() {
        this.hiddenSearch = true;
        this.isLoading = true;
        this.shopbyUser = this.shopService.getShopByUser();
        this.shopbyTeam = this.shopService.getShopByTeam();
        if (this.searchterm.toString().length > 0) {
            setTimeout(() => {
                this.isLoading = false;
                this.searchterm = "";
            }, 1000);
        }
        else {
            this.isLoading = false;
        }
    }


    searchQuery() {
        this.isLoading = true;
        this.open = true;
        var val = this.searchterm;


        /*****
         * ---------------- Shop By User
         * [start]
         */

        var shopbyUser = this.shopService.getShopByUser();
        if (val !== "" || val !== null || val !== undefined) {

            //  Search with shopname
            this.shopbyUser = shopbyUser.filter((item) => {
                return (item.shopname.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
            });

            //  Search with phoneno
            if (this.shopbyUser.length == 0) {
                this.shopbyUser = shopbyUser.filter((item) => {
                    return (item.phoneno.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
                });
            }

            console.log("Shop by User ==" + JSON.stringify(this.shopbyUser));

        }
        else {
            this.shopbyUser = shopbyUser;
        }
        /*****
         * -------------------- Shop By User
         * [end]
         */



        /*****
         * ----------------------- Shop By Team
         * [start]
         */
        var shopbyTeam = this.shopService.getShopByTeam();
        if (val !== "" || val !== null || val !== undefined) {

            this.shopbyTeam = shopbyTeam.map((item) => {
                const data = { ...item }; let status = true; //  true ? shopname (ary)  : phone no (ary)

                //Search with shopname
                data.child = data.child.filter((ch) => {
                    return (ch.shopname.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
                });


                // Search with phoneno
                const data1 = { ...item };
                if (data.child.length == 0) {
                    status = false;
                    data1.child = data1.child.filter((ch) => {
                        return (ch.phoneno.toString().toLowerCase().indexOf(val.toString().toLowerCase()) > -1);
                    });

                    if (data1.child.length > 0) {
                        data1.open = false;
                    }
                }
                else {
                    data.open = false;
                }

                if (status) {
                    return data;
                }
                else {
                    return data1;
                }
            });
        }
        else {
            this.shopbyTeam = shopbyTeam;
        }
        /*****
         * ----------------------- Shop By Team
         * [end]
         */

        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }

    checkNetwork() {
        this.networkService.checkNetworkStatus();
    }
    goToSyncPage() {
        this.navCtrl.navigateRoot(['data']);
    }
    getProfile() {
        if (sessionStorage.getItem("loginData"))
            this.profile = JSON.parse(sessionStorage.getItem("loginData"));
    }
    async selectShop(shops) {
        sessionStorage.removeItem("Invoicecompleted");
        sessionStorage.removeItem("ordercomment");
        this.cartService.clearCartItemCountOrderDetail();
        this.invoicecompleted = "false";
        var shop = shops;
        if (this.checkout == false) {
            if (shop.checkinStatus == "CHECKIN" || shop.checkinStatus == "STORECLOSED" || shop.checkinStatus == "" || shop.checkinStatus == "TEMPCHECKOUT") {
                this.selectshop = shop;
                if (shop.task.orderPlacement == "INCOMPLETE" || shop.task.orderPlacement == "PASS") {
                    if (shop.task.orderPlacement == "PASS") {
                        this.skiporder = true;
                    }
                    else {
                        this.skiporder = false;
                    }
                }
                else {
                    this.skiporder = false;
                }
                const modal = await this.modalCtrl.create({
                    component: CheckinPage,
                    cssClass: 'modalStyle',
                    componentProps: {
                        address: this.selectshop.address,
                        shopName: this.selectshop.shopname,
                        shopsyskey: this.selectshop.shopsyskey,
                        currentType: shop.checkinStatus,
                        task: shop.task
                    }
                });
                await modal.present();
                var data: any;
                data = await modal.onDidDismiss();
                console.log("data.data.status" + JSON.stringify(data));

                if (data.data) {
                    if (data.data.status == 'storeclosed') {
                        for (var w = 0; w < this.shopbyUser.length; w++) {
                            if (this.shopbyUser[w].shopsyskey == data.data.shop.shopsyskey) {
                                this.shopbyUser[w].checkinStatus = "STORECLOSED";

                                let defaultresp = {
                                    coords: {
                                        latitude: 16.91464,
                                        longitude: 96.14268
                                    }
                                }

                                this.locationAccuracy.canRequest().then((canRequest: any) => {
                                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                        () => {
                                            console.log('Request successful');
                                            this.geolocation.getCurrentPosition({ timeout: 40000 }).then((resp) => {
                                                this.storeClesedGetData(resp, data, shop);
                                            }).catch((error) => {
                                                //Getting Location Error => Setup Default Location
                                                this.storeClesedGetData(defaultresp, data, shop);
                                            });
                                        },
                                        error => {
                                            console.log('Error requesting location permissions', error)
                                            this.storeClesedGetData(defaultresp, data, shop);
                                        }
                                    );
                                }, err => {
                                    this.storeClesedGetData(defaultresp, data, shop);
                                });
                            }
                        }
                    }
                    else {
                        var datas: any;
                        this.nativeStorage.getItem("checkinShopdata").then(res => {
                            if (res !== null || res !== undefined) {
                                datas = res;
                                var data: any = {
                                    "checkin": "true",
                                    "inventorycheck": shop.task.inventoryCheck,
                                    "merchandizing": shop.task.merchandizing,
                                    "orderplacement": shop.task.orderPlacement,
                                    "date": this.util.getTodayDate()
                                };
                                this.nativeStorage.setItem("checkSteps", data);
                                for (var w = 0; w < this.shopbyUser.length; w++) {
                                    if (this.shopbyUser[w].shopcode == datas.shopcode) {
                                        this.shopbyUser[w].checkinStatus = "CHECKIN";
                                        setTimeout(() => {
                                            this.checkout = true;
                                            this.hiddenSearch = true;
                                        }, 1000);
                                    }
                                }
                                this.checkInandout();
                            }
                        });
                    }
                }
            }
            else {
                if (shop.checkinStatus == "CHECKOUT") {
                    if (shop.task.orderPlacement == "PASS") {
                        this.skiporder = true;
                    }
                    else {
                        this.skiporder = false;
                    }

                    this.loadingService.loadingPresent();
                    var param = {
                        'shopcode': shop.shopcode,
                        'date': this.util.getTodayDate(),
                        'trantype': 'SalesOrder',
                        'usersyskey': this.loginData.syskey
                    };
                    this.onlineService.getOrderList(param).subscribe((res: any) => {
                        console.log("RES>>" + JSON.stringify(res));
                        if (res.status == "SUCCESS!") {
                            var data: any = {
                                "checkin": "true",
                                "inventorycheck": shop.task.inventoryCheck,
                                "merchandizing": shop.task.merchandizing,
                                "orderplacement": shop.task.orderPlacement,
                                "date": this.util.getTodayDate()
                            };
                            this.nativeStorage.setItem("checkSteps", data);
                            this.nativeStorage.setItem("checkinShopdata", shop);
                            sessionStorage.setItem("Invoicecompleted", "true");
                            this.invoicecompleted = "true";
                            this.cartService.addOrderDetail(res.list, "checkinorder");
                            setTimeout(() => {
                                this.loadingService.loadingDismiss();
                                const check = {
                                    checkin: 'In',
                                    date: this.util.getTodayDate()
                                }
                                this.checkout = true;
                                this.hiddenSearch = true;
                                sessionStorage.setItem("checkin", JSON.stringify(check));
                            }, 1000);
                        }
                        else {
                            this.loadingService.loadingDismiss();
                            this.messageService.showToast("Something wrong!");
                        }

                        this.checkInandout();
                    }, err => {
                        this.loadingService.loadingDismiss();
                        this.messageService.showNetworkToast(err);
                    });
                }
            }
        }
    }

    //Checking Location
    storeClesedGetData(resp, data, shop) {
        var params = {
            "lat": resp.coords.latitude,
            "lon": resp.coords.longitude,
            "address": data.data.shop.address,
            "shopsyskey": data.data.shop.shopsyskey,
            "usersyskey": this.loginData.syskey,
            "checkInType": "STORECLOSED",
            "register": false,
            "task": {
                "inventoryCheck": shop.task.inventoryCheck,
                "merchandizing": shop.task.merchandizing,
                "orderPlacement": shop.task.orderPlacement,
                "print": "INCOMPLETE"
            }
        }
        this.onlineService.checkIn(params).subscribe((res: any) => {
            this.checkInandout();
        }, err => {
            this.checkInandout();
        });
    }
    async workData_1(data) {
        await this.workSteps();
        if (data == "checkin") {
            if (this.checkout == false) {
                if (this.shopbyUser.length == 0) {
                    this.messageService.showToast("Need shop datas");
                } else {
                    this.messageService.showToast("Select shop");
                }
            }
            else { //checkout

            }
        } else if (data == "inventorycheck") {
            this.inventoryCheckClick();
        } else if (data == "orderPlacement") {
            this.orderPlacementClick();
        } else if (data == "print") {
        } else {
            this.merchandizingClick();
        }
    }

    /***
     * Inventory Check card #Session  ------ [start]
     */
    inventoryCheckClick() {
        this.checkInandout();
        this.inventoryService.clearDataInventory();
        setTimeout(() => {
            // if (this.checkstep.checkin == "true"){
            this.loadingService.loadingPresent();
            var params;
            if (this.checkstep.inventorycheck == "COMPLETED") {
                sessionStorage.setItem('Inventory', 'inventorylist');
                params = {
                    "shopSyskey": this.checkinShopdata.shopsyskey,
                    "userSyskey": this.loginData.syskey,
                    "date": this.util.getTodayDate()
                }
                this.onlineService.getInventoryList(params).subscribe((res: any) => {
                    console.log("Inventorylist>>" + JSON.stringify(res));
                    this.dataTransfer.setData(res.inventoryList);
                    var inventorycheck;
                    if (this.checkstep.inventorycheck == "COMPLETED") {
                        inventorycheck = "COMPLETED";
                    }
                    else {
                        inventorycheck = "PENDING";
                    }
                    var data: any = {
                        "checkin": "true",
                        "inventorycheck": inventorycheck,
                        "merchandizing": this.checkstep.merchandizing,
                        "orderplacement": this.checkstep.orderplacement,
                        "date": this.util.getTodayDate(),
                        "userid": this.loginData.userId
                    };
                    this.nativeStorage.setItem("checkSteps", data);
                    this.checkstep = data;


                    var param;
                    /*********** Store Owner  *****************/
                    if (this.loginData.userType == "storeowner") {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": inventorycheck,
                                "orderPlacement": this.checkstep.orderplacement,
                            }
                        }
                    }
                    else {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": inventorycheck,
                                "merchandizing": this.checkstep.merchandizing,
                                "orderPlacement": this.checkstep.orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                    }


                    if (this.checkinShopdata.checkinStatus == "CHECKOUT") {
                        this.loadingService.loadingDismiss();
                        this.navCtrl.navigateForward(['inventorycheck-view']);
                    }
                    else {
                        console.log("Param === ", JSON.stringify(param));
                        if (this.checkstep.inventorycheck == 'INCOMPLETE') {
                            this.onlineService.setTask(param).subscribe(((val: any) => {
                                if (val.status == 'SUCCESS') {
                                    this.loadingService.loadingDismiss();
                                    setTimeout(() => {
                                        this.navCtrl.navigateForward(['inventorycheck']);
                                    }, 100);
                                }
                                else {
                                    this.loadingService.loadingDismiss();
                                    this.messageService.showToast("Something wrong!.");
                                }
                            }), err => {
                                this.loadingService.loadingDismiss();
                                this.messageService.showNetworkToast(err);
                            });
                        }
                        else {
                            this.loadingService.loadingDismiss();
                            setTimeout(() => {
                                this.navCtrl.navigateForward(['inventorycheck']);
                            }, 100);
                        }
                    }
                }, err => {
                    console.log("err>>" + JSON.stringify(err));
                    this.messageService.showNetworkToast(err);
                    this.loadingService.loadingDismiss();
                });
            }
            else {
                sessionStorage.setItem('Inventory', 'smartlist');
                params = {
                    "shopsyskey": this.checkinShopdata.shopsyskey,
                }
                this.onlineService.getInventory(params).subscribe((res: any) => {
                    console.log("Getsmartlist>>" + JSON.stringify(res));

                    this.dataTransfer.setData(res.list);
                    var inventorycheck;
                    if (this.checkstep.inventorycheck == "COMPLETED") {
                        inventorycheck = "COMPLETED";
                    }
                    else {
                        inventorycheck = "PENDING";
                    }

                    var param;
                    /*********** Store Owner  *****************/
                    if (this.loginData.userType == "storeowner") {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": inventorycheck,
                                "orderPlacement": this.checkstep.orderplacement,
                            }
                        }
                    }
                    else {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": inventorycheck,
                                "merchandizing": this.checkstep.merchandizing,
                                "orderPlacement": this.checkstep.orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                    }
                    console.log("Checkstep ==" + JSON.stringify(this.checkstep));
                    if (this.checkstep.inventorycheck == 'INCOMPLETE') {
                        this.onlineService.setTask(param).subscribe(((val: any) => {
                            if (val.status == 'SUCCESS') {
                                this.loadingService.loadingDismiss();
                                setTimeout(() => {
                                    this.navCtrl.navigateForward(['inventorycheck']);
                                }, 100);
                            }
                            else {
                                this.loadingService.loadingDismiss();
                                this.messageService.showToast("Something wrong!.");
                            }
                        }), err => {
                            this.loadingService.loadingDismiss();
                            this.messageService.showNetworkToast(err);

                        });
                    }
                    else {
                        this.loadingService.loadingDismiss();
                        setTimeout(() => {
                            this.navCtrl.navigateForward(['inventorycheck']);
                        }, 100);
                    }
                    /****CHeckstep => line 484 presents */
                    var data: any = {
                        "checkin": "true",
                        "inventorycheck": inventorycheck,
                        "merchandizing": this.checkstep.merchandizing,
                        "orderplacement": this.checkstep.orderplacement,
                        "date": this.util.getTodayDate(),
                        "userid": this.loginData.userId
                    };
                    this.nativeStorage.setItem("checkSteps", data);
                    this.checkstep = data;
                    /**** */
                }, err => {
                    console.log("err>>" + JSON.stringify(err));
                    this.loadingService.loadingDismiss();
                    this.messageService.showNetworkToast(err);

                });
            }
            // } else {
            //   this.messageService.showToast("Need to do 1.Check In");
            //   console.log("12-->" + "Testing");
            // }
        }, 100);
    }
    /***
     * Inventory Check card #Session ------- [end]
     */



    /***
     * Order Placement  card #Session  ------ [start]
     */
    orderPlacementClick() {
        if (this.checkinShopdata.checkinStatus == "CHECKOUT") {
            this.messageService.showToast("Completed visit");
        }
        else if (this.skiporder) {
            console.log("Skip order === " + this.skiporder);
            sessionStorage.setItem('skiporder', 'true');
            this.navCtrl.navigateForward(['cart-item']);
        }
        else {
            this.checkInandout();
            setTimeout(async () => {
                sessionStorage.removeItem("skiporder");
                if (this.merchandizing == false) {
                    // if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "COMPLETED" || this.checkstep.inventorycheck == "PENDING")) {
                    this.loadingService.loadingPresent();
                    var orderplacement;
                    if (this.checkstep.orderplacement == "COMPLETED") {
                        orderplacement = "COMPLETED";
                    }
                    else {
                        orderplacement = "PENDING";
                    }
                    var data: any = {
                        "checkin": "true",
                        "inventorycheck": this.checkstep.inventorycheck,
                        "merchandizing": this.checkstep.merchandizing,
                        "orderplacement": orderplacement,
                        "date": this.util.getTodayDate(),
                        "userid": this.loginData.userId
                    };
                    this.nativeStorage.setItem("checkSteps", data);
                    var param;
                    /*********** Store Owner  *****************/
                    if (this.loginData.userType == "storeowner") {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "orderPlacement": orderplacement,
                            }
                        }
                    }
                    else {
                        param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "merchandizing": this.checkstep.merchandizing,
                                "orderPlacement": orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                    }
                    console.log("Checkstep == " + JSON.stringify(this.checkstep));
                    if (this.checkstep.orderplacement == 'INCOMPLETE') {
                        this.onlineService.setTask(param).subscribe((async (val: any) => {
                            console.log("settask>>" + JSON.stringify(val));
                            if (val.status == 'SUCCESS') {
                                console.log("recommend");
                                await this.cartService.setRecommendStock();
                                console.log("recommend resolved");
                                this.loadingService.loadingDismiss();
                                this.navCtrl.navigateForward(['order-placement']);
                            }
                            else {
                                this.messageService.showToast("Something wrong!.");
                            }
                        }), err => {
                            this.loadingService.loadingDismiss();
                            this.messageService.showNetworkToast(err);
                        });
                    }
                    else {
                        console.log("recommend");
                        await this.cartService.setRecommendStock();
                        console.log("recommend resolved");
                        this.loadingService.loadingDismiss();
                        this.navCtrl.navigateForward(['order-placement']);
                    }

                    // }
                    // else if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "INCOMPLETE")) {
                    //   this.messageService.showToast("Need to do  2.Inventory Check");
                    // }
                    // else {
                    //   this.messageService.showToast("Need to do 1.Check In and 2.Inventory Check");
                    // }
                }
                else {
                    // if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "COMPLETED" || this.checkstep.inventorycheck == "PENDING") && (this.checkstep.merchandizing == "COMPLETED" || this.checkstep.merchandizing == "PENDING")) {
                    this.loadingService.loadingPresent();
                    var orderplacement;
                    if (this.checkstep.orderplacement == "COMPLETED") {
                        orderplacement = "COMPLETED";
                    }
                    else {
                        orderplacement = "PENDING";
                    }



                    var settask;
                    // Store Owner 
                    if (this.loginData.userType == "storeowner") {
                        settask = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "orderPlacement": orderplacement,
                            }
                        }
                    }
                    else {
                        settask = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "merchandizing": this.checkstep.merchandizing,
                                "orderPlacement": orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                    }
                    console.log("Check step ==" + JSON.stringify(this.checkstep));
                    if (this.checkstep.orderplacement == 'INCOMPLETE') {
                        this.onlineService.setTask(settask).subscribe((async (val: any) => {
                            if (val.status == 'SUCCESS') {
                                console.log("recommend");
                                await this.cartService.setRecommendStock();
                                console.log("recommend resolved");

                                console.log("promo");
                                await this.cartService.getPromotionItmes(this.checkinShopdata.shopsyskey);
                                console.log("promo resolved");

                                console.log("multi skus");
                                await this.cartService.downloadMultipleSKUs(this.checkinShopdata.shopsyskey);
                                console.log("multi skus resolved");



                                this.navCtrl.navigateForward(['order-placement']);
                            }
                            else {
                                this.messageService.showToast("Something wrong!.");
                            }
                            this.loadingService.loadingDismiss();
                        }), err => {
                            this.loadingService.loadingDismiss();
                            this.messageService.showNetworkToast(err);
                        });
                    }
                    else {
                        console.log("recommend");
                        await this.cartService.setRecommendStock();
                        console.log("recommend resolved");


                        console.log("promo");
                        await this.cartService.getPromotionItmes(this.checkinShopdata.shopsyskey);
                        console.log("promo resolved");


                        console.log("multi skus");
                        await this.cartService.downloadMultipleSKUs(this.checkinShopdata.shopsyskey);
                        console.log("multi skus resolved");

                        this.navCtrl.navigateForward(['order-placement']);
                        this.loadingService.loadingDismiss();
                    }


                    /*** Checkstep => line 653 present */
                    var data: any = {
                        "checkin": "true",
                        "inventorycheck": this.checkstep.inventorycheck,
                        "merchandizing": this.checkstep.merchandizing,
                        "orderplacement": orderplacement,
                        "date": this.util.getTodayDate(),
                        "userid": this.loginData.userId
                    };
                    this.nativeStorage.setItem("checkSteps", data);
                    this.checkstep = data;


                    // this.navCtrl.navigateForward(['order-placement-update']);
                    // } 
                    // else if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "INCOMPLETE")) {
                    //   this.messageService.showToast("Need to do 2.Inventory Check 3.Merchandizing");
                    // }
                    // else if ((this.checkstep.inventorycheck == "COMPLETED" || this.checkstep.inventorycheck == "PENDING") && (this.checkstep.merchandizing == "INCOMPLETE")) {
                    //   this.messageService.showToast("Need to do  3.Merchandizing");
                    // }
                    // else {
                    //   this.messageService.showToast("Need to do 1.Check In and 2.Inventory Check 3.Merchandizing");
                    // }
                }
            }, 100);
        }
    }
    /***
    * Order Placement  card #Session  ------ [end]
    */


    /***
     * Merchandizing  card #Session  ------ [start]
     */
    merchandizingClick() {
        /*** Card Merchandizing */
        this.loadingService.loadingPresent();
        this.checkInandout();
        setTimeout(() => {
            // if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "INCOMPLETE")) {
            //   this.loadingService.loadingDismiss();
            //   this.messageService.showToast("Need to do 2.Inventory Check");
            // } else if (this.checkstep.checkin == "false" && (this.checkstep.inventorycheck == "INCOMPLETE")) {
            //   this.loadingService.loadingDismiss();
            //   this.messageService.showToast("Need to do 1.Check In and 2.Inventory Check");
            // }
            // else {
            // if (this.checkstep.checkin == "true" && (this.checkstep.inventorycheck == "COMPLETED" || this.checkstep.inventorycheck == "PENDING")) {
            console.log("checkinshop>>" + JSON.stringify(this.checkinShopdata));
            //Check shop => uploaded status
            this.offlineService.getMerchandizingByShopCode(this.checkinShopdata.shopcode, this.util.getTodayDate(), "saved").then((mer: any) => {
                console.log("Mer ==" + JSON.stringify(mer));
                if (mer.data.length > 0) {
                    sessionStorage.setItem("MerchandizingViewOnly", "true");
                }
                else {
                    /**************** check upload merchandizing [online] *****************/
                    sessionStorage.setItem("MerchandizingViewOnly", "false");
                }
                var param = {
                    "shopSyskey": this.checkinShopdata.shopsyskey,
                    "userSyskey": this.loginData.syskey,
                    "date": this.util.getTodayDate()
                };
                console.log("Merchview == " + JSON.stringify(param));
                this.onlineService.getMerchandizingView(param).subscribe((res_1: any) => {
                    console.log("Res_1 ==" + JSON.stringify(res_1));
                    for (var i = 0; i < res_1.list.length; i++) {
                        this.merchandizingService.setMerchandizingView(res_1.list[i].mc002);
                    }
                    // this.loadingService.loadingDismiss();
                    // this.navCtrl.navigateForward(['merchandizing-view']);
                }, err => {
                    console.log(" err_==" + JSON.stringify(err));
                });


                var merchparams = {
                    "shopSysKey": this.checkinShopdata.shopsyskey,
                    "userType": this.loginData.userType
                };
                this.onlineService.getmerchandizing(merchparams).subscribe((res: any) => {
                    console.log("rs-->" + JSON.stringify(res));
                    if (res.list.length == 0) {
                        this.messageService.showToast("No data for Merchandizing");
                        var data: any = {
                            "checkin": "true",
                            "inventorycheck": this.checkstep.inventorycheck,
                            "merchandizing": "COMPLETED",
                            "orderplacement": this.checkstep.orderplacement,
                            "date": this.util.getTodayDate(),
                            "userid": this.loginData.userId
                        };
                        this.nativeStorage.setItem("checkSteps", data);
                        this.checkstep = data;
                        var param = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "merchandizing": "COMPLETED",
                                "orderPlacement": this.checkstep.orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                        console.log("merchandizing>>" + merchandizing);
                        this.onlineService.setTask(param).subscribe(((val: any) => {
                            if (val.status == 'SUCCESS') {
                                this.loadingService.loadingDismiss();
                            }
                            else {
                                this.messageService.showToast("Something wrong!.");
                            }
                        }), err => {
                            this.loadingService.loadingDismiss();
                            this.messageService.showNetworkToast(err);
                        });
                    } else {
                        var merchandizing;
                        if (this.checkstep.merchandizing == "COMPLETED") {
                            merchandizing = "COMPLETED";
                        }
                        else {
                            merchandizing = "PENDING";
                        }

                        this.merchandizingService.setMerchandizing(res.list);
                        var settaskparam = {
                            "sessionId": sessionStorage.getItem('sessionid'),
                            "task": {
                                "inventoryCheck": this.checkstep.inventorycheck,
                                "merchandizing": merchandizing,
                                "orderPlacement": this.checkstep.orderplacement,
                                "print": "INCOMPLETE"
                            }
                        }
                        if (this.checkinShopdata.checkinStatus == "CHECKOUT") { //shop complete view only
                            this.loadingService.loadingDismiss();
                            sessionStorage.setItem("MerchandizingViewOnly", "true");
                            this.navCtrl.navigateForward(['merchandizing']);
                        }
                        else {
                            if (this.checkstep.merchandizing == "INCOMPLETE") {
                                this.onlineService.setTask(settaskparam).subscribe(((val: any) => {
                                    if (val.status == 'SUCCESS') {
                                        this.navCtrl.navigateForward(['merchandizing']);
                                    }
                                    else {
                                        this.messageService.showToast("Something wrong!.");
                                    }
                                    this.loadingService.loadingDismiss();
                                }), err => {
                                    this.loadingService.loadingDismiss();
                                    this.messageService.showNetworkToast(err);
                                });
                            }
                            else {
                                this.loadingService.loadingDismiss();
                                this.navCtrl.navigateForward(['merchandizing']);
                            }
                        }


                        /***Checkstep **/
                        var data: any = {
                            "checkin": "true",
                            "inventorycheck": this.checkstep.inventorycheck,
                            "merchandizing": merchandizing,
                            "orderplacement": this.checkstep.orderplacement,
                            "date": this.util.getTodayDate(),
                            "userid": this.loginData.userId
                        };
                        this.nativeStorage.setItem("checkSteps", data);
                        this.checkstep = data;
                        /***Checkstep **/

                    }
                }, err => {
                    this.loadingService.loadingDismiss();
                    this.messageService.showNetworkToast(err);
                });
            });
            // }
            // }
        }, 100);
    }
    /***
   * Merchandizing  card #Session  ------ [end]
   */

    logout() {
        sessionStorage.removeItem("loginData");
        sessionStorage.removeItem("login");
        this.navCtrl.navigateRoot(["login_username"]);
        this.removeNative();
    }
    workData(data) {
        if (data == "menu") {
            this.navCtrl.navigateForward(['menu']);
        } else if (data == "profile") {
            this.menu.enable(true, 'first');
            this.menu.close('first');
            this.navCtrl.navigateForward(['profile']);
        } else if (data == "shopcart") {

            if (this.skiporder) {
                sessionStorage.setItem('skiporder', 'true');
                this.navCtrl.navigateForward(['cart-item']);
            }
            else {
                sessionStorage.removeItem('skiporder');
                if (this.cartItemCount.value == 0) {
                    this.messageService.showToast("No data in shopping cart");
                }
                else {
                    this.navCtrl.navigateForward(['cart-item']);
                }
            }
        }
        else if (data == "orderdetail") {
            this.navCtrl.navigateForward(['order-detail/forcheckinshop']);
        }
    }
    async checkOutFunction() {
        const alert = await this.alertCtrl.create({
            header: 'Message',
            message: 'Do you want to checkout?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.inventoryService.clearDataInventory();

                        // this.loadingService.loadingPresent();
                        this.isLoading = true;
                        this.shopbyTeam = [];
                        this.shopbyUser = [];

                        this.nativeStorage.getItem("checkinShopdata").then(res => {
                            var status: any;
                            this.nativeStorage.getItem("checkSteps").then(ress => {
                                status = ress;
                                var checkintype;
                                checkintype = "TEMPCHECKOUT";
                                var datas: any;
                                this.nativeStorage.getItem("checkinShopdata").then(res => {
                                    console.log("23->" + JSON.stringify(res));
                                    datas = res;
                                    this.checkout = false;
                                    this.removeNative();


                                    //InnerFun => Location and getshopall
                                    let defaultresp = {
                                        coords: {
                                            latitude: 16.91464,
                                            longitude: 96.14268
                                        }
                                    }
                                    this.locationAccuracy.canRequest().then((canRequest: any) => {
                                        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                                            () => {
                                                console.log('Request successful');
                                                this.geolocation.getCurrentPosition({ timeout: 40000 }).then((resp) => {
                                                    console.log('Location access: ', resp);

                                                    this.checkoutGetData(resp, res, checkintype, status);
                                                }).catch((error) => {
                                                    console.log('Error getting location', error);


                                                    this.checkoutGetData(defaultresp, res, checkintype, status);
                                                });
                                            },
                                            error => {
                                                console.log('Error requesting location permissions', error)
                                                this.checkoutGetData(defaultresp, res, checkintype, status);
                                            }
                                        );
                                    }, err => {
                                        this.checkoutGetData(defaultresp, res, checkintype, status);
                                    });
                                })
                                    .catch(err => {
                                        console.log("ers-->" + JSON.stringify(err));
                                        this.isLoading = false;
                                    });
                            })
                                .catch(err => {
                                    console.log("err23-->" + JSON.stringify(err));
                                    this.isLoading = false;
                                });
                        }, err => {
                            console.log("err >>" + JSON.stringify(err));
                            this.checkout = false;
                            this.isLoading = false;
                        });
                    }
                }
            ]
        });


        await alert.present();
    }
    checkoutGetData(resp, res, checkintype, status) {
        console.log("resp>>" + JSON.stringify(resp));
        var params = {
            "lat": resp.coords.latitude,
            "lon": resp.coords.longitude,
            "address": this.checkinShopdata.address,
            "shopsyskey": this.checkinShopdata.shopsyskey,
            "usersyskey": this.loginData.syskey,
            "checkInType": checkintype,
            "register": false,
            "task": {
                "inventoryCheck": status.inventorycheck,
                "merchandizing": status.merchandizing,
                "orderPlacement": status.orderplacement,
                "print": "INCOMPLETE"
            }
        }
        if (res.checkinStatus == "CHECKOUT") {
            var shopParams = {
                "spsyskey": this.loginData.syskey,
                "teamsyskey": this.loginData.teamSyskey,
                "usertype": this.loginData.userType,
                "date": this.util.getTodayDate()
            };
            console.log(">>>" + JSON.stringify(shopParams));
            this.onlineService.getShopall(shopParams).subscribe(data_1 => {
                var shopArray: any;
                shopArray = data_1;
                console.log("-->" + JSON.stringify(shopArray));
                if (shopArray.status == "FAIL!") {
                    this.messageService.showToast("Fail to connect internal server");
                }
                else {
                    this.shopService.setShopByUser(shopArray.data.shopsByUser);
                    this.shopService.setShopByTeam(shopArray.data.shopsByTeam);
                    this.getAllDataforMain("checkout");
                }
            }, err => {
                console.log("err>>" + JSON.stringify(err));
                this.isLoading = false;
                this.messageService.showNetworkToast(err);

            });
        }
        else {
            this.onlineService.checkIn(params).subscribe((res: any) => {
                var shopParams = {
                    "spsyskey": this.loginData.syskey,
                    "teamsyskey": this.loginData.teamSyskey,
                    "usertype": this.loginData.userType,
                    "date": this.util.getTodayDate()
                };
                this.onlineService.getShopall(shopParams).subscribe(data_1 => {
                    var shopArray: any;
                    shopArray = data_1;
                    this.shopService.setShopByUser(shopArray.data.shopsByUser);
                    this.shopService.setShopByTeam(shopArray.data.shopsByTeam);
                    this.getAllDataforMain("checkout");
                }, err => {
                    this.isLoading = false;
                    this.loadingService.loadingDismiss();
                    this.messageService.showNetworkToast(err);
                });
            }, err => {
                this.isLoading = false;
                this.loadingService.loadingDismiss();
                this.messageService.showNetworkToast(err);
            });
        }
    }

    checkInandout() {
        this.nativeStorage.getItem('checkinShopdata').then(res => {
            this.checkinShopdata = res;
        })
        this.nativeStorage.getItem('checkSteps').then(res => {
            this.checkstep = res;
        })
        var aa = JSON.parse(sessionStorage.getItem("checkin"));
        if (aa == null || aa == undefined) {
            this.checkout = false;
        }
        else {
            if (aa.date == this.util.getTodayDate()) {
                if (aa.checkin == "In") {
                    this.checkout = true;
                } else {
                    this.checkout = false;
                }
            }
            else {
                this.checkout = false;
                this.nativeStorage.setItem('merchandizing', "");
            }
        }
        // skipOrder disabled  [shop status => INCOMPLETE]
        setTimeout(() => {
            if (this.checkinShopdata.checkinStatus == "CHECKOUT") {
                this.skiporderDisabled = true;
            }
            else {
                // if (this.checkstep.orderplacement == "PENDING" || this.checkstep.orderplacement == "COMPLETED") {//*
                if (this.checkstep.orderplacement == "COMPLETED") {
                    this.skiporderDisabled = true;
                    this.skiporder = false;
                }
                else {
                    this.skiporderDisabled = false;
                    if (this.checkstep.orderplacement == "PASS") {
                        this.skiporder = true;
                    }
                    else {
                        this.skiporder = false;
                    }
                }
            }
        }, 1000);
    }
    skipOrder($event) {
        if (this.checkinShopdata.checkinStatus != "CHECKOUT") {
            if (this.skiporder) {
                this.checkstep.orderplacement = "PASS";
            }
            else {
                this.checkstep.orderplacement = "INCOMPLETE";
            }
            var param;
            /********  Store Owner ************/
            if (this.loginData.userType == "storeowner") {
                param = {
                    "sessionId": sessionStorage.getItem('sessionid'),
                    "task": {
                        "inventoryCheck": this.checkstep.inventorycheck,
                        "orderPlacement": this.checkstep.orderplacement,
                    }
                }
            }
            else {
                param = {
                    "sessionId": sessionStorage.getItem('sessionid'),
                    "task": {
                        "inventoryCheck": this.checkstep.inventorycheck,
                        "merchandizing": this.checkstep.merchandizing,
                        "orderPlacement": this.checkstep.orderplacement,
                        "print": "INCOMPLETE"
                    }
                }
            }




            this.onlineService.setTask(param).subscribe(((val: any) => {
                sessionStorage.removeItem("skiporder");
                sessionStorage.setItem("skiporder", 'true');
                var data: any = {
                    "checkin": "true",
                    "inventorycheck": this.checkstep.inventorycheck,
                    "merchandizing": this.checkstep.merchandizing,
                    "orderplacement": this.checkstep.orderplacement,
                    "date": this.util.getTodayDate(),
                    "userid": this.loginData.userId
                };
                this.nativeStorage.setItem("checkSteps", data);
            }), err => {
                this.loadingService.loadingDismiss();
                this.messageService.showNetworkToast(err);
            });
        }

    }
    async countOfMerchandizing() {
        return new Promise(resolve => {
            //--------------------- Merchandizing [shop count todo/total] [start] ---------------
            this.offlineService.getMerchdizing(this.loginData.userId, this.util.getTodayDate(), "shopcompleted").then((todo: any) => {
                this.offlineService.getMerchdizing(this.loginData.userId, this.util.getTodayDate(), "saved").then((saved: any) => {
                    console.log("Saved ==" + saved.data.length + '------ Todo ==' + todo.data.length);

                    this.countofmerchandizing.total = saved.data.length + todo.data.length;
                    this.countofmerchandizing.donecount = saved.data.length;
                    resolve();
                }, err => {
                    resolve();
                });
            }, err => {
                resolve();
            });
            //--------------------- Merchandizing [shop count todo/total] [end] ---------------
        });

    }
    async getAllDataforMain(status) {


        sessionStorage.removeItem('routestatus');

        //-------------------- shopbyUser [start] ---------------------------- 
        this.shopbyUser = this.shopService.getShopByUser();
        if (this.shopbyUser.length > 0) {
            this.shopDatalength = this.shopbyUser.length;
            this.shopcountbyUser = this.shopbyUser.filter(el => el.checkinStatus == 'CHECKOUT').length;
        }
        else {
            this.shopDatalength = 0;
        }
        //-------------------- shopbyUser [end] ----------------------------

        //-------------------- shopByTeam [start] ----------------------------
        this.shopbyTeam = this.shopService.getShopByTeam();
        //-------------------- shopbyTeam [end] ----------------------------

        //--------------------- Merchandizing [shop count todo/total] [start] ---------------
        await this.countOfMerchandizing();
        //--------------------- Merchandizing [shop count todo/total] [end] ---------------
        setTimeout(() => {
            this.isLoading = false;
            this.loadingService.loadingDismiss();
            if (status == "checkout") {
                this.messageService.showToast("Checkout successfully");
            }
            this.countofmerchandizingLoading = false;
        }, 2000);
    }
    openFirst() {
        this.menu.enable(true, 'first');
        this.menu.open('first');
    }
    async menuworkData(data) {
        if (data == "orderlist") {
            if (this.shopbyUser.length > 0) {
                this.menu.enable(true, 'first');
                this.menu.close('first');
                const modal = await this.modalCtrl.create({
                    component: ShopmodalPage,
                    cssClass: 'modalStyle',
                });
                await modal.present();
            }
            else {
                this.menu.enable(true, 'first');
                this.menu.close('first');
                this.messageService.showToast("No Shop");
            }
        }

    }

    getParam() {
        return { "shopSyskey": '', "campaignsyskey": "", 'lmc002': [] };
    }
    uploadData() {
    }
    async uploadMerchandizing() {

        this.offlineService.getMerchdizing(this.loginData.userId, this.util.getTodayDate(), "shopcompleted").then(async (val: any) => { //get shopcompleted data [only shop data]
            if (val.data.length > 0) {
                var container = `
                <div class="uploadmsg"> 
                  <ion-label> Uploading....</ion-label>
                </div>
                 `;
                this.loadingController.create(
                    {
                        spinner: null,
                        message: `Uploading...`,
                        cssClass: 'uploadloadingclass'
                    }
                ).then(
                    async el => {
                        el.present();
                        var count = 0, warningcount = 0, interval = 0;
                        el.message = container + `<span class="wrap"> <p class="warning">⚠️${warningcount} </p> <p> ${count + " / " + val.data.length} </p> </span>`;
                        val.data.filter(async (obj, si) => {
                            var merch: any = [];
                            this.merchandizingService.getData(obj.shopsyskey).then(async (merchval: any) => { //Get Merchandizing data from Storage offline
                                merch = merchval;
                                this.offlineService.getMerchandizingTask(obj.shopCode, this.util.getTodayDate()).then(async (val_1: any) => {
                                    var taskData = val_1.data, taskindex = 0;
                                    val_1.data.filter((tobj, tindex) => {
                                        this.offlineService.getMerchImageByTaskID(obj.shopCode, tobj.taskId, this.util.getTodayDate()).then(async (val_2: any) => {
                                            console.log("merchandizingimages>>" + JSON.stringify(val_2));
                                            // Create array params for upload images by task [start]
                                            var params = [];
                                            val_2.data.filter(iobj => {
                                                var filePath = obj.shopsyskey + '/' + this.util.getTodayDate() + '/' + iobj.brandOwnerId + '/' + iobj.campaign + '/' + iobj.taskId;
                                                var newFileName = this.util.getTodayDate() + this.util.getCurrentTime() + ".jpg";
                                                params.push({
                                                    "path": filePath + newFileName,
                                                    "name": iobj.filename,
                                                    "img": iobj.filedata
                                                });
                                            });


                                            var imgparam = {
                                                "list": params
                                            }

                                            // Create array params for upload images by task [end] 
                                            this.onlineService.photoUpload(imgparam).subscribe(async (res: any) => {
                                                console.log("upload===>" + JSON.stringify(res));
                                                taskindex++;
                                                // Update existing merchandizing images by taskid [Return from server file path and name] [start] *******/
                                                var ary = res.list;
                                                merch.lmc002.filter(lmc => {
                                                    lmc.mc003.filter(d => d.n2 == tobj.taskId).map(mc => {
                                                        var fileary = [];
                                                        for (var i = 0; i < mc.pictureData.length; i++) {
                                                            fileary.push({
                                                                't1': mc.pictureData[i].t1,
                                                                't2': ary[i].name,
                                                                't3': ary[i].path
                                                            });
                                                        }
                                                        mc.pictureData = fileary;
                                                    });
                                                });

                                                // Update existing merchandizing images by taskid [Return from server file path and name] [end]

                                                // Upload Merchandizing data to server by shop [start] 
                                                console.log("tobjindex>>" + taskindex + "______" + tindex + "--------vaL_" + val_1.data.length);
                                                if (val_1.data.length == taskindex) {
                                                    console.log("Save Campaign>>" + JSON.stringify(merch));
                                                    count++;
                                                    el.message = container + `<span class="wrap"> <p class="warning">⚠️0 </p> <p> ${count + " / " + val.data.length} </p> </span>`;
                                                    this.onlineService.saveCampaign(merch).subscribe((async (res: any) => {
                                                        console.log("res>>" + JSON.stringify(res));
                                                        interval++;
                                                        if (res.status == "SUCCESS") {
                                                            this.offlineService.updateMerchandizing({ status: "saved", shopsyskey: obj.shopsyskey });
                                                        } else {
                                                            warningcount++;
                                                            el.message = container + `<span class="wrap"> <p class="warning">⚠️${warningcount} </p> <p> ${count + " / " + val.data.length} </p> </span>`;
                                                        }
                                                        console.log("Length === " + val.data.length + '-----Interval === ' + interval);
                                                        if (val.data.length == interval) {
                                                            await this.countOfMerchandizing();
                                                            el.dismiss();
                                                            this.messageService.showToast("Uploaded Successfully");
                                                        }
                                                    }), async err => {
                                                        if (val.data.length - 1 == si) {
                                                            await this.countOfMerchandizing();
                                                            el.dismiss();
                                                            this.messageService.showToast("Uploaded Successfully");
                                                        }
                                                        warningcount++;
                                                        el.message = container + `<span class="wrap"> <p class="warning">⚠️${warningcount} </p> <p> ${count + " / " + val.data.length} </p> </span>`;
                                                    });
                                                }
                                                /***** Upload Merchandizing data to server by shop  [end] ************/
                                            }, err => {
                                                el.dismiss();
                                                this.messageService.showToast("Please try again");
                                            });
                                        });
                                    });

                                });
                            });
                        });
                    });
            }
            else {
                this.loadingService.loadingPresent();
                this.messageService.showToast("No data for Merchandizing");
                setTimeout(() => {
                    this.loadingService.loadingDismiss();
                }, 1000);
            }
        });
    }
    async uploadMerchandizing1() { // not used yet
        // var container = `
        //  <div class="uploadmsg"> 
        //    <ion-label> Uploading....</ion-label>
        //  </div>
        //  <ion-progress-bar type="indeterminate"></ion-progress-bar>`;
        this.loadingController.create(
            {
                message: `Uploading...`,
            }
        ).then(
            async el => {
                el.present();
                this.offlineService.getMerchdizing(this.loginData.userId, this.util.getTodayDate(), "shopcompleted").then((val: any) => { //get shopcompleted data [only shop data]
                    if (val.data.length > 0) {
                        var count = 0;
                        val.data.filter((obj, si) => {
                            var merch: any = [];
                            this.merchandizingService.getData(obj.shopsyskey).then((merchval: any) => { //Get Merchandizing data from Storage offline
                                merch = merchval;
                                this.offlineService.getMerchandizingTask(obj.shopCode, this.util.getTodayDate()).then((val_1: any) => {
                                    var taskData = val_1.data, taskindex = 0;
                                    val_1.data.filter((tobj, tindex) => {
                                        this.offlineService.getMerchImageByTaskID(obj.shopCode, tobj.taskId, this.util.getTodayDate()).then((val_2: any) => {
                                            console.log("merchandizingimages>>" + JSON.stringify(val_2));
                                            /******* Create array params for upload images by task [start]****/
                                            var params = [];
                                            val_2.data.filter(iobj => {
                                                var filePath = obj.shopsyskey + '/' + this.util.getTodayDate() + '/' + iobj.brandOwnerId + '/' + iobj.campaign + '/' + iobj.taskId;
                                                var newFileName = this.util.getTodayDate() + this.util.getCurrentTime() + ".jpg";
                                                params.push({
                                                    "path": filePath + newFileName,
                                                    "name": iobj.filename,
                                                    "img": iobj.filedata
                                                });
                                            });
                                            var imgparam = {
                                                "list": params
                                            }
                                            /******* Create array params for upload images by task [end] ********/
                                            this.onlineService.photoUpload(imgparam).subscribe((res: any) => {
                                                console.log("upload===>" + JSON.stringify(res));
                                                taskindex++;
                                                /******* Update existing merchandizing images by taskid [Return from server file path and name] [start] *******/
                                                var ary = res.list;
                                                merch.lmc002.filter(lmc => {
                                                    lmc.mc003.filter(d => d.n2 == tobj.taskId).map(mc => {
                                                        var fileary = [];
                                                        for (var i = 0; i < mc.pictureData.length; i++) {
                                                            fileary.push({
                                                                't1': mc.pictureData[i].t1,
                                                                't2': ary[i].name,
                                                                't3': ary[i].path
                                                            });
                                                        }
                                                        mc.pictureData = fileary;
                                                    });
                                                });
                                                /******* Update existing merchandizing images by taskid [Return from server file path and name] [end] *******/

                                                /***** Upload Merchandizing data to server by shop [start] ************/
                                                console.log("tobjindex>>" + taskindex + "______" + tindex + "--------vaL_" + val_1.data.length);
                                                if (val_1.data.length == taskindex) {
                                                    console.log("CCC>>" + JSON.stringify(merch));
                                                    count++;
                                                    this.onlineService.saveCampaign(merch).subscribe(((res: any) => {
                                                        console.log("res>>" + JSON.stringify(res));
                                                        this.offlineService.updateMerchandizing({ status: "saved", shopsyskey: obj.shopsyskey });
                                                        if (val.data.length - 1 == si) {
                                                            this.countOfMerchandizing();
                                                            el.dismiss();
                                                            this.messageService.showToast("Uploaded Successfully");
                                                        }
                                                    }), err => {
                                                        if (val.data.length - 1 == si) {
                                                            this.countOfMerchandizing();
                                                            el.dismiss();
                                                            this.messageService.showToast("Uploaded Successfully");
                                                        }
                                                    });
                                                }
                                                /***** Upload Merchandizing data to server by shop  [end] ************/
                                            }, err => {
                                                el.dismiss();
                                                this.messageService.showToast("Please try again");
                                            });
                                        });
                                    });

                                });
                            });
                        });
                    }
                    else {
                        el.dismiss();
                        this.messageService.showToast("No data for Merchandizing");
                    }
                })
            });
    }
    workSteps() {
        return new Promise(resolve => {
            console.log("workchecksteps ==" + JSON.stringify(this.checkstep));
            this.checkinandoutStatus = JSON.parse(sessionStorage.getItem("checkin"));
            if (this.checkinandoutStatus == null || this.checkinandoutStatus == undefined) {
                this.checkstep = {
                    "checkin": "false",
                    "inventorycheck": "INCOMPLETE",
                    "merchandizing": "INCOMPLETE",
                    "orderplacement": "INCOMPLETE",
                    "date": this.util.getTodayDate(),
                    "userid": this.loginData.userId
                };
                resolve();
            }
            else {
                if (this.checkinandoutStatus.checkin == "In") {
                    this.nativeStorage.getItem("checkSteps").then(res => {
                        console.log("workCheckstep ===" + JSON.stringify(res));
                        if (res == undefined || res == null || res.date != this.util.getTodayDate()) {
                            this.checkstep = {
                                "checkin": "false",
                                "inventorycheck": "INCOMPLETE",
                                "merchandizing": "INCOMPLETE",
                                "orderplacement": "INCOMPLETE",
                                "date": this.util.getTodayDate(),
                                "userid": this.loginData.userId
                            };
                            resolve();
                        } else {
                            this.checkstep = res;
                            resolve();
                        }
                    });
                } else {
                    this.checkstep = {
                        "checkin": "false",
                        "inventorycheck": "INCOMPLETE",
                        "merchandizing": "INCOMPLETE",
                        "orderplacement": "INCOMPLETE",
                        "date": this.util.getTodayDate(),
                        "userid": this.loginData.userId
                    };
                    resolve();
                }
            }
        });

    }
    removeNative() {
        this.offlineService.deleteInventory();
        this.inventoryService.clearDataInventory();
        this.cartService.clearCart();
        this.nativeStorage.remove("checkSteps");
        this.nativeStorage.remove("checkinShopdata");
        this.nativeStorage.setItem("merchandizing", "");
        sessionStorage.removeItem("headersyskey");
        sessionStorage.removeItem("checkvisit");
        sessionStorage.removeItem("printstatus");
        this.checkout = false;
        const check = {
            checkin: 'out',
            date: this.util.getTodayDate()
        }
        sessionStorage.setItem("checkin", JSON.stringify(check));
    }
    toggleSectionByMyList() {
        this.open = !this.open;
        var dom = document.getElementById("measuringWrapper"), height = 0;

        if (this.open) {
            height = dom.offsetHeight;
        }

        //transform
        this.domCtrl.write(() => {
            const el = document.querySelector('.collapse-user');
            this.renderer.setStyle(el, 'height', height.toString() + "px");
        });

    }
    toggleSectionByTeam(index) {
        this.shopbyTeam[index].open = !this.shopbyTeam[index].open;

        var dom = document.getElementById(`measuringWrapperteam-${index}`), height = 0,
            collapse_team = `collapse-team-${index}`;

        if (this.shopbyTeam[index].open) {
            height = dom.offsetHeight;
        }

        //transform
        this.domCtrl.write(() => {
            const el = document.querySelector(`.${collapse_team}`);
            this.renderer.setStyle(el, 'height', height.toString() + "px");
        });
    }
}