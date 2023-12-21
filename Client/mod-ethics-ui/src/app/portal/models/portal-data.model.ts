import { DtoBase } from "mod-framework";

export class PortalData extends DtoBase {
    // base.id will be the current450Id
    current450Status: string = "";
    isOverdue: boolean = false;
    currentTrainingId: number = 0;
    pendingEvents: number = 0;
    pendingPositions: number = 0;
}
