import { UserProfile } from './../shared/models/user-profile';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendResponse } from '../shared/models/backend-response';
import { AppRoutes } from '../shared/models/app-routes';
import { PharmacyRegisterForm } from '../shared/models/pharmacy-register-form';

@Injectable()
export class AuthService {

  private readonly apiEndpoint =  environment.ApiBaseUrl;

  
  
  // private _registerUrl = `${this.apiEndpoint}/api/patient/signup`;
  private _loginUrl = `${this.apiEndpoint}/api/vaccine-center/login`;
  private _requestOtpUrl = `${this.apiEndpoint}/api/vaccine-center/request-otp-forgot-password`;
  private _verifyOtpUrl = `${this.apiEndpoint}/api/vaccine-center/verify-otp`;
  private _changePasswordUrl = `${this.apiEndpoint}/api/vaccine-center/forgot-password`;
  private _changePasswordFromSettingUrl = `${this.apiEndpoint}/api/vaccine-center/change-password`;

  
  // User Profile Url
  get userProfileUrl() {return this.apiEndpoint + '/api/vaccine-center/me'}
  private _userProfileData: BehaviorSubject<UserProfile> = new BehaviorSubject<UserProfile>(null);


  constructor(private http: HttpClient,
              private _router: Router) { }

  // Auth API's
  // registerUser(user) {
  //   return this.http.post<any>(this._registerUrl, user)
  // }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  requestOtp(payload:{email: string}) {
    return this.http.post<any>(this._requestOtpUrl, payload);
  }
  
  verifyOtp(payload: {email: string, code: string}) {
    return this.http.post<any>(this._verifyOtpUrl, payload);
  }

  changePassword(payload: {email: string, password: string}) {
    return this.http.post<any>(this._changePasswordUrl, payload);
  }

  changePasswordFromSetting(payload) {
    return this.http.post<any>(this._changePasswordFromSettingUrl, payload);
  }

  //#region Profile data
  getUserProfile(): Observable<BackendResponse<UserProfile>>{
    const endpointUrl = this.userProfileUrl
    return this.http.get<BackendResponse<UserProfile>>(endpointUrl,this.requestHeaders);  
  }
  setUserProfileData(value: UserProfile) {
    this._userProfileData.next(value);
  }

  getUserProfileData(): Observable<UserProfile> {
    return this._userProfileData.asObservable();
  }
  //#endregion
  

  //#region REGISTER PHARMACY FLOW
  // VacCenter API's
  private get vacCenterRequestOtpUrl() { return this.apiEndpoint + "/api/vaccine-center/request-otp"}
  private get vacCenterVerifyOtpUrl() { return this.apiEndpoint + "/api/vaccine-center/verify-otp"}
  private get vacCenterUrl() { return this.apiEndpoint + "/api/vaccine-center"}

  requestOtpForVacCenter(payload): Observable<any> {
    const endpointUrl = `${this.vacCenterRequestOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  
  verifyOtpForVacCenter(payload): Observable<any> {
    const endpointUrl = `${this.vacCenterVerifyOtpUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }

  postPharmacyForm(payload: PharmacyRegisterForm): Observable<any> {
    const endpointUrl = `${this.vacCenterUrl}`;
    return this.http.post<any>(endpointUrl, payload);
  }
  //#endregion
  
  //  Utils

  logoutUser() {
    localStorage.removeItem('portalAccessToken')
    this._router.navigate([AppRoutes.ROOT,AppRoutes.LOGIN])
  }

  getToken() {
    return localStorage.getItem('portalAccessToken')
  }

  loggedIn() {
    return !!localStorage.getItem('portalAccessToken')    
  }

  protected get requestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*'
    });

    return { headers };
  }
}
