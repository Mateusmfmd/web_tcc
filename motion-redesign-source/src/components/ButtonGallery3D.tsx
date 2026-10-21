import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { ButtonColor } from '../data'

type ButtonGallery3DProps = {
  selectedColor: ButtonColor
  onSelectButton: (color: ButtonColor) => void
}

const buttonModels: Array<{ color: ButtonColor; label: string; hex: string }> = [
  { color: 'amarelo', label: 'Amarelo', hex: '#f2bd2f' },
  { color: 'preto', label: 'Preto', hex: '#253543' },
  { color: 'azul', label: 'Azul', hex: '#318bd6' },
  { color: 'vermelho', label: 'Vermelho', hex: '#e9564b' },
  { color: 'verde', label: 'Verde', hex: '#39aa70' },
]

export function ButtonGallery3D({ selectedColor, onSelectButton }: ButtonGallery3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectRef = useRef(onSelectButton)
  const selectedRef = useRef(selectedColor)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  selectRef.current = onSelectButton
  selectedRef.current = selectedColor

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      setFailed(true)
      return
    }

    let alive = true
    let frame = 0
    let pressUntil = 0
    let modelReady = false
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80)
    camera.lookAt(0, 0.22, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    scene.add(new THREE.HemisphereLight('#ffffff', '#9ab1c4', 2.4))
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.4)
    keyLight.position.set(-3, 7, 5)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight('#b9dcf8', 1.4)
    fillLight.position.set(4, 3, -5)
    scene.add(fillLight)

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(6.8, 64),
      new THREE.MeshBasicMaterial({ color: '#e4f2fa', transparent: true, opacity: 0.75 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.12
    scene.add(floor)

    const roots: THREE.Group[] = []
    const clickableMeshes: THREE.Mesh[] = []
    const loader = new GLTFLoader()
    loader.load(
      `${import.meta.env.BASE_URL}aac-tactile-button.glb`,
      (gltf) => {
        if (!alive) {
          gltf.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose()
              const materials = Array.isArray(object.material) ? object.material : [object.material]
              materials.forEach((material) => material.dispose())
            }
          })
          return
        }

        const source = gltf.scene
        const box = new THREE.Box3().setFromObject(source)
        const bounds = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const fitScale = 1.52 / Math.max(bounds.x, bounds.z, 0.1)

        buttonModels.forEach((item, index) => {
          const root = new THREE.Group()
          root.name = `botao-${item.color}`
          root.userData.buttonColor = item.color
          root.position.set((index - 2) * 1.92, 0.24, 0)
          const model = source.clone(true)
          model.scale.setScalar(fitScale)
          model.position.set(-center.x * fitScale, -center.y * fitScale, -center.z * fitScale)
          model.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return
            const materials = Array.isArray(object.material) ? object.material : [object.material]
            const recolored = materials.map(() => new THREE.MeshStandardMaterial({ color: item.hex, roughness: 0.33, metalness: 0.03 }))
            object.material = recolored.length === 1 ? recolored[0] : recolored
            object.castShadow = true
            object.receiveShadow = true
            object.userData.buttonColor = item.color
            clickableMeshes.push(object)
          })
          root.add(model)
          scene.add(root)
          roots.push(root)
        })
        modelReady = true
        setLoaded(true)
      },
      undefined,
      () => { if (alive) setFailed(true) },
    )

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let downAt: { x: number; y: number } | undefined
    const onPointerDown = (event: PointerEvent) => { downAt = { x: event.clientX, y: event.clientY } }
    const onPointerUp = (event: PointerEvent) => {
      if (!downAt || Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) > 9 || !modelReady) {
        downAt = undefined
        return
      }
      downAt = undefined
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(clickableMeshes, false)[0]?.object
      const color = hit?.userData.buttonColor as ButtonColor | undefined
      if (color) {
        pressUntil = performance.now() + 180
        selectRef.current(color)
      }
    }
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      canvas.style.cursor = raycaster.intersectObjects(clickableMeshes, false).length ? 'pointer' : 'default'
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointermove', onPointerMove)

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      const distance = 12 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect)
      camera.position.set(0, 0.22 + distance * 0.5, distance * 0.866)
      camera.lookAt(0, 0.22, 0)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()

    const render = () => {
      if (!alive) return
      frame = window.requestAnimationFrame(render)
      const isPressed = performance.now() < pressUntil
      for (const root of roots) {
        const isSelected = root.userData.buttonColor === selectedRef.current
        const scale = isSelected ? 1.08 : 1
        root.scale.x = scale
        root.scale.z = scale
        root.scale.y = isPressed && isSelected ? 0.82 : scale
      }
      renderer.render(scene, camera)
    }
    render()

    return () => {
      alive = false
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div className="button-gallery-stage" ref={hostRef} data-model-ready={loaded}>
      {!failed ? (
        <canvas ref={canvasRef} className="button-gallery-canvas" aria-hidden="true" />
      ) : (
        <div className="button-gallery-fallback" role="status">
          <span aria-hidden="true">● ● ● ● ●</span>
          <p>Os modelos 3D não abriram neste aparelho. Escolha uma cor nos controles logo abaixo.</p>
        </div>
      )}
      {!loaded && !failed && <span className="button-gallery-loading" role="status">Preparando os cinco botões…</span>}
    </div>
  )
}
