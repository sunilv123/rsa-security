import { Component } from '@angular/core';
import CryptoJS from 'crypto-js';
import * as JsEncryptModule from 'jsencrypt';
import {ApiService} from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  publicKey = '';
  aesKey = 'u/Gu5posvwDsXUnV5Zaq4g=='
  ivKey = '5D9r9ZVzEYYgha93/aUK2w=='
  jsEncrypt:any;
  isPublicAdded:boolean=false
  model:any={
    "userName":"",
    "password":""
  }

  submitted = false;

  constructor(private apiService : ApiService){

   this.jsEncrypt = new JsEncryptModule.JSEncrypt();
   this.handShake();
   
  }
  decrypt(encryptedData){

   var encrypted = CryptoJS.enc.Base64.parse(encryptedData);
   var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
   var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
     { ciphertext: encrypted },
     key, 
     { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv }));
  
 }
  encrypt(text){

     var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
     var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
 
    return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv }).toString();
  }


handShake(){

  this.apiService.getSerice(ApiService.URL.handShake)
  .subscribe(resp => {
    console.log("Handshake  : "+resp.payLoad);
    this.publicKey = resp.payLoad;
    this.jsEncrypt.setPublicKey(this.publicKey);
  });
  
}

  onSubmit(){

    let payload  = [];
    let obj = {
      "name":"",
      "email":"",
      "number":"",
      "address":""
    }
    for (let index = 0; index < 3; index++) {
     
      obj.name = "name"+index; 
      obj.number = "Number"+index; 
      obj.email = "email"+index; 
      obj.address = "address"+index; 

      payload.push(obj);
    }
   console.log(payload);
   

   console.log(this.model);
    let finalPayLoad = {
      "securityKey" : this.jsEncrypt.encrypt('u/Gu5posvwDsXUnV5Zaq4g=='),
      "securityIv" : this.jsEncrypt.encrypt('5D9r9ZVzEYYgha93/aUK2w=='),
      "payLoad" : this.jsEncrypt.encrypt(JSON.stringify(this.model))
    }
    
     //console.log(finalPayLoad)

    this.apiService.postSerice(ApiService.URL.login, finalPayLoad)
    .subscribe(resp => {
      console.log("Res  : "+JSON.stringify(resp));
      console.log(JSON.parse(this.decrypt(resp.payLoad)));
      
    });

  }
  

}
