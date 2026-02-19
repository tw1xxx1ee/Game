class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x82b8b9);

        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(45, 45, 45);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.initLights();
        this.tileManager = new Tile(this.scene);
        this.decorManager = new Decor(this.scene);
        this.charManager = new Char(this.scene);

        this.createMap();
        this.createEntities();

        this.player = null;
        this.gameState = { x: 6, z: 2 };

        window.addEventListener('resize', () => this.onResize());
        this.animate();
        this.startStateSync();
    }

    initLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(30, 50, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.set(2048, 2048);
        this.scene.add(dirLight);
    }

    createMap() {
        MAP.forEach((row, z) => {
            row.split('').forEach((tile, x) => {
                if (tile !== ' ') {
                    const hollowX = x - 5;
                    const hollowZ = z - 4;
                    const isUnderPlatform = (hollowX >= -1 && hollowX <= 2 && hollowZ >= -4 && hollowZ <= -2);
                    this.tileManager.create(tile, hollowX, 0, hollowZ, 1, !isUnderPlatform);

                    if (isUnderPlatform) {
                        this.tileManager.create('L', hollowX, 1, hollowZ, 1, true);
                    }
                }
            });
        });
    }

    createEntities() {
        this.player = this.charManager.create(6, 1.8, 2, COLORS.slime);
        this.charManager.create(5, 1.8, -2, COLORS.shadow, true);
        this.decorManager.createTemple(2, 2.8, -6);
        this.decorManager.createTree(-8, 1, -2);
        this.decorManager.createCloud(-15, 20, -10);
        this.decorManager.createCloud(15, 15, 5);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    async startStateSync() {
        // Poll Python for updates
        setInterval(async () => {
            try {
                const res = await fetch('/api/state');
                const state = await res.json();
                if (this.player) {
                    this.player.position.lerp(new THREE.Vector3(state.x, 1.8, state.z), 0.1);
                }
            } catch (e) {
                console.log("Python state sync failed");
            }
        }, 100);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Global UI Events
function triggerEvent(type) {
    console.log("Triggered event:", type);
    fetch('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type })
    });
}

const game = new Game();
