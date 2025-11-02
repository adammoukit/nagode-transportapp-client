# React + Vite

========================= APPLICATION DE GESTION DE TRANSPORT ==========================

📦 Fonctionnalités
🔐 Authentification JWT avec tokens sécurisés & Affichage des messages d'erreur et de succès claires et compactes.
🔄 Système de Refresh Token pour une sécurité renforcée
🛡️ Spring Security 6 avec configuration avancée implementée au backend avec des filtres et controles d'accès.

🏗️ Architecture modulaire et maintenable
🛠️ Stack Technique
Backend: Spring Boot 3.x
front-end: react.js & vite + tailwindcss
Sécurité: Spring Security 6 + JWT
Base de données: MySQL 8+
fichier de script : package.json
Java: Version 17+
Gestion des dépendances: Spring Boot Starter
📋 Prérequis
Avant de commencer, assurez-vous d'avoir installé :

☕ Java 17 ou supérieur
🗄️ MySQL 8.0 ou supérieur
🛠️ Maven 3.6 ou supérieur
📧 Git pour cloner le projet
🚀 Installation & Démarrage

🚀 Installation & Démarrage

1. Cloner le projet
   git clone https://github.com/adammoukit/nagode-API.git

-- Se connecter à MySQL et exécuter :
CREATE DATABASE nagodeDB;
-- Ou utilisez votre outil de gestion MySQL préféré (phpMyAdmin, MySQL Workbench, etc.)

# Copier le template de configuration locale

cp src/main/resources/application-local.properties.template src/main/resources/application-local.properties

# Éditer le fichier avec vos paramètres

# Utilisez votre éditeur favori :

nano src/main/resources/application-local.properties

# ou

code src/main/resources/application-local.properties # VS Code

# ou ouvrez avec IntelliJ/Eclipse

### ensuite vou allez cloner le frontend

git clone https://github.com/adammoukit/nagode-transportapp-client.git
