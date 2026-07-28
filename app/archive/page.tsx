'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

type GalleryAsset = {
  id: string;
  title: string;
  description?: string;
  category?: 'photos' | 'flyers' | 'press' | 'zines' | 'general';
  imageUrl: string;
};

const ARCHIVE_CATEGORIES: Array<GalleryAsset['category']> = ['photos', 'flyers', 'press', 'zines', 'general'];

export default function ArchivePage() {
  const [assets, setAssets] = useState<GalleryAsset[]>([]);

  const loadAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery?collection=archive&limit=120', { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json() as { assets?: GalleryAsset[] };
      if (Array.isArray(json.assets)) {
        setAssets(json.assets.filter((asset) => typeof asset.imageUrl === 'string' && asset.imageUrl.length > 0));
      }
    } catch {
      // Keep static archive copy if the API is unavailable.
    }
  }, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const groupedAssets = useMemo(() => {
    const map = new Map<string, GalleryAsset[]>();
    for (const category of ARCHIVE_CATEGORIES) {
      map.set(category ?? 'general', []);
    }
    for (const asset of assets) {
      const key = asset.category ?? 'general';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(asset);
    }
    return map;
  }, [assets]);

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
          <p className="eyebrow">Archive</p>
          <h1>History in motion.</h1>
          <p>
            Browse the preserved stories, posters, press, and photographs that trace
            the growth of SlutWalk Denver over time.
          </p>
        </div>
      </header>

      <section className="featured">
        <h2>Featured collections</h2>
        <div className="archive">
          <article>
            <h3>Photo archive</h3>
            <p>Images from past actions, marches, and community gatherings.</p>
          </article>
          <article>
            <h3>Flyer archive</h3>
            <p>Historic posters, event notices, and call-to-action graphics.</p>
          </article>
          <article>
            <h3>Press archive</h3>
            <p>Media coverage, interviews, and public statements.</p>
          </article>
        </div>
      </section>

      {ARCHIVE_CATEGORIES.map((category) => {
        const categoryAssets = groupedAssets.get(category ?? 'general') ?? [];
        return (
          <section className="featured" key={category}>
            <h2>{(category ?? 'general').charAt(0).toUpperCase() + (category ?? 'general').slice(1)}</h2>
            {categoryAssets.length === 0 ? (
              <p className="helper">No uploaded items in this collection yet.</p>
            ) : (
              <div className="shop-grid" role="list">
                {categoryAssets.map((asset) => (
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
        );
      })}
    </main>
  );
}
