import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#eef4ff"/>
<path d="M0 40H1200M0 80H1200M0 120H1200M0 160H1200M0 200H1200M0 240H1200M0 280H1200M0 320H1200M0 360H1200M0 400H1200M0 440H1200M0 480H1200M0 520H1200M0 560H1200M0 600H1200M40 0V630M80 0V630M120 0V630M160 0V630M200 0V630M240 0V630M280 0V630M320 0V630M360 0V630M400 0V630M440 0V630M480 0V630M520 0V630M560 0V630M600 0V630M640 0V630M680 0V630M720 0V630M760 0V630M800 0V630M840 0V630M880 0V630M920 0V630M960 0V630M1000 0V630M1040 0V630M1080 0V630M1120 0V630M1160 0V630" stroke="#245fd4" stroke-opacity=".08"/>
<text x="76" y="118" font-family="monospace" font-size="22" letter-spacing="4" fill="#245fd4">AI AGENT · FULL-STACK ENGINEER</text>
<text x="76" y="250" font-family="Arial,sans-serif" font-size="68" font-weight="700" fill="#14213d">I turn complex ideas</text>
<text x="76" y="330" font-family="Arial,sans-serif" font-size="68" font-weight="700" fill="#245fd4">into reliable products.</text>
<path d="M120 470H1080" stroke="#14213d" stroke-width="4"/><path d="M170 470L360 470L550 470L740 470L930 470" stroke="#245fd4" stroke-width="6"/>
<g fill="#8fb6ff" stroke="#14213d" stroke-width="4"><circle cx="170" cy="470" r="16"/><circle cx="360" cy="470" r="16"/><circle cx="550" cy="470" r="16"/><circle cx="740" cy="470" r="16"/><circle cx="930" cy="470" r="16"/></g>
<text x="170" y="530" font-family="monospace" font-size="18" text-anchor="middle" fill="#14213d">IDEA</text><text x="360" y="530" font-family="monospace" font-size="18" text-anchor="middle" fill="#14213d">AGENT</text><text x="550" y="530" font-family="monospace" font-size="18" text-anchor="middle" fill="#14213d">BUILD</text><text x="740" y="530" font-family="monospace" font-size="18" text-anchor="middle" fill="#14213d">SHIP</text>
</svg>`
await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('generated public/og-image.png')