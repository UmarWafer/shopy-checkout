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
} from '@shopify/ui-extensions-react/checkout';
import { getDiscountCode, getShopyCheckout, pullCheckout, refreshCheckout, updateAddress, updateShipping } from './actions'
export default reactExtension(
  'purchase.checkout.shipping-option-list.render-before',
  () => <Extension />,
);

function Extension() {
  const [ready, setReady] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const shippingAdress = useShippingAddress();
  //const tax = useTotalTaxAmount()
//   const app = useAppMetafields()
//  console.log("app",app)
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
      const result = await applyDiscountCodeChange({
      type:"addDiscountCode",
      code:discountData.data.code
    })
    setReady(true)
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
                'Please wait, we are calculating your shipping and taxes.',
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