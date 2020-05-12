
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit,AfterViewInit {

  private readonly baseUrl = 'http://localhost:3000';
  // tslint:disable-next-line: ban-types
  return: Object;
  tester: any;

  constructor(/*private httpClient: HttpClient*/ private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special){
        this.tester = params.special;
      }
    });
  }

  ngOnInit() {


  }
  ngAfterViewInit(){
    // console.log(this.baseUrl);
    // this.httpClient.get(`${this.baseUrl}/list-images`).subscribe((value) => this.return = value);
  }

}
