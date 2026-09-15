#!/usr/bin/env python3
"""Handwritten variants of the two finalist marks.
Each stroke is a variable-width pen outline, not a wobbled uniform stroke:
the centreline gets smooth low-frequency noise, the width follows a pressure
profile along arc length, and the two offset edges are closed into one filled path."""
import math, random, pathlib, re
HERE = pathlib.Path(__file__).parent

# ---------------------------------------------------------------- helpers
def resample(poly, n):
    seg=[]; total=0
    for a,b in zip(poly, poly[1:]):
        L=math.hypot(b[0]-a[0], b[1]-a[1]); seg.append(L); total+=L
    out=[]
    for i in range(n):
        s=total*i/(n-1); acc=0
        for (a,b),L in zip(zip(poly,poly[1:]), seg):
            if acc+L>=s or (a,b)==(poly[-2],poly[-1]):
                t=(s-acc)/L if L else 0; t=min(max(t,0),1)
                out.append((a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)); break
            acc+=L
    return out

def noise1d(rng, n, octaves=3, seed_amp=1.0):
    vals=[0.0]*n; amp=seed_amp
    for o in range(octaves):
        period=max(3, n//(3*(2**o)))
        ctrl=[rng.uniform(-1,1) for _ in range(n//period+3)]
        for i in range(n):
            f=i/period; a=int(f); t=f-a; t2=t*t*(3-2*t)
            vals[i]+=amp*(ctrl[a]*(1-t2)+ctrl[a+1]*t2)
        amp*=0.45
    return vals

def smooth(pts, closed=True, prec=2):
    n=len(pts)
    d=f"M{pts[0][0]:.{prec}f} {pts[0][1]:.{prec}f}"
    rng=range(n) if closed else range(n-1)
    for i in rng:
        p0=pts[(i-1)%n]; p1=pts[i%n]; p2=pts[(i+1)%n]; p3=pts[(i+2)%n]
        c1=(p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6)
        c2=(p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6)
        d+=f" C{c1[0]:.{prec}f} {c1[1]:.{prec}f} {c2[0]:.{prec}f} {c2[1]:.{prec}f} {p2[0]:.{prec}f} {p2[1]:.{prec}f}"
    if closed: d+=" Z"
    return d

def spline(poly, per=14):
    """Catmull-Rom through the key points -> a genuinely curved centreline,
    so offsetting never has to deal with a spike at the vertex."""
    pts=[poly[0]]+list(poly)+[poly[-1]]; out=[]
    for i in range(len(poly)-1):
        p0,p1,p2,p3=pts[i],pts[i+1],pts[i+2],pts[i+3]
        for s in range(per):
            t=s/per; t2=t*t; t3=t2*t
            out.append((
              0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
              0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)))
    out.append(tuple(poly[-1])); return out

def stroke(poly, base_w, rng, wobble=0.20, n=80, press=(0.72,1.06,0.58), skew=0.55):
    """press = (start, peak, end) width multipliers; skew = where the peak sits, 0..1"""
    pts=resample(spline(poly), n)
    nz=noise1d(rng,n,octaves=3)
    out=[]
    for i,(x,y) in enumerate(pts):
        j=min(i+1,n-1); k=max(i-1,0)
        tx,ty=pts[j][0]-pts[k][0], pts[j][1]-pts[k][1]
        L=math.hypot(tx,ty) or 1; tx,ty=tx/L,ty/L
        nx,ny=-ty,tx
        out.append((x+nx*nz[i]*wobble, y+ny*nz[i]*wobble, nx, ny))
    wn=noise1d(random.Random(rng.random()), n, octaves=2)
    left=[]; right=[]
    for i,(x,y,nx,ny) in enumerate(out):
        s=i/(n-1)
        if s<skew: u=s/skew;         m=press[0]+(press[1]-press[0])*(u**0.5)
        else:      u=(1-s)/(1-skew); m=press[2]+(press[1]-press[2])*(u**0.5)
        w=base_w*m*(1+0.07*wn[i])/2
        left.append((x+nx*w, y+ny*w)); right.append((x-nx*w, y-ny*w))
    return smooth(left+right[::-1], closed=True)

# ---------------------------------------------------------------- the marks
def unit_vector(seed):
    rng=random.Random(seed)
    # one continuous down-up motion, overshooting slightly at both terminals
    v=[(5.55,7.10),(6.19,8.33),(9.1,14.0),(10.75,17.5),(12.0,19.73),(13.25,17.5),(14.9,14.0),(17.81,8.33),(18.55,6.85)]
    # the hat: a quick separate flick, deliberately a touch off-centre and off-axis
    h=[(10.30,4.05),(10.70,3.55),(12.10,0.85),(13.30,3.35),(13.60,4.15)]
    return (f'<path d="{stroke(v,2.10,rng,wobble=0.20,n=96,press=(0.58,1.05,0.40),skew=0.30)}"/>'
            f'<path class="ac" fill="currentColor" d="{stroke(h,1.20,rng,wobble=0.15,n=46,press=(0.52,1.03,0.38),skew=0.38)}"/>')

def v_sub_k(seed):
    rng=random.Random(seed)
    v=[(1.15,2.55),(1.80,3.80),(5.1,10.9),(7.25,15.5),(8.50,18.10),(9.75,15.5),(11.8,10.9),(15.20,3.80),(15.85,2.45)]
    stem=[(18.00,7.55),(18.05,11.0),(17.95,14.6),(18.00,18.55)]
    arm =[(22.60,9.95),(19.9,12.4),(17.50,14.90),(20.2,16.6),(22.85,18.35)]
    return (f'<path d="{stroke(v,2.25,rng,wobble=0.20,n=96,press=(0.58,1.05,0.40),skew=0.30)}"/>'
            f'<g class="ac" fill="currentColor"><path d="{stroke(stem,1.55,rng,wobble=0.12,n=52,press=(0.72,1.02,0.55),skew=0.35)}"/>'
            f'<path d="{stroke(arm,1.50,rng,wobble=0.16,n=60,press=(0.58,1.02,0.42),skew=0.45)}"/></g>')

VARIANTS={"hand-02-unit-vector":(unit_vector,"0 0 24 24","-1.4"),
          "hand-05-v-sub-k":(v_sub_k,"0 0 24 24","0.9")}
if __name__=="__main__":
    for name,(fn,vb,rot) in VARIANTS.items():
        body=fn(7)
        svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" color="#0F172A" '
             f'role="img" aria-label="{name}">\n'
             f'  <g fill="currentColor" transform="rotate({rot} 12 12)">{body}</g>\n</svg>\n')
        (HERE/"svg"/f"{name}.svg").write_text(svg)
        print("wrote", name)

# ---------------------------------------------------------------- geometry export
def _pts(d):
    nums=[float(x) for x in re.findall(r'-?\d+\.?\d*', d)]
    return list(zip(nums[0::2], nums[1::2]))
def _rot(pts, deg, cx=12, cy=12):
    a=math.radians(deg); c,s=math.cos(a),math.sin(a)
    return [((x-cx)*c-(y-cy)*s+cx, (x-cx)*s+(y-cy)*c+cy) for x,y in pts]
def bbox(pts):
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    return min(xs),min(ys),max(xs),max(ys)

def export_meta():
    import json
    meta={}
    for name,(fn,vb,rot) in VARIANTS.items():
        body=fn(7); rot=float(rot)
        ds=re.findall(r'\sd="([^"]+)"', body)
        allp=_rot([p for d in ds for p in _pts(d)], rot)
        vonly=_rot(_pts(ds[0]), rot)                     # first path is always the V
        x0,y0,x1,y1 = bbox(allp); vx0,vy0,vx1,vy1 = bbox(vonly)
        meta[name]=dict(body=body, rot=rot,
                        tight=f"{x0:.3f} {y0:.3f} {x1-x0:.3f} {y1-y0:.3f}",
                        box_h=y1-y0, v_h=vy1-vy0)
        print(f"{name}: box {x1-x0:.2f}x{y1-y0:.2f}  V height {vy1-vy0:.2f}")
    (HERE/"hand_meta.json").write_text(json.dumps(meta, indent=1))
    return meta

if __name__=='__main__':
    export_meta()
