import {
  BlockStack,
  InlineStack,
  InlineLayout,
  Text,
  Icon,
  Modal,
  Spinner,
  useApi,
  useTranslate,
  reactExtension,
  View,
  TextField,
  Button,
  useBuyerJourneyIntercept,
  useCustomer,
  useApplyDiscountCodeChange,
  Tag,
  Banner,
  Pressable,
  useDiscountCodes
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';
import { RemovePromotion, applyPromotion, getDiscountCode, getShopyCheckout, pullCheckout } from './actions';

export default reactExtension(
  'purchase.checkout.reductions.render-before',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const api = useApi();
  const [applyloading, setapplyloading]=useState<boolean>(false);
  const [removeloading, setRemoveloading]=useState<boolean>(false);
  const [applyed, setApplyed]=useState<boolean>(false);
  const [code, setCode]=useState<null |any >(null);
  const [appliedcode , setAppliedCode]=useState<null |any >(null);


  const checkoutToken =api.checkoutToken.current;
   //const token ="af7fb296f3848fb0f5508e934bb89706"
   const token =checkoutToken;
  //  console.log("checkoutToken",checkoutToken)
  const Cost =api.cost.totalAmount.current.amount;
  const customer = useCustomer();
  const useDiscountcodes = useDiscountCodes()
  const applyDiscountCodeChange = useApplyDiscountCodeChange()
  
//  console.log("customer custom",customer);
  const customerId = customer.id.replace("gid://shopify/Customer/", "");

  const applyDiscount = async () => {
    setapplyloading(true)
    setAppliedCode(code)
   await  applyPromotion(code,token,customer)
    const status = await pullCheckout(token,customerId)
if(status=='ready'){
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
  
    api.ui.overlay.close('apply-discount')
    setapplyloading(false)
    setApplyed(true)
    setCode(null)
 
 
 
}else{    
  setapplyloading(false)
  api.ui.overlay.close('apply-discount')
}
  }
  const RemoveDiscount = async () => {
    setRemoveloading(true)
   await  RemovePromotion(code,token,customer)
    const status = await pullCheckout(token,customerId)
if(status=='ready'){
    //console.log("tax", tax.amount)
    const shopyCheckout = await getShopyCheckout(token,customerId)
    //console.log("shopyCheckout", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    const discountdata = await getDiscountCode(shopyCheckoutData.data[0].discountId,customerId)
    const discountData = JSON.parse(discountdata as string)
    console.log("useDiscountcodes",useDiscountcodes)
    //console.log("discountdata", discountdata)

    // await applyDiscountCodeChange({
    //   type:"removeDiscountCode",
    //   code:useDiscountcodes[0].code
    // })
    await retryAppliDiscount(
      "removeDiscountCode",
    useDiscountcodes[0].code
    )

    await retryAppliDiscount(
    "addDiscountCode",
    discountData.data.code
  )
  // await applyDiscountCodeChange({
  //   type:"addDiscountCode",
  //   code:discountData.data.code
  // })
  
    api.ui.overlay.close('remove-discount')
    setRemoveloading(false)
    setApplyed(false)
    setCode(null)
    setAppliedCode(null)
 
 
 
}else{    
  setRemoveloading(false)
  api.ui.overlay.close('remove-discount')
}
  }


  const retryAppliDiscount = async (
    type:any,
    code:any,
    attempt?: number,
  )=>{
    const currentAttempt = attempt || 1;
    const updated = await applyDiscountCodeChange({
      type:type,
      code:code
    },);
    // @ts-ignore
console.log(`retryAppliDiscount_${type} code ${code}`, updated);
    // console.log({ready});
    if (updated.type=='success') {
      console.log("success")
    return updated.type
    } else if (currentAttempt > 100) {
      console.log("retryAppliDiscount tried more than 100 attempts")
    } else {
     
      return new Promise((resolve, reject) => {
        setTimeout(
          () =>
          retryAppliDiscount(code, currentAttempt + 1)
              .then(resolve)
              .catch(reject),
          500
        );
      });
    }
  };



  useBuyerJourneyIntercept(
    ({ canBlockProgress }) => {
      return canBlockProgress &&
      applyloading || canBlockProgress &&
      removeloading
        ? {
          behavior: 'block',
          reason: 'applying or removing discount',
          errors: [
            {
              // An error without a `target` property is shown at page level
              message:
                `Please wait , ${applyloading?"applying discount":""} ${removeloading?"removing discount":""} code`,
            },
          ],
        }
        : {
          behavior: 'allow',
        };
    },
  );

  return (
   <>
   <BlockStack>
    <View>
    <InlineStack padding={'loose'}><Text size="extraLarge"> Apply M&H Discount Code Here </Text> <Icon size='large' source="chevronDown" /></InlineStack>
    <InlineLayout columns={['fill','20%']}  spacing={'base'} ><View> <TextField icon="discount" value={code}  label="M&H Dicount Code" onChange={(value)=>{setCode(value)}} /> </View><View><Button  onPress={()=>{
        applyDiscount()
      }} 
      kind='primary' loading={applyloading}
      overlay={
        <Modal
          id="apply-discount"
          padding
          title="APPLYING DISCOUNT CODE DO NOT REFRESH YOUR SCREEN AND CLOSE THIS."
        >
          <View  accessibilityRole='alert' inlineAlignment='center' padding="loose"> <Spinner appearance='accent' size='large'/></View>
          {/* <Button
            onPress={() =>
              api.ui.overlay.close('my-modal')
            }
          >
            Close
          </Button> */}
        </Modal>
      } >APPLY </Button></View></InlineLayout>
    <InlineStack padding={'base'}><Text size="extraLarge">  </Text> </InlineStack>
    {applyed&&appliedcode?<InlineStack > <Pressable
      onPress={()=>{
        
      RemoveDiscount()
      }}

      overlay={
        <Modal
          id="remove-discount"
          padding
          title="REMOVING DISCOUNT CODE DO NOT REFRESH YOUR SCREEN AND CLOSE THIS."
        >
          <View  accessibilityRole='alert' inlineAlignment='center' padding="loose"> <Spinner appearance='accent' size='large'/></View>
          {/* <Button
            onPress={() =>
              api.ui.overlay.close('my-modal')
            }
          >
            Close
          </Button> */}
        </Modal>
      }
    ><Tag icon='discount' onRemove={()=>{RemoveDiscount()}}>{appliedcode}</Tag></Pressable></InlineStack>:""}
    {applyloading||removeloading?
    <Banner title={`Please Wait, We Are  ${applyloading?"Applying":""} ${removeloading?"Removing":""} M&H Discount Code`}>
       <View inlineAlignment='center'>
         <Spinner size='large' />
       </View>
    </Banner> :""}
    </View></BlockStack>
   </>
  );
}