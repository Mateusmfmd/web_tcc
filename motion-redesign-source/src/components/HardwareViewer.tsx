import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import type { ButtonColor } from '../data'

type HardwareViewerProps = { onSelectButton: (color: ButtonColor) => void }
type ViewerState = 'loading' | 'photo-model' | 'procedural' | 'photo'

const buttonColors: Array<{ color: ButtonColor; hex: string; position: [number, number, number] }> = [
  { color: 'amarelo', hex: '#f3bd32', position: [-1.18, 1.48, -1.05] },
  { color: 'preto', hex: '#192d3d', position: [0, 1.48, -1.05] },
  { color: 'azul', hex: '#2888df', position: [1.18, 1.48, -1.05] },
  { color: 'vermelho', hex: '#ed5b4f', position: [-0.58, 1.48, -0.43] },
  { color: 'verde', hex: '#37b87a', position: [0.58, 1.48, -0.43] },
]

function makeProceduralDevice() {
  const group = new THREE.Group()
  group.name = 'M.O.T.I.O.N. - protótipo ilustrativo'
  const shell = new THREE.MeshStandardMaterial({ color: '#2189d8', roughness: 0.38, metalness: 0.08 })
  const edge = new THREE.MeshStandardMaterial({ color: '#1466b3', roughness: 0.42, metalness: 0.06 })
  const white = new THREE.MeshStandardMaterial({ color: '#f7f4ed', roughness: 0.28, metalness: 0.04 })
  const dark = new THREE.MeshStandardMaterial({ color: '#17222a', roughness: 0.32, metalness: 0.08 })
  const steel = new THREE.MeshStandardMaterial({ color: '#c5d5d9', roughness: 0.25, metalness: 0.68 })

  const base = new THREE.Mesh(new RoundedBoxGeometry(4.7, 0.68, 3.15, 5, 0.12), shell)
  base.position.set(0, 0.18, 0.05)
  base.castShadow = true
  base.receiveShadow = true
  group.add(base)

  const baseEdge = new THREE.Mesh(new RoundedBoxGeometry(4.72, 0.12, 3.17, 4, 0.06), edge)
  baseEdge.position.set(0, -0.15, 0.05)
  baseEdge.castShadow = true
  group.add(baseEdge)

  const raisedPanel = new THREE.Mesh(new RoundedBoxGeometry(4.55, 0.78, 1.24, 5, 0.1), shell)
  raisedPanel.position.set(0, 0.87, -0.82)
  raisedPanel.castShadow = true
  raisedPanel.receiveShadow = true
  group.add(raisedPanel)

  const panelFace = new THREE.Mesh(new RoundedBoxGeometry(4.43, 0.055, 1.13, 4, 0.035), edge)
  panelFace.position.set(0, 1.282, -0.82)
  group.add(panelFace)

  const buttonMeshes: THREE.Mesh[] = []
  for (const item of buttonColors) {
    const [x, y, z] = item.position
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.31, 0.105, 40), white)
    ring.position.set(x, y - 0.055, z)
    ring.castShadow = true
    ring.receiveShadow = true
    group.add(ring)

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.255, 0.09, 40), edge)
    rim.position.set(x, y + 0.018, z)
    rim.castShadow = true
    group.add(rim)

    const capMaterial = new THREE.MeshStandardMaterial({ color: item.hex, roughness: 0.26, metalness: 0.04, emissive: '#000000' })
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.245, 0.16, 40), capMaterial)
    cap.position.set(x, y + 0.118, z)
    cap.castShadow = true
    cap.receiveShadow = true
    cap.userData.buttonColor = item.color
    cap.name = `botao-${item.color}`
    buttonMeshes.push(cap)
    group.add(cap)
  }

  const portPositions = Array.from({ length: 6 }, (_, index) => -1.38 + index * 0.552)
  for (const x of portPositions) {
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.075, 32), steel)
    socket.rotation.x = Math.PI / 2
    socket.position.set(x, 0.15, 1.635)
    socket.castShadow = true
    group.add(socket)

    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.078, 32), dark)
    hole.rotation.x = Math.PI / 2
    hole.position.set(x, 0.15, 1.681)
    group.add(hole)

    const center = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), steel)
    center.position.set(x, 0.15, 1.725)
    group.add(center)
  }

  return { group, buttonMeshes }
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose()
      })
      material.dispose()
    })
  })
}

export function HardwareViewer({ onSelectButton }: HardwareViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectRef = useRef(onSelectButton)
  const [state, setState] = useState<ViewerState>('loading')
  const [showPhoto, setShowPhoto] = useState(false)
  selectRef.current = onSelectButton

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      setState('photo')
      return
    }

    let alive = true
    let frame = 0
    const scene = new THREE.Scene()
    scene.background = null
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(5.5, 4.8, 6.5)
    camera.lookAt(0, 0.58, 0)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    scene.add(new THREE.HemisphereLight('#ffffff', '#9cb6c8', 2.1))
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2)
    keyLight.position.set(-4, 8, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight('#b4dcff', 1.5)
    fillLight.position.set(5, 4, -4)
    scene.add(fillLight)

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 64),
      new THREE.MeshBasicMaterial({ color: '#dceefa', transparent: true, opacity: 0.8 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.24
    ground.receiveShadow = true
    scene.add(ground)

    const procedural = makeProceduralDevice()
    procedural.group.position.y = -0.1
    scene.add(procedural.group)
    setState('procedural')

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.62, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.065
    controls.enablePan = false
    controls.minDistance = 5.3
    controls.maxDistance = 9.5
    controls.minPolarAngle = 0.42
    controls.maxPolarAngle = 1.42
    controls.update()

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let downAt: { x: number; y: number } | undefined
    const onPointerDown = (event: PointerEvent) => { downAt = { x: event.clientX, y: event.clientY } }
    const onPointerUp = (event: PointerEvent) => {
      if (!downAt || Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) > 7) {
        downAt = undefined
        return
      }
      downAt = undefined
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const picked = raycaster.intersectObjects(procedural.buttonMeshes, false)[0]?.object
      const color = picked?.userData.buttonColor as ButtonColor | undefined
      if (color) selectRef.current(color)
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(
      `${import.meta.env.BASE_URL}motion-button.glb`,
      (gltf) => {
        if (!alive) {
          disposeObject(gltf.scene)
          return
        }
        const model = gltf.scene
        const initialBox = new THREE.Box3().setFromObject(model)
        const size = initialBox.getSize(new THREE.Vector3())
        const longest = Math.max(size.x, size.y, size.z) || 1
        model.scale.setScalar(3.75 / longest)
        const fittedBox = new THREE.Box3().setFromObject(model)
        const center = fittedBox.getCenter(new THREE.Vector3())
        model.position.sub(center)
        model.position.y += 0.12
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true
            object.receiveShadow = true
          }
        })
        scene.remove(procedural.group)
        disposeObject(procedural.group)
        scene.add(model)
        setState('photo-model')
      },
      undefined,
      () => {
        if (alive) setState('procedural')
      },
    )

    const render = () => {
      if (!alive) return
      frame = window.requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
    }
    render()

    return () => {
      alive = false
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.dispose()
      disposeObject(scene)
      renderer.dispose()
    }
  }, [])

  const statusText = showPhoto || state === 'photo'
    ? 'Fotografia real do protótipo.'
    : state === 'photo-model'
      ? 'Modelo 3D gerado a partir da fotografia.'
      : state === 'procedural'
        ? 'Representação 3D ilustrativa baseada na fotografia.'
        : 'Preparando o modelo 3D.'

  return (
    <div className="hardware-viewer" ref={containerRef}>
      {showPhoto || state === 'photo' ? (
        <img className="hardware-fallback-photo" src={`${import.meta.env.BASE_URL}hardware-real.png`} alt="Protótipo físico azul com cinco botões coloridos e seis conectores" />
      ) : (
        <canvas ref={canvasRef} className="hardware-canvas" aria-hidden="true" />
      )}
      <span className="viewer-status" aria-live="polite"><span />{statusText}</span>
      {state !== 'photo' && <button className="viewer-photo-toggle" type="button" aria-pressed={showPhoto} onClick={() => setShowPhoto((value) => !value)}>{showPhoto ? 'Ver modelo 3D' : 'Ver foto real'}</button>}
    </div>
  )
}
