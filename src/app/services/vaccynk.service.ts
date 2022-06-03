import { Vaccinator } from './../shared/models/vaccinator';
import { FacilityFormData } from './../shared/models/facility-form';
import { FacilityCenter } from 'src/app/shared/models/facility-center';
import { UtilsService } from './utils.service';
import { VaccinationFormData } from './../shared/models/vaccination-form';
import { DoseParams, FacilityFormParams } from './../shared/models/params';
import { DoseForm, DoseFormData } from 'src/app/shared/models/dose-form';
import { VaccinationFormParams } from '../shared/models/params';
import { environment } from './../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BackendResponse } from '../shared/models/backend-response';
import { VaccinationForm } from '../shared/models/vaccination-form';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Timings } from './../shared/models/user-profile';
import { UserProfile } from '../shared/models/user-profile';
import { ReminderPayload } from '../shared/models/reminder';
import * as moment from 'moment';
import { FacilityForm } from '../shared/models/facility-form';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
@Injectable({
  providedIn: 'root'
})
export class VaccynkService {

  private readonly apiEndpoint = environment.ApiBaseUrl;


  // facilities Url's

   // get all facilities list

   private get allFaciliitiesUrl() { return this.apiEndpoint + "/api/vaccine-center/facility" }
   private get notificationPharmacyUrl(){return this.apiEndpoint + "/api/pharmacy/notifications"}

  // dashboard's charts apis

  private get dasboardDataUrl(){ return this.apiEndpoint + "/api/vaccine-center/dashboard" } 

  // VaccinationForm Url's
  private get vaccynkFormsUrl() { return this.apiEndpoint + "/api/vaccine-center/vaccinationForm" }
  private get vaccynkFormsByPatientIdUrl() { return this.apiEndpoint + "/api/vaccine-center/vaccinationFormForPatient" }
  private get updateVaccFormUrl() { return this.apiEndpoint + "/api/vaccine-center/vaccinationForm" }
  private get broadCastMessageUrl() { return this.apiEndpoint + "/api/vaccine-center/broadCastMessages" }
  private get updateTimingsUrl() { return this.apiEndpoint + "/api/vaccine-center/timings" }
  private get updateProfileUrl() { return this.apiEndpoint + "/api/vaccine-center/update-profile" }
  private get setReminderUrl() { return this.apiEndpoint + "/api/vaccine-center/reminder" }
  private get verifyPatientUrl() { return this.apiEndpoint + "/api/vaccine-center/vaccinationForm/verify" }

  
  // Dose's Url
  private get doseUrl() { return this.apiEndpoint + '/api/vaccine-center/dose' }

  // Notification Url For Patient
  private get notificationUrl(){return this.apiEndpoint + "/api/patient/notification"}


  constructor(public http: HttpClient, private util: UtilsService,private scrollToService: ScrollToService) { }

 







  // Dashboards Apis Declaration:-

  getDashboardData(type:string){
   const endpointUrl = `${this.dasboardDataUrl}`;
   let params = new HttpParams();
   if (type) { params = params.append('type', type.toString()) }
   return this.http.get<any>(endpointUrl, { params}).pipe(
    map(res =>res.data)
  );
  }

  // Vaccine API's
  getVacinationForms(vacineParams: VaccinationFormParams): Observable<VaccinationForm> {
    const endpointUrl = `${this.vaccynkFormsUrl}`;
    let params = new HttpParams();
    if (vacineParams.value) { params = params.append('value', vacineParams.value.toString()) }
    if (vacineParams.date) { params = params.append('date', vacineParams.date.toString()) }
    if (vacineParams.appointmentType) { params = params.append('appointmentType', vacineParams.appointmentType.toString()) }
    params = params.append('limit', vacineParams.limit.toString());
    params = params.append('pageNumber', vacineParams.pageNumber.toString())
    return this.http.get<BackendResponse<VaccinationForm>>(endpointUrl, { params }).pipe(
      map(res => res.data),
      tap((response) => {

        response.data.map( res => {
          res?.dob ? res.dob = new Date(res.dob).toLocaleDateString() : '';
          res?.potentialConsiderationSecond?.date ? res.potentialConsiderationSecond.date = new Date(res.potentialConsiderationSecond.date).toLocaleDateString() : '';
          res?.prescriptionInsurance?.dob ? res.prescriptionInsurance.dob = new Date(res.prescriptionInsurance.dob).toLocaleDateString() : '';
          res?.medicalIns?.dob ? res.medicalIns.dob = new Date(res.medicalIns.dob).toLocaleDateString() : '';
          res?.scheduleDate ? res.scheduleDate = new Date(res.scheduleDate).toLocaleDateString() : '';
          return res;
        })
      })
    );
  }

 

  getVaccinationFormByPatinetId(patientId: string): Observable<VaccinationFormData> {
    const endpointUrl = `${this.vaccynkFormsByPatientIdUrl}`;
    let params = new HttpParams();
    if (patientId) { params = params.append('patientId', patientId.toString()) }
    return this.http.get<BackendResponse<VaccinationFormData>>(endpointUrl, { params }).pipe(
      map(res => res.data),
      tap((res) => {
        res?.dob ? res.dob = new Date(res.dob).toLocaleDateString() : '';
        res?.potentialConsiderationSecond?.date ? res.potentialConsiderationSecond.date = new Date(res.potentialConsiderationSecond.date).toLocaleDateString() : '';
        res?.prescriptionInsurance?.dob ? res.prescriptionInsurance.dob = new Date(res.prescriptionInsurance.dob).toLocaleDateString() : '';
        res?.medicalIns?.dob ? res.medicalIns.dob = new Date(res.medicalIns.dob).toLocaleDateString() : '';
        res?.scheduleDate ? res.scheduleDate = new Date(res.scheduleDate).toLocaleDateString() : '';
      }),
    );
  }

  updateVaccinationForm(payload: VaccinationFormData) {

    const endpointUrl = `${this.updateVaccFormUrl}/${payload._id}`;
    delete payload._id;
    let formData: FormData = this.util.jsonToFormData(payload);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    return this.http.post<any>(endpointUrl, formData);
  }


  addDoseForm(payload: DoseFormData) {
    const endpointUrl = `${this.doseUrl}`;
    let formData: FormData = this.util.jsonToFormData(payload);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    return this.http.post<any>(endpointUrl, formData);
  }

  addDoseFormForFacility(payload: DoseFormData) {
    const endpointUrl = `${this.doseForFacilityUrl}`;
    let formData: FormData = this.util.jsonToFormData(payload);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    return this.http.post<any>(endpointUrl, formData);
  }

  deleteVacinationFormById(vaccineFormId: string): Observable<any> {
    const endpointUrl = `${this.vaccynkFormsUrl}/${vaccineFormId}`;
    return this.http.delete<any>(endpointUrl);
  }


  updateVaccineCenterTimings(payload: { dosePerSlot?: number, timings: Timings }) {
    const endpointUrl = `${this.updateTimingsUrl}`;
    return this.http.post<{ timings: Timings }>(endpointUrl, payload);
  }


  updateVaccineCenterInfo(payload: UserProfile) {
    const endpointUrl = `${this.updateProfileUrl}`;
    return this.http.post<UserProfile>(endpointUrl, payload);
  }

  verifyPatientDetails(formId, payload) {
    const endpointUrl = `${this.verifyPatientUrl}/${formId}`;
    return this.http.post<UserProfile>(endpointUrl, payload);
  }

  broadcastMessage(msg: string) {
    const endpointUrl = `${this.broadCastMessageUrl}`;
    const formData = new FormData();
    formData.append("message", msg);
    return this.http.post<string>(endpointUrl, formData);
  }

  setReminder(payload: ReminderPayload) {
    const endpointUrl = `${this.setReminderUrl}`;
    return this.http.post<ReminderPayload>(endpointUrl, payload);
  }


  private _vacForm: VaccinationFormData = null;

  storeVacFormData(value: VaccinationFormData) {
    this._vacForm = value;
  }

  getVacFormData(): VaccinationFormData {
    return this._vacForm;
  }
  private _facilityFormData: FacilityFormData = null;

  storeFacilityFormData(value: FacilityFormData) {
    this._facilityFormData = value;
  }

  getFacilityFormData(): FacilityFormData {
    return this._facilityFormData;
  }

  // Doses' API

  getDose(doseParams: DoseParams): Observable<DoseForm> {
    const endpointUrl = `${this.doseUrl}`;
    let params = new HttpParams();
    if (doseParams.patientId) { params = params.append('patientId', doseParams.patientId.toString()) }
    if (doseParams.type) { params = params.append('type', doseParams.type.toString()) }
    if (doseParams.value) { params = params.append('value', doseParams.value.toString()) }
    if (doseParams.date) { params = params.append('date', doseParams.date.toString()) }

    params = params.append('limit', doseParams.limit.toString());
    params = params.append('pageNumber', doseParams.pageNumber.toString())
    return this.http.get<BackendResponse<DoseForm>>(endpointUrl, {  params }).pipe(map(res => res.data));
  }



  deleteVacinationDoseById(id: string): Observable<any> {
    const endpointUrl = `${this.doseUrl}/${id}`;
    return this.http.delete<any>(endpointUrl);
  }


  // Notifications For Patients 

  notificationForPatient(){
    const endpointUrl = `${this.notificationUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }
  




  // Facilities Apis Declaration

  //#region Facilitie's API's

  private _editedFacilitySubject = new BehaviorSubject<FacilityCenter>(null);
  public editedFacility$ = this._editedFacilitySubject.asObservable();

  setEditedFacility(facility: FacilityCenter) {
    this._editedFacilitySubject.next(facility ? facility : null);
  }
  
  getEditedFacility() {
    return this._editedFacilitySubject.getValue();
  }

  getFacilityCenters(value? : string): Observable<FacilityCenter[]> {
    const endpointUrl = `${this.allFaciliitiesUrl}`;
    let params = new HttpParams();
    if(value) { params = params.append("value", value.toString())}
    return this.http.get<any>(endpointUrl, {params: params} ).pipe(
      map(res =>res.data)
    );
  }

  private get facilityFormUrl() { return this.apiEndpoint + "/api/vaccine-center/facility/vaccinationForm" }

  // getFacilityForms(facilityParams: FacilityFormParams): Observable<PaginatedResponse<VaccinationFormData[]>> {
  //   const endpointUrl = `${this.facilityFormUrl}`;
  //   let params = new HttpParams();
  //   if (facilityParams.value) { params = params.append('value', facilityParams.value.toString()) }
  //   params = params.append('limit', facilityParams.limit.toString());
  //   params = params.append('pageNumber', facilityParams.pageNumber.toString())
  //   return this.http.get<BackendResponse<PaginatedResponse<VaccinationFormData[]>>>(endpointUrl, { params }).pipe(
  //     map(res => res.data),
  //   );
  // }

  getFacilityForms(facilityParams: FacilityFormParams): Observable<FacilityForm> {
    const endpointUrl = `${this.facilityFormUrl}`;
    let params = new HttpParams();
    if (facilityParams.value) { params = params.append('value', facilityParams.value.toString()) }
    if (facilityParams.date) { params = params.append('date', facilityParams.date.toString()) }
    if (facilityParams.facilityId) { params = params.append('facilityId', facilityParams.facilityId.toString()) }
    // if (facilityParams.appointmentType) { params = params.append('appointmentType', facilityParams.appointmentType.toString()) }
    params = params.append('limit', facilityParams.limit.toString());
    params = params.append('pageNumber', facilityParams.pageNumber.toString())
    return this.http.get<BackendResponse<FacilityForm>>(endpointUrl, { params }).pipe(
      map(res => res.data),
      tap((response) => {

        response.data.map( res => {
          res?.dob ? res.dob = new Date(res.dob).toLocaleDateString() : '';
          res?.potentialConsiderationSecond?.date ? res.potentialConsiderationSecond.date = new Date(res.potentialConsiderationSecond.date).toLocaleDateString() : '';
          res?.prescriptionInsurance?.dob ? res.prescriptionInsurance.dob = new Date(res.prescriptionInsurance.dob).toLocaleDateString() : '';
          res?.medicalIns?.dob ? res.medicalIns.dob = new Date(res.medicalIns.dob).toLocaleDateString() : '';
          return res;
        })
      })
    );
  }

  private get facilityFormsByPatientIdUrl() { return this.apiEndpoint + "/api/vaccine-center/facility/vaccinationFormForPatient" }

  getFacilityFormsByPatinetId(patientId: string): Observable<FacilityFormData> {
    const endpointUrl = `${this.facilityFormsByPatientIdUrl}`;
    let params = new HttpParams();
    if (patientId) { params = params.append('patientId', patientId.toString()) }

    return this.http.get<BackendResponse<FacilityFormData>>(endpointUrl, { params }).pipe(
      map(res => res.data),
      tap((res) => {
        res?.dob ? res.dob = new Date(res.dob).toLocaleDateString() : '';
        res?.potentialConsiderationSecond?.date ? res.potentialConsiderationSecond.date = new Date(res.potentialConsiderationSecond.date).toLocaleDateString() : '';
        res?.prescriptionInsurance?.dob ? res.prescriptionInsurance.dob = new Date(res.prescriptionInsurance.dob).toLocaleDateString() : '';
        res?.medicalIns?.dob ? res.medicalIns.dob = new Date(res.medicalIns.dob).toLocaleDateString() : '';
        res?.scheduleDate ? res.scheduleDate = new Date(res.scheduleDate).toLocaleDateString() : '';
      }),
    );

  }

  getFacilityFormsByFormId(formId: string): Observable<FacilityFormData> {
    if (this.util.isNullOrEmpty(formId)) {
      this.util.handleError("OOPs Something went wrong!");
    }
    const endpointUrl = `${this.facilityFormUrl}/${formId}`;

    return this.http.get<BackendResponse<FacilityFormData>>(endpointUrl).pipe(
      map(res => res.data),
      tap((res) => {
        res?.dob ? res.dob = new Date(res.dob).toLocaleDateString() : '';
        res?.potentialConsiderationSecond?.date ? res.potentialConsiderationSecond.date = new Date(res.potentialConsiderationSecond.date).toLocaleDateString() : '';
        res?.prescriptionInsurance?.dob ? res.prescriptionInsurance.dob = new Date(res.prescriptionInsurance.dob).toLocaleDateString() : '';
        res?.medicalIns?.dob ? res.medicalIns.dob = new Date(res.medicalIns.dob).toLocaleDateString() : '';
        res?.scheduleDate ? res.scheduleDate = new Date(res.scheduleDate).toLocaleDateString() : '';

      }),
    );
  }
  
  private get doseForFacilityUrl() { return this.apiEndpoint + '/api/vaccine-center/facilityDose' }
  
 

  getDosesForFacility(doseParams: DoseParams): Observable<DoseForm> {
    const endpointUrl =  this.apiEndpoint + '/api/vaccine-center/facility/doses';
    let params = new HttpParams();
    if (doseParams.patientId) { params = params.append('patientId', doseParams.patientId.toString()) } // for getting single user dose data.
    if (doseParams.type) { params = params.append('type', doseParams.type.toString()) }
    if (doseParams.value) { params = params.append('value', doseParams.value.toString()) }
    if (doseParams.date) { params = params.append('date', doseParams.date.toString()) }
    if (doseParams.facilityId) { params = params.append('facilityId', doseParams.facilityId.toString()) }

    params = params.append('limit', doseParams.limit.toString());
    params = params.append('pageNumber', doseParams.pageNumber.toString())
    return this.http.get<BackendResponse<DoseForm>>(endpointUrl, {  params }).pipe(map(res => res.data));
  }
  //#endregion


  notificationForPharmacy(){
    const endpointUrl = `${this.notificationPharmacyUrl}`;
    return this.http.get<any>(endpointUrl).pipe(
      map(res =>res.data)
    );
  }

  //#region Vaccinators 
  private get vaccinaterUrl() { return this.apiEndpoint + '/api/vaccine-center/vaccinator' }

  getVaccinators(search?: string): Observable<Vaccinator[]> {
    const endpointUrl = `${this.vaccinaterUrl}`;
    let params = new HttpParams();
    if (search) { params = params.append('search', search) }
    return this.http.get<BackendResponse<Vaccinator[]>>(endpointUrl, {  params }).pipe(map(res => res.data));
  }

  addVaccinator(payload: Vaccinator) {
    const endpointUrl = `${this.vaccinaterUrl}`;
    let formData: FormData = this.util.jsonToFormData(payload);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    return this.http.post<any>(endpointUrl, formData);
  }

  deleteVaccinatorById(vaccinatorId: string): Observable<any> {
    const endpointUrl = `${this.vaccinaterUrl}/${vaccinatorId}`;
    return this.http.delete<any>(endpointUrl);
  }
  triggerScrollTo() {
    
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
 
    this.scrollToService.scrollTo(config);
  }

  triggerScrollToSrvice() {
    
    /**
     * @see NOTE:1
     */
    const config: ScrollToConfigOptions = {
      container: 'custom-container',
      target: 'destination',
      duration: 650,
      easing: 'easeOutElastic',
      offset: 20
    };
 
    this.scrollToService.scrollTo(config);
  }
  //#endregion

}
