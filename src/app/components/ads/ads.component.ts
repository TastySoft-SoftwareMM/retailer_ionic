import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit {

  @ViewChild('slideWithNav', { static: true }) slideWithNav: IonSlides;

  slider: any;
  slideOpts = {
    slidesPerView: 1.5,
    autoplay: true,
    spaceBetween: 10,
    zoom: false,
    resistanceRatio: 0.5,
  };

  constructor() {
    //Item object for Nature
    this.slider =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 20,
          img: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
        },
        {
          id: 15,
          img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
        },
        {
          id: 10,
          img: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1047&q=80'
        },
        {
          id: 12,
          img: 'https://images.unsplash.com/photo-1606851181064-b7507b24377c?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
        },
        {
          id: 5,
          img: 'https://images.unsplash.com/photo-1535990379313-5cd271a2da2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80'
        }
      ]
    };
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.slideWithNav.startAutoplay();
  }

  SlideDidChange(object, slideView) {
    slideView.startAutoplay();
    this.checkIfNavDisabled(object, slideView);
  }
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
}
