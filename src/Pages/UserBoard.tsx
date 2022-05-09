import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Nav } from "../Styles/UserBoard";
import { getLoggedInUserList, UsersStatus } from "../Utils/getLoggedInUserList";
import { getLoggedinUser } from "../Utils/userIsLoggedIn";

export default function UserBoard() {
  // const username = localStorage.getItem("user");
  // console.log(username);

  const navigate = useNavigate();
  const url = window.location.origin;

  const username = window.name; //gets window name
  const bc = new BroadcastChannel("loggedInUsers");
  const logoutUserBroadCast = new BroadcastChannel("logoutUser");
  const [users, setUsers] = useState<UsersStatus[]>([]);

  useEffect(() => {
    if (!username || !getLoggedinUser(username)) navigate("/");
    const loggedInUsers = getLoggedInUserList();
    setUsers(loggedInUsers);
    bc.postMessage(loggedInUsers);
  }, []);

  console.log(users, "usersarray");
  useEffect(() => {
    window.addEventListener("focus", () => {
      if (!username || !getLoggedinUser(username)) navigate("/");
    });
    return () =>
      window.removeEventListener("focus", () => {
        console.log("remove");
      });
  }, []);

  const logout = () => {
    const loggedInUsers = getLoggedInUserList();
    const indexOfLoggedInUser = loggedInUsers.findIndex(
      (user) => user.userName === username
    ); //finds the position/index of the users from userslist that matches with the windowname
    if (indexOfLoggedInUser < 0) {
      return;
    }
    loggedInUsers.splice(indexOfLoggedInUser, 1); //removes the user from the list

    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers)); // sets the modified userslist to LS
    console.log(loggedInUsers);
    sessionStorage.setItem("previousUser", JSON.stringify(username));
    bc.postMessage(loggedInUsers);
    window.name = "";
    window.location.href = "/";
  };

  bc.onmessage = (messageEvent) => {
    const currentUsers = messageEvent.data;
    setUsers(currentUsers);
    localStorage.setItem("loggedInUsers", JSON.stringify(currentUsers));
  };

  logoutUserBroadCast.onmessage = (messageEvent) => {
    console.log(messageEvent.data);

    if (messageEvent.data === username) logout();
  };

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  let sessionTimeout: NodeJS.Timeout;
  function resetTimer() {
    // handleActivity();
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(handleInactivity, 10000);
  }

  const handleInactivity = () => {
    const loggedInUsers = getLoggedInUserList();
    const indexOfLoggedInUser = loggedInUsers.findIndex(
      (user) => user.userName === username
    );
    loggedInUsers[indexOfLoggedInUser].status = "Idle";
    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers)); // sets the modified userslist to LS

    bc.postMessage(loggedInUsers);
  };

  // const handleActivity = () => {
  //   const loggedInUsers = getLoggedInUserList();
  //   const indexOfLoggedInUser = loggedInUsers.findIndex(
  //     (user) => user.userName === username
  //   );
  //   if (indexOfLoggedInUser < 0) {
  //     return;
  //   }
  //   loggedInUsers[indexOfLoggedInUser].status = "Active";
  //   localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers)); // sets the modified userslist to LS

  //   bc.postMessage(loggedInUsers);
  // };
  return (
    <>
      <Nav>
        <div>{username}</div>
        <div>
          <svg
            onClick={logout}
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </Nav>
      <div>
        <button
          onClick={() => {
            sessionStorage.setItem("previousUser", JSON.stringify(username));
            window.name = "";
            window.open(url);
            // navigate("/");
          }}
        >
          Login a with another account
        </button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>userName</th>
              <th>status</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index) => (
              <tr key={index}>
                <td>{user.userName}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    onClick={() =>
                      logoutUserBroadCast.postMessage(user.userName)
                    }
                  >
                    logout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
