// =========================================================
// BANCO MAESTRO DE RETOS VIRALES & ACERTIJOS - LA PROFE ROCHI
// Formato estilo Meme / Facebook / TikTok / Reels con opciones A, B, C, D
// =========================================================

const CHALLENGES_DATA = [
  {
    id: "triangular_park",
    title: "El Parque Triangular",
    category: "Matemáticas",
    headerWhite: "Cuando te preguntan algo de",
    headerHighlight: "matemáticas",
    question: "En un parque triangular hay 3 árboles en cada lado y 1 en cada esquina. ¿Cuántos árboles hay en total?",
    options: [
      { key: "A", text: "6" },
      { key: "B", text: "7" },
      { key: "C", text: "9" },
      { key: "D", text: "12" }
    ],
    correct: "A",
    explanation: "Los árboles de las 3 esquinas se comparten entre dos lados a la vez. Cada lado tiene 2 esquinas más 1 árbol en el centro (total 3 por lado). En total son: 3 esquinas + 3 intermedios = ¡6 árboles!",
    videoSteps: [
      {
        speech: "¡A ver si eres capaz de resolver este reto de lógica matemática! Presta mucha atención a la pizarra.",
        action: "write",
        text: "PARQUE TRIANGULAR",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "En un parque triangular hay 3 árboles en cada lado y 1 en cada esquina. ¿Cuántos árboles hay en total? A: 6, B: 7, C: 9 o D: 12. ¡Pausa o comenta tu respuesta ya!",
        action: "write",
        text: "3 árboles por lado | 1 en esquina: ¿Total?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Tiempo! La respuesta correcta es la A, 6 árboles. Porque los árboles de las esquinas pertenecen a dos lados a la vez. ¡Comenta si acertaste!",
        action: "highlight",
        text: "✅ RESPUESTA: A) 6 ÁRBOLES (3 esquinas + 3 medios)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "five_machines",
    title: "Las 5 Máquinas",
    category: "Lógica",
    headerWhite: "El 95% falla en esta pregunta de",
    headerHighlight: "lógica mental",
    question: "Si 5 máquinas tardan 5 minutos en hacer 5 artículos, ¿cuánto tardan 100 máquinas en hacer 100 artículos?",
    options: [
      { key: "A", text: "100 minutos" },
      { key: "B", text: "50 minutos" },
      { key: "C", text: "5 minutos" },
      { key: "D", text: "1 minuto" }
    ],
    correct: "C",
    explanation: "Cada máquina tarda 5 minutos en fabricar 1 artículo de forma independiente. Si pones 100 máquinas a trabajar al mismo tiempo, ¡en 5 minutos tendrán listos los 100 artículos!",
    videoSteps: [
      {
        speech: "¡Cuidado con la trampa! El noventa y cinco por ciento responde mal a este famoso dilema mental.",
        action: "write",
        text: "RETO DE LAS MÁQUINAS",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Si 5 máquinas hacen 5 artículos en 5 minutos... ¿cuánto tardan 100 máquinas en hacer 100 artículos? ¿100 minutos, 50, 5 o 1 minuto? ¡Piénsalo bien!",
        action: "write",
        text: "5 máq = 5 art en 5 min ➔ 100 máq = 100 art: ¿?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡La respuesta es la C, 5 minutos! Cada máquina tarda 5 minutos en hacer un artículo. ¡Comparte el video a ver si tus amigos caen!",
        action: "highlight",
        text: "✅ RESPUESTA: C) 5 MINUTOS (Trabajan en paralelo)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "bat_and_ball",
    title: "El Bate y la Pelota",
    category: "Matemáticas",
    headerWhite: "Parece muy fácil pero engaña en",
    headerHighlight: "matemáticas",
    question: "Un bate y una pelota cuestan $1.10 en total. El bate cuesta $1.00 más que la pelota. ¿Cuánto cuesta la pelota?",
    options: [
      { key: "A", text: "$0.10" },
      { key: "B", text: "$0.05" },
      { key: "C", text: "$0.01" },
      { key: "D", text: "$0.15" }
    ],
    correct: "B",
    explanation: "Si la pelota costara $0.10 y el bate $1.00 más ($1.10), el total sería $1.20. La pelota cuesta $0.05 y el bate $1.05, sumando exactamente $1.10.",
    videoSteps: [
      {
        speech: "¡Tu cerebro querrá decir la opción A al instante! Pero no te dejes engañar por la intuición.",
        action: "write",
        text: "BATE Y PELOTA: $1.10",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Un bate y una pelota cuestan un dólar con diez. El bate cuesta un dólar más que la pelota. ¿Cuánto cuesta la pelota? ¿Diez centavos o cinco centavos?",
        action: "write",
        text: "Bate + Pelota = $1.10 | Bate = Pelota + $1.00",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡La solución correcta es la B, 5 centavos! El bate cuesta 1.05 y la pelota 0.05. ¡Comenta si tu primer pensamiento fue 10 centavos!",
        action: "highlight",
        text: "✅ RESPUESTA: B) $0.05 (Bate $1.05 + Pelota $0.05)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "aquarium_fishes",
    title: "Peces en el Acuario",
    category: "Acertijos",
    headerWhite: "Pon a prueba tu sentido común y",
    headerHighlight: "pensamiento lateral",
    question: "En un acuario hay 10 peces. 2 se ahogaron, 4 nadaron lejos y 3 murieron. ¿Cuántos peces quedan en el acuario?",
    options: [
      { key: "A", text: "1 pez" },
      { key: "B", text: "4 peces" },
      { key: "C", text: "10 peces" },
      { key: "D", text: "3 peces" }
    ],
    correct: "C",
    explanation: "¡Los peces viven en el agua y no pueden ahogarse! Además, dentro de una pecera cerrada ninguno puede nadar lejos. Y aunque mueran, ¡siguen estando dentro del acuario!",
    videoSteps: [
      {
        speech: "¡Acertijo viral! Este reto parece de matemáticas básicas, pero en realidad es de lógica pura.",
        action: "write",
        text: "LOS 10 PECES DEL ACUARIO",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "En un acuario hay 10 peces: 2 se ahogan, 4 nadan lejos y 3 mueren. ¿Cuántos peces quedan en el acuario? A: 1, B: 4, C: 10 o D: 3.",
        action: "write",
        text: "10 peces: 2 se ahogan, 4 nadan, 3 mueren: ¿Quedan?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Quedan los 10 peces, opción C! Los peces no se ahogan, de una pecera no pueden huir, y si mueren siguen adentro. ¡Comenta si caíste!",
        action: "highlight",
        text: "✅ RESPUESTA: C) 10 PECES (¡No se ahogan ni escapan!)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "order_operations",
    title: "El Dilema Matemático",
    category: "Matemáticas",
    headerWhite: "La operación viral que divide las",
    headerHighlight: "redes sociales",
    question: "¿Cuál es el resultado correcto de: 6 ÷ 2(1 + 2)? ¡El 90% de internet se equivoca!",
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "6" },
      { key: "C", text: "9" },
      { key: "D", text: "12" }
    ],
    correct: "C",
    explanation: "Por jerarquía de operaciones: primero el paréntesis (1+2)=3. Queda 6 ÷ 2 × 3. Al tener misma jerarquía la división y multiplicación, se resuelven de izquierda a derecha: 6 ÷ 2 = 3, y luego 3 × 3 = 9.",
    videoSteps: [
      {
        speech: "¡Esta sencilla operación divide a millones de personas en internet todos los años! Resolvámosla con reglas oficiales.",
        action: "write",
        text: "OPERACIÓN: 6 ÷ 2(1 + 2)",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "¿Cuánto es seis entre dos, factor de uno más dos? ¿Da uno, da seis, o da nueve? ¡Deja tu respuesta en el chat antes de que lo resuelva!",
        action: "write",
        text: "6 ÷ 2(1 + 2) = ¿1 o 9?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡El resultado oficial es 9, opción C! 1 más 2 son 3. Luego de izquierda a derecha: 6 entre 2 da 3, y 3 por 3 da 9. ¡Guarda este video!",
        action: "highlight",
        text: "✅ RESPUESTA: C) 9 ➔ (6 ÷ 2 = 3) × 3 = 9",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "spelling_haya_halla",
    title: "Ortografía: ¿Haya, Halla o Aya?",
    category: "Ortografía",
    headerWhite: "¿Cuál es la forma correcta según la",
    headerHighlight: "RAE oficial?",
    question: "Completa la frase: 'Espero que él _____ terminado todo el trabajo a tiempo'.",
    options: [
      { key: "A", text: "haya" },
      { key: "B", text: "halla" },
      { key: "C", text: "aya" },
      { key: "D", text: "allá" }
    ],
    correct: "A",
    explanation: "'Haya' (con y) es del verbo HABER. 'Halla' (con ll) es del verbo HALLAR (encontrar). 'Aya' es una niñera, y 'Allá' es adverbio de lugar con tilde.",
    videoSteps: [
      {
        speech: "¡Duda ortográfica mortal! Muchísima gente confunde estas tres palabras al escribir.",
        action: "write",
        text: "¿HAYA, HALLA o AYA?",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Completa la frase: 'Espero que él _____ terminado el trabajo'. ¿Se escribe con Y griega, con doble L o con tilde? ¡Comenta tu opción!",
        action: "write",
        text: "Espero que él _____ terminado: ¿A, B, C o D?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Se escribe HAYA con Y griega, opción A! Porque viene del verbo haber. Halla con doble L es de encontrar. ¡Aprende ortografía con La Profe Rochi!",
        action: "highlight",
        text: "✅ RESPUESTA: A) HAYA (del verbo HABER)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "months_28_days",
    title: "Los Meses del Año",
    category: "Acertijos",
    headerWhite: "Un acertijo clásico para entrenar la",
    headerHighlight: "atención rápida",
    question: "¿Cuántos meses del año tienen 28 días? ¡Lee con cuidado antes de marcar!",
    options: [
      { key: "A", text: "Solo 1 mes" },
      { key: "B", text: "Solo los bisiestos" },
      { key: "C", text: "Los 12 meses" },
      { key: "D", text: "Ningún mes" }
    ],
    correct: "C",
    explanation: "¡Los 12 meses del año tienen al menos 28 días! Febrero tiene 28 (o 29 en bisiestos), y todos los demás tienen 30 o 31 días (lo que incluye 28 días).",
    videoSteps: [
      {
        speech: "¡Pon a prueba tu agilidad mental con este acertijo clásico de calendario!",
        action: "write",
        text: "MESES CON 28 DÍAS",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "¿Cuántos meses del año tienen 28 días? ¿Solo febrero, solo en años bisiestos o los doce meses? ¡Respóndeme en los comentarios!",
        action: "write",
        text: "¿Cuántos meses tienen 28 días?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡La respuesta es la C, los 12 meses! Todos los meses tienen 28 días, aunque algunos tienen más. ¡Comenta si respondiste solo febrero!",
        action: "highlight",
        text: "✅ RESPUESTA: C) LOS 12 MESES (¡Todos tienen 28 o más!)",
        target: "result",
        camera: "board"
      }
    ]
  },
  {
    id: "race_position",
    title: "La Carrera",
    category: "Lógica",
    headerWhite: "Solo personas atentas resuelven este",
    headerHighlight: "acertijo de lógica",
    question: "Estás en una carrera y adelantas a la persona que va en segundo lugar. ¿En qué posición quedas?",
    options: [
      { key: "A", text: "1.er lugar" },
      { key: "B", text: "2.° lugar" },
      { key: "C", text: "3.er lugar" },
      { key: "D", text: "Depende" }
    ],
    correct: "B",
    explanation: "Al adelantar a quien va en segundo lugar, tú tomas su puesto, por lo que quedas en el segundo lugar. ¡El que iba de primero sigue en primer lugar!",
    videoSteps: [
      {
        speech: "¡Imagina esta situación de carrera! Responde rápido sin pensarlo dos veces.",
        action: "write",
        text: "¿EN QUÉ LUGAR QUEDAS?",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Estás corriendo y adelantas a quien va en segundo lugar. ¿Quedas en primer lugar o en segundo lugar? ¡Comenta tu respuesta!",
        action: "write",
        text: "Adelantas al 2.° lugar ➔ ¿En qué posición quedas?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Quedas en segundo lugar, opción B! Porque tomaste su puesto, no el del primero. ¡Dale like si te gustó el reto!",
        action: "highlight",
        text: "✅ RESPUESTA: B) 2.° LUGAR (¡El 1.° sigue adelante!)",
        target: "result",
        camera: "board"
      }
    ]
  }
];

if (typeof window !== "undefined") {
  window.CHALLENGES_DATA = CHALLENGES_DATA;
}
