import { Injectable } from '@angular/core';

export interface Shop {
  id: number,
  status: string,
  address: string,
  shopsyskey: string,
  shopname: string,
  long: string,
  phoneno: string,
  zonecode: string,
  shopcode: string,
  teamcode: string,
  location: string,
  usercode: string,
  user: string,
  lat: string,
  email: string,
  username: string
}
const SHOP_KEY = "checkinShopdata";

@Injectable({
  providedIn: 'root'
})
export class CheckinshopService {

  constructor() { }



}
