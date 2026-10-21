# EventEase

EventEase est une application mobile de gestion d'événements développée avec React Native et Expo.

L'application permet à plusieurs utilisateurs locaux de créer des événements, consulter un calendrier, gérer leurs participations et retrouver des informations contextuelles comme la distance ou la météo.

Le projet a été réalisé dans le cadre d'un projet scolaire React Native.

---

## Fonctionnalités

### Authentification

- création d'un compte avec nom d'utilisateur, adresse e-mail et mot de passe ;
- unicité du nom d'utilisateur et de l'adresse e-mail ;
- connexion avec le nom d'utilisateur **ou** l'adresse e-mail ;
- conservation locale de la session ;
- déconnexion depuis le profil.

### Gestion des événements

Un utilisateur connecté peut :

- consulter les événements à venir et passés ;
- créer un événement ;
- renseigner un titre, une description, une date, une heure et un lieu ;
- définir éventuellement un nombre maximal de participants ;
- modifier les événements qu'il organise ;
- supprimer les événements qu'il organise ;
- consulter une page de détails complète.

Chaque événement possède un organisateur.

L'organisateur est automatiquement associé à son événement, mais il n'est pas comptabilisé dans le nombre de participants et n'occupe donc aucune place.

### Participations

Les participations sont gérées individuellement pour chaque utilisateur.

Un utilisateur peut rejoindre ou quitter un événement tant que celui-ci n'est pas passé.

Lorsqu'une capacité maximale est définie :

- les nouvelles inscriptions sont refusées lorsque l'événement est complet ;
- un participant déjà inscrit peut toujours libérer sa place ;
- l'organisateur ne consomme aucune place ;
- la capacité ne peut pas être réduite sous le nombre de participants déjà inscrits.

Les participations aux événements passés sont figées.

### Calendrier

Les événements peuvent être consultés dans une vue calendrier basée sur `react-native-calendars`.

Les jours contenant des événements sont identifiés et permettent d'accéder rapidement aux événements correspondants.

### Localisation

L'application peut demander l'autorisation d'accéder à la position de l'utilisateur.

Lorsqu'un événement possède des coordonnées géographiques, EventEase calcule la distance à vol d'oiseau entre l'utilisateur et le lieu de l'événement.

Le calcul est réalisé localement avec la formule de Haversine.

### Géocodage

Lors de la création ou de la modification d'un événement, le lieu saisi peut être converti en coordonnées grâce au service de géocodage d'Open-Meteo.

Un échec du géocodage ne bloque pas la création de l'événement.

### Météo

Pour les événements suffisamment proches dans le temps, EventEase utilise l'API Open-Meteo afin d'afficher notamment :

- les conditions météorologiques ;
- la température minimale ;
- la température maximale ;
- la probabilité maximale de précipitations.

La météo est une information optionnelle : une erreur réseau ou l'absence de prévisions n'empêche jamais l'utilisation de l'application.

---

## Comptes de démonstration

Trois comptes sont automatiquement ajoutés au stockage local afin de tester rapidement les fonctionnalités multi-utilisateurs.

| Nom d'utilisateur | Adresse e-mail         | Mot de passe |
| ----------------- | ---------------------- | ------------ |
| `alice.martin`    | `alice@eventease.demo` | `demo123`    |
| `hugo.leroy`      | `hugo@eventease.demo`  | `demo123`    |
| `sarah.dupont`    | `sarah@eventease.demo` | `demo123`    |

La connexion peut être effectuée avec le nom d'utilisateur ou l'adresse e-mail.

Les comptes possèdent déjà plusieurs événements et participations afin de simuler une activité réelle dans l'application.

Par exemple :

| Événement                      | Organisateur | Participants de démonstration |
| ------------------------------ | ------------ | ----------------------------- |
| Conférence React Native        | Alice        | Hugo, Sarah                   |
| Atelier Docker & API           | Hugo         | Alice, Sarah                  |
| Soirée gaming de l'association | Sarah        | Alice, Hugo                   |
| Rencontre de rentrée           | Alice        | Hugo, Sarah                   |

Les dates de ces événements sont calculées relativement au jour du premier lancement afin que la démonstration conserve toujours des événements passés et à venir.

---

## Navigation

L'application utilise React Navigation avec une navigation principale par onglets.

```text
RootStack
├── Auth
├── AppTabs
│   ├── Accueil
│   ├── Événements
│   ├── Calendrier
│   └── Profil
├── EventDetails
└── EventForm
```

Lorsqu'aucune session n'est active, seul l'écran d'authentification est accessible.

Après connexion, l'utilisateur accède à l'application principale.

---

## Technologies utilisées

| Technologie                 | Utilisation                              |
| --------------------------- | ---------------------------------------- |
| React Native                | interface mobile                         |
| Expo                        | environnement et outils de développement |
| TypeScript                  | typage statique                          |
| React Navigation            | navigation                               |
| AsyncStorage                | persistance locale                       |
| react-native-calendars      | calendrier                               |
| expo-location               | géolocalisation                          |
| expo-image                  | affichage des ressources graphiques      |
| Open-Meteo                  | météo et géocodage                       |
| @react-native-picker/picker | sélection de l'heure                     |

---

## Installation

### Prérequis

- Node.js ;
- npm ;
- Expo Go sur un téléphone pour tester facilement l'application sur mobile.

### Cloner le projet

```bash
git clone https://github.com/ThibSama/eventease.git
cd eventease
```

### Installer les dépendances

```bash
npm install
```

### Lancer Expo

```bash
npm start
```

Le terminal affiche ensuite un QR code pouvant être ouvert avec Expo Go.

---

## Commandes disponibles

```bash
# Lancer Expo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web

# ESLint
npm run lint

# Vérification TypeScript
npm run typecheck

# Diagnostic Expo
npx expo-doctor
```

---

## Organisation du projet

```text
eventease/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── theme.ts
├── app.json
├── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

### `components`

Composants réutilisables de l'interface, notamment les boutons, badges, cartes d'événements et formulaires.

### `context`

Contient le contexte global de l'application et la logique principale liée :

- à l'authentification ;
- aux événements ;
- aux droits des organisateurs ;
- aux participations.

### `hooks`

Hooks spécialisés pour accéder au contexte, à la localisation et aux prévisions météo.

### `navigation`

Configuration de React Navigation et des différents écrans de l'application.

### `screens`

Écrans principaux :

```text
AuthScreen
HomeScreen
EventsScreen
CalendarScreen
EventDetailsScreen
EventFormScreen
ProfileScreen
```

### `services`

Services indépendants pour :

- la persistance AsyncStorage ;
- le géocodage ;
- la météo.

### `utils`

Fonctions utilitaires liées notamment aux dates, à la validation, aux utilisateurs, à l'affichage des événements et au calcul des distances.

---

## Persistance locale

EventEase ne possède pas de backend.

Les informations sont stockées directement sur l'appareil avec AsyncStorage :

```text
@eventease/v5/users
@eventease/v5/session
@eventease/v5/events
```

Le stockage est versionné afin de permettre la réinitialisation contrôlée des données de démonstration lorsque leur structure évolue.

Les comptes et événements de démonstration sont initialisés automatiquement lors de la première utilisation de cette version du stockage.

Les modifications réalisées ensuite par l'utilisateur sont persistées localement.

---

## Modèle simplifié d'un événement

```ts
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  participantIds: string[];
  maxParticipants?: number;
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  organizer: {
    userId: string;
    username: string;
  };
};
```

L'organisateur et les participants sont volontairement séparés.

```text
Événement
├── organizer
│   └── appartient automatiquement à l'événement
│       mais ne consomme aucune place
│
└── participantIds
    └── contient uniquement les autres participants
```

---

## Règles métier principales

### Propriété des événements

Seul l'utilisateur ayant créé un événement peut le modifier ou le supprimer.

Cette règle est vérifiée dans l'interface mais également dans le contexte applicatif afin de ne pas dépendre uniquement de l'affichage des boutons.

### Dates

Un nouvel événement ne peut pas être créé dans le passé.

Un événement existant ne peut pas être déplacé dans le passé.

Les événements déjà passés restent consultables.

### Participation

Un événement passé ne peut plus être rejoint ou quitté.

L'organisateur ne peut pas rejoindre son propre événement en tant que participant puisqu'il y est déjà associé comme organisateur.

### Capacité

La capacité est optionnelle.

Sans capacité définie, le nombre de participants est considéré comme illimité.

---

## Interface

EventEase utilise une interface sombre conçue spécifiquement pour l'application.

La navigation principale permet d'accéder rapidement :

- à la vue d'ensemble ;
- à la liste des événements ;
- au calendrier ;
- au profil utilisateur.

Les écrans affichent également des informations contextuelles telles que :

- le statut passé ou à venir ;
- le statut de participation ;
- le statut d'organisateur ;
- la distance ;
- la météo ;
- le nombre de participants ;
- la capacité disponible.

---

## Limites du projet

EventEase est un prototype scolaire fonctionnant entièrement en local.

Il ne cherche pas à reproduire l'architecture d'une application de production.

En particulier :

- les comptes sont stockés localement ;
- les mots de passe sont stockés en clair dans AsyncStorage ;
- aucune synchronisation n'existe entre plusieurs appareils ;
- il n'existe pas de serveur ou de base de données distante ;
- les droits utilisateurs sont des règles applicatives locales et non des autorisations serveur ;
- les données d'un appareil ne sont pas partagées avec un autre appareil ;
- les prévisions météo dépendent de la disponibilité d'Open-Meteo ;
- la localisation dépend de l'autorisation accordée par l'utilisateur.

Ces choix sont volontaires et correspondent au périmètre du projet.

---

## Vérification du projet

Avant livraison, le projet peut être vérifié avec :

```bash
npm run lint
npm run typecheck
npx expo-doctor
```

Une vérification supplémentaire de la configuration Expo peut être réalisée avec :

```bash
npx expo config --type public
```
