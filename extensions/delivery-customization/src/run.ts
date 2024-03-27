import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

type Configuration = {}; 


export function run(input: RunInput): FunctionRunResult {
  // const configuration: Configuration = JSON.parse(
  //   input?.deliveryCustomization?.metafield?.value ?? "{}"
  // );

  const customerMetafields : Configuration = JSON.parse(
    input?.cart.buyerIdentity?.customer?.metafield?.value?? "{}"
  );
  //@ts-ignore
  console.log("customerMetafields",customerMetafields.type)
  console.log("delieryGroups",input?.cart?.deliveryGroups)
  const companyIssues =input?.cart?.deliveryGroups?.flatMap((group)=>group.deliveryOptions).find((option)=>option.title=="Company Issue")
  const freeShipping =input?.cart?.deliveryGroups?.flatMap((group)=>group.deliveryOptions).find((option)=>option.title=="Free Shipping")
  const fedexShipping =input?.cart?.deliveryGroups?.flatMap((group)=>group.deliveryOptions).find((option)=>option.title=="Fedex Ground")
//@ts-ignore
  if(customerMetafields.type == "Company Issue") {

if(fedexShipping &&freeShipping){
  return {
    operations:[
      ({hide:{deliveryOptionHandle:fedexShipping.handle}}),
      ({hide:{deliveryOptionHandle:freeShipping.handle}})
    ]
  }
}
  }
  //@ts-ignore
  if(customerMetafields.type == "Fedex Ground") {
    
    if(companyIssues&&freeShipping){
      return {
        operations:[
          ({hide:{deliveryOptionHandle:companyIssues.handle}}),
          ({hide:{deliveryOptionHandle:freeShipping.handle}})
        ]
      }
    }
  }
   //@ts-ignore
  if(customerMetafields.type == "Free Shipping") {
    
    if(companyIssues&&fedexShipping){
      return {
        operations:[
          ({hide:{deliveryOptionHandle:companyIssues.handle}}),
          ({hide:{deliveryOptionHandle:fedexShipping.handle}})
        ]
      }
    }
  }

  return NO_CHANGES;
};