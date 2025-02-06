import Planet from '../planet.js';

export default class Mars extends Planet {
  constructor(parentScene) {
    super(parentScene, 'mars_BezierCircle_14', '../../assets/models/mars.glb');
  }

  update() {
    super.update();
    // Additional Mars-specific logic, if any
  }
}
