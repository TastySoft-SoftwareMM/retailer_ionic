import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { CheckinPageModule } from './checkin/checkin.module';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { MerchanModalPageModule } from './merchan-modal/merchan-modal.module';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Network } from '@ionic-native/network/ngx';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { ShopmodalPage } from './shopmodal/shopmodal.page';
import { ShopmodalPageModule } from './shopmodal/shopmodal.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Printer } from '@ionic-native/printer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Downloader } from '@ionic-native/downloader/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { fancyAnimation } from './animation';
import { ImageViewerPageModule } from './image-viewer/image-viewer.module';
import { ReturnproudctPageModule } from './returnproduct/returnproduct.module';
import { MerchTaskModalPageModule } from './merch-task-modal/merch-task-modal.module';
import { MerchModalViewPage } from './merch-modal-view/merch-modal-view.page';
import { MerchModalViewPageModule } from './merch-modal-view/merch-modal-view.module';
import { StockImageViewerPageModule } from './stock-image-viewer/stock-image-viewer.module';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { ProImageViewerPageModule } from './pro-image-viewer/pro-image-viewer.module';
import { InvoiceDiscountDetailPageModule } from './invoice-discount-detail/invoice-discount-detail.module';
import { CustomAlertInputPageModule } from './custom-alert-input/custom-alert-input.module';
import { MultipleSkusPageModule } from './multiple-skus/multiple-skus.module';


//components
// import { CheckinshopComponent } from './components/checkinshop/checkinshop.component';
// import { ImageShellComponent } from './components/image-shell/image-shell.component';
// import { MerchanImageShellComponent } from './components/merchan-image-shell/merchan-image-shell.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
    // CheckinPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(
      // {
      // navAnimation: fancyAnimation
      // }

    ),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CheckinPageModule,
    // MerchanModalPageModule, //* merchand modal page
    ShopmodalPageModule,
    ImageViewerPageModule,
    StockImageViewerPageModule,
    // ProImageViewerPageModule,
    ReturnproudctPageModule,
    MerchTaskModalPageModule,
    MerchModalViewPageModule,
    InvoiceDiscountDetailPageModule,
    // MultipleSkusPageModule,
    CustomAlertInputPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    SQLite,
    Geolocation,
    LocationAccuracy,
    NativeStorage,
    HTTP,
    AndroidPermissions,
    Camera,
    File,
    FilePath,
    FileTransfer,
    WebView,
    Base64,
    Network,
    BluetoothSerial,
    Printer,
    LottieSplashScreen,
    ImagePicker,
    Downloader,
    NgxImageCompressService,
    Insomnia,
    ImageResizer,
    BackgroundMode,
    CameraPreview,
    DeviceOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
