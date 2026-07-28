'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { getClientDb } from '../../lib/firebase-client';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  Timestamp,
} from 'firebase/firestore';

// ── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  sent?: boolean;
  time: string;
};

type ThreadReply = {
  id: string;
  text: string;
  time: string;
};

type Thread = {
  id: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  pinned?: boolean;
  reactions?: Record<string, number>;
  replyCount?: number;
  createdAt: string;
  replies?: ThreadReply[];
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const REACTIONS = ['👍', '❤️', '✊', '🌹'];

function formatTimestamp(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toLocaleString();
  }
  if (typeof value === 'string') return value;
  return new Date().toLocaleString();
}

function firestoreUnavailable(): boolean {
  return !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BulletinPage() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', sender: 'Moderator', text: 'Welcome! Introduce yourself and be respectful.', time: new Date().toLocaleString() },
  ]);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadText, setThreadText] = useState('');
  const [threadImageFile, setThreadImageFile] = useState<File | null>(null);
  const [threadImagePreview, setThreadImagePreview] = useState('');
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: '0',
      title: 'Welcome to the community board',
      text: 'Use this space for organizing, resources, event planning, and respectful discussion.',
      createdAt: new Date().toLocaleString(),
    },
  ]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // ── Detect admin session ──────────────────────────────────────────────────
  useEffect(() => {
    setIsAdmin(window.localStorage.getItem('slutwalk-admin-access') === 'true');
  }, []);

  // ── Firestore real-time listeners ─────────────────────────────────────────
  useEffect(() => {
    if (firestoreUnavailable()) return;

    const db = getClientDb();

    // Chat messages
    const msgQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100),
    );
    const unsubMessages = onSnapshot(msgQuery, (snap) => {
      const msgs: ChatMessage[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          sender: typeof d.sender === 'string' ? d.sender : 'Member',
          text: typeof d.text === 'string' ? d.text : '',
          time: formatTimestamp(d.createdAt),
        };
      });
      setMessages(msgs);
    });

    // Bulletin threads
    const threadQuery = query(
      collection(db, 'posts'),
      orderBy('pinned', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(50),
    );
    const unsubThreads = onSnapshot(threadQuery, (snap) => {
      const fetched: Thread[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          title: typeof d.title === 'string' ? d.title : '',
          text: typeof d.text === 'string' ? d.text : '',
          imageUrl: typeof d.imageUrl === 'string' ? d.imageUrl : null,
          pinned: d.pinned === true,
          reactions: typeof d.reactions === 'object' && d.reactions !== null
            ? (d.reactions as Record<string, number>)
            : {},
          replyCount: typeof d.replyCount === 'number' ? d.replyCount : 0,
          createdAt: formatTimestamp(d.createdAt),
        };
      });
      setThreads(fetched);
    });

    return () => {
      unsubMessages();
      unsubThreads();
    };
  }, []);

  // ── Auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = chatWindowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ── Chat ──────────────────────────────────────────────────────────────────

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;

    // Optimistic local update while Firestore syncs (or if Firestore is absent)
    const localMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      text,
      sent: true,
      time: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    setChatInput('');

    if (firestoreUnavailable()) return;

    try {
      const { addDoc, serverTimestamp } = await import('firebase/firestore');
      const db = getClientDb();
      await addDoc(collection(db, 'messages'), {
        sender: 'Member',
        text,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Message already shown locally; silent failure in prototype
    }
  };

  const handleSendKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendChatMessage();
    }
  };

  // ── Thread image preview ─────────────────────────────────────────────────

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setThreadImageFile(file);
    if (!file) {
      setThreadImagePreview('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setThreadImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Post thread ───────────────────────────────────────────────────────────

  const addThread = async () => {
    const title = threadTitle.trim();
    const text = threadText.trim();
    if (!title || !text || posting) return;

    setPosting(true);

    let imageUrl: string | null = null;

    // Upload image if one was chosen
    if (threadImageFile) {
      const formData = new FormData();
      formData.append('file', threadImageFile);
      formData.append('folder', 'posts');

      try {
        const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: formData });
        if (res.ok) {
          const json = await res.json() as { url?: string };
          imageUrl = json.url ?? null;
        }
      } catch {
        // Non-fatal — post without image
      }
    }

    // Post to API
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, text, imageUrl }),
      });

      if (!res.ok && firestoreUnavailable()) {
        // Local fallback when Firebase is not configured
        setThreads((prev) => [
          {
            id: String(Date.now()),
            title,
            text,
            imageUrl: threadImagePreview || null,
            pinned: false,
            reactions: {},
            replyCount: 0,
            createdAt: new Date().toLocaleString(),
          },
          ...prev,
        ]);
      }
      // If Firestore is live, onSnapshot will push the new thread automatically
    } catch {
      // Local fallback
      setThreads((prev) => [
        {
          id: String(Date.now()),
          title,
          text,
          imageUrl: threadImagePreview || null,
          createdAt: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    }

    setThreadTitle('');
    setThreadText('');
    setThreadImageFile(null);
    setThreadImagePreview('');
    setPosting(false);
  };

  // ── Replies ───────────────────────────────────────────────────────────────

  const updateReplyInput = (threadId: string, value: string) => {
    setReplyInputs((prev) => ({ ...prev, [threadId]: value }));
  };

  const addReply = async (threadId: string) => {
    const text = replyInputs[threadId]?.trim() ?? '';
    if (!text) return;

    // Optimistic local update
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...(t.replies ?? []),
                { id: String(Date.now()), text, time: new Date().toLocaleString() },
              ],
              replyCount: (t.replyCount ?? 0) + 1,
            }
          : t,
      ),
    );
    updateReplyInput(threadId, '');

    try {
      await fetch(`/api/posts/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });
    } catch {
      // Already shown locally
    }
  };

  // ── Reactions ─────────────────────────────────────────────────────────────

  const addReaction = async (threadId: string, reaction: string) => {
    // Optimistic update
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              reactions: {
                ...(t.reactions ?? {}),
                [reaction]: ((t.reactions ?? {})[reaction] ?? 0) + 1,
              },
            }
          : t,
      ),
    );

    try {
      await fetch(`/api/posts/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reaction }),
      });
    } catch {
      // Non-fatal
    }
  };

  // ── Admin actions ─────────────────────────────────────────────────────────

  const deleteThread = async (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    try {
      await fetch(`/api/posts/${threadId}`, { method: 'DELETE', credentials: 'include' });
    } catch { /* non-fatal */ }
  };

  const togglePin = async (thread: Thread) => {
    const newPinned = !thread.pinned;
    setThreads((prev) => prev.map((t) => t.id === thread.id ? { ...t, pinned: newPinned } : t));
    try {
      await fetch(`/api/posts/${thread.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pinned: newPinned }),
      });
    } catch { /* non-fatal */ }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Bulletin board</p>
          <h1>Announcements, requests, and collective updates.</h1>
          <p>Members can coordinate volunteer opportunities, mutual aid requests, and projects in one shared space.</p>
        </div>
      </header>

      <section className="featured">
        <h2>Community posts</h2>
        <div className="bulletin-grid">
          <div className="community-board">
            <article>
              <h3>Announcements</h3>
              <p>Volunteer sign-up, wellness reminders, and upcoming actions.</p>
            </article>
            <article>
              <h3>Mutual aid</h3>
              <p>Ride shares, food support, and local resource sharing.</p>
            </article>
            <article>
              <h3>Discussion topics</h3>
              <p>Education circles, event planning, and archive collaboration.</p>
            </article>
          </div>

          <section className="chat-container">
            <header className="chat-header">
              <h2>Community Chat</h2>
              <span className="status">● Online</span>
            </header>

            <div className="chat-window" id="chatWindow" ref={chatWindowRef} role="log" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.sent ? 'sent' : 'received'}`}>
                  <div className="avatar" aria-hidden="true">
                    {message.sender.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="bubble">
                    <h4>{message.sender}</h4>
                    <p>{message.text}</p>
                    <small>{message.time}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <label htmlFor="messageInput">Chat message</label>
              <input
                type="text"
                id="messageInput"
                placeholder="Write a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleSendKey}
              />
              <button type="button" id="sendBtn" onClick={() => void sendChatMessage()}>
                Send
              </button>
            </div>

            <section className="new-thread">
              <h2>Create New Thread</h2>
              <label htmlFor="threadTitle">Thread title</label>
              <input
                id="threadTitle"
                type="text"
                placeholder="Thread title"
                value={threadTitle}
                onChange={(e) => setThreadTitle(e.target.value)}
              />
              <label htmlFor="threadText">Thread text</label>
              <textarea
                id="threadText"
                rows={5}
                placeholder="Start a discussion..."
                value={threadText}
                onChange={(e) => setThreadText(e.target.value)}
              />
              <label htmlFor="threadImage">Thread image</label>
              <input id="threadImage" type="file" accept="image/*" onChange={handleImageChange} />
              {threadImagePreview && (
                <Image
                  src={threadImagePreview}
                  alt="Image preview"
                  width={400}
                  height={300}
                  style={{ maxWidth: '100%', height: 'auto', marginTop: '0.5rem' }}
                  unoptimized
                />
              )}
              <button
                type="button"
                id="postThread"
                onClick={() => void addThread()}
                disabled={posting}
                aria-busy={posting}
              >
                {posting ? 'Posting…' : 'Post Thread'}
              </button>
            </section>

            <h3 className="thread-list-title">Recent Threads</h3>
            <div id="threads">
              {threads.map((thread) => (
                <article className="thread" key={thread.id}>
                  <div className="thread-header">
                    <strong>Anonymous</strong> • {thread.createdAt}
                    {thread.pinned && (
                      <span className="pin-badge" aria-label="Pinned post"> 📌 Pinned</span>
                    )}
                    {isAdmin && (
                      <span className="admin-controls">
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => void togglePin(thread)}
                          aria-label={thread.pinned ? 'Unpin post' : 'Pin post'}
                        >
                          {thread.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost btn-danger"
                          onClick={() => void deleteThread(thread.id)}
                          aria-label="Delete post"
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </div>
                  <div className="thread-body">
                    <h3>{thread.title}</h3>
                    {thread.imageUrl ? (
                      <Image
                        src={thread.imageUrl}
                        alt="Thread image"
                        width={600}
                        height={400}
                        style={{ maxWidth: '100%', height: 'auto' }}
                        unoptimized
                      />
                    ) : null}
                    <p>{thread.text}</p>

                    <div className="reaction-bar" role="group" aria-label="Reactions">
                      {REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="reaction-btn"
                          onClick={() => void addReaction(thread.id, emoji)}
                          aria-label={`React with ${emoji}`}
                        >
                          {emoji}{' '}
                          <span className="reaction-count">
                            {(thread.reactions?.[emoji] ?? 0) > 0
                              ? thread.reactions![emoji]
                              : ''}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="replies">
                      {(thread.replies ?? []).map((reply) => (
                        <div className="reply" key={reply.id}>
                          <small>Anonymous • {reply.time}</small>
                          <div>{reply.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="reply-form">
                    <label className="sr-only" htmlFor={`reply-${thread.id}`}>Write a reply</label>
                    <textarea
                      id={`reply-${thread.id}`}
                      rows={3}
                      placeholder="Write a reply..."
                      value={replyInputs[thread.id] ?? ''}
                      onChange={(e) => updateReplyInput(thread.id, e.target.value)}
                    />
                    <button type="button" onClick={() => void addReply(thread.id)}>Reply</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
