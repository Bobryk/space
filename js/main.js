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

let material, geometry, object, ship, spaceBottom, spaceTop
let shipLoaded = false
let owens = []
let speed = 0.00
let kills = 0
let laser = document.getElementById("sound")
let wow = document.getElementById("wow")
let music = document.getElementById("music")
let score = document.getElementById("scores")

const light = new THREE.PointLight(0xffffff, 1)
light.position.set(-10, 0, 2)

scene.add(light)

const keyboard = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
}

const keyEvent = event => {
  isPressed = event.type === "keydown"
  switch (event.code) {
    case "KeyW": keyboard.w = isPressed; break
    case "KeyA": keyboard.a = isPressed; break
    case "KeyS": keyboard.s = isPressed; break
    case "KeyD": keyboard.d = isPressed; break
    case "ArrowUp": keyboard.w = isPressed; break
    case "ArrowLeft": keyboard.a = isPressed; break
    case "ArrowDown": keyboard.s = isPressed; break
    case "ArrowRight": keyboard.d = isPressed; break
    case "Space": keyboard.space = isPressed
  }
}

this.addEventListener("keydown", keyEvent)
this.addEventListener("keyup", keyEvent)

const render = () => {
  requestAnimationFrame(render)
  moveSpace()

  if (owens.length < 30 && Math.random() < 0.01) {
    addOwen()
  }

  if (keyboard.space && (laser.ended || laser.currentTime == 0)) {
    laser.volume = 0.4
    laser.play()
    killOwens()
  }

  moveShip()
  moveOwens()

  renderer.render(scene, camera)
}

const moveSpace = () => {
  spaceBottom.rotation.y -= 0.03
  spaceTop.rotation.y += 0.03
}

const moveOwens = () => {
  owens.forEach((owen, index) => {
    if (owen.position.z < 0) owen.position.z += 0.2
    owen.position.x -= 0.3
    if (owen.position.x < -10) window.location.href = "./end.html"
  })
}

const killOwens = () => {
  let killed = false
  owens.forEach((owen, index) => {
    if (!killed && Math.abs(ship.position.y - owen.position.y) < .5) {
      owens.splice(index, 1)
      scene.remove(owen)
      killed = true
      kills += 1
      score.innerHTML = "Owens Wasted: " + kills
    }
  })

  if (killed) {
    wow.pause()
    wow.volume = 1
    wow.currentTime = 0
    wow.play()
  }
}

const addOwen = () => {
  let texture = THREE.ImageUtils.loadTexture('owen.png')
  let owenMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  })
  let plane = new THREE.PlaneGeometry(0.5, 0.5, 1)
  let owen = new THREE.Mesh(plane, owenMaterial)
  owen.position.set(60, -4 + Math.random() * 8, -10)
  owen.rotation.y = Math.PI / -2
  owen.rotation.x = Math.PI / 2
  owens.push(owen)
  scene.add(owen)
}

const moveShip = () => {
  let notMoving = (keyboard.a && keyboard.d) || (!keyboard.a && !keyboard.d)

  let increment = 0.01

  if (!notMoving && Math.abs(speed) <= 0.1) {
    speed += keyboard.a ? increment : -increment

    if (Math.abs(ship.rotation.x) <= 0.6) {
      ship.rotation.x -= keyboard.a ? 0.1 : -0.1
    }
  }

  ship.rotation.x = Math.round(ship.rotation.x * 10) / 10.0

  if (notMoving && ship.rotation.x != 0) {
    ship.rotation.x += ship.rotation.x > 0 ? -0.1 : 0.1
  }

  if (notMoving) {
    speed -= speed > 0 ? increment : -increment
  }

  if (speed < 0.0001 && speed > 0.0001) speed = 0.00
  ship.position.y += speed

  if (ship.position.y > 7) ship.position.y = 7
  if (ship.position.y < -7) ship.position.y = -7

  camera.position.set(ship.position.x - 5, ship.position.y, ship.position.z + 0.1)
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
  music.loop = true
  music.volume = 0.3
  music.play()
}

init()
wait()
