let indiceActual = 0;
let aciertos = 0;
let preguntasSeleccionadas = [];

function iniciarExamen(bancoRecibido) {
    // 1. Mezclamos y agarramos 20 preguntas
    preguntasSeleccionadas = [...bancoRecibido].sort(() => Math.random() - 0.5).slice(0, 20);
    indiceActual = 0;
    aciertos = 0;
    mostrarPregunta();
}

function mostrarPregunta() {
    if (indiceActual >= preguntasSeleccionadas.length) {
        finalizarExamen();
        return;
    }

    const p = preguntasSeleccionadas[indiceActual];
    
    // Actualizar Textos
    document.getElementById("pregunta-texto").innerText = p.q;
    document.getElementById("contador").innerText = `Pregunta: ${indiceActual + 1} de ${preguntasSeleccionadas.length}`;

    const opcionesDiv = document.getElementById("opciones");
    opcionesDiv.innerHTML = "";

    // Mezclamos respuestas
    let mezcladas = p.a.map((texto, index) => ({ texto, index }));
    mezcladas.sort(() => Math.random() - 0.5);

    mezcladas.forEach(obj => {
        const btn = document.createElement("button");
        btn.innerText = obj.texto;
        btn.className = "opcion";
        btn.dataset.indiceReal = obj.index; 
        btn.onclick = () => verificar(obj.index, p.correct);
        opcionesDiv.appendChild(btn);
    });
}

function verificar(elegida, correcta) {
    const botones = document.querySelectorAll('.opcion');
    
    // Bloqueamos clics extras
    botones.forEach(btn => btn.style.pointerEvents = "none");

    const audioBien = document.getElementById("sonido-bien");
    const audioMal = document.getElementById("sonido-mal");

    if (elegida === correcta) {
        aciertos++;
        if (audioBien) audioBien.play();
    } else {
        if (audioMal) audioMal.play();
    }

    // Pintar colores (Verde el correcto, Rojo si falló)
    botones.forEach(btn => {
        const idx = parseInt(btn.dataset.indiceReal);
        if (idx === correcta) {
            btn.style.backgroundColor = "#27ae60"; // Verde
            btn.style.color = "white";
        } else if (idx === elegida && elegida !== correcta) {
            btn.style.backgroundColor = "#e74c3c"; // Rojo
            btn.style.color = "white";
        }
    });

    // Pausa pedagógica de 2 segundos antes de la siguiente
    setTimeout(() => {
        indiceActual++;
        mostrarPregunta();
    }, 2000); 
}

function finalizarExamen() {
    const porcentaje = (aciertos / preguntasSeleccionadas.length) * 100;
    const sonidoFinal = document.getElementById("sonido-final");
    
    if (porcentaje >= 60 && sonidoFinal) sonidoFinal.play();

    document.getElementById("contenedor-juego").innerHTML = `
        <div class="resultado-final" style="text-align:center; padding:20px;">
            <h2>Calificación: ${aciertos} de ${preguntasSeleccionadas.length}</h2>
            <p style="font-size: 20px; color: ${porcentaje >= 60 ? '#27ae60' : '#e74c3c'};">
                ${porcentaje >= 60 ? '¡Felicidades, Doctor! Excelente nivel.' : 'A seguir repasando los libros de Misch.'}
            </p>
            <hr>
            <div style="margin:20px 0; font-weight:bold; color:#2c3e50;">
                🎓 ACADEMIA DEL DR. CARLOS CORELLA
            </div>
            <button onclick="location.reload()" class="opcion" style="background:#2ecc71; color:white; padding:10px 20px; border:none; border-radius:5px; cursor:pointer;">Volver a intentar 🔄</button>
        </div>
    `;
}