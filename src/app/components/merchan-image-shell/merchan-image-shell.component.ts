import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-merchan-image-shell',
  templateUrl: './merchan-image-shell.component.html',
  styleUrls: ['./merchan-image-shell.component.scss'],
})
export class MerchanImageShellComponent implements OnInit {

  @HostBinding('class.img-loaded') imageLoaded = false;

  _src = '';
  _alt = '';

  @Input()
  set src(val: string) {
    this._src = (val !== undefined && val !== null) ? val : '';
  }



  constructor(public sanitizer: DomSanitizer,) {
  }

  _imageLoaded() {
    this.imageLoaded = true;
  }
  handleImgError(ev: any) {
    let source = ev.srcElement;
    let imgSrc = "assets/notfound.png";
    source.src = imgSrc;
  }
  ngOnInit() { }
}
