'use client';

import { useState, type ReactNode } from 'react';
import { HomeReveal } from './home-motion.tsx';

type Product = { id: string; name: string | null; description: string; status: 'in-development' };

const filters = [['all', 'Semua'], ['in-development', 'Dalam pengembangan']] as const;

export function ProductGallery({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? products : products.filter(product => product.status === filter);
  return <>
    <div className="page-filter-row" role="group" aria-label="Filter produk">{filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} className={filter === value ? 'is-active' : undefined} onClick={() => setFilter(value)}>{label}</button>)}</div>
    {filtered.length === 0
      ? <div className="page-empty"><p>Belum ada produk yang dapat ditampilkan.</p></div>
      : <div className="page-product-grid">{filtered.map((product, i) => <HomeReveal key={product.id} delay={i % 2 * 0.1} y={48}><article className="page-product-card">
          <span className="page-product-status" role="status">Sedang dikembangkan</span>
          <h3>{product.name ?? 'Nama produk menyusul'}</h3>
          <p>{product.description}</p>
        </article></HomeReveal>)}</div>}
  </>;
}
