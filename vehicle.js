class Vehicle {
  // Constructeur du véhicule
  constructor(x, y, img) {
    // Position, vitesse, accélération
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    // Propriétés de mouvement
    this.maxSpeed = 4;
    this.maxForce = 0.9;

    // Image et dimensions
    this.img = img;
    this.r_pourDessin = 20;
    this.r = this.r_pourDessin;

    // Historique du mouvement
    this.history = [];
    this.historyLength = 20;
  }

  // Appliquer les comportements (seek) à un véhicule
  applyBehaviors(target, vehicles, isVehicle = true, separate = false, debug = false) {
    let seekForce = this.seek(target, isVehicle, true, debug);

    // Réduire l'intensité du force de recherche
    seekForce.mult(0.2);

    // Appliquer la force de séparation si activée
    if (separate) {
      let separationForce = this.separate(vehicles);
      separationForce.mult(0.3);
      this.applyForce(separationForce);
    }

    // Appliquer la force de recherche
    this.applyForce(seekForce);
  }

  // Séparation des véhicules pour éviter les collisions
  separate(vehicles) {
    let desiredseparation = this.r * 2;
    let steer = createVector(0, 0, 0);
    let count = 0;

    for (let i = 0; i < vehicles.length; i++) {
      let other = vehicles[i];
      let d = p5.Vector.dist(this.pos, other.pos);

      // Appliquer la force de séparation si d est dans la plage désirée
      if (d > 0 && d < desiredseparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    // Moyenne des forces de séparation
    if (count > 0) {
      steer.div(count);
    }

    // Normaliser et appliquer la force
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }

    return steer;
  }

  // Appliquer la force de recherche à un point
  seek(target, isVehicle = true, arrival = true, debug = false) {
    let desiredSpeed = this.maxSpeed;
    let force;

    // Calculer la force en fonction du type de cible (véhicule ou point)
    if (isVehicle) {
      force = p5.Vector.sub(target.pos, this.pos);
    } else {
      force = p5.Vector.sub(target, this.pos);
    }

    // Gérer l'arrêt en douceur si activé
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();

      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }

    // Appliquer la force
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);

    // Afficher le vecteur de vélocité en mode debug
    if (debug) {
      this.showDebugVector(force, this.pos, color(255, 0, 0));
    }

    return force;
  }

  // Appliquer une force externe au véhicule
  applyForce(force) {
    this.acc.add(force);
  }

  // Mettre à jour la position et l'historique du véhicule
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.history.push(createVector(this.pos.x, this.pos.y));

    // Limiter la longueur de l'historique
    if (this.history.length > this.historyLength) {
      this.history.shift();
    }

    // Réinitialiser l'accélération
    this.acc.set(0, 0);
  }

  // Afficher la position de la souris
  showMouse(mouse) {
    fill("red");
    stroke(255);
    strokeWeight(1);
    ellipse(mouse.x, mouse.y, this.r);
  }

  // Afficher le véhicule
  showVehicle(debug = false) {
    push();

    // Déplacer et tourner le système de coordonnées
    translate(this.pos.x, this.pos.y);
    let angle = atan2(this.vel.y, this.vel.x);
    rotate(angle + PI / 2);

    // Afficher l'image du véhicule
    imageMode(CENTER);
    image(this.img, 0, 0, this.r_pourDessin * 2, this.r_pourDessin * 2);

    // Gérer les bords de l'écran
    this.edges();

    // Afficher le vecteur de vélocité en mode debug
    if (debug) {
      this.showDebugVector(this.vel, createVector(0, 0), color(0, 255, 0));
    }
    pop();
  }

  // Gérer les bords de l'écran pour que les véhicules réapparaissent de l'autre côté
  edges() {
    const d = 25;
    let desired = null;

    // Gérer les bords horizontaux
    if (this.pos.x < d) {
      desired = createVector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.maxSpeed, this.vel.y);
    }

    // Gérer les bords verticaux
    if (this.pos.y < d) {
      desired = createVector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.vel.x, -this.maxSpeed);
    }

    // Appliquer la force pour rester à l'intérieur des bords
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxSpeed);
      const steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  // Déplacement aléatoire (wander)
  wander() {
    let wanderAngle = random(TWO_PI);
    let wanderRadius = 50;
    let wanderDistance = 100;
    let changeAngle = 0.1;

    // Modifier l'angle de déplacement aléatoire
    wanderAngle += random(-changeAngle, changeAngle);

    // Calculer la position cible sur le cercle
    let circleCenter = this.vel.copy();
    circleCenter.normalize();
    circleCenter.mult(wanderDistance);

    let offset = createVector(wanderRadius, 0);
    offset.rotate(wanderAngle);

    let target = p5.Vector.add(this.pos, circleCenter);
    target.add(offset);

    // Appliquer la force de déplacement aléatoire
    let wanderForce = p5.Vector.sub(target, this.pos);
    wanderForce.normalize();
    wanderForce.mult(0.5);
    this.applyForce(wanderForce);
  }

  // Afficher l'historique des positions du véhicule avec une couleur spécifiée
  showHistory(color) {
    noFill();
    stroke(color);
    beginShape();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      vertex(pos.x, pos.y);
    }
    endShape();
  }

  // Suivre un leader, éviter d'autres véhicules et obstacles
  runFromChef(leader, vehicles, f) {
    // Suivi du leader
    let followLeaderForce = this.seek(leader);
    followLeaderForce.mult(0.2);
    this.applyForce(followLeaderForce);

    // Séparation avec les autres véhicules
    let separationForce = this.separate(vehicles);
    separationForce.mult(0.3);
    this.applyForce(separationForce);

    // Évasion si devant le leader
    let ahead = this.pos.copy();
    ahead.add(p5.Vector.mult(this.vel.copy().normalize(), 25));
    let threat = p5.Vector.sub(leader.pos, this.pos);
    let distanceToLeader = threat.mag();
    threat.normalize();
    let dotProduct = threat.dot(this.vel);

    // Éviter le leader si devant
    if (dotProduct > 0 && dotProduct < distanceToLeader / 2 && distanceToLeader < 100) {
      let evadeForce = this.seek(ahead, false); // Éviter en se dirigeant vers l'avant
      evadeForce.mult(0.5);
      this.applyForce(evadeForce);
    }

    // Cercle devant le leader (fuite du centre du cercle)
    let circleCenter = leader.pos.copy();
    let fleeCircleForce = this.flee(circleCenter, 100); // 100 est le rayon du cercle
    fleeCircleForce.mult(f);
    this.applyForce(fleeCircleForce);
  }

  // Fuite d'une position spécifiée
  flee(target, panicDistance) {
    let desiredSpeed = this.maxSpeed;
    let force = p5.Vector.sub(this.pos, target);
    let distance = force.mag();

    // Appliquer la force de fuite si à une distance critique
    if (distance < panicDistance) {
      force.setMag(desiredSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    } else {
      return createVector(0, 0);
    }
  }

  // Éviter les obstacles en modifiant la trajectoire
  avoidObstacles(obstacles) {
    for (let obstacle of obstacles) {
      // Calculer la distance entre le véhicule et l'obstacle
      let distance = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);

      // Si le véhicule est trop proche de l'obstacle, appliquer une force pour l'éviter
      if (distance < obstacle.radius + this.r) {
        let desired = p5.Vector.sub(this.pos, obstacle.pos);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        steer.mult(0.5);
        this.applyForce(steer);
      }
    }
  }

  // Afficher le vecteur de vélocité en mode debug
 showDebugVector(vector, position, color) {
  push();
  stroke(color);
  strokeWeight(4); // Ajustez l'épaisseur de la ligne
  noFill();
  
  // Dessinez une ligne pour représenter le vecteur
  line(position.x, position.y, position.x + vector.x * 20, position.y + vector.y * 20);

  // Dessinez une flèche à l'extrémité du vecteur pour indiquer la direction
  let arrowSize = 6;
  translate(position.x + vector.x * 20, position.y + vector.y * 20);
  rotate(vector.heading());
  triangle(-arrowSize, arrowSize / 2, 0, 0, -arrowSize, -arrowSize / 2);

  pop();
}

// ...

// Dessiner des vecteurs lorsque le véhicule s'approche d'un obstacle en mode debug
drawAvoidanceVectors(obstacles) {
  for (let obstacle of obstacles) {
    // Calculer la distance entre le véhicule et l'obstacle
    let distance = dist(this.pos.x, this.pos.y, obstacle.pos.x, obstacle.pos.y);

    // Si le véhicule est trop proche de l'obstacle, afficher le vecteur d'évitement en mode debug
    if (distance < obstacle.radius + this.r) {
      let avoidanceForce = createVector(0, 0);

      // Appliquer la force d'évitement si le véhicule est trop proche de l'obstacle
      if (distance < obstacle.radius + this.r) {
        let desired = p5.Vector.sub(this.pos, obstacle.pos);
        desired.setMag(this.maxSpeed);
        avoidanceForce = p5.Vector.sub(desired, this.vel);
        avoidanceForce.limit(this.maxForce);
        avoidanceForce.mult(0.5);

        // Afficher le vecteur d'évitement en mode debug
        this.showDebugVector(avoidanceForce, this.pos, color(0, 0, 255));
      }
    }
  }
}

// ...

// Ajoutez cette fonction à votre classe Vehicle


}
