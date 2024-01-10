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
  //   input?.paymentCustomization?.metafield?.value ?? "{}"
  // );

  const customerMetafields : Configuration = JSON.parse(
    input?.cart.buyerIdentity?.customer?.metafield?.value?? "{}"
  );
  const giftcardPaymentMethods = input?.paymentMethods?.find((option)=>option.name=="Gift card")
  const ccPaymentMethods = input?.paymentMethods?.find((option)=>option.name=="(for testing) Bogus Gateway")
  const MandhPaymentMethods = input?.paymentMethods?.find((option)=>option.name=="M & H Payment methods")
  // if(customerMetafields == "Company Issue"){
  //   if(giftcardPaymentMethods&&ccPaymentMethods&&MandhPaymentMethods){
  //     return {
  //       operations:[
  //         ({hide:{paymentMethodId:giftcardPaymentMethods.id}}),
  //         ({hide:{paymentMethodId:ccPaymentMethods.id}}),
  //       ]
  //     }
  //   }
  // }
  return NO_CHANGES;
};