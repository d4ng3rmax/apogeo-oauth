export class Pages {
    id : number;
    question : string;
    active : boolean;

    constructor( id : number, question : string, active? : boolean ) {
        this.id = id;
        this.question = question;
        this.active = active || false;
    }
}
