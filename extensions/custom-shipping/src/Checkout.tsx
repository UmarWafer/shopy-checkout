import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  useDeliveryGroups,
  useDeliveryGroup,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const deliveryGroups = useDeliveryGroups();
  console.log("deliveryGroups",deliveryGroups)
  const {
    selectedDeliveryOption,
    targetedCartLines,
  } = useDeliveryGroup(deliveryGroups[0]);

  return (
    <>
    {/* <Banner title="custom-shipping">
      {translate('welcome', {target: extension.target})}
    </Banner>
    <Banner>
    Selected delivery option:{' '}
    {selectedDeliveryOption?.title}
  </Banner> */}
  </>
  );
}