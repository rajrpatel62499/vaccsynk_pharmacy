export class VaccinationFormParams {
    public date: string = '';
    public limit: number = 5;
    public pageNumber: number = 0;
    public value: string;
    public active: string;
    public appointmentType: string;
}

export class DoseParams {
    public type?: string;
    public patientId?: string;
    public date?: string = '';
    public limit?: number = 5;
    public pageNumber?: number = 0;
    public value?: string;

    public facilityId?: string;
}

export class FacilityFormParams {
    limit: number = 5;
    pageNumber: number = 0;
    
    // appointmentType: string;
    date: string;
    facilityId: string;
    value: string;
    formId: string;
}