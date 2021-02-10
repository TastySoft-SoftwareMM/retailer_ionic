import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MessageService } from '../services/Messages/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber:any;
  constructor(
    private router: Router,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  openVerifiedcode(){
    if(this.phoneNumber == "" || this.phoneNumber == undefined || this.phoneNumber == null){
      this.messageService.showToast("Please fill phone number.");
    }else{
      let navigationExtras: NavigationExtras = {
        queryParams: {
         "phoneNumber":this.phoneNumber
        }
      };
      this.router.navigate(['verified'],navigationExtras);
    }
  }

}
