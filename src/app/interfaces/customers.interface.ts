export interface Customer {
    customerName: string;
    projectName: string;
    userId: string;

    companyName: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    registrationDate: Date;

    _id?:string;
}