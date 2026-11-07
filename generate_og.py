import math
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
W, H = 1200, 630

# Create base canvas with smooth dark gradient
base = Image.new("RGBA", (W, H), (8, 12, 20, 255))
draw = ImageDraw.Draw(base)

# Draw subtle ambient background gradient
for y in range(H):
    # Vertical gradient from #080c14 to #0b1120
    r = int(8 + (12 - 8) * (y / H))
    g = int(12 + (17 - 12) * (y / H))
    b = int(20 + (32 - 20) * (y / H))
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# Draw subtle radial glows on an overlay
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)

# Top-right indigo glow
cx, cy = 1000, 80
for radius in range(350, 0, -10):
    alpha = int(32 * (1 - (radius / 350) ** 1.5))
    glow_draw.ellipse(
        [(cx - radius, cy - radius), (cx + radius, cy + radius)],
        fill=(99, 102, 241, alpha),
    )

# Left-center blue glow
cx2, cy2 = 180, 320
for radius in range(300, 0, -10):
    alpha = int(24 * (1 - (radius / 300) ** 1.5))
    glow_draw.ellipse(
        [(cx2 - radius, cy2 - radius), (cx2 + radius, cy2 + radius)],
        fill=(37, 99, 235, alpha),
    )

# Bottom-right emerald ambient hint
cx3, cy3 = 1100, 560
for radius in range(250, 0, -10):
    alpha = int(20 * (1 - (radius / 250) ** 1.5))
    glow_draw.ellipse(
        [(cx3 - radius, cy3 - radius), (cx3 + radius, cy3 + radius)],
        fill=(16, 185, 129, alpha),
    )

base = Image.alpha_composite(base, glow)
draw = ImageDraw.Draw(base)

# Draw faint technical grid dots
dot_color = (255, 255, 255, 18)
for gx in range(40, W, 40):
    for gy in range(40, H, 40):
        draw.point((gx, gy), fill=dot_color)

# Fonts
font_dir = r"C:\Windows\Fonts"
try:
    font_brand = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 30)
    font_tag = ImageFont.truetype(f"{font_dir}\\segoeui.ttf", 13)
    font_badge = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 16)
    font_h1 = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 44)
    font_sub = ImageFont.truetype(f"{font_dir}\\segoeui.ttf", 19)
    font_mock_title = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 13)
    font_mock_code = ImageFont.truetype(f"{font_dir}\\consola.ttf", 15)
    font_mock_badge = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 12)
    font_footer = ImageFont.truetype(f"{font_dir}\\segoeui.ttf", 14)
    font_founder = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 15)
    font_url = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 15)
except Exception:
    font_brand = ImageFont.load_default()
    font_tag = ImageFont.load_default()
    font_badge = ImageFont.load_default()
    font_h1 = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_mock_title = ImageFont.load_default()
    font_mock_code = ImageFont.load_default()
    font_mock_badge = ImageFont.load_default()
    font_footer = ImageFont.load_default()
    font_founder = ImageFont.load_default()
    font_url = ImageFont.load_default()

# ----------------- TOP BAR -----------------
# Brand Logo Badge [CW]
badge_x, badge_y = 60, 50
badge_w, badge_h = 44, 44
draw.rounded_rectangle(
    [(badge_x, badge_y), (badge_x + badge_w, badge_y + badge_h)],
    radius=10,
    fill=(37, 99, 235),
    outline=(99, 102, 241),
    width=1,
)
draw.text((badge_x + 9, badge_y + 11), "CW", fill=(255, 255, 255), font=font_badge)

# Brand Name
draw.text((badge_x + 56, badge_y + 4), "ChangeWatch", fill=(255, 255, 255), font=font_brand)

# Version Tag [v2.0]
tag_x = badge_x + 266
draw.rounded_rectangle(
    [(tag_x, badge_y + 11), (tag_x + 50, badge_y + 33)],
    radius=12,
    fill=(30, 58, 138, 90),
    outline=(59, 130, 246, 180),
    width=1,
)
draw.text((tag_x + 11, badge_y + 14), "v2.0", fill=(96, 165, 250), font=font_tag)

# Top-Right Engine Status Pill
engine_w = 260
engine_x = W - 60 - engine_w
engine_y = badge_y + 6
draw.rounded_rectangle(
    [(engine_x, engine_y), (engine_x + engine_w, engine_y + 34)],
    radius=17,
    fill=(15, 23, 42, 220),
    outline=(16, 185, 129, 120),
    width=1,
)
# Green pulse dot
draw.ellipse(
    [(engine_x + 14, engine_y + 12), (engine_x + 24, engine_y + 22)],
    fill=(16, 185, 129),
)
draw.text(
    (engine_x + 34, engine_y + 9),
    "GROQ LPU • ENGINE ACTIVE",
    fill=(167, 243, 208),
    font=font_mock_title,
)

# ----------------- MAIN HEADLINE -----------------
head_y = 125

# Eyebrow Pill
eyebrow_w = 360
draw.rounded_rectangle(
    [(60, head_y), (60 + eyebrow_w, head_y + 28)],
    radius=14,
    fill=(30, 41, 59, 160),
    outline=(99, 102, 241, 100),
    width=1,
)
draw.text(
    (74, head_y + 6),
    "✦  AUTONOMOUS CONTRACT & DOC AUDIT",
    fill=(147, 197, 253),
    font=font_tag,
)

# Main Title Lines
draw.text(
    (60, head_y + 40),
    "Intelligent Document Redlines &",
    fill=(255, 255, 255),
    font=font_h1,
)
draw.text(
    (60, head_y + 92),
    "Instant Discrepancy Auditing",
    fill=(56, 189, 248),
    font=font_h1,
)

# Subtitle
draw.text(
    (60, head_y + 152),
    "Detect subtle clause deletions, pricing alterations & compliance risks with precision split-diffs.",
    fill=(148, 163, 184),
    font=font_sub,
)

# ----------------- LIVE AUDIT MOCKUP CARD -----------------
mock_x = 60
mock_y = 350
mock_w = W - 120
mock_h = 180

# Card background with border
draw.rounded_rectangle(
    [(mock_x, mock_y), (mock_x + mock_w, mock_y + mock_h)],
    radius=14,
    fill=(12, 17, 29, 230),
    outline=(51, 65, 85, 180),
    width=1,
)

# Mock Card Topbar
draw.line([(mock_x, mock_y + 36), (mock_x + mock_w, mock_y + 36)], fill=(30, 41, 59, 255), width=1)

# Window controls (mac-style colored dots)
draw.ellipse([(mock_x + 18, mock_y + 13), (mock_x + 28, mock_y + 23)], fill=(239, 68, 68))
draw.ellipse([(mock_x + 34, mock_y + 13), (mock_x + 44, mock_y + 23)], fill=(245, 158, 11))
draw.ellipse([(mock_x + 50, mock_y + 13), (mock_x + 60, mock_y + 23)], fill=(16, 185, 129))

draw.text(
    (mock_x + 72, mock_y + 11),
    "AUDIT WORKBENCH  •  SPLIT REDLINE DIFF VIEW",
    fill=(100, 116, 139),
    font=font_mock_title,
)

# Critical Priority Alert Pill in Mockup top-right
crit_w = 175
crit_x = mock_x + mock_w - crit_w - 16
draw.rounded_rectangle(
    [(crit_x, mock_y + 8), (crit_x + crit_w, mock_y + 28)],
    radius=10,
    fill=(220, 38, 38, 50),
    outline=(239, 68, 68, 180),
    width=1,
)
draw.text(
    (crit_x + 10, mock_y + 11),
    "⚠  CRITICAL RISK DETECTED",
    fill=(254, 202, 202),
    font=font_mock_badge,
)

# Inside Split Diff Comparison
col_w = (mock_w - 40) // 2

# Left Column (Original Document)
left_x = mock_x + 20
draw.text((left_x, mock_y + 50), "1. ORIGINAL VERSION (BASE)", fill=(148, 163, 184), font=font_mock_title)
# Red highlight box
draw.rounded_rectangle(
    [(left_x, mock_y + 74), (left_x + col_w, mock_y + 120)],
    radius=6,
    fill=(127, 29, 29, 60),
    outline=(239, 68, 68, 90),
    width=1,
)
draw.text(
    (left_x + 12, mock_y + 84),
    "\"Annual SLA uptime guarantee is set to 99.9%",
    fill=(252, 165, 165),
    font=font_mock_code,
)
draw.text(
    (left_x + 12, mock_y + 102),
    " with a $50,000 breach indemnity cap.\"",
    fill=(252, 165, 165),
    font=font_mock_code,
)

# Right Column (Revised Version)
right_x = left_x + col_w + 20
draw.text((right_x, mock_y + 50), "2. REVISED REVISION (TARGET)", fill=(148, 163, 184), font=font_mock_title)
# Emerald highlight box
draw.rounded_rectangle(
    [(right_x, mock_y + 74), (right_x + col_w, mock_y + 120)],
    radius=6,
    fill=(6, 78, 59, 60),
    outline=(16, 185, 129, 90),
    width=1,
)
draw.text(
    (right_x + 12, mock_y + 84),
    "\"Annual SLA uptime guarantee is set to 95.0%",
    fill=(110, 231, 183),
    font=font_mock_code,
)
draw.text(
    (right_x + 12, mock_y + 102),
    " with zero liability / indemnity cap.\"",
    fill=(110, 231, 183),
    font=font_mock_code,
)

# Card Footer Impact Bar
draw.line([(mock_x, mock_y + 138), (mock_x + mock_w, mock_y + 138)], fill=(30, 41, 59, 255), width=1)
draw.text(
    (mock_x + 20, mock_y + 150),
    "AI EXPLANATION: SLA degraded by 4.9% and indemnification liability was eliminated. Severity: High Legal Exposure.",
    fill=(226, 232, 240),
    font=font_tag,
)

# ----------------- BOTTOM BAR -----------------
foot_y = 560

# Founder Tag (Professional Full Name as requested)
draw.ellipse([(60, foot_y + 3), (76, foot_y + 19)], fill=(37, 99, 235))
draw.text((64, foot_y + 4), "✓", fill=(255, 255, 255), font=font_tag)
draw.text((84, foot_y + 2), "Founder: Shree Navaneetha V R", fill=(241, 245, 249), font=font_founder)

# Feature Badges
feat_text = "•   Zero Data Retention   •   TLS 1.3 In-Memory   •   Private & Secure"
draw.text((410, foot_y + 3), feat_text, fill=(100, 116, 139), font=font_footer)

# Live URL
url_text = "changewatch-seven.vercel.app"
draw.text((W - 60 - 230, foot_y + 2), url_text, fill=(96, 165, 250), font=font_url)

# Save high-res PNG
output_path = r"C:\Projects\ChangeWatch\client\public\og-card.png"
base.convert("RGB").save(output_path, "PNG", quality=95)
print(f"Successfully generated high-res OpenGraph card at: {output_path}")
