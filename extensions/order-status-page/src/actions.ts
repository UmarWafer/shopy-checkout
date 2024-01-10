const host ='https://shopy-api.wafer.ee/sf/v2'
export const getOrder = async(token: string,CustomerId: any) =>{
  const url =
  `${host}/checkouts_v2/${token}/get_order_v2`
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

