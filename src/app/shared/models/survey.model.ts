export class Survey {
    id : number;
    title : string;
    pageOrder : Object;

    constructor( id : number, title : string, pageOrder: Object ) {
        this.id = id;
        this.title = title;
        this.pageOrder = pageOrder;
    }
}
