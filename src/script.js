import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#262837', 1, 15)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
// Textures
const bricksColor = textureLoader.load('/textures/bricks/color.jpg')
const bricksAo = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormal = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAo = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorMetalness = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughness = textureLoader.load('/textures/door/roughness.jpg')

const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassAo = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassColor.repeat.set(8, 8)
grassAo.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassAo.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAo.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

// House group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColor,
        aoMap: bricksAo,
        normalMap: bricksNormal,
        roughnessMap: bricksRoughness
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
walls.castShadow = true
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#8b5a3c' })
)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI * 0.25
roof.castShadow = true
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        alphaMap: doorAlpha,
        transparent: true,
        aoMap: doorAo,
        displacementMap: doorHeight,
        displacementScale: 0.1,
        normalMap: doorNormal,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughness
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.set(0, 1, 2 + 0.001)
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.castShadow = true
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.6)
bush2.castShadow = true
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.35, 0.35, 0.35)
bush3.position.set(-0.8, 0.15, 2.3)
bush3.castShadow = true
house.add(bush1, bush2, bush3)

// Graves
const graves = new THREE.Group()
scene.add(graves)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })
for(let i = 0; i < 30; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.2), graveMaterial)
    grave.position.set(x, 0.4, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.2
    grave.castShadow = true
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColor,
        aoMap: grassAo,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.3)
moonLight.position.set(4, 5, - 2)
moonLight.castShadow = true
moonLight.shadow.mapSize.set(1024, 1024)
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 15
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 2, 7)
doorLight.position.set(0, 2.2, 2.5)
doorLight.castShadow = true
scene.add(doorLight)

// Ghost lights
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
scene.add(ghost1, ghost2, ghost3)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate ghosts
    const radius1 = 4
    ghost1.position.x = Math.cos(elapsedTime * 0.5) * radius1
    ghost1.position.z = Math.sin(elapsedTime * 0.5) * radius1
    ghost1.position.y = Math.sin(elapsedTime * 3) * 0.25 + 1

    const radius2 = 5
    ghost2.position.x = Math.cos(-elapsedTime * 0.32) * radius2
    ghost2.position.z = Math.sin(-elapsedTime * 0.32) * radius2
    ghost2.position.y = Math.sin(elapsedTime * 4) * 0.25 + 1.2

    const radius3 = 6
    ghost3.position.x = Math.cos(elapsedTime * 0.18) * radius3
    ghost3.position.z = Math.sin(elapsedTime * 0.18) * radius3
    ghost3.position.y = Math.sin(elapsedTime * 5) * 0.25 + 1.4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()