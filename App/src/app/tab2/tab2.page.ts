import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit, AfterViewInit {
	// tslint:disable-next-line: ban-types
	return: Object;
	tester: any;

	constructor(private route: ActivatedRoute, private router: Router) {
		this.route.queryParams.subscribe(params => {
			if (params && params.special) {
				console.log('tab2: ' + params.special);
				this.tester = params.special;
			}
		});
	}

	ngOnInit() {

	}

	ngAfterViewInit() {

	}

}
