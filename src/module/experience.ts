import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Experience {
    targetElement: any;
    scene: any;
    camera: any;
    renderer: any;

    constructor({ targetElement }: any) {
        this.targetElement = document.getElementById(targetElement);

        this.setScene();
        this.setCamera();
        this.setRenderer();

        this.update();
        window.addEventListener('resize', () => this.resize());
    };

    setScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // this.world = new World({ scene: this.scene });
    };

    setBackground(color: THREE.Color) {
        this.scene.background = color;
    };

    getBackground() {
        return this.scene.background;
    };

    setCamera() {
        this.camera = new Camera({ targetElement: this.targetElement, scene: this.scene });
    };

    setRenderer() {
        this.renderer = new Renderer({ targetElement: this.targetElement, scene: this.scene, camera: this.camera.instance });
    };

    resize() {
        this.renderer ? this.renderer.resize() : null;
        this.camera ? this.camera.resize() : null;
    };

    update() {
        this.camera ? this.camera.update() : null;
        this.renderer ? this.renderer.update() : null;

        window.requestAnimationFrame(() => this.update());
    };
};

class Camera {
    targetElement: any;
    scene: any;
    instance: any;
    orbitControl: any;

    constructor({ targetElement, scene }: any) {
        this.targetElement = targetElement;
        this.scene = scene;

        this.setInstance();
    };

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        this.instance.position.set(4, 10, 13);
        this.scene.add(this.instance);

        this.orbitControl = new OrbitControls(this.instance, this.targetElement)
        this.orbitControl.enableDamping = true;
    };

    resize() {
        this.instance.aspect = window.innerWidth / window.innerHeight;
    };

    update() {
        this.instance.updateProjectionMatrix();
        this.orbitControl.update();
    };
};

class Renderer {
    targetElement: any;
    scene: any;
    camera: any;
    renderer: any;
    instance: any;

    constructor({ targetElement, scene, camera }: any) {
        this.targetElement = targetElement;
        this.scene = scene;
        this.camera = camera;

        this.setInstance();
    };

    setInstance() {
        this.instance = new THREE.WebGL1Renderer({
            canvas: this.targetElement,
            alpha: false,
            antialias: true
        });
        this.instance.setSize(window.innerWidth, window.innerHeight);
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.instance.physicallyCorrectLights = true;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.instance.gammaOutPut = true
        // this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMapping = THREE.ReinhardToneMapping
        // this.instance.toneMappingExposure = 1.3
        this.instance.render(this.scene, this.camera);
    };

    resize() {
        this.instance.setSize(window.innerWidth, window.innerHeight);
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    update() {
        this.instance.render(this.scene, this.camera);
    };

    destroy() {
        this.instance.renderLists.dispose();
        this.instance.dispose();
    };
};

export default Experience;