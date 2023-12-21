export class NotificationTemplate {
    id: number;
    type: string;
    name: string;

    recipientType: number;
    recipientGroup: string;
    subject: string;
    frequency: string;
    body: string;

    nextRunDate: Date;
    lastRunDate: Date;

    lastRunStatus: string;
    includeCc: boolean;

    enabled: boolean;
    application: string;

    templateFields: Dictionary;

    // UI Only
    active: boolean = false;
}

interface Dictionary {
    [index: string]: string
}
