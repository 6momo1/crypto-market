import { setAuthUser, setIsAuthenticated } from "../app/appSlice";
import { fetchAuthUser } from "./fetchAuthUser";



export const updateRedux = async () => {
try {
        const response = await fetchAuthUser()
        .catch(e => console.log(e))
        console.log( "ensure user logged in at app.tsx", response);
        if (response) {
          dispatch(setAuthUser(response.data))
          dispatch(setIsAuthenticated(true))
        }
      } catch (error) {
        console.log(error);
      }
}

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
