import * as THREE from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import camera from '../cameras/mainCamera.js';
import renderer from '../renderer.js';
import navigateToPlanetSurface from '.././sceneManager.js';
export default class SolarSystem {
  constructor() {
    this.group = new THREE.Group();
    this.planets = {}; // Store planet objects
    this.planetSpeeds = { // Speed values for self-rotation & orbits
      // Sun: { rotation: 0.0005, orbit: 0 }, // Sun doesn't orbit
      "mercury_BezierCircle_4": { rotation: 0.005, orbit: 0, distance: 3 },
      "venus_BezierCircle_7": { rotation: 0.002, orbit: 0, distance: 5 },
      "erath_BezierCircle_11": { rotation: 0.01, orbit: 0, distance: 7 },
      "mars_BezierCircle_14": { rotation: 0.008, orbit: 0, distance: 9 },
      "jupiter_BezierCircle_17": { rotation: 0.02, orbit: 0, distance: 12 },
      "saturn_BezierCircle_21": { rotation: 0.018, orbit: 0, distance: 16 },
      "uranus_BezierCircle_24": { rotation: 0.015, orbit: 0., distance: 19 },
      "neptune_BezierCircle_27": { rotation: 0.012, orbit: 0, distance: 22 }
    };

    this.camera = camera;
    this.renderer = renderer;
    this.navigateToPlanetSurface = navigateToPlanetSurface;


    const loader = new GLTFLoader();
    loader.load(
      '../../assets/models/solar_system_animation.glb',
      (gltf) => {
        console.log('Solar system model loaded.');
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.set(0, 1, 0);
        this.group.add(gltf.scene);
        this.setupBoundingSpheres();
        this.extractPlanets(gltf.scene);
      },
      (xhr) => {
        console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading the solar system model:', error);
      }
    );
  }

  /**
   * Extracts individual planets from the GLTF model and stores them in `this.planets`
   */
  extractPlanets(solarSystemScene) {
    Object.keys(this.planetSpeeds).forEach((planetName) => {
      const planet = solarSystemScene.getObjectByName(planetName);
      if (planet) {
        this.planets[planetName] = planet;
        console.log(`Planet found: ${planetName}`);
      } else {
        console.warn(`Planet ${planetName} not found in the GLTF file!`);
      }
    });
  }
  /**
   * Adds bounding spheres around each planet for interaction.
   */
  setupBoundingSpheres() {
    Object.keys(this.planets).forEach((planetName) => {
      const planet = this.planets[planetName];
      if (planet) {
        // Create a bounding sphere for interaction
        const geometry = new THREE.SphereGeometry(1, 32, 32); // Adjust radius as needed
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const sphere = new THREE.Mesh(geometry, material);

        // Position the sphere at the planet's location
        sphere.position.copy(planet.position);

        // Add sphere to the planet and store it
        this.group.add(sphere);
        this.planetInteractives[planetName] = sphere;
        sphere.name = planetName;
      }
    });
  }

  /**
   * Returns the object of a specific planet by name.
   * @param {string} planetName The name of the planet to retrieve.
   */
  getPlanet(planetName) {
    return this.planets[planetName];
  }
  handleClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // Check intersections with bounding spheres
    const intersects = raycaster.intersectObjects(Object.values(this.planetInteractives));
    if (intersects.length > 0) {
      const clickedSphere = intersects[0].object;
      console.log(`Clicked on planet: ${clickedSphere.name}`);
      this.navigateToPlanetSurface(clickedSphere.name);
    }
  }
  /**
   * Updates planet rotation and orbit in the animation loop.
   */
  update() {
    const time = Date.now() * 0.0001; // Time factor to keep animation smooth

    Object.keys(this.planets).forEach((planetName) => {
      const planet = this.planets[planetName];
      const speed = this.planetSpeeds[planetName];

      if (planet) {
        // Self-Rotation
        planet.rotation.y += speed.rotation;

        // Orbit Movement (excluding the Sun)
        if (speed.orbit > 0) {
          planet.position.x = speed.distance * Math.cos(time * speed.orbit);
          planet.position.z = speed.distance * Math.sin(time * speed.orbit);
        }
      }
    });
  }
}
