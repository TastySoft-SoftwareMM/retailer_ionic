import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, ActionSheetController, Platform, LoadingController, NavController } from '@ionic/angular';



import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';


import { UtilService } from '../services/util.service';
import { OfflineService } from '../services/offline/offline.service';
import { MessageService } from '../services/Messages/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OnlineService } from '../services/online/online.service';
import { LoadingService } from '../services/Loadings/loading.service';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService } from '../services/network/network.service';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { MerchandizingService } from '../services/merchandizing/merchandizing.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import Compressor from 'compressorjs';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';

const Store_KEY = "taskone";
@Component({
  selector: 'app-merchan-modal',
  templateUrl: './merchan-modal.page.html',
  styleUrls: ['./merchan-modal.page.scss'],
})
export class MerchanModalPage implements OnInit {
  images: any = [];
  secondImages: any = [];
  uimages: any = [];
  // brandId: any;
  // campaign: any;
  // brandownername: any;
  // brandownercode: any;
  // taskId: any;
  // taskCode: any;
  // taskName: any;

  // remark: any;

  // t1: any;
  // t2: any;
  // t3: any;
  _task: any = this.createTaskParam();

  checkinShopdata: any;
  params: any = [];
  loading: any;
  check_merchandizing_view_only: any;
  picsum: string[] = Array.from(
    new Array(12),
    (x, i) => `https://source.unsplash.com/random/1080x720?${i}`
  );

  isLoading: any = false;
  constructor(public modalCtrl: ModalController,
    public sanitizer: DomSanitizer,
    public statusBar: StatusBar,
    public camera: Camera,
    public nativeStorage: NativeStorage,
    public actionSheetCtrl: ActionSheetController,
    public file: File,
    public filepath: FilePath,
    public filetransfer: FileTransfer,
    public webview: WebView,
    public ref: ChangeDetectorRef,
    public util: UtilService,
    public platform: Platform,
    public offlineService: OfflineService,
    public onlineService: OnlineService,
    public base64: Base64,
    public loadingService: LoadingService,
    public loadingController: LoadingController,
    public networkService: NetworkService,
    public messageService: MessageService,
    public dataTransfer: DatatransferService,
    public merchandizingService: MerchandizingService,
    public imagePicker: ImagePicker,
    public imageCompress: NgxImageCompressService,
    public imageResizer: ImageResizer,
    public navCtrl: NavController,
    public activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
  }
  createTaskParam() {
    return { "brandId": "", "campaign": "", "t2": "", "t1": "", "t3": "", "brandownername": "", "brandownercode": "", "taskId": "", "taskCode": "", "taskName": "", "remark": "" };
  }
  async ionViewWillEnter() {
    this.loadingService.loadingPresent();

    await this.getShopAndTask();


    //return back from camera page
    const img = this.merchandizingService.getImg();
    if (img && img != 'back') {

      //filepath / Name
      var newFileName = this.util.getTodayDate() + this.util.getCurrentTime() + ".jpg";
      var imageName = newFileName.replace(".jpg", "");
      var filePath = this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign;

      this.params.push(
        {
          "path": filePath + newFileName,
          "name": imageName,
          "img": img,
          "status": "notUpload"
        }
      );

      //base64 to blob [display image]
      const base64Response = await fetch(img);
      const blob = await base64Response.blob();

      console.log(blob);

      this.images.push({
        "img": URL.createObjectURL(blob),
        "name": imageName,
        "status": "notUpload"
      })

      await this.merchandizingService.clearImg();
      this.loadingService.loadingDismiss();
      this.isLoading = true;
    }
    else {
      await this.merchandizingService.clearImg();
      this.loadingService.loadingDismiss();
      this.isLoading = true;
    }



  }

  async getShopAndTask() {
    return new Promise(async (resolve) => {
      //task
      this._task = this.merchandizingService.getTask();
      //check ui
      this.check_merchandizing_view_only = sessionStorage.getItem("MerchandizingViewOnly");
      //checkin shop
      this.nativeStorage.getItem("checkinShopdata").then(async (res: any) => {
        this.checkinShopdata = res;

        //getimages
        // var val = this.activatedRoute.snapshot.paramMap.get('id');
        const img = this.merchandizingService.getImg();
        if (!img) {
          await this.getData();
        }

        resolve();
      }, err => {
        resolve();
      });
    })
  }
  async getData() {

    return new Promise(resolve => {

      this.images = [], this.params = [];

      this.offlineService.getMerchImageByTaskID(this.checkinShopdata.shopcode, this._task.taskId, this.util.getTodayDate()).then(async (val_2: any) => {
        console.log("Images off ===" + JSON.stringify(val_2));
        var data = val_2.data;
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {

            //base64 to blob [display image]
            const base64Response = await fetch(data[i].filedata);
            const blob = await base64Response.blob();

            this.images.push(
              {
                "id": data[i].id,
                "name": data[i].filename,
                "img": URL.createObjectURL(blob),
                "status": "uploaded"
              }
            )
            this.params.push(
              {
                "id": data[i].id,
                "name": data[i].filename,
                "img": data[i].filedata,
                "status": "uploaded"
              }
            )
            if (data.length - 1 == i) {
              resolve();
            }

          }
        }
        else {
          resolve();
        }
      }, err => {
        this.loadingService.loadingDismiss();
        this.isLoading = true;
        resolve();
      });
    });

  }
  _imageLoaded(ev: any) {
    let source = ev.srcElement;
    console.log(source);
  }

  checkNetwork() {
    this.networkService.checkNetworkStatus();
  }
  backPage() {
    this.navCtrl.navigateBack('merchandizing');
  }
  async selectimagePicker() {
    const actionsheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Gallery',
          icon: 'images-outline',
          cssClass: 'gallery',
          handler: () => {
            this.pickImage();
            // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, "gallery");
          }
        },
        {
          text: 'Take Photo',
          icon: 'camera-outline',
          handler: () => {
            // this.takePicture(this.camera.PictureSourceType.CAMERA, "camera");
            this.navCtrl.navigateForward('camera');
          }
        }
      ]
    });
    await actionsheet.present();
  }


  pathForImage(img) {
    if (img == null) {
      return '';
    }
    else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }


  options: any;
  async pickImage() {
    try {
      this.options = {
        maximumImagesCount: 30,
        quality: 60,
        width: 600,
        height: 600,
        outputType: 0,
      };
      this.imagePicker.getPictures(this.options).then(async (results) => {
        var s = 0;
        if (results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            let option = {
              uri: results[i],
              folderName: this.file.externalApplicationStorageDirectory + "Merchandizingimages",
              quality: 60,
              width: 600,
              height: 600,
            } as ImageResizerOptions;
            this.imageResizer
              .resize(option)
              .then(async (filePath: string) => {
                console.log('FilePath', filePath)
                this.base64.encodeFile(filePath).then(async (image: string) => {
                  s++;
                  var newFileName = this.util.getTodayDate() + this.util.getCurrentTime() + s + ".jpg";
                  var imageName = newFileName.replace(".jpg", "");
                  var filePath = this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign;
                  console.log("Encode Image " + image);

                  const base64Response = await fetch(image);
                  const blob = await base64Response.blob();

                  this.params.push(
                    {
                      "path": filePath + newFileName,
                      "name": imageName,
                      "img": image.replace("data:image/*;charset=utf-8;base64,", "data:image/jpeg;base64,"),
                      "status": "notUpload"
                    }
                  );
                  this.images.push({
                    "img": URL.createObjectURL(blob),
                    "name": imageName,
                    "status": "notUpload"
                  });
                  this.file.removeRecursively(this.file.externalApplicationStorageDirectory, "Merchandizingimages").then(entry => {
                    console.log("Entry Remove Dir ==" + JSON.stringify(entry));
                  }, err => {
                    console.log("Err Entry Remove Dir ==" + JSON.stringify(err));
                  });
                });
              })
              .catch(e => alert(e));
            this.createDirectory();
          }
        }
      }, (err) => {
        this.loadingService.loadingDismiss();
        alert(err);
      });
    }
    catch (err) {
      alert(err);
    }

  }

  takePicture(sourceType: PictureSourceType, type) {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 1800,
      targetHeight: 1500,
      sourceType: sourceType,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
    }
    this.camera.getPicture(options).then((imageData) => {
      if (type == "gallery") {
        var index = imageData.toString().indexOf("?");
        imageData = imageData.substring(0, index);
      }
      var newFileName = this.util.getTodayDate() + this.util.getCurrentTime() + ".jpg";
      console.log("1123-->" + newFileName + "____________");
      var imageName = newFileName.replace(".jpg", "");
      this.base64.encodeFile(imageData).then((base64File: string) => {
        console.log("images1214-->" + base64File);
        var filePath = this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign;
        this.params.push(
          {
            "path": filePath + newFileName,
            "name": imageName,
            "img": base64File.replace("data:image/*;charset=utf-8;base64,", "data:image/jpeg;base64,"),
            "status": "notUpload"
          }
        );
      }, (err) => {
        console.log("err-->" + JSON.stringify(err));
      });

      this.images.push({
        "img": this.webview.convertFileSrc(imageData),
        "name": imageName,
        "status": "notUpload"
      })
      console.log("imagesArray-->" + JSON.stringify(this.images));
      this.createDirectory();

    }, (err) => {
    });
  }
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  closePicture(index, data) {
    console.log("Index==>" + index);
    if (data.status === "uploaded") {
      if (this.images.length == 1) {

        this.merchandizingService.updateTaskStatus(this._task.taskId);


        this.offlineService.getMerchandizingTask(this.checkinShopdata.shopcode, this.util.getTodayDate()).then((res: any) => {
          if (res.data.length == 1) {
            this.offlineService.deleteMerchandizing(this.checkinShopdata.shopsyskey);
            this.nativeStorage.getItem("checkSteps").then(step => {
              var data: any = {
                "checkin": "true",
                "inventorycheck": step.inventorycheck,
                "merchandizing": "PENDING",
                "orderplacement": step.orderplacement,
                "date": this.util.getTodayDate()
              };
              var param = {
                "sessionId": sessionStorage.getItem('sessionid'),
                "task": {
                  "inventoryCheck": step.inventorycheck,
                  "merchandizing": "PENDING",
                  "orderPlacement": step.orderplacement,
                  "print": "INCOMPLETE"
                }
              }
              this.onlineService.setTask(param).subscribe(((val: any) => {
                if (val.status == "SUCCESS") {
                  this.nativeStorage.setItem("checkSteps", data);
                }
              }));
            });
          }
        });

        this.offlineService.deleteMerchTask(this.checkinShopdata.shopcode, this._task.brandId, this._task.taskId, this.util.getTodayDate()).then(res => {
          console.log("Delete merch task ==" + JSON.stringify(res));
        });

      }
      this.offlineService.deleteMerchImage(data.id, this.util.getTodayDate()).then(res => {
        this.offlineService.getMerchImage(this.checkinShopdata.shopcode, this.util.getTodayDate()).then(res_1 => {
          console.log("Res_1>>>" + JSON.stringify(res_1));
        });
      });
    }

    this.images.splice(index, 1);
    this.params.splice(index, 1);
  }
  createDirectory() {
    var dir = this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign + '/' + this._task.taskId;
    this.file.checkDir(this.file.externalApplicationStorageDirectory, dir)
      .then(_ => {
      })
      .catch(err => {
        console.log("errFile->" + JSON.stringify(err));
        this.file.createDir(this.file.externalApplicationStorageDirectory, this.checkinShopdata.shopsyskey, true).then(result => {
          this.file.createDir(this.file.externalApplicationStorageDirectory + this.checkinShopdata.shopsyskey, this.util.getTodayDate(), true).then(res => {
            this.file.createDir(this.file.externalApplicationStorageDirectory + this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate(), this._task.brandId, true).then(ress => {
              this.file.createDir(this.file.externalApplicationStorageDirectory + this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId, this._task.campaign, true).then(ress => {
                this.file.createDir(this.file.externalApplicationStorageDirectory + this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign, this._task.taskId, true).then(ress => {
                });
              });
            });
          })
        })
      });
  }
  upload() {

    this.loadingService.loadingPresent();

    //generate filepath
    var index = 0, filePath = this.checkinShopdata.shopsyskey + '/' + this.util.getTodayDate() + '/' + this._task.brandId + '/' + this._task.campaign + '/' + this._task.taskId;


    if (this.images.length > 0) {
      //addremark
      this.merchandizingService.addTaskRemark(this._task.taskId, this._task.remark);

      for (var i = 0; i < this.images.length; i++) {
        index = i;

        if (this.images[index].status == "notUpload") {
          if ((Number(this.images.length - 1)) == index) {

            //offline
            this.offlineService.deleteMerchTask(this.checkinShopdata.shopcode, this._task.brandId, this._task.taskId, this.util.getTodayDate()).then(res => {
              this.offlineService.insertMerchTask(this.checkinShopdata.shopcode, this._task.brandId, this._task.taskId, this._task.t1.toString(), this._task.t2, this._task.t3, this._task.taskCode, this._task.taskName, this.util.getTodayDate(), "uploaded", filePath, this._task.remark).then((res_task: any) => {

                this.params.filter(iobj => {
                  if (iobj.status == "notUpload") {
                    this.offlineService.insertMerchImage(this.checkinShopdata.shopcode, this._task.brandId, this._task.taskId, iobj.name, iobj.img, iobj.name, this._task.campaign, this.util.getTodayDate()).then((res: any) => {
                    });
                  }
                });

                //task saved status
                this.merchandizingService.setTaskStatus(this._task.taskId);

                console.log(".....");
                setTimeout(() => {
                  this.loadingService.loadingDismiss();
                  this.navCtrl.navigateBack('merchandizing');
                }, 1000);
              }, err => {
              });
            }, err => {
              console.log("error>>" + JSON.stringify(err));
            });
          }
        } else {
          if ((Number(this.images.length - 1)) == index) {
            this.loadingService.loadingDismiss();
            this.navCtrl.navigateBack('merchandizing');
          }

        }
      }
    }
    else {
      this.messageService.showToast("Please Select Photo");
      this.loadingService.loadingDismiss();
    }
  }

  async photoViewer(img, index) {
    console.log("index>>" + index);

    const modal = await this.modalCtrl.create({
      component: ImageViewerPage,
      componentProps: {
        src: img,
        index: index,
        taskCode: this._task.taskCode
      },
      // cssClass: 'ion-img-viewer',
      // keyboardClose: true,
      // showBackdrop: true
    });
    await modal.present();
    modal.onDidDismiss().then((dataReturned) => {
    });

  }
}
