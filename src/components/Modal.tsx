import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-all duration-200"
          aria-label="Close Modal"
        >
          ✖
        </button>

        {/* Modal Content */}
        <div className="space-y-4">
          <div className="text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
