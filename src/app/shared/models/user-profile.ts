export interface UserProfile {
    _id: string;
    email: string;
    mobile: string;
    pharmacyName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    faxNo: string;
    NCPDPNo: string;
    NPINo: string;
    pharmacistName: string;
    pharmacistEmail: string;
    pharmacistNpiNumber: string;
    timings: Timings;
    name: string;
    gender: string;
    birthdate: string;
    isClosed: boolean;
    stateLicenseNumber:string;
    noOfVaccinator: number;
    dosePerSlot: number;
  }
  
export interface Timings {
    Monday: DayInfo;
    Tuesday: DayInfo;
    Wednesday: DayInfo;
    Thursday: DayInfo;
    Friday: DayInfo;
    Saturday: DayInfo;
    Sunday: DayInfo;
  }
  
export interface DayInfo {
    maxDose: number;
    open: string;
    close: string;
    slots: Slot[];
    // noOfVaccinator: number;
    // dosePerSlot: number;
  }

  interface Slot {
    limit: number;
    _id: string;
    start: string;
    end: string;
  }