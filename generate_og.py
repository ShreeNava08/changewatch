import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# 2x Super-sampling for razor-sharp Retina output
W, H = 2400, 1260
base = Image.new("RGBA", (W, H), (7, 10, 17, 255))
draw = ImageDraw.Draw(base)

# 1. Subtle Deep Obsidian Background Gradient
for y in range(H):
    factor = y / H
    r = int(7 + (13 - 7) * factor)
    g = int(10 + (18 - 10) * factor)
    b = int(17 + (30 - 17) * factor)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# 2. Multi-layer Glowing Mesh Gradients (Ambient lights)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)

# Top Right: Electric Indigo & Violet Glow
cx1, cy1 = 1950, 200
for rad in range(700, 0, -20):
    alpha = int(45 * (1 - (rad / 700) ** 1.6))
    glow_draw.ellipse(
        [(cx1 - rad, cy1 - rad), (cx1 + rad, cy1 + rad)],
        fill=(99, 102, 241, alpha),
    )

# Center Left: Deep Cyan & Blue Beam
cx2, cy2 = 400, 600
for rad in range(600, 0, -20):
    alpha = int(35 * (1 - (rad / 600) ** 1.6))
    glow_draw.ellipse(
        [(cx2 - rad, cy2 - rad), (cx2 + rad, cy2 + rad)],
        fill=(14, 165, 233, alpha),
    )

# Bottom Center-Right: Soft Emerald Ambient Glow
cx3, cy3 = 1800, 1100
for rad in range(500, 0, -20):
    alpha = int(30 * (1 - (rad / 500) ** 1.6))
    glow_draw.ellipse(
        [(cx3 - rad, cy3 - rad), (cx3 + rad, cy3 + rad)],
        fill=(16, 185, 129, alpha),
    )

base = Image.alpha_composite(base, glow)
draw = ImageDraw.Draw(base)

# 3. Micro Tech Grid Pattern
grid_color = (255, 255, 255, 12)
for x in range(80, W, 80):
    for y in range(80, H, 80):
        draw.point((x, y), fill=grid_color)
        draw.point((x + 1, y), fill=grid_color)
        draw.point((x, y + 1), fill=grid_color)
        draw.point((x + 1, y + 1), fill=grid_color)

# Fonts Setup
font_dir = r"C:\Windows\Fonts"
try:
    font_brand = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 60)
    font_badge = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 32)
    font_tag = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 26)
    font_eyebrow = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 28)
    font_h1 = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 84)
    font_sub = ImageFont.truetype(f"{font_dir}\\segoeui.ttf", 40)
    font_card_head = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 28)
    font_code_bold = ImageFont.truetype(f"{font_dir}\\consola.ttf", 30)
    font_crit_badge = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 24)
    font_footer_bold = ImageFont.truetype(f"{font_dir}\\segoeuib.ttf", 30)
    font_footer = ImageFont.truetype(f"{font_dir}\\segoeui.ttf", 28)
except Exception:
    font_brand = font_h1 = font_sub = font_card_head = font_code_bold = ImageFont.load_default()

# ----------------- TOP NAVBAR -----------------
nav_y = 100
left_margin = 120

# 1. Brand Badge [CW]
badge_size = 80
draw.rounded_rectangle(
    [(left_margin, nav_y), (left_margin + badge_size, nav_y + badge_size)],
    radius=20,
    fill=(37, 99, 235),
    outline=(129, 140, 248),
    width=2,
)
draw.text((left_margin + 17, nav_y + 19), "CW", fill=(255, 255, 255), font=font_badge)

# Brand Name
draw.text((left_margin + 105, nav_y + 6), "ChangeWatch", fill=(255, 255, 255), font=font_brand)

# Version Pill [v2.0]
tag_x = left_margin + 520
draw.rounded_rectangle(
    [(tag_x, nav_y + 20), (tag_x + 95, nav_y + 64)],
    radius=22,
    fill=(30, 58, 138, 120),
    outline=(96, 165, 250, 200),
    width=2,
)
draw.text((tag_x + 20, nav_y + 26), "v2.0", fill=(147, 197, 253), font=font_tag)

# Right: AI Engine Live Status Pill
engine_w = 480
engine_x = W - left_margin - engine_w
draw.rounded_rectangle(
    [(engine_x, nav_y + 12), (engine_x + engine_w, nav_y + 68)],
    radius=28,
    fill=(15, 23, 42, 220),
    outline=(16, 185, 129, 140),
    width=2,
)
# Glowing emerald dot
draw.ellipse(
    [(engine_x + 28, nav_y + 30), (engine_x + 48, nav_y + 50)],
    fill=(16, 185, 129),
)
draw.text(
    (engine_x + 64, nav_y + 23),
    "GROQ LPU • ENGINE ACTIVE",
    fill=(167, 243, 208),
    font=font_tag,
)

# ----------------- HERO HEADLINE -----------------
head_y = 240

# Eyebrow Pill
eyebrow_w = 680
draw.rounded_rectangle(
    [(left_margin, head_y), (left_margin + eyebrow_w, head_y + 52)],
    radius=26,
    fill=(30, 41, 59, 180),
    outline=(99, 102, 241, 140),
    width=2,
)
draw.text(
    (left_margin + 30, head_y + 11),
    "✦  AUTONOMOUS CONTRACT & REDLINE AUDIT",
    fill=(199, 210, 254),
    font=font_eyebrow,
)

# Headline Lines
draw.text(
    (left_margin, head_y + 75),
    "Stop Missing Hidden Contract Discrepancies.",
    fill=(255, 255, 255),
    font=font_h1,
)
draw.text(
    (left_margin, head_y + 175),
    "Instant AI Redlines & Risk Auditing in Seconds.",
    fill=(56, 189, 248),
    font=font_h1,
)

# Subtitle
draw.text(
    (left_margin, head_y + 285),
    "Pinpoint clause deletions, stealth price revisions & regulatory exposure with side-by-side redlines.",
    fill=(148, 163, 184),
    font=font_sub,
)

# ----------------- CENTERPIECE: GLASS SPLIT-DIFF CARD -----------------
card_x = left_margin
card_y = 690
card_w = W - (left_margin * 2)
card_h = 370

# Outer glass container
draw.rounded_rectangle(
    [(card_x, card_y), (card_x + card_w, card_y + card_h)],
    radius=24,
    fill=(15, 23, 42, 230),
    outline=(51, 65, 85, 220),
    width=2,
)

# Header strip
draw.line(
    [(card_x, card_y + 72), (card_x + card_w, card_y + card_h - 298)],
    fill=(30, 41, 59, 255),
    width=2,
)

# Mac-style window controls
draw.ellipse([(card_x + 36, card_y + 26), (card_x + 56, card_y + 46)], fill=(239, 68, 68))
draw.ellipse([(card_x + 68, card_y + 26), (card_x + 88, card_y + 46)], fill=(245, 158, 11))
draw.ellipse([(card_x + 100, card_y + 26), (card_x + 120, card_y + 46)], fill=(16, 185, 129))

draw.text(
    (card_x + 144, card_y + 23),
    "SPLIT REDLINE WORKBENCH  •  SUB-WORD TOKEN ALIGNMENT",
    fill=(148, 163, 184),
    font=font_card_head,
)

# Critical Risk Detected Badge in Mockup top-right
crit_w = 340
crit_x = card_x + card_w - crit_w - 30
draw.rounded_rectangle(
    [(crit_x, card_y + 16), (crit_x + crit_w, card_y + 56)],
    radius=20,
    fill=(220, 38, 38, 70),
    outline=(239, 68, 68, 220),
    width=2,
)
draw.text(
    (crit_x + 22, card_y + 22),
    "⚠  CRITICAL RISK DETECTED",
    fill=(254, 202, 202),
    font=font_crit_badge,
)

# Split Columns
col_gap = 40
inner_col_w = (card_w - 60 - col_gap) // 2

# Left Column: Base Document (Old)
col1_x = card_x + 30
col_top = card_y + 95
draw.text((col1_x, col_top), "1. ORIGINAL VERSION (BASE)", fill=(148, 163, 184), font=font_tag)

# Red deletion container
del_h = 160
draw.rounded_rectangle(
    [(col1_x, col_top + 40), (col1_x + inner_col_w, col_top + 40 + del_h)],
    radius=14,
    fill=(127, 29, 29, 70),
    outline=(239, 68, 68, 140),
    width=2,
)
draw.text(
    (col1_x + 24, col_top + 60),
    "L14  -  Annual SLA guarantee: 99.9% uptime",
    fill=(254, 202, 202),
    font=font_code_bold,
)
draw.text(
    (col1_x + 24, col_top + 105),
    "L15  -  Indemnity Liability Cap: $100,000 USD",
    fill=(254, 202, 202),
    font=font_code_bold,
)

# Right Column: Revised Document (New)
col2_x = col1_x + inner_col_w + col_gap
draw.text((col2_x, col_top), "2. REVISED VERSION (TARGET)", fill=(148, 163, 184), font=font_tag)

# Emerald addition container
draw.rounded_rectangle(
    [(col2_x, col_top + 40), (col2_x + inner_col_w, col_top + 40 + del_h)],
    radius=14,
    fill=(6, 78, 59, 70),
    outline=(16, 185, 129, 140),
    width=2,
)
draw.text(
    (col2_x + 24, col_top + 60),
    "R14  +  Annual SLA guarantee: 95.0% uptime",
    fill=(167, 243, 208),
    font=font_code_bold,
)
draw.text(
    (col2_x + 24, col_top + 105),
    "R15  +  Indemnity Liability Cap: EXCLUDED (ZERO)",
    fill=(167, 243, 208),
    font=font_code_bold,
)

# Bottom explanation inside card
draw.text(
    (card_x + 30, card_y + card_h - 45),
    "AI IMPACT AUDIT: SLA degraded by 4.9% and mutual indemnification was unilaterally eliminated.",
    fill=(226, 232, 240),
    font=font_tag,
)

# ----------------- FOOTER BAR -----------------
foot_y = 1120

# Founder Tag (Professional Full Name)
draw.ellipse([(left_margin, foot_y + 4), (left_margin + 36, foot_y + 40)], fill=(37, 99, 235))
draw.text((left_margin + 9, foot_y + 6), "✓", fill=(255, 255, 255), font=font_tag)

founder_str = "Founder & Architect: Shree Navaneetha V R"
draw.text((left_margin + 52, foot_y + 4), founder_str, fill=(248, 250, 252), font=font_footer_bold)

# Middle Security Tag
sec_str = "•  100% Stateless & In-Memory  •  Zero Data Retention  •"
draw.text((left_margin + 780, foot_y + 6), sec_str, fill=(148, 163, 184), font=font_footer)

# Live Domain URL
url_str = "changewatch-seven.vercel.app"
draw.text((W - left_margin - 380, foot_y + 4), url_str, fill=(96, 165, 250), font=font_footer_bold)

# Downscale to crisp 1200x630 using high-quality LANCZOS filter
final_img = base.convert("RGB").resize((1200, 630), Image.Resampling.LANCZOS)

output_path = r"C:\Projects\ChangeWatch\client\public\og-card.png"
final_img.save(output_path, "PNG", quality=98)
print(f"High-res 1200x630 card saved cleanly to {output_path}")
