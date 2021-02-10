import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NavController, PopoverController, ModalController, LoadingController } from '@ionic/angular';
import { ReturnproudctPage } from '../returnproduct/returnproduct.page';
import { MerchTaskModalPage } from '../merch-task-modal/merch-task-modal.page';
import { FormControl } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

interface Fruit {
  id: string;
  name: string;
}
@Component({
  selector: 'app-order-placement-update',
  templateUrl: './order-placement-update.page.html',
  styleUrls: ['./order-placement-update.page.scss'],
})

export class OrderPlacementUpdatePage implements OnInit {
  idLine = new FormControl();
  linesList: Fruit[] = [];
  shopName: any;
  returnopen: any = true;
  segment: any = 1;
  jsonData: any = [];
  hide: any = false;
  data = [
    {
      list: ['sun', 'earth', 'moon']
    }
  ]
  qty: any;

  constructor(private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private loaders: LoadingController
  ) {
  }
  ngOnInit() {
    // this.checkNetwork();
  }

  simulateBackend(): Observable<Fruit[]> {
    return timer(3000).pipe(map(() => [
      { id: "a", name: "apple" },
      { id: "b", name: "banana" },
      { id: "c", name: "cherry" },
    ]));
  }

  fill(): void {
    this.loaders.create().then(loader => loader.present());
    this.simulateBackend().pipe(
      finalize(() => this.loaders.dismiss()))
      .subscribe(fruits => this.linesList = fruits);
  }
  click() {
    console.log("==" + JSON.stringify(this.shopName));

  }
  isNumberKey(event) {
    console.log(event);
    let charCode = event.keyCode;
    // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //   return false;
    // }
    // return true;
  }
  async openPopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: MerchTaskModalPage,
      cssClass: "taskModal"
    });
    await popover.present();
    var data = await popover.onDidDismiss();
    console.log("data>>" + JSON.stringify(data));
  }
  selectANumber() {

  }


  onInput($event: any) {
    // alert("2");
    // let theEvent = $event || window.event,
    //   key = theEvent.target.value,
    //   regex = /[0-9]+/g
    // if (!regex.test(key)) {
    //   let resp = $event.target.value.match(regex)
    //   $event.target.value = resp ? resp.join('') : ''
    // }
    // else {
    //   alert("hello")
    // }
  }
  getTotalPrice() {
  }
  inputChange(event, index) {
    // this.jsonData[index].amount = event.target.value;
    // var blankstatus = false;
    // if (event.target.value == "") {
    //   event.target.value = 1;
    //   blankstatus = true;
    // }

    // if (!blankstatus) {
    //   event.target.value = event.target.value;
    // }
    // // else{
    // product.amount = event.target.value;
    // event.target.value = event.target.value.replace(/[^0-9]*/g, '');
    // }
  }
  fun() {
    // this.load.loadingPresent();
    // setTimeout(() => {
    //   for (var i = 0; i < 10000; i++) {
    //     console.log("index" + i);
    //   }
    // }, 100);

  }
  // basic selection, setting initial displayed default values: '3' 'Banana'
  selectFruit() {

  }


  // more complex as overrides which key to display
  // then retrieve properties from original data
  selectNamesUsingDisplayKey() {

  }
  ionViewDidLoad() {
    alert("1");
  }
  change({ gIndex, iIndex }) {
    // console.log(gIndex, iIndex)
  }
  // checkNetwork() {
  //   // watch network for a disconnection
  //   let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
  //     console.log('network was disconnected :-(');
  //   });
  //   console.log(this.network.type);

  //   // stop disconnect watch
  //   disconnectSubscription.unsubscribe();
  //   this.networkService.checkNetworkStatus();
  // }

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
    // this._render.setStyle(this._elementRef.nativeElement, 'background', 'blue');
    // this._render.addClass(this._elementRef.nativeElement, 'segment');
    // console.log(this._elementRef.nativeElement);
  }

  toggleSection() {
    // this.returnopen = !this.returnopen;
  }

  save() {
    // var url = 'http://13.75.117.213:8084/mdoresponrif';
    // var path = this.RemoveLastDirectory(url);
    // alert(path.toString().replace(',,', '//'));
  }
  RemoveLastDirectory(url) {
    // var path = url.toString();
    // var the_arr = path.split('/');
    // the_arr.pop();
    // // var strippedPath = path.pop();  
    // return the_arr;
  }
  upload() {
    // var win = function (r) {
    //   console.log("Code = " + r.responseCode);
    //   console.log("Response = " + r.response);
    //   console.log("Sent = " + r.bytesSent);
    // }
    // var fail = function (error) {
    //   alert("An error has occurred: Code = " + error.code);
    //   console.log("upload error source " + error.source);
    //   console.log("upload error target " + error.target);
    // }
    // const fileTransfer: FileTransferObject = this.transfer.create();
    // var options = new FileUploadOptions();
    // options.fileKey = "file";
    // options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    // options.mimeType = "text/plain";
    // // var params = {
    // //   ""
    // // };
    // // params.value1 = "test";
    // // params.value2 = "param";

    // options.params = params;

    // var ft = new FileTransfer();
    // ft.upload(fileURL, encodeURI("http://some.server.com/upload.php"), win, fail, options);
  }
}
