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

  archiveGrid.innerHTML = visibleItems.map((item) => {
    const details = [item.contentType, item.location, item.series].filter(Boolean);
    const image = item.thumbnail
      ? `<div class="archive-card-image">
          <img src="${escapeHtml(item.thumbnail)}" alt="${escapeHtml(item.imageAlt || "")}" loading="lazy"${item.imagePosition ? ` style="object-position: ${escapeHtml(item.imagePosition)}"` : ""}>
        </div>`
      : "";
    const excerpt = item.excerpt ? `<p class="archive-card-excerpt">${escapeHtml(item.excerpt)}</p>` : "";
    const extra = details.length
      ? `<p class="archive-card-detail">${details.map(escapeHtml).join(" · ")}</p>`
      : "";

    return `<article class="archive-card archive-card--${escapeHtml(item.tone || "text")}" data-category="${escapeHtml(item.category.toLowerCase())}">
      <a class="archive-card-link" href="${escapeHtml(item.href)}" aria-label="Entry ${escapeHtml(item.entryNumber)}: ${escapeHtml(item.title)}">
        ${image}
        <div class="archive-card-body">
          <div class="archive-card-meta">
            <span>Entry #${escapeHtml(item.entryNumber)}</span>
            <time>${escapeHtml(item.date)}</time>
            <span class="archive-card-category">${escapeHtml(item.category)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          ${excerpt}
          ${extra}
          <span class="archive-card-arrow" aria-hidden="true">Open entry ↗</span>
        </div>
      </a>
    </article>`;
  }).join("");

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
