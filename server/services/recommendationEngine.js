const Recommendation = require('../models/Recommendation');

class RecommendationEngine {
  /**
   * Evaluates multimodal signals and creates recommendations
   * @param {string} sessionId
   * @param {Object} metrics { overallScore, inactivityDurationSec, audioActivityLevel, headMovementScore }
   */
  static async evaluateSessionMetrics(sessionId, metrics) {
    const {
      overallScore = 70,
      inactivityDurationSec = 10,
      audioActivityLevel = 40,
      headMovementScore = 65,
    } = metrics;

    const generatedRecommendations = [];

    // Rule 1: Critically Low Engagement
    if (overallScore < 50) {
      generatedRecommendations.push({
        session: sessionId,
        type: 'engagement',
        triggerReason: `Classroom engagement index dropped to ${Math.round(overallScore)}% (below 50% threshold).`,
        recommendationText: 'Student visual engagement is dropping. Intervene with an interactive quiz, concept check, or live audience poll.',
        suggestedAction: 'Launch a 2-minute live Poll / Kahoot or ask a cold-call conceptual question.',
        priority: 'high',
      });
    }

    // Rule 2: High Inactivity / Sedentary Stupor
    if (inactivityDurationSec > 25 || headMovementScore < 30) {
      generatedRecommendations.push({
        session: sessionId,
        type: 'inactivity',
        triggerReason: `Prolonged physical inactivity detected (${Math.round(inactivityDurationSec)}s without head/motion shift).`,
        recommendationText: 'Students are exhibiting static fatigue or glazed screen gaze. A cognitive reset is advised.',
        suggestedAction: 'Announce a 90-second posture stretch, water pause, or switch from slide presentation to whiteboard.',
        priority: 'medium',
      });
    }

    // Rule 3: Low Classroom Participation / One-Way Monologue
    if (audioActivityLevel < 20) {
      generatedRecommendations.push({
        session: sessionId,
        type: 'participation',
        triggerReason: `Classroom verbal participation is below 20% over the last 10 minutes.`,
        recommendationText: 'The session has been predominantly lecture-heavy with minimal verbal student response.',
        suggestedAction: 'Initiate a "Think-Pair-Share" exercise where adjacent students discuss a 1-minute prompt.',
        priority: 'medium',
      });
    }

    // Rule 4: Excessive Ambient Noise or Overlap
    if (audioActivityLevel > 75) {
      generatedRecommendations.push({
        session: sessionId,
        type: 'acoustics',
        triggerReason: `Acoustic sound pressure indicates high ambient chatter (${Math.round(audioActivityLevel)}% volume level).`,
        recommendationText: 'Classroom noise is interfering with lecture clarity or side conversations are escalating.',
        suggestedAction: 'Request a quiet hand-raise reset or reconvene student breakout groups back to the main stage.',
        priority: 'medium',
      });
    }

    // Rule 5: Sustained High Engagement Praise & Pacing
    if (overallScore >= 85) {
      generatedRecommendations.push({
        session: sessionId,
        type: 'engagement',
        triggerReason: `Sustained high engagement observed (${Math.round(overallScore)}%).`,
        recommendationText: 'The cohort is demonstrating peak attention and active focus on the current topic.',
        suggestedAction: 'Ideal moment to introduce higher-order synthesis problems or challenging real-world case studies.',
        priority: 'low',
      });
    }

    // Persist new recommendations into database
    const saved = [];
    for (const rec of generatedRecommendations) {
      // Avoid duplicate pending recommendation of the same type within last 5 minutes
      const existing = await Recommendation.findOne({
        session: sessionId,
        type: rec.type,
        status: 'pending',
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
      });

      if (!existing) {
        const doc = await Recommendation.create(rec);
        saved.push(doc);
      }
    }

    return saved;
  }
}

module.exports = RecommendationEngine;
