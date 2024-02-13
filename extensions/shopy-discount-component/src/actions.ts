

const host ='https://shopy-api.wafer.ee/sf/v2'

export const applyPromotion = async(code :any ,token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/apply_promotions`
  const data =JSON.stringify({
    code:code,
  })
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

export const RemovePromotion = async(code :any ,token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/remove_promotions`
  const data =JSON.stringify({
    code:code,
  })
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