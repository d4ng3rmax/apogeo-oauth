import { Component, OnInit } from '@angular/core';
// import { SurveyService } from './../shared/survey.service';
import { Subject } from 'rxjs/Rx';

//declare var $;

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
    // providers: [ SurveyService ]
})
export class QuestionListComponent implements OnInit {

    // survey : any;
    // public serviceUrl = 'https://apogeo-survey-svc.cfapps.io/questions';

    constructor( /*private surveyService : SurveyService*/ ) {
        // this.survey = this.surveyService;
        // this.survey.getResult();
    }

    ngOnInit() {
    }

}
