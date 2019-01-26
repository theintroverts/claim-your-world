from PIL import Image
import json

im = Image.open("good_neighbors.png")
#im.show()



imageW = im.size[0]
imageH = im.size[1]

result = {}
dir(result)
i = 33
for x in range(0, imageW):
    asum = 0
    for y in range(0, imageH):
        xy = (x, y)
        (r,g,b,a) = im.getpixel(xy)
        asum += a
    if (asum == 0):
        result[chr(i)] = x
        i += 1

print(json.dumps(result))
