import { Component, OnInit } from '@angular/core';
import { DatatransferService } from '../services/datatransfer/datatransfer.service';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-merch-task-modal',
  templateUrl: './merch-task-modal.page.html',
  styleUrls: ['./merch-task-modal.page.scss'],
})
export class MerchTaskModalPage implements OnInit {
  tasks: any = [];
  status: any;
  constructor(
    private dataTransferService: DatatransferService,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    if (this.status == "order") {
      for (var i = 0; i < 20; i++) {
        this.tasks.push(i + 1);
      }
      setTimeout(() => {
        for (var i = 20; i < 100; i++) {
          this.tasks.push(i + 1);
        }
      }, 1000);
    }
    else {
      for (var i = 0; i < 20; i++) {
        this.tasks.push(i);
      }
      setTimeout(() => {
        for (var i = 20; i < 101; i++) {
          this.tasks.push(i);
        }
      }, 1000);
    }

  }
  selectVal(val) {
    this.popoverCtrl.dismiss(val);
  }

}
