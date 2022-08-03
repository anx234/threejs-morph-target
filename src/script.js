import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const params = {
    Spherify: 0,
    Twist: 0,
    radius: 0.8,
};


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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Cube
 */

 const material = new THREE.PointsMaterial({
    color: 0xFF3366,
    size: 0.01,

});
const geometry = createGeometry();
function createGeometry() {
    const geometry = new THREE.SphereGeometry(params.radius, 32, 32);
    geometry.morphAttributes.position = [];
    const positionAttribute = geometry.attributes.position;

    const randomPositions = [];
    const twistPositions = [];
    const direction = new THREE.Vector3(1, 0, 0);
    const vertex = new THREE.Vector3();


    for (let i = 0; i < positionAttribute.count; i++) {

        // color
        const radius = Math.random() * 0.1
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);
        randomPositions.push(
            Math.sin(x * (Math.random() - 0.5) * 100),
            y * (Math.random() - 0.5) * 100,
            z * (Math.random() - 0.5) * 100
        );

        vertex.set(x * 2, y, z);
        vertex.applyAxisAngle(direction, Math.PI * x / 2).toArray(twistPositions, twistPositions.length);

    }

    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(randomPositions, 3);
    geometry.morphAttributes.position[1] = new THREE.Float32BufferAttribute(twistPositions, 3);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;

}
const mesh = new THREE.Points(geometry, material);
scene.add(mesh);

			/**
			 * Animation GSAP
			 */

             gsap.registerPlugin(ScrollTrigger)
             ScrollTrigger.defaults({
                 scrub: 3,
                 ease: 'none',
             })
             const sections = document.querySelectorAll('.section')
             gsap.from(mesh.position, {
                 y: 1,
                 duration: 1,
                 ease: 'expo',
             })
             gsap.from('h1', {
                 yPercent: 100,
                 autoAlpha: 0,
                 ease: 'back',
                 delay: 0.3,
             })
             gsap.to(params, {
                 Spherify: 1,
                 Twist: 1,
                 radius: 0,
                 duration: 8,
                 ease: 'Power2.out',
                 scrollTrigger: {
                     trigger: sections[1],
                 },
             })
             gsap.to(mesh.rotation, {
                 x: Math.PI * 2,
                 scrollTrigger: {
                     trigger: sections[1],
                 },
             })
             gsap.to(mesh.scale, {
                 x: 2,
                 y: 2,
                 scrollTrigger: {
                     trigger: sections[2],
                 },
             })
             gsap.to(mesh.rotation, {
                 y: Math.PI * 2,
                 scrollTrigger: {
                     trigger: sections[3],
                 },
             })
 
            
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    mesh.morphTargetInfluences[0] = params.Spherify;
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()