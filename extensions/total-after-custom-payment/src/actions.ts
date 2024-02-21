

const host ='https://shopy-api.wafer.ee/sf/v2'

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
  
  
 
  

   

  

export const getData = async(data:string|any) => {
  const parsedResult = await JSON.parse(data);
  return parsedResult.data[0]
}



