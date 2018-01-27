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

camera.position.set(0,5,10)
camera.lookAt(scene.position)

const render = () => {
  requestAnimationFrame(render)
  object.rotation.x += 0.002
  object.rotation.y += 0.002
  renderer.render(scene, camera)
}

const init = () => {

  material = new THREE.MeshPhongMaterial({
    shininess: 50
  })

  geometry = new THREE.IcosahedronGeometry( 2 )

  object = new THREE.Mesh(geometry, material)
  scene.add(object)
}
init()
render()
