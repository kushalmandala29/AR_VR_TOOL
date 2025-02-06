import * as THREE from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import SolarSystem from './models/solarSystem.js';
import Planet from './models/planet.js'; // Base class for planets

export default class SceneManager {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;

    // Create solar system scene
    this.solarSystemScene = new THREE.Scene();
    this.solarSystemScene.background = new THREE.Color(0x000000);

    // Solar system
    this.solarSystem = new SolarSystem(camera, renderer, (planetName) => {
      this.switchToPlanetSurface(planetName);
    });
    this.solarSystemScene.add(this.solarSystem.group);

    // Add lighting to solar system scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.solarSystemScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.solarSystemScene.add(directionalLight);

    // Placeholder for planet surface scenes
    this.planetScenes = {};
    this.currentScene = this.solarSystemScene; // Default to solar system scene
  }
  

  /**
   * Switches to a specific planet's surface scene.
   * @param {string} planetName The name of the planet.
   */
  switchToPlanetSurface(planetName) {
    console.log(`Switching to ${planetName} surface scene.`);

    // Check if the scene for this planet already exists
    if (!this.planetScenes[planetName]) {
      // Create a new scene for the planet surface
      const planetScene = new THREE.Scene();
      planetScene.background = new THREE.Color(0x000000);

      // Load the planet using the Planet class
      const planetSurface = new Planet(
        planetScene,
        planetName,
        `../../assets/models/${planetName}_surface.glb`
      );

      // Add lighting to the planet scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      planetScene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10);
      planetScene.add(directionalLight);

      // Store the scene
      this.planetScenes[planetName] = planetScene;
    }

    // Switch to the planet's scene
    this.currentScene = this.planetScenes[planetName];
  }
  navigateToPlanetSurface(planetName) {
    console.log(`Navigating to surface of: ${planetName}`);
    sceneManager.switchToPlanetSurface(planetName); // Handle scene switching here
  }

  /**
   * Switches back to the solar system scene.
   */
  switchToSolarSystem() {
    console.log('Switching back to solar system scene.');
    this.currentScene = this.solarSystemScene;
  }

  /**
   * Update the current scene.
   */
  update() {
    if (this.currentScene === this.solarSystemScene) {
      this.solarSystem.update();
    }
  }

  /**
   * Renders the current scene.
   */
  render() {
    this.renderer.render(this.currentScene, this.camera);
  }
}
