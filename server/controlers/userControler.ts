import { User, TokenWatchlistInterface } from '../models/users'
import { TokenAlertInterface, TokenAlerts } from '../models/tokenAlerts'
import { UserInterface } from '../models/users'
import { useFetchTokenDatas } from '../data/tokens/tokenData'
import { useFetchTokenPriceData } from '../data/tokens/priceData'
import { client } from '../apollo'
import { userRoutes } from '../routes/userRoutes'

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

  await User.findOne({_id:req.body.userId})
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

/*
  http request body must have:
    userId,
    tokneSymbol,
    tokenAddress,
    above? or below?
    watchPrice
*/
export const user_subscribe_to_new_token = async ( req, res ) => {

  await update_user_token_watchlist( req, res )
  await add_user_to_token_subscribers( req, res )
}

// endpoint for deleting user by id
export const user_delete = async ( req, res ) => {

  const _id = req.params.id
  
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
export const user_unsubscribe_to_token = async ( req, res ) => {

  const _id = req.query.id
  const tokenAddress = req.query.tokenAddress
  
  // // remove user from all token alerts subscribers list
  const tokenAlert = await TokenAlerts.findOne({tokenAddress: tokenAddress})
  try {
    if (!tokenAlert) {
      console.log("could not find token alert object");
      return res.send(404)
    }
    console.log(tokenAlert);
    const idx = tokenAlert.subscribers.indexOf(_id)
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
  const user = await User.findById(_id)
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
export const user_remove_token_price_alert = async ( req, res ) => {

  const _id = req.query.id
  const above = req.query.above
  const below = req.query.below
  const price = req.query.price
  const tokenAddress = req.query.tokenAddress
  
  if (!above && !below) {
    res.json({"message":"no price limit or floor received"})
    res.send(400)
  }

  const user = await User.findById(_id)
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
    const userPriceAlerts = user.tokenWatchlist[tokenInfoIdx].priceAlerts
    if (tokenInfoIdx > -1) {
      if (above) {
        const priceIndex = userPriceAlerts.above.indexOf(price)
        if ( priceIndex > -1 ) {
          userPriceAlerts.above.splice(priceIndex, 1)
          user.save()
          console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
        }
      }
      if (below) {
        const priceIndex = userPriceAlerts.below.indexOf(price)
        if ( priceIndex > -1 ) {
          userPriceAlerts.below.splice(priceIndex, 1)
          user.save()
          console.log(`Price alert of ${price} removed from token watchlist ${user.tokenWatchlist[tokenInfoIdx].tokenSymbol}`);
        }
      }
    } else {
      console.log(`User does not have a price alert of ${price} for the token.`);
      res.send(400);
    }

  } catch(e) {
    console.log(e);
    res.send(400)
  }
}

export const user_edit_email = async ( req, res ) => {
  const _id = req.query.id
  const email = req.query.email

  if (!email) {
    res.json({"error":"No email received"})
    res.send(400)
  }

  const user = await User.findById(_id)
  try {
    user.email = email
    user.save()
    console.log(`email changed to ${email} for user id: ${_id}`)
    res.send(200)

  } catch (e) {
    console.log(e)
    res.send(400)
  }
}

export const user_edit_telegram = async (req, res ) => {
  
  const _id = req.query.id
  const telegram = req.query.telegram

  if (!telegram) {
    res.json({"error":"No telegram username received"})
    res.send(400)
  }

  const user = await User.findById(_id)
  try {
    user.telegram = telegram
    user.save()
    console.log(`telegram username changed to ${telegram} for user id: ${_id}`)
    res.send(200)
  } catch (e) {
    console.log(e)
    res.send(400)
  }
}

export const user_edit_membership = async (req, res ) => {
  
  const _id = req.query.id
  const member = req.query.member

  if (!member) {
    res.json({"error":"no member"})
    res.send(400)
  }

  const user = await User.findById(_id)
  try {
    if (member == "true") {
      user.member = true
      user.save()
      console.log(`User with id of ${_id} changed to membership to ${member}`)
      res.send(200)
    } 
    if (member == "false") {
      user.member = false
      user.save()
      console.log(`User with id of ${_id} changed to membership to ${member}`)
      res.send(200)
    } 
  } catch (e) {
    console.log(e)
    res.send(400)
  }
}