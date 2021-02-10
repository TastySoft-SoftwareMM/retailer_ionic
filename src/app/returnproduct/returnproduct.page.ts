import { Component, OnInit } from '@angular/core';
// import { CartService } from '../services/cart/cart.service';
// import { OfflineService } from '../services/offline/offline.service';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from '../services/Messages/message.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-returnproduct',
  templateUrl: './returnproduct.page.html',
  styleUrls: ['./returnproduct.page.scss'],
})
export class ReturnproudctPage implements OnInit {
  // data: any = [];
  // cartItemCount: BehaviorSubject<number>;
  // isLoading: any = false;
  constructor(
    private messageService: MessageService,
    private navCtrl: NavController) { }
  ngOnInit() {
  }
}
