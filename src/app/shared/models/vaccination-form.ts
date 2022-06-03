export interface VaccinationForm {
  totalForm: string;
  data: VaccinationFormData[];
}
export  interface VaccinationFormData {
    nextOfKin: NextOfKin;
    patientId:PatientId;
    patientInfo: PatientInfo;
    prescriptionInsurance: PrescriptionInsurance;
    medicareFields: MedicareFields;
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
    _id: string;
    lastname: string;
    firstname: string;
    dob: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    isVerified:boolean;
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
    insType: string;
    vaccineCenterId: string;
    scheduleDate: string;
    scheduleTime: string;
    mobile: string;
    addedBy: string;

    isDeleted?: string;
    updatedAt?: string;
    createdAt?: string;
    doseGiven?: string;
    __v?: string;
    dose?: string;

  }
  
  interface PotentialConsiderationSecond {
    date: string;
    nameOfParent: string;
    mobile: string;
    relationship: string;
  }
  interface PatientId
{
  patientNumber:string;
  _id:string;
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
    isUninsured?: any;
    socialSecurityNumber?: any;
    stateIdNumber?: any;
    driverLicenseNumber?: any;
  }
  
  interface MedicalIns {
    isPrimaryCardholder?: any;
    dob?: any;
    medicalInsProvider?: any;
    groupId?: any;
    payerId?: any;
  }
  
  interface MedicareFields {
    patientAgeAbove65?: any;
    mbi?: any;
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