import { getLoggedInUserList } from "./getLoggedInUserList";

export const getLoggedinUser = (name: string) => {
    const loggedInUsers = getLoggedInUserList()
    if(loggedInUsers.length>0){
      const loggedInUser = loggedInUsers.find(loggedInUser=>loggedInUser.userName===name)
      if(loggedInUser) return loggedInUser
    }
   return undefined
  };