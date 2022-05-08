import React, { FormEventHandler, useEffect, useState } from "react";
import { ButtonHighlight, FormContainer, Input } from "../Styles/Form";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [isBroadCasted, setIsBroadCasted] = useState(false);
  const bc = new BroadcastChannel("alien_channel");
  const url = window.location.origin;
  const windowName = window.name; // get window name

  const tabSession = sessionStorage.getItem("username");
  const user = localStorage.getItem("username");

  useEffect(() => {
    bc.postMessage(username); // broadcasts the username on page render
    onBoard();
    userExists();
  }, []);

  bc.onmessage = (messageEvent) => {
    if (messageEvent.data === username) {
      setIsBroadCasted(true);
    } else setIsBroadCasted(false);
  }; // checks if the broadcasted message is the username

  // console.log(isBroadCasted, "broadcast");

  const onBoard = () => {
    if (user && tabSession && isBroadCasted) {
      return;
    } else {
      window.name = username; //sets window name
    }
  };

  const userExists = () => {
    if (user) {
      if (windowName === username) {
        window.open(url, username);
      }
    }
  };

  const allUsers = [
    {
      username: "",
      active: false,
    },
  ];

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    localStorage.setItem("user", username);
    sessionStorage.setItem("user", username);
    allUsers.push({ username: username, active: true });
    localStorage.setItem("usersList", JSON.stringify(allUsers));

    navigate("/userboard");
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
            placeholder="enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <ButtonHighlight type="submit">submit</ButtonHighlight>
      </form>
    </FormContainer>
  );
};

export default Form;
