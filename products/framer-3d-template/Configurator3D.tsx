import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

/**
 * Configurator 3D
 *
 * A real-time 3D product viewer with colour options, for Framer.
 * Drop it on a frame, upload a .glb, and add swatches in the properties panel.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 600
 */
export default function Configurator3D(props) {
    const {
        model,
        background,
        transparent,
        environmentPreset,
        exposure,
        shadows,
        autoRotate,
        rotateSpeed,
        cameraHeight,
        zoom,
        allowZoom,
        swatches,
        showSwatches,
        swatchPosition,
        accent,
        style,
    } = props

    const hostRef = useRef<HTMLDivElement>(null)
    const apiRef = useRef<any>(null)
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
    const [progress, setProgress] = useState(0)
    const [active, setActive] = useState(0)

    // On the Framer canvas we keep the scene still, so designing does not
    // fight a spinning model or burn battery. Preview and the published
    // site behave normally.
    const onCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        const host = hostRef.current
        if (!host || typeof window === "undefined") return
        if (!model) {
            setStatus("idle")
            return
        }

        let disposed = false
        let frame = 0
        let running = false
        let idleAt = performance.now() + 3000
        let last = performance.now()

        setStatus("loading")
        setProgress(0)

        const scene = new THREE.Scene()
        if (!transparent) scene.background = new THREE.Color(background)

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: transparent,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = exposure
        renderer.shadowMap.enabled = shadows
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.domElement.style.cssText =
            "width:100%;height:100%;display:block;touch-action:none"
        host.appendChild(renderer.domElement)

        const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.enablePan = false
        controls.enableZoom = allowZoom
        controls.maxPolarAngle = Math.PI / 2 - 0.02

        const key = new THREE.DirectionalLight(0xfff6ea, 2.4)
        key.position.set(-3, 6, 4)
        key.castShadow = shadows
        key.shadow.mapSize.set(2048, 2048)
        key.shadow.normalBias = 0.02
        scene.add(key, new THREE.HemisphereLight(0xffffff, 0xb9bfc7, 0.9))

        const pmrem = new THREE.PMREMGenerator(renderer)
        const room = new RoomEnvironment()
        const envTarget = pmrem.fromScene(room, 0.04)
        scene.environment = envTarget.texture
        scene.environmentIntensity =
            environmentPreset === "bright" ? 1 : environmentPreset === "soft" ? 0.5 : 0.75
        room.dispose()

        let ground: THREE.Mesh | null = null
        if (shadows) {
            ground = new THREE.Mesh(
                new THREE.PlaneGeometry(200, 200),
                new THREE.ShadowMaterial({ opacity: 0.22 })
            )
            ground.rotation.x = -Math.PI / 2
            ground.receiveShadow = true
            scene.add(ground)
        }

        const loader = new GLTFLoader()
        const draco = new DRACOLoader()
        // Draco-compressed models are the norm for web-sized products.
        draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/")
        loader.setDRACOLoader(draco)

        let product: THREE.Object3D | null = null

        const render = () => renderer.render(scene, camera)

        const step = () => {
            if (disposed) {
                running = false
                return
            }
            const now = performance.now()
            const delta = Math.min(50, now - last)
            last = now
            let busy = false

            if (autoRotate && !onCanvas && now > idleAt) {
                const offset = camera.position.clone().sub(controls.target)
                offset.applyAxisAngle(
                    new THREE.Vector3(0, 1, 0),
                    0.00022 * rotateSpeed * delta
                )
                camera.position.copy(controls.target).add(offset)
                busy = true
            }
            if (controls.update()) busy = true
            render()
            if (busy) frame = requestAnimationFrame(step)
            else running = false
        }
        const wake = () => {
            if (disposed || running) return
            running = true
            last = performance.now()
            frame = requestAnimationFrame(step)
        }

        controls.addEventListener("start", () => {
            idleAt = Infinity
        })
        controls.addEventListener("end", () => {
            idleAt = performance.now() + 3000
            wake()
        })
        controls.addEventListener("change", wake)

        const resize = () => {
            const { width, height } = host.getBoundingClientRect()
            if (!width || !height) return
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            wake()
        }
        const observer = new ResizeObserver(resize)
        observer.observe(host)

        loader.load(
            model,
            (gltf) => {
                if (disposed) return
                product = gltf.scene
                product.traverse((node: any) => {
                    if (!node.isMesh) return
                    node.castShadow = shadows
                    node.receiveShadow = shadows
                    node.material = Array.isArray(node.material)
                        ? node.material.map((m: any) => m.clone())
                        : node.material.clone()
                })

                const bounds = new THREE.Box3().setFromObject(product)
                const size = bounds.getSize(new THREE.Vector3())
                const center = bounds.getCenter(new THREE.Vector3())
                product.position.sub(
                    new THREE.Vector3(center.x, bounds.min.y, center.z)
                )
                scene.add(product)

                const radius = Math.max(size.x, size.y, size.z)
                const distance =
                    (radius / 2 / Math.tan((35 * Math.PI) / 360)) * 1.6 * (1 / zoom)
                controls.target.set(0, size.y * 0.45, 0)
                camera.position.set(
                    distance * 0.62,
                    size.y * cameraHeight,
                    distance * 0.78
                )
                controls.minDistance = radius * 0.6
                controls.maxDistance = distance * 2.4
                controls.update()

                apiRef.current = {
                    applySwatch(swatch: any) {
                        if (!product || !swatch) return
                        const names = String(swatch.target || "")
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        product.traverse((node: any) => {
                            if (!node.isMesh) return
                            const mats = Array.isArray(node.material)
                                ? node.material
                                : [node.material]
                            for (const mat of mats) {
                                const hit =
                                    names.length === 0 ||
                                    names.includes(mat.name) ||
                                    names.includes(node.name)
                                if (hit && mat.color) {
                                    mat.color.set(swatch.color)
                                    mat.needsUpdate = true
                                }
                            }
                        })
                        wake()
                    },
                }
                if (swatches?.length) apiRef.current.applySwatch(swatches[0])

                setStatus("ready")
                resize()
                wake()
            },
            (event) => {
                if (event.total) setProgress(event.loaded / event.total)
            },
            () => {
                if (!disposed) setStatus("error")
            }
        )

        return () => {
            disposed = true
            cancelAnimationFrame(frame)
            observer.disconnect()
            controls.dispose()
            scene.traverse((node: any) => {
                if (!node.isMesh) return
                node.geometry?.dispose()
                const mats = Array.isArray(node.material) ? node.material : [node.material]
                for (const m of mats) m?.dispose()
            })
            envTarget.dispose()
            pmrem.dispose()
            renderer.dispose()
            renderer.domElement.remove()
            apiRef.current = null
        }
    }, [
        model,
        background,
        transparent,
        environmentPreset,
        exposure,
        shadows,
        autoRotate,
        rotateSpeed,
        cameraHeight,
        zoom,
        allowZoom,
        onCanvas,
    ])

    // Re-apply the active swatch when the list is edited in the panel.
    useEffect(() => {
        if (status !== "ready" || !swatches?.length) return
        apiRef.current?.applySwatch(swatches[Math.min(active, swatches.length - 1)])
    }, [status, active, swatches])

    const swatchBar: React.CSSProperties = {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        [swatchPosition === "top" ? "top" : "bottom"]: 16,
        display: "flex",
        gap: 10,
        padding: 8,
        borderRadius: 999,
        background: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 14px rgba(16,24,40,0.12)",
    }

    return (
        <div style={{ ...style, position: "relative", overflow: "hidden" }}>
            <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

            {status !== "ready" && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: 24,
                        textAlign: "center",
                        font: "500 13px/1.5 Inter, system-ui, sans-serif",
                        color: "#6b7480",
                        background: transparent ? "transparent" : background,
                    }}
                >
                    {status === "idle" && <span>Upload a .glb model in the properties panel →</span>}
                    {status === "loading" && (
                        <>
                            <span>Loading model… {Math.round(progress * 100)}%</span>
                            <div style={{ width: 140, height: 2, background: "#00000014", borderRadius: 2 }}>
                                <div
                                    style={{
                                        width: `${Math.max(5, progress * 100)}%`,
                                        height: "100%",
                                        background: accent,
                                        borderRadius: 2,
                                        transition: "width .25s ease",
                                    }}
                                />
                            </div>
                        </>
                    )}
                    {status === "error" && <span style={{ color: "#b3261e" }}>Could not load that model.</span>}
                </div>
            )}

            {status === "ready" && showSwatches && swatches?.length > 0 && (
                <div style={swatchBar}>
                    {swatches.map((swatch, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={swatch.label || `Option ${i + 1}`}
                            onClick={() => setActive(i)}
                            style={{
                                width: 28,
                                height: 28,
                                padding: 0,
                                borderRadius: "50%",
                                cursor: "pointer",
                                background: swatch.color,
                                border: active === i ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.12)",
                                outline: active === i ? `2px solid ${accent}` : "none",
                                outlineOffset: 2,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

Configurator3D.defaultProps = {
    background: "#eceef1",
    transparent: false,
    environmentPreset: "neutral",
    exposure: 1,
    shadows: true,
    autoRotate: true,
    rotateSpeed: 1,
    cameraHeight: 0.85,
    zoom: 1,
    allowZoom: true,
    showSwatches: true,
    swatchPosition: "bottom",
    accent: "#111418",
    swatches: [
        { label: "Sand", color: "#c7bfb1", target: "" },
        { label: "Olive", color: "#6f7358", target: "" },
        { label: "Ink", color: "#2d3239", target: "" },
    ],
}

addPropertyControls(Configurator3D, {
    model: {
        type: ControlType.File,
        title: "Model",
        allowedFileTypes: ["glb", "gltf"],
        description: "A .glb under 2 MB. Compress with gltf-transform first.",
    },
    background: { type: ControlType.Color, title: "Background", hidden: (p) => p.transparent },
    transparent: { type: ControlType.Boolean, title: "Transparent" },
    environmentPreset: {
        type: ControlType.Enum,
        title: "Lighting",
        options: ["soft", "neutral", "bright"],
        optionTitles: ["Soft", "Neutral", "Bright"],
        displaySegmentedControl: true,
    },
    exposure: { type: ControlType.Number, title: "Exposure", min: 0.2, max: 2, step: 0.05 },
    shadows: { type: ControlType.Boolean, title: "Shadow" },
    autoRotate: { type: ControlType.Boolean, title: "Auto-rotate" },
    rotateSpeed: {
        type: ControlType.Number,
        title: "Speed",
        min: 0.2, max: 3, step: 0.1,
        hidden: (p) => !p.autoRotate,
    },
    zoom: { type: ControlType.Number, title: "Zoom", min: 0.4, max: 2, step: 0.05 },
    cameraHeight: { type: ControlType.Number, title: "Camera height", min: 0.1, max: 2, step: 0.05 },
    allowZoom: { type: ControlType.Boolean, title: "Visitor zoom" },
    showSwatches: { type: ControlType.Boolean, title: "Show swatches" },
    swatchPosition: {
        type: ControlType.Enum,
        title: "Position",
        options: ["bottom", "top"],
        optionTitles: ["Bottom", "Top"],
        displaySegmentedControl: true,
        hidden: (p) => !p.showSwatches,
    },
    accent: { type: ControlType.Color, title: "Accent" },
    swatches: {
        type: ControlType.Array,
        title: "Colour options",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label", defaultValue: "Colour" },
                color: { type: ControlType.Color, title: "Colour", defaultValue: "#c7bfb1" },
                target: {
                    type: ControlType.String,
                    title: "Applies to",
                    placeholder: "Leave empty for all",
                    description: "Material or node names, comma separated.",
                },
            },
        },
    },
})
