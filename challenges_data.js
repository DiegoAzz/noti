/**
 * BANCO DE RETOS VIRALES & ACERTIJOS - LA PROFE ROCHI
 * Formato diseñado para máxima interacción en redes sociales (TikTok, Reels, Shorts y Facebook).
 * ESTRATEGIA VIRAL: NUNCA REVELAR LA RESPUESTA EN EL VIDEO NI EN EL POST.
 * La audiencia debe quedar pensando y debatiendo en los comentarios cuál es la opción correcta (A, B, C o D).
 */

const CHALLENGES_DATA = [
  {
    id: "triangular_park",
    title: "Parque Triangular",
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
    ctaSpeech: "¡Cuidado que tiene trampa! ¿Tú cuál dices que es la respuesta correcta? ¿A, B, C o D? ¡Déjamela en los comentarios y dime por qué!",
    ctaText: "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡DÉJALA EN LOS COMENTARIOS!",
    videoSteps: [
      {
        speech: "¡A ver si eres capaz de resolver este reto de lógica matemática! Presta mucha atención a la pizarra.",
        action: "write",
        text: "PARQUE TRIANGULAR",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "En un parque triangular hay 3 árboles en cada lado y 1 en cada esquina. ¿Cuántos árboles hay en total? A: 6, B: 7, C: 9 o D: 12.",
        action: "write",
        text: "3 árboles por lado | 1 en esquina: ¿Total?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Cuidado que tiene trampa! ¿Tú cuál dices que es la respuesta correcta? ¿A, B, C o D? ¡Déjamela en los comentarios y dime por qué, los leo a todos!",
        action: "highlight",
        text: "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡DÉJALA EN LOS COMENTARIOS!",
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
    ctaSpeech: "¡El noventa y cinco por ciento responde mal! ¿Tú qué opinas? ¿A, B, C o D? ¡Escríbela en los comentarios y reta a tus amigos!",
    ctaText: "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡COMENTA Y COMPARTE!",
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
        speech: "¡El noventa y cinco por ciento responde mal! ¿Tú qué opinas? ¿A, B, C o D? ¡Escríbela en los comentarios y reta a tus amigos!",
        action: "highlight",
        text: "¿CUÁL ES LA CORRECTA?\n🤔 A, B, C o D\n👇 ¡COMENTA Y COMPARTE!",
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
    ctaSpeech: "¡No te dejes engañar por la intuición rápida! ¿Cuál es el precio exacto de la pelota? ¿A, B, C o D? ¡Déjame tu cálculo en los comentarios!",
    ctaText: "¿CUÁL ES EL PRECIO?\n🤔 A, B, C o D\n👇 ¡DEJA TU RESPUESTA!",
    videoSteps: [
      {
        speech: "¡Tu cerebro querrá decir la primera opción al instante! Pero no te dejes engañar por la intuición rápida.",
        action: "write",
        text: "BATE Y PELOTA: $1.10",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Un bate y una pelota cuestan un dólar con diez en total. El bate cuesta un dólar más que la pelota. ¿Cuánto cuesta la pelota? A: diez centavos, B: cinco centavos, C: un centavo o D: quince centavos.",
        action: "write",
        text: "Bate + Pelota = $1.10 | Bate = Pelota + $1.00",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Muchísimos se equivocan al calcular! ¿Tú cuál crees que es? ¿A, B, C o D? ¡Escribe tu respuesta en los comentarios y dime por qué!",
        action: "highlight",
        text: "¿CUÁL ES EL PRECIO?\n🤔 A, B, C o D\n👇 ¡DEJA TU RESPUESTA!",
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
    ctaSpeech: "¡Piénsalo muy bien antes de responder! ¿Cuántos peces quedan realmente en el acuario? ¿A, B, C o D? ¡Coméntalo ya!",
    ctaText: "¿CUÁNTOS PECES QUEDAN?\n🤔 A, B, C o D\n👇 ¡DÉJALO EN COMENTARIOS!",
    videoSteps: [
      {
        speech: "¡Acertijo viral! Este reto parece de matemáticas básicas, pero en realidad es de sentido común y lógica pura.",
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
        speech: "¡Piénsalo muy bien y no caigas en la trampa! ¿Cuántos peces quedan en el acuario? ¿A, B, C o D? ¡Déjame tu respuesta en los comentarios!",
        action: "highlight",
        text: "¿CUÁNTOS PECES QUEDAN?\n🤔 A, B, C o D\n👇 ¡DÉJALO EN COMENTARIOS!",
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
    ctaSpeech: "¡Esta operación divide a todo internet! ¿Tú dices que da uno o que da nueve? ¿Cuál es tu respuesta final? ¡Coméntala y defiéndela!",
    ctaText: "¿CUÁL ES EL RESULTADO?\n🤔 A, B, C o D\n👇 ¡DEFIENDE TU RESPUESTA!",
    videoSteps: [
      {
        speech: "¡Esta sencilla operación divide a millones de personas en internet todos los años! Resolvámosla con reglas oficiales.",
        action: "write",
        text: "OPERACIÓN: 6 ÷ 2(1 + 2)",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "¿Cuánto es seis entre dos, factor de uno más dos? ¿A: 1, B: 6, C: 9 o D: 12? ¡Presta atención al orden de las operaciones!",
        action: "write",
        text: "6 ÷ 2(1 + 2) = ¿1 o 9?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Esta operación divide a todo internet! ¿Tú dices que da uno o que da nueve? ¿Cuál es tu respuesta final? ¡Coméntala y defiéndela en los comentarios!",
        action: "highlight",
        text: "¿CUÁL ES EL RESULTADO?\n🤔 A, B, C o D\n👇 ¡DEFIENDE TU RESPUESTA!",
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
    ctaSpeech: "¡Muchos caen en este error ortográfico! ¿Cuál es la opción correcta para completar la frase? ¿A, B, C o D? ¡Escríbela en los comentarios!",
    ctaText: "¿CÓMO SE ESCRIBE?\n🤔 A, B, C o D\n👇 ¡ESCRÍBELO EN COMENTARIOS!",
    videoSteps: [
      {
        speech: "¡Duda ortográfica mortal! Muchísima gente confunde estas tres palabras al redactar.",
        action: "write",
        text: "¿HAYA, HALLA o AYA?",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Completa la frase: 'Espero que él _____ terminado el trabajo'. ¿A: haya con Y, B: halla con doble L, C: aya, o D: allá con tilde? ¡Piénsalo bien!",
        action: "write",
        text: "Espero que él _____ terminado: ¿A, B, C o D?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Muchos caen en este error ortográfico! ¿Cuál es la opción correcta según la Real Academia Española? ¿A, B, C o D? ¡Escríbela en los comentarios!",
        action: "highlight",
        text: "¿CÓMO SE ESCRIBE?\n🤔 A, B, C o D\n👇 ¡ESCRÍBELO EN COMENTARIOS!",
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
    ctaSpeech: "¡Lee muy bien la pregunta y no caigas en la trampa! ¿Cuántos meses tienen 28 días? ¿A, B, C o D? ¡Coméntalo ya!",
    ctaText: "¿CUÁNTOS MESES SON?\n🤔 A, B, C o D\n👇 ¡COMENTA TU OPCIÓN!",
    videoSteps: [
      {
        speech: "¡Pon a prueba tu agilidad mental con este acertijo clásico de calendario!",
        action: "write",
        text: "MESES CON 28 DÍAS",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "¿Cuántos meses del año tienen 28 días? A: Solo un mes, B: Solo en años bisiestos, C: Los doce meses, o D: Ningún mes.",
        action: "write",
        text: "¿Cuántos meses tienen 28 días?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Lee muy bien la pregunta y no caigas en la trampa! ¿Cuántos meses tienen 28 días? ¿A, B, C o D? ¡Respóndeme en los comentarios y dime por qué!",
        action: "highlight",
        text: "¿CUÁNTOS MESES SON?\n🤔 A, B, C o D\n👇 ¡COMENTA TU OPCIÓN!",
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
    ctaSpeech: "¡Cuidado que parece obvia pero engaña a muchos! Si adelantas al segundo... ¿en qué lugar quedas? ¿A, B, C o D? ¡Coméntala ya!",
    ctaText: "¿EN QUÉ LUGAR QUEDAS?\n🤔 A, B, C o D\n👇 ¡DILO EN LOS COMENTARIOS!",
    videoSteps: [
      {
        speech: "¡Imagina esta situación de carrera! Responde rápido sin pensarlo dos veces.",
        action: "write",
        text: "¿EN QUÉ LUGAR QUEDAS?",
        target: "title",
        camera: "teacher"
      },
      {
        speech: "Estás corriendo en una carrera y adelantas a la persona que va en segundo lugar. ¿En qué posición quedas? A: primer lugar, B: segundo lugar, C: tercer lugar o D: depende.",
        action: "write",
        text: "Adelantas al 2.° lugar ➔ ¿En qué posición quedas?",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Cuidado que parece obvia pero engaña a muchísimas personas! Si adelantas al segundo... ¿en qué posición quedas? ¿A, B, C o D? ¡Dímelo en los comentarios!",
        action: "highlight",
        text: "¿EN QUÉ LUGAR QUEDAS?\n🤔 A, B, C o D\n👇 ¡DILO EN LOS COMENTARIOS!",
        target: "result",
        camera: "board"
      }
    ]
  }
];

if (typeof window !== "undefined") {
  window.CHALLENGES_DATA = CHALLENGES_DATA;
}
