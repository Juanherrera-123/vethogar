export type LegalDocumentKey = "terms" | "privacy" | "cookies";

export type LegalDocumentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalDocumentSection[];
};

export const legalDocuments: Record<LegalDocumentKey, LegalDocument> = {
  terms: {
    title: "Terminos y Condiciones",
    lastUpdated: "16 de febrero de 2026",
    intro:
      "Estos terminos regulan el uso de Vethogar. Al registrarte o navegar en la plataforma, aceptas estas condiciones.",
    sections: [
      {
        title: "1. Alcance del servicio",
        paragraphs: [
          "Vethogar conecta tutores de mascotas con veterinarios y clinicas veterinarias.",
          "La plataforma facilita la visibilidad de perfiles, contacto y gestion de solicitudes de verificacion.",
        ],
      },
      {
        title: "2. Registro y cuentas",
        paragraphs: [
          "Cada usuario es responsable de la veracidad de los datos que registra.",
          "Para perfiles profesionales, la aprobacion depende de la revision documental por parte del administrador.",
        ],
        bullets: [
          "No compartas tus credenciales con terceros.",
          "Debes actualizar tus datos cuando haya cambios relevantes.",
          "Podemos suspender cuentas con informacion falsa o uso indebido.",
        ],
      },
      {
        title: "3. Uso permitido",
        paragraphs: [
          "No esta permitido usar Vethogar para actividades fraudulentas, suplantacion, spam o cualquier conducta ilegal.",
          "Tampoco se permite publicar contenido ofensivo, engañoso o que vulnere derechos de terceros.",
        ],
      },
      {
        title: "4. Relacion entre usuarios y profesionales",
        paragraphs: [
          "Vethogar actua como intermediario tecnologico y no reemplaza la consulta veterinaria profesional.",
          "Las decisiones medicas, precios, disponibilidad y resultados del servicio son responsabilidad del profesional o clinica.",
        ],
      },
      {
        title: "5. Propiedad intelectual",
        paragraphs: [
          "La marca Vethogar, su diseño, software y contenido estan protegidos por normas de propiedad intelectual.",
          "No esta permitido copiar, distribuir o explotar el contenido sin autorizacion previa.",
        ],
      },
      {
        title: "6. Limitacion de responsabilidad",
        paragraphs: [
          "Vethogar no garantiza disponibilidad continua del servicio ni ausencia total de errores.",
          "No somos responsables por daños derivados de acuerdos o interacciones directas entre usuarios y profesionales.",
        ],
      },
      {
        title: "7. Cambios y contacto",
        paragraphs: [
          "Podemos actualizar estos terminos en cualquier momento. La fecha de ultima actualizacion se publicara en este documento.",
          "Para inquietudes legales puedes contactarnos en hola@vethogar.com.",
        ],
      },
    ],
  },
  privacy: {
    title: "Politica de Privacidad",
    lastUpdated: "16 de febrero de 2026",
    intro:
      "Esta politica explica como recolectamos, usamos y protegemos la informacion personal en Vethogar.",
    sections: [
      {
        title: "1. Datos que recolectamos",
        paragraphs: [
          "Podemos recolectar datos de registro como nombre, correo, telefono, ciudad y rol de cuenta.",
          "En perfiles profesionales se pueden recolectar documentos, certificaciones, logo/foto y enlaces de redes.",
        ],
      },
      {
        title: "2. Finalidades del tratamiento",
        paragraphs: [
          "Usamos los datos para crear cuentas, autenticar usuarios, gestionar perfiles y permitir la comunicacion entre usuarios.",
          "Tambien usamos informacion para seguridad, prevencion de fraude, soporte y mejora de la experiencia del producto.",
        ],
      },
      {
        title: "3. Base de tratamiento y conservacion",
        paragraphs: [
          "Tratamos datos con base en consentimiento, ejecucion del servicio e interes legitimo de seguridad operativa.",
          "Conservamos la informacion por el tiempo necesario para prestar el servicio y cumplir obligaciones legales.",
        ],
      },
      {
        title: "4. Comparticion de informacion",
        paragraphs: [
          "No vendemos tus datos personales.",
          "Podemos compartir informacion con proveedores tecnologicos necesarios para operar Vethogar, bajo medidas de seguridad y confidencialidad.",
        ],
      },
      {
        title: "5. Derechos del titular",
        paragraphs: [
          "Puedes solicitar acceso, correccion, actualizacion o eliminacion de tus datos cuando aplique.",
          "Tambien puedes revocar autorizaciones y ejercer tus derechos escribiendo a hola@vethogar.com.",
        ],
      },
      {
        title: "6. Seguridad",
        paragraphs: [
          "Aplicamos medidas tecnicas y organizativas razonables para proteger la informacion contra acceso no autorizado, perdida o alteracion.",
          "Ningun sistema es 100 por ciento invulnerable, por lo que recomendamos tambien buenas practicas de seguridad de cuenta.",
        ],
      },
      {
        title: "7. Menores de edad",
        paragraphs: [
          "Vethogar no esta dirigido a menores de edad sin supervision de su representante legal.",
        ],
      },
    ],
  },
  cookies: {
    title: "Politica de Cookies",
    lastUpdated: "16 de febrero de 2026",
    intro:
      "Esta politica describe como usamos cookies y tecnologias similares para mejorar el funcionamiento de Vethogar.",
    sections: [
      {
        title: "1. Que son las cookies",
        paragraphs: [
          "Las cookies son pequeños archivos que el navegador guarda para recordar informacion de tu sesion o preferencias.",
        ],
      },
      {
        title: "2. Tipos de cookies que podemos usar",
        paragraphs: [
          "Usamos cookies esenciales para funciones basicas como inicio de sesion y seguridad.",
        ],
        bullets: [
          "Cookies esenciales: necesarias para operar la plataforma.",
          "Cookies de preferencia: guardan ajustes de experiencia.",
          "Cookies de analitica: ayudan a entender uso y mejorar el producto.",
        ],
      },
      {
        title: "3. Finalidades",
        paragraphs: [
          "Las cookies nos permiten mantener sesiones activas, recordar configuraciones y analizar rendimiento del sitio.",
          "No usamos cookies para vender datos personales a terceros.",
        ],
      },
      {
        title: "4. Gestion de cookies",
        paragraphs: [
          "Puedes bloquear o eliminar cookies desde la configuracion de tu navegador.",
          "Si desactivas cookies esenciales, algunas funciones del sitio pueden dejar de operar correctamente.",
        ],
      },
      {
        title: "5. Cambios y contacto",
        paragraphs: [
          "Podemos actualizar esta politica cuando cambien nuestros procesos o requisitos legales.",
          "Para dudas, contactanos en hola@vethogar.com.",
        ],
      },
    ],
  },
};

export const legalDocumentPaths: Record<LegalDocumentKey, string> = {
  terms: "/terminos-y-condiciones",
  privacy: "/politica-de-privacidad",
  cookies: "/politica-de-cookies",
};

