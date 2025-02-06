export default class Planet {
    constructor(parentScene, name, surfaceModelPath) {
      this.name = name;
      this.surfaceModelPath = surfaceModelPath;
      this.object = parentScene.getObjectByName(name);
      this.surface = null; // To be loaded later
  
      if (!this.object) {
        console.warn(`Planet ${name} not found in the solar system model.`);
      }
  
      this.loadSurface(parentScene);
    }
  
    loadSurface(scene) {
      if (!this.surfaceModelPath) return;
  
      const loader = new GLTFLoader();
      loader.load(
        this.surfaceModelPath,
        (gltf) => {
          console.log(`${this.name} surface model loaded.`);
          this.surface = gltf.scene;
  
          // Scale and add surface to the scene
          this.surface.scale.set(1, 1, 1);
          scene.add(this.surface);
        },
        undefined,
        (error) => {
          console.error(`Error loading ${this.name} surface model:`, error);
        }
      );
    }
  }
  