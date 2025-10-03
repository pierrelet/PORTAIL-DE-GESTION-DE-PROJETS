# Portail de Gestion de Projets - ESN

## 📋 Description du Projet

Portail web de gestion de projets développé pour une entreprise de services numériques (ESN). L'application permet aux collaborateurs de visualiser et gérer efficacement leurs tâches et projets.

## 🎯 Fonctionnalités

### Page d'Accueil (`index.html`)
- **Liste des collaborateurs** : Affichage de tous les utilisateurs avec leurs informations
- **Recherche en temps réel** : Filtrage par nom, email, entreprise ou tâche
- **Tri dynamique** : Par nom, entreprise, nombre de tâches ou par défaut
- **Design responsive** : Adaptation mobile, tablette et desktop
- **Photos de profil** : Images dynamiques avec fallback sur initiales

### Page Utilisateur (`user.html`)
- **Informations détaillées** : Nom, email, entreprise, statistiques
- **Gestion des tâches** : Liste complète des tâches avec statut
- **Ajout de tâches** : Formulaire pour créer de nouvelles tâches
- **Marquage des tâches** : Boutons pour marquer comme terminée/en cours
- **Suppression de tâches** : Bouton de suppression avec confirmation

### Fonctionnalités Avancées
- **Système de thème** : Mode sombre/clair avec persistance
- **Menu hamburger** : Navigation mobile optimisée
- **Animations** : Transitions fluides et effets visuels
- **Gestion d'erreurs** : Messages d'erreur et de succès
- **Accessibilité** : Attributs ARIA et navigation clavier

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique et accessibilité
- **CSS3** : Design responsive avec variables CSS et animations
- **JavaScript ES6+** : Logique applicative et manipulation DOM
- **API REST** : JSONPlaceholder pour les données de test

## 📁 Structure du Projet

```
projet-e1/
├── index.html              # Page d'accueil
├── user.html               # Page détail utilisateur
├── css/
│   ├── style.css           # Styles principaux
│   └── responsive.css      # Styles responsive
├── js/
│   ├── main.js             # Logique principale
│   ├── api.js              # Gestion des appels API
│   └── utils.js            # Fonctions utilitaires
└── assets/
    └── images/              # Photos de profil (1.jpg à 10.jpg)
```

## 🚀 Installation et Lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur HTTP local (Python, Node.js, ou autre)

### Lancement avec Python
```bash
# Dans le répertoire du projet
python3 -m http.server 8000

# Ouvrir dans le navigateur
http://localhost:8000
```

### Lancement avec Node.js
```bash
# Installer un serveur HTTP simple
npm install -g http-server

# Dans le répertoire du projet
http-server -p 8000

# Ouvrir dans le navigateur
http://localhost:8000
```

## 📱 Utilisation

### Navigation
1. **Page d'accueil** : Liste des collaborateurs avec recherche et tri
2. **Page utilisateur** : Cliquer sur "Voir les tâches" pour accéder aux détails
3. **Menu mobile** : Bouton hamburger pour la navigation sur mobile
4. **Changement de thème** : Bouton 🌙/☀️ dans le menu

### Gestion des Tâches
1. **Ajouter une tâche** : Remplir le formulaire et cliquer "Ajouter la tâche"
2. **Marquer comme terminée** : Cliquer sur "○ En cours" → "✓ Terminée"
3. **Supprimer une tâche** : Cliquer sur 🗑️ et confirmer

### Recherche et Tri
1. **Recherche** : Saisir dans la barre de recherche (nom, email, entreprise, tâche)
2. **Tri** : Sélectionner dans le menu déroulant "Trier par"

## 🎨 Design et UX

### Thème Sombre (par défaut)
- Background : `#0f172a` (très sombre)
- Couleurs : Violet (`#8b5cf6`) et orange (`#f59e0b`)
- Texte : Blanc et gris clair

### Thème Clair
- Background : Blanc (`#ffffff`)
- Couleurs : Violet et orange (conservés)
- Texte : Gris foncé

### Responsive Design
- **Mobile** : < 768px - Menu hamburger, layout vertical
- **Tablette** : 768px - 1024px - Layout adaptatif
- **Desktop** : > 1024px - Layout horizontal complet

## 🔧 Architecture Technique

### JavaScript
- **Modularité** : Séparation des responsabilités (API, Utils, Main)
- **Gestion d'état** : Variables globales pour les données utilisateur
- **Gestion d'erreurs** : Try/catch avec messages utilisateur
- **Performance** : Debouncing pour la recherche, lazy loading

### CSS
- **Variables CSS** : Système de thème centralisé
- **Mobile First** : Approche responsive progressive
- **Animations** : Transitions fluides et effets visuels
- **Accessibilité** : Focus states et contrastes appropriés

### API Integration
- **JSONPlaceholder** : API de test pour utilisateurs et tâches
- **Gestion hybride** : API réelle pour les tâches existantes, simulation locale pour les nouvelles
- **Retry logic** : Tentatives multiples en cas d'échec réseau

## 📊 Fonctionnalités Détaillées

### Système de Thème
- **Persistance** : Sauvegarde dans localStorage
- **Transition** : Changement instantané sans rechargement
- **Icônes** : 🌙 (sombre) / ☀️ (clair)

### Gestion des Tâches
- **Création** : Formulaire avec validation côté client
- **Mise à jour** : Boutons toggle pour changer le statut
- **Suppression** : Confirmation avant suppression
- **Statistiques** : Compteurs mis à jour en temps réel

### Recherche et Filtrage
- **Recherche globale** : Nom, email, entreprise, contenu des tâches
- **Tri multiple** : Par nom, entreprise, nombre de tâches
- **Performance** : Debouncing de 300ms pour optimiser les requêtes

## 🧪 Tests et Validation

### Tests Fonctionnels
- ✅ Affichage de la liste des utilisateurs
- ✅ Recherche et filtrage en temps réel
- ✅ Navigation entre les pages
- ✅ Ajout de nouvelles tâches
- ✅ Marquage des tâches comme terminées
- ✅ Suppression de tâches
- ✅ Changement de thème
- ✅ Menu hamburger sur mobile

### Tests de Compatibilité
- ✅ Chrome (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Edge (dernières versions)

## 📝 Notes de Développement

### API JSONPlaceholder
- **Limitation** : Les nouvelles tâches (ID ≥ 201) ne peuvent pas être mises à jour via l'API
- **Solution** : Gestion locale pour les nouvelles tâches, API pour les existantes
- **Simulation** : Les modifications sont appliquées localement avec feedback utilisateur

### Code Structure
- **Propreté** : Code nettoyé et structuré sans traces d'IA
- **Commentaires** : Minimalistes, seulement pour les parties complexes
- **Nommage** : Variables et fonctions explicites et cohérentes

## 👨‍💻 Développeur

**Pierre Relet** - Développeur Web

## 📄 Licence

Projet développé dans le cadre d'une certification E1 - Interface sans framework.

---

*Application développée avec HTML5, CSS3 et JavaScript ES6+ sans framework externe.*
