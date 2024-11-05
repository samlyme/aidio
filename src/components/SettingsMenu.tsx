import Switch from "@mui/material/Switch"

export default function SettingsMenu() {
    return (
        <div className="settings">
            <h1>lmao</h1>
            <VoicesMenu />
        </div>
    )
}

function VoicesMenu() {
    return (
        <div className="menu-section">
            <h2>VOICE</h2>
            {/* enable or disable */}
            <h2>UNISON 1</h2>
            <Switch />
            <h2>UNISON 2</h2>
            <Switch />
        </div>
    )
}