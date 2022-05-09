import React, { FormEventHandler, useEffect, useState } from "react";
import { ButtonHighlight, FormContainer, Input } from "../Styles/Form";
import { useNavigate } from "react-router-dom";
import { getLoggedinUser } from "../Utils/userIsLoggedIn";
import { getLoggedInUserList } from "../Utils/getLoggedInUserList";

const Form = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [isBroadCasted, setIsBroadCasted] = useState(false);
  const bc = new BroadcastChannel("alien_channel");
  const url = window.location.origin;
  const windowName = window.name; // get window name

  useEffect(() => {
    bc.postMessage(username); // broadcasts the username on page render

    checkUser();
  }, []);

  const checkUser = () => {
    if (windowName && getLoggedinUser(windowName)) {
      //checks if the user has already been logged to that window
      navigate("/userboard");
    } else {
      const loggedInUser = getLoggedInUserList();
      const previouslyLoggedInUser = sessionStorage.getItem("previousUser");
      if (!previouslyLoggedInUser)
        //if it's not the previously logged in user, log in the last user on the userslist
        loggedInUser.length
          ? handleSubmit(loggedInUser[loggedInUser.length - 1].userName)
          : null;
    }
  };

  bc.onmessage = (messageEvent) => {
    if (messageEvent.data === username) {
      // where should username come from? which storage
      setIsBroadCasted(true);
    } else setIsBroadCasted(false);
  }; // checks if the broadcasted message is the username

  const updateUsers = (name: string) => {
    const currentUser = { userName: name, status: "active" };
    const loggedInUser = getLoggedInUserList();
    loggedInUser.push(currentUser);
    bc.postMessage(loggedInUser);
    localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUser));
  };

  const handleSubmit = (name = username) => {
    if (getLoggedinUser(name)) {
      console.log("found");
      window.open(url, name)?.focus();
      //checks if the user is found in the list of logged in users, then redirects to thelogged in tab if true
      return;
    }
    window.name = name; //sets window name

    localStorage.setItem("user", name);
    updateUsers(name);

    navigate("/userboard");
  };

  return (
    <FormContainer>
      <div>
        <Input
          type="text"
          placeholder="enter username"
          onChange={(e) => setUsername(e.target.value.toLocaleLowerCase())}
        />
      </div>
      <ButtonHighlight type="submit" onClick={() => handleSubmit()}>
        submit
      </ButtonHighlight>
    </FormContainer>
  );
};

export default Form;
