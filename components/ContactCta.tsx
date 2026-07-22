"use client";

import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/ContactForm";

export default function ContactCta() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.body.classList.add("contact-modal-open");
    } else if (!open && dialog.open) {
      dialog.close();
    }

    return () => document.body.classList.remove("contact-modal-open");
  }, [open]);

  return (
    <div className="creator-cta">
      <span>Shunday taklifnoma sizga ham yoqdimi?</span>
      <button type="button" onClick={() => setOpen(true)}>
        Buyurtma berish <span aria-hidden="true">↗</span>
      </button>

      <dialog
        ref={dialogRef}
        className="contact-dialog"
        aria-labelledby="contact-dialog-title"
        aria-describedby="contact-dialog-description"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="contact-dialog-panel">
          <button
            className="contact-dialog-close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Buyurtma formasini yopish"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3 3 13" />
            </svg>
          </button>
          <div className="contact-dialog-heading">
            <div className="contact-dialog-kicker">Siz uchun ham</div>
            <h2 id="contact-dialog-title">Shaxsiy taklifnomangiz</h2>
            <p id="contact-dialog-description">
              Tadbir ma&apos;lumotlaringizni qoldiring — tez orada siz bilan
              bog&apos;lanaman.
            </p>
          </div>
          <div className="contact-card">
            <ContactForm />
          </div>
        </div>
      </dialog>
    </div>
  );
}
