import { PaymentGateway } from "./PaymentGateway";
import { AccountType } from "./AccountType";
import { PaymentDetail } from "./PaymentDetail";

const extractStandardResponseData = (res) => res.data.data;
const host ='https://shopy-api.wafer.ee/sf/v2'
export const createPaymentDetails = async (
  token:any,
    totalDue: number,
    allotment: number,
    payroll: number,
    companyIssue: boolean,
  ) => {
    const remaining = companyIssue ? 0 : Math.round(totalDue - allotment - payroll);
    const paymentDetails: Partial<PaymentDetail>[] = [];
    if (allotment) {
      paymentDetails.push({
        amount: Number(allotment),
        gateway: PaymentGateway.M_AND_H,
        accountType: AccountType.ALLOTMENT,
      });
    }
    if (payroll) {
      paymentDetails.push({
        amount: Number(payroll),
        gateway: PaymentGateway.M_AND_H,
        accountType: AccountType.PAYROLL,
      });
    }
  
    if (companyIssue) {
      paymentDetails.push({
        amount: totalDue,
        gateway: PaymentGateway.M_AND_H,
        accountType: AccountType.COMPANY_ISSUE,
      });
    }
    if (remaining) {
      paymentDetails.push({ amount: remaining, gateway: PaymentGateway.SHOPIFY });
    }
  
    const url =
    `${host}/checkouts_v2/${token}/payment_details`
    const data =JSON.stringify({"paymentDetails":paymentDetails})
    console.log("data",data)

   return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return true} )
  .catch(error => {console.log('error', error); return false});

  };




  export const clearPaymentDetails = async(token:any) => {
    const url =
    `${host}/checkouts_v2/${token}/payment_details`
    return fetch(`${url}`,{method:"DELETE",headers: {
      'Content-Type': 'application/json',
    }}).then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  };



  export const getShopyCheckout = async(token: string,CustomerId: any) =>{
    const url =
    `${host}/checkouts_v2/${token}/getcheckout`
    const data =JSON.stringify({})
    //console.log("data",data)
    return fetch(`${url}`,{method:"POST",headers: {
      'Content-Type': 'application/json',
      'X-Customer-Id':`${CustomerId}`
    },body:data}).then(response => response.text())
    .then(result => {
      //console.log(result); 
      return result} )
    .catch(error => {console.log('error', error); return false});
  }
  
  
  export const getDiscountCode = async(id: string,CustomerId: any) =>{
    const url =
    `${host}/checkouts_v2/get_discount_code/${id}`
    const data =JSON.stringify({})
    //console.log("data",data)
    return fetch(`${url}`,{method:"POST",headers: {
      'Content-Type': 'application/json',
      'X-Customer-Id':`${CustomerId}`
    },body:data}).then(response => response.text())
    .then(result => {
      //console.log(result); 
      return result} )
    .catch(error => {console.log('error', error); return false});
  }
  
  

   
  export const pullCheckout = async (token: any,CustomerId: any) => {
    const url = `${host}/checkouts_v2/${token}/poll`;
  
    return new Promise(async (resolve, reject) => {
      const pollCheckoutInterval = setInterval(async () => {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'X-Customer-Id':`${CustomerId}`
            },
          });
  
          const result = await response.text();
          //@ts-ignore
          const parsedResult = JSON.parse(result);
          //console.log("parsedResult: ", parsedResult );
          const readyState = parsedResult.data[0].readyState;
  
          //console.log(readyState);
  
          if (readyState === "enqueued" || readyState === "processing") {
            // Continue polling
            //console.log(readyState)
          } else if (readyState === "ready") {
            // Stop polling and resolve with "ready"
            clearInterval(pollCheckoutInterval);
            resolve("ready");
          }
        } catch (error) {
          console.log('error', error);
          // Stop polling on error and reject with the error
          clearInterval(pollCheckoutInterval);
          reject(error);
        }
      }, 5000); // Poll every 1 second
    });
  };
  

export const getData = async(data:string|any) => {
  const parsedResult = await JSON.parse(data);
  return parsedResult.data[0]
}

export const getCustomerDetails = async(email: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/customer_details/by_email`
  const data =JSON.stringify({email: email})
  //console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {
    //console.log(result); 
    return result} )
  .catch(error => {console.log('error', error); return false});
}

export const getCompanyIssue = async(token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/payment_options`
  const data =JSON.stringify({})
  //console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {
    //console.log(result); 
    return result} )
  .catch(error => {console.log('error', error); return false});
}