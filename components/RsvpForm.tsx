"use client";

import { useActionState, useState } from "react";
import { submitRsvp } from "@/app/actions";
import { initialRsvpState, type RsvpState } from "@/lib/rsvp";

function StepperIcon({ plus = false }: { plus?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {plus ? (
        <path d="M8 3.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}

export default function RsvpForm({
  initialState = initialRsvpState,
}: {
  initialState?: RsvpState;
}) {
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState<
    "attending" | "not_attending"
  >("attending");
  const [state, formAction, pending] = useActionState(
    submitRsvp,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rsvp-success" role="status">
        <div className="rsvp-success-mark" aria-hidden="true">
          ✓
        </div>
        <h3>Javob qabul qilindi</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form className="rsvp-form" action={formAction}>
      <div className="rsvp-field">
        <label htmlFor="rsvp-name">
          Mehmon ismi <sup>*</sup>
        </label>
        <input
          id="rsvp-name"
          name="guestName"
          type="text"
          autoComplete="name"
          maxLength={80}
          placeholder="Ismingizni kiriting"
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors?.guestName)}
          aria-describedby={state.fieldErrors?.guestName ? "rsvp-name-error" : undefined}
          required
        />
        {state.fieldErrors?.guestName ? (
          <span className="rsvp-error" id="rsvp-name-error">
            {state.fieldErrors.guestName}
          </span>
        ) : null}
      </div>

      <fieldset className="rsvp-field rsvp-count-field">
        <legend id="rsvp-count-label">Mehmonlar soni</legend>
        <div
          className="rsvp-stepper"
          role="group"
          aria-labelledby="rsvp-count-label"
          aria-describedby={
            state.fieldErrors?.guestCount
              ? "rsvp-count-hint rsvp-count-error"
              : "rsvp-count-hint"
          }
        >
          <button
            type="button"
            onClick={() => setGuestCount((count) => Math.max(1, count - 1))}
            disabled={guestCount === 1}
            aria-label="Mehmonlar sonini kamaytirish"
          >
            <StepperIcon />
          </button>
          <output aria-live="polite" aria-label={`${guestCount} mehmon`}>
            {guestCount}
          </output>
          <button
            type="button"
            onClick={() => setGuestCount((count) => Math.min(5, count + 1))}
            disabled={guestCount === 5}
            aria-label="Mehmonlar sonini oshirish"
          >
            <StepperIcon plus />
          </button>
        </div>
        <input type="hidden" name="guestCount" value={guestCount} />
        <small className="rsvp-count-hint" id="rsvp-count-hint">
          1 dan 5 gacha
        </small>
        {state.fieldErrors?.guestCount ? (
          <span className="rsvp-error" id="rsvp-count-error">
            {state.fieldErrors.guestCount}
          </span>
        ) : null}
      </fieldset>

      <fieldset
        className="rsvp-attendance"
        aria-describedby={state.fieldErrors?.status ? "rsvp-status-error" : undefined}
      >
        <legend>
          To‘yga kelasizmi? <sup>*</sup>
        </legend>
        <div className="rsvp-options">
          <label className="rsvp-option">
            <input
              type="radio"
              name="status"
              value="attending"
              checked={attendance === "attending"}
              onChange={() => setAttendance("attending")}
              required
            />
            <span className="rsvp-option-card">
              <span className="rsvp-option-icon yes" aria-hidden="true">
                ✓
              </span>
              <strong>Ha, mamnuniyat bilan</strong>
            </span>
          </label>
          <label className="rsvp-option">
            <input
              type="radio"
              name="status"
              value="not_attending"
              checked={attendance === "not_attending"}
              onChange={() => setAttendance("not_attending")}
              required
            />
            <span className="rsvp-option-card">
              <span className="rsvp-option-icon no" aria-hidden="true">
                ×
              </span>
              <strong>Afsuski, kela olmayman</strong>
            </span>
          </label>
        </div>
        {state.fieldErrors?.status ? (
          <span className="rsvp-error" id="rsvp-status-error">
            {state.fieldErrors.status}
          </span>
        ) : null}
      </fieldset>

      <div className="rsvp-field">
        <label htmlFor="rsvp-note">
          Sharh <span>(ixtiyoriy)</span>
        </label>
        <textarea
          id="rsvp-note"
          name="note"
          rows={2}
          maxLength={400}
          placeholder="Sizning tilaklaringiz yoki savollaringiz"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          aria-invalid={Boolean(state.fieldErrors?.note)}
          aria-describedby={state.fieldErrors?.note ? "rsvp-note-error" : undefined}
        />
        {state.fieldErrors?.note ? (
          <span className="rsvp-error" id="rsvp-note-error">
            {state.fieldErrors.note}
          </span>
        ) : null}
      </div>

      <div className="rsvp-honeypot" aria-hidden="true">
        <label htmlFor="rsvp-website">Website</label>
        <input
          id="rsvp-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" ? (
        <p className="rsvp-form-message" role="alert">
          {state.message}
        </p>
      ) : null}

      <button className="rsvp-submit" type="submit" disabled={pending}>
        <span>{pending ? "Yuborilmoqda..." : "Yuborish"}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 3 10.5 13.5M21 3l-6.7 18-3.8-7.5L3 9.7 21 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p className="rsvp-required">* Majburiy maydonlar</p>
    </form>
  );
}
