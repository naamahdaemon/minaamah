---
sidebar_position: 3
sidebar_label: Programme de délégation
sidebar_class_name: green
---
# Programme de délégation
Le programme de délégation de la Fondation Mina (il existe également un programme de délégation opéré par o1labs) permet, sous certaines conditions, la délégation d'environ 800k-1M de Mina de la part de la Fondation Mina. 
Cela permet aux validateurs indépendants de produire des blocs et de recevoir des récompenses (coinbase) pour la production de ces blocs.

Les informations sur la manière de rejoindre le programme et les conditions du programme sont disponibles ici :

- [https://www.minafoundation.com/#delegation](https://www.minafoundation.com/#delegation)

Dans les faits, les conditions à respecter pour prétendre à une délégation de la fondation sont les suivantes :

* Opérer un ou plusieurs serveurs faisant tourner un nœud de validation Mina.
* Maintenir un temps de disponibilité global du serveur de 100 % pendant au minimum 3 mois (90 jours), à l'issue desquels la première condition d'éligibilité sera remplie (temps de disponibilité = 100 %).
* Fournir les informations KYC (Know Your Customer) demandées par les initiateurs du programme (Fondation Mina / o1Labs) via l'un de leurs partenaires agréés (Coinlist / Synaps).
* Faire partie des 240 premiers validateurs avec le score de temps de disponibilité le plus élevé (100 % étant la norme ; il y a environ 340 opérateurs avec 100 % de disponibilité aujourd'hui).
  * En cas d'égalité, la fondation ou o1labs procède à un tirage au sort.

Une fois la délégation obtenue, respecter les règles imposées par la fondation :

* Calculer avec précision le montant de récompense à retourner à chaque délégataire (il existe un script pour automatiser ce processus).
* Retourner le montant de récompense requis dans le délai spécifié (bloc 3500 de l'epoch n+1 au plus tard).
* Suivre les règles (mémo de transaction contenant le hash MD5 de l'adresse publique du producteur de bloc, montant et délai de remboursement).
