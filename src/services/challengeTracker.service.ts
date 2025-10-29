import { challengesService } from './challenges.service';
import toast from 'react-hot-toast';

class ChallengeTrackerService {
  // Types d'événements qui peuvent déclencher des défis
  public static readonly EVENTS = {
    FORMATION_COMPLETED: 'formation_completed',
    QUIZ_PASSED: 'quiz_passed',
    EBOOK_PURCHASED: 'ebook_purchased',
    FIRST_LOGIN: 'first_login',
    AFFILIATE_REFERRAL: 'affiliate_referral',
    COURSE_WATCHED: 'course_watched',
    PROFILE_COMPLETED: 'profile_completed',
    DAILY_LOGIN: 'daily_login',
  } as const;

  // Correspondance entre les événements et les types de défis
  private eventToChallengeMapping = {
    [ChallengeTrackerService.EVENTS.FORMATION_COMPLETED]: ['complete_formations', 'first_formation'],
    [ChallengeTrackerService.EVENTS.QUIZ_PASSED]: ['pass_quizzes', 'first_quiz'],
    [ChallengeTrackerService.EVENTS.EBOOK_PURCHASED]: ['purchase_ebooks', 'first_ebook'],
    [ChallengeTrackerService.EVENTS.FIRST_LOGIN]: ['first_login'],
    [ChallengeTrackerService.EVENTS.AFFILIATE_REFERRAL]: ['invite_friends', 'first_referral'],
    [ChallengeTrackerService.EVENTS.COURSE_WATCHED]: ['watch_courses'],
    [ChallengeTrackerService.EVENTS.PROFILE_COMPLETED]: ['complete_profile'],
    [ChallengeTrackerService.EVENTS.DAILY_LOGIN]: ['daily_login_streak'],
  };

  /**
   * Déclenche la mise à jour des défis en fonction d'un événement
   */
  async trackEvent(eventType: string, eventData: any = {}) {
    try {
      console.log('📊 Tracking challenge event:', eventType, eventData);
      
      // Récupérer les défis de l'utilisateur
      const challenges = await challengesService.getUserChallenges();
      
      // Filtrer les défis pertinents pour cet événement
      const relevantChallenges = challenges.filter(challenge => 
        this.isChallengeRelevantForEvent(challenge, eventType) && 
        !challenge.is_completed
      );

      console.log(`📋 Found ${relevantChallenges.length} relevant challenges for event ${eventType}`);

      // Mettre à jour chaque défi pertinent
      for (const challenge of relevantChallenges) {
        await this.updateChallengeProgress(challenge, eventType, eventData);
      }

    } catch (error) {
      console.error('❌ Error tracking challenge event:', error);
    }
  }

  /**
   * Vérifie si un défi est pertinent pour un événement
   */
  private isChallengeRelevantForEvent(challenge: any, eventType: string): boolean {
    const challengeTypes = this.eventToChallengeMapping[eventType as keyof typeof this.eventToChallengeMapping] || [];
    
    // Vérifier si le titre ou la description du défi contient des mots-clés pertinents
    const challengeText = `${challenge.title} ${challenge.description}`.toLowerCase();
    
    return challengeTypes.some(type => {
      switch (type) {
        case 'complete_formations':
          return challengeText.includes('formation') || challengeText.includes('cours');
        case 'first_formation':
          return challengeText.includes('première formation') || challengeText.includes('premier cours');
        case 'pass_quizzes':
          return challengeText.includes('quiz') || challengeText.includes('questionnaire');
        case 'first_quiz':
          return challengeText.includes('premier quiz');
        case 'purchase_ebooks':
          return challengeText.includes('ebook') || challengeText.includes('livre');
        case 'first_ebook':
          return challengeText.includes('premier ebook') || challengeText.includes('premier livre');
        case 'first_login':
          return challengeText.includes('première connexion') || challengeText.includes('bienvenue');
        case 'invite_friends':
          return challengeText.includes('inviter') || challengeText.includes('parrainage');
        case 'first_referral':
          return challengeText.includes('premier parrainage') || challengeText.includes('première invitation');
        case 'watch_courses':
          return challengeText.includes('regarder') || challengeText.includes('visionner');
        case 'complete_profile':
          return challengeText.includes('profil') || challengeText.includes('information personnelle');
        case 'daily_login_streak':
          return challengeText.includes('connexion quotidienne') || challengeText.includes('jour consécutif');
        default:
          return false;
      }
    });
  }

  /**
   * Met à jour la progression d'un défi spécifique
   */
  private async updateChallengeProgress(challenge: any, eventType: string, eventData: any) {
    try {
      let newProgress = (challenge.progress || 0) + 1;
      
      // Logique spécifique selon le type d'événement
      switch (eventType) {
        case ChallengeTrackerService.EVENTS.FORMATION_COMPLETED:
        case ChallengeTrackerService.EVENTS.QUIZ_PASSED:
        case ChallengeTrackerService.EVENTS.EBOOK_PURCHASED:
        case ChallengeTrackerService.EVENTS.AFFILIATE_REFERRAL:
          newProgress = (challenge.progress || 0) + 1;
          break;
        
        case ChallengeTrackerService.EVENTS.FIRST_LOGIN:
        case ChallengeTrackerService.EVENTS.PROFILE_COMPLETED:
          newProgress = challenge.target || 1; // Compléter immédiatement
          break;
        
        default:
          newProgress = (challenge.progress || 0) + 1;
          break;
      }

      // S'assurer que la progression ne dépasse pas l'objectif
      if (challenge.target && newProgress > challenge.target) {
        newProgress = challenge.target;
      }

      console.log(`📈 Updating challenge "${challenge.title}" progress: ${challenge.progress || 0} → ${newProgress}`);

      // Mettre à jour la progression via l'API
      const result = await challengesService.updateProgress(challenge.id, newProgress);
      
      if (result.success) {
        console.log(`✅ Challenge progress updated successfully`);
        
        // Si le défi est maintenant complété, afficher une notification
        if (result.is_completed && !challenge.is_completed) {
          this.showChallengeCompletedNotification(challenge);
        }
      } else {
        console.error(`❌ Failed to update challenge progress:`, result.message);
      }

    } catch (error) {
      console.error(`❌ Error updating progress for challenge "${challenge.title}":`, error);
    }
  }

  /**
   * Affiche une notification de défi complété
   */
  private showChallengeCompletedNotification(challenge: any) {
    toast.success(
      `🏆 Défi complété: ${challenge.title}\n💰 Récompense disponible: ${challenge.reward} FCFA`,
      {
        duration: 5000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      }
    );
  }

  /**
   * Méthodes spécifiques pour chaque type d'événement
   */
  async trackFormationCompleted(formationId: number, formationTitle: string) {
    await this.trackEvent(ChallengeTrackerService.EVENTS.FORMATION_COMPLETED, {
      formationId,
      formationTitle,
    });
  }

  async trackQuizPassed(quizId: number, quizTitle: string, score: number) {
    await this.trackEvent(ChallengeTrackerService.EVENTS.QUIZ_PASSED, {
      quizId,
      quizTitle,
      score,
    });
  }

  async trackEbookPurchased(ebookId: number, ebookTitle: string) {
    await this.trackEvent(ChallengeTrackerService.EVENTS.EBOOK_PURCHASED, {
      ebookId,
      ebookTitle,
    });
  }

  async trackFirstLogin() {
    await this.trackEvent(ChallengeTrackerService.EVENTS.FIRST_LOGIN);
  }

  async trackAffiliateReferral(referralId: number) {
    await this.trackEvent(ChallengeTrackerService.EVENTS.AFFILIATE_REFERRAL, {
      referralId,
    });
  }

  async trackCourseWatched(courseId: number, watchTime: number) {
    await this.trackEvent(ChallengeTrackerService.EVENTS.COURSE_WATCHED, {
      courseId,
      watchTime,
    });
  }

  async trackProfileCompleted() {
    await this.trackEvent(ChallengeTrackerService.EVENTS.PROFILE_COMPLETED);
  }

  async trackDailyLogin() {
    await this.trackEvent(ChallengeTrackerService.EVENTS.DAILY_LOGIN);
  }
}

export const challengeTracker = new ChallengeTrackerService();
export default challengeTracker;