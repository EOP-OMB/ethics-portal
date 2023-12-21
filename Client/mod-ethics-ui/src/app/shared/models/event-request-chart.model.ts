export class EventRequestChart {
    labels: string[];
    datasets: DataSet[];
}

export class DataSet {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    fill: boolean;
}
