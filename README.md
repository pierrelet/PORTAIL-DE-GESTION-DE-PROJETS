# Portail de Gestion de Projets ESN

## 📋 Description du Projet

Ce projet consiste en le développement d'un portail web de gestion de projets pour une entreprise de services numériques (ESN). L'application permet aux collaborateurs de visualiser et gérer les projets en cours, avec une interface moderne et responsive.

## 🎯 Objectifs

- **Consulter** la liste des utilisateurs et leurs projets associés
- **Afficher** le détail de chaque utilisateur avec ses tâches (todos)
- **Ajouter** de nouvelles tâches à un utilisateur
- **Rechercher** et filtrer les utilisateurs / tâches
- **Naviguer** de manière intuitive dans l'application

## 🛠️ Technologies Utilisées

### Frontend (Épreuve E1)
- **HTML5** : Structure sémantique avec attributs ARIA pour l'accessibilité
- **CSS3** : Design responsive avec Flexbox/Grid, animations et variables CSS
- **JavaScript ES6+** : Code moderne avec Fetch API, gestion d'événements et manipulation DOM

### API Externe
- **JSONPlaceholder** : API REST pour les données utilisateurs et tâches
- Base URL : `https://jsonplaceholder.typicode.com`

## 📁 Structure du Projet

```
projet-e1/
├── index.html              # Page d'accueil
├── user.html               # Page de détail utilisateur
├── css/
│   ├── style.css          # Styles principaux
│   └── responsive.css     # Styles responsive
├── js/
│   ├── main.js            # Logique principale de l'application
│   ├── api.js             # Gestion des appels API
│   └── utils.js           # Fonctions utilitaires
├── assets/
│   └── images/            # Images et ressources
└── README.md              # Documentation
```

## 🚀 Fonctionnalités

### Page d'Accueil (`index.html`)
- ✅ En-tête avec navigation responsive
- ✅ Section de recherche en temps réel
- ✅ Affichage des utilisateurs avec statistiques
- ✅ Filtrage par statut des tâches
- ✅ Animations au survol et au défilement
- ✅ Design responsive (mobile, tablette, desktop)

### Page Utilisateur (`user.html`)
- ✅ Informations détaillées de l'utilisateur
- ✅ Liste complète des tâches avec statut
- ✅ Formulaire d'ajout de nouvelles tâches
- ✅ Validation côté client
- ✅ Bouton de retour vers l'accueil

### Fonctionnalités JavaScript
- ✅ Récupération des données via API REST
- ✅ Manipulation du DOM dynamique
- ✅ Recherche et filtrage en temps réel
- ✅ Gestion des événements utilisateur
- ✅ Gestion d'erreurs avec retry automatique
- ✅ Animations et transitions fluides

## 🎨 Design et UX

### Caractéristiques Visuelles
- **Design moderne** avec palette de couleurs cohérente
- **Animations CSS** pour améliorer l'expérience utilisateur
- **Transitions fluides** au survol et au clic
- **Loader animé** pendant les requêtes API
- **Messages d'état** pour informer l'utilisateur

### Responsive Design
- **Mobile First** : Optimisé pour les petits écrans
- **Breakpoints** :
  - Mobile : < 768px
  - Tablette : 768px - 1024px
  - Desktop : > 1024px
- **Menu hamburger** sur mobile
- **Grille adaptative** pour les cartes utilisateur

### Accessibilité
- **Attributs ARIA** pour la navigation au clavier
- **Contraste élevé** pour la lisibilité
- **Focus visible** sur les éléments interactifs
- **Support des lecteurs d'écran**
- **Raccourcis clavier** (Ctrl+K pour la recherche)

## 🔧 Installation et Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet pour les appels API

### Installation
1. Cloner ou télécharger le projet
2. Ouvrir `index.html` dans un navigateur web
3. Ou utiliser un serveur local pour un meilleur développement

### Utilisation avec Serveur Local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si http-server est installé)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis accéder à `http://localhost:8000`

## 📡 API Endpoints Utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Récupérer tous les utilisateurs |
| GET | `/users/{id}` | Récupérer un utilisateur par ID |
| GET | `/todos?userId={id}` | Récupérer les todos d'un utilisateur |
| POST | `/todos` | Créer une nouvelle tâche |

## 🧪 Fonctionnalités Techniques

### Gestion des Erreurs
- **Retry automatique** en cas d'échec réseau
- **Timeout** configurable pour les requêtes
- **Messages d'erreur** informatifs pour l'utilisateur
- **Fallback** en cas d'indisponibilité de l'API

### Performance
- **Debounce** pour la recherche en temps réel
- **Chargement parallèle** des données utilisateur et tâches
- **Animations optimisées** avec CSS
- **Lazy loading** des animations au scroll

### Sécurité
- **Échappement HTML** pour éviter les injections XSS
- **Validation** des données côté client
- **Sanitisation** des entrées utilisateur

## 🎯 Critères d'Évaluation E1

### ✅ Standards HTML5/CSS3
- Structure sémantique respectée
- Attributs ARIA pour l'accessibilité
- CSS moderne avec variables et Grid/Flexbox
- Media queries pour le responsive

### ✅ Qualité du Code JavaScript
- Code ES6+ moderne et structuré
- Gestion d'erreurs appropriée
- Commentaires et documentation
- Séparation des responsabilités

### ✅ Responsive Design
- Adaptation à toutes les tailles d'écran
- Menu hamburger fonctionnel
- Grille adaptative
- Test sur différents appareils

### ✅ Appels API
- Utilisation correcte de Fetch API
- Gestion des erreurs réseau
- Retry automatique
- Timeout configurable

### ✅ Manipulation DOM
- Sélection efficace des éléments
- Création dynamique de contenu
- Gestion des événements
- Animations fluides

### ✅ Expérience Utilisateur
- Interface intuitive et moderne
- Feedback visuel approprié
- Chargement fluide
- Accessibilité respectée

## 🔍 Fonctionnalités Avancées

### Recherche Intelligente
- Recherche en temps réel avec debounce
- Recherche dans les noms, emails, entreprises et tâches
- Filtrage par statut des tâches
- Raccourci clavier (Ctrl+K)

### Animations et Interactions
- Animations CSS pour les cartes
- Transitions au survol
- Loader pendant les requêtes
- Messages toast informatifs

### Gestion d'État
- État global de l'application
- Filtrage en temps réel
- Persistance des préférences utilisateur
- Gestion des erreurs d'état

## 🐛 Dépannage

### Problèmes Courants
1. **API indisponible** : Vérifier la connexion internet
2. **Erreurs CORS** : Utiliser un serveur local
3. **Animations lentes** : Vérifier les performances du navigateur
4. **Menu mobile** : Vérifier la taille d'écran

### Debug
- Ouvrir les DevTools du navigateur
- Vérifier la console pour les erreurs
- Tester les appels API dans l'onglet Network
- Vérifier les styles CSS dans l'onglet Elements

## 📱 Compatibilité Navigateurs

- ✅ Chrome (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Edge (dernières versions)

## 🚀 Améliorations Futures

- [ ] Mode sombre/clair
- [ ] Tri des utilisateurs par critères
- [ ] Pagination pour les grandes listes
- [ ] Export des données
- [ ] Notifications push
- [ ] Mode hors ligne avec cache

## 📄 Licence

Ce projet est développé dans le cadre de l'épreuve E1 du BTS SIO.

## 👨‍💻 Auteur

Développé pour l'épreuve certifiante E1 - Portail de Gestion de Projets ESN.

---

*Pour toute question ou problème, consulter la documentation ou les DevTools du navigateur.*
