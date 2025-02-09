import { createContext } from "react";
import { SinglePageApplicationContextType } from "../types.d";
import autoConfigApplicationStorage from "../services/storage/storage.auto-cfg";

export const AppStorageContext = createContext(autoConfigApplicationStorage());
export const AppNavigatorContext =
  createContext<SinglePageApplicationContextType>({
    navigator: undefined,
    topicId: -1,
  });

export const AppStorageContextProvider = AppStorageContext.Provider;
export const AppNavigatorContextProvider = AppNavigatorContext.Provider;
