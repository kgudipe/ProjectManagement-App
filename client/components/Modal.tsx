import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-950/55 p-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-2xl p-5 shadow-2xl shadow-black/20">
        <Header
          name={name}
          buttonComponent={
            <button
              className="icon-button"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
