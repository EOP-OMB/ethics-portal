import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Settings } from '../../../shared/models/settings.model';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnChanges {

    @Input()
    settings: Settings = new Settings();

    @Output()
    save = new EventEmitter<Settings>();

    @Output()
    rollover = new EventEmitter<null>();

    public origSettings: Settings = new Settings();

    constructor() { }

    ngOnInit(): void {
        
    }

    ngOnChanges() {
        this.origSettings = JSON.parse(JSON.stringify(this.settings));
    }

    public isDirty(): boolean {
        return JSON.stringify(this.origSettings) != JSON.stringify(this.settings);
    }

    public saveSettings() {
        this.save.emit(this.settings);
    }

    public triggerAnnualFiling() {
        this.rollover.emit();
    }
}
