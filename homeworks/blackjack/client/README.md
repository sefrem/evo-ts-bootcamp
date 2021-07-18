# Multiplayer Blackjack

This is a multiplayer blackjack game made with React on the front and Express server with Socket.IO on the back.

Check out the [deployed](https://blackjack-come-and-play.netlify.app/) version.

##How to play

1. Hit the New game button on the main screen
2. Copy the url with the game code and send it to your friend
3. The game will start automatically when your friend opens the link
4. ...
5. ~~PROFIT~~ Have fun!

## Local run

To run the app locally first create `.env` file in the `client` folder's root and add the following variable:
#### `REACT_APP_PATH=http://localhost:8080`

After that do `yarn  && yarn start-dev` in the `server` folder and `yarn && yarn start` in the `client` folder.


