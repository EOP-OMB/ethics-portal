import { EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EthicsTeam } from '@shared/models/ethics-team.model';
import { PhonePipe } from '@shared/phone.pipe';
import { CardData } from '../../models/card-data.model';
import { EthicsForm } from '../../models/ethics-form.model';
import { TrainingVideo } from '../../models/training-video.model';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {

    @Input()
    title: string = "";

    @Input()
    records: any[] = [];

    @Input()
    totalRecords: number = 0;

    @Input()
    options: any[] = [];

    @Input()
    showRecordDate: boolean = false;

    @Output()
    selected = new EventEmitter<any>();

    cardData: CardData[] = [];

    constructor(private phonePipe: PhonePipe,
        private sanitizer: DomSanitizer) {
    }

    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.records && changes.records.currentValue.length > 0) {
            this.records.forEach(record => {
                if (record instanceof EthicsForm) {
                    this.mapEthicsForm(record);
                }
                else if (record instanceof EthicsTeam) {
                    this.mapEthicsTeam(record);
                }
                else if (record instanceof TrainingVideo) {
                    this.mapTrainingVideo(record);
                }
            });
        }
        this.cardData.forEach(x => this.sanitizer.bypassSecurityTrustHtml(x.data));
    }

    private mapEthicsForm(record: EthicsForm) {
        var data = new CardData();

        data.object = record;
        data.title = record.name;
        data.icon = record.formType == 'Form' ? 'text_snippet' : 'question_mark'
        data.cssClass = record.formType == 'Form' ? 'ethicsFormClass' : 'guidanceClass';
        data.data = record.description;
        data.date = record.modifiedTime;

        this.cardData.push(data);
    }

    private mapEthicsTeam(record: EthicsTeam) {
        var info = '';

        if (record.title)
            info += record.title + '<br />';
        if (record.org)
            info += record.org + '<br />';
        if (record.branch)
            info += record.branch + '<br />';
        if (record.email)
            info += "<a mailto='" + record.email + "'>" + record.email + "</a><br />";
        if (record.workPhone)
            info += this.phonePipe.transform(record.workPhone) + ' - Desk<br />';
        if (record.cellPhone)
            info += this.phonePipe.transform(record.cellPhone) + ' - Mobile';

        var data = new CardData();

        data.object = record;
        data.title = record.name;
        data.cssClass = "ethicsTeamClass";
        data.data = info;
        data.icon = record.isUser ? 'person' : 'email';
        data.date = record.modifiedTime;

        this.cardData.push(data);
    }

    private mapTrainingVideo(record: TrainingVideo) {
        var data = new CardData();

        data.object = record;
        data.title = record.title;
        data.cssClass = "trainingClass";
        data.icon = 'videocam';
        data.data = record.date;

        this.cardData.push(data);
    }

    public gotoDetail(rec: any): void {
        this.selected.emit(rec);
    }

    public showMore(): void {

    }

    public refresh(): void {

    }
}
