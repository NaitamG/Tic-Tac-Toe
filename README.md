# Flask and create-react-app

## Install Requirements After Cloning
There are many dependencies in this project, so after cloning you might need to install Python, npm, and React JS related packages/programs
1. Fist you might need to install Flask by typing `pip install Flask` on your terminal, and if there's a need use `sudo`install Flask or for any other python dependencies
2. Now to use will install npm (cross platform software) by typing `npm install` followed by `pip install -r requirements.txt`
3. To setup it up fully use `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
4. Then to install socket for Python, go to the root directory and run `pip install flask-socketio` 
5. Run `pip install flask-cors`
6. Then go into the project-2 directory and run `npm install socket.io-client --save`

## How to Run Project-2 Application on AWS Cloud9 
1. Run command in terminal (in project-2 directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Problems, fixes, and future plan
+ One notable problem is that styling portion of the website is not following an organizaed structure, so in the future I would add a grid-style layout to the page, so I can organize the website components in a neat order.
+ Another problem I faced is not being able to separate the login() and handleClick() functions from the Board.js file, to make the project split into more components. I tried doing this but failed due to too many depending variables. I would research ways of passing useStates between components in order to fix Board.js from populating with too many functions.
+ For the future, I'd like to add the functionality where it handles new clients entering the game when they don't have the game tab open prior to one of the other clients logging in. This will make the clients entering the game more flexiable and error proof.

## Some issues that were solved
+ First technical issue I came accross is the board itself, whenever I clicked the board it would move its position down, which would then disrupt the astheics of the board. I fixed this issue by debuggin from the beginning of Board.js file and looked at how my board was created in the useState. The board was an arrya but its length was not specified, so I passed in the size of the array and that seemed to resolve the issue.
+ Another issue I ran into is the way I was storing all of the players and spectators, which was in a single 1D array. Half way through the project I realized it was not the most optimal solution in the long run of this project. To fix this issue I changed the useState object from an array to a dictionary which worked will in order to spilt up the player x, player o, and the spectators. This will be a lot of help in the future when there will be users logging out of the game.
+ One more problem was that my useEffect did not update when the server side emmitted the data. I debugged through my Board.js (client side ) file using console.log() to see if the way my data was structured right after I emmitted it to the server. Turned out the data was not being updated because there was a missing like of code where I didn't set the copy of the data back to its originalr dictionary i created for he useState.