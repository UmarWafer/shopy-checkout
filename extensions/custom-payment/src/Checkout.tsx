import { useEffect ,useState } from 'react';
import {
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
} from '@shopify/ui-extensions-react/checkout';
import {createPaymentDetails ,clearPaymentDetails,pullCheckout} from './actions'
import { formatMoney } from './utlis';
export default reactExtension(
  'purchase.checkout.payment-method-list.render-after',
  () => <Extension />,
);



function Extension() {
  const translate = useTranslate();
  const api = useApi();
  console.log("api",api)
  const useLocalStorage = useStorage()
  const checkoutToken =api.checkoutToken.current;
   // const token ="0bf23b433a34d4990777624e0fa413b7"
   const token =checkoutToken;
   console.log("checkoutToken",checkoutToken)
  const cost =api.cost.totalAmount.current.amount;
  console.log("cost",cost)
  console.log("checkoutToken",checkoutToken)
  const [payrollBalance , setPayrollBalance] = useState<null | any>(null);
  const [allotmentBalance, setAllotmentBalance] = useState<null |any >(null);
  const [payrollMinimum ,setpayrollMinimum]= useState<null |any >(null);
  const [payroll , setPayroll] = useState<null | any>(0);
  const [allotment, setAllotment] = useState<null |any >(0);
  const [companyIssue , setCompantIssue] =useState<boolean>(false);
  const [totalcost, setTotalcost] = useState<null |any >(0);
  const [balanceCost, setBalanceCost] = useState<null |any >(0);

  const [applyed, setapplyed] = useState<boolean>(false);
  const [applyPaymentLoader , setApplyPaymentLoader] =useState<boolean>(false);
  const [clearPaymentLoader , setclearPaymentLoader] =useState<boolean>(false);

  const cutomerMetaFields = useAppMetafields()
  const selectedPaymentMethod = useSelectedPaymentOptions()
  console.log("selectedPaymentMethod",selectedPaymentMethod)
  const selectedPaymentType=selectedPaymentMethod[0]?.type.toString()
  let localPayRollBalance =0;
  let localallotmentBalance=0;
  let localpayrollMinimum =0;
  
  
  setTimeout(()=>{
    const cutomerMetaFieldValue =cutomerMetaFields[0]?.metafield?.value  
    //@ts-ignore
    const cutomerData=JSON.parse(cutomerMetaFieldValue)
    setCompantIssue(cutomerData.companyIssues?.length == 0?false:true)
    localallotmentBalance=cutomerData.allotmentBalance
    localPayRollBalance=cutomerData.payrollBalance
    localpayrollMinimum=cutomerData.minimumPayrollTransactionAmount
    if(!applyed){
    setpayrollMinimum(localpayrollMinimum)
    setAllotmentBalance(localallotmentBalance)
    setPayrollBalance(localallotmentBalance)
    let balance = 0;
    if(localallotmentBalance>0){
      balance =cost-localallotmentBalance
      setAllotment(cost-balance)
    }
    if(localPayRollBalance>0&&cost-localallotmentBalance>0)
    {
useLocalStorage.read("tempPayroll").then((data)=>{
  console.log("tempPayroll",data)
  setPayroll(data)
}).catch((err)=>{
  console.log("tempPayrollerr",err)
})}
    
  }
  if(applyed){
    // useLocalStorage.read("applyed").then((data)=>{
    //   useLocalStorage.read("allotmentBalance").then((data)=>{
    //     setAllotmentBalance(data)
    //   })
    //   useLocalStorage.read("allotment").then((data)=>{
    //     setAllotment(data)
    //   })

    //   useLocalStorage.read("payrollBalance").then((data)=>{
    //     setPayrollBalance(data)
    //   })

    //   useLocalStorage.read("payroll").then((data)=>{
    //     setPayroll(data)
    //   })

    //   useLocalStorage.read("payrollMinimum").then((data)=>{
    //     setpayrollMinimum(data)
    //   })



    // })
  }
  },0)
  // useLocalStorage.write("allotmentBalance",allotmentBalance)
  // useLocalStorage.write("payrollBalance",payrollBalance)
  // useLocalStorage.write("payrollMinimum",payrollMinimum)
  // useLocalStorage.write("payroll",payroll)
  // useLocalStorage.write("allotment",allotment)
  // if(cutomerMetaFieldValue){
  //     //@ts-ignore
  // const cutomerData=JSON.parse(cutomerMetaFieldValue)
  // setPayroll(cutomerData.payrollBalance)
  // setAllotment(cutomerData.allotmentBalance)
  // //  const customerData = JSON.parse(cutomerMetaFieldValue)
  // //  console.log(customerData)
//
  // }


  const applyShopyPayment = async ()=>{
   setApplyPaymentLoader(true)
   
    if(companyIssue){
     await createPaymentDetails(token,cost,0,0,true)

    }else{
      useLocalStorage.write("allotmentBalance",allotmentBalance)
   useLocalStorage.write("payrollBalance",payrollBalance)
   useLocalStorage.write("payrollMinimum",payrollMinimum)
   useLocalStorage.write("payroll",payroll)
   useLocalStorage.write("allotment",allotment)
   useLocalStorage.write("applyed",true)
      await createPaymentDetails(token,cost,allotment,payroll)
    }

const status = await pullCheckout(token)
if(status=='ready'){
  setapplyed(true)
  setApplyPaymentLoader(false)
  api.ui.overlay.close('apply-payment')
}else{
  setapplyed(false)
  useLocalStorage.write("applyed",false)
  setApplyPaymentLoader(false)
  api.ui.overlay.close('apply-payment')
}
  }

  const clearShopyPayment = async () => {
    setclearPaymentLoader(true)
   await  clearPaymentDetails(token)
    const status = await pullCheckout(token)
if(status=='ready'){
  setapplyed(false)
  useLocalStorage.write("applyed",false)
  setclearPaymentLoader(false)
  api.ui.overlay.close('remove-payment')
 
}else{
  setapplyed(true)
  setclearPaymentLoader(false)
  api.ui.overlay.close('remove-payment')
}
  }


  useEffect(()=>{

  },[])

  return (
    <>
{selectedPaymentType=='manualPayment'?
<>
     <BlockStack>
      
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
      
{allotmentBalance-allotment==0&&cost-allotment>0&&payrollBalance>0?
<><View> 
<Stepper  label='$' value={payroll/100} min={0} max={payrollBalance/100>(cost-allotment-payroll)/100?(cost-allotment-payroll)/100:payrollBalance/100}onChange={(value)=>{
  console.log("value in stepper" , value)
  const amount =value*100 
  const balance = cost-allotment-amount<0?cost-allotment-amount:0
  useLocalStorage.write("tempPayroll",amount+balance)
  setPayroll(amount-balance)
}}></Stepper>
</View>
</>
:<View border="base" padding="loose">
<Text> {formatMoney(payroll)} </Text> </View>}
      
     
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
        {!applyed?
        <Button kind='primary' loading={applyPaymentLoader} onPress={()=>{
        applyShopyPayment()
      }}
      overlay={
        <Modal
          id="apply-payment"
          padding
          title="APPLYING M&H PAYMENT. DO NOT REFRESH YOUR SCREEN AND CLOSE THIS."
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
      <Button  loading={clearPaymentLoader} kind='primary'appearance='critical' onPress={()=>{
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

  </>:""}</>
    
);
   
}