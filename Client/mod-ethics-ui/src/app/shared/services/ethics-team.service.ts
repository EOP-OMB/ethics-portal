import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ModPromiseServiceBase } from 'mod-framework';
import { EthicsTeam } from '../models/ethics-team.model';


@Injectable({
    providedIn: 'root'
})
export class EthicsTeamService extends ModPromiseServiceBase<EthicsTeam> {
    constructor(http: HttpClient) {
        super(http, environment.apiUrl, 'ethicsteam', EthicsTeam)
    }   
}
