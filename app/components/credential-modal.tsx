import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { API_KEY_FIELD_LABELS } from "../constants";
import { useCredentialModal } from "../context/credential-context";
import Button from "./button";
import Input from "./input";

export const CredentialModal = () => {
  const { modalConfig, hideModal } = useCredentialModal();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [show, setShow] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    modalConfig.data?.requiredKeys.forEach((key) => {
      if (inputs[key]) sessionStorage.setItem(key, btoa(inputs[key]));
    });
    hideModal();
  };

  if (!modalConfig.visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center text-gray-900">
      <div className=" bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        {modalConfig.data?.title && (
          <h2 className="text-gray-900 mb-2">{modalConfig.data?.title}</h2>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {modalConfig.data?.requiredKeys.map((key) => (
            <div key={key} className="mb-4 mt-4 py-4">
              <label className="block text-xs font-medium mb-1">
                {API_KEY_FIELD_LABELS[key] || key}*
              </label>
              <div className="relative">
                <Input
                  type={show[key] ? "text" : "password"}
                  className="w-full px-3 pr-8 py-2 border rounded-md"
                  value={inputs[key] || ""}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-xs text-gray-600 cursor-pointer"
                  onClick={() =>
                    setShow((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                >
                  {show[key] ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
