import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageViewerPage } from '../image-viewer/image-viewer.page';

@Component({
  selector: 'app-merch-modal-view',
  templateUrl: './merch-modal-view.page.html',
  styleUrls: ['./merch-modal-view.page.scss'],
})
export class MerchModalViewPage implements OnInit {
  images: any = [];
  taskCode: any;
  imgurl: any;
  constructor(private modalCtrl: ModalController) { }
  ngOnInit() {
    this.imgurl = localStorage.getItem('imgurl');
  }
  async photoViewer(images, index) {
    const modal = await this.modalCtrl.create({
      component: ImageViewerPage,
      componentProps: {
        src: images,
        index: index
      },
    });

    await modal.present();
    modal.onDidDismiss().then((dataReturned) => {
    });
  }

}
