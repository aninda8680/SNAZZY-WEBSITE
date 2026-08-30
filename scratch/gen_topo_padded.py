import numpy as np
import matplotlib.pyplot as plt
import json

WIDTH = 1440
HEIGHT = 3800
RES = 8 # Better resolution for smoother curves
PAD = 200 # Pad to hide straight boundary lines outside the viewBox

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
contours = ax.contour(X, Y, Z, levels=45) # Slightly more levels to maintain density with padding

paths_str = []
for path in contours.get_paths():
    for polygon in path.to_polygons():
        if len(polygon) < 2: continue
        
        # Check if polygon is a closed loop that runs exactly along the boundary
        # By adding padding, any boundary tracing is moved outside the 0..1440 viewBox!
        
        # Use cubic bezier smoothing (or quadratic) for perfectly smooth SVG lines?
        # A simple way to smooth in SVG is to use 'S' or 'Q', but since RES is 8, 
        # straight lines of length ~8px will already look perfectly smooth and curvy.
        d = f'M {polygon[0,0]:.1f} {polygon[0,1]:.1f}'
        for p in polygon[1:]:
            d += f' L {p[0]:.1f} {p[1]:.1f}'
        paths_str.append(d)

with open('scratch/topo_paths.json', 'w') as f:
    json.dump(paths_str, f)

print(f'Generated {len(paths_str)} paths.')
