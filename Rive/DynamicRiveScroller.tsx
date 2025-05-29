import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRive, useStateMachineInput } from "@rive-app/react-canvas"

type Props = {
    riveFile: string
    artboardName: string
    stateMachineName: string
    inputName: string
    scrollSpeed: number
    startOffset: number
    endOffset: number
    debugBackground: boolean
    reverse: boolean
    previewPosition: number
}

export function SmartScrollRive({
    riveFile,
    artboardName,
    stateMachineName,
    inputName,
    scrollSpeed,
    startOffset,
    endOffset,
    debugBackground = false,
    reverse = false,
    previewPosition = 0,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)

    const { rive, RiveComponent } = useRive({
        src: riveFile || undefined,
        autoplay: true,
        artboard: artboardName || undefined,
        stateMachines: stateMachineName ? [stateMachineName] : [],
    })

    const numberInput = useStateMachineInput(rive, stateMachineName, inputName)

    const isPreview =
        typeof window !== "undefined" &&
        window.location.href.includes("preview")

    // Only activate scroll observer in preview
    const [scrollProgress, setScrollProgress] = useState(0)

    if (isPreview) {
        const { scrollYProgress } = useScroll({
            target: containerRef,
            offset: [`start ${startOffset}%`, `end ${endOffset}%`],
        })

        const scaled = useTransform(
            scrollYProgress,
            [0, 1],
            [0, 100 * scrollSpeed]
        )
        const clamped = useTransform(scaled, (v) =>
            Math.max(0, Math.min(100, v))
        )
        const final = reverse ? useTransform(clamped, (v) => 100 - v) : clamped

        // Subscribe to scroll updates only in preview
        useEffect(() => {
            const unsubscribe = final.on("change", (value) => {
                setScrollProgress(value)
            })
            return () => unsubscribe()
        }, [final])
    }

    // Set input value — design or preview mode
    useEffect(() => {
        if (!numberInput) return

        const valueToSet = isPreview ? scrollProgress : previewPosition
        numberInput.value = valueToSet
    }, [numberInput, scrollProgress, previewPosition, isPreview])

    const ready = riveFile && artboardName && stateMachineName && inputName

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: debugBackground ? "#111" : "transparent",
                color: "#fff",
                padding: 16,
                fontFamily: "sans-serif",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!riveFile ? (
                <div style={{ textAlign: "center", opacity: 0.7 }}>
                    📂 Upload a Rive file to begin
                </div>
            ) : !ready ? (
                <div style={{ textAlign: "center", opacity: 0.7 }}>
                    ✍️ Enter Artboard, State Machine, and Input names
                </div>
            ) : RiveComponent ? (
                <div style={{ width: "100%", height: "100%" }}>
                    <RiveComponent />
                </div>
            ) : (
                <div style={{ textAlign: "center", opacity: 0.7 }}>
                    ⏳ Loading animation...
                </div>
            )}
        </div>
    )
}

addPropertyControls(SmartScrollRive, {
    riveFile: {
        type: ControlType.File,
        allowedFileTypes: ["riv"],
        title: "Rive File",
    },
    artboardName: {
        type: ControlType.String,
        title: "Artboard",
        placeholder: "MainArtboard",
        defaultValue: "",
    },
    stateMachineName: {
        type: ControlType.String,
        title: "State Machine",
        placeholder: "StateMachine1",
        defaultValue: "",
    },
    inputName: {
        type: ControlType.String,
        title: "Input",
        placeholder: "ScrollInput",
        defaultValue: "",
    },
    scrollSpeed: {
        type: ControlType.Number,
        title: "Scroll Speed",
        min: 0.1,
        max: 5,
        defaultValue: 1,
    },
    startOffset: {
        type: ControlType.Number,
        title: "Start Offset (%)",
        min: 0,
        max: 100,
        defaultValue: 15,
    },
    endOffset: {
        type: ControlType.Number,
        title: "End Offset (%)",
        min: 0,
        max: 100,
        defaultValue: 60,
    },
    debugBackground: {
        type: ControlType.Boolean,
        title: "Debug Background",
        defaultValue: false,
    },
    reverse: {
        type: ControlType.Boolean,
        title: "Reverse Animation",
        defaultValue: false,
    },
    previewPosition: {
        type: ControlType.Number,
        title: "Preview Position",
        min: 0,
        max: 100,
        defaultValue: 0,
    },
})
