import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  BlockStack,
  View,
  InlineLayout,
  Icon,
  Text,
  InlineStack,
  useCustomer,
} from '@shopify/ui-extensions-react/checkout';
import { getShopyCheckout } from './actions';
import { useEffect, useState } from 'react';
import { formatMoney } from './utlis';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const api = useApi();
  const [applyedPromo , setAppliedPromo]=useState<null |any >([])
  const [applyedPayments , setAppliedPayments]=useState<null |any >([])

  const checkoutToken =api.checkoutToken.current;
  //const token ="af7fb296f3848fb0f5508e934bb89706"
  const token =checkoutToken;
 //  console.log("checkoutToken",checkoutToken)
 const Cost =api.cost.totalAmount.current.amount;
 const customer = useCustomer();
 const customerId = customer.id.replace("gid://shopify/Customer/", "");

  const update = async () => {
    const shopyCheckout = await getShopyCheckout(token,customerId)
    console.log("shopyCheckout on discoungt", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    setAppliedPromo(shopyCheckoutData?.data[0]?.promotionApplications)
    setAppliedPayments(shopyCheckoutData?.data[0]?.paymentDetails)
  }

  console.log("deliveryInstructions",applyedPromo )
// localStorage.read("deliveryInstructions").then(()=>update())
  useEffect(()=>{
  update()
  console.log("deliveryInstructions useeffect")
  },[Cost])

  return (
    <>
    {applyedPromo?.length>0?<>
    {applyedPromo?.map((obj)=>(
      <InlineStack padding="none"><Icon size='base' source="discount" />  <Text size='base'> {obj.promotion.type} SAVINGS   </Text> <Text>{formatMoney(obj.value)}</Text></InlineStack>
    ))}
    
    </>:""}
    {applyedPayments?.length>0?<>
    {applyedPayments?.map((payment)=>(
      <> {payment?.accountType==='CREDIT_CARD'? "":<InlineStack padding="none"><Icon size='base' source="discount" />  <Text size='base'> {payment?.accountType} SAVINGS   </Text> <Text>{formatMoney(payment?.amount)}</Text></InlineStack>}</>
    ))}</>:""}
{/*     
    {applyedPayments?.length>0?<>
    {applyedPayments?.map((payment)=>(
      <>
      {payment?.accountType==='CREDIT_CARD'?<InlineLayout columns={['fill', '20%']}>
  <View  padding="tight">
        <Text size='extraLarge'>Balance</Text>
  </View>
  <View  padding="tight" inlineAlignment="end">
  <Text size='extraLarge'> {formatMoney(payment.amount)} </Text>
  </View>
  </InlineLayout>:<InlineLayout columns={['fill', '20%']}>
  <View  padding="tight">
     -   {payment?.accountType}
  </View>
  <View  padding="tight" inlineAlignment="end">
  {formatMoney(payment.amount)}
  </View>
  </InlineLayout>}
      
      </>
    ))}
    </>:""}
     */}
  
    </>

  );
}

 