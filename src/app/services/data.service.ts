import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from './intercom.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OfflineService } from './offline/offline.service';
import { OnlineService } from './online/online.service';

@Injectable()
export class DataService {
    orgId: any;
    private jsonPath: string = '';
    companyObj: any;

    constructor(private http: HttpClient, private ics: IntercomService,
        private nativeStorage: NativeStorage,
        private onlineService: OnlineService) {
        this.jsonPath = 'assets/config/config.json';
        this.orgId = sessionStorage.getItem('orgId');
    }

    getConfig() {
        if (this.jsonPath != '' && this.jsonPath != null) {
            return this.http.get(this.jsonPath);
        } else {
            return null;
        }
    }

    login(username: string, password: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        let postparams = {
            username: username,
            password: password
        };
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
    }




}
