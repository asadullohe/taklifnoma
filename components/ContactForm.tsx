"use client";

import { useActionState, useState } from "react";
import { submitContactInquiry } from "@/app/actions";
import { initialContactState } from "@/lib/contact";

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 3 10.5 13.5M21 3l-6.7 18-3.8-7.5L3 9.7 21 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [state, formAction, pending] = useActionState(
    submitContactInquiry,
    initialContactState,
  );

  if (state.status === "success") {
    return (
      <div className="contact-success" role="status">
        <div className="contact-success-mark" aria-hidden="true">
          ✓
        </div>
        <h3>So‘rovingiz yetib bordi</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction} aria-busy={pending}>
      <div className="contact-field">
        <label htmlFor="contact-name">
          Ismingiz <sup>*</sup>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={80}
          placeholder="Ismingizni kiriting"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "contact-name-error" : undefined}
          required
        />
        {state.fieldErrors?.name ? (
          <span className="contact-error" id="contact-name-error">
            {state.fieldErrors.name}
          </span>
        ) : null}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-method">
          Telefon yoki Telegram <sup>*</sup>
        </label>
        <input
          id="contact-method"
          name="contact"
          type="text"
          autoComplete="tel"
          minLength={7}
          maxLength={100}
          pattern="(?:\+?(?:[0-9][ ()-]?){6,14}[0-9]|@[A-Za-z0-9_]{5,32}|(?:https?://)?t\.me/[A-Za-z0-9_]{5,32})"
          title="Telefon raqamini yoki @username ko‘rinishidagi Telegram manzilini kiriting"
          placeholder="+998 90 123 45 67 yoki @username"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors?.contact)}
          aria-describedby={
            state.fieldErrors?.contact ? "contact-method-error" : undefined
          }
          required
        />
        {state.fieldErrors?.contact ? (
          <span className="contact-error" id="contact-method-error">
            {state.fieldErrors.contact}
          </span>
        ) : null}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-note">
          Qisqacha izoh <span>(ixtiyoriy)</span>
        </label>
        <textarea
          id="contact-note"
          name="note"
          rows={2}
          maxLength={500}
          placeholder="Tadbir sanasi yoki istaklaringiz"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors?.note)}
          aria-describedby={state.fieldErrors?.note ? "contact-note-error" : undefined}
        />
        {state.fieldErrors?.note ? (
          <span className="contact-error" id="contact-note-error">
            {state.fieldErrors.note}
          </span>
        ) : null}
      </div>

      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-company">Kompaniya</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" ? (
        <p className="contact-form-message" role="alert">
          {state.message}
        </p>
      ) : null}

      <button className="contact-submit" type="submit" disabled={pending}>
        <span aria-live="polite">
          {pending ? "Yuborilmoqda..." : "Bog‘lanish uchun yuborish"}
        </span>
        <SendIcon />
      </button>
      <p className="contact-privacy">
        Ma’lumotlaringiz faqat siz bilan bog‘lanish uchun ishlatiladi.
      </p>
    </form>
  );
}
