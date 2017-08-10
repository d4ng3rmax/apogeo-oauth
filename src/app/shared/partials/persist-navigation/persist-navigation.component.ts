import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'persist-navigation',
    templateUrl: './persist-navigation.component.html',
    styleUrls: ['./persist-navigation.component.scss']
})
export class PersistNavigationComponent implements OnInit {

    @Input() urlId : number;
    @Output() save = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    onSave =() : void => {
        this.save.emit();
    }

    onUpdate =() : void => {}

}
