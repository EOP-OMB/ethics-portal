export class Helper {
    static addDays(date: Date, days: number): Date {
        date.setDate(date.getDate() + days);

        return date;
    }

    static daysBetween = function (date1: Date, date2: Date) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.ceil(difference_ms / one_day);
    }

    static formatDate(date: Date | null): string | null {
        var dateString: string | null = null;

        if (date) {
            dateString = Helper.format(date.getMonth() + 1, "00") + '/' + Helper.format(date.getDate(), "00") + '/' + date.getFullYear();
        }

        return dateString;
    }

    static getDate(value: string, useToday: boolean = false): Date | null {
        return value ? new Date(value) : useToday ? new Date() : null;
    }

    static getDaysSince(date: string) {
        let currentDate = new Date();
        let dateSent = Helper.getDate(date);

        if (!dateSent)
            return 0;

        return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
    }

    static format(value: number, format: string) {
        var s = format + value;

        s = s.substring(s.length - format.length);

        return s;
    }
}
