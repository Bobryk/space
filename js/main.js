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
let space
let shipLoaded = false

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(0, 0, 5)

scene.add(light)

// controls

// Keyboard Controls
const keyboard = {
  w: false,
  a: false,
  s: false,
  d: false
}

const keyEvent = event => {
  isPressed = event.type === "keydown"
  switch (event.code) {
    case "KeyW":
      keyboard.w = isPressed
      break
    case "KeyA":
      keyboard.a = isPressed
      break
    case "KeyS":
      keyboard.s = isPressed
      break
    case "KeyD":
      keyboard.d = isPressed
      break
  }
}

this.addEventListener("keydown", keyEvent)
this.addEventListener("keyup", keyEvent)

const render = () => {
  requestAnimationFrame(render)

  camera.position.set(ship.position.x, ship.position.y, ship.position.z + 10)
  camera.lookAt(ship.position)
  moveShip()
  renderer.render(scene, camera)
}

const moveShip = () => {
  ship.rotation.set(0, 0, 0)
  if (keyboard.w) {
    ship.position.y += 0.1
    ship.rotation.x -= 0.7
  }

  if (keyboard.s) {
    ship.position.y -= 0.1
    ship.rotation.x += 0.7
  }

  if (keyboard.a) {
    space.rotation.y += 0.01
  }

  if (keyboard.d) {
    space.rotation.y -= 0.01
  }
  if (ship.position.y > 7) ship.position.y = 7
  if (ship.position.y < -7) ship.position.y = -7
}

const wait = () => {
  shipLoaded ? requestAnimationFrame(render) : requestAnimationFrame(wait)
}

const init = () => {
  material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  })

  const loader = new THREE.ObjectLoader()

  loader.load( "./js/SpaceShip.json", object => {
    let geometry = object.children[0].geometry
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    ship = new THREE.Mesh( geometry, material)
    ship.scale.set( .1, .1, .1 )
    scene.add(ship)
    shipLoaded = true
  } )

  texture = THREE.ImageUtils.loadTexture('space.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set( 4, 4 )
  let spaceMaterial = new THREE.MeshBasicMaterial({map: texture})
  let plane = new THREE.CylinderGeometry(10, 10, 40, 64, 1)
  space = new THREE.Mesh(plane, spaceMaterial)
  space.position.set(0, 0, -11)
  scene.add(space)
}

init()
wait()
