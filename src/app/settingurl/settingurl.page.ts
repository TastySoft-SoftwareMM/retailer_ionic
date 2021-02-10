import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { IntercomService } from '../services/intercom.service';
import { MessageService } from '../services/Messages/message.service';

@Component({
  selector: 'app-settingurl',
  templateUrl: './settingurl.page.html',
  styleUrls: ['./settingurl.page.scss'],
})
export class SettingurlPage implements OnInit {
  url: any;
  btnDisabled: any = true;

  constructor(
    public ics: IntercomService,
    public router: Router,
    public route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.url = this.ics.apiurl
  }
  ngOnInit() {

  }
  update() {
    this.btnDisabled = false;
  }
  save() {
    if (this.url == "" || this.url == undefined || this.url == null) {
      this.messageService.showToast("Please, fill URL");
    } else {
      this.ics.apiurl = this.url;
      localStorage.setItem("url", this.url);
      // var url = this.RemoveLastDirectory(this.url); 
      // var url = "http://52.255.142.115:8084";
      var url = this.url.substring(0, this.url.lastIndexOf('/'));
      var suburl = url.substring(0, url.lastIndexOf('/')) + "/";
      console.log("url>>>" + suburl);
      localStorage.setItem("imgurl", suburl);
      this.router.navigate(['/login_username']);
    }
  }
  RemoveLastDirectory(url) {
    var path = url.toString();
    var the_arr = path.split('/');
    the_arr.pop();
    return the_arr;
  }
}
