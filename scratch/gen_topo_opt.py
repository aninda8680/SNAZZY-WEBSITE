import numpy as np
import matplotlib.pyplot as plt
from matplotlib.path import Path
import json

WIDTH = 1440
HEIGHT = 3800
RES = 15 # Coarser grid to reduce vertices
PAD = 200 

x = np.linspace(-PAD, WIDTH+PAD, (WIDTH+PAD*2)//RES)
y = np.linspace(-PAD, HEIGHT+PAD, (HEIGHT+PAD*2)//RES)
X, Y = np.meshgrid(x, y)

def noise(X, Y):
    Z = np.zeros_like(X)
    freqs = [0.0015, 0.003, 0.006, 0.012]
    amps = [1.0, 0.6, 0.3, 0.15]
    phases = [0, 1.2, 2.4, 3.1]
    angles = [0.2, 0.8, -0.5, 1.9]
    for f, a, p, ang in zip(freqs, amps, phases, angles):
        nx = X * np.cos(ang) - Y * np.sin(ang)
        ny = X * np.sin(ang) + Y * np.cos(ang)
        Z += a * np.sin(nx * f + p) * np.cos(ny * f + p)
    return Z

Z = noise(X, Y)

fig = plt.figure()
ax = plt.Axes(fig, [0., 0., 1., 1.])
ax.set_axis_off()
fig.add_axes(ax)

# Generate contours
# Use fewer levels (25 instead of 45) to drastically reduce the number of paths drawn!
contours = ax.contour(X, Y, Z, levels=25)

# Simple distance-based decimation (take every Nth point, but keep first and last)
def decimate(vertices, dist_thresh=5.0):
    if len(vertices) < 3: return vertices
    out = [vertices[0]]
    for pt in vertices[1:-1]:
        d = np.linalg.norm(pt - out[-1])
        if d > dist_thresh:
            out.append(pt)
    out.append(vertices[-1])
    return out

paths_str = []
for path in contours.get_paths():
    for polygon in path.to_polygons():
        if len(polygon) < 2: continue
        
        # We use to_polygons but filter out those that are strictly boundary boxes.
        # Since we padded the grid, any straight line that closes a boundary will be 
        # at x=-PAD or x=WIDTH+PAD. We can just clip them or trust the viewBox!
        # Wait, earlier I found that to_polygons auto-closes, drawing a massive line.
        # Let's use iter_segments again!
        pass

paths_str = []
for path in contours.get_paths():
    current_line = []
    
    for vertices, code in path.iter_segments(simplify=True):
        if code == Path.MOVETO:
            if len(current_line) > 1:
                dec = decimate(current_line, 6.0) # simplify
                d = f"M {int(dec[0][0])} {int(dec[0][1])}"
                for pt in dec[1:]:
                    d += f" L {int(pt[0])} {int(pt[1])}"
                paths_str.append(d)
            current_line = [vertices]
        elif code == Path.LINETO:
            current_line.append(vertices)
        elif code == Path.CLOSEPOLY:
            if len(current_line) > 1:
                dec = decimate(current_line, 6.0)
                d = f"M {int(dec[0][0])} {int(dec[0][1])}"
                for pt in dec[1:]:
                    d += f" L {int(pt[0])} {int(pt[1])}"
                d += " Z"
                paths_str.append(d)
            current_line = []
            
    if len(current_line) > 1:
        dec = decimate(current_line, 6.0)
        d = f"M {int(dec[0][0])} {int(dec[0][1])}"
        for pt in dec[1:]:
            d += f" L {int(pt[0])} {int(pt[1])}"
        paths_str.append(d)

with open('scratch/topo_paths.json', 'w') as f:
    json.dump(paths_str, f)

print(f'Generated {len(paths_str)} paths.')
