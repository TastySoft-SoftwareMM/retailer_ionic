import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NavParams, IonSlides, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MessageService } from '../services/Messages/message.service';


@Component({
  selector: 'app-stock-image-viewer',
  templateUrl: './stock-image-viewer.page.html',
  styleUrls: ['./stock-image-viewer.page.scss'],
})
export class StockImageViewerPage implements OnInit {
  src: any;
  stock: any;
  isLoading: any = false;
  index: any;
  sliderOpts: any;
  segment: number;

  @ViewChild('slides', { static: false }) slider: IonSlides;

  constructor(private modalCtrl: ModalController,
    private statusBar: StatusBar,
    private messageService: MessageService) { }

  ngOnInit() {
    console.log("images>>" + JSON.stringify(this.src));
    console.log("stocks == " + JSON.stringify(this.stock));

    setTimeout(() => {
      this.isLoading = true;
      this.sliderOpts = {
        zoom: {
          maxRatio: 3
        },
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        passiveListeners: false,
        initialSlide: this.index
      };
    }, 1000);
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";
    source.src = imgSrc;
  }

}
