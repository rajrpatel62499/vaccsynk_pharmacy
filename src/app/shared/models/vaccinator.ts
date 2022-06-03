export interface Vaccinator {

    firstname: string,
    email:string,
    NPINumber: string,
    NPIExpDate:string ,
    Licence:string,
    LicenceExpDate:string,
    CPRNumber:string ,
    CPRExpDate: string,
    signature:string ,

    isDeleted: boolean;
  _id: string;

  addedBy: string;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}