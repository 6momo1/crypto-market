import { TokenAlertInterface } from "../../models/tokenAlerts";
import { UserInterface } from "../../models/users";

export function notifyByEmail(
    user: UserInterface,
    tokenAlertObj: TokenAlertInterface,
    price:number
) {
  console.log(
    `NOTIFIYING: ${user.firstName} by email: ${user.email} for token: ${tokenAlertObj.tokenSymbol} at price ${price} `
  );
}

export function notifyByTelegram(
    user: UserInterface,
    tokenAlertObj: TokenAlertInterface,
    price:number
) {
  console.log(
    `NOTIFIYING: ${user.firstName} by telegram: ${user.telegram} for token: ${tokenAlertObj.tokenSymbol} at price ${price}`
  );
}
