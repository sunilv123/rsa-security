import { Component } from '@angular/core';
import CryptoJS from 'crypto-js';
import {ApiService} from './api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr+Ne5MpDSi9mAkQCpQ6Rv2G6lnxSOobPBCw/ntdOAhClwZipFr2KITc+k1C7R0ATkZtgPJGt+TUc5zPhvqfD5szrgK9JZscYOqqQ9x278RTusl9PMDVxN0/vOE+wz8u7/A3YdOaG/2j/NriYdE0ufzDUVeEkDN8AGOP86blLsjwIDAQAB';

  model:any={
    "userName":"",
    "password":""
  }


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
  decrypt(encryptedData){

   // Decryption

   var encrypted = CryptoJS.enc.Base64.parse(encryptedData);
   var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
   var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
   let decryptedText = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
     { ciphertext: encrypted },
     key, 
     { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv }));
    console.log("decryptedText :: ==== "+decryptedText);
 }
  encrypt(text){

     var key = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
     var iv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
 
    return CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv }).toString();
     //console.log(encryptedData.toString());
 
  }

  onSubmit(){
    console.log(this.model)
       
      let model = this.encrypt(JSON.stringify(this.model));
   
     let url = "http://localhost:8084/api/security/login";

    this.apiService.postSerice(url, model)
    .subscribe(data => {
      console.log(data);
    });

  }

}
