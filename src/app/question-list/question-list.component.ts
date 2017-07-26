import { Component, OnInit } from '@angular/core';
import { SurveyService } from './../shared/survey.service';
declare var $;

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss'],
    providers: [ SurveyService ]
})
export class QuestionListComponent implements OnInit {

    survey : any;

    constructor( private surveyService : SurveyService ) {
        this.survey = this.surveyService;
    }

    ngOnInit() {
        this.survey.getResult();

        setTimeout( () => {
            $( function() {
                $( "#tblQuestions" ).DataTable();
            });
        }, 2000);
    }

}
