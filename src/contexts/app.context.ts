import { createContext } from "react";
import autoConfigApplicationStorage from "../services/storage/storage.auto-cfg";

export const AppStorageContext = createContext(autoConfigApplicationStorage());

export const AppStorageContextProvider = AppStorageContext.Provider;
