import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ButtonContainer, ButtonHighlight } from "../Styles/Form";
import { Nav, TCont } from "../Styles/UserBoard";
import { getLoggedInUserList, UsersStatus } from "../Utils/getLoggedInUserList";
import { getLoggedinUser } from "../Utils/getLoggedInUser";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { getIndexOfLoggedInUser } from "../Utils/getIndexOfLoggedInUser";

export default function UserBoard() {
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
    const indexOfLoggedInUser = getIndexOfLoggedInUser(username);
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

  const resetTimer = () => {
    handleActivity();
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(handleInactivity, 60000);
  };

  document.onmousemove = resetTimer;
  let sessionTimeout: NodeJS.Timeout;
  window.onfocus = resetTimer;

  const handleInactivity = () => {
    const loggedInUsers = getLoggedInUserList();
    const indexOfLoggedInUser = getIndexOfLoggedInUser(username);
    if (indexOfLoggedInUser < 0) {
      return;
    }
    loggedInUsers[indexOfLoggedInUser].status = "Idle";
    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers)); // sets the modified userslist to LS

    bc.postMessage(loggedInUsers);
  };

  const handleActivity = () => {
    const loggedInUsers = getLoggedInUserList();
    const indexOfLoggedInUser = getIndexOfLoggedInUser(username);
    if (indexOfLoggedInUser < 0) {
      return;
    }
    loggedInUsers[indexOfLoggedInUser].status = "active";
    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers)); // sets the modified userslist to LS

    bc.postMessage(loggedInUsers);
  };

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
      <ButtonContainer>
        <ButtonHighlight
          onClick={() => {
            sessionStorage.setItem("previousUser", JSON.stringify(username));
            window.open(url);
          }}
        >
          Login a with another account
        </ButtonHighlight>
      </ButtonContainer>
      <TCont>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: UsersStatus, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.userName}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      sx={{ minWidth: "180px" }}
                      variant="contained"
                      color={`${
                        user.status == "active" ? "success" : "warning"
                      }`}
                    >
                      {user.status}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        logoutUserBroadCast.postMessage(user.userName)
                      }
                    >
                      Logout
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TCont>
    </>
  );
}
