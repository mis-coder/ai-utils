import React, { createContext, useContext, useState } from "react";

type CredentialModalConfig = {
  visible: boolean;
  data: {
    requiredKeys: string[];
    title: string;
    description: string;
  } | null;
  onSuccess?: () => void;
};

const CredentialContext = createContext<{
  modalConfig: CredentialModalConfig;
  showModal: (config: CredentialModalConfig) => void;
  hideModal: () => void;
}>({
  modalConfig: { visible: false, data: null },
  showModal: () => {},
  hideModal: () => {},
});

export const CredentialProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalConfig, setModalConfig] = useState<CredentialModalConfig>({
    visible: false,
    data: null,
  });

  const showModal = (config: CredentialModalConfig) =>
    setModalConfig({ ...config });

  const hideModal = () => setModalConfig({ visible: false, data: null });

  return (
    <CredentialContext.Provider value={{ modalConfig, showModal, hideModal }}>
      {children}
    </CredentialContext.Provider>
  );
};

export const useCredentialModal = () => useContext(CredentialContext);
