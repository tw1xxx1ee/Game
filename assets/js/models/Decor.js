class Decor {
    constructor(scene) {
        this.scene = scene;
    }

    createTemple(x, y, z) {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: COLORS.temple });

        const base = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 4.5), mat);
        group.add(base);

        const steps = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 5), mat);
        steps.position.y = -0.3;
        group.add(steps);

        for (let i = -2.4; i <= 2.4; i += 0.8) {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3, 8), mat);
            col.position.set(i, 1.7, 1.8);
            group.add(col.clone());
            col.position.z = -1.8;
            group.add(col);
        }

        const top = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 4.5), mat);
        top.position.y = 3.2;
        group.add(top);

        const pedShape = new THREE.Shape();
        pedShape.moveTo(-3, 0); pedShape.lineTo(3, 0); pedShape.lineTo(0, 1.5); pedShape.lineTo(-3, 0);
        const ped = new THREE.Mesh(new THREE.ExtrudeGeometry(pedShape, { depth: 4.5, bevelEnabled: false }), mat);
        ped.position.set(0, 3.4, -2.25);
        group.add(ped);

        group.position.set(x, y, z);
        this.scene.add(group);
        return group;
    }

    createTree(x, y, z) {
        const group = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3, 0.6), new THREE.MeshLambertMaterial({ color: COLORS.dirt }));
        trunk.position.y = 1.5;
        group.add(trunk);

        const leafMat = new THREE.MeshLambertMaterial({ color: COLORS.grass });
        const spheres = [[0, 4, 0, 1.8], [1, 3.5, 0, 1.2], [-0.8, 3.8, 0.8, 1.4], [0.5, 4.5, -0.5, 1.1]];
        spheres.forEach(s => {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(s[3], 8, 8), leafMat);
            leaf.position.set(s[0], s[1], s[2]);
            group.add(leaf);
        });

        group.position.set(x, y, z);
        this.scene.add(group);
        return group;
    }

    createCloud(x, y, z) {
        const group = new THREE.Group();
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
        const main = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat);
        main.scale.set(3, 1, 1);
        group.add(main);
        group.position.set(x, y, z);
        this.scene.add(group);
        return group;
    }
}
