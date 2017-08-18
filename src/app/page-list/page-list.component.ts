import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridPagesComponent } from './../shared/data-grid-pages/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-pages-list',
    templateUrl: './page-list.component.html',
    styleUrls: ['./../shared/data-grid/data-grid.component.scss']
})
export class PageListComponent implements OnInit {

    @ViewChild( DataGridPagesComponent ) dataGrid : DataGridPagesComponent;

    active : boolean;
    menuEnabled : boolean = true;

    constructor() {
        this.active = true;
    }

    ngOnInit() {}

    public onSearch = ( value ) : void => {
        this.dataGrid.onSearch( value, this.active );
    }

    public clearFilter = ( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }

    public closeAlert =() : void => {
        this.dataGrid.alert.status = false;
    }

    public setPerPage =( items : number ) : void => {
        this.dataGrid.changePerPage( items );
    }

}
