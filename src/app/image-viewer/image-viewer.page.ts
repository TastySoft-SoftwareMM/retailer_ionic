import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NavParams, IonSlides, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MessageService } from '../services/Messages/message.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
})
export class ImageViewerPage implements OnInit {
  private photos: any[] = [];
  src: any;
  isLoading: any = false;
  index: any;
  taskCode: any;
  constructor(private modalCtrl: ModalController,
    private statusBar: StatusBar,
    private messageService: MessageService,
    public sanitizer: DomSanitizer) {
  }
  sliderOpts: any;
  segment: number;
  @ViewChild('slides', { static: false }) slider: IonSlides;
  ngOnInit() {
    console.log("images>>" + JSON.stringify(this.src));
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
        initialSlide: 1
      };
    }, 1000);
    // this.zoom(true);
  }
  zoom(zoomIn: boolean) {
    let zoom = this.slider.slideTo(2);
    // alert(zoom);
  }
  dismissModal() {
    this.modalCtrl.dismiss();
  }
  handleImgError(ev: any) {
    this.modalCtrl.dismiss();
    this.messageService.showToast("No image found");
  }
}
