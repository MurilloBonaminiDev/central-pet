import { useMemo, useState } from 'react';
import { usePublicProducts } from '@modules/products';
import { ProductCard } from '../components/ProductCard';
import { SiteLayout } from '../components/SiteLayout';
import { SitePageHero } from '../components/SitePageHero';
import '../styles/landing.css';

export function ProductsPage() {
  const { products, categories, loading, error, refetch } = usePublicProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('Todas');

  const filterOptions = useMemo(() => ['Todas', ...categories], [categories]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === 'Todas' || product.category === category;
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  return (
    <SiteLayout>
      <SitePageHero
        eyebrow="Pet shop"
        title="Produtos"
        description="Rações, medicamentos, brinquedos, acessórios e higiene — selecionados pela nossa equipe para o dia a dia do seu pet."
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12" aria-label="Catálogo de produtos">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[26rem] animate-pulse rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
              />
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-12 text-center">
            <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
              Não foi possível carregar os produtos
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-600)] px-5 text-sm font-semibold text-[var(--color-primary-fg)] hover:bg-[var(--color-brand-700)]"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-md">
                <label htmlFor="product-search" className="text-sm font-medium text-[var(--color-fg)]">
                  Pesquisa
                </label>
                <input
                  id="product-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por nome, descrição ou categoria..."
                  className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 text-sm text-[var(--color-fg)] outline-none transition-shadow placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-border-focus)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--color-fg)]">Filtros</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
                  {filterOptions.map((item) => {
                    const active = category === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`h-9 rounded-full px-3.5 text-sm font-semibold transition-colors ${
                          active
                            ? 'bg-[var(--color-brand-600)] text-[var(--color-primary-fg)]'
                            : 'border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-brand-400)] hover:text-[var(--color-fg)]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
              {filtered.length} produto{filtered.length === 1 ? '' : 's'} encontrado
              {filtered.length === 1 ? '' : 's'}
            </p>

            {filtered.length > 0 ? (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-16 text-center">
                <p className="font-display text-xl font-semibold text-[var(--color-fg)]">
                  Nenhum produto encontrado
                </p>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  Ajuste a pesquisa ou o filtro de categoria.
                </p>
              </div>
            )}
          </>
        ) : null}
      </section>
    </SiteLayout>
  );
}
