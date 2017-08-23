import { Component, OnInit, Input } from '@angular/core';
import { Ng2SmartTableModule, ViewCell, LocalDataSource } from 'ng2-smart-table';

@Component({
    template: `
        <div class="check">
            <input
            type="checkbox" 
            name="checkbox{{ rowData.id }}" 
            id="checkbox{{ rowData.id }}" 
            class="ios-toggle" 
            (click)="saveStatus( rowData )" 
            [checked]="rowData.active" />
            <label for="checkbox{{ rowData.id }}" class="checkbox-label" data-off="" data-on=""></label>
        </div>
    `,
})
export class CheckboxComponent implements ViewCell, OnInit {
    
    saveStatus : any;
    row : any;

    @Input() value: string | number;
    @Input() rowData: any;
    @Input() source: any;

    constructor() {
        this.row = this.rowData;
    }
    
    ngOnInit() {
    }
    
}