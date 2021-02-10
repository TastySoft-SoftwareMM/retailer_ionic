// import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { PrinterService } from '../printer/printer.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { MessageService } from '../Messages/message.service';

// @Injectable({
//   providedIn: 'root'
// })


export class PrintDataService {

  printData: any;
  // ************************************Printing*******************************************/



  //*************************************End************************************************/
  /*===========================*************  Print format code ******************=======================*/
  templateHeader: string = `
    {companyname}
    {companyphone}
    {termsandconditions}
                  **CASH SALES**
  
    Slip No : {invcode}              \t{deliveryDate}
    [Name] -----------------------[Qty]----- [KS]`;

  templateBody: string = `
    {inv.itemname}\t{inv.qty}\t{inv.netamount}.00`;

  templatefooter: string = `
    ---------------------------------------------
    Total                             \t{totalamt}.00
    ---------------------------------------------
    Paid By   {paytype}              \t{payamount}.00
    ---------------------------------------------
    Changed                            \t{change}.00
    ---------------------------------------------
    {thank}
  
                                                 `;
  //---------------- Delcalre Report Template ------------------------


  /*===========================*************  Print format code ******************=======================*/
  templateHeader1: string = `
  Slip No : {invcode}              \t{deliveryDate}
  [Name] -----------------------[Qty]----- [KS]`;

  templateBody1: string = `
  {inv.itemname}\t{inv.qty}\t{inv.netamount}.00`;

  templatefooter1: string = `
  ---------------------------------------------
  Total                             \t{totalamt}.00
  ---------------------------------------------
  Paid By   {paytype}              \t{payamount}.00
  ---------------------------------------------
  Changed                            \t{change}.00
  ---------------------------------------------
              
                                               `;
  //---------------- Delcalre Report Template ------------------------


  constructor(private storage: Storage, private bluetoothSerial: BluetoothSerial, private printProvider: PrinterService, private printer: Printer, private messageService: MessageService) {
    console.log('Hello PrintDataProvider Provider');
  }


  print(data, compname, phone, terms, totPrice, payType, change, slip, printdate, open, thanks, paid) {
    this.printer.check();
    // alert(payType);
    // if (this.printer.isAvailable()) {
    // console.log("Printer Available");
    // alert("CN > " + compname);
    // alert("DL > " + data.length);
    // for(let i = 0; i < data.length; i++){
    //   alert("S > " + data[i].stockName);
    // }
    // alert(data + "/" + compname + "/" + phone + "/" + terms + "/" + totPrice + "/" + payType + "/" + change + "/" + slip + "/" + printdate + "/" + open + "/" + thanks + "/" + paid);
    this.getHTML(data, compname, phone, terms, totPrice, payType, change, slip, printdate, open, thanks, paid);

    // }else{
    //   this.messagenOther.showMessage('Printer Connection Fail!', 2000);
    // }
  }
  print1(data, terms, totPrice, payType, change, slip, printdate, paid) {
    this.printer.check();

    this.getHTML1(data, terms, totPrice, payType, change, slip, printdate, open, paid);

    // }else{
    //   this.messagenOther.showMessage('Printer Connection Fail!', 2000);
    // }
  }
  // sales_item: any;
  getHTML(data, compname, phone, terms, totPrice, payType, change, slip, printdate, open, thanks, paid) {

    // alert(thanks);

    let vou: string = "";
    let hdr = this.templateHeader;
    hdr = hdr.replace('{title}', 'Invoice');
    var hcname = "" + compname;
    var clength = Math.trunc((hcname.length) / 2);
    console.log("Half ", clength + "and " + hcname);
    if (clength < 22) {
      var spacess = 22 - clength;
      console.log("space need amt " + spacess);

      if (spacess == 1) {
        hcname = "" + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 2) {
        hcname = " " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 3) {
        hcname = "  " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 4) {
        hcname = "   " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 5) {
        hcname = "    " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 6) {
        hcname = "     " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 7) {
        hcname = "      " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 8) {
        hcname = "       " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 9) {
        hcname = "        " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 10) {
        hcname = "         " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 11) {
        hcname = "          " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 12) {
        hcname = "           " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      } if (spacess == 13) {
        hcname = "            " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 14) {
        hcname = "             " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 15) {
        hcname = "              " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 16) {
        hcname = "               " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 17) {
        hcname = "                " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      } if (spacess == 18) {
        hcname = "                " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 19) {
        hcname = "                 " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 20) {
        hcname = "                  " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }
      if (spacess == 21) {
        hcname = "                   " + hcname;
        hdr = hdr.replace('{companyname}', hcname.substring(0, 40));
      }

    } else {
      hdr = hdr.replace('{companyname}', compname);
    }
    // ******************************************
    var hcphone = "Phone : " + phone;
    var cplength = Math.trunc((hcphone.length) / 2);
    console.log("Half phone ", cplength);
    if (cplength < 22) {
      var spacess = 22 - cplength;
      console.log("space need amt " + spacess);

      if (spacess == 1) {
        hcphone = "" + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 2) {
        hcphone = " " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 3) {
        hcphone = "  " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 4) {
        hcphone = "   " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 5) {
        hcphone = "    " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 6) {
        hcphone = "     " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 7) {
        hcphone = "      " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 8) {
        hcphone = "       " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 9) {
        hcphone = "        " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 10) {
        hcphone = "         " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 11) {
        hcphone = "          " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 12) {
        hcphone = "           " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      } if (spacess == 13) {
        hcphone = "            " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 14) {
        hcphone = "             " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 15) {
        hcphone = "              " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }
      if (spacess == 16) {
        hcphone = "               " + hcphone;
        hdr = hdr.replace('{companyphone}', hcphone.substring(0, 40));
      }

    } else {
      hdr = hdr.replace('{companyphone}', phone);
    }

    var hterms = "" + open;
    var clengthterm = Math.trunc((hterms.length) / 2);
    console.log("Half terms ", clengthterm + " : " + hterms);
    if (clengthterm < 22) {
      var spacess = 22 - clengthterm;
      console.log("space need amt " + spacess);

      if (spacess == 1) {
        hterms = "" + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 2) {
        hterms = " " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 3) {
        hterms = "  " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 4) {
        hterms = "   " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 5) {
        hterms = "    " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 6) {
        hterms = "     " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 7) {
        hterms = "      " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 8) {
        hterms = "       " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 9) {
        hterms = "        " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 10) {
        hterms = "         " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 11) {
        hterms = "          " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 12) {
        hterms = "           " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      } if (spacess == 13) {
        hterms = "            " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 14) {
        hterms = "             " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 15) {
        hterms = "              " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 16) {
        hterms = "               " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 17) {
        hterms = "                " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 18) {
        hterms = "                 " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      } if (spacess == 19) {
        hterms = "                  " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 20) {
        hterms = "                   " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }
      if (spacess == 21) {
        hterms = "                    " + hterms;
        hdr = hdr.replace('{termsandconditions}', hterms.substring(0, 44));
      }

    } else {
      hdr = hdr.replace('{termsandconditions}', open);
    }

    hdr = hdr.replace('{invcode}', slip);
    hdr = hdr.replace('{totalamt}', totPrice.toString());
    hdr = hdr.replace('{nettotal}', totPrice);
    //hdr = hdr.replace('{custcode}', this.custcode);
    hdr = hdr.replace('{deliveryDate}', printdate);
    vou = hdr;
    console.log("Here is the header " + hdr);


    for (let x = 0; x < data.length; x++) {
      let bdy = this.templateBody;

      // var stc = this.sales_item[x].Desc; //
      // var lenc = stc.length;

      /*============================desc======================*/
      var str = data[x].Desc;
      var len = str.length;
      console.log("length" + len);
      if (len < 30) {
        var space = 30 - len;
        console.log("space need " + space);
        str = str + "                           ";
        bdy = bdy.replace('{inv.itemname}', str.substring(0, 30));
      } else {
        //var pp = str.substring(0, 11);
        //bdy = bdy.replace('{inv.itemname}',pp);
        //str = pp +"\n     \t"+str.substr(11,11);
        // console.log ("Here is the footer " + str.substr(11,11) );
        bdy = bdy.replace('{inv.itemname}', str.substring(0, 19));
      }

      var qtyno = "" + data[x].Qty;
      qtyno = qtyno + " ";
      bdy = bdy.replace('{inv.qty}', qtyno.substring(0, 3));

      var tot = "" + data[x].lineTotal;
      var leng = tot.length;
      console.log("TTppTT ", leng);
      console.log("TTppTT to string ", tot);

      if (leng < 7) {
        var spacess = 7 - leng;
        console.log("space need amt " + spacess);

        if (spacess == 1) {
          tot = "" + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 2) {
          tot = " " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 3) {
          tot = "  " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 4) {
          tot = "   " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 5) {
          tot = "    " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 6) {
          tot = "     " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        console.log("TTTTTT ", tot);

      } else {
        bdy = bdy.replace('{inv.netamount}', data[x].lineTotal);
      }

      // bdy = bdy.replace('{inv.netamount}',this.sales_item[x].lineTotal);
      console.log("Here is the Body " + bdy);

      vou += bdy;

    }

    let fot = this.templatefooter;
    var ttamt = "" + totPrice;
    var ttlen = ttamt.length;
    if (ttlen < 7) {
      var ttspace = 7 - ttlen;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        ttamt = "" + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 2) {
        ttamt = " " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 3) {
        ttamt = "  " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 4) {
        ttamt = "   " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 5) {
        ttamt = "    " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 6) {
        ttamt = "     " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }

    } else {
      fot = fot.replace('{totalamt}', totPrice.toString());
    }

    var ptypeno = "" + payType;
    ptypeno = ptypeno + "       ";
    fot = fot.replace('{paytype}', ptypeno.substring(0, 10));
    var tpayamt = "" + paid;
    var ttlen1 = tpayamt.length;
    if (ttlen1 < 7) {
      var ttspace = 7 - ttlen1;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        tpayamt = "" + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 2) {
        tpayamt = " " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 3) {
        tpayamt = "  " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 4) {
        tpayamt = "   " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 5) {
        tpayamt = "    " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 6) {
        tpayamt = "     " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }

    } else {
      fot = fot.replace('{payamount}', paid.toString());
    }
    // fot = fot.replace('{payamount}', this.totPrice.toString() );
    // var fchange = parseFloat(change);
    // console.log("ffff", fchange.toFixed(2));
    var ttchge = "" + change;
    var ttch = ttchge.length;
    if (ttch < 7) {
      var ttspace = 7 - ttch;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        ttchge = "" + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 2) {
        ttchge = " " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 3) {
        ttchge = "  " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 4) {
        ttchge = "   " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 5) {
        ttchge = "    " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 6) {
        ttchge = "     " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }

    } else {
      fot = fot.replace('{change}', change.toString());
    }

    // ******************************************
    var fotthank = thanks;
    var fotlength = Math.trunc((fotthank.length) / 2);
    console.log("Half phone ", fotlength);
    if (fotlength < 22) {
      var tksp = 22 - fotlength;
      console.log("space need amt " + tksp);

      if (tksp == 1) {
        fotthank = "" + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 2) {
        fotthank = " " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 3) {
        fotthank = "  " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 4) {
        fotthank = "   " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 5) {
        fotthank = "    " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 6) {
        fotthank = "     " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 7) {
        fotthank = "      " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 8) {
        fotthank = "       " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 9) {
        fotthank = "        " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 10) {
        fotthank = "         " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 11) {
        fotthank = "          " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 12) {
        fotthank = "           " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      } if (tksp == 13) {
        fotthank = "            " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 14) {
        fotthank = "             " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 15) {
        fotthank = "              " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }
      if (tksp == 16) {
        fotthank = "               " + fotthank;
        fot = fot.replace('{thank}', fotthank.substring(0, 40));
      }

    } else {
      fot = fot.replace('{thank}', thanks.toString());
    }

    console.log("Here is the footer " + fot);
    vou += fot;


    this.printData = vou;
    console.log("print ===> Home ", vou);

    this.storage.get('printer').then((printer) => {
      console.log("=====================", printer);
      var printid = printer;
      if (printid == null || printid == "" || printid == undefined) {

      } else {
        console.log("PrintData >>>>>>", this.printData);
        let print = this.printProvider.connectBT(printer).subscribe(data => {

          this.bluetoothSerial.write(this.printData).then(dataz => {
            console.log("WRITE SUCCESS", dataz);
            this.messageService.showToast("Printed successfully");

            print.unsubscribe();
          }, errx => {
            console.log("WRITE FAILED", errx);
          });


        }, err => {
          // this.messagenOther.showMessage('Printer Connection Fail!', 2000);
          console.log("CONNECTION ERROR", err);
        });
      }
      // this.spcode = spcode;
    });



  }

  getHTML1(data, terms, totPrice, payType, change, slip, printdate, open, paid) {

    // alert(thanks);

    let vou: string = "";
    let hdr = this.templateHeader1;

    hdr = hdr.replace('{invcode}', slip);
    hdr = hdr.replace('{totalamt}', totPrice.toString());
    hdr = hdr.replace('{nettotal}', totPrice);
    //hdr = hdr.replace('{custcode}', this.custcode);
    hdr = hdr.replace('{deliveryDate}', printdate);
    vou = hdr;
    console.log("Here is the header " + hdr);


    for (let x = 0; x < data.length; x++) {
      let bdy = this.templateBody1;

      // var stc = this.sales_item[x].Desc; //
      // var lenc = stc.length;

      /*============================desc======================*/
      var str = data[x].Desc;
      var len = str.length;
      console.log("length " + len);
      if (len < 30) {
        var space = 30 - len;
        console.log("space need " + space);
        str = str + "                           ";
        bdy = bdy.replace('{inv.itemname}', str.substring(0, 30));
      } else {
        //var pp = str.substring(0, 11);
        //bdy = bdy.replace('{inv.itemname}',pp);
        //str = pp +"\n     \t"+str.substr(11,11);
        // console.log ("Here is the footer " + str.substr(11,11) );
        bdy = bdy.replace('{inv.itemname}', str.substring(0, 19));
      }

      var qtyno = "" + data[x].Qty;
      qtyno = qtyno + " ";
      bdy = bdy.replace('{inv.qty}', qtyno.substring(0, 3));

      var tot = "" + data[x].lineTotal;
      var leng = tot.length;
      console.log("TTppTT ", leng);
      console.log("TTppTT to string ", tot);

      if (leng < 7) {
        var spacess = 7 - leng;
        console.log("space need amt " + spacess);

        if (spacess == 1) {
          tot = "" + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 2) {
          tot = " " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 3) {
          tot = "  " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 4) {
          tot = "   " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 5) {
          tot = "    " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        if (spacess == 6) {
          tot = "     " + tot;
          bdy = bdy.replace('{inv.netamount}', tot.substring(0, 7));
        }
        console.log("TTTTTT ", tot);

      } else {
        bdy = bdy.replace('{inv.netamount}', data[x].lineTotal);
      }

      // bdy = bdy.replace('{inv.netamount}',this.sales_item[x].lineTotal);
      console.log("Here is the Body " + bdy);

      vou += bdy;

    }

    let fot = this.templatefooter1;
    var ttamt = "" + totPrice;
    var ttlen = ttamt.length;
    if (ttlen < 7) {
      var ttspace = 7 - ttlen;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        ttamt = "" + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 2) {
        ttamt = " " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 3) {
        ttamt = "  " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 4) {
        ttamt = "   " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 5) {
        ttamt = "    " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }
      if (ttspace == 6) {
        ttamt = "     " + ttamt;
        fot = fot.replace('{totalamt}', ttamt.substring(0, 7));
      }

    } else {
      fot = fot.replace('{totalamt}', totPrice.toString());
    }

    var ptypeno = "" + payType;
    ptypeno = ptypeno + "       ";
    fot = fot.replace('{paytype}', ptypeno.substring(0, 10));
    var tpayamt = "" + paid;
    var ttlen1 = tpayamt.length;
    if (ttlen1 < 7) {
      var ttspace = 7 - ttlen1;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        tpayamt = "" + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 2) {
        tpayamt = " " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 3) {
        tpayamt = "  " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 4) {
        tpayamt = "   " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 5) {
        tpayamt = "    " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }
      if (ttspace == 6) {
        tpayamt = "     " + tpayamt;
        fot = fot.replace('{payamount}', tpayamt.substring(0, 7));
      }

    } else {
      fot = fot.replace('{payamount}', paid.toString());
    }
    // fot = fot.replace('{payamount}', this.totPrice.toString() );
    // var fchange = parseFloat(change);
    // console.log("ffff", fchange.toFixed(2));
    var ttchge = "" + change;
    var ttch = ttchge.length;
    if (ttch < 7) {
      var ttspace = 7 - ttch;
      console.log("space need amt " + ttspace);

      if (ttspace == 1) {
        ttchge = "" + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 2) {
        ttchge = " " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 3) {
        ttchge = "  " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 4) {
        ttchge = "   " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 5) {
        ttchge = "    " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }
      if (ttspace == 6) {
        ttchge = "     " + ttchge;
        fot = fot.replace('{change}', ttchge.substring(0, 7));
      }

    } else {
      fot = fot.replace('{change}', change.toString());
    }

    console.log("Here is the footer " + fot);
    vou += fot;


    this.printData = vou;
    console.log("print ===> Home ", vou);

    this.storage.get('printer').then((printer) => {
      console.log("=====================", printer);
      var printid = printer;
      if (printid == null || printid == "" || printid == undefined) {

      } else {
        console.log("PrintData >>>>>>", this.printData);
        let print = this.printProvider.connectBT(printer).subscribe(data => {

          this.bluetoothSerial.write(this.printData).then(dataz => {
            console.log("WRITE SUCCESS", dataz);
            this.messageService.showToast("Printed successfully");
            print.unsubscribe();
          }, errx => {
            console.log("WRITE FAILED", errx);
          });
        }, err => {
          // this.messagenOther.showMessage('Printer Connection Fail!', 2000);
          console.log("CONNECTION ERROR", err);
        });
      }
      // this.spcode = spcode;
    });
  }
}
