import { Component, Renderer2, ElementRef, HostListener } from '@angular/core';

import { Platform, NavController, DomController, IonNote } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { OfflineService } from './services/offline/offline.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Scroll } from '@angular/router';

declare var cordova: any


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  database: SQLiteObject;
  keyboard: any;
  modal: any;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public sqlite: SQLite,
    public offlineService: OfflineService,
    public androidPermission: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private lottieSplashScreen: LottieSplashScreen,
    private navCtrl: NavController,
    private insomnia: Insomnia,
    public renderer: Renderer2,
    private domCtrl: DomController,
    public element: ElementRef,
  ) {


    console.log("initialize");
    this.initializeApp();

    window.addEventListener('keyboardWillShow', (info: any) => {
      console.log(info);
      this.domCtrl.read(() => {
        this.keyboard = this.element.nativeElement.querySelectorAll('.keyboard');
        this.modal = this.element.nativeElement.querySelectorAll('.custom-alert-input-modal');

        this.domCtrl.write(() => {
          for (var index = 0; index < this.keyboard.length; index++) {
            this.renderer.setStyle(this.keyboard[index], 'height', info.keyboardHeight + 'px');
          }

          if (this.modal != null) {
            for (var index = 0; index < this.modal.length; index++) {
              this.renderer.setStyle(this.modal[index], 'transform', `translateY(-${info.keyboardHeight / 2}px`);
            }
          }
        })
      });
    });


    window.addEventListener('keyboardDidHide', (event) => {
      this.domCtrl.read(() => {
        this.keyboard = this.element.nativeElement.querySelectorAll('.keyboard');
        this.modal = this.element.nativeElement.querySelectorAll('.custom-alert-input-modal');

        this.domCtrl.write(() => {

          for (var index = 0; index < this.keyboard.length; index++) {
            this.renderer.setStyle(this.keyboard[index], 'height', '0');
          }

          if (this.modal != null) {
            for (var index = 0; index < this.modal.length; index++) {
              this.renderer.setStyle(this.modal[index], 'transform', 'none');
            }
          }

        })
      });
    });

  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.lottieSplashScreen.hide();
      console.log("initializePlatform");
      this.statusBar.backgroundColorByHexString("#ab000d");
      this.sqlite.create({
        name: 'mPOSretail.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.offlineService.Database();
        this.androidPermission.requestPermissions([
          this.androidPermission.PERMISSION.CAMERA,
          this.androidPermission.PERMISSION.GET_ACCOUNTS,
          this.androidPermission.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermission.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]);
        const permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
        function checkPermissionCallback(status) {
          console.log('no read external permission', JSON.stringify(status));
          if (!status.hasPermission) {
            console.log('read external=', JSON.stringify(status.hasPermission));
            var errorCallback = function () {
              console.log('no read external permisions');
            }
            permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
              console.log('request read external permisions=', JSON.stringify(status));
            }, errorCallback);
          }
        }
        // this.rootPage = LoginUserPage;
      });
    });
  }
}
