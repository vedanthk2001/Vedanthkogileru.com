#!/usr/bin/env python3
"""Identity system for the two finalists: Unit Vector and V-sub-k.
Geometry is inherited verbatim from build.py; nothing is redrawn here."""
import pathlib, json
HERE = pathlib.Path(__file__).parent

SLATE="#0F172A"; INDIGO="#4F46E5"

# --- the two marks, exactly as built. `tight` crops the viewBox to the ink box so
# --- the SVG's bottom edge IS the V's vertex, which makes baseline alignment free.
UV_INNER = '''<g fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M6.192 9.439 L12 20.838 L17.808 9.439" stroke-width="2.6"/>
    <path class="ac" stroke="currentColor" d="M10.634 4.573 L12 1.892 L13.366 4.573" stroke-width="1.4"/>
  </g>'''
VK_INNER = '''<g transform="translate(0.6,-1.4)" fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M1.2 5.2 L7.9 19.5 L14.6 5.2" stroke-width="2.8"/>
    <g class="ac" stroke-width="2.1">
      <path d="M17.4 10 L17.4 19.5"/><path d="M16.9 16.3 L21.8 11.9"/>
      <path d="M16.9 16.3 L22 19.5"/>
    </g>
  </g>'''
UV_FAV = '''<g fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M6.926 10.309 L12 20.268 L17.074 10.309" stroke-width="3"/>
    <path class="ac" stroke="currentColor" d="M10.518 5.161 L12 2.252 L13.482 5.161" stroke-width="2"/>
  </g>'''
VK_FAV = '''<path d="M4.6 5.2 L12 20.6 L19.4 5.2" fill="none" stroke="currentColor"
     stroke-width="3" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6"/>'''

MARKS = {
 "uv": dict(name="Unit Vector", inner=UV_INNER, fav=UV_FAV,
            tight="4.733 0.35 14.534 23.35",     # ink box: caret top -> V vertex
            emh=1.4862, emh_stack=2.4219, ratio="1.35",   # V = 1.35 x cap height
            accent="the caret",
            extends="No. The caret has no counterpart in the name, so the accent lives in the mark only."),
 "vk": dict(name="V-sub-k", inner=VK_INNER, fav=VK_FAV,
            tight="0.254 2.533 22.905 18.867",
            emh=1.0905, emh_stack=1.5994, ratio="1.50",
            accent="the k",
            extends="Yes. The mark&#8217;s k and the name&#8217;s K are the same letter, so the accent can carry through the wordmark."),
}
def svg(vb, inner, cls="", extra=""):
    return f'<svg class="{cls}" viewBox="{vb}" fill="none" {extra}>{inner}</svg>'
def mark(k, tight=True, cls="mk"):
    m=MARKS[k]; return svg(m["tight"] if tight else "0 0 24 24", m["inner"], cls)
def favicon(k, cls="mk"):
    return svg("0 0 24 24", MARKS[k]["fav"], cls)

CARET=('<svg viewBox="9.848 0.35 4.304 4.847" fill="none">'
       '<path d="M10.634 4.573 L12 1.892 L13.366 4.573" stroke="currentColor" stroke-width="1.4" '
       'stroke-linejoin="miter" stroke-miterlimit="6"/></svg>')
WM      = '<span class="wm"><b>Vedanth</b> Kogileru</span>'
WM_HAT  = f'<span class="wm"><b><span class="vh">V{CARET}</span>edanth</b> Kogileru</span>'
WM_K    = '<span class="wm"><b>Vedanth</b> <span class="ktint">K</span>ogileru</span>'

HAND=json.loads((HERE/"hand_meta.json").read_text())
HAND_EM={"uv":1.35*0.727*(HAND["hand-02-unit-vector"]["box_h"]/HAND["hand-02-unit-vector"]["v_h"]),
         "vk":1.50*0.727*(HAND["hand-05-v-sub-k"]["box_h"]/HAND["hand-05-v-sub-k"]["v_h"])}
HAND_VB={"uv":HAND["hand-02-unit-vector"]["tight"],"vk":HAND["hand-05-v-sub-k"]["tight"]}
HAND_BODY={"uv":HAND["hand-02-unit-vector"],"vk":HAND["hand-05-v-sub-k"]}
def handmark(k, em=None, cls="mk"):
    m=HAND_BODY[k]
    return (f'<svg class="{cls}" style="height:{em or HAND_EM[k]}em" viewBox="{HAND_VB[k]}" fill="none">'
            f'<g fill="currentColor" transform="rotate({m["rot"]} 12 12)">{m["body"]}</g></svg>')

CSS = """
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#0F172A;font-family:Inter,ui-sans-serif,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased}
.wrap{max-width:1060px;margin:0 auto;padding:72px 32px 140px}
h1{font-size:34px;font-weight:800;letter-spacing:-.035em;margin:0 0 10px}
h2{font-size:12px;font-weight:700;letter-spacing:.12em;color:#64748B;margin:0 0 22px;
  padding-bottom:12px;border-bottom:1px solid #E2E8F0}
h3{font-size:15px;font-weight:700;letter-spacing:-.015em;margin:0 0 4px}
.sub{font-size:15px;line-height:1.65;color:#475569;max-width:64ch;margin:0 0 10px}
.sec{margin:66px 0 0}
.note{font-size:13px;line-height:1.6;color:#64748B;max-width:70ch;margin:10px 0 0}
.note b{color:#0F172A;font-weight:600}
.card{border:1px solid #E2E8F0;border-radius:16px;padding:30px 32px;background:#fff}
.card+.card{margin-top:18px}
.two>.card+.card,.two>.card{margin-top:0}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.tag{font-size:10px;font-weight:700;letter-spacing:.1em;color:#4F46E5;background:#EEF2FF;
  border:1px solid #E0E7FF;border-radius:999px;padding:3px 10px;display:inline-block;margin-bottom:16px}

/* ---- the lockup engine: baseline-aligned mark + wordmark ---- */
.lock{display:flex;align-items:baseline;gap:.3635em;color:#0F172A}
.lock svg.mk{width:auto;flex:none;color:inherit;overflow:visible}
.lock svg.mk path{stroke:currentColor}
.wm{font-weight:400;letter-spacing:-.02em;white-space:nowrap}
.wm b{font-weight:700}
.stack{display:flex;flex-direction:column;align-items:center;gap:.305em;color:#0F172A}
.stack svg.mk{width:auto;color:inherit}
.stack svg.mk path{stroke:currentColor}
.two-tone .ac{color:#4F46E5}
.on-dark{color:#fff}
.on-dark .two-tone .ac,.two-tone.on-dark .ac{color:#A5B4FC}
.ktint{color:#4F46E5}
.vh{position:relative;display:inline-block}
.vh > svg{position:absolute;left:50%;transform:translateX(calc(-50% + .01em));
  width:.175em;height:auto;bottom:1.01em;overflow:visible;color:inherit}
.two-tone .vh > svg{color:#4F46E5}
.hand svg{color:inherit}

.dark{background:#0F172A;border-color:#0F172A;color:#fff}
.row{display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap}
.cap{font-size:10px;color:#94A3B8;letter-spacing:.04em;margin-top:12px}

/* ---- icon family ---- */
.icons{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap}
.ic{display:flex;flex-direction:column;align-items:center;gap:8px}
.tile{display:flex;align-items:center;justify-content:center;background:#0F172A;color:#fff}
.tile.lt{background:#fff;color:#0F172A;border:1px solid #E2E8F0}
.tile.ind{background:#4F46E5;color:#fff}
.tile svg{display:block}
.r180{width:88px;height:88px;border-radius:20px} .r180 svg{width:56px;height:56px}
.r64 {width:64px;height:64px;border-radius:999px} .r64 svg{width:40px;height:40px}
.r32 {width:32px;height:32px;border-radius:7px}   .r32 svg{width:21px;height:21px}
.r16 {width:16px;height:16px;border-radius:4px}   .r16 svg{width:11px;height:11px}
.bare{background:none;border:0}
.b16{width:16px;height:16px} .b16 svg{width:16px;height:16px}
.b32{width:32px;height:32px} .b32 svg{width:32px;height:32px}

/* ---- context mocks ---- */
.chrome{border:1px solid #E2E8F0;border-radius:12px 12px 0 0;background:#F1F5F9;padding:9px 10px 0;overflow:hidden}
.chrome.dk{background:#1E293B;border-color:#334155}
.tab{display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:9px 9px 0 0;
  padding:8px 16px;font-size:12px;color:#334155;max-width:230px}
.chrome.dk .tab{background:#0F172A;color:#CBD5E1}
.tab svg{width:15px;height:15px;flex:none}
.hdr{border:1px solid #E2E8F0;border-radius:14px;padding:20px 26px;display:flex;
  align-items:center;justify-content:space-between}
.nav{display:flex;gap:26px;font-size:13px;font-weight:500;color:#64748B}
.bcard{width:330px;height:189px;border:1px solid #E2E8F0;border-radius:12px;padding:24px;
  display:flex;flex-direction:column;justify-content:space-between;background:#fff;position:relative;overflow:hidden}
.bcard.dk{background:#0F172A;border-color:#0F172A;color:#fff}
.bcard .meta{font-size:9.5px;line-height:1.7;color:#64748B;letter-spacing:.01em}
.bcard.dk .meta{color:#94A3B8}
.og{width:460px;height:241px;border:1px solid #E2E8F0;border-radius:12px;background:#fff;
  position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:0 44px}
.blur{position:absolute;border-radius:999px;filter:blur(42px);opacity:.75}
.sig{font-size:11px;line-height:1.75;color:#64748B}
.sig .nm{color:#0F172A;font-weight:600;font-size:12px}

/* ---- construction diagram ---- */
.constr{position:relative;display:inline-block}
.gl{position:absolute;left:0;right:0;height:1px;background:#C7D2FE}
.gv{position:absolute;top:0;bottom:0;width:1px;background:#C7D2FE}
.dim{position:absolute;font-size:9px;color:#4F46E5;letter-spacing:.06em;font-weight:600}
.clearbox{position:absolute;border:1px dashed #C7D2FE;pointer-events:none}

table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-size:10px;font-weight:700;letter-spacing:.09em;color:#94A3B8;
  padding:0 14px 9px 0;border-bottom:1px solid #E2E8F0}
td{padding:11px 14px 11px 0;border-bottom:1px solid #F1F5F9;color:#334155;vertical-align:top}
td b{color:#0F172A;font-weight:600}
td code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#0F172A;
  background:#F8FAFC;border:1px solid #E2E8F0;border-radius:4px;padding:1px 5px}
.dont{color:#9F1239}
ul{margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.75;color:#334155}
li{margin-bottom:5px}
li b{color:#0F172A;font-weight:600}
"""

def lockup(k, px, tone="", wm=None):
    """uv carries the hat on the V of 'Vedanth' and ships no separate mark.
    vk cannot do that -- a k subscripted onto Vedanth's V spells nothing -- so it
    keeps a mark, and links to the name through the tinted K instead."""
    m=MARKS[k]
    if k=="uv":
        return f'<div class="lock {tone}" style="font-size:{px}px">{wm or WM_HAT}</div>'
    return (f'<div class="lock {tone}" style="font-size:{px}px">'
            f'<svg class="mk" style="height:{m["emh"]}em" viewBox="{m["tight"]}" fill="none">{m["inner"]}</svg>'
            f'{wm or WM}</div>')
def stacked(k, px, tone="", wm=None):
    """Stacked uses the standalone mark, so the wordmark below drops the hat --
    the accent appears exactly once in any lockup."""
    m=MARKS[k]
    return (f'<div class="stack {tone}" style="font-size:{px}px">'
            f'<svg class="mk" style="height:{m["emh_stack"]}em" viewBox="{m["tight"]}" fill="none">{m["inner"]}</svg>'
            f'{wm or WM}</div>')

B=[]
B.append('<div class="wrap">')
B.append('<h1>Identity system</h1>')
B.append('<p class="sub">Two finalists carried through to a working system: wordmark, lockups, '
         'icon family and the rules that keep them consistent. Every ratio below is expressed in <b>C</b>, '
         'the cap height of the wordmark, so the whole thing scales from one number.</p>')

# ---------------------------------------------------------------- 1 wordmark
B.append('<div class="sec"><h2>01 &nbsp;THE WORDMARK</h2>')
B.append('<p class="sub">Both marks are the same idea: one dominant letterform with a smaller, lighter one '
         'attached. The name is set to repeat that relationship &mdash; <b>Vedanth</b> at 700, Kogileru at 400, '
         'identical size, identical colour. The contrast is carried by weight alone, which is quieter than a '
         'colour split and survives being printed in one ink.</p>')
B.append('<div class="card"><div style="font-size:44px;letter-spacing:-.02em"><span class="wm"><b>Vedanth</b> Kogileru</span></div>')
B.append('<div class="cap">PRIMARY &middot; Inter 700 / 400 &middot; tracking &minus;0.02em &middot; slate-900</div>')
B.append('<div style="margin-top:30px;font-size:19px;letter-spacing:.1em;font-weight:600">VEDANTH KOGILERU</div>')
B.append('<div class="cap">ALTERNATE &middot; Inter 600 &middot; uppercase &middot; tracking +0.10em &mdash; for footers, '
         'email signatures and anywhere under ~130px wide, where the 400 weight starts to break up</div></div>')
B.append('<p class="note"><b>Why not extrabold.</b> Your headlines are Inter 800 and should stay there. '
         'A logotype sitting next to a geometric mark wants to be a step quieter than the loudest thing on the page, '
         'or the mark stops being the focal point. 700 is that step.</p></div>')

# ---------------------------------------------------------------- 2 lockups
B.append('<div class="sec"><h2>02 &nbsp;PRIMARY LOCKUP</h2>')
B.append('<p class="sub">The two marks take opposite routes here, and it is the most important difference between them.</p>')
B.append('<p class="sub"><b>Unit Vector puts the hat straight onto the V of &ldquo;Vedanth&rdquo;</b> and ships no separate '
         'mark alongside it. Setting the mark next to the name meant drawing a V twice &mdash; once as a logo, once as the '
         'first letter of the word &mdash; and the second one always read as a duplicate. Moving the caret onto the name '
         'removes the repetition and sharpens the idea: it is no longer a mark that means &ldquo;unit vector&rdquo;, it is '
         '<i>your name</i> that is the unit vector. The caret sits at <b>0.175&nbsp;em</b> wide, <b>1.01&nbsp;em</b> above '
         'the baseline &mdash; clearing the cap line by 20% of cap height &mdash; and optically centred on the V&#8217;s ink rather than its advance width. The standalone mark uses the same 20% so the two forms match.</p>')
B.append('<p class="sub"><b>V-sub-k cannot do this.</b> Subscripting a k onto the V of Vedanth spells nothing, so the mark '
         'stays a separate object at <b>1.50&nbsp;C</b> and links to the name through colour instead &mdash; the mark&#8217;s '
         'k and the K of Kogileru take the same indigo.</p>')
for k,m in MARKS.items():
    B.append(f'<div class="card"><span class="tag">{m["name"].upper()}</span>')
    B.append('<div class="row">'+lockup(k,42)+'</div>')
    B.append('<div class="row" style="margin-top:34px">'+lockup(k,26)+lockup(k,17)+lockup(k,13)+'</div>')
    if k=="uv":
        B.append('<div class="row" style="margin-top:34px;align-items:flex-end">'
                 f'<svg class="mk" style="height:74px" viewBox="{m["tight"]}" fill="none">{m["inner"]}</svg>'
                 f'<svg class="mk" style="height:40px" viewBox="{m["tight"]}" fill="none">{m["inner"]}</svg>'
                 '</div><div class="cap">THE MARK STILL EXISTS &mdash; used alone for the favicon, the avatar, and anywhere '
                 'the name is already on screen. It never appears beside the hatted wordmark: the accent shows up once, or not at all.</div>')
    B.append('<div class="cap">42 / 26 / 17 / 13 px &mdash; 13px is the floor for the primary; below that use the uppercase alternate</div>')
    B.append('<div class="row" style="margin-top:34px">'+(lockup(k,30,"two-tone") if k=="uv" else lockup(k,30,"two-tone",WM_K))+'</div>')
    B.append(f'<div class="cap">TWO-COLOUR &middot; indigo on {m["accent"]} only &middot; reserve for the site header and OG image, never below 24px</div>')
    B.append('</div>')
B.append('<div class="card dark"><div class="row">'
         + lockup("uv",34,"on-dark") + '<div style="width:20px"></div>' + lockup("vk",34,"on-dark") + '</div>'
         '<div class="cap" style="color:#64748B">On near-black the whole lockup goes white. The accent shifts to indigo-300 '
         '(#A5B4FC), not indigo-600 &mdash; indigo-600 on slate-900 is too close in value to read.</div></div></div>')

# ---------------------------------------------------------------- 3 stacked
B.append('<div class="sec"><h2>03 &nbsp;STACKED LOCKUP</h2>')
B.append('<p class="sub">For square spaces: avatars with room for a name, the back of a card, a centred footer. '
         'The mark grows to <b>2.2&nbsp;C</b> because it now has to hold the composition on its own, and the gap '
         'below it is <b>0.42&nbsp;C</b>, measured cap line to cap line.</p>')
B.append('<div class="two">')
for k,m in MARKS.items():
    B.append(f'<div class="card" style="text-align:center"><span class="tag">{m["name"].upper()}</span>'
             f'<div style="padding:14px 0 6px">{stacked(k,22)}</div></div>')
B.append('</div></div>')

# ---------------------------------------------------------------- 4 construction
B.append('<div class="sec"><h2>04 &nbsp;CONSTRUCTION &amp; CLEAR SPACE</h2>')
B.append('<div class="card"><div class="row" style="align-items:flex-start;gap:52px">')
B.append('<div><div style="border:1px dashed #C7D2FE;padding:calc(1.5 * 0.727 * 34px * 0.5);display:inline-block">'
         + lockup("vk",34) + '</div>'
         '<div class="cap">Clear space = 0.5 &times; the V&#8217;s height, on all four sides. Nothing enters it &mdash; '
         'not type, not a rule, not the edge of the page.</div></div>')
B.append('<div style="flex:1;min-width:290px"><table>'
         '<tr><th>MEASURE</th><th>VALUE</th></tr>'
         '<tr><td><b>C</b></td><td>cap height of the wordmark (0.727 &times; font-size in Inter)</td></tr>'
         '<tr><td><b>V height</b></td><td>1.35 C horizontal (Unit Vector) &middot; 1.50 C horizontal (V-sub-k)</td></tr>'
         '<tr><td><b>V height</b></td><td>2.20 C &mdash; stacked lockup</td></tr>'
         '<tr><td><b>Gap</b></td><td>0.5 C horizontal &middot; 0.42 C stacked</td></tr>'
         '<tr><td><b>Baseline</b></td><td>V vertex sits on the wordmark baseline, overshooting it exactly as Inter&#8217;s own V does</td></tr>'
         '<tr><td><b>Clear space</b></td><td>0.5 &times; V height, all sides</td></tr>'
         '<tr><td><b>Min width</b></td><td>13px lockup &middot; 16px mark alone</td></tr>'
         '</table></div>')
B.append('</div></div></div>')

# ---------------------------------------------------------------- 5 icons
B.append('<div class="sec"><h2>05 &nbsp;ICON FAMILY</h2>')
B.append('<p class="sub">Two jobs, two treatments. In a <b>browser tab</b> the icon has to survive light and dark chrome, '
         'so it ships as a bare mark in an SVG that flips colour with <code>prefers-color-scheme</code> &mdash; quieter, and it '
         'matches the site&#8217;s white ground. On a <b>home screen or launcher</b> a bare mark looks unfinished and iOS masks '
         'the corners anyway, so those ship as a slate tile.</p>')
for k,m in MARKS.items():
    B.append(f'<div class="card"><span class="tag">{m["name"].upper()}</span><div class="icons">')
    for cls,lbl in [("r180","apple-touch 180"),("r64","avatar 64"),("r32","tile 32"),("r16","tile 16")]:
        B.append(f'<div class="ic"><div class="tile {cls}">{favicon(k)}</div><div class="cap">{lbl}</div></div>')
    B.append('<div style="width:10px"></div>')
    for cls,lbl in [("b32","bare 32"),("b16","bare 16")]:
        B.append(f'<div class="ic"><div class="tile lt bare {cls}" style="color:#0F172A">{favicon(k)}</div><div class="cap">{lbl}</div></div>')
    B.append(f'<div class="ic"><div class="tile ind r32">{favicon(k)}</div><div class="cap">indigo 32</div></div>')
    B.append('</div>')
    B.append('<div style="margin-top:26px;display:flex;gap:16px;flex-wrap:wrap">')
    B.append(f'<div><div class="chrome"><div class="tab">{favicon(k)}<span>Vedanth Kogileru</span></div></div>'
             '<div class="cap">light chrome &middot; bare mark, slate-900</div></div>')
    B.append(f'<div><div class="chrome dk"><div class="tab" style="color:#CBD5E1">'
             f'<span style="color:#fff;display:flex">{favicon(k)}</span><span>Vedanth Kogileru</span></div></div>'
             '<div class="cap">dark chrome &middot; same file, flipped to white</div></div>')
    B.append('</div></div>')
B.append('<p class="note"><b>The indigo tile is a trap.</b> It is on the sheet so you can see it and reject it. '
         'Indigo-600 is your accent, not your ground &mdash; the moment the icon becomes a solid indigo square you are '
         'the AI-startup purple glow the rest of the site is carefully avoiding.</p></div>')

# ---------------------------------------------------------------- 6 in context
B.append('<div class="sec"><h2>06 &nbsp;IN CONTEXT</h2>')
for k,m in MARKS.items():
    B.append(f'<div class="card"><span class="tag">{m["name"].upper()}</span>')
    # site header
    B.append('<div class="hdr">'+lockup(k,19,"two-tone")+
             '<div class="nav"><span>Work</span><span>Writing</span><span>Contact</span></div></div>')
    B.append('<div class="cap">SITE HEADER &middot; two-colour, 19px</div>')
    # cards + og
    B.append('<div class="row" style="margin-top:30px;align-items:flex-start">')
    B.append('<div><div class="bcard">'+lockup(k,17)+
             '<div class="meta">AI Product Manager, Ignosis<br>vedanth.kogileru@ignosis.ai<br>vedanthkogileru.com</div>'
             '</div><div class="cap">CARD &middot; one colour</div></div>')
    B.append('<div><div class="bcard dk">'+lockup(k,17,"on-dark")+
             '<div class="meta">AI Product Manager, Ignosis<br>vedanth.kogileru@ignosis.ai<br>vedanthkogileru.com</div>'
             '</div><div class="cap">CARD &middot; reversed</div></div>')
    B.append(f'<div><div class="ic"><div class="tile r64">{favicon(k)}</div><div class="cap">AVATAR</div></div></div>')
    B.append('</div>')
    # og
    B.append('<div class="row" style="margin-top:30px;align-items:flex-start">')
    B.append('<div><div class="og">'
             '<div class="blur" style="width:230px;height:230px;background:#EEF2FF;left:-60px;top:-70px"></div>'
             '<div class="blur" style="width:200px;height:200px;background:#F0F9FF;right:-50px;bottom:-60px"></div>'
             '<div style="position:relative">'+lockup(k,25,"two-tone")+
             '<div style="margin-top:16px;font-size:14px;color:#475569;letter-spacing:-.01em">'
             'and my job is to absorb entropy.</div></div>'
             '</div><div class="cap">OG IMAGE 1200&times;630 &middot; shown at 38%</div></div>')
    B.append('<div><div style="border:1px solid #E2E8F0;border-radius:12px;padding:20px 22px">'
             + lockup(k,14) +
             '<div class="sig" style="margin-top:10px"><span class="nm">Vedanth Kogileru</span><br>'
             'AI Product Manager &middot; Ignosis<br>vedanthkogileru.com</div></div>'
             '<div class="cap">EMAIL SIGNATURE &middot; 14px</div></div>')
    B.append('</div></div>')
B.append('</div>')

# ---------------------------------------------------------------- 7 handwritten
B.append('<div class="sec"><h2>07 &nbsp;HANDWRITTEN VARIANT</h2>')
B.append('<p class="sub">Physics gets done on paper, so both marks have a written form. These are not the geometric '
         'paths with a wobble filter on them &mdash; each stroke is a variable-width pen outline: a splined centreline '
         'carrying smooth low-frequency noise, a pressure profile that peaks on the down-stroke and releases on the '
         'up-stroke the way a hand actually moves, and the two offset edges closed into a single filled path. That is why '
         'the weight changes through the stroke instead of staying dead even.</p>')
B.append('<div class="two">')
for k,label in (("uv","UNIT VECTOR"),("vk","V-SUB-K")):
    B.append(f'<div class="card hand" style="text-align:center"><span class="tag">{label} &middot; WRITTEN</span>'
             f'<div style="padding:12px 0 4px">{handmark(k, em=None, cls="")}</div></div>'.replace(
             'style="height:'+str(HAND_EM[k])+'em"','style="height:120px"'))
B.append('</div>')
B.append('<div class="card hand"><div class="row" style="gap:44px">')
B.append('<div>'
         f'<div class="lock" style="font-size:30px">{handmark("uv")}{WM}</div>'
         '<div class="cap">The written mark takes the hat, so the wordmark drops it. Accent still appears once.</div></div>')
B.append('<div>'
         f'<div class="lock" style="font-size:30px">{handmark("vk")}{WM_K}</div>'
         '<div class="cap">Written mark, typeset name &mdash; the signature pairing.</div></div>')
B.append('</div></div>')
B.append('<div class="card dark hand"><div class="row" style="gap:44px;align-items:center">'
         f'<div class="lock on-dark" style="font-size:30px">{handmark("uv")}{WM}</div>'
         f'<div class="lock on-dark" style="font-size:30px">{handmark("vk")}{WM}</div>'
         '</div><div class="cap" style="color:#64748B">Reversed. The pen weight holds up because the thin passages are '
         'still ~1.2 units wide at the thinnest point.</div></div>')
B.append('<div class="card hand"><div class="row" style="align-items:flex-end;gap:26px">'
         f'{handmark("uv", em=None, cls="")}{handmark("vk", em=None, cls="")}'
         '</div><div class="cap">At 34px and below the pressure variation flattens out and it stops reading as written. '
         'That is the floor.</div></div>')
B.append('<p class="note"><b>Where it goes:</b> margin marks, slide dividers, a sticker, the 404 page, an annotation next '
         'to a chart &mdash; anywhere the voice is &ldquo;working notes&rdquo; rather than &ldquo;brand&rdquo;. '
         '<b>Where it does not:</b> the favicon, the app icons, the site header, or anything under 34px. It is a second '
         'voice, not a replacement, and it stays <b>one colour</b> &mdash; a pen does not change ink halfway through a stroke.</p></div>')

# ---------------------------------------------------------------- 8 rules
B.append('<div class="sec"><h2>08 &nbsp;RULES</h2><div class="two">')
B.append('<div class="card"><h3>Do</h3><ul>'
         '<li>Ship <b>one colour</b> by default. Two-colour is for the header and the OG image only.</li>'
         '<li><b>The accent appears exactly once.</b> Unit Vector: on the wordmark&#8217;s V, or on the standalone mark &mdash; never both inside one lockup.</li>'
         '<li>Let the mark stand alone wherever the name is already on screen: favicon, avatar, the site&#8217;s own header once you are past the fold.</li>'
         '<li>Switch to the <b>uppercase alternate</b> below 130px of width, before the 400 weight starts to break.</li>'
         '<li>Outline the type before you export any final lockup. Live text will substitute on someone else&#8217;s machine.</li>'
         '</ul></div>')
B.append('<div class="card"><h3 class="dont">Don&#8217;t</h3><ul>'
         '<li class="dont">Put the mark in a coloured circle or an indigo square. The ground stays white or slate-900.</li>'
         '<li class="dont">Set the wordmark in 800 to &ldquo;match the headlines&rdquo; &mdash; it swallows the mark.</li>'
         '<li class="dont">Scale the mark independently of the wordmark. The ratio is fixed per mark &mdash; 1.35 C or 1.50 C.</li>'
         '<li class="dont">Add a tagline inside the clear space. &ldquo;absorb entropy&rdquo; is a line of copy, not part of the logo.</li>'
         '<li class="dont">Use indigo-600 on slate-900. It goes muddy &mdash; indigo-300 or nothing.</li>'
         '</ul></div></div></div>')

# ---------------------------------------------------------------- 8 how they differ
B.append('<div class="sec"><h2>09 &nbsp;WHICH ONE, AS A SYSTEM</h2>')
B.append('<p class="sub">The marks scored close on their own. As identities they behave differently, and this is the part that '
         'should decide it.</p>')
B.append('<div class="card"><table>'
         '<tr><th></th><th>UNIT VECTOR</th><th>V-SUB-K</th></tr>'
         '<tr><td><b>Accent extends into the name</b></td>'
         '<td><b>Yes, structurally.</b> The caret moves onto the V of &ldquo;Vedanth&rdquo; and the separate mark leaves the lockup entirely.</td>'
         '<td>Yes. The mark&#8217;s k and the name&#8217;s K are the same letter, so the accent can carry through &mdash; '
         '<span style="font-weight:600"><b style="font-weight:700">Vedanth</b> <span class="ktint">K</span>ogileru</span>.</td></tr>'
         '<tr><td><b>Lockup proportion</b></td>'
         '<td>Tall. The caret pushes the mark 0.4&nbsp;C above the cap line, so the lockup needs vertical room and a '
         'generous header.</td>'
         '<td>Wide. The mark is 1.21:1 and sits entirely within cap height, so it drops into a tight header or a '
         'signature without fuss.</td></tr>'
         '<tr><td><b>Favicon</b></td>'
         '<td>Keeps its accent &mdash; a marked V &mdash; but stops resolving as a caret below ~20px.</td>'
         '<td>Drops to a bare V. Clean, but the idea does not survive the reduction at all.</td></tr>'
         '<tr><td><b>Repeats the name</b></td>'
         '<td>None. The mark is absorbed into the word; the V is drawn once.</td>'
         '<td>The V is drawn twice &mdash; as the mark, then to start &ldquo;Vedanth&rdquo; &mdash; and the k again in &ldquo;Kogileru&rdquo;.</td></tr>'
         '<tr><td><b>Case mismatch</b></td><td>None.</td>'
         '<td>Mark uses lowercase k, the name uses uppercase K. Nobody will file a complaint, but it is there.</td></tr>'
         '</table></div>')
B.append('<p class="note"><b>Straight answer, revised.</b> Earlier in this build I had V-sub-k ahead as a system, on the '
         'grounds that its accent could run through the wordmark and Unit Vector&#8217;s could not. Putting the hat directly '
         'on the V of &ldquo;Vedanth&rdquo; inverts that. Unit Vector now has the tighter system: one accent, no repeated '
         'letter, a wordmark that <i>is</i> the idea rather than sitting beside it, and a standalone mark that still holds '
         'at 16px. V-sub-k is left doing the exact thing you objected to &mdash; drawing a V, then drawing it again to start '
         'the name &mdash; and colour-matching a K is a weaker tie than a diacritic that changes what the word means. '
         '<b>Unit Vector.</b></p></div>')

# ---------------------------------------------------------------- 9 files
B.append('<div class="sec"><h2>10 &nbsp;FILES TO SHIP</h2>')
B.append('<div class="card"><table>'
         '<tr><th>FILE</th><th>WHAT</th></tr>'
         '<tr><td><code>public/favicon.svg</code></td><td>Bare mark, slate-900, with a <code>prefers-color-scheme: dark</code> '
         'block flipping it to white. Modern browsers prefer this over the .ico.</td></tr>'
         '<tr><td><code>public/favicon.ico</code></td><td>16 / 32 / 48, slate tile with white mark &mdash; the fallback for '
         'anything that ignores the SVG.</td></tr>'
         '<tr><td><code>public/apple-touch-icon.png</code></td><td>180&times;180, slate tile, full bleed. iOS applies its own '
         'corner mask, so no radius in the file.</td></tr>'
         '<tr><td><code>public/icon-192.png</code> &middot; <code>icon-512.png</code></td><td>Slate tile. Keep the mark inside '
         'the middle 80% so Android&#8217;s maskable crop cannot clip it.</td></tr>'
         '<tr><td><code>public/og.png</code></td><td>1200&times;630, white ground, two-colour lockup + tagline. '
         '<code>layout.tsx</code> has an <code>openGraph</code> block already but no image &mdash; it needs one.</td></tr>'
         '<tr><td><code>logo/svg/lockup-*.svg</code></td><td>Horizontal and stacked, type outlined, for decks and print.</td></tr>'
         '</table></div>')
B.append('<p class="note">Your <code>layout.tsx</code> already declares all of these except the OG image, so swapping the '
         'artwork is a file replacement, not a code change.</p></div>')

B.append('</div>')

html=('<!doctype html><html lang="en"><head><meta charset="utf-8">'
      '<meta name="viewport" content="width=device-width,initial-scale=1">'
      '<title>Vedanth Kogileru &mdash; identity system</title>'
      '<link rel="preconnect" href="https://fonts.googleapis.com">'
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
      f'<style>{CSS}</style></head><body>'+''.join(B)+'</body></html>')
(HERE/"identity.html").write_text(html)
print("wrote identity.html", len(html), "bytes")
