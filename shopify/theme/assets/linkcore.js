// Linkcore: compatibility checker UI + spec-table difference highlighting.
import { evaluate, rank } from "./linkcore-compat.js";

const LABEL = { ok: "Works with your setup", limited: "Works, with limits", no: "Won't work" };

for (const section of document.querySelectorAll(".lc-checker")) {
  const profiles = JSON.parse(section.querySelector("[data-profiles]").textContent);
  const form = section.querySelector("[data-checker]");
  const list = section.querySelector(".lc-results__list");
  const items = [...section.querySelectorAll("[data-result]")].map((el) => ({ el, price: Number(el.dataset.price), compat: JSON.parse(el.dataset.compat) }));

  const run = () => {
    const data = new FormData(form);
    const profile = profiles[data.get("computer")];
    const needs = { monitors: Number(data.get("monitors")), resolution: data.get("resolution"), ethernet: data.has("ethernet"), charge: data.has("charge") };
    const ranked = rank(items.map((it) => ({ ...it, result: evaluate(profile, needs, it.compat) })));
    let works = 0;
    ranked.forEach((it, i) => {
      const { status, notes, info } = it.result;
      if (status === "ok") works += 1;
      it.el.dataset.state = status;
      it.el.classList.toggle("is-best", i === 0 && status !== "no");
      it.el.querySelector("[data-status]").textContent = i === 0 && status !== "no" ? `Best match · ${LABEL[status]}` : LABEL[status];
      it.el.querySelector("[data-notes]").innerHTML = [...notes, ...info].map((n) => `<li>${n}</li>`).join("") || "<li>Everything you asked for, no compromises.</li>";
      list.appendChild(it.el);
    });
    section.querySelector("[data-summary]").textContent =
      `${works} of ${items.length} products fully work with a ${profile.label.replace(/\s*\(.*\)$/, "")}, ${needs.monitors} monitor${needs.monitors === 1 ? "" : "s"} at ${needs.resolution}.`;
  };
  form.addEventListener("change", run);
  run();
}

for (const toggle of document.querySelectorAll("[data-diff-toggle]")) {
  const table = toggle.closest(".lc-compare").querySelector("[data-compare]");
  toggle.addEventListener("change", () => {
    for (const row of table.tBodies[0].rows) {
      const values = [...row.cells].map((c) => c.dataset.value);
      row.classList.toggle("is-same", toggle.checked && new Set(values).size === 1);
      row.classList.toggle("is-diff", toggle.checked && new Set(values).size > 1);
    }
  });
}
