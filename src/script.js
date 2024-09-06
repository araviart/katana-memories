import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()


/**
 * Floor
 */

const floorAlphaTexture = textureLoader.load('./floor/alpha.webp')
const floorColorTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_diff_1k.webp')
const floorArmTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_disp_1k.webp')

floorColorTexture.repeat.set(4,4)
floorArmTexture.repeat.set(4,4)
floorNormalTexture.repeat.set(4,4)
floorDisplacementTexture.repeat.set(4,4)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorArmTexture.wrapS = THREE.RepeatWrapping
floorArmTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping


/**
 * Tomb groupe
 */

const stonesColorTexture = textureLoader.load('/floor/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const stonesArmTexture = textureLoader.load('/floor/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')  
const stonesNormalTexture = textureLoader.load('/floor/plastered_stone_wall_1k/plastered_stone_wall_nor_1k.webp')


const walls = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 2.5, 2),
    new THREE.MeshStandardMaterial({
        map: stonesColorTexture,
        aoMap: stonesArmTexture,
        roughnessMap: stonesArmTexture,
        metalnessMap: stonesArmTexture,
        normalMap: stonesNormalTexture,
    })
)
const house = new THREE.Group();
house.add(walls)
walls.position.y = 0.935
walls.position.x = -0.762
walls.position.z = -0.983
walls.rotation.y = -1.106
// gui.add(walls.position, 'y').min(-3).max(3).step(0.001).name('wallsY')
// gui.add(walls.position, 'x').min(-3).max(3).step(0.001).name('wallsX')
// gui.add(walls.position, 'z').min(-3).max(3).step(0.001).name('wallsZ')
// gui.add(walls.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('wallsRotationY')

/**
 * Roof
 */

const roofVertices = new Float32Array([
    -0.25, 0, -1,  // base vertex 0
    0.25, 0, -1,   // base vertex 1
    0.25, 0, 1,    // base vertex 2
    -0.25, 0, 1,   // base vertex 3
    0, 1, 0        // apex vertex 4
]);

const roofIndices = [
    0, 1, 4,  // face 1
    1, 2, 4,  // face 2
    2, 3, 4,  // face 3
    3, 0, 4,  // face 4
    1, 0, 3,  // base triangle 1
    1, 3, 2   // base triangle 2
];

// Ajustement des UVs pour chaque sommet
const roofUVs = new Float32Array([
    0, 0,  // UV vertex 0 (face 1)
    1, 0,  // UV vertex 1 (face 1)
    1, 1,  // UV vertex 2 (face 2)
    0, 1,  // UV vertex 3 (face 4)
    0.5, 1  // UV vertex 4 (apex, même UV pour toutes les faces)
]);

const roofGeometry = new THREE.BufferGeometry();
roofGeometry.setAttribute('position', new THREE.BufferAttribute(roofVertices, 3));
roofGeometry.setAttribute('uv', new THREE.BufferAttribute(roofUVs, 2)); 
roofGeometry.setIndex(roofIndices);
roofGeometry.computeVertexNormals();
roofGeometry.rotateY(2.022); 
roofGeometry.translate(0, -0.33, 0); 


const roofMaterial = new THREE.MeshStandardMaterial({ 
    map: stonesColorTexture,
    aoMap: stonesArmTexture,
    roughnessMap: stonesArmTexture,
    metalnessMap: stonesArmTexture,
    normalMap: stonesNormalTexture,
    side: THREE.DoubleSide
 });  
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(-0.762, 2.5, -0.983); 
house.add(roof);

/**
 * Ghosts
 */

const ghost1 =  new THREE.PointLight('#ff9c00', 3)
const ghost2 =  new THREE.PointLight('#ff9c00', 3)
const ghost3 =  new THREE.PointLight('#ff9c00', 3)
scene.add(ghost1, ghost2, ghost3)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorArmTexture,
        roughnessMap: floorArmTexture,
        metalnessMap: floorArmTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.389,
        displacementBias: - 0.457,
    })
)

// gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
// gui.add(floor.material, 'displacementBias').min(-2).max(1).step(0.001).name('floorDisplacementBias')


floor.rotation.x = - Math.PI * 0.5
scene.add(floor)



/**
 * Stones
 */

stonesColorTexture.repeat.set(0.3,0.4)
stonesArmTexture.repeat.set(0.3,0.4)
stonesNormalTexture.repeat.set(0.3,0.4)

const stonesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: stonesColorTexture,
    aoMap: stonesArmTexture,
    roughnessMap: stonesArmTexture,
    metalnessMap: stonesArmTexture,
    normalMap: stonesNormalTexture,
})


const stones = new THREE.Group()
scene.add(stones)



for(let i =0; i < 15; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(stonesGeometry, graveMaterial)
    grave.rotation.x = (Math.random() - 0.5) + 0.05
    grave.rotation.y = (Math.random() - 0.5)
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.position.z = z
    grave.position.x = x
    grave.position.y = (Math.random() * 0.3)- 0.1
    stones.add(grave)
}

// const graveFolder = gui.addFolder('Grave Material')
// graveFolder.add(graveMaterial, 'displacementScale').min(-1).max(1).step(0.01).name('Displacement Scale')
// graveFolder.add(graveMaterial, 'displacementBias').min(-1).max(1).step(0.01).name('Displacement Bias')
// graveFolder.open()

/**
 * Katana
 */

const mirror = new GLTFLoader();    

mirror.load(
    '/floor/antique_katana_01_1k.gltf/antique_katana_01_1k.gltf',
    function (gltf) {
        const scaleFactor = 2.5;    
        const katana = gltf.scene;
        katana.scale.set(scaleFactor, scaleFactor, scaleFactor)
        katana.traverse(function(node){
            if(node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        katana.position.set(0, 1, 0)
        katana.rotation.x = Math.PI
        scene.add(katana);
        camera.lookAt(katana.position)
    },
)

scene.add(house)
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)



/**
 * Mapping
 */

directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256   
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10



// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Initialiser les contrôles d'orbite
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// empeche de regarder en dessous
controls.minPolarAngle = 0; // Limite inférieure (0 radians = 0 degrés)
controls.maxPolarAngle = Math.PI / 2; // limite sup (π/2 radians = 90 degrés)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */


renderer.shadowMap.enabled = true   
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Directional light
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.receiveShadow = true
walls.castShadow = true
floor.receiveShadow = true

for (const stone of stones.children){
    stone.castShadow = true
    stone.receiveShadow = true
}

/**
 * Sky
 */

const sky = new Sky()
sky.scale.set(100, 100, 100)
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
scene.add(sky)

/**
 * Fog
 */


scene.fog =new THREE.FogExp2('#02343f', 0.15)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)


    const ghost2Angle =  - elapsedTime * 0.5
    ghost2.position.x = Math.cos(ghost2Angle) * 4
    ghost2.position.z = Math.sin(ghost2Angle) * 4
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)


    const ghost3Angle =  elapsedTime * 0.3
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()