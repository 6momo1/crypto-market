import { Client } from '../models/users'

export const client_create = async( req, res ) => {
  const client = new Client(req.body)
  console.log(client);
  client.save()
    .then( res => {
      console.log("client saved: ", client);
    })
    .catch( err => {
      console.log(err);
    })
  // console.log(req.body);
}
