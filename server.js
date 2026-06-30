const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de CORS para permitir solicitudes desde cualquier origen en desarrollo y producción
app.use(cors());
app.use(express.json());

// Datos del cumpleañero y contenido sorpresa (Almacenado de forma segura en el servidor)
const SURPRISE_CONTENT = {
  birthdayName: "Feliz cumpleaños!",
  birthdayDate: "2026-07-04",
  secretQuestion: "¿En qué ciudad tuvimos nuestra primera cita o salida especial?",
  hintText: "Pista: Comienza con 'B' y es la capital de Colombia... 😉",
  // Canción de fondo e información del video
  backgroundMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  videoUrl: "https://www.youtube.com/watch?v=TGtWWb9emYI&list=RDGMEMHDXYb1_DDSgDsobPsOFxpAVMTGtWWb9emYI&start_radio=1",
  isVideoEmbed: false,
  
  // Recuerdos para el Scrapbook
  memories: [
    {
      id: 1,
      date: "14 de Febrero, 2024",
      title: "El comienzo de todo 🌸",
      description: "Aquel café por la tarde donde conversamos por horas y el tiempo voló. Supe desde ese momento que serías alguien muy especial en mi vida.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      date: "05 de Julio, 2024",
      title: "Nuestro primer viaje ✈️",
      description: "La escapada de fin de semana. Perdidos buscando ese mirador secreto, riendo bajo la lluvia. Uno de mis recuerdos favoritos.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      date: "31 de Diciembre, 2024",
      title: "Recibiendo el Año Nuevo ✨",
      description: "Brindando por todo lo vivido y haciendo promesas para el futuro. Tu sonrisa iluminaba más que los fuegos artificiales de medianoche.",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      date: "Hace unos meses",
      title: "Tardes de risas infinitas 🍕",
      description: "Nuestras noches de pizza y películas donde siempre terminamos hablando de cualquier locura en lugar de ver la película. Gracias por estar siempre.",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop"
    }
  ],
  
  // Cartas y deseos interactivos
  wishes: [
    {
      id: 1,
      emoji: "✉️",
      title: "Un deseo de Salud y Felicidad",
      content: "Deseo que este año que comienzas esté lleno de salud, paz mental y sonrisas diarias. Que logres cada meta que te propongas, porque tienes el talento y el corazón para conquistar el mundo. ¡Estaré aquí para celebrarlo contigo!"
    },
    {
      id: 2,
      emoji: "🎟️",
      title: "Vale por un Abrazo Gigante",
      content: "Este cupón virtual es válido para ser canjeado por el abrazo más fuerte y largo del mundo, además de un helado de tu sabor favorito. ¡Válido por tiempo ilimitado!"
    },
    {
      id: 3,
      emoji: "✨",
      title: "Vale por una Tarde de Pelis",
      content: "Este cupón te da derecho a elegir la película, las botanas (las compro yo) y adueñarte del control remoto por una tarde entera. ¡Tú mandas!"
    },
    {
      id: 4,
      emoji: "💝",
      title: "Mi eterna Gratitud",
      content: "Gracias por tu paciencia, tu luz y por hacer que los días grises sean de colores. Eres una persona increíble y tenerte cerca es uno de mis mayores regalos. ¡Feliz Cumpleaños!"
    }
  ],
  
  // Trivia interactiva
  trivia: {
    enabled: true,
    congratulationsMessage: "¡Eres increíble! Has desbloqueado el regalo final: Una carta que escribí con todo mi corazón para ti. ❤️",
    finalLetter: "Querida persona especial, hoy en tu cumpleaños quiero recordarte lo valioso/a que eres. Cada momento compartido es un tesoro para mí. Espero que pases un día maravilloso, rodeado/a de amor y felicidad. ¡Te quiero muchísimo y que cumplas muchos años más!",
    questions: [
      {
        question: "¿Qué es lo que más solemos discutir en plan de broma?",
        options: [
          "Quién come más rápido",
          "Qué película ver en Netflix",
          "Quién es el más impuntual",
          "Quién tiene el mejor gusto musical"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "Si pudiéramos teletransportarnos ahora mismo, ¿a dónde iríamos?",
        options: [
          "A una cabaña en las montañas heladas",
          "A una playa relajante con agua cristalina",
          "A explorar una gran ciudad de noche",
          "Al parque de diversiones más extremo"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "¿Cuál es mi postre favorito que siempre quiero compartir contigo?",
        options: [
          "Tarta de chocolate",
          "Helado de vainilla",
          "Pie de limón",
          "Flan casero"
        ],
        correctAnswerIndex: 0
      }
    ]
  }
};

// Respuesta esperada secreta
const SECRET_ANSWER = "bogota";

// Helper para normalizar la entrada del usuario
const normalizeText = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes y diéresis
    .replace(/\s+/g, ""); // Elimina espacios en blanco
};

// Endpoint para verificar la pregunta inicial
app.get('/api/question', (req, res) => {
  res.json({
    question: SURPRISE_CONTENT.secretQuestion,
    hintText: SURPRISE_CONTENT.hintText
  });
});

// Endpoint de login seguro
app.post('/api/login', (req, res) => {
  const { answer } = req.body;
  
  if (normalizeText(answer) === normalizeText(SECRET_ANSWER)) {
    return res.json({
      success: true,
      message: "Acceso autorizado",
      content: SURPRISE_CONTENT
    });
  }
  
  return res.status(401).json({
    success: false,
    message: "Respuesta incorrecta. Piensa un poco más..."
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor de Cumpleaños Especial Activo 🎂');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
