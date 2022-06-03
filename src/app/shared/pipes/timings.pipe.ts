import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timings'
})
export class TimingsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    
    if(this.isNullOrEmpty(value)) {
      return null;
    }
    return (+value - 12 ) < 0 ?
    value + ' AM' : 
    (+value -12 == 0) ? "12 PM" :  
    (+value - 12) + ' PM' ;
  }

  isNullOrEmpty(value) {
    if(value == undefined || value == '' || value == null){
      return true;
    }else {
      return false;
    }
  }
}
