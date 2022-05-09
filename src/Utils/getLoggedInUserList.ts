export interface UsersStatus {
    userName: string
    status: string
}

export const getLoggedInUserList = () =>{
    let loggedInUsers:UsersStatus[];
    try {
      loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers") as string)      
      return loggedInUsers || []
    } catch (error) {
      return []
    }
  }