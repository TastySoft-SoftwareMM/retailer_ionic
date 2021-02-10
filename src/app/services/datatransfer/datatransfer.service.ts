import { Injectable } from '@angular/core';
import { OnlineService } from '../online/online.service';
import { OfflineService } from '../offline/offline.service';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {
  data: any;
  merchandizing: any = [];
  stockdata: any;
  invedata: any = [];
  amount: any = 1;
  checkinshop: any = [];
  constructor(private onlineService: OnlineService,
    private util: UtilService,
    private nativeStorage: NativeStorage,
    private offlineService: OfflineService) {
  }
  setData(data) {
    this.data = [];
    this.data = data;
  }
  getData() {
    return this.data;
  }
 
}
