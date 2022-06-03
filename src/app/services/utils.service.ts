import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DOCUMENT, Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UtilsService {
  public isUserData = new BehaviorSubject(null);
  public isUserDataGet = this.isUserData.asObservable();

  private readonly apiEndpoint = environment.ApiBaseUrl;

  constructor(
    public http: HttpClient,
    public _toastr: ToastrService,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }

  onUserDataGet(data) {
    return this.isUserData.next(data ? data : false);
  }

  showToaster(message: string, toastrType: string = 'success') {
    switch (toastrType) {
      case 'success':
        setTimeout(() => this._toastr.success(message, 'Success!'));
        break;
      case 'error':
        setTimeout(() => this._toastr.error(message, ''));
        break;
      case 'warning':
        setTimeout(() => this._toastr.warning(message, ''));
        break;
      case 'info':
        setTimeout(() => this._toastr.info(message, 'Info!'));
        break;
    }
  }

  handleError(msg: string) {
    this.showToaster(msg, 'error');
  }

  public jsonToFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => {
      if (object[key] instanceof Object) {
        console.log(typeof object[key], key, object[key]);
        if (object[key] instanceof File) {
          console.log(typeof object[key], key, object[key]);
          formData.append(key, object[key]);
        } else if (object[key] instanceof Date) {
          formData.append(key, object[key]);
        } else {
          console.log(typeof object[key], key, object[key]);
          formData.append(key, JSON.stringify(object[key]));
        }
      } else {
        console.log(typeof object[key], key, object[key]);
        formData.append(key, object[key]);
      }
    });
    return formData;
  }

  public base64ToFile(dataURI: string, fileName: string): File {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ext = '.' + mimeString.split('/')[1];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ia], { type: mimeString });
    var file: File = new File([blob], fileName + ext, {
      type: blob.type,
    });
    return file;
  }

  public base64ToBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  fileDownloadFromServer(file) {
    const link = document.createElement('a');
    link.download = 'filename';
    link.href = this.apiEndpoint + 'files/' + file + '.xlsx';
    link.click();
  }

  fileDownloadFromLink(url) {
    window.open(url, '_blank');
    const link = document.createElement('a');
    link.download = 'filename';
    link.href = url;
    link.click();
  }

  downloadURI(url, name) {
    url =
      'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGF3bnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80';
    const a: any = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }

  downloadFileFromLink(url): void {
    this.http
      .get(url, {
        responseType: 'blob',
      })
      .subscribe((blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'archive.png';
        a.click();
        URL.revokeObjectURL(objectUrl);
      });
  }

  downloadImage(url, name) {
    // url = 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGF3bnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
    const imgUrl = url;
    const imgName = name;
    this.http
      .get(imgUrl, { responseType: 'blob' as 'json' })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });
        // IE
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = imgName;
        // Version link.click() to work at firefox
        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
        setTimeout(() => {
          // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }

  toDataURL(url, callback) {
    // url = 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8ZGF3bnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80'
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  public promptForVideo(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      // make file input element in memory
      const fileInput: HTMLInputElement = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.setAttribute('capture', 'camera');
      // fileInput['capture'] = 'camera';
      fileInput.addEventListener('error', (event) => {
        reject(event.error);
      });
      fileInput.addEventListener('change', (event) => {
        resolve(fileInput.files[0]);
      });
      // prompt for video file
      fileInput.click();
    });
  }

  public generateThumbnail(videoFile: Blob): Promise<string> {
    if (videoFile.size >= 10000000) {
      return;
    }
    const video: HTMLVideoElement = document.createElement('video');
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    return new Promise<string>((resolve, reject) => {
      canvas.addEventListener('error', reject);
      video.addEventListener('error', reject);
      video.addEventListener('canplay', (event) => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        resolve(canvas.toDataURL());
      });
      if (videoFile.type) {
        video.setAttribute('type', videoFile.type);
      }
      video.preload = 'auto';
      video.src = window.URL.createObjectURL(videoFile);
      video.load();
    });
  }

  isNullOrEmpty(value) {
    if (value == undefined || value == '' || value == null) {
      return true;
    } else {
      return false;
    }
  }

  public fileObjToBase64(file: File) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (_event) => {
      console.log(reader.result);
      return reader.result;
    };
  }

  public removeFormGroupValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).clearValidators();
      form.get(key).updateValueAndValidity();
    }
  }

  public findInvalidControlsRecursive(
    formToInvestigate: FormGroup | FormArray
  ): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach((field) => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  public disableFormGroupControls(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key).disable();
    }
  }
}
