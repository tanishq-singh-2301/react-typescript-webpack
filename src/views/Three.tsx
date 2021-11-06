import { useEffect, FC } from 'react';
import '../scss/three.scss';
import Header from '../components/Header';
import Experience from '../module/experience';

/** THREE */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { gsap } from 'gsap';

/** ASSETS */
const baked = require('../../static/images/baked.jpg');
const portal = require('../../static/models/portal.glb');

class World extends Experience {
    box: THREE.Mesh;
    scene: THREE.Scene;
    overlayMaterial: THREE.ShaderMaterial;
    gltfLoader: GLTFLoader;
    dracoLoader: DRACOLoader;
    textureLoader: THREE.TextureLoader;
    loadingManager: THREE.LoadingManager;
    loadingBarElement: any;
    poleMaterial: THREE.MeshBasicMaterial;
    bakedTexture: any;
    portalSize: number;

    constructor({ targetElement }: any) {
        super({ targetElement });

        this.setOverlays();
        this.setLoadingManager();
        this.setLoaders();
        this.setInstance();
    };

    setInstance() {
        this.setBackground(new THREE.Color('#121212'));

        this.poleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
        this.bakedTexture = this.textureLoader.load(baked);
        this.bakedTexture.flipY = false;
        this.bakedTexture.encoding = THREE.sRGBEncoding;
        this.portalSize = 3.5;

        this.gltfLoader.load(
            portal,
            gltf => {
                gltf.scene.rotation.set(0, -Math.PI / 2, 0);
                gltf.scene.scale.set(this.portalSize, this.portalSize, this.portalSize);
                gltf.scene.traverse(child => (child.getObjectByName(child.name) as THREE.Mesh).material = new THREE.MeshBasicMaterial({ map: this.bakedTexture }));
                gltf.scene.receiveShadow = true;
                this.scene.add(gltf.scene);

                gltf.scene.children.map(child => {
                    switch (child.name) {
                        case 'Cube041':
                        case 'Cube042':
                            (child.getObjectByName(child.name) as THREE.Mesh).material = this.poleMaterial;
                            break;

                        case 'Circle':
                            (child.getObjectByName(child.name) as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            break;

                        default:
                            break;
                    };
                });

                this.updateAllMaterials();
            }
        );
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
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)
    };

    setOverlays() {
        this.overlayMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: {
                    value: 1
                }
            },
            vertexShader: `
                    void main()
                    {
                        gl_Position = vec4(position, 1.0);
                    }
                `,
            fragmentShader: `
                    uniform float uAlpha;
                    void main()
                    {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                    }
                `
        });

        this.scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 1, 1), this.overlayMaterial));
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
};

const Three: FC<{}> = () => {
    useEffect(() => {
        document.getElementById('side__bar')?.classList.remove('active');
        new World({ targetElement: 'three-canvas' });
    }, []);

    return (
        <section id='three-page'>
            <Header title={'Three'} imoji={'🐽'} />
            <canvas id='three-canvas'></canvas>
            <div className="loading-bar"></div>
        </section>
    );
};

export default Three;