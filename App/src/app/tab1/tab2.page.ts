import { DomSanitizer } from '@angular/platform-browser';

import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';





@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab2Page implements OnInit, AfterViewInit {

  private readonly baseUrl = 'http://localhost:3000';
  // tslint:disable-next-line: ban-types
  return: any;

  display = 0;



  // tslint:disable-next-line: max-line-length
  constructor(/*private httpClient: HttpClient*/ private route: ActivatedRoute, private router: Router, private domSanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        console.log('Special Param : ' + params.special);
        this.return = this.domSanitizer.bypassSecurityTrustResourceUrl('http://localhost:3000/files?file=' + params.special);
        console.log(this.return);
        this.display = 1;

      }
    });
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
     // this.httpClient.get(`${this.baseUrl}/list-images`).subscribe((value) => this.return = value);
  }

}
