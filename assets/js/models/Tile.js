class Tile {
    constructor(scene) {
        this.scene = scene;
        this.radius = 0.3;
        this.extrudeSettings = { depth: TILE_HEIGHT, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 };
        this.shape = this.createRoundedBoxShape(TILE_SIZE, this.radius);
    }

    createRoundedBoxShape(size, radius) {
        const shape = new THREE.Shape();
        const s = size / 2 - radius;
        shape.moveTo(-s, -s - radius);
        shape.lineTo(s, -s - radius);
        shape.absarc(s, -s, radius, -Math.PI / 2, 0, false);
        shape.lineTo(s + radius, s);
        shape.absarc(s, s, radius, 0, Math.PI / 2, false);
        shape.lineTo(-s, s + radius);
        shape.absarc(-s, s, radius, Math.PI / 2, Math.PI, false);
        shape.lineTo(-s - radius, -s);
        shape.absarc(-s, -s, radius, Math.PI, Math.PI * 1.5, false);
        return shape;
    }

    create(type, x, y, z, heightMult = 1, hasCap = true) {
        const h = TILE_HEIGHT * heightMult;
        const geo = new THREE.ExtrudeGeometry(this.shape, { ...this.extrudeSettings, depth: h });
        geo.rotateX(Math.PI / 2);

        let topColor, sideColor;
        if (type === 'G') { topColor = COLORS.grass; sideColor = COLORS.dirt; }
        else if (type === 'L') { topColor = COLORS.grassLight; sideColor = COLORS.dirt; }
        else if (type === 'W') { topColor = COLORS.water; sideColor = COLORS.water; }
        else if (type === 'P') { topColor = COLORS.path; sideColor = COLORS.dirt; }
        else if (type === 'D') { topColor = COLORS.dirt; sideColor = COLORS.dirt; }

        const matSide = new THREE.MeshLambertMaterial({ color: sideColor });
        const matTop = new THREE.MeshLambertMaterial({ color: topColor });

        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geo, [matTop, matSide]);
        mesh.position.y = h / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        if (hasCap && (type === 'G' || type === 'L' || type === 'P')) {
            const capGeo = new THREE.ExtrudeGeometry(this.shape, { ...this.extrudeSettings, depth: h * 0.3 });
            capGeo.rotateX(Math.PI / 2);
            const cap = new THREE.Mesh(capGeo, matTop);
            cap.position.y = h * 0.85;
            group.add(cap);
        }

        group.position.set(x * 2.05, y * TILE_HEIGHT, z * 2.05);
        this.scene.add(group);
        return group;
    }
}
