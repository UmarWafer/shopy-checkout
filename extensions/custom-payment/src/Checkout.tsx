import { useEffect ,useState } from 'react';
import {
  Banner,
	BlockStack,
  Choice,
  ChoiceList,
  TextBlock,
  Checkbox,
  Modal,
  Stepper,
  Grid,
  Text,
  View,
  useApi,
  useTranslate,
  reactExtension,
  useAppMetafields,
  useSelectedPaymentOptions,
  Button,
  useStorage,
  Heading,
  Spinner,
  useCustomer,
  useApplyDiscountCodeChange,
  useBuyerJourneyIntercept,
  useDiscountCodes,
} from '@shopify/ui-extensions-react/checkout';
import {createPaymentDetails ,clearPaymentDetails,pullCheckout, getShopyCheckout, getData, getCustomerDetails, getCompanyIssue, getDiscountCode} from './actions'
import { formatMoney } from './utlis';
export default reactExtension(
  'purchase.checkout.payment-method-list.render-after',
  () => <Extension />,
);



function Extension() {
  const api = useApi();
  // console.log("api",api)
//   const app = useAppMetafields()
//  console.log("app",app)
  const selectedPaymentMethod = useSelectedPaymentOptions()
  const selectedPaymentType=selectedPaymentMethod[0]?.type.toString()
  const applyDiscountCodeChange = useApplyDiscountCodeChange()
  const useLocalStorage = useStorage()
  const checkoutToken =api.checkoutToken.current;
   //const token ="af7fb296f3848fb0f5508e934bb89706"
   const token =checkoutToken;
  //  console.log("checkoutToken",checkoutToken)
  const Cost =api.cost.totalAmount.current.amount;
  const customer = useCustomer();
  
//  console.log("customer custom",customer);
  const customerId = customer.id.replace("gid://shopify/Customer/", "");
  const customerEmail = customer.email
  //  const customerId = "6160215343301"
  //  const customerEmail="aal@mandhuniforms.com"

  const [payrollBalance , setPayrollBalance] = useState<null | any>(null);
  const [allotmentBalance, setAllotmentBalance] = useState<null |any >(null);
  const [payrollMinimum ,setPayrollMinimum]= useState<null |any >(null);
  const [payroll , setPayroll] = useState<null | any>(0);
  const [allotment, setAllotment] = useState<null |any >(0);
  const [companyIssue , setCompantIssue] =useState<boolean>(false);
  const [balanceCost, setBalanceCost] = useState<null |any >(0);
  const [balanceCostAfterAllotment, setBalanceCostAfterAllotment] = useState<null |any >(0);
  const [completed ,setCompleted] = useState<null |any >(false);
  const [shopyDue ,setShopyDue] = useState<null |any >(false);
  const [shopyDiff ,setShopyDiff] = useState<null |any >(false);
  const [companyIssueProcess , setCompantIssueProcess] =useState<boolean>(false);
  
  const useDiscountcodes = useDiscountCodes()
  

  const updateValues = async ()=>{
    console.log("updateValues")
    const shopyCheckout = await getShopyCheckout(token,customerId)
    //console.log("shopyCheckout", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    console.log("shopyCheckoutData", shopyCheckoutData)
    const cost =shopyCheckoutData.data[0].total
    console.log("cost of extensibility", Cost)
    console.log("due from shopy",shopyCheckoutData.data[0].totalDue)
    const diff =shopyCheckoutData.data[0].total-Cost*100
    console.log("diff",shopyDue)
    setShopyDiff(diff)
    const dueToShow=shopyCheckoutData.data[0].totalDue-diff
    console.log("dueToShow",dueToShow)
    setShopyDue(dueToShow)
  
    setBalanceCost(cost)
    let balanceAmount = cost
    console.log("balanceAmount",balanceAmount)
    console.log("updateValues")
const getCustomer = await getCustomerDetails(customerEmail ,customerId);
const customerData =  await getData(getCustomer);
const companyIssue = await getCompanyIssue(token ,customerId)
const isCompanyIssuedData = JSON.parse(companyIssue as string)
console.log("getCustomer",getCustomer);
console.log("customerData",customerData);
console.log("companyIssue",companyIssue);
console.log("isCompanyIssuedData",isCompanyIssuedData)
setAllotmentBalance(customerData.allotmentBalance)
setPayrollBalance(customerData.payrollBalance)
setPayrollMinimum(customerData.minimumPayrollTransactionAmount)

if(customerData.allotmentBalance>0){
  let balance =0
  balance =balanceAmount-customerData.allotmentBalance
  console.log("balance",balance)
  if(balance>0){
    console.log("balance>0",balance)
    setAllotment(balanceAmount-balance)
    balanceAmount=balanceAmount-customerData.allotmentBalance
    setBalanceCost(balanceAmount)
    setBalanceCostAfterAllotment(balanceAmount)
  }
  if(balance<0){
    console.log("balance<0",balance)
    setAllotment(balanceAmount)
    balanceAmount=0
    setBalanceCost(balanceAmount)
    setBalanceCostAfterAllotment(balanceAmount)
  }
}

if(isCompanyIssuedData.data.companyIssues==true){
  setCompantIssue(true)
  // setCompantIssueProcess(true)
  // setTimeout(()=>{applyShopyPayment()},1000)
  
}
// if(customerData.payrollBalance>0 && balanceAmount>0){
//   let balance =0
//   balance =balanceAmount-customerData.payrollBalance
//   setPayroll(balanceAmount-balance)
//   balanceAmount-customerData.payrollBalance
// }
  }

  const [applyed, setapplyed] = useState<boolean>(false);
  const [applyPaymentLoader , setApplyPaymentLoader] =useState<boolean>(false);
  const [clearPaymentLoader , setclearPaymentLoader] =useState<boolean>(false);

 


  const applyShopyPayment = async ()=>{
   setApplyPaymentLoader(true)
   const shopyCheckout = await getShopyCheckout(token,customerId)
    //console.log("shopyCheckout", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    console.log("shopyCheckoutData", shopyCheckoutData)
    const cost =shopyCheckoutData.data[0].totalDue
    console.log("cost of extensibility", Cost)
    console.log("due from shopy",shopyCheckoutData.data[0].totalDue)
    const dueToShow=shopyCheckoutData.data[0].totalDue-shopyDiff
    console.log("dueToShow",dueToShow)
    setShopyDue(dueToShow)
    if(companyIssue){
      // setCompantIssueProcess(true)
      await useLocalStorage.write("cost",cost)
    await useLocalStorage.write("companyIssue","companyIssue")
     await createPaymentDetails(token,cost,0,0,true)
     

    }else{
await useLocalStorage.write("cost",cost)
await useLocalStorage.write("allotment",allotment)
 await useLocalStorage.write("payroll",payroll)

  //     useLocalStorage.write("allotmentBalance",allotmentBalance)
  //  useLocalStorage.write("payrollBalance",payrollBalance)
  //  useLocalStorage.write("payrollMinimum",payrollMinimum)
  //  useLocalStorage.write("payroll",payroll)
  //  useLocalStorage.write("allotment",allotment)
  //  useLocalStorage.write("applyed",true)
      await createPaymentDetails(token,cost,allotment,payroll,false)
    }

const status = await pullCheckout(token,customerId)
if(status=='ready'){
  const shopyCheckout = await getShopyCheckout(token,customerId)
    //console.log("shopyCheckout", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    console.log("cost of extensibility", Cost)
    console.log("due from shopy",shopyCheckoutData.data[0].totalDue)
    const dueToShow=shopyCheckoutData.data[0].totalDue-shopyDiff
    console.log("dueToShow",dueToShow)
    setShopyDue(dueToShow)
    
    const discountdata = await getDiscountCode(shopyCheckoutData.data[0].discountId,customerId)
    const discountData = JSON.parse(discountdata as string)
    //console.log("discountdata", discountdata)

    await retryAppliDiscount(
      "removeDiscountCode",
    useDiscountcodes[0].code
    )

    await retryAppliDiscount(
    "addDiscountCode",
    discountData.data.code
  )
  //   const result = await applyDiscountCodeChange({
  //   type:"addDiscountCode",
  //   code:discountData.data.code
  // })
  
  setTimeout(() =>{
    if(companyIssue){
      setShopyDue(0)
      console.log("companyIssue APPLIED SHOPY DUE")
    }
    setCompleted(true)
  setapplyed(true)
  setApplyPaymentLoader(false)
  setCompantIssueProcess(false)
  api.ui.overlay.close('apply-payment')
  },1000)
  
}else{
  setTimeout(() =>{
    setapplyed(false)
  useLocalStorage.write("applyed",false)
  setApplyPaymentLoader(false)
  api.ui.overlay.close('apply-payment')
  },1000)
  
}
api.ui.overlay.close('apply-payment')
api.ui.overlay.close('remove-payment')
api.ui.overlay.close('remove-payment')

  }

  const clearShopyPayment = async () => {
    setclearPaymentLoader(true)
   await  clearPaymentDetails(token)
    const status = await pullCheckout(token,customerId)
if(status=='ready'){
    //console.log("tax", tax.amount)
    const shopyCheckout = await getShopyCheckout(token,customerId)
    //console.log("shopyCheckout", shopyCheckout)
    const shopyCheckoutData = JSON.parse(shopyCheckout as string)
    console.log("cost of extensibility", Cost)
    console.log("due from shopy",shopyCheckoutData.data[0].totalDue)
    const dueToShow=shopyCheckoutData.data[0].totalDue-shopyDiff
    console.log("dueToShow",dueToShow)
    setShopyDue(dueToShow)
    const discountdata = await getDiscountCode(shopyCheckoutData.data[0].discountId,customerId)
    const discountData = JSON.parse(discountdata as string)
    //console.log("discountdata", discountdata)
  //   const result = await applyDiscountCodeChange({
  //   type:"addDiscountCode",
  //   code:discountData.data.code
  // })

  await retryAppliDiscount(
    "removeDiscountCode",
  useDiscountcodes[0].code
  )

  await retryAppliDiscount(
  "addDiscountCode",
  discountData.data.code
)
  setTimeout(() =>{
    setCompleted(false)
    setapplyed(false)
    useLocalStorage.write("applyed",false)
    setclearPaymentLoader(false)
    api.ui.overlay.close('remove-payment')
  },1000)
 
 
}else{
  setTimeout(() =>{
    setapplyed(true)
  setclearPaymentLoader(false)
  api.ui.overlay.close('remove-payment')
  },1000)
  
}
  }


  useEffect(()=>{
    updateValues()
  },[])

  useBuyerJourneyIntercept(
    ({ canBlockProgress }) => {
      return canBlockProgress &&
      selectedPaymentType=='manualPayment' && shopyDue>0
        ? {
          behavior: 'block',
          reason: 'Comlete the payment',
          errors: [
            {
              // An error without a `target` property is shown at page level
              message:
                'Pay the pending payment to complete the order',
            },
          ],
        }
        : {
          behavior: 'allow',
        };
    },
  );

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

  return (
    <>
{!companyIssueProcess ? "" :
    <Banner title="Please wait, we are applying compnay issue.">
      <View inlineAlignment='center'>
        <Spinner size='large' />
      </View>
    </Banner>}
{selectedPaymentType=='manualPayment'?
<>
     <BlockStack>
     {/* <Spinner/> */}
      <View border="base" padding="base">
      <Grid
      columns={['33%', '33%', '33%']}
      rows={[60, 'auto']}
      spacing="loose"
    >
     
{/* alotment view starts here */}
{!companyIssue?
<>
<View  padding="loose">
  <Text>Allotments:</Text>
      </View>


      <View border="base" padding="loose">
      <Text>{formatMoney(allotment)} </Text>
      </View>
      <View border="base" padding="loose">
        <Text> {formatMoney(allotmentBalance-allotment)} available</Text>  
      </View>
      {/* alotment view ends here */}

      {/* payroll view starts here */}
      <View  padding="loose">
  <Text>Payroll:</Text>
      </View>
      
      {/* {allotmentBalance-allotment==0&&cost-allotment>0&&payrollBalance>0? */}
<><View> 
<Stepper  label='$' value={Number((payroll/100).toFixed(2))} min={0} max={balanceCost>payrollBalance?payrollBalance/100:balanceCost/100}onChange={(value)=>{
  console.log("value in stepper" , value)
  const amount =value*100 
  // const balance = cost-allotment-amount<0?cost-allotment-amount:0
  // useLocalStorage.write("tempPayroll",amount+balance)
  setPayroll(amount)
  setBalanceCost(balanceCostAfterAllotment-amount)
}}></Stepper>
</View>
</>
{/* :<View border="base" padding="loose">
<Text> {formatMoney(payroll)} </Text> </View>} */}
      
     
      <View border="base" padding="loose">
        <Text> {formatMoney(payrollBalance-payroll)} available</Text>  
      </View>
       {/* payroll view ends here */}

        {/* Minumum Payroll view starts here */}
      <View>
      </View>
      <View ></View><View >
      <Text> Minumum Payroll {formatMoney(payrollMinimum)}</Text>
      </View>
      

         {/* Minumum Payroll view ends here */}

          {/* Company Issue view starts here */}</>:<>
          <View  padding="loose">
         
    
  <Text>Company Issue: </Text>
      </View>
      <View ></View><View   padding="loose">  <Checkbox checked={companyIssue} disabled={companyIssue} id="checkbox" name="checkbox"></Checkbox></View></>}
      <View ></View><View ></View>
      <View > 
        {!completed?
        <Button kind='primary' loading={applyPaymentLoader} onPress={()=>{
          if(payroll<payrollMinimum){
            setTimeout(()=>{
              api.ui.overlay.close('payroll_minimum')
            },3000)
            
          }else{
            applyShopyPayment()
          }
       
      }}
      overlay={
        payroll<payrollMinimum?
        <Modal
          id="payroll_minimum"
          padding
          title="Try Another Payment Methods"
        >
          <View  accessibilityRole='alert' inlineAlignment='center' padding="loose"> 
          <Text>Payroll amount lower then Payroll minimum transaction amount. complete payment with other payment methods</Text>
          
          </View>
          {/* <Button
            onPress={() =>
              api.ui.overlay.close('my-modal')
            }
          >
            Close
          </Button> */}
        </Modal>:<Modal
          id="apply-payment"
          padding
          title="APPLYING M&H PAYMENTS. DO NOT REFRESH YOUR SCREEN AND CLOSE THIS."
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
      >Apply M&H Funds
      </Button>
      :
      <Button  disabled={companyIssue} loading={clearPaymentLoader} kind='primary'appearance='critical' onPress={()=>{
      clearShopyPayment()
      }}
      overlay={
        <Modal
          id="remove-payment"
          padding
          title="REMOVING M&H PAYMENT. DO NOT REFRESH YOUR SCREEN AND CLOSE THIS."
        >
          <View  accessibilityRole='alert' inlineAlignment='center' padding="loose"> <Spinner appearance='accent' size='large'/></View>
       
        </Modal>
      }
      >Clear</Button>}
      </View>
    </Grid>
    </View>

      {/* Company Issue view ends here here */}
  </BlockStack>

  </>:""}
{completed&&shopyDue>0?
  <Text size='extraLarge' >{`Pay Balance ${(shopyDue/100).toFixed(2)} with other payment method`}</Text>:""}
  </>
    
);
   
}