#!/usr/bin/env python3
"""Generates the 5 logo directions as SVG + a contact sheet.
All geometry on a 24-unit grid (1.5 units = 1px at 16px favicon size)."""
import os, pathlib

SLATE  = "#0F172A"
INDIGO = "#4F46E5"
HERE   = pathlib.Path(__file__).parent

# ---------------------------------------------------------------- marks
MARKS = [
{
 "id":"01-gravity-well", "n":"01", "name":"Gravity Well", "basis":"V",
 "idea":"Not straight lines &mdash; a real well. The arms come in shallow at the rim (62&deg; off vertical) and steepen continuously to 26&deg; at the bottom, which is the profile of an actual 1/r potential. The ball is the mass sitting at the bottom of the well it makes: the rubber&#8209;sheet picture every physicist has drawn, reduced to a letter.",
 "vb":"0 0 24 24",
 "hero":'''<g transform="translate(0,-1.2)" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="butt" stroke-linejoin="round">
    <path d="M1.2 4 C4.73 5.88 8.93 13.11 12 19.4 C15.07 13.11 19.27 5.88 22.8 4"/>
    <circle class="accent" cx="12" cy="19.4" r="2.6" fill="currentColor" stroke="none"/>
  </g>''',
 "favvb":"0 0 24 24",
 "fav":'''<g transform="translate(0,-1.1)" fill="none" stroke="currentColor" stroke-width="3.1" stroke-linecap="butt" stroke-linejoin="round">
    <path d="M1.2 4.2 C4.73 6.05 8.93 13.2 12 19.4 C15.07 13.2 19.27 6.05 22.8 4.2"/>
    <circle class="accent" cx="12" cy="19.4" r="2.95" fill="currentColor" stroke="none"/>
  </g>''',
 "reduce":"Nothing deleted &mdash; two shapes only. Stroke 2.6&rarr;3.1, ball r 2.6&rarr;2.95 so it still reads as a distinct mass and not a thickened point. The curvature flattens out below ~20px and it settles into a V with a heavy round base.",
 "reads":"a V with a solid round bottom",
 "colour":"One colour, both elements. Second colour on the <b>ball only</b> &mdash; the mass is what the curve is <i>about</i>, so it is the one thing that earns the accent.",
 "fail":"A ball resting <i>inside</i> the curve was the obvious version and it does not work: solved numerically, a circle tangent to both walls cannot sit lower than y&nbsp;&asymp;&nbsp;12 on a 24 grid &mdash; it floats at mid&#8209;height and reads as a bullet, not a particle. Hence the ball as the base. The remaining risk is a wine glass or a plumb bob.",
},
{
 "id":"02-unit-vector", "n":"02", "name":"Unit Vector", "basis":"V",
 "idea":"V with a caret over it is v&#770;, a unit vector &mdash; and the caret that makes it a unit vector is itself a V, at exactly the same 27&deg;. It is set at 30% of the V, a little over half its stroke weight, and clears the cap line by 20% of the V&#8217;s height, so it reads as a modifier rather than a second letter.",
 "vb":"0 0 24 24",
 "hero":'''<g transform="translate(0,-1.27)" fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M6.192 9.439 L12 20.838 L17.808 9.439" stroke-width="2.6"/>
    <path class="accent" stroke="currentColor" d="M10.634 4.573 L12 1.892 L13.366 4.573" stroke-width="1.4"/>
  </g>''',
 "favvb":"0 0 24 24",
 "fav":'''<g fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M6.926 10.309 L12 20.268 L17.074 10.309" stroke-width="3"/>
    <path class="accent" stroke="currentColor" d="M10.518 5.161 L12 2.252 L13.482 5.161" stroke-width="2"/>
  </g>''',
 "reduce":"Nothing deleted. The caret cannot hold its shape at 16px at hero proportions, so the favicon carries it at 78% of full size against the hero&#8217;s 70%, and at stroke 2.0 against 1.4 &mdash; optical weight, not mathematical scale. Below about 20px it stops resolving as a caret and lands as a mark above the V, which still reads as an accent.",
 "reads":"a V with an accent over it",
 "colour":"One colour. Second colour on the <b>caret only</b> &mdash; the hat is the modifier, so colour it as one.",
 "fail":"Non&#8209;physicists read a Slavic h&aacute;&#269;ek (v&#780;) and assume a typo or a language switcher. At 27&deg; the gap is only ~1px at favicon size, so a heavy&#8209;handed hinting pass can weld the two shapes into a lozenge.",
},
{
 "id":"03-ground-state", "n":"03", "name":"Ground State", "basis":"V",
 "idea":"Horizontal lines drawn inside a well are its quantised energy levels &mdash; the states a particle is allowed to occupy. They shorten and thicken as they descend, and the bottom one is the ground state: the lowest energy the system can hold once everything absorbable has been absorbed.",
 "vb":"0 0 24 24",
 "hero":'''<g transform="translate(0,-1.3)" fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M1.88 4.6 L12 20.8 L22.12 4.6" stroke-width="2.6"/>
    <g class="accent" stroke="currentColor">
      <path d="M7.5 8.8 L16.5 8.8" stroke-width="1.5"/>
      <path d="M9.7 13.2 L14.3 13.2" stroke-width="2.1"/>
    </g>
  </g>''',
 "favvb":"0 0 24 24",
 "fav":'''<g transform="translate(0,-1.3)" fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M1.88 4.6 L12 20.8 L22.12 4.6" stroke-width="3"/>
    <path class="accent" stroke="currentColor" d="M9.9 12.8 L14.1 12.8" stroke-width="2.8"/>
  </g>''',
 "reduce":"The excited level is deleted; only the ground state survives, thickened 2.1&rarr;2.8 and lifted 0.4 so it keeps ~0.75px of white on each side of the counter. V stroke 2.6&rarr;3.0. Two shapes.",
 "reads":"a V with one heavy bar low inside it",
 "colour":"One colour. Second colour on the <b>levels</b>, not the V &mdash; the well is the container, the levels are the state.",
 "fail":"Weakest wit of the three: a physicist reads energy eigenstates instantly, everyone else reads decoration, and there is no second layer for them to find. Two stacked horizontals inside a shape is also the signal&#8209;strength glyph, and one crossbar low in a V edges toward an upside&#8209;down A.",
},
{
 "id":"04-rotated-vertex", "n":"04", "name":"Rotated Vertex", "basis":"VK",
 "idea":"A K <i>is</i> a V rotated 90&deg; against a vertical, so the monogram is one path definition used twice &mdash; and the junction is a scattering vertex: one worldline in, two out.",
 "vb":"0 0 30 24",
 "hero":'''<g transform="translate(0.8,0)" fill="none" stroke="currentColor" stroke-width="2.8"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M1.5 8.72 L7.2 20.4 L12.9 8.72"/>
    <path d="M16.6 8.72 L16.6 20.4"/>
    <path class="accent" stroke="currentColor" d="M28.28 8.86 L16.6 14.56 L28.28 20.26" stroke-linejoin="round"/>
    <circle cx="16.6" cy="14.56" r="1.8" fill="currentColor" stroke="none"/>
  </g>''',
 "favvb":"0 0 24 24",
 "fav":'''<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="butt">
    <path d="M8.5 5 L8.5 21"/>
    <path class="accent" stroke="currentColor" d="M20.76 7.01 L8.5 13 L20.76 18.99" stroke-linejoin="round"/>
    <circle cx="8.5" cy="13" r="2.1" fill="currentColor" stroke="none"/>
  </g>''',
 "reduce":"The V is deleted. What survives is the K &mdash; which by construction still <i>contains</i> the V, rotated. Stroke 2.8&rarr;3.0, junction dot r 1.8&rarr;2.1. The cost is real and unavoidable: your browser tab shows a K.",
 "reads":"a K with a heavy junction",
 "colour":"One colour. Second colour on the <b>rotated instance only</b> &mdash; colouring the exact strokes that are &ldquo;the V, again&rdquo; is what makes a stranger notice the trick. Best colour logic of the five.",
 "fail":"A two&#8209;letter VK in blue&#8209;violet is VKontakte, and indigo&#8209;600 makes that collision worse. The rotation also forces one compromise: matching the V and K arm length exactly is what makes the K unusually wide.",
},
{
 "id":"05-v-sub-k", "n":"05", "name":"V-sub-k", "basis":"VK",
 "idea":"A small k tucked into the wedge under the V&#8217;s right arm reads first as a tidy monogram and second as V<sub>k</sub> &mdash; potential energy in k&#8209;space, where k is also the spring constant, the wavenumber, and Boltzmann&#8217;s constant depending on which degree you are holding.",
 "vb":"0 0 24 24",
 "hero":'''<g transform="translate(0.6,-1.4)" fill="none" stroke="currentColor"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6">
    <path d="M1.2 5.2 L7.9 19.5 L14.6 5.2" stroke-width="2.8"/>
    <g class="accent" stroke="currentColor" stroke-width="2.1">
      <path d="M17.4 10 L17.4 19.5"/>
      <path d="M16.9 16.3 L21.8 11.9"/>
      <path d="M16.9 16.3 L22 19.5"/>
    </g>
  </g>''',
 "favvb":"0 0 24 24",
 "fav":'''<path d="M4.6 5.2 L12 20.6 L19.4 5.2" fill="none" stroke="currentColor" stroke-width="3"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="6"/>''',
 "reduce":"The k is deleted outright &mdash; it cannot survive 16px and pretending otherwise is how this dies. Bare V, stroke 2.8&rarr;3.0, narrowed to 25&deg; to match the family. Monogram at card and avatar size, V at tab size: one system, two states.",
 "reads":"a clean bare V &mdash; and nothing else",
 "colour":"One colour. Second colour on the <b>k</b> &mdash; subscripts are conventionally set lighter, so colour does the typographic work.",
 "fail":"The favicon is a plain V with no second layer left in it, so the whole idea only lives above 32px. It also reads as an algebra variable rather than a mark, which tips from technical into academic.",
},
]

CURRENT = {
 "id":"00-current", "n":"00", "name":"Current mark", "basis":"VK",
 "vb":"0 0 100 100",
 "hero":'''<g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 32 L32 68 L47 32"/><path d="M64 32 L64 68"/>
    <path d="M64 50 L84 32"/><path d="M64 50 L84 68"/>
  </g>''',
}

# ---------------------------------------------------------------- svg files
def svg_file(vb, inner, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'color="{SLATE}" role="img" aria-label="{label}">\n  {inner}\n</svg>\n')

out = HERE/"svg"
for m in MARKS:
    (out/f'{m["id"]}.svg').write_text(svg_file(m["vb"], m["hero"], m["name"]))
    (out/f'{m["id"]}.16.svg').write_text(svg_file(m["favvb"], m["fav"], m["name"]+" favicon"))
print("wrote", len(MARKS)*2, "svg files")

# ---------------------------------------------------------------- contact sheet
def inline(vb, inner, cls=""):
    return f'<svg class="{cls}" viewBox="{vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">{inner}</svg>'

CSS = """
*{box-sizing:border-box}
body{margin:0;background:#fff;color:#0F172A;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
  font-feature-settings:'cv05','ss01';-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:72px 32px 120px}
h1{font-size:34px;font-weight:800;letter-spacing:-.035em;margin:0 0 10px}
.sub{font-size:15px;line-height:1.65;color:#475569;max-width:62ch;margin:0 0 8px}
.rule{height:1px;background:#E2E8F0;margin:40px 0}
.card{border:1px solid #E2E8F0;border-radius:16px;padding:28px 30px 26px;margin:0 0 26px;background:#fff}
.card.base{background:#F8FAFC;border-style:dashed}
.chead{display:flex;align-items:baseline;gap:12px;margin-bottom:6px;flex-wrap:wrap}
.num{font-size:12px;font-weight:700;color:#94A3B8;letter-spacing:.08em}
.nm{font-size:21px;font-weight:800;letter-spacing:-.025em}
.pill{font-size:10px;font-weight:700;letter-spacing:.1em;padding:3px 10px;border-radius:999px;
  background:#EEF2FF;color:#4F46E5;border:1px solid #E0E7FF}
.pill.vk{background:#F1F5F9;color:#475569;border-color:#E2E8F0}
.idea{font-size:14px;line-height:1.65;color:#334155;max-width:70ch;margin:0 0 22px}
.idea i{color:#0F172A}

.row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end;margin-bottom:22px}
.cell{display:flex;flex-direction:column;align-items:center;gap:9px}
.cap{font-size:10px;color:#94A3B8;letter-spacing:.04em;white-space:nowrap}
.box{display:flex;align-items:center;justify-content:center;border:1px solid #E2E8F0;border-radius:14px;background:#fff}
.box.dark{background:#0F172A;border-color:#0F172A}
.box svg{display:block;color:#0F172A}
.box.dark svg{color:#fff}
.two-tone .accent{color:#4F46E5}
.box.dark.two-tone .accent{color:#818CF8}

.h140{width:172px;height:150px}   .h140 svg{width:120px;height:120px}
.a64 {width:64px;height:64px;border-radius:999px}   .a64 svg{width:44px;height:44px}
.t32 {width:32px;height:32px;border-radius:7px}     .t32 svg{width:23px;height:23px}
.t16 {width:16px;height:16px;border-radius:4px}     .t16 svg{width:12px;height:12px}
.b16 {width:16px;height:16px;border:0}              .b16 svg{width:16px;height:16px}
.b24 {width:24px;height:24px;border:0}              .b24 svg{width:24px;height:24px}
.blow{width:112px;height:112px}   .blow svg{width:96px;height:96px;
  image-rendering:pixelated}

.tuned{background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:18px 20px 14px;margin-bottom:20px}
.tlabel{font-size:10px;font-weight:700;letter-spacing:.1em;color:#64748B;margin-bottom:14px}
.notes{display:grid;grid-template-columns:88px 1fr;gap:8px 16px;font-size:13px;line-height:1.6}
.k{font-size:10px;font-weight:700;letter-spacing:.08em;color:#94A3B8;padding-top:3px}
.v{color:#334155}
.v.bad{color:#9F1239}
.v b{color:#0F172A;font-weight:600}
.grid16{display:flex;gap:20px;align-items:center;background:#fff;border:1px solid #E2E8F0;
  border-radius:10px;padding:12px 16px}
"""

def card(m, base=False):
    h = []
    h.append(f'<div class="card{" base" if base else ""}">')
    pill = "V ONLY" if m.get("basis")=="V" else "V + K"
    pcls = "pill" if m.get("basis")=="V" else "pill vk"
    h.append('<div class="chead">'
             f'<span class="num">{m["n"]}</span><span class="nm">{m["name"]}</span>'
             f'<span class="{pcls}">{pill}</span></div>')
    if base:
        h.append('<p class="idea">What is on the site today. A plain two&#8209;letter monogram: '
                 'nothing to work out, and it is the shape VKontakte already owns.</p>')
    else:
        h.append(f'<p class="idea">{m["idea"]}</p>')

    hero, vb = m["hero"], m["vb"]
    h.append('<div class="row">')
    for cls, cap in [("box h140","hero / white"), ("box h140 dark","hero / near-black"),
                     ("box h140 two-tone","hero / indigo accent")]:
        h.append(f'<div class="cell"><div class="{cls}">{inline(vb,hero)}</div>'
                 f'<div class="cap">{cap}</div></div>')
    h.append('<div class="cell"><div class="box a64 dark">'+inline(vb,hero)+'</div><div class="cap">avatar 64</div></div>')
    h.append('<div class="cell"><div class="box t32 dark">'+inline(vb,hero)+'</div><div class="cap">tile 32</div></div>')
    h.append('<div class="cell"><div class="box t16 dark">'+inline(vb,hero)+'</div><div class="cap">tile 16 &#9888;</div></div>')
    h.append('<div class="cell"><div class="box b16">'+inline(vb,hero)+'</div><div class="cap">bare 16 &#9888;</div></div>')
    h.append('</div>')

    if base: return "".join(h)+"</div>"

    fvb, fav = m["favvb"], m["fav"]
    h.append('<div class="tuned"><div class="tlabel">TUNED FOR 16PX</div><div class="row" style="margin:0">')
    h.append('<div class="cell"><div class="box blow">'+inline(fvb,fav)+'</div><div class="cap">the tuned art, 96px</div></div>')
    h.append('<div class="cell"><div class="grid16">'
             +'<div class="box t16 dark">'+inline(fvb,fav)+'</div>'
             +'<div class="box b16">'+inline(fvb,fav)+'</div>'
             +'<div class="box t32 dark">'+inline(fvb,fav)+'</div>'
             +'<div class="box b24">'+inline(fvb,fav)+'</div>'
             +'<div class="box a64 dark">'+inline(fvb,fav)+'</div>'
             +'</div><div class="cap">16 tile &middot; 16 bare &middot; 32 tile &middot; 24 bare &middot; 64 avatar</div></div>')
    h.append('</div></div>')

    h.append('<div class="notes">')
    h.append(f'<div class="k">REDUCTION</div><div class="v">{m["reduce"]}</div>')
    h.append(f'<div class="k">READS AS</div><div class="v"><b>{m["reads"]}</b></div>')
    h.append(f'<div class="k">COLOUR</div><div class="v">{m["colour"]}</div>')
    h.append(f'<div class="k">FAILS BY</div><div class="v bad">{m["fail"]}</div>')
    h.append('</div></div>')
    return "".join(h)

body = [
 '<div class="wrap">',
 '<h1>Five directions</h1>',
 '<p class="sub">Three built on V alone, two on VK. Two directions were built, tested and cut: Light Cone (at 45&deg; it is a chevron, not a letter) and Entropy Gradient (a dotted arm always loses to a solid one &mdash; it renders as a checkmark). All geometry sits on a 24&#8209;unit grid, '
 'so 1.5 units = 1px at favicon size and no stroke falls below 1.5px at 16px. '
 'Every mark is one flat colour before it earns a second, and no direction uses more than three shapes '
 'after reduction.</p>',
 '<p class="sub">The rows marked &#9888; are the hero artwork crushed to 16px <em>untuned</em> &mdash; '
 'that is the honest failure test. The grey block under each shows the art actually tuned for that size.</p>',
 '<div class="rule"></div>',
 card(CURRENT, base=True),
]
body += [card(m) for m in MARKS]
body.append('</div>')

html = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>VK &mdash; logo directions</title>'
        '<link rel="preconnect" href="https://fonts.googleapis.com">'
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">'
        f'<style>{CSS}</style></head><body>' + "".join(body) + '</body></html>')

(HERE/"index.html").write_text(html)
print("wrote index.html", len(html), "bytes")
