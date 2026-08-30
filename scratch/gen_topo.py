import numpy as np
import matplotlib.pyplot as plt
import json

WIDTH = 1440
HEIGHT = 3800
RES = 15 # 15 pixels per grid point

x = np.linspace(0, WIDTH, WIDTH//RES)
y = np.linspace(0, HEIGHT, HEIGHT//RES)
X, Y = np.meshgrid(x, y)

def noise(X, Y):
    Z = np.zeros_like(X)
    # Combine a few sine waves at different scales and angles
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

contours = ax.contour(X, Y, Z, levels=30)

paths_str = []
for c in contours.collections:
    for path in c.get_paths():
        v = path.vertices
        if len(v) < 2: continue
        d = f"M {v[0,0]:.1f} {v[0,1]:.1f}"
        for p in v[1:]:
            d += f" L {p[0]:.1f} {p[1]:.1f}"
        paths_str.append(d)

with open("topo_paths.json", "w") as f:
    json.dump(paths_str, f)

print(f"Generated {len(paths_str)} paths.")
