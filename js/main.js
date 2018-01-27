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
let ship

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(0, 0, 5)

scene.add(light)

camera.position.set(0, -10, 10)
camera.lookAt(scene.position)

material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
})

const loader = new THREE.ObjectLoader()

loader.load( "./js/SpaceShip.json", object => {
  console.log(object)
  let geometry = object.children[0].geometry
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()
  ship = new THREE.Mesh( geometry, material)
  ship.scale.set( .1, .1, .1 )
  scene.add(ship)
} )

const render = () => {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

const init = () => {
  geometry = new THREE.PlaneGeometry( 5, 5, 32 );

  object = new THREE.Mesh(geometry, material)
  scene.add(object)
}
init()
render()
