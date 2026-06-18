const pptxgen = require("pptxgenjs");

// ─── KLEUREN & TYPOGRAFIE ───────────────────────────────────────────────────
const BG      = "F7F5F2";   // warme off-white achtergrond
const INK     = "1A1A1A";   // bijna-zwart voor titels
const MUTED   = "6B6B6B";   // grijs voor subtekst
const BLUE    = "1A56B0";   // Flexso corporate blauw
const CREAM   = "EDE8E0";   // lichte kaart-achtergrond
const WHITE   = "FFFFFF";
const DARK    = "111827";   // donker voor title/einde slides
const LIME    = "C8E6C9";   // licht groen accent
const AMBER   = "FFF3CD";   // licht oranje accent
const RED_L   = "FDECEA";   // licht rood
const IMG     = "C:/Users/aiche/OneDrive/Documents/verslag_images/";

function newPres() {
  let p = new pptxgen();
  p.layout = "LAYOUT_16x9";
  return p;
}

const pres = newPres();
pres.title = "EventSphere — Eindverdediging";

// ─── HELPERS ────────────────────────────────────────────────────────────────
// Doorlopende dikke lijn bovenaan elke content-slide
function topBar(s, color) {
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: color || BLUE }, line: { color: color || BLUE }
  });
}

// Sectielabel klein bovenaan links
function sectionTag(s, label) {
  s.addText(label.toUpperCase(), {
    x: 0.5, y: 0.22, w: 6, h: 0.3,
    fontSize: 9, bold: true, color: BLUE,
    fontFace: "Calibri", charSpacing: 3, margin: 0
  });
}

// Grote paginatitel
function pageTitle(s, title) {
  s.addText(title, {
    x: 0.5, y: 0.6, w: 9, h: 0.95,
    fontSize: 34, bold: true, color: INK,
    fontFace: "Calibri", margin: 0
  });
}

// Dunne scheiding onder de titel
function divider(s, y, w, color) {
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y || 1.58, w: w || 1.8, h: 0.045,
    fill: { color: color || BLUE }, line: { color: color || BLUE }
  });
}

// Subtekst-rij met bullet-streep
function row(s, x, y, w, label, value, labelColor) {
  s.addText(label, {
    x, y, w: w * 0.38, h: 0.35,
    fontSize: 11, bold: true, color: labelColor || BLUE,
    fontFace: "Calibri", margin: 0
  });
  s.addText(value, {
    x: x + w * 0.38, y, w: w * 0.62, h: 0.35,
    fontSize: 11, color: INK, fontFace: "Calibri", margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITELPAGINA  (donker, groot, minimaal)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  // Blauwe balk links — volledig verticaal
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.55, h: 5.625,
    fill: { color: BLUE }, line: { color: BLUE }
  });

  // Jaar klein bovenaan
  s.addText("2024 — 2025", {
    x: 0.85, y: 0.42, w: 4, h: 0.3,
    fontSize: 11, color: "8899AA", fontFace: "Calibri", charSpacing: 2, margin: 0
  });

  // Grote projectnaam
  s.addText("Event\nSphere", {
    x: 0.85, y: 0.82, w: 6.5, h: 2.3,
    fontSize: 76, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0
  });

  // Ondertitel
  s.addText("Ontwikkelen van een event management applicatie", {
    x: 0.85, y: 3.22, w: 6.5, h: 0.52,
    fontSize: 15, color: "AABBCC", fontFace: "Calibri", margin: 0
  });

  // Dunne witte lijn als scheiding
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.85, y: 3.82, w: 5.5, h: 0.03,
    fill: { color: "334455" }, line: { color: "334455" }
  });

  // Team namen inline
  s.addText("Aiché Camara   ·   Denzl De Mey   ·   Danick Tchang", {
    x: 0.85, y: 3.98, w: 7, h: 0.38,
    fontSize: 13, color: "CCDDEE", fontFace: "Calibri", margin: 0
  });

  s.addText("Opdrachtgever: Flexso   |   Begeleiders: Yor Rombaut & Bilal", {
    x: 0.85, y: 4.5, w: 7.5, h: 0.3,
    fontSize: 10, color: "667788", fontFace: "Calibri", margin: 0
  });

  // Flexso woordje rechts als watermark
  s.addText("FLEXSO", {
    x: 7.5, y: 4.85, w: 2.3, h: 0.55,
    fontSize: 26, bold: true, color: "1E3A5F",
    fontFace: "Calibri", align: "right", charSpacing: 5, margin: 0
  });

  s.addNotes("Welkom. Wij stellen vandaag EventSphere voor — een event management applicatie ontwikkeld voor Flexso.");
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — AGENDA  (schone lijst, geen grid)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);

  sectionTag(s, "Overzicht");
  pageTitle(s, "Agenda");
  divider(s);

  const items = [
    ["01", "Context van de opdracht",  "Opdrachtgever, probleemstelling & oplossing"],
    ["02", "Ons proces",               "Planning, tools & werkverdeling"],
    ["03", "Analysedocumenten",        "Use cases & database ontwerp"],
    ["04", "Technische architectuur",  "Stack, lagen & code uitleg"],
    ["05", "Voorstelling oplossing",   "Demo van de volledige applicatie"],
    ["06", "Reflectie",                "Wat ging goed / kon beter / mee naar de toekomst"],
  ];

  items.forEach(([nr, titel, sub], i) => {
    const y = 1.72 + i * 0.63;
    // Nummerlijn
    s.addText(nr, {
      x: 0.5, y, w: 0.55, h: 0.42,
      fontSize: 20, bold: true, color: BLUE,
      fontFace: "Calibri", align: "right", valign: "middle", margin: 0
    });
    // Verticale scheidingslijn
    s.addShape(pres.shapes.RECTANGLE, {
      x: 1.15, y: y + 0.06, w: 0.03, h: 0.3,
      fill: { color: "DDDDDD" }, line: { color: "DDDDDD" }
    });
    // Titel
    s.addText(titel, {
      x: 1.28, y, w: 3.5, h: 0.28,
      fontSize: 13, bold: true, color: INK, fontFace: "Calibri", margin: 0
    });
    // Subtekst
    s.addText(sub, {
      x: 1.28, y: y + 0.29, w: 5, h: 0.24,
      fontSize: 10, color: MUTED, fontFace: "Calibri", margin: 0
    });
    // Lichte lijn eronder
    if (i < 5) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: y + 0.58, w: 9, h: 0.01,
        fill: { color: "EEEEEE" }, line: { color: "EEEEEE" }
      });
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — WIE IS FLEXSO?  (twee-kolom: tekst links, groot woord rechts)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);

  sectionTag(s, "Context van de opdracht");
  pageTitle(s, "Wie is Flexso?");
  divider(s);

  // Achtergrond rechts — donkerblauw vlak
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 0, w: 4.2, h: 5.625,
    fill: { color: DARK }, line: { color: DARK }
  });
  s.addText("FLEXSO", {
    x: 5.8, y: 1.5, w: 4.2, h: 1.4,
    fontSize: 54, bold: true, color: BLUE,
    fontFace: "Calibri", align: "center", charSpacing: 6, margin: 0
  });
  s.addText("SAP Expert Partner", {
    x: 5.8, y: 3.0, w: 4.2, h: 0.4,
    fontSize: 13, color: "8899BB", fontFace: "Calibri",
    align: "center", charSpacing: 2, margin: 0
  });
  s.addText("Contactpersonen:", {
    x: 5.8, y: 3.65, w: 4.2, h: 0.28,
    fontSize: 10, color: "8899BB", fontFace: "Calibri", align: "center", margin: 0
  });
  s.addText("Yor Rombaut (technisch)\nBilal (business)", {
    x: 5.8, y: 3.95, w: 4.2, h: 0.65,
    fontSize: 12, color: WHITE, fontFace: "Calibri", align: "center", margin: 0
  });

  // Linker kolom: 3 items
  const punten = [
    { icon: "01", kop: "SAP Expert Partner",     body: "Toonaangevende SAP-partner die sterk inzet op de nieuwste technologieën voor de digitale economie van morgen." },
    { icon: "02", kop: "SAP BTP & CAP",          body: "Werkt met SAP Business Technology Platform, Cloud Foundry en SAP CAP voor enterprise cloudapplicaties." },
    { icon: "03", kop: "Stagiairs & studenten",  body: "Flexso ontvangt elk jaar stagiairs, deelt kennis en biedt een eerste stap naar een boeiende IT-carrière." },
  ];

  punten.forEach(({ icon, kop, body }, i) => {
    const y = 1.78 + i * 1.2;
    s.addText(icon, {
      x: 0.5, y, w: 0.45, h: 0.42,
      fontSize: 11, bold: true, color: BLUE,
      fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(kop, {
      x: 1.05, y, w: 4.5, h: 0.32,
      fontSize: 14, bold: true, color: INK, fontFace: "Calibri", margin: 0
    });
    s.addText(body, {
      x: 1.05, y: y + 0.34, w: 4.5, h: 0.6,
      fontSize: 11, color: MUTED, fontFace: "Calibri", margin: 0
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — PROBLEEMSTELLING & OPLOSSING  (split-screen)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);

  // Linker helft licht rood, rechter helft licht groen
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.08, w: 5, h: 5.545,
    fill: { color: "FEF9F9" }, line: { color: "FEF9F9" }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5, y: 0.08, w: 5, h: 5.545,
    fill: { color: "F5FBF5" }, line: { color: "F5FBF5" }
  });

  // Titels
  s.addText("Probleemstelling", {
    x: 0.5, y: 0.5, w: 4.2, h: 0.7,
    fontSize: 24, bold: true, color: "C0392B", fontFace: "Calibri", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.22, w: 1.2, h: 0.04,
    fill: { color: "C0392B" }, line: { color: "C0392B" }
  });

  s.addText("Onze Oplossing", {
    x: 5.3, y: 0.5, w: 4.2, h: 0.7,
    fontSize: 24, bold: true, color: "1E8449", fontFace: "Calibri", margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.22, w: 1.2, h: 0.04,
    fill: { color: "1E8449" }, line: { color: "1E8449" }
  });

  const problemen = [
    "Geen centrale app voor interne events & sessies",
    "Deelnemers kunnen zich niet digitaal registreren",
    "Geen mogelijkheid om sessies te scoren of feedback te geven",
    "Beheerders hebben geen overzicht van registraties",
    "Aanmaken van events & sessies verloopt manueel",
  ];
  problemen.forEach((p, i) => {
    s.addText("—  " + p, {
      x: 0.5, y: 1.42 + i * 0.68, w: 4.2, h: 0.55,
      fontSize: 12, color: INK, fontFace: "Calibri", valign: "middle", margin: 0
    });
  });

  const oplossingen = [
    ["EventSphere",       "SAP CAP + UI5 event management platform"],
    ["Gebruikersmodule",  "Events bekijken, registreren & feedback geven"],
    ["Beheerdersmodule",  "Events & sessies aanmaken, registraties volgen"],
    ["Scorebord",         "Overzicht per sessie: deelnames & gemiddelde score"],
    ["SAP BTP",           "Cloud Foundry + CAP + GitHub versiebeheer"],
  ];
  oplossingen.forEach(([kop, body], i) => {
    s.addText(kop, {
      x: 5.3, y: 1.42 + i * 0.68, w: 4.2, h: 0.28,
      fontSize: 12, bold: true, color: "1E8449", fontFace: "Calibri", margin: 0
    });
    s.addText(body, {
      x: 5.3, y: 1.7 + i * 0.68, w: 4.2, h: 0.28,
      fontSize: 11, color: MUTED, fontFace: "Calibri", margin: 0
    });
  });

  // Middellijn
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.97, y: 0.08, w: 0.06, h: 5.545,
    fill: { color: "DDDDDD" }, line: { color: "DDDDDD" }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — PLANNING  (horizontale tijdlijn met alternerende tekst)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Ons proces");
  pageTitle(s, "Planning & Tijdlijn");
  divider(s);

  const milestones = [
    { datum: "11 feb",  kleur: BLUE,    titel: "Kick-off",           body: "Eerste meeting\nYor Rombaut & Bilal" },
    { datum: "feb",     kleur: "555555", titel: "Setup",              body: "Tools, tutorials\nVS Code & GitHub" },
    { datum: "1 mrt",   kleur: BLUE,    titel: "FA gemaakt",         body: "Use cases & DB\nontwerp (samen)" },
    { datum: "13 mrt",  kleur: "E67E22", titel: "1e Prototype",      body: "Getoond aan\nmeneer Rombaut" },
    { datum: "22 mrt",  kleur: "E67E22", titel: "Sprint User-view",  body: "Login, Events,\nDetails, Feedback" },
    { datum: "31 mrt",  kleur: "1E8449", titel: "Oplevering fase 1", body: "Gebruikersview\naan opdrachtgever" },
    { datum: "apr–jun", kleur: "1E8449", titel: "Fase 2 — Admin",    body: "Dashboard,\nCreate Event & Sessie" },
  ];

  const LINE_Y = 3.1;
  const X_START = 0.55;
  const STEP = 1.33;

  // tijdlijn balk
  s.addShape(pres.shapes.RECTANGLE, {
    x: X_START, y: LINE_Y - 0.03, w: STEP * (milestones.length - 1) + 0.1, h: 0.06,
    fill: { color: "DDDDDD" }, line: { color: "DDDDDD" }
  });

  milestones.forEach(({ datum, kleur, titel, body }, i) => {
    const x = X_START + i * STEP;
    const boven = i % 2 === 0;

    // Cirkel
    s.addShape(pres.shapes.OVAL, {
      x: x - 0.13, y: LINE_Y - 0.13, w: 0.26, h: 0.26,
      fill: { color: kleur }, line: { color: WHITE, width: 2 }
    });

    // Datum
    s.addText(datum, {
      x: x - 0.65, y: boven ? 2.52 : 3.38, w: 1.3, h: 0.28,
      fontSize: 9, bold: true, color: kleur,
      fontFace: "Calibri", align: "center", margin: 0
    });

    // Verbindingslijntje
    s.addShape(pres.shapes.RECTANGLE, {
      x: x - 0.015, y: boven ? 1.68 : 3.22, w: 0.03, h: boven ? 0.82 : 0.82,
      fill: { color: "CCCCCC" }, line: { color: "CCCCCC" }
    });

    // Titel + body
    s.addText(titel, {
      x: x - 0.65, y: boven ? 1.22 : 3.72, w: 1.3, h: 0.32,
      fontSize: 11, bold: true, color: INK,
      fontFace: "Calibri", align: "center", margin: 0
    });
    s.addText(body, {
      x: x - 0.65, y: boven ? 1.55 : 4.08, w: 1.3, h: 0.7,
      fontSize: 9, color: MUTED,
      fontFace: "Calibri", align: "center", margin: 0
    });
  });

  s.addNotes("We werkten iteratief: analyse → prototype → feedback → verbetering. We vroegen regelmatig feedback aan de opdrachtgever.");
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — WERKVERDELING & TOOLS
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);
  sectionTag(s, "Ons proces");
  pageTitle(s, "Werkverdeling & Tools");
  divider(s);

  // Drie teamleden als tabel-stijl
  const teamleden = [
    { naam: "Aiché Camara",  kleur: "7B2D8B", taken: ["Login pagina (view + controller)", "Feedback pagina", "CSS stijlen & user model", "sessionStorage & globaal model"] },
    { naam: "Danick Tchang", kleur: BLUE,     taken: ["Database schema (CDS)", "Admin Dashboard (KPI's)", "Create Event formulier", "Opkomende events pagina"] },
    { naam: "Denzl De Mey",  kleur: "1E8449", taken: ["Event Details pagina", "Sessie registratie", "Geregistreerde sessies", "Create Session formulier"] },
  ];

  const COL_W = 2.9;
  teamleden.forEach(({ naam, kleur, taken }, i) => {
    const x = 0.45 + i * 3.1;
    // Naam-blok
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.75, w: COL_W, h: 0.55,
      fill: { color: kleur }, line: { color: kleur }
    });
    s.addText(naam, {
      x, y: 1.75, w: COL_W, h: 0.55,
      fontSize: 13, bold: true, color: WHITE,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    // Taken
    taken.forEach((taak, j) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.35 + j * 0.62, w: COL_W, h: 0.56,
        fill: { color: j % 2 === 0 ? WHITE : CREAM }, line: { color: j % 2 === 0 ? WHITE : CREAM }
      });
      s.addText(taak, {
        x: x + 0.18, y: 2.38 + j * 0.62, w: COL_W - 0.25, h: 0.5,
        fontSize: 11, color: INK, fontFace: "Calibri", valign: "middle", margin: 0
      });
    });
  });

  // Tools
  s.addText("Gebruikte tools", {
    x: 0.45, y: 4.88, w: 1.8, h: 0.3,
    fontSize: 10, bold: true, color: BLUE, fontFace: "Calibri", margin: 0
  });
  const tools = ["VS Code", "GitHub", "SAP UI5", "SAP CAP", "Node.js", "SQLite", "CDS"];
  tools.forEach((t, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.3 + i * 1.12, y: 4.85, w: 1.02, h: 0.32,
      fill: { color: DARK }, line: { color: DARK }, rectRadius: 0.05
    });
    s.addText(t, {
      x: 2.3 + i * 1.12, y: 4.85, w: 1.02, h: 0.32,
      fontSize: 9.5, color: "88BBDD", fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — USE CASES
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Analysedocumenten");
  pageTitle(s, "Use Cases");
  divider(s);

  const uc = [
    { nr: "UC-01", actor: "Gebruiker", titel: "Events Bekijken",         flow: "App openen → lijst laden → filteren op status, locatie of zoekterm" },
    { nr: "UC-02", actor: "Gebruiker", titel: "Event Details",           flow: "Klik 'View Details' → volledige info + alle sessies zichtbaar" },
    { nr: "UC-03", actor: "Gebruiker", titel: "Sessie Registreren",      flow: "Sessie kiezen → registratieformulier → bevestiging" },
    { nr: "UC-04", actor: "Gebruiker", titel: "Feedback Geven",          flow: "Na sessie → score + commentaar invoeren → opslaan" },
    { nr: "UC-05", actor: "Admin",     titel: "Event Aanmaken",          flow: "Formulier: naam, locatie, datums → validatie → POST naar API" },
    { nr: "UC-06", actor: "Admin",     titel: "Sessie Toevoegen",        flow: "Event selecteren → sessiedata (tijd, spreker, zaal) → opslaan" },
    { nr: "UC-07", actor: "Admin",     titel: "Dashboard Bekijken",      flow: "KPI-kaarten: events, sessies, registraties, gemiddelde rating" },
    { nr: "UC-08", actor: "Admin",     titel: "Registraties Beheren",    flow: "Per event → deelnemerslijst → aanwezigheid bevestigen" },
  ];

  const COL = 4.5;
  uc.forEach(({ nr, actor, titel, flow }, i) => {
    const col  = i < 4 ? 0 : 1;
    const row  = i % 4;
    const x    = 0.5 + col * (COL + 0.5);
    const y    = 1.72 + row * 0.94;
    const isA  = actor === "Admin";
    const kleur = isA ? "7B2D8B" : BLUE;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y + 0.04, w: 0.7, h: 0.28,
      fill: { color: kleur }, line: { color: kleur }, rectRadius: 0.04
    });
    s.addText(nr, {
      x, y: y + 0.04, w: 0.7, h: 0.28,
      fontSize: 9, bold: true, color: WHITE,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    s.addText(titel, {
      x: x + 0.82, y, w: COL - 0.9, h: 0.32,
      fontSize: 13, bold: true, color: INK, fontFace: "Calibri", margin: 0
    });
    s.addText(flow, {
      x: x + 0.82, y: y + 0.35, w: COL - 0.9, h: 0.42,
      fontSize: 10, color: MUTED, fontFace: "Calibri", margin: 0
    });
    if (row < 3) {
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + 0.9, w: COL, h: 0.01,
        fill: { color: "EEEEEE" }, line: { color: "EEEEEE" }
      });
    }
  });

  // Kleine labels
  s.addText("Gebruiker", {
    x: 0.5, y: 1.52, w: 2, h: 0.22,
    fontSize: 10, bold: true, color: BLUE, fontFace: "Calibri", charSpacing: 2, margin: 0
  });
  s.addText("Admin", {
    x: 5.5, y: 1.52, w: 2, h: 0.22,
    fontSize: 10, bold: true, color: "7B2D8B", fontFace: "Calibri", charSpacing: 2, margin: 0
  });

  // Verticale scheidingslijn midden
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.65, w: 0.02, h: 3.8,
    fill: { color: "DDDDDD" }, line: { color: "DDDDDD" }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — DATABASE ONTWERP
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);
  sectionTag(s, "Analysedocumenten");
  pageTitle(s, "Database Ontwerp — schema.cds");
  divider(s);

  // Vijf entiteiten als nette tabel-blokken met kleur-header
  const entities = [
    { naam: "Users",         kleur: "7B2D8B", x: 0.3, y: 1.7, velden: ["ID (UUID)", "firstName, lastName", "email", "role: admin | user"] },
    { naam: "Events",        kleur: BLUE,     x: 2.3, y: 1.7, velden: ["ID (UUID)", "name, description", "location", "startDate / endDate", "active (Boolean)"] },
    { naam: "Sessions",      kleur: "E67E22", x: 4.7, y: 1.7, velden: ["ID (UUID)", "title, description", "startTime / endTime", "speaker, room", "capacity (Integer)"] },
    { naam: "Registrations", kleur: "1E8449", x: 1.5, y: 3.85, velden: ["ID (UUID)", "registrationDate", "attendanceConfirmed", "→ session, → user"] },
    { naam: "Feedback",      kleur: "C0392B", x: 5.5, y: 3.85, velden: ["ID (UUID)", "score, comment", "submittedAt", "email", "→ registration"] },
  ];

  entities.forEach(({ naam, kleur, x, y, velden }) => {
    const h = 0.35 + velden.length * 0.37;
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.0, h: 0.38,
      fill: { color: kleur }, line: { color: kleur }
    });
    s.addText(naam, {
      x, y, w: 2.0, h: 0.38,
      fontSize: 12, bold: true, color: WHITE,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0
    });
    // Body
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: y + 0.38, w: 2.0, h: velden.length * 0.37,
      fill: { color: WHITE }, line: { color: "DDDDDD" }
    });
    velden.forEach((v, vi) => {
      s.addText(v, {
        x: x + 0.12, y: y + 0.43 + vi * 0.37, w: 1.8, h: 0.3,
        fontSize: 10, color: INK, fontFace: "Calibri", margin: 0
      });
    });
  });

  // Relatie-pijlen als tekst
  s.addText("Events  1──*  Sessions  1──*  Registrations  *──1  Users", {
    x: 0.3, y: 5.2, w: 9.4, h: 0.28,
    fontSize: 10, color: MUTED, fontFace: "Calibri", italic: true, margin: 0
  });
  s.addText("Registrations  1──*  Feedback", {
    x: 0.3, y: 5.42, w: 5, h: 0.22,
    fontSize: 10, color: MUTED, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8b — DATABASE ERD (echte foto uit verslag)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);
  sectionTag(s, "Analysedocumenten");
  pageTitle(s, "Database Schema — ERD Diagram");
  divider(s);

  // image5.png = 2e Database ERD (landscape formaat, duidelijk leesbaar)
  // Afmetingen: 1656×947 px  →  bij h=3.85": w = 3.85*(1656/947) = 6.73"
  const erdH = 3.82;
  const erdW = erdH * (1656 / 947);
  s.addImage({ path: IMG + "image5.png", x: (10 - erdW) / 2, y: 1.68, w: erdW, h: erdH });

  s.addText("Evolutie: 1ste ontwerp → UUID-gebaseerde versie → finaal schema (5 entiteiten)", {
    x: 0.5, y: 5.28, w: 9, h: 0.25,
    fontSize: 9.5, color: MUTED, fontFace: "Calibri", italic: true, align: "center", margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — TECHNISCHE ARCHITECTUUR
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Technische architectuur");
  pageTitle(s, "Architectuur & Stack");
  divider(s);

  // Links: 3 lagen
  const lagen = [
    { num: "UI",  kop: "app/  —  UI Laag",      kleur: BLUE,     tech: "SAP UI5  ·  XML Views  ·  JavaScript  ·  OData binding",    detail: "Login · Events · EventDetail · AdminDashboard · CreateEvent · CreateSession" },
    { num: "SVC", kop: "srv/  —  Service Laag",  kleur: "E67E22", tech: "SAP CAP  ·  Node.js  ·  CDS Services  ·  OData v4 API",     detail: "admin-service.cds  +  event-service.cds → exposeren Events, Sessions, Registrations" },
    { num: "DB",  kop: "db/  —  Database Laag",  kleur: "1E8449", tech: "CDS Schema  ·  SQLite  ·  CSV seed data",                   detail: "5 entiteiten: Users, Events, Sessions, Registrations, Feedback" },
  ];

  lagen.forEach(({ num, kop, kleur, tech, detail }, i) => {
    const y = 1.72 + i * 1.22;
    // Kleur-badge links
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.62, h: 1.0,
      fill: { color: kleur }, line: { color: kleur }
    });
    s.addText(num, {
      x: 0.5, y, w: 0.62, h: 1.0,
      fontSize: 11, bold: true, color: WHITE,
      fontFace: "Calibri", align: "center", valign: "middle", charSpacing: 1, margin: 0
    });
    // Titel
    s.addText(kop, {
      x: 1.28, y: y + 0.05, w: 7.8, h: 0.35,
      fontSize: 14, bold: true, color: INK, fontFace: "Calibri", margin: 0
    });
    // Tech tags
    s.addText(tech, {
      x: 1.28, y: y + 0.4, w: 7.8, h: 0.28,
      fontSize: 11, bold: true, color: kleur, fontFace: "Calibri", margin: 0
    });
    // Detail
    s.addText(detail, {
      x: 1.28, y: y + 0.65, w: 7.8, h: 0.3,
      fontSize: 10.5, color: MUTED, fontFace: "Calibri", margin: 0
    });
    // Lijn eronder
    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.5, y: y + 1.1, w: 8.8, h: 0.01,
        fill: { color: "EEEEEE" }, line: { color: "EEEEEE" }
      });
    }
  });

  // Routing onderaan
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.08, w: 9.0, h: 0.04,
    fill: { color: "EEEEEE" }, line: { color: "EEEEEE" }
  });
  s.addText('manifest.json routing:  "" → Login  ·  events → Events  ·  create → CreateEvent  ·  admin-dashboard → AdminDashboard  ·  event/{id}/create-session → CreateSession', {
    x: 0.5, y: 5.15, w: 9.0, h: 0.3,
    fontSize: 9.5, color: MUTED, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — LOGIN PAGINA (Aiché)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);
  sectionTag(s, "Voorstelling oplossing  ·  Aiché Camara");
  pageTitle(s, "Login Pagina");
  divider(s);

  // Links: echte screenshot login pagina
  // image7.png = 360×490 px  →  bij w=2.5": h = 2.5*(490/360) = 3.40"
  s.addImage({ path: IMG + "image7.png", x: 0.45, y: 1.7, w: 2.5, h: 3.40 });

  // Midden: stap-voor-stap flow
  const stappen = [
    "1  Lees email + password via byId()",
    "2  Leeg? → MessageBox.warning()",
    "3  USERS.find() — zoek in array",
    "4  Niet gevonden → MessageBox.error()",
    "5  Bouw oUserData { ID, naam, rol }",
    "6  sessionStorage.setItem('user', ...)",
    "7  setModel('user') — globaal in app",
    "8  getRouter().navTo('events')",
  ];
  s.addText("Controller-flow (onLogin)", {
    x: 3.95, y: 1.68, w: 2.5, h: 0.3,
    fontSize: 11, bold: true, color: BLUE, fontFace: "Calibri", margin: 0
  });
  stappen.forEach((stap, i) => {
    const bg = i % 2 === 0 ? WHITE : CREAM;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.95, y: 2.05 + i * 0.44, w: 2.5, h: 0.42,
      fill: { color: bg }, line: { color: bg }
    });
    s.addText(stap, {
      x: 4.05, y: 2.08 + i * 0.44, w: 2.35, h: 0.37,
      fontSize: 10, color: i < 2 ? "C0392B" : (i >= 4 ? "1E8449" : INK),
      fontFace: "Calibri", valign: "middle", margin: 0
    });
  });

  // Rechts: key code
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.62, y: 1.65, w: 3.05, h: 3.8,
    fill: { color: "1A1A2E" }, line: { color: "1A1A2E" }
  });
  s.addText("Login.controller.js", {
    x: 6.62, y: 1.65, w: 3.05, h: 0.3,
    fontSize: 10, bold: true, color: "6699CC",
    fontFace: "Calibri", align: "center", margin: 0
  });
  const code = `var USERS = [
 { email: "danick@hotmail.be",
   password: "danick123",
   role: "admin" },
 { email: "denzl@gmail.com",
   password: "denzl123",
   role: "user" }
];

var oUser = USERS.find(u =>
  u.email === sEmail &&
  u.password === sPw
);

sessionStorage.setItem(
  "loggedInUser",
  JSON.stringify(oUserData)
);

oComponent.setModel(
  new JSONModel(oUserData),
  "user"
);
getRouter().navTo("events");`;
  s.addText(code, {
    x: 6.65, y: 2.0, w: 2.98, h: 3.35,
    fontSize: 8.5, color: "A8D8EA", fontFace: "Courier New", valign: "top", margin: 5
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — ADMIN DASHBOARD (Danick)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Voorstelling oplossing  ·  Danick Tchang");
  pageTitle(s, "Admin Dashboard");
  divider(s);

  // Echte screenshot Admin Dashboard gecentreerd
  // image13.png = 1488×1162 px  →  bij h=3.88": w = 3.88*(1488/1162) = 4.97"
  const admH = 3.88;
  const admW = admH * (1488 / 1162);
  s.addImage({ path: IMG + "image13.png", x: (10 - admW) / 2, y: 1.65, w: admW, h: admH });

  s.addText("KPI's: Total Events · Total Sessions · Registraties · Gemiddelde Rating  |  _loadKpis(): 4 × fetch() naar OData $count & $apply=aggregate()", {
    x: 0.4, y: 5.6, w: 9.2, h: 0.25,
    fontSize: 8.5, color: MUTED, fontFace: "Calibri", italic: true, align: "center", margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — CREATE EVENT & SESSION
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: BG };
  topBar(s);
  sectionTag(s, "Voorstelling oplossing  ·  Danick Tchang & Denzl De Mey");
  pageTitle(s, "Create Event & Create Session");
  divider(s);

  // Dunne scheidingslijn midden
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.95, y: 1.65, w: 0.02, h: 3.8,
    fill: { color: "CCCCCC" }, line: { color: "CCCCCC" }
  });

  // CREATE EVENT links
  s.addText("Create Event", {
    x: 0.5, y: 1.68, w: 4.2, h: 0.38,
    fontSize: 18, bold: true, color: BLUE, fontFace: "Calibri", margin: 0
  });
  s.addText("Danick Tchang", {
    x: 0.5, y: 2.08, w: 4.2, h: 0.25,
    fontSize: 10, color: MUTED, fontFace: "Calibri", margin: 0
  });

  // Echte screenshot Create Event formulier
  // image14.png = 1488×1435 px  →  bij w=4.2": h = 4.2*(1435/1488) = 4.05"
  s.addImage({ path: IMG + "image14.png", x: 0.5, y: 2.38, w: 4.2, h: 4.2 * (1435 / 1488) });

  s.addText("onSave(): OData list binding → POST /odata/v4/admin/Events → navTo EventDetail", {
    x: 0.5, y: 5.32, w: 4.25, h: 0.22,
    fontSize: 9, color: MUTED, fontFace: "Calibri", italic: true, margin: 0
  });

  // CREATE SESSION rechts
  s.addText("Create Session", {
    x: 5.25, y: 1.68, w: 4.3, h: 0.38,
    fontSize: 18, bold: true, color: "1E8449", fontFace: "Calibri", margin: 0
  });
  s.addText("Denzl De Mey", {
    x: 5.25, y: 2.08, w: 4.3, h: 0.25,
    fontSize: 10, color: MUTED, fontFace: "Calibri", margin: 0
  });

  // Echte screenshot Create Session formulier
  // image15.png = 1488×1244 px  →  bij w=4.2": h = 4.2*(1244/1488) = 3.51"
  s.addImage({ path: IMG + "image15.png", x: 5.25, y: 2.38, w: 4.2, h: 4.2 * (1244 / 1488) });

  s.addText("_buildDateTime() combineert datum + tijd → ISO string → fetch POST met event_ID", {
    x: 5.25, y: 5.32, w: 4.35, h: 0.22,
    fontSize: 9, color: MUTED, fontFace: "Calibri", italic: true, margin: 0
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 12b — PROTOTYPE OVERZICHT (echte schermafbeeldingen)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Voorstelling oplossing");
  pageTitle(s, "Prototype — Schermoverzicht");
  divider(s);

  // Rij 1: Upcoming Events · Event Details · Session Registration
  // image8 = 1488×988, image10 = 1488×988, image12 = 1488×1202
  const r1W = 2.9;
  const imgs1 = [
    { file: "image8.png",  label: "Upcoming Events",      h: r1W * (988  / 1488) },
    { file: "image10.png", label: "Sessie Registreren",   h: r1W * (988  / 1488) },
    { file: "image12.png", label: "Feedback Geven",       h: r1W * (1202 / 1488) },
  ];
  const gap = 0.3;
  const startX = (10 - imgs1.length * r1W - (imgs1.length - 1) * gap) / 2;
  const maxH1 = Math.max(...imgs1.map(i => i.h));
  imgs1.forEach(({ file, label, h }, i) => {
    const x = startX + i * (r1W + gap);
    s.addImage({ path: IMG + file, x, y: 1.68, w: r1W, h });
    s.addText(label, {
      x, y: 1.68 + maxH1 + 0.07, w: r1W, h: 0.26,
      fontSize: 9.5, bold: true, color: BLUE,
      fontFace: "Calibri", align: "center", margin: 0
    });
  });

  // Rij 2: Geregistreerde sessies · Event Analytics · Leave Feedback
  // image11 = 1488×988, image16 = 1488×1654 (portrait), image9 = 1518×1794
  // Gebruik: image11, image11 equivalent + event details
  const r2Y = 1.68 + maxH1 + 0.4;
  const imgs2 = [
    { file: "image11.png", label: "Mijn Sessies",         h: r1W * (988  / 1488) },
    { file: "image9.png",  label: "Event Details",        h: r1W * (1794 / 1518) },
    { file: "image16.png", label: "Event Analytics",      h: r1W * (1654 / 1488) },
  ];
  // Schaal terug zodat rij 2 in de slide past
  const maxH2 = Math.max(...imgs2.map(i => i.h));
  const available = 5.53 - r2Y - 0.35;
  const scale = maxH2 > available ? available / maxH2 : 1;
  imgs2.forEach(({ file, label, h }, i) => {
    const w = r1W * scale;
    const scaledH = h * scale;
    const xStart = (10 - imgs2.length * w - (imgs2.length - 1) * gap * scale) / 2;
    const x = xStart + i * (w + gap * scale);
    s.addImage({ path: IMG + file, x, y: r2Y, w, h: scaledH });
    s.addText(label, {
      x, y: r2Y + available + 0.04, w,  h: 0.26,
      fontSize: 9.5, bold: true, color: MUTED,
      fontFace: "Calibri", align: "center", margin: 0
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — DEMO  (donker, minimaal)
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.55, h: 5.625,
    fill: { color: BLUE }, line: { color: BLUE }
  });

  s.addText("DEMO", {
    x: 0.85, y: 0.9, w: 8, h: 1.6,
    fontSize: 88, bold: true, color: WHITE,
    fontFace: "Calibri", charSpacing: 15, margin: 0
  });

  s.addText("Live demonstratie van de EventSphere applicatie", {
    x: 0.85, y: 2.65, w: 7, h: 0.45,
    fontSize: 16, color: "8899AA", fontFace: "Calibri", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.85, y: 3.22, w: 6.5, h: 0.03,
    fill: { color: "2A3A4A" }, line: { color: "2A3A4A" }
  });

  const stappen = [
    "01  Login als admin of gebruiker",
    "02  Events lijst + filters",
    "03  Admin Dashboard KPI's",
    "04  Event aanmaken",
    "05  Sessie toevoegen",
    "06  Registreren & feedback geven",
  ];
  stappen.forEach((stap, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i % 3;
    s.addText(stap, {
      x: 0.85 + col * 4.5, y: 3.42 + row * 0.58, w: 4.2, h: 0.45,
      fontSize: 13, color: "AABBCC", fontFace: "Calibri", margin: 0
    });
  });

  s.addNotes("Demo volgorde: Login admin → Events lijst → Dashboard KPI's → Create Event → Create Session → Gebruiker registratie & feedback.");
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — REFLECTIE
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  topBar(s);
  sectionTag(s, "Reflectie");
  pageTitle(s, "Terugblik op het project");
  divider(s);

  const kolommen = [
    {
      titel: "Wat ging goed",
      kleur: "1E8449",
      bgLight: "F2FAF5",
      items: [
        "Sterke samenwerking in het team",
        "Prototype op tijd getoond",
        "Regelmatig feedback gevraagd",
        "Duidelijke taakverdeling",
        "Iteratief werken: analyse → prototype → verbetering",
      ]
    },
    {
      titel: "Wat kon beter",
      kleur: "C0392B",
      bgLight: "FDF4F3",
      items: [
        "Problemen met SAP Business Application Studio",
        "Tijd verloren door initiële setup",
        "GitHub workflow in SAP was complex",
        "Moeilijk om fysiek samen te werken",
        "OData vs fetch() inconsistent gebruikt",
      ]
    },
    {
      titel: "Mee naar de toekomst",
      kleur: BLUE,
      bgLight: "F0F5FC",
      items: [
        "Meteen lokale omgeving opzetten",
        "GitHub workflow vroeg vastleggen",
        "Sprintplanning met vaste doelen",
        "Eén aanpak kiezen (OData of fetch)",
        "Meer testen implementeren",
      ]
    },
  ];

  kolommen.forEach(({ titel, kleur, bgLight, items }, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.72, w: 2.9, h: 3.65,
      fill: { color: bgLight }, line: { color: "E8E8E8" }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.72, w: 2.9, h: 0.04,
      fill: { color: kleur }, line: { color: kleur }
    });
    s.addText(titel, {
      x: x + 0.15, y: 1.82, w: 2.6, h: 0.38,
      fontSize: 14, bold: true, color: kleur,
      fontFace: "Calibri", margin: 0
    });
    items.forEach((item, j) => {
      s.addText("—  " + item, {
        x: x + 0.15, y: 2.28 + j * 0.6, w: 2.6, h: 0.52,
        fontSize: 11, color: INK, fontFace: "Calibri", valign: "middle", margin: 0
      });
    });
  });

  s.addNotes("We zijn trots op het eindresultaat. De setup issues hebben ons tijd gekost maar geleerd om meteen lokaal te werken. Naar de toekomst: consistentere code en GitHub workflow eerder vastleggen.");
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 15 — BEDANKT
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.55, h: 5.625,
    fill: { color: BLUE }, line: { color: BLUE }
  });

  s.addText("Bedankt.", {
    x: 0.85, y: 1.0, w: 8, h: 1.5,
    fontSize: 80, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0
  });

  s.addText("Hebben jullie nog vragen?", {
    x: 0.85, y: 2.7, w: 7, h: 0.5,
    fontSize: 20, color: "8899AA", fontFace: "Calibri", margin: 0
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.85, y: 3.38, w: 6.5, h: 0.03,
    fill: { color: "2A3A4A" }, line: { color: "2A3A4A" }
  });

  const team = [
    { naam: "Aiché Camara",  rol: "Login · Feedback · CSS" },
    { naam: "Denzl De Mey",  rol: "Event Details · Sessies" },
    { naam: "Danick Tchang", rol: "Database · Admin · Events" },
  ];
  team.forEach(({ naam, rol }, i) => {
    s.addText(naam, {
      x: 0.85, y: 3.6 + i * 0.58, w: 4.5, h: 0.3,
      fontSize: 14, bold: true, color: WHITE, fontFace: "Calibri", margin: 0
    });
    s.addText(rol, {
      x: 0.85, y: 3.9 + i * 0.58, w: 4.5, h: 0.22,
      fontSize: 10, color: "8899AA", fontFace: "Calibri", margin: 0
    });
  });

  s.addText("Flexso  ·  EventSphere  ·  2025", {
    x: 6, y: 5.15, w: 3.8, h: 0.3,
    fontSize: 11, color: "334455", fontFace: "Calibri", align: "right", margin: 0
  });
}

// ── OPSLAAN ─────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "C:/Users/aiche/OneDrive/Desktop/EventSphere_Eindverdediging_v3.pptx" })
  .then(() => console.log("Klaar! Presentatie staat op de Desktop."))
  .catch(err => console.error("Fout:", err));
