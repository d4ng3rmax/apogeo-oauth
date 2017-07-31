import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridComponent } from './../shared/data-grid/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

    @ViewChild(DataGridComponent) dataGrid : DataGridComponent;

    constructor() {}
    ngOnInit() {}

    public onSearch = ( value ) : void => {
        this.dataGrid.onSearch( value );
    }

    public clearFilter = ( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }
}
