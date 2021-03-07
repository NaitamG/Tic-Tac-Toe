# Flask and create-react-app

## Install Requirements After Cloning Milestone 1
There are many dependencies in this project, so after cloning you might need to install Python, npm, and React JS related packages/programs
1. Fist you might need to install Flask by typing `pip install Flask` on your terminal, and if there's a need use `sudo`install Flask or for any other python dependencies
2. Now to use will install npm (cross platform software) by typing `npm install` followed by `pip install -r requirements.txt`
3. To setup it up fully use `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
4. Then to install socket for Python, go to the root directory and run `pip install flask-socketio` 
5. Run `pip install flask-cors`
6. Then go into the project-2 directory and run `npm install socket.io-client --save`

## Install and Requirements After Cloning Milestone 2
The Database Setup: this is so you can later use the `heroku pg:psql` command access and see the db table directly and it also ensures you can run the PostGresSQL and SQLAlchemy with the Flask framework
1. Install PostGreSQL with `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`
2. Initialize PSQL database: `sudo service postgresql initdb`
3. Start PSQL: `sudo service postgresql start`
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER`
5. Make a new database: `sudo -u postgres createdb $USER`
6. Make sure your user shows up:
    a) `psql`
    b) ``\du`
    c) `\l`
7. Make a new user:
    a) `psql` (if you already quit out of psql)
    b) Type this with your username and password (DONT JUST COPY PASTE): `create user some_username_here superuser password 'some_unique_new_password_here'`; e.g. `create user namanaman superuser password 'mysecretpassword123'`;
    c) `\q` to quit out of sql
8. Save your username and password in a sql.env file with the format `SQL_USER=` and `SQL_PASSWORD=`.

To use SQL in Python: `pip install psycopg2-binary`
1.`pip install Flask-SQLAlchemy==2.1`
2. Run `pip freeze > requirements.txt` to update the requirements.txt file
3. Make sure the `DATABASE_URL` is set to the postgres url from heroku in the .env file because that will be used in app.py

## How to Run Project-2 Application on AWS Cloud9 
1. Run command in terminal (in project-2 directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Problems, fixes, and future plan
+ The biggest concern is that on C9 the app work fine but if I tend to test it on the heroku side using the same browser (Chrome) then there a huge delay in updating any renders (leaderboard or even player moves). Although, when I tested it by sending the heroku link to a friend we were able to the game perfectly without any delays, so I believe the solution was to play on different browsers and/or devices.
+ Another problem I faced is not being able to separate the login() and handleClick() functions from the Board.js file, to make the project split into more components. I researched and found how exactly props work, so I had to remodel a lot of my board.js and app.js to seperate some funcitonality into different files/components. This worked out well and was more readable then from the last milestone.
+ A small problem, I wasn't able to fix is that my board gets unorganized when the browser is not on full screen or if the game is played on a mobile phone. So in the future I'd like to add some more structure to my html and css to handle versatility of the app in terms of screen ratio and resizing. 

## Some issues that were solved
+ First technical issue I came accross is the board itself, whenever I clicked the board it would move its position down, which would then disrupt the astheics of the board. I fixed this issue by debuggin from the beginning of Board.js file and looked at how my board was created in the useState. The board was an arrya but its length was not specified, so I passed in the size of the array and that seemed to resolve the issue.
+ Another issue I ran into is the way I was storing all of the players and spectators, which was in a single 1D array. Half way through the project I realized it was not the most optimal solution in the long run of this project. To fix this issue I changed the useState object from an array to a dictionary which worked will in order to spilt up the player x, player o, and the spectators. This will be a lot of help in the future when there will be users logging out of the game.
+ One more problem was that my useEffect did not update when the server side emmitted the data. I debugged through my Board.js (client side ) file using console.log() to see if the way my data was structured right after I emmitted it to the server. Turned out the data was not being updated because there was a missing like of code where I didn't set the copy of the data back to its originalr dictionary i created for he useState.
+ I was able to add more css and make the app more pleasing to the eyes.
+ I also handled some edgecases where in a certain game a draw feature woudld not work, and I made it work with some conditional statements
+ I also fixed the play again button and figured out how to update the score through the click of that button