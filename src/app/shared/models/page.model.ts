export class Page {
    id : number;
    title : string;
    active : boolean;
    questionOrders : Object;

    constructor( id : number, title : string, questionOrders: Object,  active? : boolean ) {
        this.id = id;
        this.title = title;
        this.questionOrders = questionOrders;
        this.active = active || false;
    }
}
