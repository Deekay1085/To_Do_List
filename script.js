// Created by Deekay1085

const GROUPS = ["Core skills", "Tools", "Next steps", "Projects to build", "Good habits"];

const DEFAULTS = {
  "Core skills": [
    "Write semantic HTML (header, nav, main, section, footer, labels, alt text)",
    "Learn CSS layout: Flexbox, Grid, positioning, and the box model",
    "Build responsive pages with media queries and relative units (rem, %, vw)",
    "Learn JavaScript fundamentals: variables, functions, arrays, objects, loops, and ES6+ features",
    "Practice DOM manipulation and event handling",
    "Use fetch with async/await to call APIs and handle errors"
  ],
  "Tools": [
    "Learn Git basics: commit, branch, merge, and pull requests",
    "Create a GitHub account and push your projects",
    "Get comfortable with browser DevTools (Elements, Console, Network)",
    "Set up VS Code with Prettier and ESLint",
    "Learn npm and how to install packages"
  ],
  "Next steps": [
    "Learn a framework, such as React (components, props, state)",
    "Try a CSS framework like Tailwind or Bootstrap",
    "Learn basic accessibility: keyboard navigation, color contrast, ARIA basics",
    "Learn basic performance habits: optimize images and avoid unnecessary requests",
    "Test across browsers and screen sizes"
  ],
  "Projects to build": [
    "Weather app",
    "To-do list app",
    "Portfolio website",
    "Landing page cloned from a real design",
    "One project that uses a public API and one that uses local storage"
  ],
  "Good habits": [
    "Write clean, commented, consistently formatted code",
    "Read documentation (MDN is the best place to start)",
    "Ask for code reviews and learn from the feedback",
    "Debug with the console and breakpoints before asking for help",
    "Code a little every day, and keep a short log of what you learned"
  ]
};

const KEY = "frontend-todo-v1";
let tasks = load();

const listsEl = document.getElementById("lists");
const groupSelect = document.getElementById("group");
const form = document.getElementById("add-form");
const input = document.getElementById("new-task");

function defaultTasks() {
  let id = 0;
  return GROUPS.flatMap(g => DEFAULTS[g].map(text => ({ id: ++id, group: g, text, done: false })));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* storage unavailable or corrupt: fall back to defaults */ }
  return defaultTasks();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
}

function render() {
  listsEl.innerHTML = "";
  GROUPS.forEach(group => {
    const items = tasks.filter(t => t.group === group);
    if (items.length === 0) return;

    const section = document.createElement("section");
    section.className = "group";
    const doneCount = items.filter(t => t.done).length;
    section.innerHTML = `<h2>${group}<span>${doneCount}/${items.length}</span></h2>`;

    const ul = document.createElement("ul");
    items.forEach(t => {
      const li = document.createElement("li");
      li.className = t.done ? "done" : "";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "task-" + t.id;
      cb.checked = t.done;
      cb.addEventListener("change", () => { t.done = cb.checked; save(); render(); });

      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = t.text; // textContent keeps user input safe

      const del = document.createElement("button");
      del.className = "del";
      del.type = "button";
      del.textContent = "×";
      del.setAttribute("aria-label", "Delete task: " + t.text);
      del.addEventListener("click", () => { tasks = tasks.filter(x => x.id !== t.id); save(); render(); });

      li.append(cb, label, del);
      ul.appendChild(li);
    });
    section.appendChild(ul);
    listsEl.appendChild(section);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress-text").textContent = `${done} of ${total} done (${pct}%)`;
  document.getElementById("bar-fill").style.width = pct + "%";
  document.querySelector(".bar").setAttribute("aria-valuenow", pct);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  tasks.push({ id, group: groupSelect.value, text, done: false });
  input.value = "";
  save();
  render();
});

document.getElementById("reset").addEventListener("click", () => {
  if (confirm("Reset to the default list? Your changes will be lost.")) {
    tasks = defaultTasks();
    save();
    render();
  }
});

GROUPS.forEach(g => {
  const opt = document.createElement("option");
  opt.value = opt.textContent = g;
  groupSelect.appendChild(opt);
});
render();