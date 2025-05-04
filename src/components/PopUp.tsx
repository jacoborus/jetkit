interface IPopUp {
  children: React.ReactNode;
  buttons?: { name: string; onClick: (close: () => void) => void }[];
  cancelText?: string;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  isOpen: boolean;
  close: () => void;
}

export default function PopUp({
  children,
  buttons,
  cancelText,
  showCancelButton,
  showCloseButton,
  isOpen,
  close,
}: IPopUp) {
  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        {showCloseButton && (
          <button
            onClick={close}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        )}
        {children}
        <div className="modal-action">
          {buttons?.map((button, i) => (
            <button
              className="btn btn-secondary"
              onClick={() => button.onClick(close)}
              key={i}
            >
              {button.name}
            </button>
          ))}

          {showCancelButton && (
            <button onClick={close} className="btn">
              {cancelText || "Close"}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
