class Char {
    constructor(scene) {
        this.scene = scene;
    }

    create(x, y, z, color, isShadow = false) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), new THREE.MeshLambertMaterial({ color }));
        body.scale.y = 1.1;
        group.add(body);

        if (isShadow) {
            const eyes = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            eyes.position.set(0, 0.2, 0.6);
            group.add(eyes);

            // Alert '!'
            const dot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            dot.position.y = 2.0;
            const stick = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.15), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            stick.position.y = 2.4;
            group.add(dot, stick);
        }

        // HP Bar (3D)
        const barBack = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.15), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        barBack.position.y = 1.5;
        group.add(barBack);

        group.position.set(x, y, z);
        this.scene.add(group);
        return group;
    }
}
