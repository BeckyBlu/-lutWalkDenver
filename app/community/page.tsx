'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type GalleryAsset = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl: string;
  createdAt?: string;
};

export default function CommunityPage() {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);

  const loadAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery?collection=community&limit=60', { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json() as { assets?: GalleryAsset[] };
      if (Array.isArray(json.assets)) {
        setAssets(json.assets.filter((asset) => typeof asset.imageUrl === 'string' && asset.imageUrl.length > 0));
      }
    } catch {
      // Keep static fallback copy when API is unavailable.
    }
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Store</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community</p>
          <h1>Member space and collective care.</h1>
          <p>
            Share updates, join the bulletin board, and stay in conversation with the
            wider organizing circle.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Community resources</h2>
        <div className="community-board">
          <article>
            <h3>Announcements</h3>
            <p>Volunteer sign-up, wellness reminders, and upcoming actions.</p>
          </article>
          <article>
            <h3>Bulletin board</h3>
            <p>Community updates, mutual aid offers, and event flyers.</p>
          </article>
          <article>
            <h3>Resources</h3>
            <p>Links to zines, organizers, and local support networks.</p>
          </article>
        </div>
      </section>

      <section className="featured">
        <h2>Shared gallery</h2>
        {assets.length === 0 ? (
          <p className="helper">No shared assets yet. Organizers can upload them from the admin archive tab.</p>
        ) : (
          <div className="shop-grid" role="list">
            {assets.map((asset) => (
              <article key={asset.id} className="product-card" role="listitem">
                <Image
                  src={asset.imageUrl}
                  alt={asset.title}
                  width={600}
                  height={400}
                  className="product-img"
                  unoptimized
                />
                <div className="product-info">
                  <p className="eyebrow">{asset.category ?? 'general'}</p>
                  <h3>{asset.title}</h3>
                  {asset.description ? <p>{asset.description}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
