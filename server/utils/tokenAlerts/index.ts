import * as clients_json from '../../mock_database/users.json'
import * as tokenAlerts_json from '../../mock_database/tokenAlerts.json'
import { Client, TokenAlerts, TokenSubscribersInfo } from "../../mock_database/interfaces"
import { notifyByEmail, notifyByTelegram } from './notifyByServices'

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedETH: string
  volumeUSD: string
  volume: string
  feesUSD: string
  txCount: string
  totalValueLocked: string
  totalValueLockedUSD: string
}

// use mock database
const tokenAlerts = tokenAlerts_json.tokenAlerts
const clients = clients_json.clients

/*
    alert user if token price is either above or below the user's price target
*/
function shouldAlertUser(
    subscriber:string, 
    tokenSymbol: string, 
    currentPrice: number
):
{
    shouldAlert: boolean,
    error: boolean,
    message: string
}
{
    const pricesAbove = clients[subscriber].tokenWatchlist[tokenSymbol].priceAlert.above
    const pricesBelow = clients[subscriber].tokenWatchlist[tokenSymbol].priceAlert.below

    // if user does not have any price targets, return
    if (!pricesAbove && !pricesBelow) {
        return {
            shouldAlert: false, 
            error: true, 
            message: "Token is not in " + subscriber + "'s watchlist."
        }
    }

    // if current price reaches above user's price target, alert
    for (let i = 0; i < pricesAbove.length; i++) {
        let priceAbove = pricesAbove[i]
        if (currentPrice >= priceAbove) {
            return {
                shouldAlert: true,
                error: false,
                message: "Should alert user."
            }
        }
    }

    // if current price reaches below user's price target, alert
    for (let i = 0; i < pricesBelow.length; i++) {
        let priceAbove = pricesBelow[i]
        if (currentPrice >= priceAbove) {
            return {
                shouldAlert: true,
                error: false,
                message: "Should alert user."
            }
        }
    }

    return {
        shouldAlert: false,
        error: true,
        message: "Price targets not reached."
    }
}

export function sendPriceAlertToAllUsers(
    price: number, 
    tokenSymbol: string,
    tokenData: TokenFields
):
{
    error: boolean,
    alertsSentTo: {name:string, by: string}[],
    alertsNotSentTo: string[],
    message: string
}
{
    // initate return objects for feedback
    const alertsSentTo: {name:string, by: string}[] = []
    const alertsNotSentTo: string[] = []

    // check if token exists
    if (!tokenAlerts[tokenSymbol]) {
        return { 
            error: true,
            alertsSentTo,
            alertsNotSentTo,
            message: "Token does not exists in tokenAlerts Database."
        }
    }

    // get token subscribers
    const subscribers: string[] = tokenAlerts[tokenSymbol].subscribers
    if (!subscribers) {
        return { 
            error: true,
            alertsSentTo,
            alertsNotSentTo,
            message: "There are no subscribers for the token: " + tokenSymbol + "."
        }
    }

    // for each subscriber of a token, alert them by their desired notification
    // service (email or telegram) if their price targets are reached.
    subscribers.forEach( subscriber => {
        const {shouldAlert, error, message } = shouldAlertUser(subscriber, tokenSymbol, price)
        
        if (shouldAlert) {
            
            const clientInfo = clients[subscriber]

            if ( clientInfo.notifyBy.email ) {
                notifyByEmail(subscriber, clientInfo.email , tokenSymbol, price)
                alertsSentTo.push({name: subscriber, by: "email"})
            }
            if ( clientInfo.notifyBy.telegram ) {
                notifyByTelegram(subscriber, clientInfo.telegram, tokenSymbol, price)
                alertsSentTo.push({name: subscriber, by: "telegram"})
            }

        } else {
            alertsNotSentTo.push(subscriber)
        }
    })

    return {
        error: false,
        alertsSentTo,
        alertsNotSentTo,
        message: "sendPriceToAllUsers() Complete."
    }
}