var camera,
    scene,
    renderer,
    controls,
    whiteMaterial,
    boundingBoxGeometry,
    wireMaterial,
    boundingBoxMesh,
    loader,
    spaceshipMesh,
    sun,
    isTouch,
    canMove,
    isMobile,
    clock,
    video,
    point,
    videoTexture,
    canPlayVideo,
    playingVideo

function addMeshToScene(geometry, materials) {
  var material = new THREE.MeshFaceMaterial(materials)
  spaceshipMesh = new THREE.Mesh(geometry, material)
  scene.add(spaceshipMesh)
  setup()
}

function touch(e) {
  isTouch = e.type === 'touchstart' && isMobile
}

document.body.addEventListener('touchstart', touch, false)
document.body.addEventListener('touchend', touch, false)

window.addEventListener('resize', function() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}, false)

function setup() {
  sun = new THREE.DirectionalLight(0xffffff, 0.5)
  sun.position.set(0,0,-5)
  scene.add(sun)

  point = new THREE.PointLight(0xffffff, 0.5)
  point.position.set(0,0,0)
  scene.add(point)

  camera.position.set(15, 1.1, 0)
  render()
}

function init() {
  video = document.createElement('video')
  video.loop = true
  video.muted = true
  video.src = './videoplayback.webm'
  video.setAttribute('webkit-playsinline', 'webkit-playsinline')
  video.load()
  canPlayVideo = false
  playingVideo = false
  canMove = true

  video.oncanplaythrough = function() {
    videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.NearestFilter
    videoTexture.maxFilter = THREE.NearestFilter
    videoTexture.format = THREE.RGBFormat
    videoTexture.generateMipmaps = false

    var videoGeometry = new THREE.SphereGeometry( 500, 60, 40 )
    videoGeometry.scale( -1, 1, 1 )
    var uvs = videoGeometry.faceVertexUvs[0]
    for (var i = 0; i < uvs.length; i++) {
      for (var j = 0; j < 3; j++) {
        uvs[i][j].x *= 0.5
      }
    }

    var videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture })
    var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial)
    videoMesh.rotation.y = - Math.PI / 2

    canPlayVideo = true
  }

  if (THREEx.FullScreen.available() && !THREEx.FullScreen.activated()) {
    THREEx.FullScreen.request()
  }

  window.screen.orientation.lock('portrait-primary').catch(function(error){
    console.log(error)
  })

  var titleElement = document.getElementById('titleContainer')
  document.body.removeChild(titleElement)

  gyroPresent = false
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1100)
  isMobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig)
  scene = new THREE.Scene()

  whiteMaterial = new THREE.MeshLambertMaterial({
    color: '#ffffff'
  })

  boundingBoxGeometry = new THREE.BoxGeometry(100, 100, 100, 4, 4, 4)
  wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    side: THREE.BackSide,
    wireframe: true
  })

  boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, whiteMaterial)
  boundingBoxMesh.name = 'box'
  scene.add(boundingBoxMesh)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
  controls = new THREE.DeviceOrientationControls(camera)

  loader = new THREE.JSONLoader()
  loader.load('js/spaceship.json', addMeshToScene)
  clock = new THREE.Clock()
}

function movePlayer() {
  if (isTouch) {
    var direction = camera.getWorldDirection()
    direction.multiplyScalar(0.1)
    direction.y = 0
    camera.position.add(direction)

    if (camera.position.distanceTo(scene.position) > 20) {
      camera.position.sub(direction)
    }
  }

  if (camera.position.distanceTo(spaceshipMesh.position) < 2) {
    canMove = false
    camera.position.set(0, 1.3, 0)
    document.body.removeEventListener('touchstart', touch)
    document.body.removeEventListener('touchend', touch)
  }
}

function render() {
  window.requestAnimationFrame(render)
  controls.update(clock.getDelta())
  renderer.render(scene, camera)
  if (canPlayVideo && !playingVideo && !canMove) {
    scene.add(videoMesh)
    var selectedObject = scene.getObjectByName('box')
    scene.remove(selectedObject)
    playingVideo = true
    video.play()
  }
  canMove && movePlayer()
}
