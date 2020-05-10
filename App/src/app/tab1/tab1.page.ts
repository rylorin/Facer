import { Component } from '@angular/core';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  private readonly baseUrl = 'http://vps183484.vps.ovh.ca:3000';
  photo: SafeResourceUrl;

  constructor(
      private sanitizer: DomSanitizer,
      private httpClient: HttpClient) {
      this.photo = '/assets/images/000000-0.1.png';
  }

//  uploadImages(contents): Promise<any[]> {
  async uploadImages(contents) {
    console.log('uploadImages/contents: ' + contents.webPath);
    const formData = new FormData();

    const response = fetch(contents.webPath);
    const blob = (await response).blob();

    console.log(typeof blob);
    console.log(blob);

    formData.append('photos', await blob, 'filename');

    
    
    this.httpClient.post(`${this.baseUrl}/image-upload`, formData).subscribe((value) => console.log(value));
    //this.httpClient.get('http://transport.opendata.ch/v1/connections?from=Lausanne&to=Gen%C3%A8ve').subscribe((value) => console.log(value));
// 	return this.httpClient.post<any[]>(`${this.baseUrl}/upload-photos`, formData).toPromise();
  }

  async sendImage(image) {
    console.log('sendImage/image.webPath: ' + image.webPath);
    console.log('Image :  ' + image);
    this.uploadImages(image);
    //fetch(image.webPath).then(res => console.log('sendImage/res:' + res));
    //fetch(image.webPath).then(res => console.log('sendImage/res.blob:' + res.blob()));
    //fetch(image.webPath).then(res => this.uploadImages(res.blob()));
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
    console.log('takePhoto/image.webPath: ' + image.webPath); //  http://localhost/_capacitor_file_/data/user/0/com.rylorin.camapp/cache/JPEG_...
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    this.sendImage(image);
  }

}
