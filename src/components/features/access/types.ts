export interface Schedule {
  time: string;
  days: boolean[];
}

export interface ScheduleData {
  title: string;
  weekdays: string[];
  schedules: Schedule[];
}

export interface ReservationButton {
  text: string;
  url: string;
}

export interface AccessStyles {
  container: {
    base: string;
  };
  storeInfo: {
    base: string;
  };
  map: {
    base: string;
  };
}
