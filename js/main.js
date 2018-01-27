let scene = new THREE.Scene()
let aspect = window.innerWidth / window.innerHeight
let camera = new THREE.PerspectiveCamera(25, aspect, 1, 1000)
let renderer = new THREE.WebGLRenderer({ antialias:true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.onresize = event => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

let material
let geometry
let object

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(0, 5, 2)

scene.add(light)

camera.position.set(0,-10,10)
camera.lookAt(scene.position)

const render = () => {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

const init = () => {

  material = new THREE.MeshLambertMaterial({
    shading: THREE.FlatShading
  })

  geometry = new THREE.PlaneGeometry( 5, 5, 32 );

  object = new THREE.Mesh(geometry, material)
  scene.add(object)
}
init()
render()
