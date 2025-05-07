"use client";

import { Toaster } from "react-hot-toast";
import { CredentialProvider } from "../context/credential-context";
import { CredentialModal } from "./credential-modal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CredentialProvider>
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      {children}
      <CredentialModal />
    </CredentialProvider>
  );
}
