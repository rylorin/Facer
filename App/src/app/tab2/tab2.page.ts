import { DataService } from './../services/data.service';
import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class Tab2Page implements OnInit {
  // tslint:disable-next-line: ban-types
  return: any = '';
  page = '';
  display = 0;

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private service: DataService, private pageTrans: NativePageTransitions) {
  }

  ionViewWillLeave() {
    document.getElementById('elem').innerHTML = '';
  }

  ionViewWillEnter() {
    this.page = this.service.getData('page');
    if (this.page) {
      this.display = 1;
      console.log(document.getElementById('elem'));
      document.getElementById('elem').innerHTML = this.page;
    }
  }

  ngOnInit() {
  }

  Scanner() {
    const options: NativeTransitionOptions = {
      direction: 'right',
      duration: 400,
      slowdownfactor: -1,
      iosdelay: 50
    };
    this.pageTrans.slide(options);
    this.router.navigate(['/tabs/tab1']);
  }

}
