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
    companyIssue = false
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


//   export const pullCheckout = async(token:any) =>
//  {
//   const url =
//     `${host}/checkouts_v2/${token}/poll`
//     return fetch(`${url}`,{method:"GET",headers: {
//       'Content-Type': 'application/json',
//     }}).then(response => response.text())
//     .then(result => {
//       //@ts-ignore
//       const Result = JSON.parse(result)
//       const readyState=Result.data[0].readyState
//       console.log(readyState)
//     return readyState
//     }
//      )
//     .catch(error => {console.log('error', error); return false });
//   };
 
export const pullCheckout = async (token: any) => {
  const url = `${host}/checkouts_v2/${token}/poll`;

  return new Promise(async (resolve, reject) => {
    const pollCheckoutInterval = setInterval(async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.text();
        //@ts-ignore
        const parsedResult = JSON.parse(result);
        const readyState = parsedResult.data[0].readyState;

        console.log(readyState);

        if (readyState === "enqueued" || readyState === "processing") {
          // Continue polling
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
    }, 1000); // Poll every 1 second
  });
};
