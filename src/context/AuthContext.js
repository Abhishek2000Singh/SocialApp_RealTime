import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";
const INITIAL_STATE = {
    user: {
        "_id": "671ab93ddeafbb6018b1d1b4",
        "username": "Jane Doe2",
        "email": "janedoe2@gmail.com",
        "profilePicture": "../assets/person/4.jpeg",
        "coverPicture": "../assets/person/noCover.png",
        "followers": [],
        "following": [],
        "isAdmin": false,
        "createdAt": "2024-10-24T21:16:45.195Z",
        "__v": 0,
        "desc": "Hey its a description new updated",
        "city": "Kolkata",
        "from": "Calcutta",
        "relationship": 2
    },
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch
            }}>
            {children}
        </AuthContext.Provider>
    )
} 