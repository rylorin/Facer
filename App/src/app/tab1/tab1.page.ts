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
 uploadImages(contents) {
	console.log('uploadImages/contents: ' + contents);
	const formData = new FormData();
	formData.append('photos', contents, 'filename');
    this.httpClient.post(`${this.baseUrl}/image-upload`, formData);
//	return this.httpClient.post<any[]>(`${this.baseUrl}/upload-photos`, formData).toPromise();
  }

  async sendImage(image) {
	console.log('sendImage/image.webPath: ' + image.webPath);
	this.uploadImages(image.webPath);
	fetch(image.webPath).then(res => console.log('sendImage/res:' + res));
	fetch(image.webPath).then(res => console.log('sendImage/res.blob:' + res.blob()));
	fetch(image.webPath).then(res => this.uploadImages(res.blob()));
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
