
```javascript
const https = require('https');
const readline = require('readline');

// Simulación de análisis de sentimiento usando palabras clave
const sentimentKeywords = {
  positive: [
    'gananancia', 'beneficio', 'aumento', 'crecimiento', 'mejora', 'alza',
    'positivo', 'éxito', 'rentable', 'inversion', 'oportunidad', 'fuerte',
    'estable', 'promisorio', 'sólido', 'expansión', 'recuperación'
  ],
  negative: [
    'pérdida', 'caída', 'baja', 'declive', 'crisis', 'riesgo', 'peligro',
    'negativo', 'fracaso', 'quiebra', 'colapso', 'volatilidad', 'inestable',
    'recesión', 'desplome', 'reducción', 'suspensión', 'cierre'
  ],
  neutral: [
    'anuncio', 'información', 'reporta', 'indica', 'señala', 'menciona',
    'establece', 'define', 'comunica', 'presenta', 'muestra'
  ]
};

// Clase para analizar sentimiento
class SentimentAnalyzer {
  constructor() {
    this.sentiments = [];
  }

  analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    // Contar palabras clave positivas
    sentimentKeywords.positive.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });

    // Contar palabras clave negativas
    sentimentKeywords.negative.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });

    // Contar palabras clave neutrales
    sentimentKeywords.neutral.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) neutralCount += matches.length;
    });

    // Calcular puntuación
    const total = positiveCount + negativeCount + neutralCount;
    let sentiment = 'neutral';
    let score = 0.5;

    if (total > 0) {
      score = (positiveCount - negativeCount) / total + 1) / 2;
      
      if (positiveCount > negativeCount) {
        sentiment = 'positivo';
      } else if (negativeCount > positiveCount) {
        sentiment = 'negativo';
      } else {
        sentiment = 'neutral';
      }
    }

    return {
      sentiment,
      score: Math.min(1, Math.max(0, score)),
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      neutralWords: neutralCount,
      totalKeywords: total
    };
  }

  analyzeMultiple(texts) {
    return texts.map((text, index) => ({
      id: index + 1,
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      analysis: this.analyzeSentiment(text)
    }));
  }

  getStatistics(analyses) {
    if (analyses.length === 0) return null;

    const stats = {
      total: analyses.length,
      positive: 0,
      negative: 0,
      neutral: 0,
      averageScore: 0,
      totalKeywordsFound: 0
    };

    let scoreSum = 0;

    analyses.forEach(analysis => {
      stats[analysis.analysis.sentiment]++;
      scoreSum += analysis.analysis.score;
      stats.totalKeywordsFound += analysis.analysis.totalKeywords;
    });

    stats.averageScore = scoreSum / analyses.length;

    return stats;
  }
}

// Función para obtener noticias de prueba
function getTestNews() {
  return [
    {
      title: 'Acción de Tech Corp se dispara tras ganancias récord',
      content: 'La compañía reporta un crecimiento excepcional y un aumento del 35% en beneficios. Los analistas consideran esto una oportunidad positiva para inversores. El mercado muestra solidez.'
    },
    {
      title: 'Sector financiero enfrenta desafíos con volatilidad del mercado',
      content: 'La economía global experimenta una caída significativa. Los expertos advierten sobre riesgos de recesión. Los inversores reportan pérdidas y preocupación sobre la estabilidad.'
    },
    {
      title: 'Banco Central anuncia nuevas políticas monetarias',
      content: 'El banco central presenta sus indicadores mensuales. Los datos indican cambios en el mercado de valores. Se señala una posición neutral en relación a las inversiones.'
    },
    {
      title: 'Startup innovadora logra ronda de financiamiento exitosa',
      content: 'La empresa consigue una ronda de inversión millonaria que impulsa su expansión. Los inversores muestran confianza en el proyecto. Perspectivas prometedoras para el crecimiento futuro.'
    },
    {
      title: 'Empresa minera anuncia cierre temporal de operaciones',
      content: 'La compañía suspende actividades debido a problemas operacionales. Se reportan reducciones significativas en producción. El sector enfrenta un declive