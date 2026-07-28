'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  sent?: boolean;
  time: string;
};

type ThreadReply = {
  id: number;
  text: string;
  time: string;
};

type Thread = {
  id: number;
  title: string;
  text: string;
  imageSrc?: string;
  createdAt: string;
  replies: ThreadReply[];
};

const now = () => new Date().toLocaleString();

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'Moderator',
    text: 'Welcome! Introduce yourself and be respectful.',
    time: now(),
  },
];

const initialThreads: Thread[] = [
  {
    id: 1,
    title: 'Welcome to the community board',
    text: 'Use this space for organizing, resources, event planning, and respectful discussion.',
    createdAt: now(),
    replies: [],
  },
];

export default function BulletinPage() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadText, setThreadText] = useState('');
  const [threadImage, setThreadImage] = useState('');
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window whenever a new message is added
  useEffect(() => {
    const el = chatWindowRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const addChatMessage = () => {
    const value = chatInput.trim();
    if (!value) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'You', text: value, sent: true, time: now() },
    ]);
    setChatInput('');
  };

  const handleSendKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addChatMessage();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setThreadImage('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setThreadImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addThread = () => {
    const title = threadTitle.trim();
    const text = threadText.trim();
    if (!title || !text) return;

    setThreads((current) => [
      {
        id: Date.now(),
        title,
        text,
        imageSrc: threadImage || undefined,
        createdAt: now(),
        replies: [],
      },
      ...current,
    ]);

    setThreadTitle('');
    setThreadText('');
    setThreadImage('');
  };

  const updateReplyInput = (threadId: number, value: string) => {
    setReplyInputs((current) => ({
      ...current,
      [threadId]: value,
    }));
  };

  const addReply = (threadId: number) => {
    const replyText = replyInputs[threadId]?.trim();
    if (!replyText) return;

    setThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              replies: [...thread.replies, { id: Date.now(), text: replyText, time: now() }],
            }
          : thread
      )
    );

    setReplyInputs((current) => ({
      ...current,
      [threadId]: '',
    }));
  };

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

            <div className="chat-window" id="chatWindow" ref={chatWindowRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sent ? 'sent' : 'received'}`}
                >
                  <div className="avatar">
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
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={handleSendKey}
              />
              <button type="button" id="sendBtn" onClick={addChatMessage}>
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
                onChange={(event) => setThreadTitle(event.target.value)}
              />
              <label htmlFor="threadText">Thread text</label>
              <textarea
                id="threadText"
                rows={5}
                placeholder="Start a discussion..."
                value={threadText}
                onChange={(event) => setThreadText(event.target.value)}
              />
              <label htmlFor="threadImage">Thread image</label>
              <input
                id="threadImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button type="button" id="postThread" onClick={addThread}>
                Post Thread
              </button>
            </section>

            <h3 className="thread-list-title">Recent Threads</h3>
            <div id="threads">
              {threads.map((thread) => (
                <article className="thread" key={thread.id}>
                  <div className="thread-header">
                    <strong>Anonymous</strong> • {thread.createdAt}
                  </div>
                  <div className="thread-body">
                    <h3>{thread.title}</h3>
                    {thread.imageSrc ? (
                      <img src={thread.imageSrc} alt="Thread image" />
                    ) : null}
                    <p>{thread.text}</p>
                    <div className="replies">
                      {thread.replies.map((reply) => (
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
                      value={replyInputs[thread.id] || ''}
                      onChange={(event) =>
                        updateReplyInput(thread.id, event.target.value)
                      }
                    />
                    <button type="button" onClick={() => addReply(thread.id)}>
                      Reply
                    </button>
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
