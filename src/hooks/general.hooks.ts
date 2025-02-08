import { useContext } from "react";
import { AppStorageContext } from "../contexts/app.context";
import IStorage from "../services/storage/storage.service.interface";

export function useApplicationStorage(): IStorage {
  return useContext(AppStorageContext);
}
