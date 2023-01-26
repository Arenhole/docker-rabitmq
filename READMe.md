# DOCKER - RABBITMQ

# Pour lancer le projet besoin de npm et node et docker

## _Prérequis_ : _node_, _npm_, _docker_, _docker-compose_

### _Prérequis_ Créer la queue Rabbitmq

_Se rendre sur rabbitmq et creer une queue nommée 'command'_

# Il est possible de spécifier dans le .env le port de l'api commande et le npm de la queue rabbitmq

### Installer les dependances

`npm i`

### Le npm i installe les dependances dont sqlite3, il n'y a pas besoin d'installer quoi que ce soit d'autre

**Il faut ensuite lancer la commande `docker-compose up` ou `docker compose up` pour lancer rabitmq**

### Lancer le projet

**On lance ensuite le projet avec npm run start**
`npm run start`

## TEST

_Lancer avec curl ou wget ou postman une requete post_
`curl -H 'Content-Type: application/json' -d '{}' "http://localhost:${port}/commande/create"`
**_préciser le port_**

**Cela va creer une commande qui va etre traiter par rabitmq**

**Il est possible de voir l'avancement du triatement dans la console**

**5 secondes apres la commande est traitée**

# Les different fichiers

- _rabitmq.js_ : `Traite les differentes demandes rabbitmq, gere la connexion, le consumer et le fait de send le message`
- _worker.js_ : `Fonction envoyé ensuite a la lib rabitmq pour traiter le message et faire les traitements`
- _db.js_ : `Gère la connexion a la bd`
- _api.js_ : `Gère la création de l'api et des routes`
- _index.js_ : `Lie tout les fichiers entre eux grace a l'injection de dépendances`

# L'API ne renvoie que des codes d'erreurs 400 Bad Request car toute les routes sont en get et pour la route create on ne passe aucun body car inutile (id: auto-increment, uuid: généré, flag: statique)

# Fonctionnement

- On lance une requete `create` en post avec un body vide ou pas
- La commande est créé et ajouté a la bd avec le flag 'Commande en attente de traitement'
- L'api se charge grace a la lib `rabitmq` d'envoyer un message qui contient le num de commande et un message 'Creer le plat'
- Le worker qui ecoute la `queue` spécifier dans le `.env` recoit le message, apres 5 secondes il met a jour la commande en mettant son flag a 'Commande Traitée'
- il est possible de vérifier la commande et son flag grace a son numero de commande ou son id

# Routes pour visualiser ses commandes en get

`http://localhost:3000/commandes`
`http://localhost:3000/commande/id/:id`
`http://localhost:3000/commande/numero/:numero`
