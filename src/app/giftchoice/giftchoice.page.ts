import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { MessageService } from '../services/Messages/message.service';

import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";


@Component({
  selector: 'app-giftchoice',
  templateUrl: './giftchoice.page.html',
  styleUrls: ['./giftchoice.page.scss'],
})


export class GiftchoicePage implements OnInit {

  chosen_multiple_gift: any;
  gifts: any;

  selected_gift_amount: number;
  total_gift_amount: number;

  check_gift_get_rule_type: any;

  isLoading: boolean = true;

  constructor(private modalCtrl: ModalController, private platform: Platform,
    private pickerContrl: PickerController,
    private msgService: MessageService) {
    this.isLoading = true;
  }


  ngOnInit() {

    /**
     *  gift.checked : If set to true that radio will be checked by default on component load.
     *
     **/

    this.gifts.map(giftlist => {

      /**
       *  `chosen_multiple_gift`
       */

      giftlist.isLoading = false;

      giftlist.map((gift, index) => {

        const check_chosen_gift_list = this.chosen_multiple_gift.filter(el => el.discountItemSyskey == gift.discountItemSyskey);

        if (check_chosen_gift_list.length > 0) {
          giftlist.checkedSyskey = gift.discountItemSyskey;
          giftlist.amount = check_chosen_gift_list[0].discountItemQty;
          gift.isChecked = true;
          gift.amount = check_chosen_gift_list[0].discountItemQty;
        }
        else {
          gift.isChecked = false;
          gift.amount = 1;
        }

        //Get Gift Rule Type
        if (gift.discountItemEndType == "END") {
          this.check_gift_get_rule_type = gift.discountItemRuleType;
        }



      });
    });

    this.selected_gift_amount = this.getSelectedGiftAmount();

    setTimeout(() => {
      this.isLoading = false;
      console.log(JSON.stringify(this.gifts));
    }, 800);
  }

  getSelectedGiftAmount() {
    const selected_amount = this.gifts.reduce((i, j) => i + Number(j.amount), 0);
    return selected_amount;
  }

  getSelectedGiftAmountTotalRule() { //Or Rule
    return new Promise(resolve => {

      this.gifts.map((giftlist, index) => {
        if (giftlist.length > 1) {
          const checked_giftlist = giftlist.filter(el => el.isChecked == true);
          const amount = checked_giftlist.reduce((i, j) => i + Number(j.amount), 0);
          giftlist.amount = amount;
        }

        if (this.gifts.length == index + 1) {
          resolve();
        }

      });
    });

  }

  async checkEvent(event, giftlist, gift) {

    giftlist.isLoading = true;
    const count = giftlist.filter(el => el.isChecked == true);
    console.log(event);

    if (count.length == 0) {
      event.target.checked = true;
    }
    console.log(gift);

    const awaitval = await this.getSelectedGiftAmountTotalRule();
    this.selected_gift_amount = await this.getSelectedGiftAmount();

    if (this.total_gift_amount < this.selected_gift_amount) {
      event.target.checked = false;
      this.msgService.showToast("Please check your qty! ")
    }

    giftlist.isLoading = false;

  }
  ionInput(event) {
  }



  async inputChange(event) {

    // event.target.value = Number(event.target.value.toString().replace(/[^0-9]*/g, ''));

    if (event.target.value.toString().startsWith('0')) {
      event.target.value = 1;
    }

    if (this.selected_gift_amount > this.total_gift_amount) {
      event.target.value = 1;
    }

    const awaitval = await this.getSelectedGiftAmountTotalRule();

    this.selected_gift_amount = await this.getSelectedGiftAmount();

  }

  async increaseAmount(giftlist) {

    if (this.selected_gift_amount < this.total_gift_amount) {
      giftlist.amount = 1 + Number(giftlist.amount);
    }

  }

  async decreaseAmount(giftlist) {
    if (giftlist.amount == 1) {
      return null;
    }

    giftlist.amount = Number(giftlist.amount) - 1;

  }

  async increaseAmountTotalRule(gift) {

    if (this.selected_gift_amount < this.total_gift_amount) {
      gift.amount = 1 + Number(gift.amount);
    }

  }

  async decreaseAmountTotalRule(gift) {
    if (gift.amount == 1) {
      return null;
    }

    gift.amount = Number(gift.amount) - 1;

  }

  dismiss() {

    if (this.check_gift_get_rule_type == 'Total Item') {
      //Check Qty
      if (this.selected_gift_amount < this.total_gift_amount) {
        return this.msgService.showToast('Need ' + (this.total_gift_amount - this.selected_gift_amount) + ' more gift');
      }
    }

    //Get Chosen Gift
    var chosen_gift_list = [];

    this.gifts.map(giftlist => {

      giftlist.map((gift, index) => {

        //Total Item and (Or) RUlE [--Checkbox--]
        if (this.check_gift_get_rule_type == 'Total Item' && giftlist.length > 1) {
          if (gift.isChecked) {
            gift.discountItemQty = Number(gift.amount);
            chosen_gift_list.push(gift);
          }
        } // Radio Btn
        else {
          if (giftlist.checkedSyskey == gift.discountItemSyskey) {
            gift.discountItemQty = Number(giftlist.amount);
            chosen_gift_list.push(gift);
          }
        }

      });
    });

    console.log(chosen_gift_list);
    this.modalCtrl.dismiss({
      'gifts': chosen_gift_list
    });
  }
}
