import { PaymentGateway } from "./PaymentGateway";
import { AccountType } from "./AccountType";

export interface PaymentDetail {
  id: number;
  checkoutId: number;
  amount: number;
  gateway: PaymentGateway;
  accountType: AccountType;
}
