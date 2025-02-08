import { ReactNode } from "react";
import { AppStorageContextProvider } from "../contexts/app.context";
import autoConfigApplicationStorage from "../services/storage/storage.auto-cfg";

interface Properties {
  children: ReactNode;
}

export default function EntryModule({
  children,
}: Readonly<Properties>): ReactNode {
  const applicationStorage = autoConfigApplicationStorage();

  return (
    <AppStorageContextProvider value={applicationStorage}>
      {children}
    </AppStorageContextProvider>
  );
}
