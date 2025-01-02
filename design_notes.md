<!-- Drawing the Table with Layers

1. Table green surface
2. D zone lines
3. Padding
4. Edges
5. Balls with physics engine
6. Cue and cue ball with manipulative functions -->

<!-- Layer 3 will be on top of layers 1 and 2, so I don’t have to calculate the size of the lines. [fixed] -->

<!-- how to draw balls without duplicate?
method 1:
i am useing callback to ensure the ball is successfully draw, will random another position if location is occupied
method 2:
if randomed, not render again

1 is better because the checker method can be use in other way -->

<!-- in cushions, i come up with 3 ideas,
first, draw a rectangle and apply fricion, covered with green table and pockets on top. This might lead to embarssing calcuation on the pocket.(haven't vertify), Therefore, I choose the second one, create 6 different cushions. becuase it's the same class, the friction is the same, the only difference is position.

cannot find the cushions size and the [edge] size, just googled it and taken a random result, should be checked later [TODO] -->

<!-- size

https://www.dimensions.com/element/9-foot-billiards-pool-table
/_ balls and pockects position according to wiki https://en.wikipedia.org/wiki/Rules_of_snooker if it's not mentioned in PDF_/ -->

<!-- use math to draw the cue instead of useing constriant becuase in the engine object will affect the ball,
if the ball in the cue position, will be affected
also, it's faster and simplier -->

<!-- to match the engine world and drawing becuase used translate function
option 1: dont use translate, everything calculating from sketch, this cause the code compliaed although push and pop can help
option 2: store the translated value and apply it when everytime drawing
final: only control cue and cueball using helper function in toolbox -->

<!-- task 6 and aspect 1
place the cue ball by human intereaction
init with isPotted = true -->

<!-- random balls->
option1: gen, remove, gen
option2: gen, changepos (but old ball is obstucle. will cause not actually random) -->

<!-- dragon summoning:
if user summon dragon, the cloud and dragon will come up, user have 3 options random from different wish level,
higher level will have lower change, but more impactfuly wish. user can stratgily choose the choice.
Additionly, 7 balls to sumoon dragon, which include the cueball, which is also become a statgey for players! -->

<!-- cloud:
i try to use prelin noise to do it, but it's too lag, i tried to change seed or detail of the noise but it's unrealted,
and i look at the sample from p5js, i belive the problem is it changes every pixel. so i try to change not every pixel,
however, if i skip 1 pixel in loop, the cloud become 間條, if i skip in frame, the cloud flashes.
Finally i come up with another idea: making a circle to replace pixel, then the object to be rendered will be hugly reduced -->
