import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { LoadingController } from '@ionic/angular';
import { LoadingService } from '../Loadings/loading.service';
import { MessageService } from '../Messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private network: Network,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {
    this.checkNetworkStatus();
  }

  checkNetworkStatus() {
    var flag = false;
    if (this.network.type == 'none') {
      return flag = false;
    }
    else {
      return flag = true;
    }
  }
  onoffline() {
    alert(1);
  }
}
