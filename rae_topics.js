/**
 * BIBLIOTECA MAESTRA DE LECCIONES EDUCATIVAS: LA PROFE ROCHI Y RAE
 * Más de 60 temas estructurados listos para generar video y pizarra animada
 * Asignaturas: Matemáticas, Ciencias Naturales, Ciencias Sociales, Lengua Castellana, Inglés, Ética y Valores, y Ortografía RAE.
 */

const RAE_TOPICS = [

  // =========================================================
  // 📕 UN LIBRO LLENO DE ERRORES (LA PROFE ROCHI Y RAE)
  // Trucos y técnicas para hablar y escribir sin equivocarse
  // =========================================================
{
    "id": "haiga_haya",
    "category": "Un libro lleno de errores",
    "name": "¿Haiga o haya?",
    "icon": "📕",
    "summary": "Haiga solo si es un auto ostentoso según RAE; el verbo siempre es HAYA",
    "steps": [
      {
        "speech": "¡Hola! Hoy aprenderás por qué la palabra 'haiga' no existe como verbo en español.",
        "action": "write",
        "text": "¿HAIGA O HAYA?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "En el diccionario, 'haiga' solo se refiere a un automóvil muy grande y ostentoso de los años cincuenta.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Como forma del verbo haber, ¡la única palabra correcta y aceptada es HAYA!",
        "action": "write",
        "text": "HAIGA = AUTO ANTIGUO | ¡No es un verbo!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Por ejemplo: 'Espero que haya comida' o 'Ojalá haya tiempo para repasar'.",
        "action": "write",
        "text": "HAYA = VERBO HABER | 'Espero que haya comida'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Recuerda siempre: HAYA con H y con Y griega!",
        "action": "highlight",
        "text": "HAYA = VERBO HABER | ¡Siempre con Y griega!",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Alguna vez se te ha escapado un 'haiga'? ¡Déjamelo aquí en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "en_base_a",
    "category": "Un libro lleno de errores",
    "name": "¿En base a o con base en?",
    "icon": "📕",
    "summary": "'En base a' es incorrecto; se dice 'con base en' o 'a base de'",
    "steps": [
      {
        "speech": "¡Muchos redactan 'en base a' en el trabajo o la universidad, pero la RAE lo considera un error!",
        "action": "write",
        "text": "¿EN BASE A O CON BASE EN?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'En base a' es un calco del francés o italiano que debemos desterrar del español.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La forma correcta para justificar una decisión o informe es 'CON BASE EN'.",
        "action": "write",
        "text": "❌ EN BASE A | ¡Incorrecto!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "O si te refieres a componentes o ingredientes, usa 'A BASE DE': 'jarabe a base de miel'.",
        "action": "write",
        "text": "✅ CON BASE EN | O 'A BASE DE'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Ejemplo perfecto: 'Con base en los resultados, aprobamos el proyecto'.",
        "action": "highlight",
        "text": "Ej: 'Con base en la ley' | O 'A base de esfuerzo'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cómo lo decías tú? ¡Etiqueta a ese amigo que redacta informes todos los días!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "detras_de_mi",
    "category": "Un libro lleno de errores",
    "name": "¿Detrás de mí o detrás mío?",
    "icon": "📕",
    "summary": "Los adverbios no admiten posesivos: detrás de mí, delante de ti",
    "steps": [
      {
        "speech": "¡Atención! Nunca digas 'detrás mío', 'delante tuyo' ni 'encima suyo'.",
        "action": "write",
        "text": "¿DETRÁS DE MÍ O DETRÁS MÍO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los posesivos solo modifican a sustantivos: 'mi casa' o 'tu libro'. ¡Los adverbios de lugar no!",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Por eso, detrás, delante, encima y debajo deben ir acompañados de la preposición 'de' y el pronombre.",
        "action": "write",
        "text": "❌ DETRÁS MÍO | ¡Los adverbios no son posesivos!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Se dice: 'Detrás de mí', 'Delante de ti', 'Encima de él' y 'Cerca de nosotros'.",
        "action": "write",
        "text": "✅ DETRÁS DE MÍ | 'Ponte detrás de mí'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Grábate esta fórmula de oro para no volver a fallar!",
        "action": "highlight",
        "text": "delante de ti | encima de él | cerca de mí",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Repite con La Profe Rochi: detrás de mí! ¿Te sirvió el consejo? ¡Comenta!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "impreso_imprimido",
    "category": "Un libro lleno de errores",
    "name": "¿Impreso o imprimido?",
    "icon": "📕",
    "summary": "¡Ambos son correctos y aceptados por la RAE como participios!",
    "steps": [
      {
        "speech": "¿Te han corregido diciendo que 'imprimido' no existe? ¡Te engañaron!",
        "action": "write",
        "text": "¿IMPRESO O IMPRIMIDO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La Real Academia Española confirma que el verbo imprimir tiene dos participios válidos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'He impreso el documento' es totalmente correcto con el participio irregular.",
        "action": "write",
        "text": "✅ HE IMPRESO | Participio irregular",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Pero 'he imprimido el documento' con el participio regular también es 100% correcto!",
        "action": "write",
        "text": "✅ HE IMPRIMIDO | Participio regular RAE",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Como adjetivo se prefiere impreso: 'libro impreso'. Pero con haber, ¡ambos valen!",
        "action": "highlight",
        "text": "Ambos son correctos | 'He impreso o he imprimido'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál de los dos usas tú al hablar? ¡Déjamelo aquí abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "frito_freido",
    "category": "Un libro lleno de errores",
    "name": "¿Frito o freído?",
    "icon": "📕",
    "summary": "Ambos son participios válidos según la RAE: he frito y he freído",
    "steps": [
      {
        "speech": "¡Sí! El verbo freír también tiene dos participios perfectamente aceptados por la RAE.",
        "action": "write",
        "text": "¿FRITO O FREÍDO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "A muchos les suena raro freído, pero la gramática de la lengua española lo avala por completo.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Puedes decir: 'He frito unas papas para el almuerzo'.",
        "action": "write",
        "text": "✅ HE FRITO | 'He frito las papas'",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "O puedes decir con total validez: 'He freído un par de huevos en el sartén'.",
        "action": "write",
        "text": "✅ HE FREÍDO | 'He freído los huevos'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Eso sí: como adjetivo siempre decimos 'papas fritas', nunca 'papas freídas'!",
        "action": "highlight",
        "text": "Como adjetivo: papas fritas | ¡Ambos participios valen!",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Compártelo para que nadie te vuelva a corregir en la cocina! ¿Lo sabías?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "proveido_provisto",
    "category": "Un libro lleno de errores",
    "name": "¿Proveído o provisto?",
    "icon": "📕",
    "summary": "El verbo proveer acepta tanto provisto como proveído según la RAE",
    "steps": [
      {
        "speech": "Junto con imprimir y freír, el verbo proveer forma la famosa terna de doble participio.",
        "action": "write",
        "text": "¿PROVEÍDO O PROVISTO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Tanto la forma regular terminada en -ído como la irregular en -to son cultas y correctas.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'El juez ha proveído lo necesario' es de uso muy común en el ámbito jurídico.",
        "action": "write",
        "text": "✅ PROVEÍDO | 'Ha proveído los recursos'",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Y 'la empresa ha provisto los uniformes' es igualmente impecable.",
        "action": "write",
        "text": "✅ PROVISTO | 'Ha provisto de víveres'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Impreso e imprimido, frito y freído, provisto y proveído: los 3 gemelos de la RAE!",
        "action": "highlight",
        "text": "¡Ambos son 100% correctos! | Respaldados por la RAE",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Conocías esta curiosidad de los verbos? ¡Guarda este video!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "subir_arriba_pleonasmos",
    "category": "Un libro lleno de errores",
    "name": "¿Subir arriba o salir afuera?",
    "icon": "📕",
    "summary": "Subir arriba, bajar abajo, entrar adentro y salir afuera son redundancias",
    "steps": [
      {
        "speech": "¡Subir arriba, bajar abajo o salir afuera son redundancias cómicas que debes evitar!",
        "action": "write",
        "text": "¿SUBIR ARRIBA O SALIR AFUERA?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "En lingüística se llaman pleonasmos viciosos: repiten una idea que ya está en el verbo.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "El verbo 'subir' ya significa dirigirse hacia arriba. No hace falta aclararlo.",
        "action": "write",
        "text": "❌ SUBIR ARRIBA | 'Subir' ya indica ir arriba",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Lo mismo pasa con 'salir': salir ya significa pasar de dentro hacia fuera.",
        "action": "write",
        "text": "❌ SALIR AFUERA | 'Salir' ya indica ir afuera",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Basta con decir: 'Voy a subir al segundo piso' o 'Sal un momento, por favor'.",
        "action": "highlight",
        "text": "✅ BASTA CON DECIR: | 'Sube' o 'Sal un momento'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué otro pleonasmo escuchas en tu familia? ¡Déjamelo en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "dijistes_comistes",
    "category": "Un libro lleno de errores",
    "name": "¿Dijiste o dijistes?",
    "icon": "📕",
    "summary": "La segunda persona del pretérito perfecto simple nunca lleva S: dijiste, comiste",
    "steps": [
      {
        "speech": "¡Esa S al final de las palabras en pasado es una intrusa que debemos expulsar!",
        "action": "write",
        "text": "¿DIJISTE O DIJISTES?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cuando le hablas de 'tú' a alguien en pasado, jamás debes añadirle una S al final.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Decir 'dijistes', 'comistes', 'fuistes' o 'hicistes' es un error muy extendido pero incorrecto.",
        "action": "write",
        "text": "❌ DIJISTES / FUISTES | ¡Esa S final no existe!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "La forma impecable es: dijiste, comiste, fuiste, hiciste, cantaste y viniste.",
        "action": "write",
        "text": "✅ DIJISTE / FUISTE | 'Tú dijiste la verdad'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Quítale la S al pasado y hablarás con elegancia total!",
        "action": "highlight",
        "text": "comiste | viniste | hiciste | cantaste",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Se te escapaba esta S intrusa? ¡Coméntalo y suscríbete para más tips!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "cocer_coser",
    "category": "Un libro lleno de errores",
    "name": "¿Cocer o coser?",
    "icon": "📕",
    "summary": "Cocer con C es cocinar alimentos; Coser con S es unir telas con hilo",
    "steps": [
      {
        "speech": "Suenan exactamente igual, ¡pero cambiar una C por una S cambia todo el significado!",
        "action": "write",
        "text": "¿COCER O COSER?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Estas palabras homófonas confunden a miles de personas en recetas y mensajes.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'Cocer' con C viene de cocina y calor: 'poner a cocer las verduras al vapor'.",
        "action": "write",
        "text": "COCER (con C) | = Cocinar al fuego",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "'Coser' con S viene de hilo y aguja: 'voy a coser el botón de la camisa'.",
        "action": "write",
        "text": "COSER (con S) | = Unir con aguja e hilo",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Truco mnemotécnico: Cocer con C de Cocina; Coser con S de Sastre!",
        "action": "highlight",
        "text": "Ej: 'Voy a cocer arroz' | 'Voy a coser el botón'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Nunca cuezas la camisa ni cosas las papas! ¿Te gustó el truco?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "bienes_vienes",
    "category": "Un libro lleno de errores",
    "name": "¿Bienes o vienes?",
    "icon": "📕",
    "summary": "Bienes con B son propiedades; Vienes con V es del verbo venir",
    "steps": [
      {
        "speech": "Una sola letra puede transformar una herencia millonaria en una pregunta cotidiana.",
        "action": "write",
        "text": "¿BIENES O VIENES?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La B y la V suenan igual en español moderno, ¡pero su ortografía es estricta!",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'Bienes' con B se refiere al patrimonio, riquezas o posesiones: 'bienes raíces'.",
        "action": "write",
        "text": "BIENES (con B) | = Riquezas y patrimonio",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "'Vienes' con V es la conjugación del verbo venir: '¿vienes hoy a mi casa?'.",
        "action": "write",
        "text": "VIENES (con V) | = Del verbo venir",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Fíjate en esta frase: 'Si vienes con V, cuidaremos todos tus bienes con B'.",
        "action": "highlight",
        "text": "'Separación de bienes' | '¿Vienes hoy conmigo?'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Conocías esta diferencia? ¡Déjame una oración con ambas en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "concordancia_mayoria",
    "category": "Un libro lleno de errores",
    "name": "¿La mayoría fue o fueron?",
    "icon": "📕",
    "summary": "Ambas opciones son válidas según la RAE: concordancia de grupo o de elementos",
    "steps": [
      {
        "speech": "Si dices 'la mayoría de los estudiantes', ¿el verbo debe ir en singular o en plural?",
        "action": "write",
        "text": "¿LA MAYORÍA FUE O FUERON?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "¡Esta es una de las dudas más frecuentes en redacción y exámenes universitarios!",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Si concuerdas con 'la mayoría', pones el verbo en singular: 'la mayoría aprobó'.",
        "action": "write",
        "text": "✅ LA MAYORÍA FUE | Concordancia gramatical",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Pero si concuerdas con 'los estudiantes', pones plural: 'la mayoría aprobaron'.",
        "action": "write",
        "text": "✅ LA MAYORÍA FUERON | Concordancia ad sensum",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡La RAE admite ambas como cultas y correctas! Puedes elegir la que mejor suene.",
        "action": "highlight",
        "text": "¡La RAE acepta ambas! | 'la mayoría llegó / llegaron'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál opción prefieres tú al escribir? ¡Coméntamelo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "queismo_truco",
    "category": "Un libro lleno de errores",
    "name": "¿Me enteré que o de que?",
    "icon": "📕",
    "summary": "Descubre si va 'que' o 'de que' transformando la frase en pregunta",
    "steps": [
      {
        "speech": "¡Para saber si le falta o le sobra la palabra 'de' a tu frase, usa la pregunta mágica!",
        "action": "write",
        "text": "¿ME ENTERÉ QUE O DE QUE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Muchos caen en el queísmo y eliminan la preposición 'de' cuando era obligatoria.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Pregúntate: ¿Qué te enteraste o DE QUÉ te enteraste? ¡Pide 'de' a gritos!",
        "action": "write",
        "text": "¿DE QUÉ ME ENTERÉ? | 'De que no había clase'",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Por lo tanto, la forma correcta es: 'Me enteré DE QUE no había clase'.",
        "action": "write",
        "text": "✅ ME ENTERÉ DE QUE | Si la pregunta pide 'de', ¡ponlo!",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "En cambio: ¿Qué pienso? 'Pienso que es genial' (sin 'de').",
        "action": "highlight",
        "text": "Pienso que (¿Qué pienso?) | Me alegro de que (¿De qué?)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡El truco de la pregunta nunca falla! Guarda este video para tus tareas.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "conyuge_no_conyugue",
    "category": "Un libro lleno de errores",
    "name": "Cónyuge (no cónyugue)",
    "icon": "📕",
    "summary": "La palabra correcta es cónyuge con sonido de jota, sin u intermedia",
    "steps": [
      {
        "speech": "Muchos profesionales cometen el error de escribir y pronunciar 'cónyugue' con U.",
        "action": "write",
        "text": "¿CÓNYUGE O CÓNYUGUE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Esta palabra proviene del latín coniux y mantiene el sonido de la letra ge suave o jota.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Decir 'cónyugue' es incorrecto. La U intermedia no existe en el español formal.",
        "action": "write",
        "text": "❌ CÓNYUGUE | ¡Pronunciación incorrecta!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Se escribe y se pronuncia CÓNYUGE: 'el cónyuge firmó el acuerdo matrimonial'.",
        "action": "write",
        "text": "✅ CÓNYUGE | Se pronuncia 'cón-yu-je'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Además es palabra esdrújula, ¡así que siempre lleva tilde en la O!",
        "action": "highlight",
        "text": "Palabra esdrújula | Lleva tilde en la O",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Has visto este error en contratos o formularios? ¡Coméntalo aquí!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "trastorno_no_transtorno",
    "category": "Un libro lleno de errores",
    "name": "Trastorno (no transtorno)",
    "icon": "📕",
    "summary": "Se escribe trastorno, sin la letra N intermedia",
    "steps": [
      {
        "speech": "A veces le agregamos letras a las palabras por inercia o por confusión de prefijos.",
        "action": "write",
        "text": "¿TRASTORNO O TRANSTORNO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Uno de los tropiezos más habituales en psicología y medicina es meterle una N a trastorno.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'Transtorno' con N intermedia no está admitido en el diccionario de la RAE.",
        "action": "write",
        "text": "❌ TRANSTORNO | ¡La N intermedia sobra!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "La palabra oficial es TRASTORNO: 'trastorno del sueño' o 'trastornar los planes'.",
        "action": "write",
        "text": "✅ TRASTORNO | Prefijo tras-",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Viene del prefijo tras- más el verbo tornar. ¡Sin la N intermedia!",
        "action": "highlight",
        "text": "trastornar | trastorno bipolar | traspié",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Dile adiós a esa N que nadie invitó! Comparte este tip ortográfico.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "prever_no_preveer",
    "category": "Un libro lleno de errores",
    "name": "Prever (no preveer)",
    "icon": "📕",
    "summary": "Viene de pre-ver (ver con anticipación), no de proveer",
    "steps": [
      {
        "speech": "¡Prever significa ver antes, por eso se conjuga exactamente igual que el verbo VER!",
        "action": "write",
        "text": "¿PREVER O PREVEER?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Mucha gente lo confunde con 'proveer' y le mete una segunda E que no le corresponde.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Escribir 'preveer' con doble E o 'preveyó' es un error gramatical.",
        "action": "write",
        "text": "❌ PREVEER | ¡No lleva doble E!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Se escribe PREVER con una sola E: 'Él vio ➔ Él previó las consecuencias'.",
        "action": "write",
        "text": "✅ PREVER (pre + ver) | 'Él vio ➔ Él previó'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Recuerda: Yo preveo, tú prevés, él previó, nosotros prevemos. ¡Como VER!",
        "action": "highlight",
        "text": "Previó el peligro | Yo preveo, tú prevés",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te habías equivocado con este verbo? ¡Ahora ya lo dominas al 100%!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "grosso_modo",
    "category": "Un libro lleno de errores",
    "name": "Grosso modo (sin la 'a')",
    "icon": "📕",
    "summary": "La locución culta es 'grosso modo', nunca 'a grosso modo'",
    "steps": [
      {
        "speech": "¡En latín las locuciones no llevan preposiciones en español! Conoce la regla de oro.",
        "action": "write",
        "text": "¿A GROSSO MODO O GROSSO MODO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'Grosso modo' es una locución latina que significa 'a grandes rasgos' o 'aproximadamente'.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Añadirle la preposición 'a' delante es un error muy común pero censurado por la RAE.",
        "action": "write",
        "text": "❌ A GROSSO MODO | ¡La preposición 'A' sobra!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "La forma impecable es simplemente: 'Grosso modo, el costo será de diez mil dólares'.",
        "action": "write",
        "text": "✅ GROSSO MODO | Significa 'a grandes rasgos'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Lo mismo aplica para 'motu proprio' y 'corpore insepulto'. ¡Sin preposiciones añadidas!",
        "action": "highlight",
        "text": "'Grosso modo, costará mil' | Sin preposición",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Habla y escribe como un profesional de alto nivel! ¿Conocías este detalle?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "motu_proprio",
    "category": "Un libro lleno de errores",
    "name": "Motu proprio (con 'r')",
    "icon": "📕",
    "summary": "Se dice 'motu proprio', no 'de motu propio' ni 'por motu propio'",
    "steps": [
      {
        "speech": "Esta locución latina casi todo el mundo la dice con dos errores juntos. ¡Corrijámosla!",
        "action": "write",
        "text": "¿MOTU PROPRIO O DE MOTU PROPIO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Se usa para indicar que alguien hizo algo voluntariamente, por iniciativa personal.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Primer error: ponerle 'de' o 'por'. Segundo error: quitarle la R a 'proprio'.",
        "action": "write",
        "text": "❌ DE MOTU PROPIO | Sin 'de' y con falta de 'r'",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "La forma latina auténtica es MOTU PROPRIO con doble R: 'Renunció motu proprio'.",
        "action": "write",
        "text": "✅ MOTU PROPRIO | Significa 'por iniciativa propia'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Sin preposición y con R en proprio! Ahora sí sonarás intachable en cualquier acta.",
        "action": "highlight",
        "text": "Doble R: 'proprio' | 'Lo hizo motu proprio'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Lo habías escuchado mal en televisión o noticias? ¡Comenta tu experiencia!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "sin_embargo_redundancia",
    "category": "Un libro lleno de errores",
    "name": "Sin embargo (sin 'mas')",
    "icon": "📕",
    "summary": "'Mas sin embargo' es un pleonasmo innecesario; usa solo uno",
    "steps": [
      {
        "speech": "¿Alguna vez has dicho 'mas sin embargo'? ¡Cuidado, estás diciendo lo mismo dos veces!",
        "action": "write",
        "text": "¿MAS SIN EMBARGO O SIN EMBARGO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'Mas' (sin tilde) significa 'pero'. Y 'sin embargo' también expresa adversación.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Juntarlos en 'mas sin embargo' es un pleonasmo redundante que afea tu discurso.",
        "action": "write",
        "text": "❌ MAS SIN EMBARGO | Pleonasmo innecesario",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Elige uno solo: 'Estudió mucho; sin embargo, no aprobó' o 'Estudió, mas no aprobó'.",
        "action": "write",
        "text": "✅ SIN EMBARGO | O simplemente 'pero' o 'mas'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Recuerda además que 'sin embargo' siempre va aislado entre comas o punto y coma.",
        "action": "highlight",
        "text": "Siempre va entre comas: | 'Llovió; sin embargo, fuimos'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Una sola palabra adversativa basta para convencer! ¿Lo sabías?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "demostrativos_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Este, ese, aquel (ya sin tilde)",
    "icon": "📕",
    "summary": "Según las normas actuales de la RAE, los demostrativos no llevan tilde",
    "steps": [
      {
        "speech": "¿Te enseñaron en el colegio a ponerle tilde a 'éste' cuando era pronombre? ¡Ya no va!",
        "action": "write",
        "text": "¿ÉSTE O ESTE? ¿LLEVA TILDE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La RAE eliminó la obligatoriedad de la tilde en los pronombres demostrativos desde 2010.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Palabras como este, ese, aquel y sus femeninos no deben llevar tilde diacrítica.",
        "action": "write",
        "text": "❌ ÉSTE / ÉSA / AQUÉL | Ya no llevan tilde",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Son palabras llanas o agudas que siguen las reglas generales: 'Este libro es genial' o 'Este es mi hermano'.",
        "action": "write",
        "text": "✅ ESTE / ESA / AQUEL | Siempre sin tilde",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Incluso si hay ambigüedad, el contexto aclara todo sin necesidad de tilde!",
        "action": "highlight",
        "text": "Reglas de acentuación: | Son palabras llanas terminadas en vocal",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Sigues poniéndole tilde por costumbre? ¡Cuéntame en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "tilde_interrogativos",
    "category": "Un libro lleno de errores",
    "name": "Qué, quién, cuándo con tilde",
    "icon": "📕",
    "summary": "Llevan tilde cuando introducen preguntas o exclamaciones, directas o indirectas",
    "steps": [
      {
        "speech": "Para saber si 'que', 'quien', 'cuando', 'como' y 'donde' llevan tilde, ¡mira la intención!",
        "action": "write",
        "text": "QUÉ, QUIÉN, CUÁNDO, DÓNDE",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cuando tienen valor interrogativo o exclamativo, llevan tilde diacrítica obligatoria.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "En preguntas y exclamaciones directas: '¿Qué quieres?' o '¡Qué alegría verte!'.",
        "action": "write",
        "text": "✅ CON TILDE: | ¿Qué quieres? / ¡Qué emoción!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Y también en indirectas: 'No sé cuándo llegará' o 'Dime quién te lo contó'.",
        "action": "write",
        "text": "✅ PREGUNTAS INDIRECTAS: | 'No sé cuándo vendrá'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Si son simples relativos, van sin tilde: 'La casa donde crecí' o 'El libro que leí'.",
        "action": "highlight",
        "text": "Relativos van sin tilde: | 'La casa donde vivo'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡La tilde interrogativa le da fuerza a tu mensaje! Comenta una pregunta con tilde.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "mas_con_y_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Más vs Mas",
    "icon": "📕",
    "summary": "Más con tilde es cantidad; Mas sin tilde equivale a pero",
    "steps": [
      {
        "speech": "La tilde diacrítica distingue dos palabras que suenan igual pero tienen vidas distintas.",
        "action": "write",
        "text": "¿MÁS O MAS?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'Más' con tilde es un adverbio de cantidad o el signo matemático de la suma.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Por ejemplo: 'Quiero más café' o 'Dos más dos son cuatro'. ¡Siempre con tilde!",
        "action": "write",
        "text": "MÁS (con tilde) | = Cantidad o suma (2 + 2)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "'Mas' sin tilde es una conjunción adversativa que equivale exactamente a 'pero'.",
        "action": "write",
        "text": "MAS (sin tilde) | = Sinónimo de 'pero'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Ejemplo: 'Quiso asistir a clase, mas no encontró transporte'. ¡Equivale a pero!",
        "action": "highlight",
        "text": "'Quiero más café' | 'Quiso ir, mas no pudo'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Si puedes sustituirlo por 'pero', va sin tilde! ¿Te gustó el truco?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "te_con_y_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Té vs Te",
    "icon": "📕",
    "summary": "Té con tilde es la bebida de infusión; Te sin tilde es pronombre",
    "steps": [
      {
        "speech": "Una sola tilde te separa de una aromática taza caliente o de una declaración de cariño.",
        "action": "write",
        "text": "¿TÉ O TE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "En español, 'té' como sustantivo que designa la planta o infusión lleva tilde diacrítica.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Ejemplo: 'Me apetece una taza de té verde con limón'. ¡Lleva tilde siempre!",
        "action": "write",
        "text": "TÉ (con tilde) | = Bebida aromática o infusión",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En cambio, el pronombre personal va sin tilde: 'Te llamo más tarde' o 'Te quiero mucho'.",
        "action": "write",
        "text": "TE (sin tilde) | = Pronombre personal ('te quiero')",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Fíjate en esta frase completa: '¿Te sirvo una taza de té caliente?'.",
        "action": "highlight",
        "text": "'¿Te sirvo una taza de té?' | ¡Ambos en una sola frase!",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡El té para saborear siempre lleva tilde! ¿Cuál es tu infusión favorita?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "de_con_y_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Dé vs De",
    "icon": "📕",
    "summary": "Dé con tilde es del verbo dar; De sin tilde es la preposición",
    "steps": [
      {
        "speech": "¿Cuándo lleva tilde la palabra 'de'? ¡Solo cuando proviene del verbo dar!",
        "action": "write",
        "text": "¿DÉ O DE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Es una de las tildes diacríticas más fáciles de recordar con la técnica de La Profe Rochi.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Si es del verbo DAR, lleva tilde: 'Dile que me dé mi dinero' o 'Ojalá te dé suerte'.",
        "action": "write",
        "text": "DÉ (con tilde) | = Forma del verbo DAR",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Si es la preposición que indica origen o materia, no lleva tilde: 'vaso de agua'.",
        "action": "write",
        "text": "DE (sin tilde) | = Preposición ('vaso de agua')",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Mira este ejemplo: 'Pídele que te dé el libro de historia'. ¡El primero lleva tilde!",
        "action": "highlight",
        "text": "'Pídele que te dé el libro de arte' | ¡Diferenciación clara!",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Si viene de dar, dale una tilde! ¿A que no se te olvida nunca más?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "se_con_y_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Sé vs Se",
    "icon": "📕",
    "summary": "Sé con tilde viene de saber o de ser; Se sin tilde es pronombre",
    "steps": [
      {
        "speech": "¡Sé inteligente y domina la diferencia entre 'sé' con tilde y 'se' sin tilde en 30 segundos!",
        "action": "write",
        "text": "¿SÉ O SE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'Sé' con tilde corresponde a dos verbos: al verbo SABER ('yo sé') o al imperativo de SER ('sé tú mismo').",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Ejemplos: 'Yo sé la respuesta correcta' o 'Sé amable con los demás'.",
        "action": "write",
        "text": "SÉ (con tilde) | = Verbo saber ('yo sé') o ser ('sé tú')",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En cambio, el pronombre reflexivo va sin tilde: 'Él se peina' o 'Se fueron de viaje'.",
        "action": "write",
        "text": "SE (sin tilde) | = Pronombre ('se cayó')",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Fíjate en esta frase: 'Yo sé que él se esforzó al máximo'. ¡Saber con tilde!",
        "action": "highlight",
        "text": "'Yo sé que se fue temprano' | Saber lleva tilde",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡La famosa frase 'Solo sé que nada sé' lleva dos tildes! ¿Te gustó la lección?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "mi_con_y_sin_tilde",
    "category": "Un libro lleno de errores",
    "name": "Mí vs Mi",
    "icon": "📕",
    "summary": "Mí con tilde es pronombre personal; Mi sin tilde es posesivo o nota musical",
    "steps": [
      {
        "speech": "A mí me apasiona enseñarte ortografía. ¡Fíjate bien en ese 'a mí'!",
        "action": "write",
        "text": "¿MÍ O MI?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "'Mí' con tilde es el pronombre personal tónico: se refiere a la primera persona.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Siempre que vaya después de una preposición lleva tilde: 'Este regalo es para mí'.",
        "action": "write",
        "text": "MÍ (con tilde) | = Pronombre ('es para mí')",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En cambio, el determinante posesivo va sin tilde: 'mi familia', 'mi teléfono', 'mi meta'.",
        "action": "write",
        "text": "MI (sin tilde) | = Posesivo ('mi casa, mi auto')",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Mira esta combinación: 'Mi hermano compró un libro para mí'. ¡Impecable!",
        "action": "highlight",
        "text": "'Mi amigo vino por mí' | Diferencia total",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Si te refieres a ti mismo después de preposición, no olvides la tilde! Comenta.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "medio_abierta",
    "category": "Un libro lleno de errores",
    "name": "¿Medio abierta o media abierta?",
    "icon": "📕",
    "summary": "Medio funciona como adverbio invariable: medio abierta, medio cansada",
    "steps": [
      {
        "speech": "¡Uno de los errores más frecuentes al hablar en la calle! Decir 'la puerta quedó media abierta'.",
        "action": "write",
        "text": "¿MEDIO ABIERTA O MEDIA ABIERTA?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cuando 'medio' significa 'a medias' o 'parcialmente', actúa como un adverbio.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Y en español los adverbios son invariables: ¡no tienen femenino ni plural!",
        "action": "write",
        "text": "❌ MEDIA ABIERTA | ¡El adverbio no tiene género!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Lo correcto es decir: 'la puerta quedó MEDIO abierta' o 'ella está MEDIO dormida'.",
        "action": "write",
        "text": "✅ MEDIO ABIERTA | Significa 'parcialmente abierta'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡'Media' solo se usa para la mitad de algo: 'media naranja' o las medias que te pones!",
        "action": "highlight",
        "text": "'Ella está medio cansada' | 'La ventana quedó medio abierta'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Decías 'media dormida'? ¡Ahora ya sabes que se dice medio dormida! Comparte.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "sobretodo_sobre_todo",
    "category": "Un libro lleno de errores",
    "name": "Sobretodo vs Sobre todo",
    "icon": "📕",
    "summary": "Sobretodo junto es una prenda de vestir; Sobre todo separado es principalmente",
    "steps": [
      {
        "speech": "No es lo mismo ponerse una prenda de abrigo que enfatizar una idea importante.",
        "action": "write",
        "text": "¿SOBRETODO O SOBRE TODO?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Esta confusión ortográfica llena de tachones cientos de redacciones cada día.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'Sobretodo' escrito junto es un sustantivo que significa abrigo largo que se lleva sobre la ropa.",
        "action": "write",
        "text": "SOBRETODO (junto) | = Abrigo largo o gabardina",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "'Sobre todo' separado significa 'especialmente' o 'principalmente'.",
        "action": "write",
        "text": "SOBRE TODO (separado) | = Especialmente o principalmente",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Ejemplo: 'Me encanta viajar, sobre todo a la playa'. ¡El noventa y nueve por ciento de las veces va separado!",
        "action": "highlight",
        "text": "'Me gusta leer, sobre todo poesía' | Separado es lo común",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Ponte el sobretodo, pero sobre todo escribe bien! ¿Lo sabías?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "adonde_a_donde",
    "category": "Un libro lleno de errores",
    "name": "¿Adónde o a dónde?",
    "icon": "📕",
    "summary": "La RAE admite ambas grafías (junta o separada), la tilde depende de si interroga",
    "steps": [
      {
        "speech": "¡Buenas noticias de la Real Academia Española para simplificarnos la vida!",
        "action": "write",
        "text": "¿ADÓNDE O A DÓNDE?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Durante años hubo discusiones sobre si se escribía junto o separado. Hoy la RAE admite ambas.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "En preguntas: puedes escribir '¿Adónde vas?' o '¿A dónde vas?'. ¡Ambas son correctas con tilde!",
        "action": "write",
        "text": "CON TILDE (interrogativo) | ¿Adónde vas? = ¿A dónde vas?",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En relativos sin pregunta: 'el pueblo adonde voy' o 'el pueblo a donde voy' (ambas sin tilde).",
        "action": "write",
        "text": "SIN TILDE (relativo) | 'El lugar adonde voy'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Lo que jamás debes olvidar es la tilde cuando haces una pregunta!",
        "action": "highlight",
        "text": "¡Junto o separado, ambos valen! | Respaldado por la RAE",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Una duda menos en tu libreta! Guarda este video para consultar siempre.",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "hubo_fiestas_no_hubieron",
    "category": "Un libro lleno de errores",
    "name": "Hubo fiestas (no hubieron fiestas)",
    "icon": "📕",
    "summary": "El verbo haber es impersonal en singular cuando indica existencia de cosas o personas",
    "steps": [
      {
        "speech": "¡Regla de oro de la RAE que todo hispanohablante debe tatuarse en el cerebro!",
        "action": "write",
        "text": "¿HUBO FIESTAS O HUBIERON?",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cuando el verbo 'haber' expresa existencia de cosas o personas, es un verbo IMPERSONAL.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Al no tener sujeto, no se puede pluralizar. 'Hubieron personas' es un error gravísimo.",
        "action": "write",
        "text": "❌ HUBIERON FIESTAS | ¡Error de concordancia!",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Se dice siempre en singular: 'HUBO fiestas', 'HUBO problemas', 'HUBO miles de personas'.",
        "action": "write",
        "text": "✅ HUBO FIESTAS | Siempre en singular",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "'Hubieron' solo existe como tiempo compuesto antiguo: 'cuando hubieron terminado'. ¡Jamás de existencia!",
        "action": "highlight",
        "text": "'Hubo problemas' | 'Hubo miles de personas'",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Siempre di HUBO y sonarás con una cultura impecable! ¿Te quedó claro?",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "persona_humana_pleonasmos",
    "category": "Un libro lleno de errores",
    "name": "Pleonasmos de redacción",
    "icon": "📕",
    "summary": "Lapso de tiempo, persona humana, testigo presencial y volver a repetir",
    "steps": [
      {
        "speech": "¡Cuidado con estas frases redundantes que inundan correos, contratos y noticias!",
        "action": "write",
        "text": "PLEONASMOS QUE DEBES EVITAR",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Un pleonasmo es añadir palabras innecesarias que ya están comprendidas en el término principal.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "'Lapso de tiempo' es redundante porque un lapso es por definición un espacio de tiempo.",
        "action": "write",
        "text": "❌ LAPSO DE TIEMPO | Lapso ya es de tiempo",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "'Testigo presencial' también sobra, porque un testigo ya es quien presencia un hecho.",
        "action": "write",
        "text": "❌ TESTIGO PRESENCIAL | Un testigo ya es presencial",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Di simplemente: persona (no persona humana), repetir (no volver a repetir) y lapso.",
        "action": "highlight",
        "text": "❌ PERSONA HUMANA ➔ persona | ❌ VOLVER A REPETIR ➔ repetir",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál de estos pleonasmos escuchas más a menudo en televisión? ¡Comenta!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },


  // =========================================================
  // 1. DUDAS FRECUENTES Y PALABRAS HOMÓFONAS (VIRALES)
  // =========================================================
  {
    id: "a_ver_haber",
    category: "Dudas Frecuentes",
    name: "¿A ver o haber?",
    icon: "💡",
    summary: "Diferencia entre mirar (a ver) y el verbo de existencia (haber)",
    steps: [
      {
        speech: "¡Hola! Hoy aprenderás a no confundir nunca más 'a ver' con 'haber'.",
        action: "write",
        text: "¿A VER O HABER?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Es uno de los errores más comunes en redes, ¡pero la regla de la RAE es facilísima!",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'A ver' con uve viene de mirar o comprobar algo: 'vamos a ver una película'.",
        action: "write",
        text: "a ver = mirar",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Haber' con hache y be es el verbo de existencia: 'debe haber comida en la nevera'.",
        action: "write",
        text: "haber = existir",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Truco infalible!: Si puedes cambiarlo por 'veamos', siempre va separado y con V.",
        action: "highlight",
        text: "haber = existir",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Cuál de los dos te confundía más al escribir? ¡Déjamelo aquí en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "haya_halla_alla",
    category: "Dudas Frecuentes",
    name: "¿Haya, halla o allá?",
    icon: "💡",
    summary: "Verbo haber (haya), encontrar (halla) y lugar (allá)",
    steps: [
      {
        speech: "¡Hola! Hoy vas a dominar la diferencia entre haya, halla y allá en 30 segundos.",
        action: "write",
        text: "HAYA, HALLA O ALLÁ",
        target: "title",
        camera: "board"
      },
      {
        speech: "Cada una tiene un significado totalmente diferente según la Real Academia Española.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Haya' con ye viene del verbo haber: 'espero que haya llegado bien a su casa'.",
        action: "write",
        text: "haya = de haber",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Halla' con doble ele viene de hallar o encontrar: 'la sede se halla en Lima'.",
        action: "write",
        text: "halla = encontrar",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y 'allá' con tilde final indica lugar o distancia: 'mira hacia allá en el horizonte'.",
        action: "write",
        text: "allá = lugar",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Conocías también el 'aya' con ye de niñera? ¡Cuéntamelo en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "ahi_hay_ay",
    category: "Dudas Frecuentes",
    name: "¿Ahí, hay o ¡ay!?",
    icon: "💡",
    summary: "Lugar (ahí), existencia (hay) y exclamación de dolor (¡ay!)",
    steps: [
      {
        speech: "¡Aprende la famosa regla de la RAE: 'Ahí hay un hombre que dice ¡ay!'!",
        action: "write",
        text: "¡AHÍ HAY UN AY!",
        target: "title",
        camera: "board"
      },
      {
        speech: "Estas tres palabras suenan casi igual pero se escriben de tres formas muy distintas.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Ahí' con hache intermedia y tilde indica un lugar específico: 'déjalo ahí mismo'.",
        action: "write",
        text: "ahí = lugar",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Hay' empieza con hache y es del verbo haber: 'hoy hay clase con la profe'.",
        action: "write",
        text: "hay = haber",
        target: "example2",
        camera: "board"
      },
      {
        speech: "'¡Ay!' sin hache es una exclamación de dolor o sorpresa: '¡ay, qué susto me diste!'.",
        action: "highlight",
        text: "¡ay! = dolor",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Escribe una oración usando las tres juntas en los comentarios, ¡te leo y corrijo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "porque_por_que",
    category: "Dudas Frecuentes",
    name: "Los 4 porqués",
    icon: "💡",
    summary: "¿Por qué?, porque, el porqué y por que",
    steps: [
      {
        speech: "¡Descubre cómo usar los cuatro 'porqués' del español sin dudar jamás!",
        action: "write",
        text: "LOS 4 PORQUÉS",
        target: "title",
        camera: "board"
      },
      {
        speech: "La RAE distingue con total claridad cada uno según su función en la oración.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Por qué' separado y con tilde se usa en preguntas: '¿Por qué no viniste a clase?'.",
        action: "write",
        text: "¿por qué? = pregunta",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Porque' junto y sin tilde es la respuesta o causa: 'porque estaba trabajando'.",
        action: "write",
        text: "porque = respuesta",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y 'el porqué' junto y con tilde es un sustantivo sinónimo de motivo o razón.",
        action: "highlight",
        text: "el porqué = motivo",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Y sabías cuál es 'por que' relativo? ¡Pruébalo en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "sino_si_no",
    category: "Dudas Frecuentes",
    name: "¿Sino o si no?",
    icon: "💡",
    summary: "Contraposición (sino) vs condición negativa (si no)",
    steps: [
      {
        speech: "¡Hoy resolvemos la gran duda: cuándo escribir 'sino' junto y 'si no' separado!",
        action: "write",
        text: "¿SINO O SI NO?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Presta mucha atención al truco que nunca falla según la gramática española.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Sino' junto se usa para contraponer ideas: 'no quiero agua, sino jugo de fresa'.",
        action: "write",
        text: "sino = pero sí",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Si no' separado introduce una condición negativa: 'si no estudias, repruebas'.",
        action: "write",
        text: "si no = condición",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Truco: si puedes decir 'si de lo contrario no', siempre se escribe separado.",
        action: "highlight",
        text: "si no = condición",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Tienes otra duda parecida que quieras aprender? ¡Déjala en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "vaya_valla_baya",
    category: "Dudas Frecuentes",
    name: "¿Vaya, valla o baya?",
    icon: "💡",
    summary: "Verbo ir (vaya), cerca o letrero (valla) y fruto (baya)",
    steps: [
      {
        speech: "¡Aprende a diferenciar 'vaya', 'valla' y 'baya' en solo un minuto!",
        action: "write",
        text: "VAYA, VALLA O BAYA",
        target: "title",
        camera: "board"
      },
      {
        speech: "Las tres suenan exactamente igual pero pertenecen a familias de palabras distintas.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Vaya' con uve y ye es del verbo ir o exclamación: '¡vaya sorpresa tan bonita!'.",
        action: "write",
        text: "vaya = verbo ir",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Valla' con uve y doble ele es una cerca o cartel publicitario en la calle.",
        action: "write",
        text: "valla = cerca / muro",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y 'baya' con be y ye es un fruto carnoso, como la mora, la fresa o el arándano.",
        action: "highlight",
        text: "baya = fruto",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Te sabías la diferencia de las tres? ¡Coméntamelo abajo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "hecho_echo",
    category: "Dudas Frecuentes",
    name: "¿Hecho o echo?",
    icon: "💡",
    summary: "Del verbo hacer (hecho) vs del verbo tirar/echar (echo)",
    steps: [
      {
        speech: "¡Nunca más te confundas entre 'hecho' con hache y 'echo' sin hache!",
        action: "write",
        text: "¿HECHO O ECHO?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Solo una letra cambia por completo el sentido de lo que estás comunicando.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Hecho' con hache viene del verbo hacer o es un acontecimiento: 'la tarea está hecha'.",
        action: "write",
        text: "hecho = de hacer",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Echo' sin hache viene de echar, que significa tirar o expulsar: 'te echo de menos'.",
        action: "write",
        text: "echo = de tirar",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Regla mnemotécnica RAE!: 'El verbo echar echa la hache por la ventana'.",
        action: "highlight",
        text: "echo = sin H",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Te gustó el truco de la ventana? ¡Compártelo con tus amigos en comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "tuvo_tubo",
    category: "Dudas Frecuentes",
    name: "¿Tuvo o tubo?",
    icon: "💡",
    summary: "Pasado del verbo tener (tuvo) vs cilindro hueco (tubo)",
    steps: [
      {
        speech: "¡Diferencia 'tuvo' con V de 'tubo' con B de manera rápida y definitiva!",
        action: "write",
        text: "¿TUVO O TUBO?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Una palabra pertenece a los verbos y la otra a los objetos cilíndricos.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Tuvo' con uve es del verbo tener en pasado: 'ella tuvo mucha suerte en el examen'.",
        action: "write",
        text: "tuvo = de tener",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Tubo' con be es la pieza cilíndrica y hueca: 'el tubo del agua se rompió'.",
        action: "write",
        text: "tubo = cilindro",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Recuerda: todos los pasados de tener (tuve, tuviste, tuvo) se escriben con V.",
        action: "highlight",
        text: "tuvo = con V",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Conoces otra palabra con be y uve homófonas? ¡Coméntala!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },

  // =========================================================
  // 2. ACENTUACIÓN Y REGLAS DE TILDES (RAE OFICIAL)
  // =========================================================
  {
    id: "palabras_agudas",
    category: "Acentuación y Tildes",
    name: "Palabras Agudas",
    icon: "✍️",
    summary: "Acento en la última sílaba: tilde si terminan en N, S o vocal",
    steps: [
      {
        speech: "¡Aprende las palabras agudas en solo 30 segundos con la Profe Rochi!",
        action: "write",
        text: "PALABRAS AGUDAS",
        target: "title",
        camera: "board"
      },
      {
        speech: "Las palabras agudas tienen la mayor fuerza de voz en la última sílaba.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Llevan tilde cuando terminan en N, S o vocal, como camión, compás y café.",
        action: "write",
        text: "camión · compás",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Si terminan en otra consonante no llevan tilde, como reloj, papel o cantar.",
        action: "write",
        text: "reloj · papel",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Fíjate siempre en la última letra para saber si le marcas la tilde o no!",
        action: "highlight",
        text: "N, S o vocal = tilde",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Cuál otra palabra aguda con tilde conoces? ¡Escríbela aquí en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "palabras_graves",
    category: "Acentuación y Tildes",
    name: "Palabras Graves o Llanas",
    icon: "✍️",
    summary: "Acento en la penúltima sílaba: tilde si NO terminan en N, S o vocal",
    steps: [
      {
        speech: "¡Domina las palabras graves o llanas según la Real Academia Española!",
        action: "write",
        text: "PALABRAS GRAVES",
        target: "title",
        camera: "board"
      },
      {
        speech: "Son las palabras más abundantes del español y se acentúan en la penúltima sílaba.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Llevan tilde cuando NO terminan en N, S o vocal, como árbol, lápiz o cómic.",
        action: "write",
        text: "árbol · lápiz",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Si terminan en N, S o vocal no se les marca tilde, como casa, mesa o libro.",
        action: "write",
        text: "casa · libro",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Es exactamente la regla opuesta a las palabras agudas! Facilísimo de recordar.",
        action: "highlight",
        text: "No N, S o vocal = tilde",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Se te ocurre otra palabra grave con tilde? ¡Coméntala abajo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "palabras_esdrujulas",
    category: "Acentuación y Tildes",
    name: "Palabras Esdrújulas",
    icon: "✍️",
    summary: "Acento en antepenúltima sílaba: TODAS llevan tilde sin excepción",
    steps: [
      {
        speech: "¡Las palabras esdrújulas son las más fáciles de acentuar de todo el español!",
        action: "write",
        text: "PALABRAS ESDRÚJULAS",
        target: "title",
        camera: "board"
      },
      {
        speech: "Tienen el golpe de voz en la antepenúltima sílaba.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Ejemplos claros: música, pájaro, plátano, cámara y teléfono.",
        action: "write",
        text: "música · pájaro",
        target: "example1",
        camera: "board"
      },
      {
        speech: "La regla de oro de la RAE es que TODAS las esdrújulas llevan tilde siempre.",
        action: "highlight",
        text: "¡TODAS llevan tilde!",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Y lo mismo aplica para las sobreesdrújulas como: 'dibújamelo' o 'cómpratelo'!",
        action: "write",
        text: "dibújamelo",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Cuál es tu palabra esdrújula favorita? ¡Déjala aquí en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "tilde_diacritica_el",
    category: "Acentuación y Tildes",
    name: "Tilde Diacrítica: Él vs El",
    icon: "✍️",
    summary: "Pronombre personal (Él) vs artículo determinado (El)",
    steps: [
      {
        speech: "¡Aprende cuándo ponerle tilde a 'Él' y cuándo dejarlo sin tilde!",
        action: "write",
        text: "ÉL CON TILDE VS EL",
        target: "title",
        camera: "board"
      },
      {
        speech: "Esta pequeña tilde se llama diacrítica y cambia el significado de la palabra.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Él' lleva tilde cuando reemplaza a una persona: 'Él sabe la respuesta'.",
        action: "write",
        text: "Él = persona",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'El' va sin tilde cuando acompaña a un sustantivo: 'el perro', 'el libro'.",
        action: "write",
        text: "El = artículo",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Truco!: Si puedes sustituirlo por un nombre como Carlos o Pedro, lleva tilde.",
        action: "highlight",
        text: "Él = persona",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Te ha quedado claro? ¡Escribe un ejemplo con 'él' en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "tilde_diacritica_tu",
    category: "Acentuación y Tildes",
    name: "Tilde Diacrítica: Tú vs Tu",
    icon: "✍️",
    summary: "Pronombre personal (Tú) vs adjetivo posesivo (Tu)",
    steps: [
      {
        speech: "¡Descubre la regla exacta de la RAE para 'Tú' con tilde y 'Tu' sin tilde!",
        action: "write",
        text: "TÚ CON TILDE VS TU",
        target: "title",
        camera: "board"
      },
      {
        speech: "Es un error muy común al enviar mensajes de texto y correos rápidos.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Tú' lleva tilde cuando es la persona con quien hablas: 'Tú eres muy inteligente'.",
        action: "write",
        text: "Tú = persona",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Tu' va sin tilde cuando indica posesión de algo: 'tu cuaderno', 'tu casa'.",
        action: "write",
        text: "Tu = posesión",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Fíjate: 'Tú' con tilde eres tú; 'tu lápiz' sin tilde es tu pertenencia.",
        action: "highlight",
        text: "Tú = persona",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Escribe una frase usando ambos para comprobarlo, ¡te respondo a todos!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "tilde_diacritica_si",
    category: "Acentuación y Tildes",
    name: "Tilde Diacrítica: Sí vs Si",
    icon: "✍️",
    summary: "Afirmación rotunda (Sí) vs condición o nota musical (Si)",
    steps: [
      {
        speech: "¡Aprende la diferencia entre 'Sí' afirmativo y 'Si' condicional!",
        action: "write",
        text: "SÍ CON TILDE VS SI",
        target: "title",
        camera: "board"
      },
      {
        speech: "Una sola tilde decide si estás afirmando algo o poniendo una condición.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "'Sí' lleva tilde en afirmaciones y pronombres: '¡sí, acepto!', 'pensó para sí'.",
        action: "write",
        text: "Sí = afirmación",
        target: "example1",
        camera: "board"
      },
      {
        speech: "'Si' va sin tilde cuando es condición: 'si llueve, no salgo', o nota musical.",
        action: "write",
        text: "Si = condición",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Mira cómo cambia el sentido: el primero afirma con fuerza, el segundo condiciona.",
        action: "highlight",
        text: "Sí = afirmación",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Te gustó la explicación? ¡Déjame tu 'sí' entusiasta en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "tilde_en_solo",
    category: "Acentuación y Tildes",
    name: "¿Lleva tilde 'solo'? (Norma RAE)",
    icon: "✍️",
    summary: "La última actualización oficial de la RAE sobre la palabra solo",
    steps: [
      {
        speech: "¡La RAE actualizó la famosa regla sobre la tilde en la palabra 'solo'!",
        action: "write",
        text: "¿SOLO LLEVA TILDE?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Durante años hubo un intenso debate entre académicos y escritores sobre esta tilde.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "La recomendación general de la RAE es escribir 'solo' siempre sin tilde.",
        action: "write",
        text: "solo = sin tilde",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Solo se permite tilde de forma optativa cuando exista riesgo real de ambigüedad.",
        action: "write",
        text: "sólo = optativo",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Por ejemplo: 'estoy solo un minuto'. Si no hay doble sentido, ¡va sin tilde!",
        action: "highlight",
        text: "solo = sin tilde",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Tú eres del equipo con tilde o del equipo sin tilde? ¡Coméntamelo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "hiatos_acentuales",
    category: "Acentuación y Tildes",
    name: "Hiatos: María, país, maíz",
    icon: "✍️",
    summary: "Por qué llevan tilde palabras que rompen la regla general",
    steps: [
      {
        speech: "¡Descubre por qué palabras como 'María', 'país' o 'maíz' llevan tilde!",
        action: "write",
        text: "HIATOS ACENTUALES",
        target: "title",
        camera: "board"
      },
      {
        speech: "Rompemos la regla general porque se produce un hiato acentual en la palabra.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Ocurre cuando se junta una vocal abierta (a, e, o) con una cerrada (i, u) tónica.",
        action: "write",
        text: "María · país · baúl",
        target: "example1",
        camera: "board"
      },
      {
        speech: "La vocal cerrada suena con más fuerza y rompe el diptongo en dos sílabas separadas.",
        action: "highlight",
        text: "vocal cerrada fuerte",
        target: "example1",
        camera: "board"
      },
      {
        speech: "La tilde se coloca siempre sobre la vocal cerrada débil, ¡sin importar la letra final!",
        action: "write",
        text: "maíz · raíz",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Qué otra palabra con hiato conoces? ¡Déjala aquí en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },

  // =========================================================
  // 3. ORTOGRAFÍA DE LETRAS DUDOSAS
  // =========================================================
  {
    id: "reglas_b_v",
    category: "Ortografía de Letras",
    name: "Reglas de la B y la V",
    icon: "🔤",
    summary: "Terminaciones en -aba, antes de consonante y después de N",
    steps: [
      {
        speech: "¡Dile adiós para siempre a las confusiones entre la B y la V con la Profe Rochi!",
        action: "write",
        text: "REGLAS DE LA B Y V",
        target: "title",
        camera: "board"
      },
      {
        speech: "La RAE tiene reglas ortográficas clarísimas que te salvarán en cualquier escrito.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Los verbos en pasado terminados en -aba van siempre con B: cantaba, soñaba, bailaba.",
        action: "write",
        text: "cantaba · soñaba",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Antes de cualquier consonante siempre se escribe B: brazo, blanco, pueblo, hablar.",
        action: "write",
        text: "brazo · blanco",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y después de la letra N siempre va V: invitar, invierno, envolver, conversar.",
        action: "highlight",
        text: "después de N = V",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Cuál palabra con B o V siempre te hace dudar? ¡Pregúntame en comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "letras_c_s_z",
    category: "Ortografía de Letras",
    name: "Uso de la C, S y Z",
    icon: "🔤",
    summary: "Plurales en -ces, adjetivos en -oso y aumentativos en -azo",
    steps: [
      {
        speech: "¡Aprende las claves de la RAE para no dudar entre la C, la S y la Z!",
        action: "write",
        text: "USO DE LA C, S Y Z",
        target: "title",
        camera: "board"
      },
      {
        speech: "Especialmente en América Latina donde las tres se pronuncian con el mismo sonido.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Las palabras que terminan en Z cambian a C en el plural: pez → peces, lápiz → lápices.",
        action: "write",
        text: "pez → peces",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Los adjetivos terminados en -oso y -osa se escriben con S: grandioso, cariñosa.",
        action: "write",
        text: "grandioso (S)",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y los aumentativos o golpes terminados en -azo llevan Z: portazo, golazo, balonazo.",
        action: "highlight",
        text: "golazo (Z)",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Sabías la regla del cambio de Z a C? ¡Coméntamelo abajo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "palabras_con_h",
    category: "Ortografía de Letras",
    name: "Palabras con H obligatoria",
    icon: "🔤",
    summary: "Diptongos hie-, hue- y prefijos hidro-, hiper-",
    steps: [
      {
        speech: "¡La hache es muda pero nunca invisible ante la Real Academia Española!",
        action: "write",
        text: "PALABRAS CON H",
        target: "title",
        camera: "board"
      },
      {
        speech: "Existen combinaciones de letras que exigen hache inicial obligatoria siempre.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Todas las palabras que empiezan por hie- o hue- llevan H: hielo, huevo, huerto.",
        action: "write",
        text: "hielo · huevo",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Las palabras que empiezan por hum- seguido de vocal: humano, humo, humor.",
        action: "write",
        text: "humano · humor",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Y todas las formas de los verbos haber, hacer, hablar y hallar llevan H.",
        action: "highlight",
        text: "hie- / hue- = H",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Qué palabra con H te costó más trabajo aprender de niño? ¡Cuéntame!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "uso_g_j",
    category: "Ortografía de Letras",
    name: "Uso de la G y la J",
    icon: "🔤",
    summary: "Verbos en -ger, -gir y terminaciones en -aje, -eje",
    steps: [
      {
        speech: "¡Aprende a diferenciar la G y la J ante las vocales E e I!",
        action: "write",
        text: "USO DE LA G Y LA J",
        target: "title",
        camera: "board"
      },
      {
        speech: "Fíjate muy bien en las terminaciones de los verbos y sustantivos clave.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Los verbos terminados en -ger y -gir van con G: recoger, elegir, dirigir.",
        action: "write",
        text: "recoger · dirigir",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Atención a las dos excepciones que van con J!: tejer y crujir.",
        action: "highlight",
        text: "tejer · crujir (J)",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Y las palabras terminadas en -aje y -eje siempre van con J: viaje, equipaje, coraje.",
        action: "write",
        text: "viaje · equipaje",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Recuerdas las dos excepciones con J de tejer y crujir? ¡Coméntalas!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },

  // =========================================================
  // 4. ERRORES GRAMATICALES TÍPICOS
  // =========================================================
  {
    id: "hubo_hubieron",
    category: "Errores Gramaticales",
    name: "¿Hubo o hubieron?",
    icon: "⚠️",
    summary: "El verbo haber impersonal: siempre se dice hubo en singular",
    steps: [
      {
        speech: "¡Uno de los errores más graves del español: decir 'hubieron problemas'!",
        action: "write",
        text: "¿HUBO O HUBIERON?",
        target: "title",
        camera: "board"
      },
      {
        speech: "La RAE explica con total firmeza que el verbo haber es impersonal aquí.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Cuando indica existencia, el verbo haber solo se conjuga en singular: HUBO.",
        action: "write",
        text: "Hubo problemas ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Nunca digas 'hubieron fiestas' ni 'hubieron accidentes'. ¡Es totalmente incorrecto!",
        action: "write",
        text: "Hubieron ✗ (Error)",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Se dice: 'hubo muchas personas', 'hubo dudas', 'hubo aplausos'. ¡Siempre en singular!",
        action: "highlight",
        text: "Hubo problemas ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Has escuchado a alguien decir 'hubieron'? ¡Etiquétalo o comenta!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "habia_habian",
    category: "Errores Gramaticales",
    name: "¿Había o habían personas?",
    icon: "⚠️",
    summary: "Nunca se pluraliza había cuando denota existencia",
    steps: [
      {
        speech: "¡Jamás vuelvas a decir 'habían muchas personas en la fiesta'!",
        action: "write",
        text: "¿HABÍA O HABÍAN?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Al igual que con 'hubo', el verbo haber como existencia no tiene plural.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "La forma correcta es siempre en singular: 'había muchas personas en la fila'.",
        action: "write",
        text: "Había personas ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Decir 'habían diez carros' o 'habían dudas' es un error muy común que debes evitar.",
        action: "write",
        text: "Habían ✗ (Error)",
        target: "example2",
        camera: "board"
      },
      {
        speech: "Aunque el objeto sea plural, el verbo se queda siempre en singular: HABÍA.",
        action: "highlight",
        text: "Había personas ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Conocías esta regla fundamental de la RAE? ¡Déjamelo saber!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "dequeismo",
    category: "Errores Gramaticales",
    name: "El Dequeísmo",
    icon: "⚠️",
    summary: "Diferencia entre pienso que vs pienso de que",
    steps: [
      {
        speech: "¡Hoy eliminamos el dequeísmo de tu vocabulario en 30 segundos!",
        action: "write",
        text: "EL DEQUEÍSMO",
        target: "title",
        camera: "board"
      },
      {
        speech: "Consiste en añadir la palabra 'de' antes de 'que' cuando no hace falta.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Lo correcto es: 'pienso que vendrá', no 'pienso de que vendrá'.",
        action: "write",
        text: "Pienso que ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Tampoco se dice 'me dijo de que vendría', sino 'me dijo que vendría'.",
        action: "write",
        text: "Pienso de que ✗",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Truco con ESO!: Cambia la frase por 'eso': 'Pienso eso' (no 'pienso de eso').",
        action: "highlight",
        text: "Pienso que ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Usas este truco de reemplazar por 'eso'? ¡Pruébalo en los comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },

  // =========================================================
  // 5. CURIOSIDADES LINGÜÍSTICAS Y SIGNOS
  // =========================================================
  {
    id: "la_coma_vocativa",
    category: "Signos y Estilo",
    name: "La Coma Vocativa (Salva Vidas)",
    icon: "📝",
    summary: "Por qué una coma evita el canibalismo: vamos a comer, niños",
    steps: [
      {
        speech: "¡Hoy te enseño por qué una sola coma puede salvar vidas!",
        action: "write",
        text: "LA COMA VOCATIVA",
        target: "title",
        camera: "board"
      },
      {
        speech: "Se llama coma vocativa y sirve para separar a la persona a quien le estás hablando.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "No es lo mismo escribir 'vamos a comer niños' (¡eso es canibalismo!).",
        action: "write",
        text: "Comer niños ✗",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Que escribir 'vamos a comer, niños', con su coma vocativa correcta.",
        action: "write",
        text: "Comer, niños ✓",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡La coma salva vidas!: Siempre que llames a alguien, pon una coma antes o después.",
        action: "highlight",
        text: "Comer, niños ✓",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Te sabías este chiste pedagógico de la coma? ¡Compártelo en comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "signos_dobles",
    category: "Signos y Estilo",
    name: "Signos Dobles: ¡! y ¿?",
    icon: "📝",
    summary: "El español es el único idioma con signos de apertura obligatorios",
    steps: [
      {
        speech: "¡El español es el único idioma del mundo con signos dobles de apertura!",
        action: "write",
        text: "SIGNOS DOBLES ¡! ¿?",
        target: "title",
        camera: "board"
      },
      {
        speech: "Tanto para preguntas como para exclamaciones, la norma RAE es obligatoria.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "Siempre debes abrir con el signo invertido: '¿Cómo estás?', nunca solo al final.",
        action: "write",
        text: "¿Cómo estás? ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "Y en exclamaciones: '¡Qué alegría verte!', con su signo de apertura y de cierre.",
        action: "write",
        text: "¡Qué alegría! ✓",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Orgullo del español!: El signo de apertura avisa la entonación desde el inicio.",
        action: "highlight",
        text: "¿Cómo estás? ✓",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Usas siempre los signos de apertura en tus mensajes? ¡Sé sincero abajo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "palabras_pentavocalicas",
    category: "Curiosidades RAE",
    name: "Palabras con las 5 vocales",
    icon: "✨",
    summary: "Palabras pentavocálicas: murciélago, educación, eucalipto",
    steps: [
      {
        speech: "¡Descubre las fascinantes palabras pentavocálicas de nuestro idioma!",
        action: "write",
        text: "LAS 5 VOCALES",
        target: "title",
        camera: "board"
      },
      {
        speech: "Son palabras curiosas que contienen las cinco vocales: A, E, I, O, U.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "El ejemplo más conocido es murciélago: tiene la U, I, E, A y la O.",
        action: "write",
        text: "murciélago",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¡Otras muy famosas son educación, eucalipto, abuelito y arquitecto!",
        action: "write",
        text: "educación · eucalipto",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡Algunas de ellas tienen las 5 vocales sin repetir ninguna! Asombroso.",
        action: "highlight",
        text: "murciélago (A E I O U)",
        target: "example1",
        camera: "board"
      },
      {
        speech: "¿Te sabes otra palabra con las cinco vocales? ¡Escríbela abajo en comentarios!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  {
    id: "palabras_raras_rae",
    category: "Curiosidades RAE",
    name: "Términos curiosos aceptados por la RAE",
    icon: "✨",
    summary: "Almóndiga, murciégalo, setiembre y amigovio",
    steps: [
      {
        speech: "¡Palabras que seguro pensabas que estaban mal dichas pero la RAE acepta!",
        action: "write",
        text: "ACEPTADOS POR LA RAE",
        target: "title",
        camera: "board"
      },
      {
        speech: "El diccionario incorpora términos populares e históricos que son oficiales.",
        action: "talk",
        text: "",
        target: "intro",
        camera: "teacher"
      },
      {
        speech: "¡La RAE acepta 'almóndiga' como variante antigua de albóndiga, y 'setiembre'!",
        action: "write",
        text: "almóndiga · setiembre",
        target: "example1",
        camera: "board"
      },
      {
        speech: "También están aceptadas 'amigovio' y la forma antigua 'toballa'.",
        action: "write",
        text: "amigovio · toballa",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¡E incluso 'murciégalo', que de hecho fue la forma original en la historia!",
        action: "highlight",
        text: "murciégalo = oficial",
        target: "example2",
        camera: "board"
      },
      {
        speech: "¿Cuál de estas palabras te sorprende más? ¡Cuéntamelo abajo!",
        action: "talk",
        text: "",
        target: "outro",
        camera: "teacher"
      }
    ]
  },
  // =========================================================
  // ASIGNATURAS CURRICULARES (OFICIALES LA PROFE ROCHI)
  // =========================================================
{
    "id": "representaci_n_y_determinaci_n_de_conjuntos",
    "category": "Matemáticas",
    "name": "DETERMINACIÓN DE CONJUNTOS",
    "icon": "📐",
    "summary": "Representación y determinación de conjuntos",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy aprenderemos cómo determinar conjuntos por extensión y comprensión.",
        "action": "write",
        "text": "DETERMINACIÓN DE CONJUNTOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Un conjunto se determina por extensión cuando nombramos cada uno de sus elementos uno a uno.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Y por comprensión cuando mencionamos la característica común que tienen todos ellos.",
        "action": "write",
        "text": "Extensión: V = {a, e, i, o, u}",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Así de fácil y ordenado es el lenguaje matemático!",
        "action": "write",
        "text": "Comprensión: V = {las vocales}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Comprensión: V = {las vocales}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál método te resulta más fácil de usar? ¡Déjamelo en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "relaci_n_de_pertenencia_y_contenencia",
    "category": "Matemáticas",
    "name": "PERTENENCIA Y CONTENENCIA",
    "icon": "🔢",
    "summary": "Relación de pertenencia y contenencia",
    "steps": [
      {
        "speech": "¡Hola a todos! Hoy veremos la diferencia exacta entre pertenencia y contenencia en conjuntos.",
        "action": "write",
        "text": "PERTENENCIA Y CONTENENCIA",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La pertenencia relaciona un elemento con un conjunto, usando el símbolo de euro o pertenencia.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La contenencia relaciona un conjunto completo dentro de otro más grande.",
        "action": "write",
        "text": "Elemento ∈ Conjunto: 5 ∈ Números Impares",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Recuerda!: los elementos pertenecen y los conjuntos se contienen.",
        "action": "write",
        "text": "Subconjunto ⊂ Conjunto: {Pares} ⊂ {Enteros}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Subconjunto ⊂ Conjunto: {Pares} ⊂ {Enteros}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Lo entendiste a la primera? ¡Dale like y sígueme para más matemáticas!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_uni_n_entre_conjuntos_y_c_mo_representarlos",
    "category": "Matemáticas",
    "name": "UNIÓN ENTRE CONJUNTOS",
    "icon": "⭕",
    "summary": "¿Qué es la unión entre conjuntos y cómo representarlos?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy aprenderemos qué es la unión entre conjuntos en menos de un minuto.",
        "action": "write",
        "text": "UNIÓN ENTRE CONJUNTOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La unión reúne todos los elementos de dos o más conjuntos en uno solo, sin repetir ninguno.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Si A tiene 1 y 2, y B tiene 2 y 3, su unión reúne al 1, al 2 y al 3.",
        "action": "write",
        "text": "A ∪ B = {todos los elementos}",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En el diagrama de Venn se sombrea toda la figura completa.",
        "action": "write",
        "text": "A = {1, 2}  B = {2, 3} → A ∪ B = {1, 2, 3}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "A = {1, 2}  B = {2, 3} → A ∪ B = {1, 2, 3}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué conjuntos unirías en tu vida diaria? ¡Comenta abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_intersecci_n_entre_conjuntos",
    "category": "Matemáticas",
    "name": "INTERSECCIÓN DE CONJUNTOS",
    "icon": "🎯",
    "summary": "¿Qué es la intersección entre conjuntos?",
    "steps": [
      {
        "speech": "¡Hola! Hoy te enseño qué es la intersección entre conjuntos con un truco visual facilísimo.",
        "action": "write",
        "text": "INTERSECCIÓN DE CONJUNTOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La intersección solo toma los elementos que se repiten al mismo tiempo en ambos conjuntos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Por ejemplo, si A tiene rojo y azul, y B tiene azul y verde, el elemento común es azul.",
        "action": "write",
        "text": "A ∩ B = {elementos comunes}",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "En el dibujo es justo el pedacito del centro donde ambos círculos se cruzan.",
        "action": "write",
        "text": "A ∩ B = {azul}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "A ∩ B = {azul}",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Tienes preguntas sobre conjuntos? ¡Escríbemelas aquí!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "sistema_de_numeraci_n_decimal_hasta_10_000",
    "category": "Matemáticas",
    "name": "NUMERACIÓN HASTA 10.000",
    "icon": "📊",
    "summary": "Sistema de numeración decimal hasta 10.000",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Vamos a repasar el valor posicional de los números hasta 10.000.",
        "action": "write",
        "text": "NUMERACIÓN HASTA 10.000",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cada posición tiene un valor diez veces mayor que la anterior: unidades, decenas y centenas.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "En el número 7.425, el 7 vale 7.000 unidades porque está en las unidades de mil.",
        "action": "write",
        "text": "U (1) | D (10) | C (100) | UM (1.000)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Dominar el valor posicional te hará un experto en sumas y restas!",
        "action": "write",
        "text": "7.425 = 7.000 + 400 + 20 + 5",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "7.425 = 7.000 + 400 + 20 + 5",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuánto vale el 4 en 4.500? ¡Respóndeme en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "descomposici_n_de_n_meros_hasta_100_000",
    "category": "Matemáticas",
    "name": "DESCOMPOSICIÓN HASTA 100.000",
    "icon": "🧮",
    "summary": "Descomposición de números hasta 100.000",
    "steps": [
      {
        "speech": "¡Hola! Hoy descompondremos números de cinco cifras de forma rápida y sencilla.",
        "action": "write",
        "text": "DESCOMPOSICIÓN HASTA 100.000",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Descomponer es separar un número según la suma del valor de cada una de sus cifras.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Por ejemplo: 85.340 se descompone en 80.000 más 5.000 más 300 más 40.",
        "action": "write",
        "text": "DM | UM | C | D | U",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Cada cero representa el salto de una posición hacia la izquierda!",
        "action": "write",
        "text": "85.340 = 80.000 + 5.000 + 300 + 40",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "85.340 = 80.000 + 5.000 + 300 + 40",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te gustaría que hagamos ejercicios de seis cifras? ¡Cuéntamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "comparaci_n_de_n_meros_hasta_100_000",
    "category": "Matemáticas",
    "name": "COMPARACIÓN DE NÚMEROS",
    "icon": "⚖️",
    "summary": "Comparación de números hasta 100.000",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy aprenderemos a comparar números grandes con los signos mayor y menor.",
        "action": "write",
        "text": "COMPARACIÓN DE NÚMEROS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Siempre empezamos comparando la cifra de mayor valor de izquierda a derecha.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Si comparamos 45.800 con 45.300, las centenas deciden: el 8 es mayor que el 3.",
        "action": "write",
        "text": "> (Mayor que) | < (Menor que) | = (Igual)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡La boca del cocodrilo siempre se come al número más grande!",
        "action": "write",
        "text": "45.800 > 45.300",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "45.800 > 45.300",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué número es mayor: 99.001 o 99.100? ¡Pon tu respuesta abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "adici_n_o_suma_de_n_meros_hasta_100_mil",
    "category": "Matemáticas",
    "name": "SUMA HASTA 100.000",
    "icon": "➕",
    "summary": "Adición o suma de números hasta 100 mil",
    "steps": [
      {
        "speech": "¡Hola a todos! Hoy repasaremos la suma con reagrupación o llevando de forma impecable.",
        "action": "write",
        "text": "SUMA HASTA 100.000",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "El secreto infalible es alinear perfectamente unidades con unidades y decenas con decenas.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Si sumamos 38.450 más 24.380, sumamos columna por columna llevando al orden superior.",
        "action": "write",
        "text": "Alinear columnas: U, D, C, UM, DM",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Nunca olvides sumar la cifra que llevas arriba en la siguiente columna!",
        "action": "write",
        "text": "38.450 + 24.380 = 62.830",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "38.450 + 24.380 = 62.830",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te confunden las sumas llevando? ¡Déjame tus dudas para ayudarte!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "truco_para_aprender_la_tabla_del_2",
    "category": "Matemáticas",
    "name": "TRUCO TABLA DEL 2",
    "icon": "✌️",
    "summary": "Truco para aprender la tabla del 2",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! La tabla del 2 es la más fácil del mundo si usas este truco.",
        "action": "write",
        "text": "TRUCO TABLA DEL 2",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Multiplicar por 2 es exactamente igual a sumar el mismo número dos veces, ¡su doble!",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "2 por 7 es simplemente 7 más 7, que da 14. ¡Y 2 por 8 es 8 más 8, que da 16!",
        "action": "write",
        "text": "Tabla del 2 = El Doble del Número",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Todos los resultados de la tabla del dos terminan en número par: 0, 2, 4, 6 u 8!",
        "action": "write",
        "text": "2 × 7 = 14  |  2 × 8 = 16",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "2 × 7 = 14  |  2 × 8 = 16",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuánto es 2 por 9? ¡Respóndeme sin calculadora en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "tabla_de_multiplicar_del_n_mero_3",
    "category": "Matemáticas",
    "name": "TABLA DEL 3 EN PATRONES",
    "icon": "3️⃣",
    "summary": "Tabla de multiplicar del número 3",
    "steps": [
      {
        "speech": "¡Hola! Hoy memorizarás la tabla del 3 con un patrón numérico genial.",
        "action": "write",
        "text": "TABLA DEL 3 EN PATRONES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Multiplicar por tres significa dar saltos triples en la recta numérica.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Fíjate en las sumas de sus cifras: 12 suma 3, 15 suma 6, 18 suma 9. ¡Siempre múltiplos de 3!",
        "action": "write",
        "text": "Serie del 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Si sumas las cifras del resultado y da 3, 6 o 9, tu multiplicación está perfecta!",
        "action": "write",
        "text": "3 × 6 = 18  |  3 × 7 = 21  |  3 × 8 = 24",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "3 × 6 = 18  |  3 × 7 = 21  |  3 × 8 = 24",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál tabla se te hace más difícil? ¡Pídemela en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_c_lula_y_cu_les_son_sus_partes",
    "category": "Ciencias Naturales",
    "name": "LA CÉLULA Y SUS PARTES",
    "icon": "🔬",
    "summary": "¿Qué es la célula y cuáles son sus partes?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy viajaremos al interior de la unidad básica de toda la vida: la célula.",
        "action": "write",
        "text": "LA CÉLULA Y SUS PARTES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Todos los seres vivos estamos formados por células, y todas tienen tres partes fundamentales.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La membrana la protege, el citoplasma contiene los organelos y el núcleo guarda el ADN.",
        "action": "write",
        "text": "1. Membrana  2. Citoplasma  3. Núcleo",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡El núcleo funciona exactamente como el cerebro de la célula!",
        "action": "write",
        "text": "Núcleo = Centro de Control (ADN)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Núcleo = Centro de Control (ADN)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Sabías cuántas células tiene el cuerpo humano? ¡Son billones! ¡Comenta si lo sabías!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "partes_de_la_c_lula_animal_y_vegetal",
    "category": "Ciencias Naturales",
    "name": "CÉLULA ANIMAL VS VEGETAL",
    "icon": "🌱",
    "summary": "Partes de la célula animal y vegetal",
    "steps": [
      {
        "speech": "¡Hola a todos! ¿Sabes qué diferencia a una célula vegetal de una célula animal?",
        "action": "write",
        "text": "CÉLULA ANIMAL VS VEGETAL",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Las células vegetales tienen dos estructuras únicas que los animales no poseemos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Los cloroplastos capturan la luz solar para la fotosíntesis y la pared le da rigidez.",
        "action": "write",
        "text": "Vegetal: Pared Celular + Cloroplastos",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Por eso las plantas son verdes y pueden fabricar su propio alimento!",
        "action": "write",
        "text": "Cloroplastos = Fotosíntesis (Clorofila)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Cloroplastos = Fotosíntesis (Clorofila)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Tienes plantas en casa? ¡Cuéntame en los comentarios qué especies cuidas!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_son_los_los_tejidos_vegetales",
    "category": "Ciencias Naturales",
    "name": "TEJIDOS VEGETALES",
    "icon": "🌿",
    "summary": "¿Qué son los los tejidos vegetales?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy descubriremos cómo se organizan las células de las plantas en tejidos.",
        "action": "write",
        "text": "TEJIDOS VEGETALES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Las plantas tienen tejidos especializados para crecer, sostenerse y transportar nutrientes.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "El xilema transporta el agua y minerales desde la raíz, y el floema distribuye la savia elaborada.",
        "action": "write",
        "text": "Tejidos: Crecimiento, Protección, Conducción",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Son las venas y arterias del mundo vegetal!",
        "action": "write",
        "text": "Xilema: Savia Bruta  |  Floema: Savia Elaborada",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Xilema: Savia Bruta  |  Floema: Savia Elaborada",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Sabías que los árboles respiran por sus hojas? ¡Comenta abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "caracter_sticas_de_los_tejidos_animales",
    "category": "Ciencias Naturales",
    "name": "TEJIDOS ANIMALES",
    "icon": "🦁",
    "summary": "Características de los tejidos animales",
    "steps": [
      {
        "speech": "¡Hola! En esta lección aprenderemos los cuatro grandes tipos de tejidos en los animales.",
        "action": "write",
        "text": "TEJIDOS ANIMALES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Nuestro cuerpo combina cuatro tejidos para realizar todas sus funciones vitales.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "El epitelial cubre la piel, el muscular produce movimiento y el nervioso transmite impulsos.",
        "action": "write",
        "text": "1. Epitelial  2. Conectivo  3. Muscular  4. Nervioso",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Trabajan en perfecta sincronía cada segundo de nuestra vida!",
        "action": "write",
        "text": "Nervioso: Neuronas  |  Muscular: Movimiento",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Nervioso: Neuronas  |  Muscular: Movimiento",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál tejido crees que es el más resistente? ¡Déjamelo aquí en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_rotaci_n_y_traslaci_n_de_la_tierra",
    "category": "Ciencias Naturales",
    "name": "ROTACIÓN Y TRASLACIÓN",
    "icon": "🌍",
    "summary": "¿Qué es la rotación y traslación de la tierra?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! La Tierra nunca para de moverse, y hoy entenderás sus dos movimientos.",
        "action": "write",
        "text": "ROTACIÓN Y TRASLACIÓN",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La rotación es el giro sobre su propio eje y dura 24 horas, produciendo el día y la noche.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La traslación es la vuelta completa alrededor del Sol, dura 365 días y causa las estaciones.",
        "action": "write",
        "text": "Rotación: 24 horas → Día y Noche",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Mientras tú ves este video estamos viajando a miles de kilómetros por hora por el espacio!",
        "action": "write",
        "text": "Traslación: 365 días → Estaciones del Año",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Traslación: 365 días → Estaciones del Año",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál es tu estación del año favorita? ¡Coméntamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "cu_les_son_los_las_capas_de_la_tierra_por_cu_l_capa_viajan_los_aviones",
    "category": "Ciencias Naturales",
    "name": "CAPAS DE LA ATMÓSFERA",
    "icon": "✈️",
    "summary": "¿Cuáles son los las capas de la tierra? ¿Por cuál capa viajan los aviones?",
    "steps": [
      {
        "speech": "¡Hola a todos! ¿Alguna vez te has preguntado por cuál capa del cielo vuelan los aviones comerciales?",
        "action": "write",
        "text": "CAPAS DE LA ATMÓSFERA",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La atmósfera se divide en cinco capas: troposfera, estratosfera, mesosfera, termosfera y exosfera.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Los aviones comerciales vuelan en la parte baja de la estratosfera para evitar las tormentas.",
        "action": "write",
        "text": "Capas: Troposfera, Estratosfera, Mesosfera",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Allí el aire es más estable y ahorran mucho combustible!",
        "action": "write",
        "text": "Aviones: Estratosfera (~10.000 a 12.000 m)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Aviones: Estratosfera (~10.000 a 12.000 m)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te da miedo volar en avión? ¡Cuéntame tu experiencia en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "partes_del_sistema_seo_articular_y_muscular_del_cuerpo_humano",
    "category": "Ciencias Naturales",
    "name": "SISTEMA LOCOMOTOR",
    "icon": "🦴",
    "summary": "Partes del sistema óseo, articular y muscular del cuerpo humano",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy conoceremos la increíble máquina que nos permite caminar y correr.",
        "action": "write",
        "text": "SISTEMA LOCOMOTOR",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "El sistema locomotor está formado por huesos, articulaciones y músculos trabajando juntos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Tenemos 206 huesos que dan soporte, articulaciones para doblarnos y más de 600 músculos.",
        "action": "write",
        "text": "Locomotor = Huesos + Articulaciones + Músculos",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡El fémur en el muslo es el hueso más largo y fuerte de todo nuestro cuerpo!",
        "action": "write",
        "text": "206 Huesos | +600 Músculos",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "206 Huesos | +600 Músculos",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Haces ejercicio a diario para cuidar tus músculos? ¡Déjamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "cu_les_son_las_regiones_naturales_de_colombia",
    "category": "Ciencias Sociales",
    "name": "REGIONES NATURALES DE COLOMBIA",
    "icon": "🗺️",
    "summary": "¿Cuáles son las regiones naturales de Colombia?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Colombia es uno de los países más biodiversos del planeta gracias a sus 6 regiones.",
        "action": "write",
        "text": "REGIONES NATURALES DE COLOMBIA",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cada región tiene su propio clima, relieve, fauna, flora y hermosas tradiciones culturales.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La Andina tiene las cordilleras, el Caribe sus costas y la Amazonía la mayor selva del mundo.",
        "action": "write",
        "text": "6 Regiones: Andina, Caribe, Pacífica, Orinoquía, Amazonía, Insular",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Somos el segundo país con mayor biodiversidad en todo el planeta Tierra!",
        "action": "write",
        "text": "Andina (Cordilleras) | Caribe (Playas) | Amazonía (Selva)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Andina (Cordilleras) | Caribe (Playas) | Amazonía (Selva)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿De qué región de Colombia o del mundo me estás viendo? ¡Coméntalo aquí!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "departamentos_y_capitales_de_colombia",
    "category": "Ciencias Sociales",
    "name": "DEPARTAMENTOS DE COLOMBIA",
    "icon": "🇨🇴",
    "summary": "Departamentos y Capitales de Colombia",
    "steps": [
      {
        "speech": "¡Hola a todos! Hoy repasaremos la división política de Colombia de forma rápida y entretenida.",
        "action": "write",
        "text": "DEPARTAMENTOS DE COLOMBIA",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Colombia está organizada territorialmente en 32 departamentos y un Distrito Capital.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Por ejemplo: Antioquia su capital es Medellín, Valle del Cauca es Cali, y Atlántico es Barranquilla.",
        "action": "write",
        "text": "32 Departamentos + Bogotá Distrito Capital",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Conocer la geografía de nuestro país nos ayuda a valorar su riqueza cultural!",
        "action": "write",
        "text": "Antioquia: Medellín | Valle: Cali | Atlántico: Barranquilla",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Antioquia: Medellín | Valle: Cali | Atlántico: Barranquilla",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te sabes la capital de tu departamento? ¡Demuéstralo en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "cu_les_son_los_sectores_econ_micos_de_colombia",
    "category": "Ciencias Sociales",
    "name": "SECTORES ECONÓMICOS",
    "icon": "💼",
    "summary": "¿Cuáles son los sectores económicos de Colombia?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy aprenderemos cómo se divide la economía y el trabajo en nuestra sociedad.",
        "action": "write",
        "text": "SECTORES ECONÓMICOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Las actividades económicas se clasifican tradicionalmente en tres grandes sectores productivos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "El primario extrae materias primas, el secundario las transforma en fábricas y el terciario ofrece servicios.",
        "action": "write",
        "text": "1. Primario  2. Secundario  3. Terciario",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡La educación y el turismo pertenecen con orgullo al sector terciario!",
        "action": "write",
        "text": "Primario: Agricultura | Secundario: Industria | Terciario: Servicios",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Primario: Agricultura | Secundario: Industria | Terciario: Servicios",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿En cuál sector trabajan en tu familia? ¡Cuéntamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "cu_les_son_los_puntos_cardinales_c_mo_ubicarnos",
    "category": "Ciencias Sociales",
    "name": "PUNTOS CARDINALES",
    "icon": "🧭",
    "summary": "¿Cuáles son los puntos cardinales? ¿Cómo ubicarnos?",
    "steps": [
      {
        "speech": "¡Hola! Si alguna vez te pierdes, este truco con los puntos cardinales te salvará la vida.",
        "action": "write",
        "text": "PUNTOS CARDINALES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los cuatro puntos cardinales universales son: Norte, Sur, Este y Oeste.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Extiende tu brazo derecho hacia donde sale el Sol por la mañana: ¡ese siempre es el Este!",
        "action": "write",
        "text": "Norte (N) | Sur (S) | Este (E) | Oeste (O/W)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Tu brazo izquierdo apuntará al Oeste, tu frente al Norte y tu espalda al Sur!",
        "action": "write",
        "text": "Brazo Derecho al Sol naciente = ESTE",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Brazo Derecho al Sol naciente = ESTE",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Sabes hacia qué punto cardinal mira la puerta de tu casa? ¡Déjamelo aquí!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_un_sustantivo_clasificaci_n",
    "category": "Lengua Castellana",
    "name": "EL SUSTANTIVO Y SU CLASES",
    "icon": "📖",
    "summary": "¿Qué es un sustantivo? Clasificación",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy dominaremos el sustantivo, la palabra que le da nombre a todo lo que existe.",
        "action": "write",
        "text": "EL SUSTANTIVO Y SU CLASES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Un sustantivo nombra personas, animales, lugares, objetos, ideas y sentimientos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Se clasifican en propios como 'Colombia', comunes como 'perro', concretos como 'mesa' y abstractos como 'amor'.",
        "action": "write",
        "text": "Sustantivos: Nombran personas, lugares y cosas",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Recuerda que todos los sustantivos propios siempre se escriben con mayúscula inicial!",
        "action": "write",
        "text": "Propios (Rochi) vs Comunes (profe) | Abstractos (paz)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Propios (Rochi) vs Comunes (profe) | Abstractos (paz)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Escribe un sustantivo abstracto aquí en los comentarios, ¡los leo a todos!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "el_acento_y_la_tilde_t_cnica_sega",
    "category": "Lengua Castellana",
    "name": "TÉCNICA S.E.G.A. PARA TILDES",
    "icon": "✍️",
    "summary": "El acento y la tilde (técnica SEGA)",
    "steps": [
      {
        "speech": "¡Hola! El método SEGA de La Profe Rochi es el truco definitivo para no dudar nunca de una tilde.",
        "action": "write",
        "text": "TÉCNICA S.E.G.A. PARA TILDES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "SEGA representa las cuatro posiciones del acento de derecha a izquierda en la palabra.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Aguda en la última sílaba, Grave en la penúltima, Esdrújula en la antepenúltima y Sobresdrújula antes.",
        "action": "write",
        "text": "S (Sobresdrújula) - E (Esdrújula) - G (Grave) - A (Aguda)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Las esdrújulas y sobresdrújulas siempre llevan tilde sin ninguna excepción!",
        "action": "write",
        "text": "Última = Aguda | Penúltima = Grave | Antepenúltima = Esdrújula",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Última = Aguda | Penúltima = Grave | Antepenúltima = Esdrújula",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Te aprendiste la palabra SEGA? ¡Guarda este video para tu próximo examen!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_son_los_adjetivos_clasificaci_n",
    "category": "Lengua Castellana",
    "name": "LOS ADJETIVOS",
    "icon": "✨",
    "summary": "¿Qué son los adjetivos? Clasificación",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Hoy aprenderemos a darle color y vida a nuestras oraciones con los adjetivos.",
        "action": "write",
        "text": "LOS ADJETIVOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "El adjetivo es la palabra que acompaña al sustantivo para indicar cómo es o expresar una cualidad.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Pueden ser calificativos como 'inteligente', demostrativos como 'este libro' o posesivos como 'mi pizarra'.",
        "action": "write",
        "text": "Adjetivo: Expresa cualidades del sustantivo",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡El adjetivo siempre debe concordar en género y número con el sustantivo!",
        "action": "write",
        "text": "Calificativos: roja, brillante, simpática",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Calificativos: roja, brillante, simpática",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué adjetivo le pondrías a nuestra clase de hoy? ¡Déjamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_el_verbo_regulares_e_irregulares",
    "category": "Lengua Castellana",
    "name": "VERBOS REGULARES E IRREGULARES",
    "icon": "🏃",
    "summary": "¿Qué es el verbo? Regulares e irregulares",
    "steps": [
      {
        "speech": "¡Hola a todos! El verbo es el motor de toda oración porque indica acción, estado o proceso.",
        "action": "write",
        "text": "VERBOS REGULARES E IRREGULARES",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los verbos regulares mantienen su raíz al conjugarse, como cantar, canté y cantaré.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Los irregulares cambian su raíz o sus terminaciones por completo, como el verbo ir: voy, fui, iré.",
        "action": "write",
        "text": "Regular: cant-ar → cant-o, cant-é, cant-aré",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Saber conjugar verbos te abrirá las puertas para escribir ensayos perfectos!",
        "action": "write",
        "text": "Irregular: ir → voy, fui, iré",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Irregular: ir → voy, fui, iré",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál es tu verbo favorito para describir tu día? ¡Comenta abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_son_los_sin_nimos_y_ant_nimos",
    "category": "Lengua Castellana",
    "name": "SINÓNIMOS Y ANTÓNIMOS",
    "icon": "🔄",
    "summary": "¿Qué son los sinónimos y antónimos?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Enriquece tu vocabulario en 30 segundos con sinónimos y antónimos.",
        "action": "write",
        "text": "SINÓNIMOS Y ANTÓNIMOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los sinónimos son palabras que significan lo mismo o muy parecido, como feliz y contento.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Los antónimos son palabras que tienen significados totalmente contrarios, como claro y oscuro.",
        "action": "write",
        "text": "Sinónimos (=): feliz = alegre = contento",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Usar sinónimos evita que repitas las mismas palabras al redactar un texto!",
        "action": "write",
        "text": "Antónimos (≠): grande ≠ pequeño | frío ≠ caliente",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Antónimos (≠): grande ≠ pequeño | frío ≠ caliente",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cuál es el antónimo de valiente? ¡Déjamelo aquí en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "los_n_meros_en_ingl_s_the_numbers",
    "category": "Inglés",
    "name": "THE NUMBERS (1 TO 20)",
    "icon": "🇬🇧",
    "summary": "Los números en inglés - The numbers",
    "steps": [
      {
        "speech": "Hello, my students! Welcome to your English class. Today we learn numbers from one to twenty.",
        "action": "write",
        "text": "THE NUMBERS (1 TO 20)",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los números del uno al diez son la base de todo: one, two, three, four, five.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Y del 13 al 19 todos terminan en teen: thirteen, fourteen, fifteen, sixteen, twenty!",
        "action": "write",
        "text": "1: One | 2: Two | 3: Three | 4: Four | 5: Five",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Remember: practice pronunciation aloud every day!",
        "action": "write",
        "text": "13: Thirteen | 14: Fourteen | 20: Twenty",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "13: Thirteen | 14: Fourteen | 20: Twenty",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "What is your lucky number? Write it in English in the comments!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "los_colores_en_ingl_s_the_colors",
    "category": "Inglés",
    "name": "THE COLORS IN ENGLISH",
    "icon": "🎨",
    "summary": "Los colores en inglés - The colors",
    "steps": [
      {
        "speech": "Hello everyone! Today we will learn the most vibrant colors in English.",
        "action": "write",
        "text": "THE COLORS IN ENGLISH",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los colores primarios son muy sencillos de pronunciar y recordar.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Combinándolos obtenemos: Green para verde, Purple para morado y Orange para naranja.",
        "action": "write",
        "text": "Red (Rojo) | Blue (Azul) | Yellow (Amarillo)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "In English, the color always goes BEFORE the noun: a red dress!",
        "action": "write",
        "text": "Green (Verde) | Purple (Morado) | Orange (Naranja)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Green (Verde) | Purple (Morado) | Orange (Naranja)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "What is your favorite color? Tell me in English below!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "partes_de_la_casa_parts_of_the_house",
    "category": "Inglés",
    "name": "PARTS OF THE HOUSE",
    "icon": "🏠",
    "summary": "Partes de la casa - Parts of the house",
    "steps": [
      {
        "speech": "Welcome to your English lesson! Let's take a tour around the house.",
        "action": "write",
        "text": "PARTS OF THE HOUSE",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Cada habitación de tu hogar tiene un nombre especial en inglés.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Bedroom es el dormitorio, Bathroom es el baño y Garden es el jardín.",
        "action": "write",
        "text": "Living Room (Sala) | Kitchen (Cocina)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "Where do you sleep? In the bedroom!",
        "action": "write",
        "text": "Bedroom (Habitación) | Bathroom (Baño) | Garden (Jardín)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Bedroom (Habitación) | Bathroom (Baño) | Garden (Jardín)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Which is your favorite room at home? Leave your comment!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "los_tiles_escolares_the_school_materials",
    "category": "Inglés",
    "name": "SCHOOL MATERIALS",
    "icon": "🎒",
    "summary": "Los útiles escolares - The school materials",
    "steps": [
      {
        "speech": "Hello students! Let's open our backpack and name our school supplies in English.",
        "action": "write",
        "text": "SCHOOL MATERIALS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Los elementos que usamos todos los días en la escuela son facilísimos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Para corregir usamos Eraser, para medir Ruler y para guardar todo Backpack.",
        "action": "write",
        "text": "Book (Libro) | Pencil (Lápiz) | Pen (Bolígrafo)",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "And of course, Whiteboard is our beloved pizarra!",
        "action": "write",
        "text": "Eraser (Borrador) | Ruler (Regla) | Backpack (Mochila)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Eraser (Borrador) | Ruler (Regla) | Backpack (Mochila)",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "Which item do you always forget in your backpack? Comment below!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_son_los_conflictos_y_la_agresi_n",
    "category": "Ética y Valores",
    "name": "RESOLUCIÓN DE CONFLICTOS",
    "icon": "🕊️",
    "summary": "¿Qué son los conflictos y la agresión?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! Los desacuerdos son naturales en la vida, pero la agresión nunca es la solución.",
        "action": "write",
        "text": "RESOLUCIÓN DE CONFLICTOS",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Un conflicto surge cuando dos personas tienen opiniones o deseos diferentes sobre una situación.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La clave ética es la asertividad: expresar lo que sentimos con respeto y sin lastimar a los demás.",
        "action": "write",
        "text": "Conflicto ≠ Agresión | Diálogo = Solución",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡La empatía y el diálogo son las mayores herramientas de los seres humanos!",
        "action": "write",
        "text": "Paso 1: Respirar | Paso 2: Escuchar | Paso 3: Acordar",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Paso 1: Respirar | Paso 2: Escuchar | Paso 3: Acordar",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Cómo resuelves un desacuerdo con tus amigos? ¡Cuéntamelo abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_democracia_y_la_responsabilidad_social",
    "category": "Ética y Valores",
    "name": "DEMOCRACIA Y PARTICIPACIÓN",
    "icon": "🤝",
    "summary": "¿Qué es la democracia y la responsabilidad social?",
    "steps": [
      {
        "speech": "¡Hola a todos! La democracia no es solo votar, es una forma de convivir con justicia y respeto.",
        "action": "write",
        "text": "DEMOCRACIA Y PARTICIPACIÓN",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "Vivir en democracia significa que la voz de todos cuenta y que los derechos humanos son protegidos.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "La responsabilidad social es nuestro deber de cuidar el bienestar de nuestra comunidad y entorno.",
        "action": "write",
        "text": "Democracia = Participación + Respeto Mutuo",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Pequeñas acciones solidarias construyen un país mucho más pacífico!",
        "action": "write",
        "text": "Mis Derechos terminan donde empiezan los de los demás",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Mis Derechos terminan donde empiezan los de los demás",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué acción buena hiciste hoy por alguien más? ¡Compártela en los comentarios!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  },
  {
    "id": "qu_es_la_responsabilidad_con_el_medio_ambiente",
    "category": "Ética y Valores",
    "name": "CUIDADO DEL MEDIO AMBIENTE",
    "icon": "🌍",
    "summary": "¿Qué es la responsabilidad con el medio ambiente?",
    "steps": [
      {
        "speech": "¡Hola, mis estudiantes! La Tierra es nuestro único hogar y cuidarla es una responsabilidad ética de todos.",
        "action": "write",
        "text": "CUIDADO DEL MEDIO AMBIENTE",
        "target": "title",
        "camera": "board"
      },
      {
        "speech": "La regla de las tres erres ecológicas es el primer paso que todos podemos aplicar desde casa.",
        "action": "talk",
        "text": "",
        "target": "intro",
        "camera": "teacher"
      },
      {
        "speech": "Ahorra agua al cepillarte, apaga las luces que no uses y evita los plásticos de un solo uso.",
        "action": "write",
        "text": "Las 3 R: Reducir, Reutilizar y Reciclar",
        "target": "example1",
        "camera": "board"
      },
      {
        "speech": "¡Cuidar la naturaleza es el mayor acto de amor hacia las futuras generaciones!",
        "action": "write",
        "text": "Ahorrar Agua + Apagar Luces + Sembrar Árboles",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¡Fíjate con atención en cómo se aplica la regla en la pizarra!",
        "action": "highlight",
        "text": "Ahorrar Agua + Apagar Luces + Sembrar Árboles",
        "target": "example2",
        "camera": "board"
      },
      {
        "speech": "¿Qué haces tú en casa para cuidar el planeta? ¡Déjame tus ideas abajo!",
        "action": "talk",
        "text": "",
        "target": "outro",
        "camera": "teacher"
      }
    ]
  }
];

// Hacer accesible en entorno global de forma inmediata y auto-poblar selector si ya existe
if (typeof window !== "undefined") {
  window.RAE_TOPICS = RAE_TOPICS;
  window.PROFE_TOPICS = RAE_TOPICS;
  if (typeof window.initTopicsSelector === "function") {
    try { window.initTopicsSelector(); } catch (e) { console.error("Error al auto-poblar selector de temas:", e); }
  }
}
