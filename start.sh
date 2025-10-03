#!/bin/bash

# Script de démarrage pour le Portail de Gestion de Projets ESN
# Épreuve E1 - Interface sans framework

echo "🚀 Démarrage du Portail de Gestion de Projets ESN"
echo "=================================================="
echo ""

# Vérification de Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 détecté"
    echo "🌐 Démarrage du serveur local sur le port 8000..."
    echo ""
    echo "📱 Accédez à l'application :"
    echo "   http://localhost:8000"
    echo ""
    echo "🛑 Pour arrêter le serveur : Ctrl+C"
    echo ""
    echo "📋 Fonctionnalités disponibles :"
    echo "   • Page d'accueil avec liste des utilisateurs"
    echo "   • Recherche et filtrage en temps réel"
    echo "   • Page de détail utilisateur"
    echo "   • Ajout de nouvelles tâches"
    echo "   • Design responsive (mobile, tablette, desktop)"
    echo "   • Animations et interactions fluides"
    echo ""
    echo "🎯 Raccourcis clavier :"
    echo "   • Ctrl+K : Focuser la recherche"
    echo "   • Échap : Fermer le menu mobile"
    echo ""
    
    # Démarrage du serveur
    python3 -m http.server 8000
    
elif command -v python &> /dev/null; then
    echo "✅ Python détecté"
    echo "🌐 Démarrage du serveur local sur le port 8000..."
    echo ""
    echo "📱 Accédez à l'application :"
    echo "   http://localhost:8000"
    echo ""
    echo "🛑 Pour arrêter le serveur : Ctrl+C"
    echo ""
    
    # Démarrage du serveur
    python -m http.server 8000
    
else
    echo "❌ Python non détecté"
    echo ""
    echo "🔧 Solutions alternatives :"
    echo ""
    echo "1. Installer Python :"
    echo "   • macOS : brew install python3"
    echo "   • Ubuntu/Debian : sudo apt install python3"
    echo "   • Windows : Télécharger depuis python.org"
    echo ""
    echo "2. Utiliser un autre serveur :"
    echo "   • Node.js : npx http-server"
    echo "   • PHP : php -S localhost:8000"
    echo "   • Ouvrir directement index.html dans le navigateur"
    echo ""
    echo "📁 Fichiers du projet :"
    echo "   • index.html : Page d'accueil"
    echo "   • user.html : Page de détail utilisateur"
    echo "   • css/ : Styles CSS"
    echo "   • js/ : Logique JavaScript"
    echo "   • README.md : Documentation complète"
    echo "   • DEMONSTRATION.md : Guide de test"
fi
