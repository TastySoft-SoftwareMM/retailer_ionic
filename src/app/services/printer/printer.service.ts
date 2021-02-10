import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Injectable({
  providedIn: 'root'
})


export class PrinterService {

  constructor(private btSerial: BluetoothSerial) { }

  enableBT() {
    return this.btSerial.enable();
  }

  searchBT() {
    return this.btSerial.list();
  }

  connectBT(address) {
    return this.btSerial.connect(address);

  }
  printBT(data) {
    return this.btSerial.write(data);
  }
  disconectBT() {
    return this.btSerial.disconnect();
  }
}
