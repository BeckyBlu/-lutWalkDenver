'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  title: string;
  text: string;
  pinned?: boolean;
  replyCount?: number;
  createdAt?: string;
};

type AdminEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

type Stats = {
  posts: number;
  events: number;
  products: number;
};

type GalleryAsset = {
  id: string;
  title: string;
  description: string;
  collection: 'archive' | 'community';
  category: 'photos' | 'flyers' | 'press' | 'zines' | 'general';
  imageUrl: string;
};

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'moderation' | 'events' | 'products' | 'archive'>('stats');

  const [stats, setStats] = useState<Stats>({ posts: 0, events: 0, products: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);

  // Event form
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtTime, setEvtTime] = useState('');
  const [evtLocation, setEvtLocation] = useState('');
  const [evtDescription, setEvtDescription] = useState('');
  const [evtStatus, setEvtStatus] = useState('');

  // Product form
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('apparel');
  const [prodStock, setProdStock] = useState('');
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [prodStatus, setProdStatus] = useState('');

  // Archive upload
  const [archiveFile, setArchiveFile] = useState<File | null>(null);
  const [archiveCollection, setArchiveCollection] = useState<'archive' | 'community'>('archive');
  const [archiveCategory, setArchiveCategory] = useState<'photos' | 'flyers' | 'press' | 'zines' | 'general'>('photos');
  const [archiveTitle, setArchiveTitle] = useState('');
  const [archiveDescription, setArchiveDescription] = useState('');
  const [archiveStatus, setArchiveStatus] = useState('');
  const [archiveUrl, setArchiveUrl] = useState('');

  // ── Data fetching ────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    const [postsRes, eventsRes, productsRes, galleryRes] = await Promise.allSettled([
      fetch('/api/posts?limit=50', { credentials: 'include' }),
      fetch('/api/events?limit=50', { credentials: 'include' }),
      fetch('/api/products', { credentials: 'include' }),
      fetch('/api/gallery?limit=80', { credentials: 'include' }),
    ]);

    if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
      const json = await postsRes.value.json() as { posts?: Post[] };
      const fetched = json.posts ?? [];
      setPosts(fetched);
      setStats((s) => ({ ...s, posts: fetched.length }));
    }
    if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
      const json = await eventsRes.value.json() as { events?: AdminEvent[] };
      const fetched = json.events ?? [];
      setEvents(fetched);
      setStats((s) => ({ ...s, events: fetched.length }));
    }
    if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
      const json = await productsRes.value.json() as { products?: Product[] };
      const fetched = json.products ?? [];
      setProducts(fetched);
      setStats((s) => ({ ...s, products: fetched.length }));
    }
    if (galleryRes.status === 'fulfilled' && galleryRes.value.ok) {
      const json = await galleryRes.value.json() as { assets?: GalleryAsset[] };
      setGalleryAssets(json.assets ?? []);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  // ── Moderation ───────────────────────────────────────────────────────────

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/posts/${id}`, { method: 'DELETE', credentials: 'include' });
  };

  const togglePin = async (post: Post) => {
    const pinned = !post.pinned;
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, pinned } : p));
    await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ pinned }),
    });
  };

  // ── Events ───────────────────────────────────────────────────────────────

  const createEvent = async (e: FormEvent) => {
    e.preventDefault();
    setEvtStatus('Saving…');
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: evtTitle,
        date: evtDate,
        time: evtTime,
        location: evtLocation,
        description: evtDescription,
      }),
    });
    if (res.ok) {
      setEvtStatus('Event created');
      setEvtTitle(''); setEvtDate(''); setEvtTime(''); setEvtLocation(''); setEvtDescription('');
      void loadData();
    } else {
      setEvtStatus('Error creating event');
    }
  };

  const deleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/events/${id}`, { method: 'DELETE', credentials: 'include' });
  };

  // ── Products ─────────────────────────────────────────────────────────────

  const uploadProductImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'products');
    const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: form });
    if (!res.ok) return '';
    const json = await res.json() as { url?: string };
    return json.url ?? '';
  };

  const createProduct = async (e: FormEvent) => {
    e.preventDefault();
    setProdStatus('Saving…');
    let imageUrl = '';
    if (prodImageFile) imageUrl = await uploadProductImage(prodImageFile);

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: prodName,
        description: prodDesc,
        price: Math.round(parseFloat(prodPrice) * 100),
        imageUrl,
        category: prodCategory,
        stock: parseInt(prodStock, 10) || 0,
      }),
    });
    if (res.ok) {
      setProdStatus('Product created');
      setProdName(''); setProdDesc(''); setProdPrice(''); setProdStock(''); setProdImageFile(null);
      void loadData();
    } else {
      setProdStatus('Error creating product');
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/products/${id}`, { method: 'DELETE', credentials: 'include' });
  };

  // ── Archive ───────────────────────────────────────────────────────────────

  const uploadArchiveFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!archiveFile) return;
    const title = archiveTitle.trim();
    if (!title) {
      setArchiveStatus('Title is required');
      return;
    }

    setArchiveStatus('Uploading…');
    const form = new FormData();
    form.append('file', archiveFile);
    form.append('folder', `${archiveCollection}/${archiveCategory}`);
    const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: form });
    if (res.ok) {
      const json = await res.json() as { url?: string; path?: string };
      const url = json.url ?? '';
      setArchiveUrl(url);

      const metaRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description: archiveDescription,
          collection: archiveCollection,
          category: archiveCategory,
          imageUrl: url,
          storagePath: json.path ?? '',
        }),
      });

      if (metaRes.ok) {
        setArchiveStatus('Upload and gallery publish complete');
        setArchiveFile(null);
        setArchiveTitle('');
        setArchiveDescription('');
        void loadData();
      } else {
        setArchiveStatus('Uploaded file, but failed to save gallery metadata');
      }
    } else {
      setArchiveStatus('Upload failed');
    }
  };

  const deleteGalleryAsset = async (id: string) => {
    setGalleryAssets((prev) => prev.filter((asset) => asset.id !== id));
    await fetch(`/api/gallery/${id}`, { method: 'DELETE', credentials: 'include' });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'stats', label: 'Statistics' },
    { key: 'moderation', label: 'Moderation' },
    { key: 'events', label: 'Events' },
    { key: 'products', label: 'Products' },
    { key: 'archive', label: 'Archive' },
  ];

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/admin-login">Admin Login</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Administrator dashboard</p>
          <h1>Manage the community hub.</h1>
          <p>Moderate content, manage events, products, and archive uploads.</p>
        </div>
      </header>

      {/* Tab navigation */}
      <nav aria-label="Admin sections" className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`admin-tab ${activeTab === tab.key ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            aria-current={activeTab === tab.key ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="featured">

        {/* ── Statistics ───────────────────────────────────────────────── */}
        {activeTab === 'stats' && (
          <>
            <h2>Community statistics</h2>
            <div className="notice-grid">
              <article>
                <h3>{stats.posts}</h3>
                <p>Bulletin posts</p>
              </article>
              <article>
                <h3>{stats.events}</h3>
                <p>Upcoming events</p>
              </article>
              <article>
                <h3>{stats.products}</h3>
                <p>Store products</p>
              </article>
            </div>
          </>
        )}

        {/* ── Moderation ───────────────────────────────────────────────── */}
        {activeTab === 'moderation' && (
          <>
            <h2>Content moderation controls</h2>
            {posts.length === 0 && <p>No posts yet.</p>}
            <div className="admin-list">
              {posts.map((post) => (
                <article key={post.id} className="admin-list-item">
                  <div className="admin-list-meta">
                    <strong>{post.title}</strong>
                    {post.pinned && <span className="pin-badge">Pinned</span>}
                    <span className="muted"> · {post.replyCount ?? 0} replies</span>
                  </div>
                  <p className="admin-list-body">{post.text}</p>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => void togglePin(post)}
                    >
                      {post.pinned ? 'Edit pin' : 'Add pin'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => void deletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* ── Events ───────────────────────────────────────────────────── */}
        {activeTab === 'events' && (
          <>
            <h2>Event management controls</h2>
            <form className="admin-form" onSubmit={(e) => void createEvent(e)}>
              <h3>Add event</h3>
              <label htmlFor="evt-title">Title</label>
              <input id="evt-title" type="text" value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} required />

              <label htmlFor="evt-date">Date</label>
              <input id="evt-date" type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} required />

              <label htmlFor="evt-time">Time</label>
              <input id="evt-time" type="text" placeholder="e.g. 4:00 PM" value={evtTime} onChange={(e) => setEvtTime(e.target.value)} />

              <label htmlFor="evt-location">Location</label>
              <input id="evt-location" type="text" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} />

              <label htmlFor="evt-description">Description</label>
              <textarea id="evt-description" rows={4} value={evtDescription} onChange={(e) => setEvtDescription(e.target.value)} />

              <button type="submit" className="btn">Add event</button>
              {evtStatus && <p className="helper">{evtStatus}</p>}
            </form>

            <h3>Edit or delete events</h3>
            <div className="admin-list">
              {events.map((ev) => (
                <article key={ev.id} className="admin-list-item">
                  <div className="admin-list-meta">
                    <strong>{ev.title}</strong>
                    <span className="muted"> · {ev.date}</span>
                  </div>
                  <p className="admin-list-body">{ev.location}</p>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => void deleteEvent(ev.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {events.length === 0 && <p>No events yet.</p>}
            </div>
          </>
        )}

        {/* ── Products ─────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <>
            <h2>Store management controls</h2>
            <form className="admin-form" onSubmit={(e) => void createProduct(e)}>
              <h3>Add product</h3>
              <label htmlFor="prod-name">Product name</label>
              <input id="prod-name" type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} required />

              <label htmlFor="prod-desc">Description</label>
              <textarea id="prod-desc" rows={3} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />

              <label htmlFor="prod-price">Price (USD)</label>
              <input id="prod-price" type="number" min="0" step="0.01" placeholder="0.00" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />

              <label htmlFor="prod-category">Category</label>
              <select id="prod-category" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} className="admin-select">
                {['apparel', 'stickers', 'zines', 'posters', 'books', 'other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label htmlFor="prod-stock">Stock</label>
              <input id="prod-stock" type="number" min="0" placeholder="0" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />

              <label htmlFor="prod-image">Product image</label>
              <input
                id="prod-image"
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProdImageFile(e.target.files?.[0] ?? null)}
              />

              <button type="submit" className="btn">Add product</button>
              {prodStatus && <p className="helper">{prodStatus}</p>}
            </form>

            <h3>Edit or delete products</h3>
            <div className="admin-list">
              {products.map((prod) => (
                <article key={prod.id} className="admin-list-item">
                  {prod.imageUrl && (
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      width={80}
                      height={80}
                      className="admin-product-img"
                      unoptimized
                    />
                  )}
                  <div className="admin-list-meta">
                    <strong>{prod.name}</strong>
                    <span className="muted"> · ${(prod.price / 100).toFixed(2)} · {prod.category} · {prod.stock} in stock</span>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => void deleteProduct(prod.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {products.length === 0 && <p>No products yet.</p>}
            </div>
          </>
        )}

        {/* ── Archive ───────────────────────────────────────────────────── */}
        {activeTab === 'archive' && (
          <>
            <h2>Archive controls</h2>
            <form className="admin-form" onSubmit={(e) => void uploadArchiveFile(e)}>
              <label htmlFor="archive-collection">Collection</label>
              <select
                id="archive-collection"
                value={archiveCollection}
                onChange={(e) => setArchiveCollection(e.target.value as 'archive' | 'community')}
                className="admin-select"
              >
                {['archive', 'community'].map((collection) => (
                  <option key={collection} value={collection}>{collection}</option>
                ))}
              </select>

              <label htmlFor="archive-category">Category</label>
              <select
                id="archive-category"
                value={archiveCategory}
                onChange={(e) => setArchiveCategory(e.target.value as 'photos' | 'flyers' | 'press' | 'zines' | 'general')}
                className="admin-select"
              >
                {['photos', 'flyers', 'press', 'zines', 'general'].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label htmlFor="archive-title">Title</label>
              <input
                id="archive-title"
                type="text"
                value={archiveTitle}
                onChange={(e) => setArchiveTitle(e.target.value)}
                required
              />

              <label htmlFor="archive-description">Description</label>
              <textarea
                id="archive-description"
                rows={3}
                value={archiveDescription}
                onChange={(e) => setArchiveDescription(e.target.value)}
              />

              <label htmlFor="archive-file">File (image or PDF, max 10 MB)</label>
              <input
                id="archive-file"
                type="file"
                accept="image/*,application/pdf"
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) => setArchiveFile(e.target.files?.[0] ?? null)}
              />

              <button type="submit" className="btn" disabled={!archiveFile}>Add archive item</button>
              {archiveStatus && <p className="helper">{archiveStatus}</p>}
              {archiveUrl && (
                <p>
                  Uploaded:{' '}
                  <a href={archiveUrl} target="_blank" rel="noopener noreferrer">
                    {archiveUrl}
                  </a>
                </p>
              )}
            </form>

            <h3>Edit or delete archive items</h3>
            <div className="admin-list">
              {galleryAssets.map((asset) => (
                <article key={asset.id} className="admin-list-item">
                  <div className="admin-list-meta">
                    <strong>{asset.title}</strong>
                    <span className="muted"> · {asset.collection}/{asset.category}</span>
                  </div>
                  <p className="admin-list-body">{asset.description}</p>
                  {asset.imageUrl ? (
                    <a href={asset.imageUrl} target="_blank" rel="noopener noreferrer">{asset.imageUrl}</a>
                  ) : null}
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => void deleteGalleryAsset(asset.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {galleryAssets.length === 0 && <p>No gallery assets yet.</p>}
            </div>
          </>
        )}

      </section>
    </main>
  );
}
