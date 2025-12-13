declare module 'pondjs' {
  export interface TimeSeriesOptions {
    name?: string;
    columns: string[];
    points: number[][];
  }

  export class TimeSeries {
    constructor(options: TimeSeriesOptions);
    events(): Event[];
    timerange(): TimeRange;
    max(column: string): number | undefined;
  }

  export class TimeRange {
    constructor(begin: Date, end: Date);
    begin(): Date;
    end(): Date;
  }

  export class Event {
    timestamp(): number;
    get(column: string): number | undefined;
  }

  export class TimeRangeEvent {
    timestamp(): number;
    get(column: string): number | undefined;
  }
}

