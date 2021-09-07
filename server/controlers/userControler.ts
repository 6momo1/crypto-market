import { User, TokenWatchlistInterface } from '../models/users'
import { TokenAlertInterface, TokenAlerts } from '../models/tokenAlerts'
import { UserInterface } from '../models/users'
import { useFetchTokenDatas } from '../data/tokens/tokenData'
import { useFetchTokenPriceData } from '../data/tokens/priceData'
import { client } from '../apollo'
import { validateEmail } from '../utils/validateEmail'

/*
  http request body must have:
    name,
    notifyBy:{
      email: boolean
      telegram: boolean
    },
    email
    telegram,
    member
*/
export const user_create = ( req, res ) => {

  const newUser = new User(req.body)
  newUser.save()
    .then( result => {
      console.log("A new user created: ", newUser)
    })
    .catch(console.log)
}

// helper function to update users token watchlist
async function update_user_token_watchlist( req, res ) {
  
  await User.findOne({googleId :req.body.userId})
    .then( user => {

      // update user token watchlist if user is already subscribed to the token
      const tokenInfoIdx = user.tokenWatchlist.findIndex( tokenInfo => 
        tokenInfo.tokenAddress === req.body.tokenAddress
      )

      // if token object found in user's watchlist found
      if (tokenInfoIdx != -1) {
          if (req.body.above) {
            user.tokenWatchlist[tokenInfoIdx].priceAlerts.above.push(req.body.watchPrice)
          }
          if (req.body.below) {
            user.tokenWatchlist[tokenInfoIdx].priceAlerts.below.push(req.body.watchPrice)
          }
          console.log("users token watchlist updated:", user.tokenWatchlist[tokenInfoIdx]);
          user.save()
      }
      else {
      // else create a new instance of the tokenlist object to push to user watchlist array
        const newUserTokenWatchlist:TokenWatchlistInterface = {
          tokenSymbol: req.body.tokenSymbol,
          tokenAddress: req.body.tokenAddress,
          priceAlerts: {
            above: [],
            below: [],
          }
        }

        if (req.body.above) {
          newUserTokenWatchlist.priceAlerts.above.push(req.body.watchPrice)
        }
        if (req.body.below) {
          newUserTokenWatchlist.priceAlerts.below.push(req.body.watchPrice)
        }
        user.tokenWatchlist.push(newUserTokenWatchlist)

        console.log("new token added to users token watchlist: ", newUserTokenWatchlist)
        
        user.save()
      }

    })
    .catch( err => {
      console.log("Error: could not search given user by id")
      console.log(err);
      res.json({"error": "Error: could not search given user by id"})
    })
}

// helper function to add user to tokenAlerts subscribers list
async function add_user_to_token_subscribers (req, res ) {

  // update token alerts database
  await TokenAlerts.find({tokenAddress: req.body.tokenAddress})
    .then( tokenAlertsRes => {

      // add user to token subscribers list if it already exists
      if ( tokenAlertsRes.length != 0 ) {
        if ( !tokenAlertsRes[0].subscribers.includes(req.body.userId) ) {
          tokenAlertsRes[0].subscribers.push(req.body.userId)
          tokenAlertsRes[0].save()
          console.log("Added userId of : " + req.body.userId + " to " + tokenAlertsRes[0].tokenSymbol);
        }
        else {
          console.log("user is already subscribed to this token.");
        }
      }
      else {
        // create a new price alert object
        useFetchTokenDatas( [req.body.tokenAddress] , client )
          .then( tokenDatas => {

            console.log(tokenDatas);

            // check if token data was fetched
            if ( Object.keys(tokenDatas.data).length == 0) {
              res.json({"error": "Invalid token address"})
            }
            
            // create new instance of token alert object to update database
            const newTokenAlert = new TokenAlerts({
              tokenSymbol: tokenDatas.data[req.body.tokenAddress].symbol,
              tokenName: tokenDatas.data[req.body.tokenAddress].name,
              tokenAddress: req.body.tokenAddress,
              subscribers: []
            })
            
            newTokenAlert.subscribers.push(req.body.userId)
            newTokenAlert.save()
            console.log("New Token alert object created: ", newTokenAlert);
          })
          .catch( err => {
            console.log("Failed to create new Token alerts object");
            console.log(err);
          })
      }
    })
    .catch( err => {
      console.log("Error searching for a tokenAlerts Object. ")
    })

}


/**
 * Allow user to user to subscribe to a new token 
 * @param req POST {
 *  googleId: string,
 * tokenSymbol: string,
 * tokenAddress: string,
 * above: boolean,
 * below: bolean,
 * watchPrice: number
 * }
 * @param res Status code or User object
 */
export const user_subscribe_to_new_token = async ( req, res ) => {
  await update_user_token_watchlist( req, res )
  await add_user_to_token_subscribers( req, res )
  const user = await User.find({googleId: req.body.userId})
  res.json(user)
  console.log(req.body);
}

// endpoint for deleting user by id
/**
 * 
 * @param req DELETE {
 *  googleId: string
 * }
 * @param res 
 * @returns 
 */
export const user_delete = async ( req, res ) => {

  const _id = req.body.id
  
  // remove user from all token alerts subscribers list
  TokenAlerts.find({})
    .then( tokenInfos => {
      for (let i = 0; i < tokenInfos.length; i++) {
        const idx = tokenInfos[i].subscribers.indexOf(_id)
        if ( idx > -1 ) {
          tokenInfos[i].subscribers.splice(idx, 1)
          tokenInfos[i].save()
        }
      }
    })

  const user = await User.findByIdAndDelete(_id)
  try {
    if ( !user ) {
      console.log("user not found and not deleted")
      return res.send(404)
    } 
    console.log("user id of: " + _id + " has been deleted.")
  } catch (e) {
    console.log(e);
    return res.send(400)
  }

}

// allow user to unsubscribe to token
/**
 * 
 * @param req DELETE {
 *  googleId: string,
 *  tokenAddress: string,
 * }
 * @param res Status code or User object
 * @returns Status code or User object
 */
export const user_unsubscribe_to_token = async ( req, res ) => {

  const googleId = req.body.id
  const tokenAddress = req.body.tokenAddress
  
  // // remove user from all token alerts subscribers list
  const tokenAlert = await TokenAlerts.findOne({tokenAddress: tokenAddress})
  try {
    if (!tokenAlert) {
      console.log("could not find token alert object");
      return res.send(404)
    }
    console.log(tokenAlert);
    const idx = tokenAlert.subscribers.indexOf(googleId)
    if ( idx > -1 ) {
      tokenAlert.subscribers.splice(idx, 1)
      tokenAlert.save()
    }
    console.log("User removed from token subscribers list");
    res.send(200)

  } catch (e) {
    console.log(e);
    console.log("failed to remove user from token subscribers list")
    return res.send(400)
  }

  // remove token from users token watchlist
  const user = await User.findById(googleId)
  try {
    if ( !user ) {
      console.log("user not found")
      return res.send(404)
    } 

    // tried to use filter but why does it not work?
    let tokenInfoIdx = -1
    for (let i = 0; i < user.tokenWatchlist.length; i++) {
      const tokenInfo = user.tokenWatchlist[i];
      if (tokenInfo.tokenAddress == tokenAddress) {
        tokenInfoIdx = i
      }
    }
    user.tokenWatchlist.splice(tokenInfoIdx, 1)

    user.save()
    
    console.log("token removed from users token watchlist");

  } catch (e) {
    console.log(e);
    return res.send(400)
  }
}

// allow user to remove token price alerts
/*
  DELETE: {
    googleId: string,
    tokenaddress: string
    above: boolean
    below: boolean
    price: number
  }
*/
export const user_remove_token_price_alert = async ( req, res ) => {

  const googleId = req.body.googleId
  const above = req.body.above
  const below = req.body.below
  const price = req.body.price
  const tokenAddress = req.body.tokenAddress
  
  if (!above && !below) {
    res.sendStatus(400).send({"error":"no price limit or floor received"})
  }

  const user = await User.findOne({ googleId: googleId} )
  try {
    if ( !user ) {
      console.log("user not found")
      return res.sendStatus(400).send({"error":"user not found"})
    } 

    // tried to use "filter" but why does it not work?
    let tokenInfoIdx = -1
    for (let i = 0; i < user.tokenWatchlist.length; i++) {
      const tokenInfo = user.tokenWatchlist[i];
      if (tokenInfo.tokenAddress == tokenAddress) {
        tokenInfoIdx = i
      }
    }
    const userPriceAlerts = user.tokenWatchlist[tokenInfoIdx].priceAlerts
    if (tokenInfoIdx > -1) {
      if (above) {
        const priceIndex = userPriceAlerts.above.indexOf(price)
        if ( priceIndex > -1 ) {
          userPriceAlerts.above.splice(priceIndex, 1)
          user.save()
          console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
          res.json(user)
        }
      }
      if (below) {
        const priceIndex = userPriceAlerts.below.indexOf(price)
        if ( priceIndex > -1 ) {
          userPriceAlerts.below.splice(priceIndex, 1)
          user.save()
          console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
          res.json(user)
        }
      }
    } else {
      console.log(`User does not have a price alert of ${price} for the token.`);
      res.sendStatus(400).send({"error":"User does not have a price alert for requested "})
    }

  } catch(e) {
    console.log(e);
    res.send(400)
  }
}

// Allow user to edit their email account
/**
 * 
 * @param req PUT: {
 *  googleId: string,
 *  email: string,
 * }
 * @param res error message
 */
export const user_edit_email = async ( req, res ) => {
  const googleId = req.body.googleId
  const email = req.body.email

  if (!email) {
    // res.send(400).send({"error":"No email received"})
    res.sendStatus(400)
    console.log({"error":"No email received"})
    return
  }

  if (!validateEmail(email)) {
    res.sendStatus(400)
    console.log({"error":"Invalid email"})
    return
  }

  try {
    const user = await User.findOne({googleId})
    user.email = email
    user.save()
    console.log(`email changed to ${email} for user id: ${googleId}`)
    res.json(user)

  } catch (e) {
    console.log(e)
    res.sendStatus(400)
  }
}


// Allow user to edit their telegram account
/**
 * 
 * @param req PUT: {
 *  googleId: string,
 *  telegram: string
 * }
 * @param res error message
 */
export const user_edit_telegram = async (req, res ) => {
  
  const googleId = req.body.googleId
  const telegram = req.body.telegram

  if (!telegram) {
    console.log({"error":"No telegram username received"})
    res.sendStatus(400)
    return
  }

  const user = await User.findOne({googleId})
  try {
    user.telegram = telegram
    user.save()
    console.log(`telegram username changed to ${telegram} for user id: ${googleId}`)
    res.json(user)
  } catch (e) {
    console.log(e)
    res.sendStatus(400)
    console.log({"error":"something went wrong in the server"})
  }
}

// Edit user membership status
/**
 * 
 * @param req PUT {
 *  googleId: string,
 *  member: boolean
 * }
 * @param res Status code 400 or User object
 */
export const user_edit_membership = async (req, res ) => {
  
  const googleId = req.body.googleId
  const member = req.body.member

  if (!member) {
    res.json({"error":"no member status received"})
    res.send(400)
  }

  const user = await User.findOne({googleId})
  try {
    if (member == "true") {
      user.member = true
      user.save()
      console.log(`User with id of ${googleId} changed to membership to ${member}`)
      res.json(user)
    } 
    if (member == "false") {
      user.member = false
      user.save()
      console.log(`User with id of ${googleId} changed to membership to ${member}`)
      res.json(user)
    } 
  } catch (e) {
    console.log(e)
    res.sendStatus(400).send({"error":"something went wrong in the server"})
  }
}