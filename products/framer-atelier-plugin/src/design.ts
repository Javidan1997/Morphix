/**
 * The Atelier design system, as data.
 *
 * These are the same values as TEMPLATE-GUIDE.md — the guide is the human
 * version, this is the machine version. Change a token here and re-run the
 * plugin to restyle a project.
 */

export interface ColorToken {
    name: string
    light: string
    /** Optional dark-mode value; omit and Framer keeps the light one. */
    dark?: string
}

export const COLORS: ColorToken[] = [
    { name: "Atelier/Ink", light: "rgba(20, 24, 29, 1)", dark: "rgba(247, 248, 250, 1)" },
    { name: "Atelier/Muted", light: "rgba(107, 116, 128, 1)", dark: "rgba(154, 163, 175, 1)" },
    { name: "Atelier/Line", light: "rgba(227, 231, 236, 1)", dark: "rgba(44, 50, 58, 1)" },
    { name: "Atelier/Surface", light: "rgba(255, 255, 255, 1)", dark: "rgba(28, 33, 40, 1)" },
    { name: "Atelier/Canvas", light: "rgba(247, 248, 250, 1)", dark: "rgba(20, 24, 29, 1)" },
    { name: "Atelier/Stage", light: "rgba(236, 238, 241, 1)", dark: "rgba(36, 42, 50, 1)" },
    { name: "Atelier/Accent", light: "rgba(20, 24, 29, 1)", dark: "rgba(247, 248, 250, 1)" },
]

export interface TextToken {
    name: string
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"
    fontSize: string
    lineHeight: string
    letterSpacing: string
    transform?: "none" | "uppercase"
    /** Smaller sizes at narrower widths. minWidth must be unique per entry. */
    breakpoints?: { minWidth: number; fontSize: string }[]
}

// Negative tracking on the large sizes is most of what separates a considered
// template from a default one, so it is set deliberately at every step.
export const TEXT_STYLES: TextToken[] = [
    {
        name: "Atelier/Display",
        tag: "h1",
        fontSize: "72px",
        lineHeight: "1.02em",
        letterSpacing: "-0.03em",
        breakpoints: [
            { minWidth: 810, fontSize: "56px" },
            { minWidth: 390, fontSize: "40px" },
        ],
    },
    {
        name: "Atelier/H2",
        tag: "h2",
        fontSize: "40px",
        lineHeight: "1.1em",
        letterSpacing: "-0.025em",
        breakpoints: [{ minWidth: 390, fontSize: "30px" }],
    },
    {
        name: "Atelier/H3",
        tag: "h3",
        fontSize: "20px",
        lineHeight: "1.3em",
        letterSpacing: "-0.015em",
    },
    {
        name: "Atelier/Body L",
        tag: "p",
        fontSize: "18px",
        lineHeight: "1.6em",
        letterSpacing: "-0.005em",
        breakpoints: [{ minWidth: 390, fontSize: "16px" }],
    },
    {
        name: "Atelier/Body",
        tag: "p",
        fontSize: "16px",
        lineHeight: "1.65em",
        letterSpacing: "0em",
    },
    {
        name: "Atelier/Caption",
        tag: "p",
        fontSize: "13px",
        lineHeight: "1.5em",
        letterSpacing: "0.02em",
        transform: "uppercase",
    },
]

/** Framer types these as template literals, so the tokens must match exactly. */
type Px = `${number}px`
export type Padding = Px | `${Px} ${Px} ${Px} ${Px}`
export type Gap = Px | `${Px} ${Px}`
export type ColumnWidth = Px | `${number}%` | `${number}fr`

export interface SectionSpec {
    /** Layer name in Framer. */
    name: string
    /** What you will put inside it, shown in the plugin as a checklist. */
    contains: string
    padding: Padding
    gap: Gap
    background?: "Canvas" | "Surface" | "Stage" | "Ink"
    direction: "horizontal" | "vertical"
    /** Child frames created inside, as a rough column split. */
    columns?: { name: string; width: ColumnWidth }[]
    radius?: Px
    /** Insert a Configurator3D instance into the named child. */
    configuratorIn?: string
}

const PAGE_WIDTH = 1200

export const SECTIONS: SectionSpec[] = [
    {
        name: "Nav",
        contains: "Wordmark, 3 links, 1 button",
        padding: "16px 0px 16px 0px",
        gap: "24px",
        direction: "horizontal",
    },
    {
        name: "Hero",
        contains: "Caption, Display, Body L, buttons, Caption",
        padding: "120px 0px 120px 0px",
        gap: "64px",
        direction: "horizontal",
        columns: [
            { name: "Hero Copy", width: "7fr" },
            { name: "Hero Stage", width: "5fr" },
        ],
        configuratorIn: "Hero Stage",
    },
    {
        name: "Trust Strip",
        contains: "5 logos or captions",
        padding: "24px 0px 24px 0px",
        gap: "40px",
        direction: "horizontal",
    },
    {
        name: "Features",
        contains: "H2 + three feature columns",
        padding: "120px 0px 120px 0px",
        gap: "40px",
        direction: "vertical",
        columns: [
            { name: "Feature 1", width: "1fr" },
            { name: "Feature 2", width: "1fr" },
            { name: "Feature 3", width: "1fr" },
        ],
    },
    {
        name: "Detail",
        contains: "Configurator + spec list",
        padding: "120px 0px 120px 0px",
        gap: "64px",
        direction: "horizontal",
        columns: [
            { name: "Detail Stage", width: "5fr" },
            { name: "Detail Copy", width: "7fr" },
        ],
        configuratorIn: "Detail Stage",
    },
    {
        name: "Specification",
        contains: "H2 + 8 spec rows",
        padding: "120px 0px 120px 0px",
        gap: "40px",
        direction: "vertical",
        background: "Surface",
        radius: "16px",
    },
    {
        name: "Testimonial",
        contains: "Quote + attribution",
        padding: "120px 0px 120px 0px",
        gap: "24px",
        direction: "vertical",
    },
    {
        name: "FAQ",
        contains: "H2 + 5 accordions",
        padding: "120px 0px 120px 0px",
        gap: "64px",
        direction: "horizontal",
        columns: [
            { name: "FAQ Heading", width: "1fr" },
            { name: "FAQ Items", width: "1.5fr" },
        ],
    },
    {
        name: "Closing CTA",
        contains: "H2, Body, button",
        padding: "120px 40px 120px 40px",
        gap: "24px",
        direction: "vertical",
        background: "Ink",
        radius: "24px",
    },
    {
        name: "Footer",
        contains: "Wordmark, link columns, legal",
        padding: "48px 0px 48px 0px",
        gap: "40px",
        direction: "horizontal",
    },
]

export const LAYOUT = { pageWidth: PAGE_WIDTH }
