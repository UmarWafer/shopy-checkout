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
  console.log("customerMetafields",customerMetafields)
  console.log("delieryGroups",input?.cart?.deliveryGroups)
//@ts-ignore
  if(customerMetafields.companyIssues?.length == 0) {
const fedexShipping =input?.cart?.deliveryGroups?.flatMap((group)=>group.deliveryOptions).find((option)=>option.title=="Fedex Ground")
if(fedexShipping){
  return {
    operations:[
      ({hide:{deliveryOptionHandle:fedexShipping.handle}})
    ]
  }
}
  }else{
    const companyIssues =input?.cart?.deliveryGroups?.flatMap((group)=>group.deliveryOptions).find((option)=>option.title=="Company Issue")
    if(companyIssues){
      return {
        operations:[
          ({hide:{deliveryOptionHandle:companyIssues.handle}})
        ]
      }
    }
  }

  return NO_CHANGES;
};