import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import cannonUtils from './cannonUtils';
import cannonDebugger from './cannonDebugger';

class Experience {
    targetElement: HTMLElement | null;
    scene: THREE.Scene;
    camera: any;
    renderer: any;
    cannon: any;
    clock: THREE.Clock;
    oldElapsedTime: number;
    elapsedTime: number;
    deltaTime: number;

    constructor({ targetElement }: any) {
        this.targetElement = document.getElementById(targetElement);
        this.clock = new THREE.Clock();
        this.oldElapsedTime = 0;

        this.setScene();
        this.setCannon();
        this.setCamera();
        this.setRenderer();

        this.update();
        window.addEventListener('resize', () => this.resize());
    };

    setScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    };

    setBackground(color: THREE.Color) {
        this.scene.background = color;
    };

    getBackground() {
        return this.scene.background;
    };

    setCannon() {
        this.cannon = new Cannon({ scene: this.scene });
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
        this.elapsedTime = this.clock.getElapsedTime();
        this.deltaTime = this.elapsedTime - this.oldElapsedTime;
        this.oldElapsedTime = this.elapsedTime;

        this.camera ? this.camera.update() : null;
        this.renderer ? this.renderer.update() : null;
        this.cannon ? this.cannon.update(this.deltaTime) : null;

        window.requestAnimationFrame(() => this.update());
    };
};

class Cannon {
    instance: CANNON.World;
    scene: THREE.Scene;
    debugger: any;
    wheelMaterial: CANNON.Material;
    groundMaterial: CANNON.Material;
    car: any;

    constructor({ scene }: any) {
        this.scene = scene;

        this.setInstance();
    };

    setInstance() {
        this.instance = new CANNON.World();
        this.instance.broadphase = new CANNON.SAPBroadphase(this.instance);
        this.instance.allowSleep = false;
        this.instance.gravity.set(0, - 9.82, 0);

        this.groundMaterial = new CANNON.Material('groundMaterial');;
        this.wheelMaterial = new CANNON.Material('wheelMaterial');
        this.instance.addContactMaterial(
            new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 10,
            })
        );

        this.instance.addBody(new CANNON.Body({
            shape: new CANNON.Plane(),
            mass: 0,
            position: new CANNON.Vec3(0, -1.1, 0),
            quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
        }))

        this.debugger = cannonDebugger(this.scene, this.instance.bodies, { autoUpdate: false });
    };

    update(deltaTime: number) {
        this.instance.step(1 / 60, deltaTime, 3);
        this.debugger.update();

        if (this.car) {
            this.car.update();
        }
    };

    setLand(land: THREE.Mesh) {
        this.instance.addBody(new CANNON.Body({
            shape: cannonUtils.CreateConvexPolyhedron(land, { x: 5, y: 5, z: 5 }),
            mass: 0,
            position: new CANNON.Vec3(0, -.8, 0)
        }));
    };

    setCar() {
        this.car = new Car({ world: this.instance, wheelMaterial: this.wheelMaterial })
    }
};

class Car {
    world: CANNON.World;
    wheelMaterial: CANNON.Material;
    chassisBody: CANNON.Body;
    vehicle: CANNON.RaycastVehicle;
    options: any;
    wheelBodies: any;

    constructor({ world, wheelMaterial }: any) {
        this.world = world;
        this.wheelMaterial = wheelMaterial;

        this.setCar();
    };

    setVehicle() {
        this.chassisBody = new CANNON.Body({
            mass: 150,
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2.9)),
            position: new CANNON.Vec3(0, 1, 0),
            angularVelocity: new CANNON.Vec3(0, 0, 0)
        });

        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
            indexRightAxis: 0, // x
            indexUpAxis: 1, // y
            indexForwardAxis: 2, // z
        });
    };

    setWheels() {
        this.options = {
            radius: 0.46,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 45,
            suspensionRestLength: 0.5,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.5,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 2, 0),
            maxSuspensionTravel: 0.25,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
        };

        this.options.chassisConnectionPointLocal.set(0.95, 0, -1.8);
        this.vehicle.addWheel(this.options);

        this.options.chassisConnectionPointLocal.set(-0.95, 0, -1.8);
        this.vehicle.addWheel(this.options);

        this.options.chassisConnectionPointLocal.set(0.95, 0, 2);
        this.vehicle.addWheel(this.options);

        this.options.chassisConnectionPointLocal.set(-0.95, 0, 2);
        this.vehicle.addWheel(this.options);

        this.vehicle.addToWorld(this.world);

        this.wheelBodies = [];
        this.vehicle.wheelInfos.forEach((wheel: any) => {
            const wheelBody = new CANNON.Body({
                mass: 10,
                material: this.wheelMaterial
            });

            wheelBody.addShape(
                new CANNON.Cylinder(wheel.radius, wheel.radius, 0.2, 20),
                new CANNON.Vec3(),
                new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
            );

            this.wheelBodies.push(wheelBody);
        });
    };

    update() {
        // const car = scene.children.filter((item) => item.name === 'cybertruck')[0];

        // car.children[0].position.copy(chassisBody.position);
        // car.children[0].quaternion.copy(chassisBody.quaternion);

        for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i);
            const t = this.vehicle.wheelInfos[i].worldTransform;

            this.wheelBodies[i].position.copy(t.position);
            this.wheelBodies[i].quaternion.copy(t.quaternion);

            // car.children[4 - i].position.copy(t.position);
            // car.children[4 - i].quaternion.copy(t.quaternion);
            // car.children[4 - i].rotateZ(Math.PI / 2);
            // car.children[1].rotateZ(Math.PI);
            // car.children[3].rotateZ(Math.PI);
        }
    }

    setCar() {
        this.setVehicle();
        this.setWheels();
        this.setControls();

        this.update();
    };

    setControls() {
        var maxSteerVal = 0.5;
        var maxForce = 1000;
        var brakeForce = 10000;
        const handler = (event: KeyboardEvent) => {
            var up = (event.type == 'keyup');

            if (!up && event.type !== 'keydown')
                return;

            this.vehicle.setBrake(0, 0);
            this.vehicle.setBrake(0, 1);
            this.vehicle.setBrake(0, 2);
            this.vehicle.setBrake(0, 3);

            switch (event.key) {
                case 'ArrowUp': // forward
                case 'w':
                case 'W':
                    this.vehicle.applyEngineForce(up ? 0 : maxForce, 2);
                    this.vehicle.applyEngineForce(up ? 0 : maxForce, 3);
                    break;

                case 'ArrowDown': // backward
                case 's':
                case 'S':
                    this.vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
                    this.vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
                    break;

                case ' ': // space
                    this.vehicle.setBrake(brakeForce, 0);
                    this.vehicle.setBrake(brakeForce, 1);
                    this.vehicle.setBrake(brakeForce, 2);
                    this.vehicle.setBrake(brakeForce, 3);
                    break;

                case 'ArrowRight': // right
                case 'd':
                case 'D':
                    this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0);
                    this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1);
                    break;

                case 'ArrowLeft': // left
                case 'a':
                case 'A':
                    this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0);
                    this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1);
                    break;
            };
        };

        document.onkeydown = handler;
        document.onkeyup = handler;
    };
};

class Camera {
    targetElement: HTMLElement;
    scene: THREE.Scene;
    instance: THREE.PerspectiveCamera;
    orbitControl: OrbitControls;

    constructor({ targetElement, scene }: any) {
        this.targetElement = targetElement;
        this.scene = scene;

        this.setInstance();
    };

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
        this.instance.position.set(0, 2, 3);
        this.scene.add(this.instance);

        this.orbitControl = new OrbitControls(this.instance, this.targetElement)
        this.orbitControl.enableDamping = true;
    };

    updatePosition(x: number, y: number, z: number) {
        this.instance.position.set(x, y, z);
    };

    updateLookAt() {
        // this.instance.lookAt()
    }

    resize() {
        this.instance.aspect = window.innerWidth / window.innerHeight;
    };

    update() {
        this.instance.updateProjectionMatrix();
        this.orbitControl.update();
    };
};

class Renderer {
    targetElement: HTMLElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    instance: THREE.WebGL1Renderer;

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