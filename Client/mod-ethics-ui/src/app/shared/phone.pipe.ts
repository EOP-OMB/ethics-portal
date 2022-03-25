import { Pipe } from "@angular/core";

@Pipe({
    name: "phone"
})
export class PhonePipe {
    transform(tel: any) {
        if (tel) {
            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var area, number;

            switch (value.length) {
                case 10:
                    area = value.slice(0, 3);
                    number = value.slice(3);
                    break;
                default:
                    return tel;
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return ("(" + area + ") " + number).trim();
        }

        return "";
    }
}
