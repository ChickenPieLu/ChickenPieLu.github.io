const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-current-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

const revealTargets = [
  ".archive-hero-statement",
  ".archive-toolbar",
  ".detail-header",
  ".series-intro",
  ".about-grid > *",
  ".note-media",
  ".prose",
  ".media-block",
  ".work-modules",
  ".series-frame",
  ".series-text",
  ".series-credits",
  ".back-link"
].join(", ");

document.querySelectorAll(revealTargets).forEach((item) => {
  item.classList.add("reveal");
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealObserver = "IntersectionObserver" in window && !reducedMotion
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

const observeRevealItems = (scope = document) => {
  scope.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    if (revealObserver) {
      revealObserver.observe(item);
    } else {
      item.classList.add("is-visible");
    }
  });
};

observeRevealItems();

const archiveGrid = document.querySelector("[data-archive-grid]");
const archiveCount = document.querySelector("[data-archive-count]");
const archiveFilters = document.querySelectorAll("[data-filter]");
const archiveItems = window.afterHoursArchive;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const renderArchive = (filter = "all") => {
  if (!archiveGrid || !Array.isArray(archiveItems)) return;

  const visibleItems = filter === "all"
    ? archiveItems
    : archiveItems.filter((item) => item.category.toLowerCase() === filter);

  if (revealObserver) {
    archiveGrid.querySelectorAll(".reveal").forEach((item) => revealObserver.unobserve(item));
  }

  archiveGrid.innerHTML = visibleItems.map((item, index) => {
    const image = item.thumbnail
      ? `<div class="archive-card-image">
          <img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.imageAlt || "")}" loading="lazy"${item.imagePosition ? ` style="object-position: ${escapeHtml(item.imagePosition)}"` : ""}>
        </div>`
      : "";
    const excerpt = item.excerpt ? `<p class="archive-card-excerpt">${escapeHtml(item.excerpt)}</p>` : "";

    return `<article class="archive-card archive-card--${escapeHtml(item.tone || "text")} reveal" data-category="${escapeHtml(item.category.toLowerCase())}" style="--reveal-delay: ${Math.min(index, 5) * 55}ms">
      <a class="archive-card-link" href="${escapeHtml(item.href)}" aria-label="Entry ${escapeHtml(item.entryNumber)}: ${escapeHtml(item.title)}">
        ${image}
        <div class="archive-card-body">
          <div class="archive-card-meta">
            <span>#${escapeHtml(item.entryNumber)}</span>
            <time>${escapeHtml(item.date)}</time>
            <span class="archive-card-category">${escapeHtml(item.category)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          ${excerpt}
        </div>
      </a>
    </article>`;
  }).join("");

  observeRevealItems(archiveGrid);

  if (archiveCount) {
    archiveCount.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? "entry" : "entries"}`;
  }
};

if (archiveGrid && Array.isArray(archiveItems)) {
  renderArchive();

  archiveFilters.forEach((button) => {
    button.addEventListener("click", () => {
      archiveFilters.forEach((filterButton) => {
        const isCurrent = filterButton === button;
        filterButton.classList.toggle("is-active", isCurrent);
        filterButton.setAttribute("aria-pressed", String(isCurrent));
      });

      renderArchive(button.dataset.filter);
    });
  });
}
