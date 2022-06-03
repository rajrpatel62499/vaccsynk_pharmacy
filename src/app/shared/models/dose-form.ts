export interface DoseForm { 
    totalForm: string,
    data: DoseFormData[];
}

export interface DoseFormData {
  clinicInfo: ClinicInfo;
  isActive: boolean;
  isDeleted: boolean;
  _id: string;
  doseNumber: string;
  patientId: PatientId;
  administrationDate: string;
  vaccine: string;
  VISDate: string;
  manufacturer: string;
  volume: string;
  lot: string;
  expDate: string;
  route: string;
  site: string;
  patientTemp: string;
  administrationName: string;
  administrationSignature: string;
  addedBy: string;
  createdAt: string;
  patientNumber:number;
  updatedAt: string;
  __v: number;
  
  facilityId?: string;
}
interface PatientId {
  name: string;
  mobile:string;
  _id: string;
}
interface ClinicInfo {
  clinicId: string;
  name: string;
  telephone: string;
  storeNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}