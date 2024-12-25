Drawing the Table with Layers

1. Table green surface
2. D zone lines
3. Padding
4. Edges
5. Balls with physics engine
6. Cue and cue ball with manipulative functions

Layer 3 will be on top of layers 1 and 2, so I don’t have to calculate the size of the lines.

how to draw balls without duplicate?
method 1:
i am useing callback to ensure the ball is successfully draw, will random another position if location is occupied
method 2:
if randomed, not render again

1 is better because the checker method can be use in other way

in cushions, i come up with 3 ideas,
first, draw a rectangle and apply fricion, covered with green table and pockets on top. This might lead to embarssing calcuation on the pocket.(haven't vertify), Therefore, I choose the second one, create 6 different cushions. becuase it's the same class, the friction is the same, the only difference is position.

cannot find the cushions size and the [edge] size, just googled it and taken a random result, should be checked later [TODO]

size

https://www.dimensions.com/element/9-foot-billiards-pool-table
/_ balls and pockects position according to wiki https://en.wikipedia.org/wiki/Rules_of_snooker if it's not mentioned in PDF_/

use math to draw the cue instead of useing constriant becuase in the engine object will affect the ball,
if the ball in the cue position, will be affected
also, it's faster and simplier

to match the engine world and drawing becuase used translate function
option 1: dont use translate, everything calculating from sketch, this cause the code compliaed although push and pop can help
option 2: store the translated value and apply it when everytime drawing
