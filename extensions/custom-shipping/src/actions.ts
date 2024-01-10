const host ='https://shopy-api.wafer.ee/sf/v2'
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

export const updateCustomerMetafield = async(type: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/create_shipping_metfield`
  const data =JSON.stringify({customerId:CustomerId,shipping:type})
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