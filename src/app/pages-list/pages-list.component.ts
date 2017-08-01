import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridPagesComponent } from './../shared/data-grid-pages/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-pages-list',
    templateUrl: './pages-list.component.html',
    styleUrls: ['./../shared/data-grid/data-grid.component.scss']
})
export class PagesListComponent implements OnInit {

    @ViewChild(DataGridPagesComponent) dataGrid : DataGridPagesComponent;

    constructor() { }
    ngOnInit() {}

    public onSearch = ( value ) : void => {
        this.dataGrid.onSearch( value );
    }

    public clearFilter = ( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }

}
