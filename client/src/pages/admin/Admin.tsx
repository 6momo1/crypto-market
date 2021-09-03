import axios from "axios";
import React, { useEffect, useState } from "react";

const uri = process.env.REACT_APP_API_DOMAIN
  ? process.env.REACT_APP_API_DOMAIN + "/api/user/get_users"
  : "";

const Admin = () => {
  const [users, setUsers] = useState<any | null>(null);
  const [error, setError] = useState(true)

  async function fetchAllUsers() {
    await axios.get(uri, { withCredentials: true }).then((res) => {
      if (res.status == 200) {
        setUsers(res.data)
        setError(false)
        console.log(res.data, error);
      }
    });
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      {users && !error? 
        <div>
          <h1>Admin page</h1>
          <p>{JSON.stringify(users)}</p>
        </div> 
        :
        <h1>Not Admin</h1>
      }
    </>
  );
};

export default Admin;
