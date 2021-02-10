import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-invoice-discount-detail',
  templateUrl: './invoice-discount-detail.page.html',
  styleUrls: ['./invoice-discount-detail.page.scss'],
})
export class InvoiceDiscountDetailPage implements OnInit {
  cart: any = [];
  invoicedetails: any = [];
  isLoading: boolean = false;
  @ViewChild("slides", { static: false }) slides;
  segment: number = 0;

  constructor(private modalCtrl: ModalController) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.invoicedetails = JSON.parse(JSON.stringify(this.cart));
    this.invoicedetails.map(async (bo, index) => {
      var uniques = new Set(bo.availableInvList.map(item => item.HeaderSyskey)), invbyheader = [];
      await uniques.forEach(async (header) => {
        var inv = bo.availableInvList.filter(el => el.HeaderSyskey == header);
        invbyheader.push({
          'HeaderDesc': bo.availableInvList.find(el => el.HeaderSyskey == header).HeaderDesc,
          'Inv': inv,
          'open': true
        })
      })
      bo.availableInvList = invbyheader;
      if (this.invoicedetails.length == index + 1) {
        setTimeout(() => {
          this.isLoading = false;
          // alert(JSON.stringify(bo.availableInvList));
        }, 500);
      }
    })
  }

  public async setSegment(activeIndex: Promise<number>) {
    this.segment = await activeIndex;
  }


  toggleBrandOwner(index) {
    this.invoicedetails[index].open = !this.invoicedetails[index].open;
  }
  toggleheaderClick(header) {
    header.open = !header.open;
  }
  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
