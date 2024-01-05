

const host ='https://shopy-api.wafer.ee/sf/v2'



export const refreshCheckout = async(token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts/${token}/refresh`
  const data =JSON.stringify({"step":"payment_method"})
  console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return true} )
  .catch(error => {console.log('error', error); return false});
}

export const updateAddress = async(token: string,CustomerId: any,address:any) =>{
  const url =
  `${host}/checkouts_v2/${token}/update_address_in_shopify`
  const data =JSON.stringify(address)
  console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return true} )
  .catch(error => {console.log('error', error); return false});
}

export const updateShipping = async(token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/update_shipping_line_in_shopify`
  const data =JSON.stringify({})
  console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return true} )
  .catch(error => {console.log('error', error); return false});
}

export const getShopyCheckout = async(token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/getcheckout`
  const data =JSON.stringify({})
  console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return result} )
  .catch(error => {console.log('error', error); return false});
}
export const getDiscountCode = async(id: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/get_discount_code/${id}`
  const data =JSON.stringify({})
  console.log("data",data)
  return fetch(`${url}`,{method:"POST",headers: {
    'Content-Type': 'application/json',
    'X-Customer-Id':`${CustomerId}`
  },body:data}).then(response => response.text())
  .then(result => {console.log(result); return result} )
  .catch(error => {console.log('error', error); return false});
}


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
        console.log("parsedResult: ", parsedResult );
        const readyState = parsedResult.data[0].readyState;

        console.log(readyState);

        if (readyState === "enqueued" || readyState === "processing") {
          // Continue polling
          console.log(readyState)
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
