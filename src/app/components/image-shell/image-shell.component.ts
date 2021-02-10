import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-image-shell',
  templateUrl: './image-shell.component.html',
  styleUrls: ['./image-shell.component.scss'],
})
export class ImageShellComponent implements OnInit {
  @HostBinding('class.img-loaded') imageLoaded = false;

  _src = '';
  _alt = '';

  @Input()
  set src(val: string) {
    this._src = (val !== undefined && val !== null && val !== 'null') ? val : '';
  }

  @Input()
  set alt(val: string) {
    this._alt = (val !== undefined && val != null && val !== 'null') ? val : '';
  }

  constructor() { }

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
