import {
  Banner,
  Spinner,
  View,
  useApi,
  useTranslate,
  reactExtension,
  useOrder,
  BlockStack,
  Text,
  useCustomer
} from '@shopify/ui-extensions-react/checkout';
import { getOrder } from './actions';
import { useEffect } from 'react';

export default reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const api = useApi();
  const checkoutToken =api.checkoutToken.current;
  const token =checkoutToken;
 const customer = useCustomer();

 const customerId = customer.id.replace("gid://shopify/Customer/", "");
// const token ="ee329709ae917dcf2b61f51ffc3f7acf"
// const customerId =6160215343301

const getvalues = async() =>{
  const getorder = await getOrder(token,customerId)
  //console.log("shopyCheckout", shopyCheckout)
  const getOrderData = JSON.parse(getorder as string)
  console.log("getOrderData", getOrderData)
}

useEffect(()=>{
  getvalues()
},[])

	return (
    <>
    {/* <BlockStack>
      <View>
        <Text>test</Text>
      </View>
    </BlockStack>
    </>
    // <Banner title="Please wait, we are calculating your shipping and taxes.">
    //   <View inlineAlignment='center'>
    //     <Spinner size='large' />
    //   </View>
    // </Banner> */}</>
  );
  }