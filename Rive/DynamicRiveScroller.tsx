import React from "react"
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useScroll, useTransform, MotionValue } from "framer-motion"
import { useRive, useStateMachineInput } from "@rive-app/react-canvas"

type Props = {
    riveFile: string
    artboardName: string
    stateMachineName: string
    inputName: string
    scrollSpeed: number
    startOffset: number
    endOffset: number
    debugMode: boolean
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
    debugMode = false,
    reverse = false,
    previewPosition = 0,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)

    // Improved environment detection for Framer
    const url = typeof window !== "undefined" ? window.location.href : "";
    const isFramerPreview = url.includes("/preview");
    const isFramerDesign =
        (url.includes("framercanvas.com") || url.includes("canvas") || url.includes("sandbox")) &&
        !isFramerPreview;
    const isPublished = !isFramerDesign && !isFramerPreview;

    // Always use container-based scroll tracking for all modes
    const { scrollYProgress }: { scrollYProgress: MotionValue<number> } = useScroll({
        target: containerRef,
        offset: [`start ${startOffset}%`, `end ${endOffset}%`],
    });

    // Log containerRef in all modes
    useEffect(() => {
        console.log("[SmartScrollRive] containerRef.current:", containerRef.current);
    }, [containerRef.current]);

    // Log scrollYProgress changes
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v) => {
            console.log("[SmartScrollRive] scrollYProgress changed:", v);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    const scaled = useTransform(scrollYProgress, [0, 1], [
        0,
        100 * scrollSpeed,
    ])
    const clamped = useTransform(scaled, (v: number) =>
        Math.max(0, Math.min(100, v))
    )
    const final = reverse
        ? useTransform(clamped, (v: number) => 100 - v)
        : clamped

    const { rive, RiveComponent } = useRive({
        src: riveFile || undefined,
        autoplay: true,
        artboard: artboardName || undefined,
        stateMachines: stateMachineName ? [stateMachineName] : [],
    })

    const numberInput = useStateMachineInput(rive, stateMachineName, inputName)

    // Log rive and numberInput initialization
    useEffect(() => {
        console.log("[SmartScrollRive] rive instance:", rive);
        console.log("[SmartScrollRive] numberInput:", numberInput);
        console.log("[SmartScrollRive] artboardName:", artboardName, "stateMachineName:", stateMachineName, "inputName:", inputName);
    }, [rive, numberInput, artboardName, stateMachineName, inputName]);

    // In design mode, set input to previewPosition
    useEffect(() => {
        if (!numberInput || !rive) return;
        if (isFramerDesign) {
            console.log("[SmartScrollRive] (Design) Setting numberInput.value to previewPosition", previewPosition);
            numberInput.value = previewPosition;
        }
    }, [numberInput, rive, previewPosition, isFramerDesign]);

    // In preview/published mode, set initial value and subscribe to scrollYProgress
    useEffect(() => {
        if (!numberInput || !rive) return;
        if (!isFramerDesign) {
            // Set initial value immediately
            const v = scrollYProgress.get();
            const scaled = Math.max(0, Math.min(100, v * 100 * scrollSpeed));
            numberInput.value = scaled;
            console.log("[SmartScrollRive] (Preview/Published) Initial set numberInput.value to", scaled, "from scrollYProgress", v);

            // Subscribe to changes
            const unsubscribe = scrollYProgress.on("change", (v) => {
                const scaled = Math.max(0, Math.min(100, v * 100 * scrollSpeed));
                numberInput.value = scaled;
                console.log("[SmartScrollRive] (Preview/Published) Setting numberInput.value to", scaled, "from scrollYProgress", v);
            });
            return () => unsubscribe();
        }
    }, [numberInput, rive, scrollYProgress, isFramerDesign, scrollSpeed]);

    // Debug logs for mode and values
    useEffect(() => {
        console.log("[SmartScrollRive] Mode:", {
            isFramerDesign,
            isFramerPreview,
            isPublished,
            previewPosition,
            scrollProgress,
            location: typeof window !== "undefined" ? window.location.href : "no window"
        });
    }, [isFramerDesign, isFramerPreview, isPublished, previewPosition, scrollProgress]);

    // Log scrollProgress changes
    useEffect(() => {
        console.log("[SmartScrollRive] scrollProgress updated:", scrollProgress);
    }, [scrollProgress]);

    const ready = riveFile && artboardName && stateMachineName && inputName

    // Combined debug mode: overlay and background
    const debugOverlay = debugMode ? (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            zIndex: 9999,
            fontSize: 12,
            padding: 8,
            pointerEvents: "none",
            overflow: "auto",
            borderRadius: 8,
        }}>
            <div><b>SmartScrollRive Debug</b></div>
            <div>isFramerDesign: {String(isFramerDesign)}</div>
            <div>isFramerPreview: {String(isFramerPreview)}</div>
            <div>isPublished: {String(isPublished)}</div>
            <div>previewPosition: {previewPosition}</div>
            <div>inputName: {inputName}</div>
            <div>artboardName: {artboardName}</div>
            <div>stateMachineName: {stateMachineName}</div>
            <div>scrollSpeed: {scrollSpeed}</div>
            <div>window.location: {typeof window !== "undefined" ? window.location.href : "no window"}</div>
        </div>
    ) : null;

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: debugMode ? "#111" : "transparent",
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
            {debugOverlay}
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
    debugMode: {
        type: ControlType.Boolean,
        title: "Debug Mode",
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

export default SmartScrollRive