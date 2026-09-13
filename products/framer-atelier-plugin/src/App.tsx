import { framer, useIsAllowedTo } from "@framer/plugin"
import { useState } from "react"
import { COLORS, TEXT_STYLES, SECTIONS, LAYOUT } from "./design"
import "./App.css"

framer.showUI({ position: "top right", width: 300, height: 520 })

type Log = { text: string; kind: "ok" | "warn" | "err" }

export function App() {
    const [log, setLog] = useState<Log[]>([])
    const [busy, setBusy] = useState(false)
    const [componentUrl, setComponentUrl] = useState("")

    const canCreateStyles = useIsAllowedTo("createColorStyle", "createTextStyle")
    const canCreateNodes = useIsAllowedTo("createFrameNode")

    const say = (text: string, kind: Log["kind"] = "ok") =>
        setLog(current => [...current, { text, kind }])

    /** Styles are matched by name so re-running updates rather than duplicates. */
    async function buildStyles() {
        setBusy(true)
        setLog([])
        try {
            const existingColors = await framer.getColorStyles()
            const byColorName = new Map(existingColors.map(style => [style.name, style]))
            let created = 0
            let updated = 0

            for (const token of COLORS) {
                const existing = byColorName.get(token.name)
                if (existing) {
                    await existing.setAttributes({ light: token.light, dark: token.dark })
                    updated++
                } else {
                    await framer.createColorStyle({
                        name: token.name,
                        light: token.light,
                        dark: token.dark,
                    })
                    created++
                }
            }
            say(`Colours: ${created} created, ${updated} updated`)

            const existingText = await framer.getTextStyles()
            const byTextName = new Map(existingText.map(style => [style.name, style]))
            created = 0
            updated = 0

            for (const token of TEXT_STYLES) {
                const attributes = {
                    name: token.name,
                    tag: token.tag,
                    fontSize: token.fontSize,
                    lineHeight: token.lineHeight,
                    letterSpacing: token.letterSpacing,
                    ...(token.transform ? { transform: token.transform } : {}),
                    ...(token.breakpoints ? { breakpoints: token.breakpoints } : {}),
                } as Parameters<typeof framer.createTextStyle>[0]

                const existing = byTextName.get(token.name)
                if (existing) {
                    await existing.setAttributes(attributes)
                    updated++
                } else {
                    await framer.createTextStyle(attributes)
                    created++
                }
            }
            say(`Text styles: ${created} created, ${updated} updated`)
            say("Open the Assets panel to see them under “Atelier”.")
        } catch (error) {
            say(error instanceof Error ? error.message : String(error), "err")
        } finally {
            setBusy(false)
        }
    }

    /** Builds the nested section skeleton. Copy is typed in afterwards. */
    async function buildSkeleton() {
        setBusy(true)
        setLog([])
        try {
            const page = await framer.createFrameNode({
                name: "Atelier — Page",
                width: `${LAYOUT.pageWidth}px`,
                height: "fit-content",
                layout: "stack",
                stackDirection: "vertical",
                stackAlignment: "center",
                gap: "0px",
                backgroundColor: "rgba(247, 248, 250, 1)",
            })
            if (!page) throw new Error("Framer refused to create the page frame.")

            let sections = 0
            let columns = 0
            let configurators = 0

            for (const section of SECTIONS) {
                const background =
                    section.background === "Ink"
                        ? "rgba(20, 24, 29, 1)"
                        : section.background === "Surface"
                          ? "rgba(255, 255, 255, 1)"
                          : section.background === "Stage"
                            ? "rgba(236, 238, 241, 1)"
                            : null

                const node = await framer.createFrameNode(
                    {
                        name: section.name,
                        width: "100%",
                        height: "fit-content",
                        layout: "stack",
                        stackDirection: section.direction,
                        stackDistribution: section.direction === "horizontal" ? "space-between" : "start",
                        stackAlignment: section.direction === "horizontal" ? "center" : "start",
                        padding: section.padding,
                        gap: section.gap,
                        ...(background ? { backgroundColor: background } : {}),
                        ...(section.radius ? { borderRadius: section.radius } : {}),
                    },
                    page.id,
                )
                if (!node) {
                    say(`Could not create “${section.name}”`, "warn")
                    continue
                }
                sections++

                for (const column of section.columns ?? []) {
                    const child = await framer.createFrameNode(
                        {
                            name: column.name,
                            width: column.width,
                            height: "fit-content",
                            layout: "stack",
                            stackDirection: "vertical",
                            gap: "16px",
                        },
                        node.id,
                    )
                    if (!child) continue
                    columns++

                    // The configurator needs a real height, so the stage column gets
                    // a fixed-height frame rather than fit-content. A zero-height
                    // container renders nothing and looks broken.
                    if (section.configuratorIn === column.name) {
                        const stage = await framer.createFrameNode(
                            {
                                name: "Configurator Frame",
                                width: "100%",
                                height: "560px",
                                borderRadius: "16px",
                                backgroundColor: "rgba(236, 238, 241, 1)",
                            },
                            child.id,
                        )
                        if (stage && componentUrl.trim() && !configurators) {
                            try {
                                await framer.addComponentInstance({
                                    url: componentUrl.trim(),
                                    attributes: { width: "100%", height: "100%" },
                                })
                                configurators++
                            } catch {
                                say("Component URL rejected — check it and re-run", "warn")
                            }
                        }
                    }
                }
            }

            say(`${sections} sections, ${columns} columns created`)
            if (configurators) say("Configurator added to the canvas — drag it into a Configurator Frame", "warn")
            else if (componentUrl.trim()) say("No configurator placed — see warning above", "warn")
            else say("Paste the Configurator3D URL above to place it automatically", "warn")

            // The one thing the API cannot do for you.
            say("Text can't be nested by the plugin API — type the copy from TEMPLATE-GUIDE.md", "warn")
            await framer.setSelection([page.id])
        } catch (error) {
            say(error instanceof Error ? error.message : String(error), "err")
        } finally {
            setBusy(false)
        }
    }

    return (
        <main className="atelier">
            <p className="intro">
                Creates the Atelier colour and text styles, then a nested section
                skeleton with layout, padding and gaps already set.
            </p>

            <label className="field">
                <span>Configurator3D URL (optional)</span>
                <input
                    type="text"
                    placeholder="https://framer.com/m/…"
                    value={componentUrl}
                    onChange={event => setComponentUrl(event.target.value)}
                />
                <small>Copy it from the components panel to place it automatically.</small>
            </label>

            <button
                className="framer-button-primary"
                onClick={buildStyles}
                disabled={busy || !canCreateStyles}
            >
                1 — Create styles
            </button>
            <button
                className="framer-button"
                onClick={buildSkeleton}
                disabled={busy || !canCreateNodes}
            >
                2 — Build page skeleton
            </button>

            {!canCreateStyles && <p className="warn">You don’t have permission to create styles here.</p>}

            {log.length > 0 && (
                <ul className="log">
                    {log.map((entry, index) => (
                        <li key={index} className={entry.kind}>
                            {entry.text}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
