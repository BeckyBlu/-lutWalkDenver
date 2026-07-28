'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

const DONATE_URL = 'https://rougesupportnetwork.org';

// ── Types ─────────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  imageUrl: string;
  category: string;
  stock: number;
};

// ── Seed products — shown when Firebase is not configured ─────────────────────

const SEED_PRODUCTS: Product[] = [
  { id: 'seed-1', name: '$lutWalk Tee', description: 'Bold statement tee for organizing and visibility.', price: 3000, imageUrl: '', category: 'apparel', stock: 10 },
  { id: 'seed-2', name: 'Solidarity Sticker Pack', description: 'Five stickers for outreach and education.', price: 700, imageUrl: '', category: 'stickers', stock: 50 },
  { id: 'seed-3', name: 'Zine Issue 01', description: 'Reclaiming the street through stories, art, and collective memory.', price: 500, imageUrl: '', category: 'zines', stock: 25 },
  { id: 'seed-4', name: 'Survivor Solidarity Poster', description: 'A3 risograph-style poster for your space.', price: 1200, imageUrl: '', category: 'posters', stock: 15 },
];

const CATEGORIES = ['all', 'apparel', 'stickers', 'zines', 'posters', 'books', 'other'];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [category, setCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ── Load products ──────────────────────────────────────────────────────────

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json() as { products?: Product[] };
        if (Array.isArray(json.products) && json.products.length > 0) {
          setProducts(json.products);
        }
      }
    } catch {
      // Use seed products
    }
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  // ── Filtered products ──────────────────────────────────────────────────────

  const visible = products.filter((p) => category === 'all' || p.category === category);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="shell">
      <header className="hero">
        <nav>
          <div className="logo">$lutWalk Denver</div>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/bulletin">Bulletin</Link></li>
            <li><Link href="/calendar">Calendar</Link></li>
            <li><Link href="/admin-login">Admin</Link></li>
          </ul>
        </nav>
        <div className="hero-overlay">
          <p className="eyebrow">Community store</p>
          <h1>Support the work through education and merch.</h1>
          <p>
            Zine PDFs are available when you donate to{' '}
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="link--inline">
              Rouge Support Network
            </a>
            , our non-profit partner. Every contribution supports survivor care.
          </p>
        </div>
      </header>

      {/* Category filter */}
      <nav aria-label="Product categories" className="category-nav">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-btn ${category === cat ? 'category-btn--active' : ''}`}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Product grid */}
      <section className="featured">
        <div className="shop-grid" role="list">
          {visible.map((product) => (
            <article key={product.id} className="product-card" role="listitem">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="product-img"
                  unoptimized
                />
              ) : (
                <div className="product-img-placeholder" aria-hidden="true">
                  {product.category === 'apparel' ? '👕' :
                   product.category === 'stickers' ? '🏷️' :
                   product.category === 'zines' ? '📄' :
                   product.category === 'posters' ? '🖼️' : '📦'}
                </div>
              )}
              <div className="product-info">
                <p className="eyebrow">{product.category}</p>
                <h3>
                  <button
                    type="button"
                    className="product-title-btn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </button>
                </h3>
                {product.category === 'zines' ? (
                  <a
                    href={DONATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                  >
                    Donate to download PDF →
                  </a>
                ) : (
                  <p className="helper">Contact an organizer to order.</p>
                )}
              </div>
            </article>
          ))}
          {visible.length === 0 && <p>No products in this category yet.</p>}
        </div>
      </section>

      {/* Product detail modal */}
      {selectedProduct && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selectedProduct.name}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}
        >
          <div className="modal-card">
            <button type="button" className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details">✕</button>
            {selectedProduct.imageUrl && (
              <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} width={400} height={400} style={{ maxWidth: '100%', height: 'auto' }} unoptimized />
            )}
            <p className="eyebrow">{selectedProduct.category}</p>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            {selectedProduct.category === 'zines' ? (
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ display: 'inline-block', marginTop: '1rem' }}
              >
                Donate to Rouge Support Network to download PDF →
              </a>
            ) : (
              <p className="helper" style={{ marginTop: '1rem' }}>
                Contact an organizer to order this item.
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}


