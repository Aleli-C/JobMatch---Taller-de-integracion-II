// ===============================================
// TIPOS DE DATOS DEL FORO
// ===============================================
export type Comment = { 
  id?: number; // OPCIONAL PARA LOS MOCKS QUE NO INCLUYEN ID
  author: string; 
  text: string; 
  time: string; // FECHA O TEXTO RELATIVO (EJ: "HACE 5 MINUTOS")
  likes?: number; // OPCIONAL PARA LOS MOCKS QUE NO INCLUYEN LIKES
};

export type Topic = {
  id: number; // AHORA ES REQUERIDO PARA BUSCAR EL DETALLE
  title: string;
  content: string;
  author: string;
  time: string;
  replies: number;
  comments: Comment[];
};

// ===============================================
// DATOS SIMULADOS INICIALES (MOCK DATA)
// ESTO SIMULA LA BASE DE DATOS DEL FORO.
// ===============================================
const INITIAL_TOPICS: Topic[] = [
  {
    id: 1,
    title: "DUDAS SOBRE CONTRATOS FREELANCE",
    content: "HE ESTADO REVISANDO VARIOS TIPOS DE CONTRATOS PARA PROYECTOS REMOTOS Y ME GUSTARÍA SABER CUÁL ES EL MÁS SEGURO EN TÉRMINOS DE PROPIEDAD INTELECTUAL PARA DISEÑADORES. ¿ALGUNA EXPERIENCIA O RECOMENDACIÓN?",
    author: "PEDRO R.",
    time: "HACE 2 HORAS",
    replies: 2,
    comments: [
      { id: 10, author: "PEDRO R.", text: "TEXTO ORIGINAL DEL TEMA.", time: "HACE 2 HORAS", likes: 5 },
      { id: 11, author: "LAURA M.", text: "YO SIEMPRE USO UN ACUERDO DE LICENCIA POR PROYECTO, ES MÁS FLEXIBLE Y CLARO PARA AMBAS PARTES.", time: "HACE 1 HORA", likes: 12 },
      { id: 12, author: "JAVIER S.", text: "RECOMIENDO INCLUIR SIEMPRE UNA CLÁUSULA DE RESCISIÓN CLARA.", time: "HACE 30 MINUTOS", likes: 3 }
    ],
  },
  {
    id: 2,
    title: "MEJORES HERRAMIENTAS DE DISEÑO UI/UX",
    content: "ESTOY EVALUANDO CAMBIAR DE HERRAMIENTA PRINCIPAL. ¿FIGMA, SKETCH O ADOBE XD? ¿CUÁL ES EL ESTÁNDAR DE LA INDUSTRIA FREELANCE HOY EN DÍA? ME INTERESAN LAS FUNCIONES DE COLABORACIÓN EN TIEMPO REAL.",
    author: "SOFIA T.",
    time: "AYER",
    replies: 12,
    comments: [
      { id: 20, author: "SOFIA T.", text: "TEXTO ORIGINAL DEL TEMA.", time: "AYER", likes: 15 },
    ],
  },
  {
    id: 3,
    title: "CONSEJOS PARA PRIMEROS PROYECTOS EN REMOTO",
    content: "SOY NUEVA EN ESTO. ¿CUÁL ES EL MEJOR CONSEJO PARA UN PRIMER PROYECTO REMOTO EN JOBMATCH? ¿DEBO EMPEZAR CON PRECIOS BAJOS?",
    author: "ANA L.",
    time: "HACE 5 MINUTOS",
    replies: 1,
    comments: [
      { id: 30, author: "ANA L.", text: "TEXTO ORIGINAL DEL TEMA.", time: "HACE 5 MINUTOS", likes: 8 },
      { id: 31, author: "MIGUEL P.", text: "NO BAJES TUS PRECIOS, DEMUESTRA TU VALOR. EMPIEZA CON PROYECTOS PEQUEÑOS PERO BIEN REMUNERADOS.", time: "HACE 1 MINUTO", likes: 20 }
    ],
  },
];


// ===============================================
// FUNCIONES DE OBTENCIÓN DE DATOS (GETFORUM Y DETAILFORUM SIMULADAS)
// ===============================================

/**
 * IMPLEMENTACION DE GETFORUM (A TRAVES DE GET_FORUMS).
 * DEVUELVE LA LISTA COMPLETA DE TEMAS DESPUÉS DE UN RETRASO SIMULADO.
 * @returns PROMISE<TOPIC[]> LISTA DE TEMAS.
 */
export const GET_FORUMS = async (): Promise<Topic[]> => {
  // SIMULA UN RETRASO DE RED
  await new Promise(resolve => setTimeout(resolve, 500));
  return INITIAL_TOPICS;
};

/**
 * IMPLEMENTACION DE DETAILFORUM (A TRAVES DE GET_FORUM_DETAIL).
 * BUSCA UN TEMA POR SU ID Y DEVUELVE SUS DETALLES COMPLETOS.
 * @param FORUMID ID DEL TEMA A BUSCAR.
 * @returns PROMISE<TOPIC | UNDEFINED> DETALLE DEL TEMA O UNDEFINED SI NO SE ENCUENTRA.
 */
export const GET_FORUM_DETAIL = async (forumId: number): Promise<Topic | undefined> => {
  // SIMULA UN RETRASO DE RED
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const topic = INITIAL_TOPICS.find(t => t.id === forumId);
  return topic;
};
