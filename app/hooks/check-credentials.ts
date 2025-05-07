import { useCredentialModal } from "../context/credential-context";
import { RouteCredentialConfig } from "../lib/types";

export const useCredentialCheck = () => {
  const { showModal } = useCredentialModal();

  const ensureCredentials = (credentials: RouteCredentialConfig) => {
    const missing = credentials.requiredKeys.filter(
      (key) => !sessionStorage.getItem(key)
    );

    if (missing.length > 0) {
      showModal({
        visible: true,
        data: credentials,
      });

      return false;
    }
    return true;
  };

  return { ensureCredentials };
};
