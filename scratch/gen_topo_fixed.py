import numpy as np
import matplotlib.pyplot as plt
from matplotlib.path import Path
import json

WIDTH = 1440
HEIGHT = 3800
RES = 8 
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

contours = ax.contour(X, Y, Z, levels=45)

paths_str = []
for path in contours.get_paths():
    d = ""
    for vertices, code in path.iter_segments(simplify=False):
        if code == Path.MOVETO:
            d += f" M {vertices[0]:.1f} {vertices[1]:.1f}"
        elif code == Path.LINETO:
            d += f" L {vertices[0]:.1f} {vertices[1]:.1f}"
        elif code == Path.CLOSEPOLY:
            d += " Z"
    if d:
        paths_str.append(d.strip())

with open('scratch/topo_paths.json', 'w') as f:
    json.dump(paths_str, f)

print(f'Generated {len(paths_str)} paths.')
