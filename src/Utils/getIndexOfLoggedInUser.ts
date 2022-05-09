import { getLoggedInUserList, UsersStatus } from "./getLoggedInUserList";

export const getIndexOfLoggedInUser = (username: string) => {
  const loggedInUsers = getLoggedInUserList();
  const indexOfLoggedInUser = loggedInUsers.findIndex(
    (user: UsersStatus) => user.userName === username
  ); //finds the position/index of the users from userslist that matches with the windowname

  return indexOfLoggedInUser;
};
