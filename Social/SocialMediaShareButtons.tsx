// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers/

import { ControlType, addPropertyControls } from "framer"
import Example from "https://framer.com/m/framer/Example.js@^1.0.0"
import { useEffect, useState } from "react"
import { socialIcons } from "https://framer.com/m/SvgIcons-Rxc0.js@Ep0NnIMz1KtkHV8EBb8D"
/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/components/auto-sizing
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth 500
 * @framerSupportedLayoutHeight 500
 */

// Specific styles for each icon type.
const iconStyles: Record<string, React.CSSProperties> = {
    facebook: { backgroundColor: "#1877F2" },
    twitter: { backgroundColor: "#252525" },
    linkedin: { backgroundColor: "#007bb5" },
    pinterest: { backgroundColor: "#E60023" },
    reddit: { backgroundColor: "#FC471E" },
    whatsapp: { backgroundColor: "#25D366" },
    dribbble: { backgroundColor: "#ea4c89" },
    tumblr: { backgroundColor: "#000" },
    envelope: { backgroundColor: "#666666" },
    telegram: { backgroundColor: "#24A1DE" },
    copy: { backgroundColor: "#4A4A4A" },
    gmail: { backgroundColor: "#F2F2F2" },
    outlook: { backgroundColor: "#0078D4" },
    teams: { backgroundColor: "#6264A7" },
    messenger: { backgroundColor: "#0084FF" },
    blogger: { backgroundColor: "#F57D00" },
    ymail: { backgroundColor: "#430297" },
    weChat: { backgroundColor: "#7BB32E" },
    threads: { backgroundColor: "#000" },
    print: { backgroundColor: "#000" },
}

// Mapping from platform to base share URL.
const shareUrlBases: Record<string, { desktop: string; mobile: string }> = {
    facebook: {
        desktop: "https://www.facebook.com/sharer/sharer.php?u=",
        mobile: "fb://share/?href=",
    },
    twitter: {
        desktop: "https://twitter.com/intent/tweet?url=",
        mobile: "twitter://post?message=",
    },
    linkedin: {
        desktop: "https://www.linkedin.com/sharing/share-offsite/?url=",
        mobile: "linkedin://shareArticle?url=",
    },
    pinterest: {
        desktop: "https://pinterest.com/pin/create/button/?url=",
        mobile: "https://pinterest.com/pin/create/button/?url=",
    },
    reddit: {
        desktop: "https://www.reddit.com/submit?url=",
        mobile: "https://www.reddit.com/submit?url=",
    },
    whatsapp: {
        desktop: "https://wa.me/?text=",
        mobile: "whatsapp://send?text=",
    },
    dribbble: {
        desktop: "https://dribbble.com/shots/new?url=",
        mobile: "https://dribbble.com/shots/new?url=",
    },
    tumblr: {
        desktop: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=",
        mobile: "https://www.tumblr.com/widgets/share/tool?canonicalUrl=",
    },
    envelope: {
        desktop: "mailto:?body=",
        mobile: "mailto:?body=",
    },
    telegram: {
        desktop: "https://t.me/share/url?url=",
        mobile: "tg://msg?text=",
    },
    weChat: {
        desktop: "https://web.wechat.com/share?url",
        mobile: "weixin://share?url=",
    },
    gmail: {
        desktop:
            "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&body=",
        mobile: "googlegmail:///co?body=",
    },
    copy: {
        desktop: "",
        mobile: "",
    },
    blogger: {
        desktop: "https://www.blogger.com/blog-this.g?u=",
        mobile: "https://www.blogger.com/blog-this.g?u=",
    },
    teams: {
        desktop: "https://teams.microsoft.com/share?href=",
        mobile: "msteams://l/chat/0/0?message=",
    },
    messenger: {
        desktop:
            "https://www.facebook.com/dialog/send?app_id=516363574465158&link=",

        mobile: "fb-messenger://share?link=",
    },
    outlook: {
        desktop: "https://outlook.live.com/mail/0/deeplink/compose?body=",
        mobile: "ms-outlook://compose?body=",
    },
    ymail: {
        desktop: "https://mail.yahoo.com/n/compose/",
        mobile: "mailto:?body=", // Yahoo doesn't have a specific mobile app scheme
    },
    threads: {
        desktop:
            "https://www.threads.net/intent/post?text=Share%20this%20page:&url=",
        mobile: "barcelona://create?text=",
    },
    print: {
        desktop: "", // Handled separately
        mobile: "",
    },
}

type SocialIconProps = {
    type: keyof typeof iconStyles
    key: any
    enableUrlShorten: boolean
    iconsStyles: any
    colorType: string
    iconsBackground: string
    iconsColor: string
}

const SocialIcon: React.FC<SocialIconProps> = ({
    type,
    key,
    enableUrlShorten,
    iconsStyles,
    colorType,
    iconsBackground,
    iconsColor,
}) => {
    const [hover, setHover] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const { borderRadius, iconsSize, iconsPadding } = iconsStyles

    // Define a consistent size for the icon container
    const iconContainerSize = iconsSize + iconsPadding * 2 // Total size including padding

    const controlStyles: React.CSSProperties = {
        borderRadius: `${borderRadius}%`,
        width: `${iconContainerSize}px`, // Fixed width
        height: `${iconContainerSize}px`, // Fixed height
        padding: `${iconsPadding}px`,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center", // Center the icon
        textDecoration: "none",
        margin: "5px 2px",
        transition: "opacity 0.2s ease-in-out",
        display: "flex",
        cursor: "pointer",
        boxSizing: "border-box", // Include padding in size
    }

    useEffect(() => {
        // Detect if user is on mobile device
        const userAgent = navigator.userAgent
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(userAgent))
    }, [])

    // Helper: Shorten URL using is.gd API.
    const shortenUrl = async (longUrl: string): Promise<string> => {
        try {
            const data = new URLSearchParams({ url: longUrl }).toString()
            const response = await fetch("https://spoo.me/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: data,
            })
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.status}`
                )
            }
            const result = await response.json()
            return result.short_url || longUrl // Use short_url field or fallback
        } catch (error) {
            console.error("URL shortening error:", error)
            return longUrl // Fallback to original URL on error
        }
    }

    // Handle click: construct long share URL, then shorten it if possible.
    const handleClick = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault()
        const currentUrl = window.location.href

        if (type === "print") {
            window.print()
            return
        } else if (["messenger", "weChat"].includes(type)) {
            if (!isMobile) {
                window.alert(`Sorry, ${type} sharing works only on mobile`)
                return
            }
        } else if (type === "copy") {
            const url = enableUrlShorten
                ? await shortenUrl(currentUrl)
                : currentUrl
            navigator.clipboard.writeText(url)
            window.alert("Link copied to clipboard!")
            return
        }

        const platformUrls = shareUrlBases[type]
        if (!platformUrls) {
            alert(`Sharing via ${type} is not supported.`)
            return
        }

        const base = isMobile ? platformUrls.mobile : platformUrls.desktop

        if (type == "ymail") {
            window.open(base, "_blank", "width=600,height=400")
            return
        }

        // Only shorten the URL when clicked.
        const shareUrl = enableUrlShorten
            ? await shortenUrl(currentUrl)
            : currentUrl
        const redirectUrl = base + encodeURIComponent(shareUrl)

        if (type === "teams") {
            const redirectUrl = `${base}${encodeURIComponent(shareUrl)}&referrer=${encodeURIComponent(window.location.hostname)}`
            window.open(
                redirectUrl,
                "ms-teams-share-popup",
                "width=700,height=600"
            )
            return
        }

        window.open(redirectUrl, "_blank", "width=600,height=400")
    }

    const iconsStyling =
        colorType === "brand"
            ? iconStyles[type]
            : { backgroundColor: iconsBackground, color: iconsColor }

    const combinedStyle: React.CSSProperties = {
        ...controlStyles,
        ...iconsStyling,
        opacity: hover ? 0.7 : 1,
    }

    const IconComponent = socialIcons[type] // Dynamically select the SVG

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
            {IconComponent ? (
                <IconComponent
                    colorType={colorType}
                    iconsSize={iconsSize}
                    iconsBackground={iconsBackground}
                    iconsColor={iconsColor}
                />
            ) : (
                <span>Icon not found</span> // Fallback if icon isn’t defined
            )}
        </a>
    )
}

export default function SocialMediaShareButtons(props: any) {
    const {
        enableUrlShorten,
        shareHeading,
        borderRadius,
        iconsSize,
        iconsPadding,
        colorType,
        iconsBackground,
        iconsColor,
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
    } = props

    const allPlatforms = [
        { key: "facebook", show: showFacebook },
        { key: "x", show: showX }, // X (formerly Twitter)
        { key: "linkedin", show: showLinkedIn },
        { key: "whatsapp", show: showWhatsApp },
        { key: "gmail", show: showGmail },
        { key: "envelope", show: showEnvelope },
        { key: "copy", show: showCopy },
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
                        enableUrlShorten={enableUrlShorten}
                        colorType={colorType}
                        iconsBackground={iconsBackground}
                        iconsColor={iconsColor}
                        iconsStyles={{ borderRadius, iconsSize, iconsPadding }}
                    />
                ))}
            </div>
        </div>
    )
}

// Define property controls
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

    colorType: {
        type: ControlType.Enum,
        title: "Icons Color",
        defaultValue: "brand",
        options: ["brand", "custom"],
        optionTitles: ["Brand Coloring", "Custom Coloring"],
    },

    iconsBackground: {
        type: ControlType.Color,
        title: "Icons Background",
        defaultValue: "#000",
        hidden: (props) => props.colorType === "brand", // Show only if custom
    },
    iconsColor: {
        type: ControlType.Color,
        title: "Icons Color",
        defaultValue: "#fff",
        hidden: (props) => props.colorType === "brand", // Show only if custom
    },

    enableUrlShorten: {
        type: ControlType.Boolean,
        title: "URL Shortening",
        defaultValue: false,
        hidden: () => true, // Always hide this control
    },
    showFacebook: { type: ControlType.Boolean, title: "Facebook", defaultValue: true },
    showX: { type: ControlType.Boolean, title: "X (Twitter)", defaultValue: true },
    showLinkedIn: { type: ControlType.Boolean, title: "LinkedIn", defaultValue: true },
    showWhatsApp: { type: ControlType.Boolean, title: "WhatsApp", defaultValue: true },
    showGmail: { type: ControlType.Boolean, title: "Gmail", defaultValue: true },
    showEnvelope: { type: ControlType.Boolean, title: "Email", defaultValue: true },
    showCopy: { type: ControlType.Boolean, title: "Copy Link", defaultValue: true },
});

// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style
const containerStyle = {
    height: "100%",
    width: "100%",
    padding: "16px",
    fontFamily: "sans-serif",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
}

// TODO: If there is no 'x' icon in socialIcons, you may need to provide one or update the icon source.
