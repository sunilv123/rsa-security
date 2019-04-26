import { Component, OnInit } from '@angular/core';
import CryptoJS from 'crypto-js';
import * as JsEncryptModule from 'jsencrypt';
import {ApiService} from './api.service';
import { Logs } from 'selenium-webdriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  //publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr+Ne5MpDSi9mAkQCpQ6Rv2G6lnxSOobPBCw/ntdOAhClwZipFr2KITc+k1C7R0ATkZtgPJGt+TUc5zPhvqfD5szrgK9JZscYOqqQ9x278RTusl9PMDVxN0/vOE+wz8u7/A3YdOaG/2j/NriYdE0ufzDUVeEkDN8AGOP86blLsjwIDAQAB';
  publicKey:string;
   key = 'u/Gu5posvwDsXUnV5Zaq4g==';
   iv = '5D9r9ZVzEYYgha93/aUK2w==';
  

  model:any={
    "userName":"",
    "password":""
  }

  submitResponse:any;

  submitted = false;


  constructor(private apiService : ApiService){
    
  //  //Encryption

  //   var text = "Hello, World! This is a Java/Javascript AES test.";
  //   var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
  //   var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');

  //   var encrypted = CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv });
  //   console.log(encrypted.toString());

  //   // Decryption

  //   var encrypted = CryptoJS.enc.Base64.parse('3Q7r1iqtaRuJCo6QHA9/GhkTmbl4VkitV9ZsD3K2VB7LuBNg4enkJUA1cF8cHyovUH2N/jFz3kbq0QsHfPByCg==');
  //   var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
  //   var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
  //   let decryptedText = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
  //     { ciphertext: encrypted },
  //     key, 
  //     { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv }));
  //    console.log("decryptedText :: ==== "+decryptedText);
     
  }

  jsEncrypt:any;
  randomUid:string;

  ngOnInit() {

    this.jsEncrypt = new JsEncryptModule.JSEncrypt();
   this.getPublicKey();

  }

  decrypt(encryptedData){

   // Decryption

   var encrypted = CryptoJS.enc.Base64.parse(encryptedData);
   
   let decryptedText = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
     { ciphertext: encrypted },
     CryptoJS.enc.Base64.parse(this.key), 
     { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: CryptoJS.enc.Base64.parse(this.iv) }));

    //console.log("decryptedText :: ==== "+decryptedText);

    return decryptedText;
 }
  encrypt(encryptedData){

    let plainText = CryptoJS.AES.encrypt(encryptedData, 
      CryptoJS.enc.Base64.parse(this.key), { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
       iv: CryptoJS.enc.Base64.parse(this.iv)  }).toString();

    console.log(encryptedData.toString());

    return plainText;
 
  }

  onSubmit(){
    console.log(this.model)
       
     let model = this.encrypt(JSON.stringify(this.model));


//var text = "This is another msg!";
//var ciphertext = this.jsEncrypt.encrypt(text);

      let data = {
      
         "payLoad":model,
         "randomUid":this.randomUid

      }
      
      console.log("data : "+JSON.stringify(data));
      

    this.apiService.postSerice(ApiService.apiList.saveLoginData, data)
    .subscribe(data => {
     // console.log(data);

      this.submitResponse = this.decrypt(data.payLoad);

      console.log("response : "+ this.submitResponse);
      
    });

  }

  getPublicKey(){
   //console.log(this.model)
       
  //  let model = this.encrypt(JSON.stringify(this.model));
   
    this.apiService.getSerice(ApiService.apiList.getPublickey)
    .subscribe(data => {
    //  console.log(data);
      this.publicKey = data.payLoad.publicKey;
      //console.log("publicKey : "+this.publicKey);
      
      this.jsEncrypt.setPublicKey(this.publicKey);

      //send AES info data
       this.sendAeKey();
    });

  }

sendAeKey()
{
 
  let data = {
    "key":this.key,
    "IV":this.iv
  }

  let payload = {
    "payLoad" : this.jsEncrypt.encrypt(JSON.stringify(data))
  }
  

  this.apiService.postSerice(ApiService.apiList.saveAesInfo, payload)
    .subscribe(data => {
     // console.log(data);
    });
  
}

}
