import axios from 'axios'

export const fetchAuthUser = async () => {
    const response = await axios
      .get("http://localhost:5000/api/user", { withCredentials: true })
      .catch((e: any) => {
        console.log("Not properly authenticated");
        console.log(e)
      });
    return response
};