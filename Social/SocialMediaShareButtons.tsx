// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/

import { ControlType, addPropertyControls } from "framer"
import { useEffect, useState } from "react"
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/components/auto-sizing
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth 500
 * @framerSupportedLayoutHeight 500
 */

const ICON_BASE_URL = "https://raw.githubusercontent.com/JoshMormann/FramerComponents/refs/heads/main/Social/Icons";

const shareUrlBases: Record<string, { desktop: string; mobile: string }> = {
    facebook: {
        desktop: "https://www.facebook.com/sharer/sharer.php?u=",
        mobile: "fb://share/?href=",
    },
    x: {
        desktop: "https://twitter.com/intent/tweet?url=",
        mobile: "twitter://post?message=",
    },
    linkedin: {
        desktop: "https://www.linkedin.com/sharing/share-offsite/?url=",
        mobile: "linkedin://shareArticle?url=",
    },
    whatsapp: {
        desktop: "https://wa.me/?text=",
        mobile: "whatsapp://send?text=",
    },
    gmail: {
        desktop: "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&body=",
        mobile: "googlegmail:///co?body=",
    },
    envelope: {
        desktop: "mailto:?body=",
        mobile: "mailto:?body=",
    },
    copy: {
        desktop: "",
        mobile: "",
    },
    instagram: {
        desktop: "https://www.instagram.com/?url=",
        mobile: "instagram://share?url=",
    },
};

// SocialIcon now loads SVG from ICON_BASE_URL
const SocialIcon = ({
    type,
    key,
    iconsStyles,
    iconStyle,
}) => {
    const [hover, setHover] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const { borderRadius, iconsSize, iconsPadding } = iconsStyles
    const iconContainerSize = iconsSize + iconsPadding * 2
    useEffect(() => {
        const userAgent = navigator.userAgent
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent))
    }, [])
    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault()
        const currentUrl = window.location.href
        if (type === "copy") {
            navigator.clipboard.writeText(currentUrl)
            window.alert("Link copied to clipboard!")
            return
        }
        const platformUrls = shareUrlBases[type]
        if (!platformUrls) {
            alert(`Sharing via ${type} is not supported.`)
            return
        }
        const base = isMobile ? platformUrls.mobile : platformUrls.desktop
        const redirectUrl = base + encodeURIComponent(currentUrl)
        window.open(redirectUrl, "_blank", "width=600,height=400")
    }
    const combinedStyle = {
        borderRadius: `${borderRadius}%`,
        width: `${iconContainerSize}px`,
        height: `${iconContainerSize}px`,
        padding: `${iconsPadding}px`,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        margin: "5px 2px",
        transition: "opacity 0.2s ease-in-out",
        display: "flex",
        cursor: "pointer",
        boxSizing: "border-box",
        opacity: hover ? 0.7 : 1,
        background: "none",
    }
    const iconUrl = `${ICON_BASE_URL}/${type}-${iconStyle}.svg`
    return (
        <a
            href="#"
            style={combinedStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleClick}
            aria-label={type}
            key={key}
        >
            <img src={iconUrl} alt={`${type} icon`} width={iconsSize} height={iconsSize} style={{ display: "block" }} />
        </a>
    )
}

export default function SocialMediaShareButtons(props: any) {
    const {
        shareHeading,
        borderRadius,
        iconsSize,
        iconsPadding,
        headingColor,
        headingFontFamily,
        containerPadding,
        showFacebook,
        showX,
        showLinkedIn,
        showWhatsApp,
        showGmail,
        showEnvelope,
        showCopy,
        showInstagram,
        iconStyle,
    } = props
    const allPlatforms = [
        { key: "facebook", show: showFacebook },
        { key: "x", show: showX },
        { key: "linkedin", show: showLinkedIn },
        { key: "whatsapp", show: showWhatsApp },
        { key: "gmail", show: showGmail },
        { key: "envelope", show: showEnvelope },
        { key: "copy", show: showCopy },
        { key: "instagram", show: showInstagram },
    ];
    const enabledPlatforms = allPlatforms.filter(p => p.show).map(p => p.key);
    return (
        <div style={{ ...containerStyle, padding: `${containerPadding}px` }}>
            <h2 style={{ color: headingColor, fontFamily: headingFontFamily }}>
                {shareHeading}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {enabledPlatforms.map((platform, index) => (
                    <SocialIcon
                        key={index}
                        type={platform}
                        iconsStyles={{ borderRadius, iconsSize, iconsPadding }}
                        iconStyle={iconStyle}
                    />
                ))}
            </div>
        </div>
    )
}

addPropertyControls(SocialMediaShareButtons, {
    shareHeading: {
        type: ControlType.String,
        title: "Heading",
        defaultValue: "Share If You Like!",
    },
    headingColor: {
        type: ControlType.Color,
        title: "Heading color",
        defaultValue: "#000",
    },
    headingFontFamily: {
        type: ControlType.String,
        title: "Heading Fonts",
        defaultValue: "Inter",
    },
    containerPadding: {
        type: ControlType.Number,
        title: "Container Padding",
        defaultValue: 16,
        min: 0,
        max: 100,
    },
    iconsSize: {
        type: ControlType.Number,
        title: "Icons Size",
        defaultValue: 25,
        min: 10,
    },
    iconsPadding: {
        type: ControlType.Number,
        title: "Icons Padding",
        defaultValue: 20,
        min: 0,
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 0,
    },
    iconStyle: {
        type: ControlType.Enum,
        title: "Icon Style",
        defaultValue: "color",
        options: ["color", "white", "black"],
        optionTitles: ["Full Color", "White", "Black"],
    },
    showFacebook: { type: ControlType.Boolean, title: "Facebook", defaultValue: true },
    showX: { type: ControlType.Boolean, title: "X (Twitter)", defaultValue: true },
    showLinkedIn: { type: ControlType.Boolean, title: "LinkedIn", defaultValue: true },
    showWhatsApp: { type: ControlType.Boolean, title: "WhatsApp", defaultValue: true },
    showGmail: { type: ControlType.Boolean, title: "Gmail", defaultValue: true },
    showEnvelope: { type: ControlType.Boolean, title: "Email", defaultValue: true },
    showCopy: { type: ControlType.Boolean, title: "Copy Link", defaultValue: true },
    showInstagram: { type: ControlType.Boolean, title: "Instagram", defaultValue: true },
});

const containerStyle = {
    height: "100%",
    width: "100%",
    padding: "16px",
    fontFamily: "sans-serif",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
};
