"use client";

import { useEffect, useState, type FormEvent } from "react";
import { memoryClient } from "../lib/shared-memories";

export default function MemoryModerator({ onAccessChange }: { onAccessChange: (allowed: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!memoryClient) return;
    const client = memoryClient;
    let active = true;
    let version = 0;
    const timers = new Set<number>();
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const current = ++version;
      if (!active) return;
      setSignedIn(Boolean(session?.user));
      onAccessChange(false);
      if (!session?.user) return;

      // Run database requests outside Supabase's auth callback.
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        void client.from("wedding_moderators").select("user_id")
          .eq("user_id", session.user.id).maybeSingle()
          .then(({ data, error }) => {
            if (!active || current !== version) return;
            onAccessChange(Boolean(data) && !error);
            setMessage(error ? "Could not check moderation access." : data ? "You can now remove shared photos." : "This account does not have moderation access.");
          });
      }, 0);
      timers.add(timer);
    });

    return () => {
      active = false;
      version += 1;
      timers.forEach((timer) => window.clearTimeout(timer));
      subscription.unsubscribe();
    };
  }, [onAccessChange]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!memoryClient) return;
    setBusy(true);
    setMessage("");
    const { error } = await memoryClient.auth.signInWithPassword({ email, password });
    setPassword("");
    if (error) setMessage("Could not sign in. Please check your email and password.");
    setBusy(false);
  };

  const signOut = async () => {
    if (!memoryClient) return;
    setBusy(true);
    const { error } = await memoryClient.auth.signOut();
    setMessage(error ? "Could not sign out. Please try again." : "Signed out.");
    setBusy(false);
  };

  return (
    <div className="memory-moderator">
      <button className="memory-moderator__toggle" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Close photo management" : "Manage photos"}
      </button>
      {open && (
        <div className="memory-moderator__panel">
          {signedIn ? (
            <button className="memory-moderator__action" type="button" onClick={() => void signOut()} disabled={busy}>Sign out</button>
          ) : (
            <form onSubmit={(event) => void signIn(event)}>
              <p>Sign in to remove photos from the shared wall.</p>
              <label>Email<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
              <button className="memory-moderator__action" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            </form>
          )}
          <p className="memory-moderator__message" role="status">{message}</p>
        </div>
      )}
    </div>
  );
}
