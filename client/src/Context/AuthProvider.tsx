import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { vallidateToken } from "@/Api/Auth";
import { GetLoggedInUser, GetUserRole } from "@/Api/user";

interface userType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  gender?: "male" | "female";
  imageUrl?: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  plan: "free" | "premium";
  applications: number;
  createdAt: Date;
  updatedAt: Date;
}

type AppContext = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: userType;
};

const appContext = React.createContext<AppContext | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppProviderProps) => {
  const { isError: tokenError } = useQuery({
    queryKey: ["ValidateToken"],
    queryFn: vallidateToken,
    retry: false,
  });

  const { data: roleData } = useQuery({
    queryKey: ["GetUserRole"],
    queryFn: GetUserRole,
    retry: false,
  });

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: GetLoggedInUser,
    retry: false,
  });

  const isLoggedIn = !tokenError;
  const isAdmin = roleData?.role === "admin";
  const user = data?.data;

  return (
    <appContext.Provider value={{ isLoggedIn, isAdmin, user }}>
      {children}
    </appContext.Provider>
  );
};

export const UseAppContext = () => {
  const context = useContext(appContext);

  if (!context) {
    throw new Error("UseAppContext must be used within an AppContextProvider");
  }

  return context;
};
