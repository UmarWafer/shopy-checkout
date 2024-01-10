import { useEffect ,useState } from 'react';
import {
  Banner,
  useApi,
  View,
  useTranslate,
  reactExtension,
  useDeliveryGroups,
  useDeliveryGroup,
  useAppMetafields,
  useCustomer,
  Spinner,
  Text,
  useMetafield,
  useApplyMetafieldsChange,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';
import { getCompanyIssue,updateCustomerMetafield } from './actions';

export default reactExtension(
  'purchase.checkout.delivery-address.render-before',
  () => <Extension />,
);

function Extension() {

  const api = useApi();
  const checkoutToken =api.checkoutToken.current;
  //const token ="af7fb296f3848fb0f5508e934bb89706"
  const token =checkoutToken;
 const customer = useCustomer();
//  const app = useAppMetafields()
//  console.log("app",app)

//  const delivery =  useDeliveryGroups();
//  console.log("delivery",delivery)
 
// console.log("customer custom",customer);
 const customerId = customer.id.replace("gid://shopify/Customer/", "");
 const customerEmail = customer.email

 const [loading, setLoading] = useState<boolean>(false);
 const [companyIssue , setCompantIssue] =useState<boolean>(false);

 const metafieldNamespace = "delivery-customization";
  const metafieldKey = "function-configuration";

  const deliveryCustomization = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });


 const getCompanyIssueDetails = async ()=>{
  setLoading(true);
const isCompanyIssue = await getCompanyIssue(token,customerId)
const isCompanyIssuedData = JSON.parse(isCompanyIssue as string)
await updateCustomerMetafield(isCompanyIssuedData.data.companyIssues?"Company Issue":"Fedex Ground",customerId)
setCompantIssue(isCompanyIssuedData.data.companyIssues)
setLoading(false)
 }

useEffect(() =>{
  getCompanyIssueDetails()
},[])

useBuyerJourneyIntercept(
  ({ canBlockProgress }) => {
    return canBlockProgress &&
      loading
      ? {
        behavior: 'block',
        reason: 'Company Issue checking not completed',
        errors: [
          {
            // An error without a `target` property is shown at page level
            message:
              'Please Wait, We are Checking Company Issue Status',
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
    {loading?
    <Banner title="Please Wait We are Checking Company Issue Status ">
    <View inlineAlignment='center'>
    <Spinner size='large' />
  </View>
  </Banner>: ""}
  
  </>
  );
}