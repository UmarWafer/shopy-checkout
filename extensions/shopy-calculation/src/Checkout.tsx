import { useEffect, useState } from 'react';
import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  Spinner,
  View,
  useAppMetafields,
  useBuyerJourneyIntercept,
  useShippingAddress,
  useCustomer,
  useTotalTaxAmount,
  useCartLines,
  useDiscountAllocations,
  useApplyDiscountCodeChange,
  useDeliveryGroup,
  useDeliveryGroups,
  useApplyCartLinesChange,
  useApplyMetafieldsChange,
  useStorage,
} from '@shopify/ui-extensions-react/checkout';
import { getDiscountCode, getShopyCheckout, pullCheckout, refreshCheckout, updateAddress, updateShipping } from './actions'
import { array } from 'yup';
export default reactExtension(
  'purchase.checkout.shipping-option-list.render-before',
  () => <Extension />,
);

function Extension() {
  const [ready, setReady] = useState<boolean>(false); // false for M & H 
  const [render, setRender] = useState<boolean>(false);
  const shippingAdress = useShippingAddress();
  //const tax = useTotalTaxAmount()
//   const app = useAppMetafields()
//  console.log("app",app)
const updateAttributes = useApplyCartLinesChange()
const applyMetafieldsChange = useApplyMetafieldsChange();
const localStorage = useStorage()
  const customer = useCustomer();
  const customerId = customer.id.replace("gid://shopify/Customer/", "");
  //const provinece = shippingAdress.provinceCode
  const api = useApi();
  const applyDiscountCodeChange = useApplyDiscountCodeChange()
  const shippingAddress = useShippingAddress();
 // console.log("api.shippingAddress?.current", api.shippingAddress?.current)
  //console.log("shippingAddress", shippingAddress)
  const checkoutToken = api.checkoutToken.current;
  // const token ="0bf23b433a34d4990777624e0fa413b7"
  const token = checkoutToken;
  //console.log("checkoutToken", checkoutToken)


  const calculate = async () => {
    
    console.log("customerId", customerId)
    await updateAddress(token,customerId,shippingAddress)
    await updateShipping(token,customerId)
    await refreshCheckout(token, customerId)
    const status = await pullCheckout(token, customerId)
    if (status == 'ready') {
      console.log("ready")
      
      //console.log("tax", tax.amount)
      const shopyCheckout = await getShopyCheckout(token,customerId)
      //console.log("shopyCheckout", shopyCheckout)
      const shopyCheckoutData = JSON.parse(shopyCheckout as string)
      const discountdata = await getDiscountCode(shopyCheckoutData.data[0].discountId,customerId)
      const discountData = JSON.parse(discountdata as string)
      //console.log("discountdata", discountdata)
      localStorage.write("discountdata", "discountdata")
      await applyMetafieldsChange(
        {
          type:"updateMetafield",
          key:"checkout",
          namespace:"checkout_extensibility",
          value:"test",
          valueType:"string"
        
        }
      )
      // namespace:"checkout_extensibility",
      const result = await applyDiscountCodeChange({
      type:"addDiscountCode",
      code:discountData.data.code
    })
    setTimeout(async() =>{await updateCartLine(shopyCheckoutData.attributes)},1000)
    
  }

  }
  const cartLines =  useCartLines()

  const updateCartLine= async(data)=>{
    console.log("cartLines",cartLines)
    const transformedArray = cartLines.map(item => ({
      id: item.id,
      merchandiseId: item.merchandise.id,
      attributes: []
    }));

    console.log("transformedArray",{transformedArray})
    const updatedArry=updateExistingAttributes(transformedArray,data)
    console.log("updatedArry",{updatedArry})
//     updatedArry.forEach(async (item)=>{
//       setTimeout(async() =>{
// console.log("item",{item})
//     const updated=  await updateAttributes({
//         type:"updateCartLine",
//         id:item.id,
//         merchandiseId:item.merchandiseId,
//         attributes:item.attributes
//       })
//       console.log(updated)
//     })
//   },1000)
await updateItemsWithRetry(updatedArry)
    console.log("update")
    
  }
  
  const  updateExistingAttributes=(originalArray, additionalAttributes) =>{
    additionalAttributes.forEach((additional) => {
      const existingEntry = originalArray.find(
        (entry) => entry.merchandiseId === additional.merchandiseId
      );
  
      if (existingEntry) {
        // Update existing entry with matching merchandiseId
        existingEntry.attributes = additional.attributes;
      }
    });
    return originalArray;
  }



   const retryUpdate = async (
    item:any,
    attempt?: number,
  )=>{
    const currentAttempt = attempt || 1;
    const updated = await updateAttributes({
      type: "updateCartLine",
      id: item.id,
      merchandiseId: item.merchandiseId,
      attributes: item.attributes,
    },);
    // @ts-ignore
 
    // console.log({ready});
    if (updated.type=='success') {
      console.log("success")
    return updated.type
    } else if (currentAttempt > 200) {
      console.log("trried more than 200 attempts")
    } else {
     
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
          retryUpdate(item, currentAttempt + 1)
              .then(resolve)
              .catch(reject),
          1000
        );
      });
    }
  };




 
  
  async function updateItemsWithRetry(updatedArray) {
    const length = updatedArray.length;
    let done =0
    for (const item of updatedArray) {
      let lastUpdateSuccessful = false;
  
      while (!lastUpdateSuccessful) {
        const result = await retryUpdate(item,updatedArray);
  
        if (result === 'success') {
          // The update was successful, you can proceed with the next item
          lastUpdateSuccessful = true;
          done++
          if(done==length){
            setReady(true);
          }
        } else {
          // The update failed after retries, handle it as needed
        }
      }
    }
  }
  

  

  

  
  

  
  

  
  

  
  
  
  useEffect(() => {
    // if(customerId&&provinece&&tax.amount){
    //   console.log("customerId&&provinece)",provinece)

    setTimeout(() => {
      calculate()
    }, 5000)

    // }else{
    //   setRender(!render)
    // }

  }, [])

  useBuyerJourneyIntercept(
    ({ canBlockProgress }) => {
      return canBlockProgress &&
        !ready
        ? {
          behavior: 'block',
          reason: 'Calculation Not Completed',
          errors: [
            {
              // An error without a `target` property is shown at page level
              message:
                'Please wait, we are calculating your shipping and taxes. Do not click payment if you saw loader otherwise click payment',
            },
          ],
        }
        : {
          behavior: 'allow',
        };
    },
  );


  return (<>{ready ? "" :
    <Banner title="Please wait, we are calculating your shipping and taxes.">
      <View inlineAlignment='center'>
        <Spinner size='large' />
      </View>
    </Banner>}
  </>
  );
}