import { useContext } from "react";
import { ActivityContext, type ActivityContextType } from "../contexts/activity.context";

export function useRedirect(): ActivityContextType {
  return useContext(ActivityContext);
}
