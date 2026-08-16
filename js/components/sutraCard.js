// js/components/sutraCard.js
// DOM-safe implementation of a sutra card component

export function renderSutraCard(sutra = {}) {
  const article = document.createElement('article');
  article.className = 'sutra-card';
  article.dataset.sutraId = sutra.id || '';
  if (sutra.number) article.dataset.sutraNumber = sutra.number;

  // meta (number)
  const meta = document.createElement('div');
  meta.className = 'sutra-card__meta';
  const num = document.createElement('span');
  num.className = 'sutra-card__number';
  num.textContent = `Brahma Sūtra ${sutra.number || ''}`;
  meta.appendChild(num);

  // title
  const h2 = document.createElement('h2');
  h2.className = 'sutra-card__title';
  h2.textContent = sutra.title || '';

  // sanskrit text
  const sanskrit = document.createElement('p');
  sanskrit.className = 'sutra-card__sanskrit';
  sanskrit.lang = 'sa';
  sanskrit.textContent = sutra.text?.sanskrit || '';

  // iast
  const iast = document.createElement('p');
  iast.className = 'sutra-card__iast';
  iast.textContent = sutra.text?.iast || '';

  // optional summary
  let summaryEl = null;
  if (sutra.summary) {
    summaryEl = document.createElement('p');
    summaryEl.className = 'sutra-card__summary';
    summaryEl.textContent = sutra.summary;
  }

  // link
  const a = document.createElement('a');
  a.className = 'sutra-card__link';
  a.href = `sutra.html?id=${encodeURIComponent(sutra.id || '')}`;
  a.setAttribute('aria-label', `Read Brahma Sūtra ${sutra.number || ''}`);
  a.textContent = 'Read Sūtra →';

  // assemble
  article.appendChild(meta);
  article.appendChild(h2);
  article.appendChild(sanskrit);
  article.appendChild(iast);
  if (summaryEl) article.appendChild(summaryEl);
  article.appendChild(a);

  return article;
}
