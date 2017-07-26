import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { ServerDataSource } from 'ng2-smart-table';

@Component({
    selector: 'data-grid',
    template: `
        <input #search class="search" type="text" placeholder="Search..." (keydown.enter)="onSearch(search.value)">
        <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>
    `,
    styleUrls: ['./data-grid.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DataGridComponent implements OnInit {

    @Input() settings : {};
    @Input() serviceUrl : string;
    actionType: number;
    userId: number;

    constructor( public http: Http ) {
        // this.source = new ServerDataSource(this.http, { endPoint: 'https://apogeo-survey-svc.cfapps.io/questions' });
    }

    ngOnInit() {
        this.source = new ServerDataSource(this.http, { endPoint: this.serviceUrl });
        this.actionType = 0;
    }

    source: ServerDataSource;

        confirmEdit =() : void => {
        console.info( "j2p" );
    }

    confirmSave =() : void => {
        console.info( "j4p" );
    }

}
