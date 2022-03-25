export class StateHelper {
    public static loadState(key: string): any {
        const opt = sessionStorage.getItem(key);

        if (opt) {
            return JSON.parse(opt);
        }

        return null;
    }

    public static saveState(key: string, obj: any): void {
        sessionStorage.setItem(key, JSON.stringify(obj));
    }
}
