// Déclaration des variables globales
let vehicles = [];
let obstacles = [];
let aliens = [];
let stars = [];
let mouse;
let maxVehicles = 1;
let img, planet1, planet2, alien;
let toggle;
let debugMode = false; // Nouvelle variable pour activer/désactiver le mode debug

// Déclaration des sliders
let speedSlider, forceSlider;

// Fonction de chargement des images avant le démarrage
function preload() {
  img = loadImage('assets/images/vaisseau.png');
  planet1 = loadImage('assets/images/p1.png');
  planet2 = loadImage('assets/images/p2.png');
  alien = loadImage('assets/images/alien.png');
}

// Fonction de configuration du canvas et initialisation des véhicules, obstacles, et étoiles
function setup() {
  createCanvas(1000, 600);
  toggle = false;

  // Initialisation des véhicules
  for (let i = 0; i < maxVehicles; i++)
    vehicles.push(new Vehicle(random(width), random(height), img));

  // Initialisation des aliens
  for (let i = 0; i < 3; i++) {
    let a = new Vehicle(random(width), random(height), alien);
    a.r_pourDessin = 40;
    a.maxSpeed = 2;
    aliens.push(a);
  }

  // Initialisation des étoiles
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      speed: random(0.1, 0.5) // Vitesse de l'étoile
    });
  }

  // Initialisation des obstacles avec des images de planètes
  for (let i = 0; i < 5; i++)
    obstacles.push(new Obstacle(random(width), random(height), random([planet1, planet2])));

  // Création des sliders
  speedSlider = createSlider(0, 10, 4, 0.1);
  forceSlider = createSlider(0, 1, 0.9, 0.1);

  // Positionnement des sliders
  speedSlider.position(width - 150, 30);
  forceSlider.position(width - 150, 70);

  // Création des labels pour les sliders
  let speedLabel = createDiv('Vitesse');
  let forceLabel = createDiv('Force');

  // Positionnement des labels
  speedLabel.position(width - 200, 30);
  forceLabel.position(width - 200, 70);
  speedLabel.style('color', 'white');
  forceLabel.style('color', 'white');
  speedLabel.style('font-family', 'Arial, sans-serif');
  forceLabel.style('font-family', 'Arial, sans-serif');
  speedLabel.style('font-size', '14px');
  forceLabel.style('font-size', '14px');
}

// Fonction de rendu qui est appelée à chaque frame
function draw() {
  background(0);
  drawStarryBackground();

  mouse = createVector(mouseX, mouseY);

  // Affichage des obstacles
  for (let obstacle of obstacles) {
    obstacle.show();
  }

  // Mise à jour et affichage des aliens
  for (let alien of aliens) {
    alien.maxSpeed = speedSlider.value();
    alien.maxForce = forceSlider.value();

    alien.wander();
    alien.avoidObstacles(obstacles);
    alien.update();

    // Passer la variable debugMode à la fonction showVehicle
    alien.showVehicle(debugMode);
    alien.showHistory("green");
  }

  // Mise à jour et affichage des véhicules
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].maxSpeed = speedSlider.value();
    vehicles[i].maxForce = forceSlider.value();

    if (i == 0)
      vehicles[i].wander();
    else {
      if (toggle) {
        vehicles[i].applyBehaviors(vehicles[i - 1], vehicles, true, false, debugMode);
      } else {
        vehicles[i].runFromChef(vehicles[0], vehicles, 4);
        vehicles[i].applyBehaviors(vehicles[0], vehicles, true, true, debugMode);
      }
    }
    vehicles[i].avoidObstacles(obstacles);
    vehicles[i].avoidObstacles(aliens);
    vehicles[i].update();

    // Passer la variable debugMode à la fonction showVehicle
    i == 0 ? vehicles[i].showVehicle(debugMode) : vehicles[i].showVehicle(debugMode);
    i == 0 ? vehicles[i].showHistory("yellow") : vehicles[i].showHistory("lightblue");
  }
}

// Fonction appelée en cas d'appui sur une touche
function keyPressed() {
  // Ajout d'un véhicule en appuyant sur la touche "v"
  if (key == "v") {
    vehicles.push(new Vehicle(random(width), random(height), img));
  }

  // Ajout d'un alien en appuyant sur la touche "w"
  if (key == "w") {
    let a = new Vehicle(random(width), random(height), alien);
    a.r_pourDessin = 40;
    a.maxSpeed = 2;
    aliens.push(a);
  }

  // Ajout de 10 véhicules en appuyant sur la touche "f"
  if (key == "f") {
    for (let i = 0; i < 10; i++)
      vehicles.push(new Vehicle(random(width), height, img));
  }

  // Activation/désactivation du mode debug en appuyant sur la touche "d"
  if (key == "d") {
    debugMode = !debugMode;
  }

  // Activation/désactivation du mode de suivi en appuyant sur la touche "s"
  if (key == "s") {
    toggle = !toggle;
  }
}

// Fonction appelée lorsqu'un clic de souris est détecté
function mousePressed() {
  // Ajout d'un obstacle à la position de la souris avec une image de planète aléatoire
  obstacles.push(new Obstacle(mouseX, mouseY, random([planet1, planet2])));
}

// Fonction de rendu des étoiles en arrière-plan
function drawStarryBackground() {
  // Mettez à jour et dessinez les étoiles
  fill(255);
  noStroke();
  for (let star of stars) {
    ellipse(star.x, star.y, 2, 2); // Ajustez la taille des étoiles selon vos préférences

    // Mettez à jour la position de l'étoile en fonction de sa vitesse
    star.x += star.speed;

    // Si l'étoile sort du canvas, réinitialisez sa position
    if (star.x > width) {
      star.x = 0;
      star.y = random(height);
    }
  }
}
