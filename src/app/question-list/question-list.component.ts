import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DataGridComponent } from './../shared/data-grid/data-grid.component';
import { Subject } from 'rxjs/Rx';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./../shared/data-grid/data-grid.component.scss']
})
export class QuestionListComponent implements OnInit {

    @ViewChild( DataGridComponent ) dataGrid : DataGridComponent;

    active : boolean;
    menuEnabled : boolean = true;

    constructor() {
        this.active = true;
    }

    ngOnInit() {}

    public onSearch =( value ) : void => {
        this.dataGrid.onSearch( value, this.active );
    }

    public clearFilter =( search ) : void => {
        this.dataGrid.clearFilter();
        search.reset();
    }

    public closeAlert =() : void => {
        this.dataGrid.alert.status = false;
    }

}
