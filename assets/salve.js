/* ============================================================
   SALVE · lógica de todas las páginas
   1) Cuenta regresiva a Navidad   2) Candado por fecha
   3) Sorpresas: petición, video, ruleta, memoria, quiz
   Los textos editables están en la sección CONTENIDO (más abajo).
   Para probar otra fecha: añade ?hoy=2026-12-20 al final del enlace.
   ============================================================ */

/* ---------- CONTENIDO EDITABLE ---------- */
var GESTOS = [
  "Escríbele hoy a alguien con quien hace tiempo no hablas.",
  "Da un abrazo largo, sin prisa.",
  "Reza en voz baja por una persona, diciendo su nombre.",
  "Dile a alguien algo que admiras de esa persona.",
  "Prepara o compra algo rico para compartir.",
  "Perdona algo pequeño que traías guardado.",
  "Haz una visita corta a alguien que esté solo.",
  "Dale las gracias a alguien a quien casi nunca se las dan."
];

var PERSONAJES = {
  maria:  { nombre: "María",       texto: "Serena y confiada. Guardas todo en el corazón y dices que sí aun sin entenderlo todo." },
  jose:   { nombre: "José",        texto: "Firme y discreto. Cuidas a los tuyos sin pedir aplausos." },
  pastor: { nombre: "un pastor",   texto: "Sencillo y alegre. Cuando encuentras algo bueno, sales corriendo a compartirlo." },
  mago:   { nombre: "un rey mago", texto: "Constante y generoso. Sigues tu estrella y llegas con lo mejor que tienes." },
  angel:  { nombre: "un ángel",    texto: "Portador de esperanza. Tu presencia anima a otros a no tener miedo." }
};

var PREGUNTAS = [
  { p: "Es Nochebuena y llegan visitas sin avisar. ¿Qué haces?", o: [
    ["maria",  "Les abro la puerta y guardo el momento en el corazón"],
    ["jose",   "Busco dónde acomodar a todos, sin hacer ruido"],
    ["pastor", "Salgo corriendo a contarle a todo el mundo"],
    ["mago",   "Ya les tengo un regalo bien pensado"],
    ["angel",  "Les doy la buena noticia con alegría"] ] },
  { p: "¿En qué te reconocen tus amigos?", o: [
    ["maria",  "En escuchar y guardar silencio cuando toca"],
    ["jose",   "En cumplir siempre lo que prometo"],
    ["pastor", "En mi sencillez y mi alegría"],
    ["mago",   "En mi paciencia para seguir un sueño largo"],
    ["angel",  "En dar ánimo cuando todos dudan"] ] },
  { p: "Un plan perfecto de diciembre:", o: [
    ["maria",  "Un rato de oración y una taza caliente"],
    ["jose",   "Arreglar la casa y dejarla lista para recibir"],
    ["pastor", "Reunir a todos, cantar y comer rico"],
    ["mago",   "Un viaje o un plan especial, con detalle"],
    ["angel",  "Sorprender a alguien con un mensaje bonito"] ] },
  { p: "Cuando no entiendes lo que pasa, tú…", o: [
    ["maria",  "Confío y digo: que se haga"],
    ["jose",   "Actúo con calma y busco la solución"],
    ["pastor", "Me pongo en camino aunque no lo sepa todo"],
    ["mago",   "Sigo la estrella hasta entenderlo"],
    ["angel",  "Recuerdo que no hay que temer"] ] },
  { p: "¿Qué regalo te define?", o: [
    ["maria",  "Un abrazo que lo dice todo"],
    ["jose",   "Un favor hecho en silencio"],
    ["pastor", "Una canción cantada con ganas"],
    ["mago",   "Algo valioso, escogido con cariño"],
    ["angel",  "Una palabra que levanta el ánimo"] ] }
];

/* ---------- FECHAS (siempre hora de Colombia) ---------- */
var TZ = "America/Bogota";
var NAVIDAD = "2026-12-25";
function hoyISO() {
  var q = new URLSearchParams(location.search).get("hoy");
  if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) return q;       // para probar
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}
function dias(a, b) {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);
}
function plural(n, s, p) { return n + " " + (n === 1 ? s : p); }

/* ---------- CANDADO (se ejecuta antes de pintar la página) ---------- */
(function () {
  var fecha = document.documentElement.dataset.fecha;
  if (fecha && dias(hoyISO(), fecha) > 0) document.documentElement.classList.add("bloqueado");
})();

document.addEventListener("DOMContentLoaded", function () {
  var hoy = hoyISO();

  /* Cuenta regresiva a Navidad */
  var c = document.getElementById("cuenta");
  if (c) {
    var n = dias(hoy, NAVIDAD);
    if (n > 1) c.textContent = "Faltan " + n + " días para Navidad";
    else if (n === 1) c.textContent = "Mañana es Navidad";
    else if (n === 0) c.textContent = "¡Hoy es Navidad!";
    else c.style.display = "none";
  }

  /* Texto del candado */
  var f = document.getElementById("faltan");
  var fecha = document.documentElement.dataset.fecha;
  if (f && fecha) {
    var k = dias(hoy, fecha);
    f.textContent = k > 0 ? (k === 1 ? "Se abre mañana." : "Se abre en " + k + " días.") : "";
  }

  /* Sorpresas */
  var mods = { peticion: peticion, video: video, ruleta: ruleta, memoria: memoria, quiz: quiz };
  document.querySelectorAll("[data-modulo]").forEach(function (el) {
    var fn = mods[el.dataset.modulo]; if (fn) fn(el);
  });
});

/* ---------- utilidades ---------- */
function h(tag, cls, txt) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

/* ---------- PETICIÓN (se envía por WhatsApp) ---------- */
function peticion(root) {
  var tel = root.dataset.whatsapp;
  var nombre = h("input"); nombre.type = "text"; nombre.placeholder = "Tu nombre (opcional)"; nombre.className = "campo";
  nombre.setAttribute("aria-label", "Tu nombre");
  var ta = h("textarea", "campo"); ta.rows = 5; ta.placeholder = "Escribe tu petición…";
  ta.setAttribute("aria-label", "Tu petición");
  var btn = h("button", "boton", "Enviar mi petición por WhatsApp"); btn.type = "button";
  var aviso = h("p", "alternativo");
  root.append(nombre, ta, btn, aviso);
  if (!tel) { btn.disabled = true; aviso.className = "pendiente"; aviso.textContent = "[Falta poner el número de WhatsApp de Salve]"; }
  btn.addEventListener("click", function () {
    var t = ta.value.trim();
    if (!t) { aviso.textContent = "Escribe primero tu petición."; ta.focus(); return; }
    var msg = "Hola Salve 🙏 Mi petición" + (nombre.value.trim() ? " (" + nombre.value.trim() + ")" : "") + ":\n" + t;
    window.open("https://wa.me/" + tel + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });
}

/* ---------- VIDEO ---------- */
function video(root) {
  var id = root.dataset.youtube;
  if (id) {
    var i = h("iframe"); i.src = "https://www.youtube-nocookie.com/embed/" + id;
    i.title = "Saludo de Salve"; i.allowFullscreen = true; i.loading = "lazy";
    i.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture");
    root.className += " video"; root.appendChild(i);
  } else {
    root.appendChild(h("div", "pendiente", "[Aquí irá el video de saludo de ustedes dos]"));
  }
}

/* ---------- RULETA ---------- */
function ruleta(root) {
  var NS = "http://www.w3.org/2000/svg", N = GESTOS.length, R = 140, C = 150;
  var colores = ["#5f7052", "#c9a27e", "#8a9a7b", "#e7d6c3"];
  function pt(a, r) { var t = a * Math.PI / 180; return [C + r * Math.sin(t), C - r * Math.cos(t)]; }
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 300 320"); svg.setAttribute("class", "ruleta"); svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Ruleta de pequeños gestos");
  var g = document.createElementNS(NS, "g"); g.setAttribute("class", "ruleta-giro");
  g.style.transformOrigin = C + "px " + C + "px";
  for (var i = 0; i < N; i++) {
    var a0 = i * 360 / N, a1 = (i + 1) * 360 / N, p0 = pt(a0, R), p1 = pt(a1, R);
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M" + C + " " + C + " L" + p0 + " A" + R + " " + R + " 0 0 1 " + p1 + " Z");
    path.setAttribute("fill", colores[i % colores.length]); path.setAttribute("stroke", "#fbf6f0"); path.setAttribute("stroke-width", "3");
    g.appendChild(path);
    var tp = pt((a0 + a1) / 2, 98), t = document.createElementNS(NS, "text");
    t.setAttribute("x", tp[0]); t.setAttribute("y", tp[1]); t.setAttribute("text-anchor", "middle");
    t.setAttribute("dominant-baseline", "central"); t.setAttribute("class", "ruleta-num");
    t.setAttribute("fill", (i % 4 === 3) ? "#3f4a36" : "#fff"); t.textContent = String(i + 1);
    g.appendChild(t);
  }
  svg.appendChild(g);
  var hub = document.createElementNS(NS, "circle");
  hub.setAttribute("cx", C); hub.setAttribute("cy", C); hub.setAttribute("r", "14"); hub.setAttribute("fill", "#fbf6f0"); hub.setAttribute("stroke", "#c9a27e"); hub.setAttribute("stroke-width", "3");
  svg.appendChild(hub);
  var flecha = document.createElementNS(NS, "path");
  flecha.setAttribute("d", "M150 14 L138 -6 L162 -6 Z"); flecha.setAttribute("fill", "#3f4a36");
  flecha.setAttribute("transform", "translate(0 18)");
  svg.appendChild(flecha);

  var btn = h("button", "boton", "Girar la ruleta"); btn.type = "button";
  var res = h("p", "resultado"); res.setAttribute("aria-live", "polite");
  root.append(svg, btn, res);

  var rot = 0, girando = false;
  btn.addEventListener("click", function () {
    if (girando) return; girando = true; btn.disabled = true; res.textContent = "";
    var idx = Math.floor(Math.random() * N), centro = (idx + 0.5) * 360 / N;
    rot = (Math.floor(rot / 360) + 6) * 360 - centro;
    g.style.transform = "rotate(" + rot + "deg)";
    setTimeout(function () {
      res.textContent = (idx + 1) + ". " + GESTOS[idx];
      girando = false; btn.disabled = false; btn.textContent = "Girar otra vez";
    }, 4100);
  });
}

/* ---------- MEMORIA ---------- */
function memoria(root) {
  var emojis = ["⭐", "🎄", "🕯️", "🔔", "🎁", "🕊️"];
  var barajado = emojis.concat(emojis).sort(function () { return Math.random() - 0.5; });
  var tablero = h("div", "memoria"), info = h("p", "resultado"), reiniciar = h("button", "boton", "Jugar de nuevo");
  reiniciar.type = "button"; reiniciar.hidden = true;
  info.setAttribute("aria-live", "polite");
  root.append(tablero, info, reiniciar);
  var abiertas = [], movs = 0, pares = 0, bloqueo = false;
  barajado.forEach(function (e, i) {
    var b = h("button", "carta-juego"); b.type = "button"; b.setAttribute("aria-label", "Carta " + (i + 1));
    var cara = h("span", "cara", e), dorso = h("span", "dorso", "✦");
    b.append(dorso, cara); b.dataset.e = e;
    b.addEventListener("click", function () {
      if (bloqueo || b.classList.contains("volteada") || b.classList.contains("par")) return;
      b.classList.add("volteada"); abiertas.push(b);
      if (abiertas.length === 2) {
        movs++; bloqueo = true;
        var a = abiertas[0], c = abiertas[1];
        if (a.dataset.e === c.dataset.e) {
          a.classList.add("par"); c.classList.add("par"); pares++; abiertas = []; bloqueo = false;
          if (pares === emojis.length) { info.textContent = "¡Lo lograste en " + movs + " movimientos!"; reiniciar.hidden = false; }
        } else {
          setTimeout(function () { a.classList.remove("volteada"); c.classList.remove("volteada"); abiertas = []; bloqueo = false; }, 800);
        }
        if (pares < emojis.length) info.textContent = "Movimientos: " + movs;
      }
    });
    tablero.appendChild(b);
  });
  reiniciar.addEventListener("click", function () { root.innerHTML = ""; memoria(root); });
}

/* ---------- QUIZ: ¿qué personaje del pesebre eres? ---------- */
function quiz(root) {
  var puntos = { maria: 0, jose: 0, pastor: 0, mago: 0, angel: 0 }, i = 0;
  function pintar() {
    root.innerHTML = "";
    if (i >= PREGUNTAS.length) return resultado();
    var q = PREGUNTAS[i];
    root.appendChild(h("p", "progreso", "Pregunta " + (i + 1) + " de " + PREGUNTAS.length));
    root.appendChild(h("p", "pregunta", q.p));
    q.o.forEach(function (op) {
      var b = h("button", "opcion", op[1]); b.type = "button";
      b.addEventListener("click", function () { puntos[op[0]]++; i++; pintar(); });
      root.appendChild(b);
    });
  }
  function resultado() {
    var mejor = "maria";
    Object.keys(puntos).forEach(function (k) { if (puntos[k] > puntos[mejor]) mejor = k; });
    var p = PERSONAJES[mejor];
    root.appendChild(h("p", "progreso", "Tu resultado"));
    root.appendChild(h("p", "pregunta", "Eres " + p.nombre));
    root.appendChild(h("p", null, p.texto));
    var compartir = h("a", "boton", "Compartir mi resultado");
    compartir.href = "https://wa.me/?text=" + encodeURIComponent("En el pesebre de Salve soy " + p.nombre + " ✨ " + p.texto);
    compartir.target = "_blank"; compartir.rel = "noopener";
    var otra = h("button", "opcion", "Volver a empezar"); otra.type = "button";
    otra.addEventListener("click", function () { i = 0; Object.keys(puntos).forEach(function (k) { puntos[k] = 0; }); pintar(); });
    root.append(compartir, otra);
  }
  pintar();
}
