"use client";

import { useState } from "react";

function CopyDetail({ value, label }: { value: string; label: string }) {
  const [message, setMessage] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied");
      window.setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Copy is unavailable in this browser.");
    }
  };

  return (
    <>
      <button className="gift-details__copy" type="button" onClick={() => void copy()}>
        {message === "Copied" ? "COPIED" : `COPY ${label}`}
      </button>
      <p className="gift-details__copy-status" role="status" aria-live="polite">
        {message}
      </p>
    </>
  );
}

export default function GiftDetails() {
  return (
    <div className="gift-details">
      <article className="gift-details__card gift-details__card--bride" style={{ gridColumn: "1 / -1", border: "2px solid #9e1344", background: "linear-gradient(135deg, #fff4f5, #ffe2d6)", boxShadow: "0 12px 34px rgba(128, 0, 38, 0.14)", padding: "clamp(24px, 5vw, 42px)", textAlign: "center" }}>
        <p className="gift-details__eyebrow">SEND LOVE TO THE BRIDE ♥</p>
        <h3 style={{ fontFamily: "var(--display)", fontSize: "clamp(26px, 5vw, 42px)", margin: "12px 0" }}>Francisca Duodu</h3>
        <p style={{ margin: "8px 0", fontFamily: "var(--sans)", letterSpacing: "0.12em", fontSize: "13px" }}>MTN MOBILE MONEY</p>
        <p className="gift-details__number" style={{ fontSize: "clamp(27px, 6vw, 44px)", fontWeight: 700, margin: "12px 0 18px", overflowWrap: "anywhere" }}>055 613 6234</p>
        <CopyDetail value="0556136234" label="BRIDE\u0027S MOMO NUMBER" />
      </article>
      <article className="gift-details__card">
        <p className="gift-details__eyebrow">BANK DETAILS</p>
        <dl>
          <div><dt>Bank</dt><dd>Stanbic Bank</dd></div>
          <div><dt>Account name</dt><dd>Francisca Duodu</dd></div>
          <div><dt>Account number</dt><dd className="gift-details__number">9040012612499</dd></div>
          <div><dt>Branch</dt><dd>KNUST</dd></div>
        </dl>
        <CopyDetail value="9040012612499" label="ACCOUNT NUMBER" />
      </article>
      <article className="gift-details__card gift-details__card--momo">
        <p className="gift-details__eyebrow">MTN MOMO</p>
        <dl>
          <div><dt>Number</dt><dd className="gift-details__number">0537620441</dd></div>
          <div><dt>Name</dt><dd>Kwabena Boafo Agyepong</dd></div>
        </dl>
        <CopyDetail value="0537620441" label="MOMO NUMBER" />
      </article>
    </div>
  );
}
