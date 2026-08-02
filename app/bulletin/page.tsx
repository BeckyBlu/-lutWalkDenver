'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback, type ChangeEvent, type KeyboardEvent } from 'react';

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
  // Handles serialized Firestore admin Timestamps ({ _seconds, _nanoseconds })
  if (value != null && typeof value === 'object' && '_seconds' in value) {
    return new Date((value as { _seconds: number })._seconds * 1000).toLocaleString();
  }
  if (typeof value === 'string') return value;
  return new Date().toLocaleString();
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

  // ── Fetch messages and threads from the API ───────────────────────────────

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json() as { messages?: { id: string; sender: string; text: string; time: string }[] };
        if (Array.isArray(json.messages) && json.messages.length > 0) {
          setMessages(json.messages);
        }
      }
    } catch {
      // Keep seed messages on failure
    }
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch('/api/posts', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json() as { posts?: Record<string, unknown>[] };
        if (Array.isArray(json.posts) && json.posts.length > 0) {
          setThreads(
            json.posts.map((d) => ({
              id: typeof d.id === 'string' ? d.id : String(Date.now()),
              title: typeof d.title === 'string' ? d.title : '',
              text: typeof d.text === 'string' ? d.text : '',
              imageUrl: typeof d.imageUrl === 'string' ? d.imageUrl : null,
              pinned: d.pinned === true,
              reactions:
                typeof d.reactions === 'object' && d.reactions !== null
                  ? (d.reactions as Record<string, number>)
                  : {},
              replyCount: typeof d.replyCount === 'number' ? d.replyCount : 0,
              createdAt: formatTimestamp(d.createdAt),
            })),
          );
        }
      }
    } catch {
      // Keep seed threads on failure
    }
  }, []);

  // ── Poll for updates (replaces Firestore onSnapshot) ──────────────────────
  useEffect(() => {
    void loadMessages();
    void loadThreads();

    const msgInterval = setInterval(() => { void loadMessages(); }, 5_000);
    const threadInterval = setInterval(() => { void loadThreads(); }, 15_000);

    // Pause polling while the tab is hidden; resume immediately on becoming visible.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void loadMessages();
        void loadThreads();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(msgInterval);
      clearInterval(threadInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadMessages, loadThreads]);

  // ── Auto-scroll chat ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = chatWindowRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // ── Chat ──────────────────────────────────────────────────────────────────

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;

    // Optimistic local update
    const localMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'You',
      text,
      sent: true,
      time: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, localMsg]);
    setChatInput('');

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, sender: 'Member' }),
      });
      // Refresh so the message shows with its server-side ID and timestamp
      await loadMessages();
    } catch {
      // Message already shown locally; silent failure
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

      if (res.ok) {
        // Refresh thread list to include the new post
        await loadThreads();
      } else {
        // Local fallback when the API is unavailable
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
          <div className="btn-row">
            <Link className="btn btn-secondary" href="/chatroom-spec">View E2EE spec</Link>
          </div>
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
