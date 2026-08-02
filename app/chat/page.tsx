'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { decryptText, encryptText, exportKeyToBase64, generateEncryptionKey, importKeyFromBase64 } from '../../lib/e2e-chat';

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  encrypted?: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Secure member chatroom ready.');
  const [keyBase64, setKeyBase64] = useState<string | null>(null);
  const [keyReady, setKeyReady] = useState(false);

  const key = useMemo(() => (keyBase64 ? null : null), [keyBase64]);

  useEffect(() => {
    const stored = window.localStorage.getItem('slutwalk-e2e-key');
    if (stored) {
      setKeyBase64(stored);
      setKeyReady(true);
      void loadMessages();
      return;
    }

    let active = true;
    void (async () => {
      const generated = await generateEncryptionKey();
      if (!active) return;
      const exported = await exportKeyToBase64(generated);
      window.localStorage.setItem('slutwalk-e2e-key', exported);
      setKeyBase64(exported);
      setKeyReady(true);
      void loadMessages();
    })();

    return () => { active = false; };
  }, []);

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/messages', { credentials: 'include' });
      if (!res.ok) {
        setStatus('Member access is required to view the chatroom.');
        return;
      }

      const json = await res.json() as { messages?: Array<{ id: string; sender: string; text: string; time: string }> };
      const nextMessages = (json.messages ?? []).map((message) => ({
        ...message,
        encrypted: true,
      }));
      setMessages(nextMessages);
    } catch {
      setStatus('Unable to sync the secure chatroom right now.');
    }
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !keyBase64) return;

    setStatus('Encrypting your message locally…');
    const keyMaterial = await importKeyFromBase64(keyBase64);
    const payload = await encryptText(text, keyMaterial);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          text: JSON.stringify(payload),
          sender: 'Member',
          encrypted: true,
        }),
      });

      if (!res.ok) {
        setStatus('Your message could not be sent.');
        return;
      }

      setDraft('');
      setStatus('Message encrypted and queued for delivery.');
      await loadMessages();
    } catch {
      setStatus('Unable to send the encrypted message.');
    }
  };

  const exportKeys = async () => {
    if (!keyBase64) return;
    const blob = new Blob([keyBase64], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slutwalk-e2e-key.txt';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('Encrypted key exported locally.');
  };

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Private member chatroom</p>
          <h1>Encrypted conversations for the community.</h1>
          <p>Messages are encrypted on device before they are sent, and the server stores ciphertext only.</p>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={() => void exportKeys()}>Export encrypted key</button>
          </div>
        </div>
      </header>

      <section className="featured">
        <div className="chatroom-shell">
          <div className="chatroom-card">
            <div className="chatroom-header">
              <div>
                <h2>Secure member chat</h2>
                <p className="helper">{status}</p>
              </div>
              <span className="status-pill">{keyReady ? 'Key ready' : 'Preparing key'}</span>
            </div>

            <div className="chatroom-list" role="log" aria-live="polite">
              {messages.map((message) => (
                <article key={message.id} className="chatroom-message">
                  <div className="chatroom-message__meta">
                    <strong>{message.sender}</strong>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.text}</p>
                  <small>{message.encrypted ? 'Ciphertext stored on server' : 'Plaintext preview'}</small>
                </article>
              ))}
            </div>

            <div className="chatroom-compose">
              <label htmlFor="chat-draft" className="sr-only">Compose secure message</label>
              <textarea
                id="chat-draft"
                rows={4}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a message that will be encrypted locally before it is sent."
              />
              <button type="button" className="btn" onClick={() => void sendMessage()}>Send encrypted message</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
