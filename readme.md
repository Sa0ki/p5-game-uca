# Simulation de Véhicules et Obstacles

Cette simulation utilise le langage de programmation [p5.js](https://p5js.org/) pour créer une scène interactive avec des vaisseaux, des obstacles sous forme de planetes, des aliens et des fonctionnalités de suivi.

## Contenu du Projet

- `sketch.js`: Fichier principal contenant la configuration et la logique principale de la simulation.
- `Vehicle.js`: Classe représentant un véhicule avec des comportements de déplacement.
- `Obstacle.js`: Classe représentant un obstacle avec une fonctionnalité d'affichage.

## Comportements des Véhicules

Les véhicules dans la simulation présentent plusieurs comportements intéressants :

1. **Suivi d'un Leader :** Les véhicules suivent un leader, ajustant leur trajectoire en conséquence.
2. **Snake :** Les véhicules se mettent en formation de serpent.
3. **Séparation :** Les véhicules évitent de se regrouper en appliquant une force de séparation.
4. **Évasion :** Si un véhicule est devant le leader, il évite en changeant sa trajectoire.
5. **Wandering :** Les véhicules peuvent se déplacer de manière aléatoire, simulant un comportement errant.

## Comportements des Aliens

Les aliens dans la simulation (représentés par des vaisseaux verts) présentent des comportements similaires aux véhicules, avec une tendance à errer et à éviter les obstacles.

## Interaction Utilisateur

- Appuyez sur la touche **"v"** pour ajouter un nouveau véhicule.
- Appuyez sur la touche **"w"** pour ajouter un alien.
- Appuyez sur la touche **"f"** pour ajouter 10 véhicules d'un coup.
- Appuyez sur la touche **"s"** pour activer/désactiver les modes Snake/Suivi de leader.
- Appuyez sur la touche **"d"** pour activer/désactiver le debug.

## Ajout d'Obstacles

- Cliquez n'importe où sur la scène pour ajouter un obstacle avec une image de planète aléatoire.

## Configuration du Projet

- Les images utilisées (vaisseau, aliens, planètes) sont préchargées à l'aide de la fonction `preload`.
- Le code utilise également une simulation de fond étoilé pour une expérience visuelle fluide.

## Remarques 

- Le projet a été réalisé à l'aide des concepts appris en classe et également avec un peu de chatgpt. 
Lorsque les véhicules se mettent en Snake, j'ai retiré le comportement de séparation car ça ruine un peu l'effet. J'avais discuté de ça avec vous en classe, et vous m'aviez proposé de l'enlever.

- Concernant le debug, vu qu'on a rotate l'image, le vecteur de velocité semble ne pas pointer à 100% là où il devrait, 
mais je pense que c'est juste dû à la rotation PI/2 de l'image.

- Je tiens à préciser que je recontre un petit soucis de précision de force quand la séparation entre les véhicules et celle entre eux et les planètes sont appliquées. On dirait que les forces rentrent en conflit et du coup ça conduit à un comportement totalement imprévisible des véhicules. Certains restent bloqués et attendent à ce que le leader repasse à côté d'eux pour reprendre leur comportement.
Ca donne un aspect drôle et un peu naturel, c'est un peu l'effet recherché, mais je n'arrive pas à améliorer ceci.

- J'attends avec impatience votre retour et si vous avez une petite astuce pour la force, n'hésitez pas à me donner une piste.

- Enfin, je ne sais pas si vous vous rappellez du petit projet snake réalisé avec la SDL2 que je vous ai montré XD, si je continue et que j'arrive à faire un truc sympa grâce aux concepts que j'ai appris grâce à vous, je vous l'enverrai avec grand plaisir ! 

- Merci beaucoup pour vos cours et votre bonne humeur !
