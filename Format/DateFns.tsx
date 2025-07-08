import * as React from "react";
import { addPropertyControls, ControlType } from "framer";
import { formatDistanceToNow } from "date-fns";

export function RelativeTime({ date, fontSize, color, fontWeight, font, removeAbout }) {
    const fontFamily = font?.fontFamily || "Inter";
    const weight = fontWeight || font?.fontWeight || 400;
    if (!date) return <span style={{ fontSize, color, fontWeight: weight, fontFamily }}>No date provided</span>;
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return <span style={{ fontSize, color, fontWeight: weight, fontFamily }}>Invalid date</span>;
    let raw = formatDistanceToNow(dateObj, { addSuffix: true });
    if (removeAbout) raw = raw.replace(/^about /, "");
    return (
        <span style={{ fontSize, color, fontWeight: weight, fontFamily }}>
            {raw}
        </span>
    );
}

addPropertyControls(RelativeTime, {
    date: { type: ControlType.String, title: "Date/Time", placeholder: "2024-06-01T12:00:00Z", defaultValue: "" },
    fontSize: { type: ControlType.Number, title: "Font Size", min: 8, max: 120, defaultValue: 16 },
    color: { type: ControlType.Color, title: "Color", defaultValue: "#000" },
    fontWeight: { type: ControlType.Enum, options: [100,200,300,400,500,600,700,800,900], optionTitles: ["Thin","Extra Light","Light","Normal","Medium","Semi Bold","Bold","Extra Bold","Black"], title: "Font Weight", defaultValue: 400 },
    font: {
        title: "Font",
        type: ControlType.Font,
        defaultValue: {
            fontFamily: "Inter",
            fontWeight: 400,
            systemFont: true,
        },
    },
    removeAbout: {
        type: ControlType.Boolean,
        title: "About",
        defaultValue: false,
        enabledTitle: "Off",
        disabledTitle: "On",
    },
});

export default RelativeTime;