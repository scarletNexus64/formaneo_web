# Formaneo Web - Application React

## Description
Version web de la plateforme e-learning Formaneo, construite avec React.js et TypeScript. Cette application consomme les mêmes APIs que l'application mobile Flutter.

## Fonctionnalités

### 🎯 Landing Page
- Page d'accueil moderne inspirée d'Udemy/Coursera
- Sections : Hero, Fonctionnalités, Témoignages, Statistiques
- Design responsive et animations fluides

### 🔐 Authentification
- Inscription avec code de parrainage
- Connexion sécurisée
- Récupération de mot de passe
- Bonus de bienvenue automatique

### 📊 Dashboard
- Statistiques personnalisées
- Graphiques de revenus
- Formations en cours
- Activité récente

### 🎓 Formations
- Catalogue complet des formations
- Filtres avancés (niveau, prix, durée)
- Recherche intelligente
- Pages de détails avec aperçu

### 💰 Système Financier
- Portefeuille digital
- Historique des transactions
- Intégration CinetPay (Mobile Money)
- Retraits et dépôts

### 🛍️ E-commerce
- Marketplace de produits digitaux
- Bibliothèque d'e-books
- Panier d'achat
- Système de commandes

### 🤝 Programme d'Affiliation
- Tableau de bord affilié
- Suivi des commissions
- Liens de parrainage
- Statistiques de performance

## Technologies Utilisées

### Frontend
- **React 19.2** - Framework principal
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animations
- **React Router DOM** - Routage
- **React Hook Form** - Gestion des formulaires
- **Zustand** - Gestion d'état
- **Chart.js** - Graphiques
- **React Hot Toast** - Notifications

### Services
- **Axios** - Client HTTP
- **React Query** - Cache et synchronisation
- **DayJS** - Manipulation des dates

## Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd frontend/formaneo-web
```

2. **Installer les dépendances**
```bash
npm install --legacy-peer-deps
```

3. **Configuration**
```bash
cp .env.example .env
# Modifier les variables d'environnement
```

4. **Lancer l'application**
```bash
npm start
```

## Configuration API

### Variables d'environnement
```bash
REACT_APP_API_URL=http://192.168.1.136:8001/api/v1
REACT_APP_CINETPAY_API_KEY=your_api_key
REACT_APP_CINETPAY_SITE_ID=your_site_id
```

### Endpoints principaux
- `/auth/*` - Authentification
- `/formations/*` - Formations et packs
- `/wallet/*` - Portefeuille
- `/products/*` - Produits
- `/ebooks/*` - E-books
- `/affiliate/*` - Affiliation
- `/cinetpay/*` - Paiements

## Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs
│   └── PrivateRoute.tsx
├── config/             # Configuration
│   └── api.config.ts
├── layouts/            # Layouts principaux
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── pages/              # Pages de l'application
│   ├── auth/          # Pages d'authentification
│   ├── dashboard/     # Dashboard
│   ├── formations/    # Formations
│   ├── wallet/        # Portefeuille
│   ├── products/      # Produits
│   ├── ebooks/        # E-books
│   ├── affiliate/     # Affiliation
│   ├── profile/       # Profil
│   ├── cart/          # Panier
│   └── LandingPage.tsx
├── services/          # Services API
│   └── api.service.ts
├── store/             # Gestion d'état Zustand
│   └── authStore.ts
├── types/             # Types TypeScript
│   └── index.ts
├── App.tsx            # Composant principal
└── index.tsx          # Point d'entrée
```

## Gestion d'État

### Zustand Stores
- **authStore** - Authentification et utilisateur
- **formationStore** - Formations (à implémenter)
- **walletStore** - Portefeuille (à implémenter)
- **cartStore** - Panier (à implémenter)

## Sécurité

### Authentification
- JWT tokens stockés en localStorage
- Intercepteurs Axios automatiques
- Protection des routes privées
- Gestion automatique de l'expiration

### API Security
- Headers d'authentification automatiques
- Gestion d'erreurs centralisée
- Timeout de requêtes configuré

## Responsive Design

- **Mobile First** - Design optimisé mobile
- **Breakpoints Tailwind** - sm, md, lg, xl
- **Navigation adaptative** - Sidebar mobile/desktop
- **Grilles responsives** - Layout adaptatif

## Optimisations

### Performance
- Lazy loading des routes
- Images optimisées
- Bundle splitting
- Memoization des composants

### UX/UI
- Transitions fluides
- Loading states
- Feedback utilisateur
- Gestion d'erreurs

## Déploiement

### Build Production
```bash
npm run build
```

### Variables d'environnement
```bash
REACT_APP_API_URL=https://your-api-domain.com/api/v1
REACT_APP_ENV=production
```

## Développement

### Scripts disponibles
```bash
npm start          # Développement
npm run build      # Build production
npm test           # Tests
npm run eject      # Eject CRA
```

### Conventions
- **TypeScript strict** - Typage complet
- **ESLint/Prettier** - Formatage automatique
- **Conventional Commits** - Messages de commit
- **Component naming** - PascalCase

## Roadmap

### Phase 1 ✅
- Landing page
- Authentification
- Dashboard de base
- Navigation

### Phase 2 🚧
- Formations complètes
- Lecteur vidéo
- Système de quiz

### Phase 3 📋
- Portefeuille complet
- Intégration CinetPay
- E-commerce

### Phase 4 📋
- Programme d'affiliation
- Notifications
- PWA

## Support

Pour toute question ou problème, contactez l'équipe de développement.

## Licence

© 2024 Formaneo. Tous droits réservés.# formaneo_web
