import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DomController, ModalController, NavController, Platform, IonRouterOutlet } from '@ionic/angular';
import { MerchandizingService } from '../services/merchandizing/merchandizing.service';
import { async } from '@angular/core/testing';
import { BinaryOperatorExpr, Binary } from '@angular/compiler';
import { BindingForm } from '@angular/compiler/src/compiler_util/expression_converter';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { LoadingService } from '../services/Loadings/loading.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  isToBack: any = false;
  flashMode: any = 'off';
  img: any = "";
  notcanvasimg: any = "";
  setZoom: any = 1;

  //Chech Hardware backbutton
  backstatus: any = "pending";

  takepicturestatus: any = false;
  isLoading: any = false;
  orientation: any = 1;
  flip: any = 0;
  watch: any;

  constructor(private cameraPreview: CameraPreview, private status: StatusBar,
    private navCtrl: NavController,
    private merchandizingService: MerchandizingService,
    private loadingService: LoadingService,
    private domCtrl: DomController, private renderer: Renderer2, private modalCtrl: ModalController,
    private platform: Platform, public routerOutlet: IonRouterOutlet,
    private statusbar: StatusBar,
    private deviceOrientation: DeviceOrientation) {
  }

  ngOnInit() {
    this.img = "";
    setTimeout(async () => {
      await this.show();
      // window.screen.orientation.lock;
    }, 1000);
  }

  async ionViewWillLeave() {
    // window.screen.orientation.unlock;
    if (this.backstatus == "pending") {
      this.hide();
      this.cameraPreview.stopCamera();
      await this.merchandizingService.setImg('back');
    }
  }

  startCamera() {
    return new Promise(resolve => {
      this.isToBack = true;

      const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        camera: 'rear',
        tapPhoto: true,
        tapFocus: true,
        previewDrag: false,
        toBack: true,
      }

      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res)
          resolve();
        },
        (err) => {
          console.log("start camera" + err)
          resolve();
        })
    })


  }
  async show() {
    await this.startCamera();
    this.cameraPreview.show().then(() => {
    }, err => {
      console.log("show" + err);
    });
  }
  hide() {
    this.cameraPreview.hide();
  }

  takePicture() {
    this.takepicturestatus = true;
    this.cameraPreview.takePicture({
      width: 1280,
      height: 1280,
      quality: 50
    }).then((imageData) => {

      this.img = 'data:image/jpeg;base64,' + imageData;
      this.notcanvasimg = 'data:image/jpeg;base64,' + imageData;

      // Watch the device compass heading change
      this.watch = this.deviceOrientation.watchHeading().subscribe(
        (data: any) => console.log(data),
        (error: any) => console.log(error)
      );

      // Stop watching heading change
      this.hide();
      this.cameraPreview.stopCamera();
      this.takepicturestatus = false;
      this.backstatus = "pending";


    }, (err) => {
      console.log(err);
    });
  }


  //---- Rotate Image -----
  async orientationFun() {
    this.isLoading = true;

    console.log(this.img);

    if (this.orientation < 4) {
      this.orientation += 1;
    }
    else {
      this.orientation = 1;
    }
    console.log(this.isLoading);

    console.log(this.orientation);
    var ref = this;
    await this.rotateBase64Image(this.notcanvasimg, this.orientation, function (rotatedImg) {
      ref.img = rotatedImg;
    })

    setTimeout(() => {
      this.isLoading = false;

    }, 2000);


  }
  async rotateBase64Image(srcBase64, srcOrientation, callback) {
    return new Promise(resolve => {

      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d");


        let { width, height }: any = img;

        const [outputWidth, outputHeight] = orientation >= 5 && orientation <= 8
          ? [height, width]
          : [width, height];


        width = width;
        height = height;

        // set proper canvas dimensions before transform & export
        canvas.width = 1280;
        canvas.height = 1280;

        console.log(outputWidth + '------------' + outputHeight);

        // transform context before drawing image
        switch (srcOrientation) {
          case 1:
            // canvas.setAttribute('width', width);
            // canvas.setAttribute('height', height);
            ctx.rotate(0 * Math.PI / 180);
            ctx.drawImage(img, 0, 0);
            break;
          case 2:
            // canvas.setAttribute('width', height);
            // canvas.setAttribute('height', width);
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(img, 0, -height);
            break;
          case 3:
            // canvas.setAttribute('width', width);
            // canvas.setAttribute('height', height);
            ctx.rotate(180 * Math.PI / 180);
            ctx.drawImage(img, -width, -height);
            break;
          case 4:
            // canvas.setAttribute('width', height);
            // canvas.setAttribute('height', width);
            ctx.rotate(270 * Math.PI / 180);
            ctx.drawImage(img, -width, 0);
            break;
          default: break;
        }
        // draw image
        ctx.drawImage(img, 0, 0);

        // export base64
        callback(canvas.toDataURL());
      };
      img.src = srcBase64;
      resolve();
    });

  }


  //---- Flip Image -----
  async flipImage() {
    this.isLoading = true;
    if (this.flip == 0) {
      this.flip = 1;
    }
    else {
      this.flip = 0;
    }

    var img = new Image(), ref = this;
    img.onload = function () {
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");


      // var scaleH = flipH ? -1 : 1, // Set horizontal scale to -1 if flip horizontal
      //   scaleV = flipV ? -1 : 1, // Set verical scale to -1 if flip vertical
      //   posX = flipH ? width * -1 : 0, // Set x position to -100% if flip horizontal 
      //   posY = flipV ? height * -1 : 0; // Set y position to -100% if flip vertical

      let { width, height }: any = img;

      console.log(width + '-----' + height);


      // transform context before drawing image
      switch (ref.flip) {
        case 0:
          ctx.scale(1, 1);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          ctx.drawImage(img, 0, 0, width, height);
          break;
        case 1:
          ctx.scale(-1, 1);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          ctx.drawImage(img, 0, 0, width, height);
          break;
        default: break;
      }
      // draw image
      ctx.drawImage(img, 0, 0, width, height);

      // export base64
      ref.img = canvas.toDataURL();
    };
    img.src = this.notcanvasimg;
    this.isLoading = false;

  }
  switchCamera() {
    this.cameraPreview.switchCamera();
  }
  changeFlashMode() {
    if (this.flashMode == 'off') {
      this.flashMode = 'on';
    }
    else {
      this.flashMode = 'off';
    }

    this.cameraPreview.setFlashMode(this.flashMode);
  }
  changeZoom() {
    this.cameraPreview.setZoom(this.setZoom);
  }
  option() {
    this.cameraPreview.getSupportedPictureSizes().then((sizes) => {
      alert(JSON.stringify(sizes));
    }, (err) => {
      console.log(err);
    });
  }

  async retryCamera() {
    this.img = "";
    this.isToBack = false;
    this.backstatus = "pending";
    setTimeout(async () => {
      await this.show();
      this.cameraPreview.setFlashMode(this.flashMode);
    }, 200);
  }
  async confirmImg() {
    await this.merchandizingService.setImg(this.img);
    this.backstatus = "completed"
    this.watch.unsubscribe();
    this.navCtrl.back();
  }
}
