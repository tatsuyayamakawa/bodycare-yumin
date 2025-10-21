import type { AccessStyles, ReservationButton, ScheduleData } from "./types";

export const accessData = {
  heading: "アクセス",
  subheading: "Access",
  address: {
    postal: "〒990-0851",
    location: "山形県山形市上椹沢195-2",
  },
  phone: "080-6294-5177",
};

export const reservationButton: ReservationButton = {
  text: "オンライン予約",
  url: "https://squareup.com/appointments/book/u0jc60b4z1ls1d/5G0J44Q57FF95/start",
};

export const scheduleData: ScheduleData = {
  title: "営業時間",
  weekdays: ["月", "火", "水", "木", "金", "土", "日"],
  schedules: [
    {
      time: "9:00～12:00",
      days: [true, true, true, false, true, true, true],
    },
    {
      time: "13:00～18:00",
      days: [true, true, true, false, true, true, true],
    },
  ],
};

export const accessStyles: AccessStyles = {
  container: {
    base: "mt-sm w-full flex flex-col items-center justify-between lg:flex-row gap-md",
  },
  storeInfo: {
    base: "w-full lg:w-1/2",
  },
  map: {
    base: "w-full lg:w-1/2",
  },
} as const;
