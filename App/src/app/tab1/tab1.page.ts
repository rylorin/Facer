import { DataService } from './../services/data.service';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';




const { Filesystem } = Plugins;



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  private readonly baseUrl = 'http://localhost:3000';
  // 'http://vps183484.vps.ovh.ca:3000';
  photo: SafeResourceUrl;

  error: any;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private service: DataService,
    private pageTrans: NativePageTransitions,
    private httpClient: HttpClient) {
    this.photo = '/assets/images/000000-0.1.png';
  }


  //  uploadImages(contents): Promise<any[]> {
  async uploadImages(contents: any) {
    console.log('uploadImages/contents: ' + contents.webPath);
    const formData = new FormData();

    const response = fetch(contents.webPath);
    const blob = await (await response).blob();

    console.log('uploadImages/typeof blob: ' + typeof blob);
    console.log('uploadImages/blob: ' + blob);

    formData.set('photos', blob, contents.webPath);

    console.log('uploadImages/this.httpClient.post');

    document.getElementById('loading').classList.add('load');
    document.getElementById('wrap').classList.add('wrapper');
    this.httpClient.post(`${this.baseUrl}/upload-photos`, formData).subscribe((value) => {
      console.log('uploadImages/post result: ' + value);

      document.getElementById('loading').classList.remove('load');
      this.error = '';
      if (value[0].match('no results') !== null) {
        console.log('no results');
        this.error = 'Pas de correspondance' ;
        } else if (value[0].match('Pas de visage') !== null){
          this.error = 'Pas de Visage' ;
        } else {
          this.httpClient.get(`${this.baseUrl}/files?file=${value}`, {responseType: 'text'}).subscribe((valuer) => {
            console.log('files/get result: ' + valuer);
            this.service.setData('page', valuer);
            const options: NativeTransitionOptions = {
              direction: 'left',
              duration: 400,
              slowdownfactor: -1,
              iosdelay: 50
            };
            this.pageTrans.slide(options);
            this.router.navigate(['/tabs/tab2']);
          });
        }



    }
      );
    this.httpClient.get(`${this.baseUrl}/list-images`).subscribe((value) => console.log('uploadImages/get result: ' + value));
    console.log('uploadImages/after post');



    //  return this.httpClient.post<any[]>(`${this.baseUrl}/upload-photos`, formData).toPromise();
  }

  async takePhoto() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    console.log('takePhoto/image.dataUrl: ' + image.dataUrl); // data:image/jpeg;base64,...
    console.log('takePhoto/image.path: ' + image.path); //  file:///data/user/0/com.rylorin.camapp/cache/JPEG_...
    console.log('takePhoto/image.webPath: ' + image.webPath);
    //  http://localhost/_capacitor_file_/data/user/0/com.rylorin.camapp/cache/JPEG_...
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    this.uploadImages(image);
  }
}
