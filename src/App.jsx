import Player from "./components/Player"
import GameBoard from "./components/GameBoard"
import Log from "./components/Log";
import { useState } from "react"
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

const INITIAL_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

function deriveActivePlayer (gameTurns){
  let currentPlayer = 'X';

  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    currentPlayer = 'O'
  }
  return currentPlayer
}

function deriveGameboard(gameTurns){
  let gameBoard = [...INITIAL_BOARD.map(array => [...array])];

  for (const turn of gameTurns){
      const {square, player} = turn;
      const { row, col} = square;

      gameBoard[row][col] = player
  }

  return gameBoard
}

function deriveWinner(gameBoard, players){
  let winner;

  for (const combinations of WINNING_COMBINATIONS){
    const firstSymbol = gameBoard[combinations[0].row][combinations[0].column];
    const secondSymbol = gameBoard[combinations[1].row][combinations[1].column];
    const thirdSymbol = gameBoard[combinations[2].row][combinations[2].column];

    if (firstSymbol && firstSymbol === secondSymbol && firstSymbol === thirdSymbol){
      winner = players[firstSymbol]
    }
  }

  return winner
}

function App() {
  const [players, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([])

  const activePlayer = deriveActivePlayer(gameTurns)
  const gameBoard = deriveGameboard(gameTurns)
  const winner = deriveWinner(gameBoard, players)
  const haDraw = gameTurns.length === 9 && !winner

  function handleSelectSquare (rowIndex, colIndex) {
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(gameTurns)

      const updatedTurn = [{square : { row: rowIndex, col: colIndex }, player: currentPlayer}, ...prevTurns]
      return updatedTurn
    })
  }

  function handleRestart(){
    setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers(prevPlayers => {
      return {...prevPlayers,
       [symbol] : newName
      }
    }) 
  }

  return (
    <main>
    <div id="game-container">
      <ol id="players" className="highlight-player">
        <Player initialName={PLAYERS.X} playerSymbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange}/>
        <Player initialName={PLAYERS.O} playerSymbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange}/>
      </ol>
      {(winner || haDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
    </div>
      <Log turns={gameTurns}></Log>
    </main>
  )
}

export default App
