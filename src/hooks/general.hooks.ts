import { useContext, useMemo } from "react";
import {
  AppNavigatorContext,
  AppStorageContext,
} from "../contexts/app.context";
import { useNavigate } from "react-router";
import { NavigatorCallback } from "../types";
import IStorage from "../services/storage/storage.service.interface";

export function useApplicationStorage(): IStorage {
  return useContext(AppStorageContext);
}

export function useApplicationNavigator(): NavigatorCallback {
  const appNavigator = useContext(AppNavigatorContext);
  const reactNavigate = useNavigate();
  return useMemo(
    () => (appNavigator.navigator ? appNavigator.navigator : reactNavigate),
    [appNavigator, reactNavigate],
  );
}
