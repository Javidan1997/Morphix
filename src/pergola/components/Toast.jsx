import { useEffect, useRef } from "react";

/**
 * Page-level status message for actions taken outside the configurator panel
 * (scene changes, example designs). Optional action button, e.g. Undo.
 * Hovering or focusing it holds the message open.
 */
export default function Toast({ toast, onClose }) {
  const hold = useRef(false);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setInterval(() => { if (!hold.current) onClose(); }, toast.action ? 9000 : 5500);
    return () => clearInterval(timer);
  }, [toast, onClose]);

  return (
    <div className="pc-toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="pc-toast" key={toast.id}
          onPointerEnter={() => { hold.current = true; }} onPointerLeave={() => { hold.current = false; }}
          onFocus={() => { hold.current = true; }} onBlur={() => { hold.current = false; }}>
          <span>{toast.text}</span>
          {toast.action && <button type="button" className="pc-linklike" onClick={() => { toast.action.run(); }}>{toast.action.label}</button>}
        </div>
      )}
    </div>
  );
}
