
export  interface FacilityForm {
    data: FacilityFormData[];
    totalForm: number;
  }
  

 export interface FacilityFormData {
   dose: string;
    nextOfKin: NextOfKin;
    patientInfo: PatientInfo;
    prescriptionInsurance: PrescriptionInsurance;
    medicalIns: MedicalIns;
    uninsured: Uninsured;
    potentialContradiction: PotentialContradiction;
    potentialConsiderationFirst: PotentialConsiderationFirst;
    potentialConsiderationSecond: PotentialConsiderationSecond;
    requestType: string;
    insCardFront: string;
    insCardBack: string;
    govIssuedId: string;
    signature: string;
    isVerified: boolean;
    _id: string;
    lastname: string;
    firstname: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    PCPname: string;
    PCPmobile: string;
    PCPfaxnumber: string;
    PCPaddress: string;
    PCPcity: string;
    PCPstate: string;
    PCPzip: string;
    race: string;
    ethnicity: string;
    registrySharingIndicator: string;
    vaccineCenterId: string;
    scheduleDate: string;
    scheduleTime: string;
    mobile: string;
    insType: string;
    patientId:PatientId;
    // extra added field compared to VaccinationForm
    email: string;
    facilitiesBy: string;
}
interface PatientId
{
  patientNumber:string;
  _id:string;
} 
  interface PotentialConsiderationSecond {
    date: string;
    nameOfParent: string;
    mobile: string;
    relationship: string;
  }
  
  interface PotentialConsiderationFirst {
    haveBleedingDisorder: string;
    haveWeekImmuneSystem: string;
    isPregOrBreastfeeding: string;
  }
  
  interface PotentialContradiction {
    sick: string;
    receivedDose: string;
    vaccineCompany: string;
    hadSevereAllergy: string;
    hadAllergyAfterDose: string;
    hadAllergyAfterOtherDoseOrInjectable: string;
    hadAllergyRelatedToPolyGlycol: string;
    receivedDoseIn14Days: string;
    receivedAntibodies: string;
  }
  
  interface Uninsured {
    isUninsured: boolean;
    socialSecurityNumber: string;
    stateIdNumber: string;
    driverLicenseNumber: string;
  }
  
  interface MedicalIns {
    isPrimaryCardholder: string;
    dob: string;
    medicalInsProvider: string;
    groupId: string;
    payerId: string;
  }
  
  interface PrescriptionInsurance {
    isPrimaryCardholder: string;
    dob: string;
    cardHolderId: string;
    rxGroupId: string;
    bin: string;
    pcn: string;
  }
  
  interface PatientInfo {
    type: string;
    doseCount: number;
  }
  
  interface NextOfKin {
    name: string;
    mobile: string;
    relationship: string;
    address: string;
  }