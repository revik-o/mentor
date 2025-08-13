import { createContext } from "react";
import type { Setter } from "../types";

export type ActivityContextType = {
  activity: string;
  setActivity: Setter<string>;
  params: Map<string, object>;
  setParam: Setter<[string, object]>;
};

export const ActivityContext = createContext({
  activity: "/",
  setActivity: () => {},
  params: new Map<string, object>(),
  setParam: () => {}
} as ActivityContextType);
export const ActivityContextProvider = ActivityContext.Provider;
