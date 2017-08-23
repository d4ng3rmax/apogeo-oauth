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

    menuEnabled : boolean = true;

    constructor() { }

    ngOnInit() {}

    public onSearch =( value ) : void => {
        this.dataGrid.onSearch( value, this.dataGrid.statusActive );
    }

    public searchByStatus =( value, status ) : void => {
        this.dataGrid.statusActive = status;
        this.dataGrid.onSearch( value, this.dataGrid.statusActive );
    }

    public clearFilter =( search ) : void => {
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
