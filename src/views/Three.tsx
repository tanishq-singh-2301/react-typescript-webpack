import { useEffect, FC } from 'react';
import '../scss/home.scss';

/** THREE */
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import Experience from '../module/experience';

/** ASSETS */
// const baked = require('../../static/images/baked.jpg');
// const space = require('../../static/models/space.glb');

class World extends Experience {
    box: THREE.Mesh;
    scene: THREE.Scene;
    overlayMaterial: THREE.ShaderMaterial;
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    loadingManager: THREE.LoadingManager;
    loadingBarElement: any;
    gui: dat.GUI;

    ambientLight: THREE.AmbientLight;

    constructor({ targetElement }: any) {
        super({ targetElement });

        this.setGUI();
        // this.setOverlays();
        // this.setLoadingManager();
        this.setLoaders();
        this.setWorld();
    };

    setGUI() {
        this.gui = new dat.GUI();
    };

    setWorld() {
        this.setBackground(new THREE.Color('#121212'));
        this.setLights();
        console.error = () => { };
        console.warn = () => { };

        // this.gltfLoader.load(space, gltf => {
        //     gltf.scene.scale.set(2, 2, 2);
        //     gltf.scene.position.set(0, -.8, 0);

        //     gltf.scene.traverse(child => {
        //         (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
        //             color: 'white',
        //             wireframe: true
        //         });

        //         child.receiveShadow = true;
        //     });

        //     this.cannon.setLand(gltf.scene.children[1]);
        //     this.scene.add(gltf.scene);
        // });

        this.cannon.setCar();

        this.updateAllMaterials();
    };

    setLights() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);
    };

    updateAllMaterials() {
        this.scene.traverse(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.needsUpdate = true;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    };

    setLoadingManager() {
        this.loadingBarElement = document.querySelector('.loading-bar');
        this.loadingManager = new THREE.LoadingManager(() => {
            window.setTimeout(() => {
                gsap.to(this.overlayMaterial.uniforms.uAlpha, {
                    duration: 3,
                    value: 0,
                    delay: 1
                });

                this.loadingBarElement.classList.add('ended');
                this.loadingBarElement.style.transform = '';
            }, 500);
        }, (itemUrl, itemsLoaded, itemsTotal) => this.loadingBarElement.style.transform = `scaleX(${itemsLoaded / itemsTotal})`);
    };

    setLoaders() {
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    };

    setOverlays() {
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: {
                    value: 0.93
                }
            },
            vertexShader: `
                    void main() {
                        gl_Position = vec4(position, 1.0);
                    }
                `,
            fragmentShader: `
                    uniform float uAlpha;
                    void main() {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                    }
                `
        });

        this.scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 1, 1), this.overlayMaterial));
    };
};

const Three: FC<{}> = () => {
    useEffect(() => {
        new World({ targetElement: 'three-canvas' });
    }, []);

    return (
        <section id="three-page">
            <canvas id='three-canvas'></canvas>
            <div className="loading-bar"></div>
        </section>
    );
};

export default Three;