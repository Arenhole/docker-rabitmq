# DOCKER - RABBITMQ

# Pour lancer le projet besoin de npm et node et docker

### Lancer docker

`docker compose up`

_Se rendre sur docker et creer une queue nommée 'command'_

### Installer les dependances

`npm i`

### Lancer le projet

`npm run start`

## Se rendre sur `http://localhost:3000/commande/create`

**Cela va creer une commande qui va etre traiter par rabitmq**

**Il est possible de voir l'avancement du triatement dans la console**

**5 secondes apres la commande est traitée**

**Les routes ne sont pas normées REST mais ont été nommée de cette façon par soucis de simplicité**

**Il est possible de la visualiser sur :**

`http://localhost:3000/commande/id/:id`
`http://localhost:3000/commande/numero/:numero`
