const table = document.getElementById("periodicTable");
const groupLabels = document.getElementById("groupLabels");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const propertySelect = document.getElementById("propertySelect");
const elementPanel = document.getElementById("elementPanel");
const elementDetail = document.getElementById("elementDetail");
const closePanel = document.getElementById("closePanel");
const panelBackdrop = document.getElementById("panelBackdrop");
const themeToggle = document.getElementById("themeToggle");
const familyFilters = document.getElementById("familyFilters");
const propertyDescription = document.getElementById("propertyDescription");

let selectedFamily = "all";
let selectedProperty = "default";
let searchTerm = "";

const familyNames = {
  alkali: "Metal alcalino",
  alkaline: "Metal alcalinotérreo",
  transition: "Metal de transición",
  "post-transition": "Metal post-transición",
  metalloid: "Metaloide",
  nonmetal: "No metal",
  halogen: "Halógeno",
  noble: "Gas noble",
  lanthanide: "Lantánido",
  actinide: "Actínido"
};

const propertyLabels = {
  atomicNumber: "Número atómico",
  mass: "Masa atómica",
  electronegativity: "Electronegatividad",
  covalentRadius: "Radio covalente",
  ionizationEnergy: "Energía de ionización",
  effectiveNuclearCharge: "Carga nuclear efectiva",
  atomicRadius: "Radio atómico",
  ionicRadius: "Radio iónico",
  electronAffinity: "Afinidad electrónica",
  density: "Densidad"
};


const propertyDescriptions = {
  default: {
    title: "Clasificación química",
    text: "Explora los elementos según sus propiedades químicas y su familia: metales alcalinos, metales de transición, metaloides, halógenos y otros grupos Comprenden los grupos 1, 2 y del 13 al 18 (antiguos grupos 'A')."
  },
  atomicNumber: {
    title: "Número atómico (Z)",
    text: "Indica la cantidad de protones que tiene el núcleo de un átomo. Identifica al elemento químico y determina su posición en la tabla periódica."
  },
  mass: {
    title: "Masa atómica (u)",
    text: "Es la masa atómica relativa promedio del elemento, calculada considerando las masas de sus isótopos y sus abundancias naturales. Se expresa habitualmente en unidades de masa atómica (u)."
  },
  electronegativity: {
    title: "Electronegatividad",
    text: "Mide la tendencia de un átomo a atraer hacia sí los electrones compartidos en un enlace químico. Los valores mostrados suelen utilizar la escala de Pauling."
  },
  covalentRadius: {
    title: "Radio covalente (pm)",
    text: "Es una estimación del tamaño de un átomo cuando forma enlaces covalentes. Se define habitualmente a partir de la mitad de la distancia entre los núcleos de dos átomos iguales enlazados."
  },
  ionizationEnergy: {
    title: "Energía de ionización (kJ/mol)",
    text: "Es la energía necesaria para retirar un electrón de un átomo aislado en estado gaseoso. La primera energía de ionización corresponde a la extracción del primer electrón."
  },
  effectiveNuclearCharge: {
    title: "Carga nuclear efectiva (Zeff)",
    text: "Es la carga positiva neta que experimenta un electrón después de considerar el apantallamiento de los demás electrones. El valor mostrado es una estimación para un electrón externo mediante las reglas de Slater; puede variar según el orbital."
  },
  atomicRadius: {
    title: "Radio atómico (pm)",
    text: "Es una medida del tamaño de un átomo. No tiene un límite físico único y su valor depende del método utilizado (radio covalente, metálico, empírico o de van der Waals). ATLAS muestra el radio atómico empírico de la fuente de datos."
  },
  ionicRadius: {
    title: "Radio iónico (pm)",
    text: "Es el tamaño efectivo de un ion en un sólido iónico. Depende de la carga, el número de coordinación y el entorno químico. Se indica el ion de referencia junto con su radio."
  },
  electronAffinity: {
    title: "Afinidad electrónica (kJ/mol)",
    text: "Es el cambio de energía asociado a la incorporación de un electrón a un átomo gaseoso neutro. Los valores positivos de esta tabla representan energía liberada; algunos elementos no tienen un valor experimental bien establecido."
  },
  density: {
    title: "Densidad (g/cm³)",
    text: "Es la masa por unidad de volumen. Los valores corresponden aproximadamente a temperatura ambiente; para gases se indican valores cercanos a condiciones estándar."
  }
};

function updatePropertyDescription() {
  const description =
    propertyDescriptions[selectedProperty] ??
    propertyDescriptions.default;

  propertyDescription.replaceChildren();

  const title = document.createElement("strong");
  title.textContent = description.title;

  const text = document.createElement("p");
  text.textContent = description.text;

  propertyDescription.append(title, text);
}

function createGroupLabels() {
  groupLabels.innerHTML = Array.from({ length: 18 }, (_, i) =>
    `<span>${i + 1}</span>`
  ).join("");
}

function gridPosition(element) {
  let row = element.period;
  let col = element.group;

  // f-block is displayed separately in rows 8 and 9.
  if (element.family === "lanthanide") {
    row = 8;
    col = element.number - 57 + 3; // La -> 3 ... Lu -> 17
  }
  if (element.family === "actinide") {
    row = 9;
    col = element.number - 89 + 3; // Ac -> 3 ... Lr -> 17
  }

  return { row, col };
}

// Estimación de Zeff para un electrón externo mediante reglas de Slater.
function effectiveNuclearCharge(element) {
  const z = element.number;
  const orbitals = [
    ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2],
    ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10], ["5p", 6], ["6s", 2],
    ["4f", 14], ["5d", 10], ["6p", 6], ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]
  ];
  const occupied = {};
  let remaining = z;
  for (const [orbital, capacity] of orbitals) {
    const count = Math.min(remaining, capacity);
    occupied[orbital] = count;
    remaining -= count;
    if (remaining <= 0) break;
  }
  const entries = Object.entries(occupied).filter(([, count]) => count > 0);
  const maxN = Math.max(...entries.map(([orbital]) => Number(orbital[0])));
  const outer = entries.filter(([orbital]) => Number(orbital[0]) === maxN);
  const outerSP = outer.filter(([orbital]) => /s|p/.test(orbital));
  const reference = outerSP.length ? outerSP[outerSP.length - 1] : outer[outer.length - 1];
  if (!reference) return z;

  const refOrbital = reference[0];
  const refSubshell = refOrbital.slice(1);
  const refN = Number(refOrbital[0]);
  let shielding = 0;

  if (refSubshell === "s" || refSubshell === "p") {
    const same = entries
      .filter(([orbital]) => Number(orbital[0]) === refN && /s|p/.test(orbital))
      .reduce((sum, [orbital, count]) => sum + count, 0) - 1;
    shielding += Math.max(0, same) * (refN === 1 ? 0.30 : 0.35);
    for (const [orbital, count] of entries) {
      const orbitalN = Number(orbital[0]);
      if (orbitalN === refN - 1) {
        shielding += count * (/s|p/.test(orbital) ? 0.85 : 1.00);
      } else if (orbitalN < refN - 1) {
        shielding += count;
      }
    }
  } else {
    shielding += Math.max(0, (occupied[refOrbital] || 0) - 1) * 0.35;
    for (const [orbital, count] of entries) {
      if (orbital !== refOrbital) shielding += count;
    }
  }
  return Math.max(0, z - shielding);
}

function valueFor(element) {
  switch (selectedProperty) {
    case "atomicNumber":
      return element.number;
    case "mass":
      return element.mass ?? "—";
    case "electronegativity":
      return element.electronegativity ?? "—";
    case "covalentRadius":
      return element.covalentRadius ? `${element.covalentRadius} pm` : "—";
    case "ionizationEnergy":
      return element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : "—";
    case "effectiveNuclearCharge":
      return `${effectiveNuclearCharge(element).toFixed(2)}`;
    case "atomicRadius":
      return element.atomicRadius != null ? `${element.atomicRadius} pm` : "—";
    case "ionicRadius":
      return element.ionicRadius ? `${element.ionicRadius[1]} pm` : "—";
    case "electronAffinity":
      return element.electronAffinity != null ? `${element.electronAffinity} kJ/mol` : "—";
    case "density":
      return element.density != null ? `${element.density} g/cm³` : "—";
    default:
      return "";
  }
}

function createElementCard(element, index) {
  const { row, col } = gridPosition(element);
  const card = document.createElement("button");
  card.type = "button";
  card.className = `element family-${element.family}`;
  card.style.gridRow = row;
  card.style.gridColumn = col;
  card.style.animationDelay = `${Math.min(index * 8, 700)}ms`;
  card.dataset.number = element.number;
  card.dataset.name = element.name.toLowerCase();
  card.dataset.symbol = element.symbol.toLowerCase();
  card.dataset.family = element.family;
  card.setAttribute("aria-label", `${element.name}, número atómico ${element.number}`);

  card.innerHTML = `
    <span class="atomic-number">${element.number}</span>
    <span class="symbol">${element.symbol}</span>
    <span class="element-name">${element.name}</span>
    ${selectedProperty !== "default" ? `<span class="element-value">${valueFor(element)}</span>` : ""}
  `;

  card.addEventListener("click", () => openElement(element));
  return card;
}

function createPlaceholders() {
  const placeholders = [
    { row: 8, col: 1, text: "57–71" },
    { row: 9, col: 1, text: "89–103" },
    { row: 8, col: 2, text: "Lantánidos" },
    { row: 9, col: 2, text: "Actínidos" }
  ];

  placeholders.forEach((p) => {
    const item = document.createElement("div");
    item.className = "placeholder";
    item.style.gridRow = p.row;
    item.style.gridColumn = p.col;
    item.textContent = p.text;
    table.appendChild(item);
  });
}

function matchesSearch(element) {
  if (!searchTerm) return true;
  return (
    element.name.toLowerCase().includes(searchTerm) ||
    element.symbol.toLowerCase().includes(searchTerm) ||
    String(element.number) === searchTerm
  );
}

function render() {
  table.innerHTML = "";
  createPlaceholders();

  let visible = 0;

  ELEMENTS.forEach((element, index) => {
    const card = createElementCard(element, index);

    const familyMatch =
      selectedFamily === "all" ||
      element.family === selectedFamily;

    const searchMatch = matchesSearch(element);

    if (!familyMatch || !searchMatch) {
      card.classList.add("filtered-out");
    } else {
      visible++;
    }

    if (familyMatch && searchMatch && searchTerm) {
      card.classList.add("match");
    }

    table.appendChild(card);
  });

  resultCount.textContent = `${visible} ${visible === 1 ? "elemento" : "elementos"}`;
}

function openElement(element) {
  const family = familyNames[element.family] || "Elemento";
  const config = electronConfiguration(element.number);

  elementDetail.innerHTML = `
    <div class="detail-header">
      <div class="detail-symbol-card family-${element.family}">
        <span class="detail-number">${element.number}</span>
        <span class="detail-symbol">${element.symbol}</span>
        <span class="detail-family">${family}</span>
      </div>

      <h2 class="detail-title">${element.name}</h2>
      <p class="detail-subtitle">Elemento químico · período ${element.period} · grupo ${element.group}</p>
    </div>

    <section class="detail-section">
      <h3>Información general</h3>
      <div class="detail-grid">
        <div class="detail-item"><span>Número atómico</span><strong>${element.number}</strong></div>
        <div class="detail-item"><span>Masa atómica</span><strong>${element.mass ?? "—"} u</strong></div>
        <div class="detail-item"><span>Grupo</span><strong>${element.group}</strong></div>
        <div class="detail-item"><span>Período</span><strong>${element.period}</strong></div>
        <div class="detail-item"><span>Bloque</span><strong>${element.block}</strong></div>
        <div class="detail-item"><span>Familia</span><strong>${family}</strong></div>
      </div>
    </section>

    <section class="detail-section">
      <h3>Propiedades atómicas</h3>
      <div class="detail-grid">
        <div class="detail-item"><span>Carga nuclear efectiva (Zeff)*</span><strong>${effectiveNuclearCharge(element).toFixed(2)}</strong></div>
        <div class="detail-item"><span>Radio atómico</span><strong>${element.atomicRadius != null ? element.atomicRadius + " pm" : "No disponible"}</strong></div>
        <div class="detail-item"><span>Radio covalente</span><strong>${element.covalentRadius ? element.covalentRadius + " pm" : "—"}</strong></div>
        <div class="detail-item"><span>Radio iónico</span><strong>${element.ionicRadius ? `${element.symbol}${element.ionicRadius[0] > 0 ? element.ionicRadius[0] + "+" : element.ionicRadius[0]} · ${element.ionicRadius[1]} pm` : "No disponible"}</strong></div>
        <div class="detail-item"><span>Afinidad electrónica</span><strong>${element.electronAffinity != null ? element.electronAffinity + " kJ/mol" : "No disponible"}</strong></div>
        <div class="detail-item"><span>Densidad</span><strong>${element.density != null ? element.density + " g/cm³" : "No disponible"}</strong></div>
        <div class="detail-item"><span>Estado(s) de oxidación</span><strong>${element.oxidationStates || "—"}</strong></div>
        <div class="detail-item"><span>Energía de ionización</span><strong>${element.ionizationEnergy ? element.ionizationEnergy + " kJ/mol" : "—"}</strong></div>
      </div>
      <p class="detail-subtitle">*Zeff es una estimación orientativa calculada con reglas de Slater. Los radios iónicos dependen del estado de oxidación y la coordinación; se muestra un ion representativo cuando hay un dato disponible.</p>
    </section>

    <section class="detail-section">
      <h3>Abundancia en la naturaleza</h3>
      <p class="detail-subtitle">${element.abundance || "Dato no disponible."} ${element.number <= 94 ? "Abundancia aproximada en la corteza terrestre (ppm en masa), cuando se dispone de un valor." : "Elemento sintético o sin abundancia natural representativa."}</p>
    </section>

    <section class="detail-section">
      <h3>Importancia económica</h3>
      <p class="detail-subtitle">${element.economicImportance || "Información no disponible."}</p>
    </section>

    <section class="detail-section">
      <h3>Impacto ambiental y contaminación</h3>
      <p class="detail-subtitle">${element.environmentalImpact || "El riesgo depende de la forma química, concentración y exposición."}</p>
    </section>

    <section class="detail-section">
      <h3>Configuración electrónica</h3>
      <div class="config">${config}</div>
    </section>
  `;

  elementPanel.classList.add("open");
  elementPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

const openLessonsButton = document.getElementById("openLessons");

// Mostrar el índice de las lecciones.
function openLessons() {
  elementDetail.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-title">Enlaces químicos</h2>
      <p class="detail-subtitle">
        Unidad educativa: enlace covalente coordinado.
      </p>
    </div>

    <section class="detail-section">
      <h3>Contenido de aprendizaje</h3>
      <div class="detail-grid">
        ${LESSONS.map((lesson, index) => `
          <button
            class="filter-btn"
            data-lesson="${index}"
            style="width:100%; text-align:left;"
          >
            ${lesson.title}
          </button>
        `).join("")}
      </div>
    </section>

    <section class="detail-section">
      <h3>Objetivo</h3>
      <p class="detail-subtitle">
        Comprender cómo se forman los enlaces covalentes
        coordinados mediante el ejemplo del amoníaco y
        el ion amonio.
      </p>
    </section>
  `;

  elementPanel.classList.add("open");
  elementPanel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Mostrar el contenido de una lección.
function showLesson(index) {
  const lesson = LESSONS[index];

  if (!lesson) return;

  elementDetail.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-title">${lesson.title}</h2>
      <p class="detail-subtitle">${lesson.subtitle}</p>
    </div>

    ${lesson.sections.map(section => `
      <section class="detail-section">
        <h3>${section.heading}</h3>
        <p class="detail-subtitle">${section.content}</p>
      </section>
    `).join("")}

    ${lesson.id === "coordinado" ? `
  <section class="detail-section">
    <h3>Simulación interactiva</h3>

    <p class="detail-subtitle">
      Observa paso a paso cómo el nitrógeno del amoníaco
      dona su par de electrones al ion hidrógeno para
      formar el ion amonio.
    </p>

    <iframe
      src="recursos/enlace-coordiado-amoniaco.html"
      title="Animación del enlace covalente coordinado"
      loading="lazy"
      style="
        width: 100%;
        height: 850px;
        border: none;
        border-radius: 12px;
        display: block;
      "
    ></iframe>
  </section>
` : ""}

    ${["amoniaco", "coordinado", "amonio"].includes(lesson.id) ? `
  <section class="detail-section">
    <h3>Elementos relacionados</h3>

    <div class="detail-grid">
      <button class="filter-btn" data-element="N">
        Consultar nitrógeno (N)
      </button>

      <button class="filter-btn" data-element="H">
        Consultar hidrógeno (H)
      </button>
    </div>
  </section>
` : ""}

    <section class="detail-section">
      <button id="backToLessons" class="filter-btn">
        ← Volver al contenido
      </button>
    </section>
    ${lesson.diagram ? `
  <section class="detail-section">
    <h3>Representación de Lewis</h3>
    <pre class="config">${lesson.diagram}</pre>
  </section>
` : ""}
  `;
}

// Eventos de navegación.
openLessonsButton.addEventListener("click", openLessons);

elementDetail.addEventListener("click", (event) => {
  const lessonButton = event.target.closest("[data-lesson]");
  const backButton = event.target.closest("#backToLessons");
  const elementButton = event.target.closest("[data-element]");

  if (lessonButton) {
    showLesson(Number(lessonButton.dataset.lesson));
  }

  if (backButton) {
    openLessons();
  }

  if (elementButton) {
    const symbol = elementButton.dataset.element;

    const element = ELEMENTS.find(
      item => item.symbol === symbol
    );

    if (element) {
      openElement(element);
    }
  }
});


function closeElementPanel() {
  elementPanel.classList.remove("open");
  elementPanel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function electronConfiguration(z) {
  const order = [
    ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6],
    ["4s", 2], ["3d", 10], ["4p", 6], ["5s", 2], ["4d", 10],
    ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10], ["6p", 6],
    ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6]
  ];

  let remaining = z;
  const parts = [];

  for (const [orbital, capacity] of order) {
    if (remaining <= 0) break;
    const electrons = Math.min(remaining, capacity);
    parts.push(`${orbital}<sup>${electrons}</sup>`);
    remaining -= electrons;
  }

  return parts.join(" ");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

familyFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  selectedFamily = button.dataset.family;
  render();
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
});

propertySelect.addEventListener("change", (event) => {
  selectedProperty = event.target.value;
  render();
  updatePropertyDescription();
});

closePanel.addEventListener("click", closeElementPanel);
panelBackdrop.addEventListener("click", closeElementPanel);

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  }

  if (event.key === "Escape") {
    closeElementPanel();
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☾" : "☼";
  localStorage.setItem("atlas-theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("atlas-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☾";
}

updatePropertyDescription();
createGroupLabels();
render();