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
      <article className="gift-details__card gift-details__card--featured">
        <p className="gift-details__method">MTN Mobile Money</p>
        <p className="gift-details__featured-number">055 613 6234</p>
        <p className="gift-details__recipient">Francisca Duodu</p>
        <CopyDetail value="0556136234" label="MOMO NUMBER" />
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
