import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';
import { DomController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Directive({
  selector: '[parallaxHeader]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class ParallaxHeaderDirective {

  @Input('parallaxHeader') imagePath: string;
  @Input('parallaxHeight') parallaxHeight: number;

  private headerHeight: number;
  private mainContent: HTMLDivElement;
  private header: HTMLElement;
  colorOverlay: HTMLElement;
  stickyelement: HTMLElement;
  private scrollTop = new BehaviorSubject(0);



  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) { }

  ngAfterViewInit() {
    this.headerHeight = this.parallaxHeight;
  }

  onContentScroll(ev) {
    this.mainContent = this.element.nativeElement.querySelector('.main-content-wrapper');
    this.header = this.element.nativeElement.querySelector('.parallaxHeader');

    if ((this.header == null || this.header == undefined) || (this.mainContent == null || this.mainContent == undefined)) {
      return;
    }

    this.parallaxHeight = this.header.clientHeight
    this.headerHeight = this.parallaxHeight;

    this.domCtrl.read(() => {

      let translateAmt, scaleAmt;
      console.log("ScrollTop: " + (ev.detail.scrollTop - 300));

      // if (ev.detail.scrollTop > this.parallaxHeight + 500){
      //   this.domCtrl.write(() => {
      //     this.renderer.setStyle(this.mainContent, 'transform', 'translate3d(0, ' + '0' + 'px, 0');
      //   });
      //   return;
      // }


      // Already scrolled past the point at which the header  is visible
      if (ev.detail.scrollTop >= 0) {
        translateAmt = -(ev.detail.scrollTop / 2);
        scaleAmt = 1;
      } else {
        translateAmt = 0;
        scaleAmt = -ev.detail.scrollTop / this.headerHeight + 1;
      }


      // Parallax total progress
      var headerMinHeight = this.headerHeight / 2;
      let progress = (this.headerHeight - ev.detail.scrollTop - headerMinHeight) / (this.headerHeight - headerMinHeight);
      progress = Math.max(progress, 0);


      //Create DOM
      this.domCtrl.write(() => {
        this.renderer.setStyle(this.header, 'transform', 'translate3d(0,' + translateAmt + 'px,0) scale(' + scaleAmt + ',' + scaleAmt + ')');
        this.renderer.setStyle(this.mainContent, 'transform', 'translate3d(0, ' + (-ev.detail.scrollTop) + 'px, 0');
        this.renderer.setStyle(this.header, 'opacity', `${progress}`);
      });
    });
  }
}
