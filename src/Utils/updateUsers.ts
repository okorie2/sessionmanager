import { getLoggedInUserList } from "./getLoggedInUserList";

export const updateUsers = (name: string) => {
  const currentUser = { userName: name, status: "active" };
  const loggedInUsers = getLoggedInUserList();
  loggedInUsers.push(currentUser);
  localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
  return loggedInUsers;
};
