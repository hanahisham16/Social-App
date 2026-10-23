import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { userProfileType } from "../../types/user.type";
import { getMyProfile } from "../../services/profile.service";
import { TokenContext } from "./tokenContext";

export type UserContextType = {
  userDetails: userProfileType | null;
  setUserDetails: Dispatch<SetStateAction<userProfileType | null>>;
};
export const UserContext = createContext({});

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userDetails, setUserDetails] = useState<userProfileType | null>(null);
const { token } = useContext(TokenContext);  
async function getUserProfile() {
    try {
      const { data } = await getMyProfile();
      setUserDetails(data.data.user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(token){
    getUserProfile();

    }
  }, [token]);
  return (
    <>
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
