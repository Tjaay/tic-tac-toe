import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const size = 4;

function Square(props) {
  return (
    <button className={"square" + (props.winningSquare ? " winner" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square key={i}
      value={this.props.squares[i]}
      winningSquare={this.props.winner && this.props.winner.indexOf(i) !== -1}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const mappedSquares = Array(size * size).fill(null);
    let square = 0;
    for (let i = 0; i < size; i++) {
      const squares = Array(size).fill(null);
      for (let j = 0; j < size; j++) {
        square = size * i + j;
        squares[square] = this.renderSquare(square);
      }
      mappedSquares.push(<div key={square} className="board-row">{squares}</div>);
    }
    return (
      <div className="board">
        {mappedSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(size * size).fill(null),
        col: null,
        row: null,
      }],
      stepNumber: 0,
      gameStart: false,
      boardSet: false,
      xIsNext: true,
      movesAscending: true,
    };
  }



  playerVersusPlayer() {
    this.setState({
      gameStart: true,
      twoPlayer: true
    });
  }

  playAgainstAi() {
    this.setState({
      gameStart: true
    });
  }

  handleClick(i) {
    const playerOnePlayer = this.state.playerOne;
    const aiPlayer = this.state.playerTwo;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let aiPick = Math.floor(Math.random() * squares.length);
    const col = (i % size) + 1;
    const row = Math.floor(i / size) + 1;

    if (calculateWinner(squares) || squares[i]) {
      return
    }

    if (this.state.twoPlayer) {
      squares[i] = this.state.xIsNext ? this.state.playerOne : this.state.playerTwo;
    } else {
      squares[i] = playerOnePlayer;
        this.computerPick(squares, aiPick, aiPlayer)
    }

    console.log(squares.length);

    this.setState({
      boardSet: true,
      history: history.concat([{
        squares: squares,
        col: col,
        row: row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  computerPick(squares, aiPick, aiPlayer) {


    while (squares[aiPick] === "X" || squares[aiPick] === 'O') {
      aiPick = Math.floor(Math.random() * squares.length);
    }
    squares[aiPick] = aiPlayer;

  }

  setSymbol(symbol) {
    alert("The board is set click any square to begin.");
    this.setState({
      squares: Array(size * size).fill(null),
      symbolPicked: true,
      playerOne: symbol,
      playerTwo: symbol === "X" ? "O" : "X"
    });
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleMoves() {
    this.setState({
      movesAscending: !this.state.movesAscending
    })
  }

  resetBoard() {
    this.setState({
      gameStart: !this.state.gameStart,
      boardSet: !this.state.boardSet,
      symbolPicked: !this.state.symbolPicked,
      twoPlayer: false
    })
    this.jumpTo(0);
  }

  onClick(i) {
    if (this.state.symbolPicked) {
      this.handleClick(i);
    }
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " at position: (" + step.col + ", " + step.row + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button className={"uiButton " + (move === this.state.stepNumber ? "currentMove" : "")}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.movesAscending) {
      moves.reverse();
    }

    let status;
    let bold;
    // if someone wins the game
    if (winner) {
      if (this.state.twoPlayer) {
        status = current.squares[winner[0]] === this.state.playerOne ? "Player 1 won!!" : "Player 2 won";
      } else {
        status = current.squares[winner[0]] === this.state.playerOne ? "YOU WON!" : "YOU LOSE!";
      }
      bold = true;

      // if noone wins the game
    } else if (winner === false) {
      status = 'Stalemate!!!!!!!';
      bold = true;


    } else if (!this.state.symbolPicked) {
      status = <div className="setSymbol">Player one pick <button className="uiButton"
        onClick={() => this.setSymbol("X")}> X </button> <span>or </span>
        <button className="uiButton" onClick={() => this.setSymbol("O")}> O </button> ? </div>

    } else {
      if (this.state.twoPlayer) {
        status = this.state.xIsNext ? "Player 1 move " + this.state.playerOne : "Player 2 move " + this.state.playerTwo;
      }
      else {
        status = 'You Picked: ' + this.state.playerOne;
      }
    }

    if (this.state.gameStart) {
      return (
        <div>
          <div className="game">
            <div className="game-info">
              <ol>{this.state.boardSet ? moves : ""}</ol>
            </div>
            <div className="game-board">
              <h1>{"Tic Tac Toe"}</h1>
              <div>
                <p className={this.state.symbolPicked ? "noHowToWin" : "hasHowToWin"}> To win get 4 in a row, horizontally,
                <br /> vertically, or in a diagonal </p>
              </div>
              <div className={bold ? "gameResult" : "info"}> {status}</div>
              <Board
                winner={winner}
                squares={current.squares}
                onClick={(i) => this.onClick(i)}
              />
              <button className="uiButton" onClick={() => this.toggleMoves()}>Reorder Moves</button>
              <button className="resetBtn" onClick={() => this.resetBoard()}>Change Game Type</button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="startBtns">
          <h1>{"Tic Tac Toe"}</h1>
          <button className="startBtn" onClick={() => this.playerVersusPlayer()}>Play vs Friend</button>
          <button className="startBtn" onClick={() => this.playAgainstAi()}>Play vs Computer</button>
        </div>
      )
    }
  }
}

// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [12, 9, 6, 3],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return [a, b, c, d];
    }
    if (squares.indexOf(null) === -1) {
      return false;
    }
  }
  return null;
}


// function emptyIndexies(board){
//   return  board.filter(squares => squares != "O" && squares != "X");
// }

// let freeSquares = emptyIndexies(board);

// if (win(cloneBoard, playerOnePlayer)) {
//   return { score: -10 };
// }
// else if (winning(cloneBoard, aiPlayer)) {
//   return { score: 10 };
// }
// else if (freeSquares.length === 0) {
//   return { score: 0 };
// }

ReactDOM.render(

  <Game />,
  document.getElementById('root')
);
