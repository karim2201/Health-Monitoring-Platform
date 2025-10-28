# 🏥 Health Monitoring Platform (IoMT) - PFE

Plateforme de télésurveillance médicale simulant des appareils connectés (wearables) pour le suivi en temps réel de la santé des patients avec alertes intelligentes et tableaux de bord multi-rôles. Ce projet a été développé dans le cadre d'un Projet de Fin d'Études (PFE).



## ✨ Fonctionnalités Principales

* **Simulation de Données Vitales :** Génération de données réalistes (rythme cardiaque, SpO2, pression artérielle) pour plusieurs patients.
* **Pipeline de Données Temps Réel :** Collecte, stockage (TimescaleDB) et diffusion (Redis Pub/Sub, WebSockets) des données en temps réel.
* **Authentification Sécurisée :** Système d'inscription et de connexion basé sur JWT avec gestion des rôles (Patient, Médecin, Admin - *partiellement implémenté*).
* **Détection d'Anomalies :**
    * Basée sur des règles cliniques (ex: bradycardie, hypoxie).
    * Basée sur l'apprentissage automatique (Isolation Forest).
* **Système d'Alertes :** Génération d'alertes (stockées dans MongoDB) avec logique anti-spam et niveaux de sévérité.
* **Dashboard Patient Temps Réel :** Interface React affichant les données vitales en direct et les alertes via WebSockets.
* **Documentation API :** Interface Swagger UI interactive pour explorer et tester l'API backend.
* **Architecture Microservices :** Structure modulaire basée sur Docker Compose pour une meilleure scalabilité et maintenance.

## 🏗️ Architecture

Le projet utilise une architecture microservices orchestrée par Docker Compose :

* **`frontend`**: Interface utilisateur React (Vite + TypeScript + Tailwind CSS).
* **`api-gateway`**: Point d'entrée principal (Node.js/Express), gère l'authentification, les WebSockets et expose l'API REST.
* **`device-simulator`**: Simule l'envoi de données vitales (Node.js).
* **`ml-service`**: Service de détection d'anomalies (Python/Flask + Scikit-learn).
* **`alert-engine`**: Écoute les données, interroge le `ml-service`, crée et publie les alertes (Node.js).
* **`db`**: Base de données Time-Series (PostgreSQL + TimescaleDB).
* **`mongo`**: Base de données NoSQL pour les métadonnées (Utilisateurs, Alertes).
* **`redis`**: Cache et broker de messages Pub/Sub.

*(Tu pourrais ajouter ici le diagramme d'architecture de ton cahier des charges si tu le souhaites)*

## 🛠️ Stack Technique

* **Frontend :** React, TypeScript, Vite, Tailwind CSS, Axios, Socket.io-client, Recharts
* **Backend :** Node.js, Express, TypeScript (pourrait être ajouté), Python, Flask
* **Bases de Données :** PostgreSQL (TimescaleDB), MongoDB, Redis
* **Machine Learning :** Scikit-learn, Joblib, Numpy, Pandas
* **Authentification :** JWT, Bcryptjs
* **API & Docs :** REST, Socket.io, Swagger (OpenAPI)
* **DevOps :** Docker, Docker Compose

## 🚀 Démarrage Rapide (Local)

**Prérequis :**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé.
* [Node.js](https://nodejs.org/) (pour `npm`) - optionnel si tu utilises uniquement Docker.
* Un client Git.

**Étapes :**

1.  **Cloner le dépôt :**
    ```bash
    git clone <URL_DE_TON_DEPOT_GITHUB>
    cd health-monitoring-platform
    ```

2.  **Créer les variables d'environnement :**
    * Copie `.env.example` (si tu en crées un) vers `.env` ou assure-toi que les variables sont bien dans `docker-compose.yml` (comme le `JWT_SECRET`).
    * **Important :** Change `JWT_SECRET` dans `docker-compose.yml` pour une chaîne de caractères longue et aléatoire !

3.  **Construire et Lancer les conteneurs :**
    ```bash
    docker-compose up --build -d
    ```
    *(Le `-d` lance en arrière-plan. Utilise `docker-compose logs -f` pour voir les logs.)*

4.  **(Optionnel) Entraîner le modèle ML (si pas déjà fait) :**
    * Le fichier `ml-service/models/isolation_forest_v1.pkl` est-il présent ? Si non :
    ```bash
    docker-compose run --rm ml-service python train_models.py
    # Redémarre ensuite le service ml-service si nécessaire
    docker-compose restart ml-service
    ```

5.  **Accéder aux services :**
    * **Frontend (Application) :** [http://localhost:5173](http://localhost:5173)
    * **API Gateway (Backend) :** [http://localhost:3000](http://localhost:3000)
    * **Documentation API (Swagger) :** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
    * **TimescaleDB (Port) :** `localhost:5432` (User: `postgres`, Pass: `mysecretpassword`, DB: `health_platform`)
    * **MongoDB (Port) :** `localhost:27017`
    * **Redis (Port) :** `localhost:6379`

**Identifiants de Démo (si créés) :**
* Patient : `patient1@demo.com` / `password123`
* *(Ajoute les autres si tu les as créés)*

## 🚦 Routes API Principales (Documentées via Swagger)

* `POST /api/auth/register` : Créer un utilisateur.
* `POST /api/auth/login` : Se connecter et obtenir un token JWT.
* `GET /api/users/me` : Obtenir le profil de l'utilisateur connecté (Protégé par JWT).
* *(Ajoute d'autres routes clés si tu les documentes plus tard)*

Consulte [http://localhost:3000/api-docs](http://localhost:3000/api-docs) pour la documentation complète et interactive.

## ✅ Prochaines Étapes / Améliorations Possibles

* Implémenter les modèles ML plus avancés (LSTM).
* Compléter les Dashboards Médecin et Admin.
* Mettre en place un système de rôles plus fin (permissions).
* Ajouter des tests unitaires et d'intégration.
* Configurer un pipeline CI/CD pour le déploiement.
* Améliorer la sécurité (validation d'entrée, chiffrement, etc.).
* Compléter la conformité RGPD.


## 🧑‍💻 Auteur
