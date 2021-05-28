import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OfflineService } from '../offline/offline.service';
import { LoadingService } from '../Loadings/loading.service';
import { MessageService } from '../Messages/message.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { OnlineService } from '../online/online.service';
import { InventoryService } from '../inventory/inventory.service';
import { catchError } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { UtilService } from '../util.service';

@Injectable({
  providedIn: 'root'
})


export class CartService {
  stockdata = [];
  public cart = [];
  private returncart = [];
  private orderparam = [];
  private recommendstock = [];
  private promotionitems = [];
  private promotionitemHeader = [];
  private promotionitemHeaderCopy = [];

  pricezone = [];
  promoList: any = [];
  orderdetail: any = [];
  promotiongifts: any = [];
  categoryList: any = [];
  private cartItemCount = new BehaviorSubject(0);
  private cartItemCountOrderDetail = new BehaviorSubject(0);

  public multiple_skus = [];
  amount: any = 1;



  checkshopping: boolean = true;


  //checkout order
  orderdata: any;
  returnorderdata: any;
  constructor(private offlineService: OfflineService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private onlineService: OnlineService,
    private offlinseService: OfflineService,
    private inventoryService: InventoryService,
    private nativeStorage: NativeStorage,
    public utilService: UtilService) {
    this.offlineService.getStocks().then((res: any) => {
      console.log("GetStocks: " + JSON.stringify(res.data));

      this.stockdata = res.data;
      this.stockdata.filter(el => { el.promoItems = []; el.gifts = []; el.giftopen = true; });
    });
  }

  getInventory() {
    return this.offlineService.getInventory();
  }

  downloadPricezone(shopSyskey) {
    return new Promise(async (resolve) => {
      //Price Zone
      this.pricezone = [];
      this.inventoryService.pricezone = [];
      var param = {
        "shopSyskey": shopSyskey,
      };
      resolve();

      /**
       * Price Zone will use
       */
      this.onlineService.getPricezone(param).subscribe(async (res: any) => {
        console.log("Price Zone ---" + JSON.stringify(res));
        if (res.status == "SUCCESS" && res.list.length > 0) {
          res.list.map(item => {
            this.pricezone.push({
              'shopSyskey': shopSyskey,
              "pricezonelist": item.PriceZoneItemList
            });

            //inventory stock
            this.inventoryService.pricezone = item.PriceZoneItemList;
          })
        }
        else {
          this.pricezone = [];
        }

        resolve();
      }, err => {
        resolve();
      });

      /**
       * Price Zone will use
       */
    });
  }

  updateStockPriceByPriceZone() {
    return new Promise(resolve => {
      if (this.pricezone.length > 0) {
        //pricezone by shop
        this.pricezone[0].pricezonelist.map((zitem, index) => {
          console.log(zitem);
          this.stockdata.filter(item => item.syskey == zitem.StockSyskey).map(el => {
            el.price = zitem.ChangedPrice;
            console.log(el);
          });

          if (this.pricezone.length == index + 1) {
            console.log('..');
            resolve();
          }
        })
      }
      else {
        resolve();
      }
    })
  }

  //------------------------- Promotion Items By Shop  ----------------

  getPromotionItmes(shopSyskey) {
    return new Promise(resolve => {
      this.promotionitems = [];
      const stockPromise = new Promise((resolve32) => {

        this.offlineService.getStocks().then(async (res: any) => {
          this.stockdata = res.data;

          //checking addtocart
          this.cart.map(cart => {
            this.stockdata.filter(el => el.code === cart.code && cart.isactive !== 'no' && cart.statusqty !== "exp").map(val => {
              val.status = "addtocart";
            });
          })

          // update price zone 
          console.log('.');
          const anawait = await this.updateStockPriceByPriceZone();
          console.log('...');

          //updating stock price
          for (var i = 0; i < this.stockdata.length; i++) {
            this.stockdata[i].total = Number(this.stockdata[i].price) * Number(this.stockdata[i].amount);
          }
          this.stockdata.filter(el => { el.promoItems = []; el.gifts = []; el.giftopen = true; });

          resolve32("Success !");
        });
      })

      stockPromise.then((success) => {
        console.log("Products ---" + JSON.stringify(this.stockdata));
        var promoPrm = {
          "shopSyskey": shopSyskey,
          "headerSyskey": ''
        };
        this.onlineService.getPromotionItems(promoPrm).subscribe((data_1: any) => {
          console.log("Promotion items == " + JSON.stringify(data_1));


          if (data_1.list.length > 0) {
            this.promotionitems = data_1.list;
            //---promotion items
            data_1.list.map(itemlist => {
              this.stockdata.map(async stock => {

                await itemlist.itemList.map(async list => {
                  //Group Detail => Promotion Header
                  await list.HeaderList.map(async header => {


                    //Group Discount Item Qty & Get Rule TYpe
                    header.DetailList.map(detail => {
                      detail.InkindList.map(inkindList => {
                        const gift = inkindList.filter(el => el.DiscountItemEndType == "END");

                        if (gift.length > 0) {
                          detail.discountItemRuleType = gift[0].discountItemRuleType;
                          detail.DiscountItemQty = gift[0].DiscountItemQty; //total Gift Qty [*TOtal Item Rule]
                        }

                      })
                    })


                    var results = [];
                    var detailuniques = new Set(header.DetailList.map(item => item.PromoItemSyskey));

                    await detailuniques.forEach(prosyskey => {
                      results.push({
                        'PromoItemSyskey': prosyskey,
                        'PromoItemDesc': header.DetailList.find(d => d.PromoItemSyskey == prosyskey).PromoItemDesc,
                        'details': header.DetailList.filter(el => el.PromoItemSyskey == prosyskey)
                      });
                    });

                    console.log("Pro Detail list = " + JSON.stringify(results));

                    header.DetailList = results;
                  });

                  if (stock.syskey == list.PromoItemSyskey) {
                    stock.promoItems = list.HeaderList;
                    stock.promoItems.filter(el => el.open = true)
                  }
                });
              });
            })
          }
          else {
            this.promotionitems = [];
          }

          resolve("resolved");
          console.log("Stocks == " + JSON.stringify(this.stockdata));
        },
          err => {
            this.messageService.showNetworkToast(err);
            resolve('promodownloaderr');
          });
      });

    })
  }

  getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
    return indexes;
  }

  async getPromotion(syskey, searchterm) {
    var headerlist = [];
    this.promoList = [];
    this.promotionitemHeader = [];

    try {
      console.log("PromoItems:" + JSON.stringify(this.promotionitems));

      //------  Create Group By Stock [Start] -----
      const p = this.promotionitems.map((itemlist) => {
        var subitems = [];
        itemlist.itemList.map(list => {

          list.HeaderList.map(header => {
            console.log(header);

            //-------Promotion Session Header lvl
            const findHeader = headerlist.filter(el => el.HeaderSyskey == header.HeaderSyskey);

            if (findHeader.length) {
              //--- Check Promotion Syskey and Stock Syskey [Active Stock]
              var stock = this.stockdata.filter(el => el.syskey == list.PromoItemSyskey);
              if (stock.length > 0) {
                findHeader[0].stocks.push(stock[0]);
              }
            }
            else {
              headerlist.push(
                {
                  'HeaderDesc': header.HeaderDesc,
                  'HeaderSyskey': header.HeaderSyskey,
                  'stocks': this.stockdata.filter(el => el.syskey == list.PromoItemSyskey)
                }
              )
            }

          })
        });
      })

      const promisep = await Promise.all(p);

      console.log("PromHeader --" + JSON.stringify(headerlist));
      //------  Create Group By Stock [End] -----


      //------  Get Uniques Value [Start] -----
      var uniques = new Set(headerlist.map(item => item.HeaderSyskey)), promoHeaderList = [];
      await uniques.forEach(async (header) => {
        var stocks = headerlist.filter(el => el.HeaderSyskey == header), promoStocks = [];
        await stocks.map(stock => {
          stock.stocks.map(item => {
            if (promoStocks.length > 0) {
              const data = promoStocks.filter(el => el.syskey == item.syskey).length;
              if (data == 0) {
                promoStocks.push(item)
              }
            }
            else {
              promoStocks.push(item)
            }
          })
        })
        promoHeaderList.push({
          'HeaderDesc': headerlist.find(el => el.HeaderSyskey == header).HeaderDesc,
          'HeaderSyskey': header,
          "categoryOpen": false,
          "stocks": promoStocks,
        })

        this.promoList.push({
          'HeaderDesc': headerlist.find(el => el.HeaderSyskey == header).HeaderDesc,
          'HeaderSyskey': header,
        })
      })
      //------  Get Uniques Value [End] -----

      console.log("PromoHeaderlist --" + JSON.stringify(promoHeaderList));
      console.log("MultiPleSKUs:" + JSON.stringify(this.multiple_skus));

      // 

      if (this.multiple_skus.length > 0) {
        this.multiple_skus.map((multipromo, i) => {

          // promoHeaderList.map(proHea => {
          //   proHea.stocks.map((stock,i) =>{

          //   })
          // })

          var data: any = promoHeaderList.filter(el => el.HeaderSyskey == multipromo.HeaderSyskey);

          if (data.length > 0) {
            console.log("Test1:" + JSON.stringify(promoHeaderList));

            promoHeaderList.filter(el => el.HeaderSyskey == multipromo.HeaderSyskey).map((val) => {
              // val.multiple_skus_promo = [multipromo];
              multipromo.DetailList.filter(detail => {
                detail.rule.filter(async (stock, ri) => {
                  console.log("SS:" + JSON.stringify(stock));
                  const checkstock = val.stocks.find(el => el.syskey == stock.syskey);

                  if (checkstock) {
                    // const index = val.stocks.indexOf(stock.syskey);
                    console.log(val.stocks);

                    val.stocks.map((data, index) => {
                      if (data.syskey == stock.syskey) {
                        val.stocks.splice(index, 1);
                      }
                    });


                    this.stockdata.filter(el => el.syskey == stock.syskey).map(stockpro => {
                      stockpro.promoItems = [];
                    })
                    val.stocks.push(stock);
                  }
                  else {
                    console.log("2");
                    val.stocks.push(stock);
                  }
                })
              })
            })
          }
          else {
            var mPromoStocks = [];
            multipromo.DetailList.map(detail => {
              detail.rule.map(stock => {

                //remove single rule
                stock.promoItems = [];
                this.stockdata.filter(el => el.syskey == stock.syskey).map(p => {
                  console.log("111 ->" + JSON.stringify(p));


                  // promoHeaderList.map((h, i) => {
                  //   if (p.promoItems.length > 0) {
                  //     if (h.HeaderSyskey == p.promoItems[0].HeaderSyskey && h.stocks.length == 1) {
                  //       promoHeaderList.splice(i, 1);
                  //     }
                  //     h.stocks.map((stock_d, s_i) => {
                  //       if (stock_d.syskey == p.syskey) {
                           
                  //       }
                  //     });
                  //   }
                  // })

                  p.promoItems = [];
                });


                const checkstock = mPromoStocks.filter(el => el.syskey == stock.syskey);
                if (checkstock.length == 0) {
                  mPromoStocks.push(stock);
                }
              })
            });

            console.log("mPromoStocks:" + JSON.stringify(mPromoStocks));

            promoHeaderList.push({
              'HeaderDesc': multipromo.HeaderDesc,
              'HeaderSyskey': multipromo.HeaderSyskey,
              "categoryOpen": false,
              "stocks": mPromoStocks,
              // "multiple_skus_promo": [multipromo]
            });

            console.log("Test:" + JSON.stringify(promoHeaderList));

          }
        });
      }

      //Promotion Header Data
      this.promotionitemHeader = promoHeaderList;

      //--------    Searching Data   -------------
      console.log(syskey + '-------' + searchterm);
      var promotionByHeaders = [];
      // var copyPromotionHeader = JSON.parse(JSON.stringify(this.promotionitemHeader));
      var copyPromotionHeader = this.promotionitemHeader;


      console.log(JSON.stringify(copyPromotionHeader))
      if (syskey != '' && copyPromotionHeader.length > 0) {
        promotionByHeaders = copyPromotionHeader.filter(data => data.HeaderSyskey == syskey);

        promotionByHeaders[0].categoryOpen = true;
        console.log(promotionByHeaders);

        if (searchterm != '' && promotionByHeaders.length > 0) {

          promotionByHeaders[0].stocks = promotionByHeaders[0].stocks.filter((item) => {
            return (item.desc.toString().toLowerCase().indexOf(searchterm.toString().toLowerCase()) > -1);
          });

        }
      }
      else {
        promotionByHeaders = copyPromotionHeader;
      }

      return promotionByHeaders;
    } catch (error) {
      alert(error);
      return [];
    }


  }
  getPromotionHeaderListForDropDown() {
    return this.promoList;
  }


  //-------------------------MultipleSKUs -----------------------

  downloadMultipleSKUs(shopsyskey) {

    return new Promise(resolve => {
      this.multiple_skus = [];

      var params = {
        "shopSyskey": shopsyskey,
        "headerSyskey": ""
      }
      this.onlineService.getMultipleSKUs(params).subscribe((res: any) => {
        console.log('await multi: ' + JSON.stringify(res));

        if (res.list.length > 0) {
          var list = res.list;

          list.map(detailList => {
            var concatary = [];

            detailList.DetailList.map((detail, index) => {

              //Group Discount Item Qty & Get Rule TYpe

              detail.InkindList.map(inkindList => {
                const gift = inkindList.filter(a => a.DiscountItemEndType == "END");

                if (gift.length > 0) {
                  detail.discountItemRuleType = gift[0].discountItemRuleType;
                  detail.DiscountItemQty = gift[0].DiscountItemQty; //total Gift Qty [*TOtal Item Rule]
                }
              })


              const check_stock = concatary.filter(el => el.syskey == detail.PromoItemSyskey);

              this.stockdata.filter(el => el.syskey == detail.PromoItemSyskey).map(stock => {
                console.log("detail ->" + JSON.stringify(detail))

                stock.multiplePromo = detail;
                stock.RulePriority = detail.RulePriority;
                stock.RuleNumber = detail.RuleNumber;
                stock.HeaderDesc = detailList.HeaderDesc;
                stock.HeaderSyskey = detailList.HeaderSyskey;

                console.log("stock ->" + JSON.stringify(stock));
                concatary.push(JSON.parse(JSON.stringify(stock)));

                console.log("concatary ->" + JSON.stringify(concatary));
              });



              if (index + 1 == detailList.DetailList.length) {
                console.log("concatary1 ->" + JSON.stringify(concatary));
                detailList.DetailList = concatary;
              }

            })
          });

          console.log("list 21 ->" + JSON.stringify(list));

          this.multiple_skus = list;
          this.multiple_skus.map((val, index) => {
            val.open = false;
          });


          if (this.multiple_skus.length > 0) {
            this.multiple_skus.map(header => {

              const uniqueKeys = header.DetailList.filter(
                (temp => a =>
                  (k => !temp[k] && (temp[k] = true))(a.RulePriority + '|' + a.RuleNumber)
                )(Object.create(null))
              );

              var custom_detailList = [];
              uniqueKeys.map((rule, index) => {
                const stock = header.DetailList.filter(el => el.RulePriority == rule.RulePriority && el.RuleNumber == rule.RuleNumber);

                custom_detailList.push({
                  'rule': stock
                });

                if (index + 1 == uniqueKeys.length) {
                  header.DetailList = custom_detailList;

                  //--sorting => "End" type sort to last index
                  header.DetailList.map((detailist: any) => {
                    detailist.rule.sort((a, b) => Number(a.multiplePromo.EndType === "END") - 1)
                  });
                }
              });
            });
          }
          resolve();
        }
        else {
          resolve();
        }
      }, err => {
        resolve();
      });
    });

  }

  getMultipleSKUSPromoByStocksyskey(stockSyskey) {
    return new Promise(resolve => {
      var data = [];

      if (this.multiple_skus.length > 0) {
        this.multiple_skus.map((header, hi) => {
          console.log(header);
          var detail_List = [];

          if (header.DetailList.length > 0) {
            console.log("123 ->" + JSON.stringify(header.DetailList));


            header.DetailList.map((detail, di) => {
              console.log(detail);
              const rule = detail.rule.filter(el => el.syskey == stockSyskey);

              console.log("Rule:" + JSON.stringify(rule));

              if (rule.length > 0) {

                //Promotion Multiple of can't get => buy rule type = "Each" & endtype = "OR"
                // var checkendtypeORrule = detail.rule.filter(el => el.multiplePromo.EndType == "OR" && el.multiplePromo.RuleType == "Each" && el.multiplePromo.BuyType == "");
                // var checkForshowMultipleof = true;
                // if (checkendtypeORrule.length > 0) {
                //   checkForshowMultipleof = false;
                // }

                detail_List.push({
                  rule: detail.rule
                })

                if (header.DetailList.length == di + 1) {
                  data.push(
                    {
                      "HeaderDesc": header.HeaderDesc,
                      "HeaderSyskey": header.HeaderSyskey,
                      "open": false,
                      "DetailList": detail_List,
                      // "checkForshowMultipleof": checkForshowMultipleof
                    }
                  )
                }
              }


              if (hi + 1 == this.multiple_skus.length && di + 1 == header.DetailList.length) {
                resolve(data);
              }

            })
          }
          else {
            if (hi + 1 == this.multiple_skus.length) {
              resolve(data);
            }
          }
        })
      }
      else {
        resolve(data);
      }
    });
  }



  //------------------------- Promotion Items By Shop [end] ----------------

  //Note: Category group by   for only Orderplacement Page
  //--Type => "Promo":  for promotion items  And "Stock" : for other types
  getProducts(categoryCode, subCategoryCode, searchterm, typestatus) {
    var category;
    this.categoryList = [];

    if (categoryCode == "allstock" && subCategoryCode == "allstock") {
      category = new Set(this.stockdata.map(item => item.categoryCode))
    }
    else { //search data by code
      category = [categoryCode];
    }

    var count = 0, subcount = 0, results = [], categoryresults = [];
    category.forEach(cCode => {

      var sortedcategoryCodeArray = this.stockdata.filter(i => i.categoryCode === cCode);
      var subCategory, subdata = [], subcategoryresults = [];

      if (categoryCode == "allstock" && subCategoryCode == "allstock") {
        subCategory = new Set(sortedcategoryCodeArray.map(item => item.subCategoryCode))
      }
      else { //search data by subcode
        subCategory = [subCategoryCode];
      }
      subCategory.forEach((subCode, index) => {
        console.log(cCode + '------' + subCode + '----' + searchterm);

        var subopen = false;
        if (count == 0 && subcount == 0) {
          subopen = true;
        }

        var allsubCategoryList = [], subCategoryList = [];
        allsubCategoryList = this.stockdata.filter(i => i.subCategoryCode === subCode);
        console.log(allsubCategoryList);


        //get promotion items

        if (typestatus == "Promo") {
          allsubCategoryList = allsubCategoryList.filter(el => el.promoItems.length > 0);
        }


        //Search data by SubCode
        if (searchterm == "") {
          subCategoryList = allsubCategoryList; // all stocks
        }
        else {  //search data by keyworks
          subCategoryList = allsubCategoryList.filter((item) => {
            return (item.desc.toString().toLowerCase().indexOf(searchterm.toString().toLowerCase()) > -1);
          });
        }
        console.log(subCategoryList);
        //Search data by SubCode

        if (subCategoryList.length > 0) {
          subdata.push({
            subCategoryDesc: this.stockdata.find(s => s.subCategoryCode === subCode).subCategoryDesc,
            subCategoryOpen: subopen,
            subitems: subCategoryList
          });
        }

        if (categoryCode == "allstock" && subCategoryCode == "allstock") {
          subcategoryresults.push({
            "code": this.stockdata.find(s => s.subCategoryCode === subCode).subCategoryCode,
            "desc": this.stockdata.find(s => s.subCategoryCode === subCode).subCategoryDesc
          })
        }
        subcount++;
      })


      var open = false;
      if (count == 0) {
        open = true;
      }

      console.log("Subdata" + subdata.length);

      if (subdata.length > 0) {
        results.push({
          categoryDesc: this.stockdata.find(s => s.categoryCode === cCode).categoryDesc,
          categoryOpen: open,
          items: subdata
        });

        if (categoryCode == "allstock" && subCategoryCode == "allstock") {
          this.categoryList.push({
            "code": this.stockdata.find(s => s.categoryCode === cCode).categoryCode,
            "desc": this.stockdata.find(s => s.categoryCode === cCode).categoryDesc,
            'subCategoryList': subcategoryresults
          })
        }

      }

      count++;

      // console.log("Subdata == " + JSON.stringify(subdata));
    });

    // console.log("Results ===" + JSON.stringify(results));
    console.log("categoryList ==" + JSON.stringify(this.categoryList));


    return results;
  }

  //Note: Calculate Promotion Data [Will Return Gift list] => store gifts data [cache]
  storeGiftsCache(product) {
    this.stockdata.filter(el => el.code == product.code).map(val => {
      val.gifts = product.gifts;
    });
  }


  getStock(syskey) {
    return this.stockdata.filter(el => el.syskey == syskey).map(val => {
      return val;
    });
  }
  getStockName(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      return val.desc;
    });
  }
  getStockBrandOwnerCode(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      return val.brandOwnerCode;
    });
  }
  getPackSizeCode(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      return val.packSizeCode;
    });
  }
  getcategoryCode(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      return val.categoryCode;
    });
  }

  getsubCategoryCode(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      return val.subCategoryCode;
    });
  }

  getStockImg(stockcode) {
    return this.stockdata.filter(el => el.code == stockcode).map(val => {
      console.log("val>>" + JSON.stringify(val));
      return val.img;
    });
  }

  async getCart() {

    let status = sessionStorage.getItem("checkvisit");
    if (status == "false") {
      return this.cart.filter(el => el.statusqty == "sim" && el.isactive != "no");
    }
    else {
      return this.cart.filter(el => el.statusqty == "sim");
    }

  }

  getReturnCart() {
    let status = sessionStorage.getItem("checkvisit");
    if (status == "false") {
      return this.cart.filter(el => el.statusqty == "exp" && el.isactive != "no");
    }
    else {
      return this.cart.filter(el => el.statusqty == "exp");
    }
  }
  getAllCart() {
    return this.cart;
  }
  getCartItemCount() {
    return this.cartItemCount;
  }

  async setRecommendStock() {
    return new Promise(resolve => {
      this.recommendstock = [];
      this.nativeStorage.getItem("checkinShopdata").then((res: any) => {
        var shopsyskey = res.shopsyskey;
        var params = {
          "shopsyskey": shopsyskey,
        }
        this.onlineService.getRecommendStock(params).subscribe((res: any) => {
          if (res.list.length > 0) {
            res.list.filter(obj => {
              this.offlineService.getStockByStockCode(obj.stockSyskey).then((res: any) => {
                console.log("Recommend == " + JSON.stringify(res));
                res.data.filter(re => {
                  var status = "";
                  for (let p of this.cart) {
                    console.log(p.recommended);
                    if (p.recommended && p.code === re.code) {
                      status = "addtocart";
                      break;
                    }
                  }

                  this.stockdata.filter(el => el.code == re.code).map(val => {
                    this.recommendstock.push({
                      'id': re.id,
                      'syskey': val.syskey,
                      'img': re.img,
                      'desc': re.desc,
                      'code': re.code,
                      'brandOwnerName': re.brandOwnerName,
                      'brandOwnerSyskey': re.brandOwnerSyskey,
                      "whSyskey": re.whSyskey,
                      "status": status,
                      'price': re.price,
                      'amount': obj.avgQty,
                      'total': Number(re.price) * Number(obj.avgQty),
                      "categoryDesc": val.categoryDesc,
                      "subCategoryDesc": val.subCategoryDesc,
                      "packSizeCode": val.packSizeCode,
                      "categoryCode": val.categoryCode,
                      "subCategoryCode": val.subCategoryCode,
                      "promoItems": [],
                      "gifts": []
                    });
                  });

                });
                resolve();
              }, err => {
                console.log("Recommend Err == " + JSON.stringify(err));
                resolve();
              });
            })
          }
          else {
            resolve();
          }
        }, err => {
          this.messageService.showNetworkToast(err);
          resolve();
        });
      });
    });
  }

  getRecommendStocks(searchterm) {
    var recommend = [];
    if (searchterm != '') {

      recommend = this.recommendstock.filter((item) => {
        return (item.desc.toLowerCase().indexOf(searchterm.toLowerCase()) > -1);
      });
    }
    else {
      recommend = this.recommendstock;
    }
    return recommend;
  }

  addToCart(product, recommended) {
    let added = false;
    product.amount = Number(product.amount);
    product.status = "addtocart";

    this.stockdata.filter(el => el.syskey == product.syskey).map(val => {
      val.status = "addtocart";
    })
    if (product.amount == "") {
      product.amount = 1;
    }
    // this.amount = 0;

    //------ Calculation Volume Discount
    console.log("Afterdiscounttotal --" + product.afterDiscountTotal);

    var total = 0;


    total = Number(product.price) * Number(product.amount);
    console.log("Afterdiscounttotal --" + total + "--" + product.discountPercent);

    //------ Calculation Volume Discount


    for (let p of this.cart) {
      console.log("Cart: " + JSON.stringify(p));
      console.log("Products: " + JSON.stringify(product));

      if (p.code === product.code && p.statusqty === "sim" && p.isactive !== 'no') {
        added = true;
        p.recommended = recommended;
        this.cartItemCount.next(Number(this.cartItemCount.value) + Number(product.amount));
        (p.amount) = Number(p.amount) + product.amount;
        p.total = total;

        // if (p.multiplePromo) {
        //   this.checkingOrderProductIsMultipleSKU(p);
        // }
        break;
      }
    }

    //"2006230548337000329"

    if (!added) {  //new stock to cart
      var checkstatus = sessionStorage.getItem('checkvisit'); //check  order => update or insert
      if (checkstatus == null || checkstatus == undefined || checkstatus == "none" || checkstatus == "") {
        this.cart.push(
          {
            "id": product.id,
            "img": product.img,
            "desc": product.desc,
            "code": product.code,
            "brandOwnerCode": product.brandOwnerCode,
            "brandOwnerName": product.brandOwnerName,
            "brandOwnerSyskey": product.brandOwnerSyskey,
            "syskey": product.syskey,
            "whSyskey": product.whSyskey,
            "packSizeCode": product.packSizeCode,
            "categoryCode": product.categoryCode,
            "subCategoryCode": product.subCategoryCode,
            "categoryDesc": product.categoryDesc,
            "subCategoryDesc": product.subCategoryDesc,
            "price": product.price,
            "amount": Number(product.amount),
            "total": total,
            "discountPercent": product.discountPercent ? product.discountPercent : 0,
            "statusqty": 'sim',
            "recommended": recommended,
            "promoItems": product.promoItems,
            "gifts": product.gifts,
            "multiplePromo": product.multiplePromo,
            "HeaderSyskey": product.HeaderSyskey,
            "returnbrandsyskey": "0",
          }
        );
      }
      else {
        let equal = false;
        let val = { "syskey": "", "returnbrandsyskey": '' };
        this.cart.filter(obj => obj.brandOwnerSyskey == product.brandOwnerSyskey && obj.statusqty == "sim").map((data, key) => {
          equal = true;
          val.syskey = data.syskey;
          val.returnbrandsyskey = data.returnbrandsyskey;
        });
        if (!equal) {
          this.cart.push(
            {
              "id": product.id,
              "img": product.img,
              "desc": product.desc,
              "code": product.code,
              "brandOwnerCode": product.brandOwnerCode,
              "brandOwnerName": product.brandOwnerName,
              "brandOwnerSyskey": product.brandOwnerSyskey,
              "syskey": product.syskey,
              "whSyskey": product.whSyskey,
              "packSizeCode": product.packSizeCode,
              "categoryCode": product.categoryCode,
              "subCategoryCode": product.subCategoryCode,
              "categoryDesc": product.categoryDesc,
              "subCategoryDesc": product.subCategoryDesc,
              "price": product.price,
              "amount": product.amount,
              "total": total,
              "discountPercent": product.discountPercent ? product.discountPercent : 0,
              "returnbrandsyskey": "0",
              "statusqty": 'sim',
              "recommended": recommended,
              "promoItems": product.promoItems,
              "gifts": product.gifts,
              "multiplePromo": product.multiplePromo,
              "HeaderSyskey": product.HeaderSyskey,

            }
          );
        }
        else {
          this.cart.push(
            {
              "id": product.id,
              "img": product.img,
              "desc": product.desc,
              "code": product.code,
              "brandOwnerCode": product.brandOwnerCode,
              "brandOwnerName": product.brandOwnerName,
              "brandOwnerSyskey": product.brandOwnerSyskey,
              "syskey": product.syskey,
              "whSyskey": product.whSyskey,
              "packSizeCode": product.packSizeCode,
              "categoryCode": product.categoryCode,
              "subCategoryCode": product.subCategoryCode,
              "categoryDesc": product.categoryDesc,
              "subCategoryDesc": product.subCategoryDesc,
              "price": product.price,
              "amount": product.amount,
              "total": total,
              "discountPercent": product.discountPercent ? product.discountPercent : 0,
              "returnbrandsyskey": val.returnbrandsyskey,
              "statusqty": 'sim',
              "recommended": recommended,
              "promoItems": product.promoItems,
              "gifts": product.gifts,
              "multiplePromo": product.multiplePromo,
              "HeaderSyskey": product.HeaderSyskey
            }
          );
        }
      }

      this.cartItemCount.next(Number(this.cartItemCount.value) + Number(product.amount));
    }
  }

  addProduct(product) {
    product.amount = Number(product.amount);

    if (product.amount < this.utilService.maxLength) {
      product.amount += 1;
    }

    product.total = product.price * product.amount;


  }

  increaseProdctCart(product) {
    if (product.amount == "") {
      product.amount = 0;
    }

    for (let p of this.cart) {
      // this.amount += p.amount;
      if (p.code === product.code) {
        console.log("+Product ==" + JSON.stringify(product));
        this.cartItemCount.next(this.cartItemCount.value + 1);
        product.amount = Number(product.amount);


        if (product.amount < this.utilService.maxLength) {
          product.amount += 1;
        }
        product.total = product.price * product.amount;
        break;
      }
    }
  }

  decreaseProduct(product) {
    product.amount = Number(product.amount);
    product.amount -= 1;
    if (product.amount == 0 || product.amount == "" || product.amount == -1) {
      product.amount = 1;
    }
    product.total = product.price * product.amount;
  }

  decreaseProductCart(product) {
    for (let p of this.cart) {
      if (p.code === product.code) {
        product.amount = Number(product.amount);
        product.amount -= 1;
        if (product.amount == 0 || product.amount == "") {
          product.amount = 1;
        }
        else {
          this.cartItemCount.next(this.cartItemCount.value - 1);
        }
        product.total = product.price * product.amount;
        break;
      }
    }
  }

  deleteCart(product) {
    console.log("delcartlist>>" + JSON.stringify(this.cart));
    for (let [index, p] of this.cart.entries()) {
      console.log("p>>>" + JSON.stringify(p));
      if (p.id === product.id) {

        //order placement
        this.stockdata.filter(obj => obj.code == product.code).map(val => val.status = "");
        this.recommendstock.filter(obj => obj.code == product.code).map(val => val.status = "");
        this.multiple_skus.map(header => {
          header.DetailList.map(detail => {
            detail.rule.filter(obj => obj.syskey == product.syskey).map(val => val.status = "");
          })
        })

        //check stock ["Order Save" or "Order Update"]
        var status = sessionStorage.getItem('checkvisit');
        if (status == "false") {
          if (p.status == "saved") {
            p.isactive = "no";
            var d = new Date(), n = d.getTime();
            p.id = p.id + n;
          }
          else {
            this.cart.splice(index, 1);
          }
        }
        else {
          this.cart.splice(index, 1);
        }
        console.log("Cartitemcount>>" + this.cartItemCount.value + "=======" + "P.amount" + p.amount);

        this.cartItemCount.next(Number(this.cartItemCount.value) - Number(p.amount));
        product.amount = 1;
        console.log("p>>" + JSON.stringify(p));
        this.totalQty();
      }
    }
  }


  deleteExpcart(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        var status = sessionStorage.getItem('checkvisit');
        if (status == "false") {
          if (p.status == "saved") {
            p.isactive = "no";
            var d = new Date(), n = d.getTime();
            p.id = p.id + n;
          }
          else {
            this.cart.splice(index, 1)
          }
        }
        else {
          this.cart.splice(index, 1)
        }
        console.log("p>>" + JSON.stringify(p));
      }
    }
  }


  produceAmount() { //if i will click shopping cart save  i want to set product amount as 1
    this.stockdata.filter(obj => obj.amount = 1);
  }

  clearCart() {
    this.cart = [];
    this.cartItemCount.next(0);
    this.stockdata.filter(obj => obj.amount = 1);
    this.stockdata.filter(obj => obj.status = "");
    this.stockdata.filter(obj => obj.gifts = []);
  }

  //return product
  addToCartReturnProduct(product) {

    let added = false;
    if (product.amount == "") {
      product.amount = 0;
    }
    if (product.exp == "") {
      product.exp = 0;
    }

    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].code === product.code && this.cart[i].statusqty === "exp" && this.cart[i].isactive !== 'no') {
        this.cart.splice(i, 1);
        break;
      }
    }

    var d = new Date(), n = d.getTime();
    var checkstatus = sessionStorage.getItem('checkvisit');

    if (!added) {
      if (checkstatus == null || checkstatus == undefined || checkstatus == "none" || checkstatus == "") {
        this.cart.push(
          {
            "id": product.id + 'exp',
            "img": product.img,
            "desc": product.desc,
            "code": product.code,
            "brandOwnerName": product.brandOwnerName,
            "brandOwnerSyskey": product.brandOwnerSyskey,
            "whSyskey": product.whSyskey,
            "packSizeCode": product.packSizeCode,
            "categoryCode": product.categoryCode,
            "subCategoryCode": product.subCategoryCode,
            "categoryDesc": product.categoryDesc,
            "subCategoryDesc": product.subCategoryDesc,
            "price": product.price,
            "amount": product.expqty,
            "qty": product.qty,
            "total": Number(product.price) - Number(product.expqty),
            "statusqty": 'exp',
            "returnbrandsyskey": "0",
          }
        );
      }
      else {
        let val = { "syskey": "", "returnbrandsyskey": '' };
        let equal = false;
        this.cart.filter(obj => obj.brandOwnerSyskey == product.brandOwnerSyskey && obj.statusqty == "exp").map(data => {
          equal = true;
          val.syskey = data.syskey;
          val.returnbrandsyskey = data.returnbrandsyskey;
        });
        if (!equal) {
          this.cart.push(
            {
              "id": product.id + 'exp',
              "img": product.img,
              "desc": product.desc,
              "code": product.code,
              "brandOwnerName": product.brandOwnerName,
              "brandOwnerSyskey": product.brandOwnerSyskey,
              "whSyskey": product.whSyskey,
              "packSizeCode": product.packSizeCode,
              "categoryCode": product.categoryCode,
              "subCategoryCode": product.subCategoryCode,
              "categoryDesc": product.categoryDesc,
              "subCategoryDesc": product.subCategoryDesc,
              "price": product.price,
              "amount": product.expqty,
              "total": Number(product.price) - Number(product.expqty),
              "qty": product.qty,
              "returnbrandsyskey": "0",
              "statusqty": 'exp'
            }
          );
        }
        else {
          this.cart.push(
            {
              "id": product.id + 'exp',
              "img": product.img,
              "desc": product.desc,
              "code": product.code,
              "brandOwnerName": product.brandOwnerName,
              "brandOwnerSyskey": product.brandOwnerSyskey,
              "whSyskey": product.whSyskey,
              "packSizeCode": product.packSizeCode,
              "categoryCode": product.categoryCode,
              "subCategoryCode": product.subCategoryCode,
              "categoryDesc": product.categoryDesc,
              "subCategoryDesc": product.subCategoryDesc,
              "price": product.price,
              "amount": product.expqty,
              "qty": product.qty,
              "total": Number(product.price) - Number(product.expqty),
              "returnbrandsyskey": val.returnbrandsyskey,
              "statusqty": 'exp'
            }
          );
        }
      }
    }
  }

  totalQty() {
    this.cartItemCount.next(this.cart.filter(el => el.statusqty == "sim" && el.isactive != "no").reduce((i, j) => i + Number(j.amount), 0));
  }

  // if i used return name [amount == expqty]
  increaseReturnProduct(product) {
    if (product.exp == "") {
      product.exp = 0;
    }
    product.amount = Number(product.amount);
    if (product.amount < this.utilService.maxLength) {
      product.amount += 1;
    }

    product.total = Number(product.price) - Number(product.amount);
  }
  decreaseReturnProduct(product) {
    product.amount = Number(product.amount);
    if (product.amount == 0 || product.amount == "") {
      product.amount = 0;
      product.total = 0;
    }
    else {
      product.amount -= 1;
      product.total = Number(product.price) * Number(product.amount);
    }
  }

  setorderParam(data) {
    this.orderparam = [];
    this.orderparam.push(data);
  }

  getOrderParam() {
    return this.orderparam;
  }

  insertUpdateOrderParam() {
    this.orderparam.filter(obj => {
      obj.filter(bobj => {
        bobj.stockByBrand.push({

        });
      });
    });
  }
  updateOrderParam(param) {
    if (param) {
      this.checkshopping = true;
      sessionStorage.setItem("headersyskey", param.syskey);
      param.stockByBrand.filter(rbobj => {
        this.cart.filter(el => el.brandOwnerSyskey == rbobj.brandOwnerSyskey).map(updateval => {
          // updateval.bolvlsyskey = 
          // updateval.syskey = rbobj.brandOwnerLvlsyskey;
          rbobj.stockData.filter(rsobj => {
            this.cart.filter(cobj => cobj.code == rsobj.stockCode && cobj.statusqty == "sim").map(usval => {
              usval.returnsyskey = rsobj.detailLvlsyskey;
              usval.returnbrandsyskey = rbobj.brandOwnerLvlsyskey;
              usval.status = "saved";
            });
          });
          rbobj.stockReturnData.filter(rsrobj => {
            this.cart.filter(cobj => cobj.code == rsrobj.stockCode && cobj.statusqty == "exp").map(usval => {
              usval.returnsyskey = rsrobj.detailLvlsyskey;
              usval.returnbrandsyskey = rbobj.brandOwnerLvlsyskey;
              usval.status = "saved";
            });
          });
        });
      });
    }
    else {
      this.loadingService.loadingDismiss();
      this.messageService.showToast('Server Error [#230]');
    }
  }


  /******* For Order Update Condition [Shop temporycheckout] */
  addToCartOrder(data) {
    if (data.length > 0) {
      sessionStorage.setItem('printstatus', 'false');
      sessionStorage.setItem('checkvisit', "false");
      var count;
      data.filter(sobj => {
        sessionStorage.setItem("headersyskey", sobj.syskey);
        sessionStorage.setItem("ordercomment", sobj.comment);
        sobj.stockByBrand.filter(bobj => {
          if (bobj.stockData.length > 0) {
            count = bobj.stockData.reduce((i, j) => i + Number(j.qty), 0);
            this.cartItemCount.next(this.cartItemCount.value + Number(count));
            bobj.stockData.filter(obj => {
              this.stockdata.filter(el => el.code == obj.stockCode).map(async (val) => {
                val.status = "addtocart";
                var promoItems = [], gifts = [], multiplePromo: any;

                await this.promotionitems.map(itemlist => {
                  itemlist.itemList.map(async list => {
                    if (list.PromoItemSyskey == val.syskey) {
                      promoItems = list.HeaderList;
                    }
                  });
                });

                //multiple skus promo
                console.log("Multi:" + JSON.stringify(this.multiple_skus));

                this.multiple_skus.map(header => {
                  header.DetailList.map(detail => {
                    detail.rule.map(p => {
                      if (p.syskey == val.syskey) {
                        multiplePromo = p.multiplePromo;
                        promoItems = [];
                      }
                    })
                  })
                })


                //get promotion items 
                this.cart.push(
                  {
                    "id": val.id,
                    "img": val.img,
                    "desc": obj.stockName,
                    "code": obj.stockCode,
                    "brandOwnerCode": val.brandOwnerCode,
                    "brandOwnerName": val.brandOwnerName,
                    "brandOwnerSyskey": obj.brandOwnerSyskey,
                    "syskey": val.syskey,
                    "whSyskey": obj.wareHouseSyskey,
                    "packSizeCode": val.packSizeCode,
                    "categoryCode": val.categoryCode,
                    "subCategoryCode": val.subCategoryCode,
                    "price": Number(obj.normalPrice),
                    "amount": Number(obj.qty),
                    "total": this.utilService.fixedPoint(obj.totalAmount),
                    "promoItems": promoItems,
                    "gifts": gifts,
                    "discountPercent": obj.discountPercent ? obj.discountPercent : 0,
                    "returnbrandsyskey": bobj.syskey,
                    "returnsyskey": obj.syskey,
                    "statusqty": 'sim',
                    "status": "saved",
                    "categoryDesc": val.categoryDesc,
                    "subCategoryDesc": val.subCategoryDesc,
                    "multiplePromo": multiplePromo,
                    "HeaderSyskey": val.HeaderSyskey
                  }
                );
              });
            });
          }
          if (bobj.stockReturnData.length > 0) {
            bobj.stockReturnData.filter(obj => {
              this.stockdata.filter(el => el.code == obj.stockCode).map(val => {
                this.inventoryService.updateStockId(val.code, obj.syskey);

                for (var i = 0; i < this.cart.length; i++) {
                  if (this.cart[i].code === obj.stockCode && this.cart[i].statusqty === "exp" && this.cart[i].isactive !== 'no') {
                    this.cart.splice(i, 1);
                    break;
                  }
                }


                this.cart.push(
                  {
                    "id": val.id + "exp",
                    "img": val.img,
                    "desc": obj.stockName,
                    "code": obj.stockCode,
                    "brandOwnerCode": val.brandOwnerCode,
                    "brandOwnerName": val.brandOwnerName,
                    "brandOwnerSyskey": obj.brandOwnerSyskey,
                    "syskey": val.syskey,
                    "whSyskey": obj.wareHouseSyskey,
                    "packSizeCode": val.packSizeCode,
                    "categoryCode": val.categoryCode,
                    "subCategoryCode": val.subCategoryCode,
                    "price": Number(obj.price),
                    "amount": Number(obj.qty),
                    "total": Number(obj.price) * Number(obj.qty),
                    "returnbrandsyskey": bobj.syskey,
                    "returnsyskey": obj.syskey,
                    "statusqty": 'exp',
                    "status": "saved",
                    "categoryDesc": val.categoryDesc,
                    "subCategoryDesc": val.subCategoryDesc,
                  }
                );
              });
            });
          }
        });
      })
    }
    else {
      console.log("======");
      sessionStorage.removeItem('ordercomment');
    }
  }
  /****** For Order Detail [view only] */
  addOrderDetail(data, ordertype) {
    return new Promise(resolve => {
      this.orderdetail = this.promotiongifts = [];
      data.filter(hobj => {
        sessionStorage.setItem("orderdetailcomment", hobj.comment);
        hobj.stockByBrand.filter((bobj, b) => {
          this.promotiongifts.push({
            'brandOwnerSyskey': bobj.brandOwnerSyskey,
            'promotionList': bobj.promotionList
          })
          if (bobj.stockData.length > 0) {

            if (ordertype == "checkinorder") {
              var count = bobj.stockData.reduce((i, j) => i + Number(j.qty), 0);
              this.cartItemCountOrderDetail.next(this.cartItemCountOrderDetail.value + Number(count));
            }

            bobj.stockData.filter(sobj => {
              console.log("Data>>" + JSON.stringify(this.stockdata));
              this.stockdata.filter(el => el.code == sobj.stockCode).map(val => {
                console.log("val" + JSON.stringify(val));
                this.orderdetail.push({
                  "img": val.img,
                  "syskey": val.syskey,
                  "desc": sobj.stockName,
                  "code": sobj.stockCode,
                  "createddate": hobj.createddate,
                  "brandOwnerCode": val.brandOwnerCode,
                  "brandOwnerName": val.brandOwnerName,
                  "brandOwnerSyskey": sobj.brandOwnerSyskey,
                  "packSizeCode": val.packSizeCode,
                  "categoryCode": val.categoryCode,
                  "subCategoryCode": val.subCategoryCode,
                  "categoryDesc": val.categoryDesc,
                  "subCategoryDesc": val.subCategoryDesc,
                  "price": Number(sobj.normalPrice),
                  "amount": Number(sobj.qty),
                  "total": this.utilService.fixedPoint(sobj.totalAmount), //include discount
                  "statusqty": 'sim',
                  "discount": bobj.orderDiscountPercent,
                  'discountPercent': sobj.discountPercent ? sobj.discountPercent : 0,
                  'discountAmount': sobj.discountAmount,
                  "n2": this.utilService.fixedPoint(bobj.orderDiscountAmount),
                  "n3": bobj.returnDiscountAmount,
                  "gifts": sobj.promotionStockList,
                });
                console.log("OrderDetail>" + JSON.stringify(this.orderdetail));
              })


              //product not found
              var checkproduct = this.stockdata.filter(el => el.code == sobj.stockCode);
              if (checkproduct.length == 0 || checkproduct == null || checkproduct == undefined) {
                //brandowner checking
                const brandcount = this.stockdata.filter(el => el.brandOwnerSyskey == sobj.brandOwnerSyskey);

                if (brandcount.length > 0) {

                  this.orderdetail.push({
                    "img": 'null',
                    "syskey": sobj.stockSyskey,
                    "desc": sobj.stockName,
                    "code": sobj.stockCode,
                    "createddate": hobj.createddate,
                    "brandOwnerCode": brandcount[0].brandOwnerCode,
                    "brandOwnerName": brandcount[0].brandOwnerName,
                    "brandOwnerSyskey": sobj.brandOwnerSyskey,
                    "packSizeCode": 'N/A',
                    "categoryCode": 'N/A',
                    "subCategoryCode": 'N/A',
                    "categoryDesc": 'N/A',
                    "subCategoryDesc": 'N/A',
                    "price": Number(sobj.normalPrice),
                    "amount": Number(sobj.qty),
                    "total": this.utilService.fixedPoint(sobj.totalAmount), //include discount
                    "statusqty": 'sim',
                    "discount": bobj.orderDiscountPercent,
                    'discountPercent': sobj.discountPercent ? sobj.discountPercent : 0,
                    'discountAmount': sobj.discountAmount,
                    "n2": this.utilService.fixedPoint(bobj.orderDiscountAmount),
                    "n3": bobj.returnDiscountAmount,
                    "gifts": sobj.promotionStockList,
                  });

                }
                else {
                  this.orderdetail.push({
                    "img": 'null',
                    "syskey": sobj.stockSyskey,
                    "desc": sobj.stockName,
                    "code": sobj.stockCode,
                    "createddate": hobj.createddate,
                    "brandOwnerCode": 'N/A',
                    "brandOwnerName": 'N/A',
                    "brandOwnerSyskey": sobj.brandOwnerSyskey,
                    "packSizeCode": 'N/A',
                    "categoryCode": 'N/A',
                    "subCategoryCode": 'N/A',
                    "categoryDesc": 'N/A',
                    "subCategoryDesc": 'N/A',
                    "price": Number(sobj.normalPrice),
                    "amount": Number(sobj.qty),
                    "total": this.utilService.fixedPoint(sobj.totalAmount), //include discount
                    "statusqty": 'sim',
                    "discount": bobj.orderDiscountPercent,
                    'discountPercent': sobj.discountPercent ? sobj.discountPercent : 0,
                    'discountAmount': sobj.discountAmount,
                    "n2": this.utilService.fixedPoint(bobj.orderDiscountAmount),
                    "n3": bobj.returnDiscountAmount,
                    "gifts": sobj.promotionStockList,
                  });
                }

              }
            });
          }
          if (bobj.stockReturnData.length > 0) {
            bobj.stockReturnData.filter(sobj => {
              this.stockdata.filter(el => el.code == sobj.stockCode).map(val => {
                this.orderdetail.push({
                  "img": val.img,
                  "syskey": sobj.stockSyskey,
                  "desc": sobj.stockName,
                  "code": sobj.stockCode,
                  "brandOwnerCode": val.brandOwnerCode,
                  "brandOwnerName": val.brandOwnerName,
                  "brandOwnerSyskey": sobj.brandOwnerSyskey,
                  "packSizeCode": val.packSizeCode,
                  "categoryCode": val.categoryCode,
                  "subCategoryCode": val.subCategoryCode,
                  "categoryDesc": val.categoryDesc,
                  "subCategoryDesc": val.subCategoryDesc,
                  "price": sobj.price,
                  "amount": Number(sobj.qty),
                  "total": Number(sobj.price) * Number(sobj.qty),
                  "statusqty": 'exp',
                  "discount": bobj.orderDiscountPercent,
                  "n2": bobj.orderDiscountAmount,
                  "n3": bobj.returnDiscountAmount
                })
              })
            });
          }
        });

        resolve('success!');
      });
    })
    setTimeout(() => {
      console.log("OrderDetail>>>>>>" + JSON.stringify(this.orderdetail));
    }, 3000);
  }
  getOrderDetailSim() {
    return this.orderdetail.filter(el => el.statusqty == "sim");
  }

  getOrderDetailExp() {
    return this.orderdetail.filter(el => el.statusqty == "exp");
  }
  getPromotionGIfts() {
    return this.promotiongifts;
  }
  clearCartItemCountOrderDetail() {
    this.cartItemCountOrderDetail.next(0);
  }
  getCartItemCountOrderDetail() {
    return this.cartItemCountOrderDetail;
  }



  //-----Checkout Section
  updateCartByMultipleSKUsPromotion(cart: any, returnorderdata: any, multipromodata: any) {
    return new Promise(async (resolve) => {

      /*Two Condition  
        1. order will back with no return transaction 
        2. order will back with return lvl transaction [Order Confirm]
      */

      this.checkshopping = false;

      this.orderdata = JSON.parse(JSON.stringify(cart));
      this.returnorderdata = JSON.parse(JSON.stringify(returnorderdata));

      console.log(this.returnorderdata);

      await this.pricePromotionCheck(multipromodata);
      await this.giftPromotion();
      resolve();

    });
  }


  pricePromotionCheck(multipromodata) {
    return new Promise(async (resolve) => {
      if (this.orderdata.length > 0) {
        this.orderdata.map(async (bo) => {

          /**
           *  Gift
           **/

          if (multipromodata.giftList) {
            multipromodata.giftList.map(gift => {
              var total_gift_amount = 0;
              gift.stockList.map((stockkey, s_index) => {
                bo.child.filter(el => el.syskey == stockkey).map(val => {

                  val.gifts = [];
                  val.multigift = gift;

                  // Auto Selected Gift
                  val.chosen_multiple_gift = [];

                  var gift_amount_ary = [];

                  const giftInfoList_count = val.multigift.giftInfoList.length;
                  const end_gift = val.multigift.giftInfoList[giftInfoList_count - 1].filter(el => el.discountItemEndType == "END");


                  if (s_index == 0) {
                    total_gift_amount = end_gift[0].discountItemQty;
                  }


                  console.log("Total Gift Amount -> " + total_gift_amount);

                  val.total_gift_amount = Number(total_gift_amount);


                  val.multigift.giftInfoList.map((giftlist, giftlist_index) => {
                    //get itemendtype ["End"]

                    giftlist.map((gift, index) => {

                      if (end_gift[0].discountItemRuleType == "Total Item" && s_index == 0) {

                        //Calculate Gift Amount
                        const gift_quotient_amount = Math.floor(total_gift_amount / val.multigift.giftInfoList.length);
                        const gift_remainder_amount = total_gift_amount % val.multigift.giftInfoList.length;

                        console.log("Quotient ->" + gift_quotient_amount + ', Remainder ->' + gift_remainder_amount + ', Qty ->' + end_gift[0].discountItemQty + ', Length ->' + val.multigift.giftInfoList.length);

                        if (val.multigift.giftInfoList.length == giftlist_index + 1) {
                          gift.discountItemQty = gift_quotient_amount + gift_remainder_amount;
                        }
                        else {
                          gift.discountItemQty = gift_quotient_amount;
                        }
                      }

                      if (index == 0) {
                        val.chosen_multiple_gift.push(gift);
                      }

                    })
                  });
                });
              });
            });
          }

          /**
           * discount amount
           **/
          if (multipromodata.getPromoStockList) {
            multipromodata.getPromoStockList.map(promostock => {
              bo.child.filter(el => el.syskey == promostock.itemSyskey).map(stock => {
                if (Number(promostock.afterDiscountTotal) > 0) {
                  stock.discountPercent = promostock.discountPercent ? promostock.discountPercent : 0;
                  stock.total = promostock.afterDiscountTotal;
                }
              })
            });
          }
        });

        resolve();

      }
      else {
        resolve();
      }
    });
  }

  giftPromotion() {
    return new Promise(async (resolve) => {

      if (this.orderdata.length > 0) {
        this.orderdata.map(async (bo) => {
          var multiplePromoOnly = bo.child.filter(el => el.multiplePromo != undefined);
          var singleSKUs = bo.child.filter(el => el.multiplePromo == undefined);

          const uniqueKeys = multiplePromoOnly.filter(
            (temp => a =>
              (k => !temp[k] && (temp[k] = true))(a.multiplePromo.RulePriority + '|' + a.multiplePromo.RuleNumber + '|' + a.HeaderSyskey)
            )(Object.create(null))
          );

          console.log("UniqueKyes:" + uniqueKeys);

          var custom_detailList = [];

          // Multiple SKUs Promo
          const iPromiseData = new Promise(async (resolvei) => {
            if (uniqueKeys.length > 0) {
              uniqueKeys.map((rule, index) => {
                const stock = multiplePromoOnly.filter(el => el.multiplePromo.RulePriority == rule.multiplePromo.RulePriority && el.multiplePromo.RuleNumber == rule.multiplePromo.RuleNumber && el.HeaderSyskey == rule.HeaderSyskey);

                console.log("Stock: " + stock);

                custom_detailList.push({
                  'rule': stock
                });

                if (index + 1 == uniqueKeys.length) {

                  //--sorting => "End" type sort to last index
                  custom_detailList.map((detailist: any) => {
                    detailist.rule.sort((a, b) => Number(a.multiplePromo.EndType === "END") - 1)
                  });
                  resolvei();

                }
              });
            }
            else {
              resolvei();
            }

          });

          const iAwait = await iPromiseData;
          // Single SKUs
          if (singleSKUs.length > 0) {
            singleSKUs.map(stock => {
              custom_detailList.push({
                'rule': [stock]
              });
            })
          }

          bo.child = custom_detailList;
          resolve();

        });
      }
      else {
        resolve();
      }

    });
  }

}
