import React, { useEffect, useState } from "react";
import {
  ButtonContainer,
  ButtonHighlight,
  FormContainer,
  Input,
  InputContainer,
} from "../Styles/Form";
import { useNavigate } from "react-router-dom";
import { getLoggedinUser } from "../Utils/getLoggedInUser";
import { getLoggedInUserList } from "../Utils/getLoggedInUserList";
import { updateUsers } from "../Utils/updateUsers";

const Form = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isBroadCasted, setIsBroadCasted] = useState(false);
  const bc = new BroadcastChannel("alien_channel");
  const url = window.location.origin;
  const windowName = window.name; // get window name

  useEffect(() => {
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
    console.log(messageEvent, "the message");

    if (messageEvent.data === username) {
      console.log(messageEvent.data, "onmsg");

      setIsBroadCasted(true);
    } else setIsBroadCasted(false);
  }; // checks if the broadcasted message is the username

  const handleSubmit = (name = username) => {
    if (getLoggedinUser(name)) {
      console.log("found");
      window.open(url, name)?.focus();
      //checks if the user is found in the list of logged in users, then redirects to thelogged in tab if true
      return;
    }
    window.name = name; //sets window name

    localStorage.setItem("user", name);

    const loggedInUsers = updateUsers(name);
    bc.postMessage(loggedInUsers);
    console.log(loggedInUsers, "loggednuser");
    navigate("/userboard");
  };

  return (
    <FormContainer>
      <InputContainer>
        <Input
          type="text"
          placeholder="enter username"
          onChange={(e) => setUsername(e.target.value.toLocaleLowerCase())}
        />
      </InputContainer>
      <ButtonContainer>
        <ButtonHighlight type="submit" onClick={() => handleSubmit()}>
          submit
        </ButtonHighlight>
      </ButtonContainer>
    </FormContainer>
  );
};

export default Form;
