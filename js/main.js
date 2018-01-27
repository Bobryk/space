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
let spaceBottom
let spaceTop
let shipLoaded = false
let owens = []
let level = 1

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(-10, 0, 2)

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
      case "ArrowUp":
        keyboard.w = isPressed
        break
      case "ArrowLeft":
        keyboard.a = isPressed
        break
      case "ArrowDown":
        keyboard.s = isPressed
        break
      case "ArrowRight":
        keyboard.d = isPressed
        break
  }
}

this.addEventListener("keydown", keyEvent)
this.addEventListener("keyup", keyEvent)

const render = () => {
  requestAnimationFrame(render)
  spaceBottom.rotation.y -= 0.03
  spaceTop.rotation.y += 0.03
  camera.position.set(ship.position.x - 5, ship.position.y, ship.position.z + 0.1)
  if (owens.length < 30 && Math.random() < level / 100) {
    addOwen()
  }

  moveShip()

  owens.forEach((owen, index) => {
    if (owen.position.z < 0) owen.position.z += 0.2
    owen.position.x -= 0.1
    if (owen.position.x < -7) {
      scene.remove(owen)
      owens.splice(index, 1);
    }
  })
  renderer.render(scene, camera)
}

const addOwen = () => {
  let texture = THREE.ImageUtils.loadTexture('owen.png')
  let owenMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  let plane = new THREE.PlaneGeometry(1, 1, 1)
  let owen = new THREE.Mesh(plane, owenMaterial)
  owen.position.set(100, -6.5 + Math.random() * 13, -10)
  owen.rotation.y = Math.PI / -2
  owen.rotation.x = Math.PI / 2
  owens.push(owen)
  scene.add(owen)
}

const moveShip = () => {
  ship.rotation.set(0, 0, 0)
  if (keyboard.a) {
    ship.position.y += 0.1
    ship.rotation.x -= 0.7
  }

  if (keyboard.d) {
    ship.position.y -= 0.1
    ship.rotation.x += 0.7
  }
  if (ship.position.y > 7) ship.position.y = 7
  if (ship.position.y < -7) ship.position.y = -7
}

const wait = () => {
  shipLoaded ? requestAnimationFrame(render) : requestAnimationFrame(wait)
}

const init = () => {
  camera.rotation.set(0, Math.PI / -2, Math.PI / -2)
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
    ship.scale.set( .05, .05, .05 )
    ship.position.x = -5
    scene.add(ship)
    shipLoaded = true
  } )

  texture = THREE.ImageUtils.loadTexture('space.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set( 4, 4 )
  let spaceMaterial = new THREE.MeshBasicMaterial({map: texture})
  let plane = new THREE.CylinderGeometry(10, 10, 40, 64, 1)
  spaceBottom = new THREE.Mesh(plane, spaceMaterial)
  spaceBottom.position.set(0, 0, -10.5)
  scene.add(spaceBottom)

  spaceTop = new THREE.Mesh(plane, spaceMaterial)
  spaceTop.position.set(0, 0, 10.5)
  scene.add(spaceTop)
}

init()
wait()
