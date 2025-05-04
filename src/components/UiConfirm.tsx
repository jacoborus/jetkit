import React, { type ForwardedRef } from "react";

interface IUiConfirm {
  children: React.ReactNode;
  message?: string;
  acceptText?: string;
  cancelText?: string;
  resolve: (value: boolean) => void;
  ref: ForwardedRef<HTMLDialogElement>;
}

export default function UiConfirm({
  children,
  acceptText,
  cancelText,
  message,
  resolve,
  ref,
}: IUiConfirm) {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        {message || children}
        <div className="modal-action">
          <button className="btn" onClick={() => resolve(true)}>
            {acceptText || "Yes"}
          </button>
          <button className="btn" onClick={() => resolve(false)}>
            {cancelText || "No"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
