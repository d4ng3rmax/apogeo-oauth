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
            (click)="saveStatus( rowData.id, rowData.question, rowData.active )" 
            [checked]="rowData.active" />
            <label for="checkbox{{ rowData.id }}" class="checkbox-label" data-off="Desativado" data-on="Ativo"></label>
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