import numpy as np
def count(grid1,i,j):
    a=0
    around=[(i,j+1),(i,j-1),(i-1,j),(i-1,j+1),(i-1,j-1),(i+1,j),(i+1,j-1),(i+1,j+1)]
    for points in around:
        a+=grid1[points]
    return a

def rules(grid1,i,j,count):
    if (count==3 and grid1[i,j]==0) or ((count==2 or count==3) and grid1[i,j]==1):
        return 1
    else:
        return 0

def tic(grid1):
    size=grid1.shape
    x=size[0]
    y=size[1]
    grid2=np.zeros((x,y))
    for i in range(1,x-2):
        for j in range(1,y-2):
            grid2[i+1,j+1]=rules(grid1,i,j,count(grid1,i,j))        
    return grid2

pause=0
x=5
y=5
grid1=np.zeros((x+2,y+2))
for m in range(10):
    grid1=tic(grid1)
    print(grid1)
