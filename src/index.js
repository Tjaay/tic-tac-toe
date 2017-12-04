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
      xIsNext: true,
      movesAscending: true,
    };
  }

  handleClick(i) {
    const humanPlayer = this.state.human;
    const aiPlayer = this.state.computer;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var aiPick = Math.floor(Math.random() * squares.length);
    while (squares[aiPick] === "X" || squares[aiPick] === 'O') {
      aiPick = Math.floor(Math.random() * squares.length);
    }
    const col = i % size;
    const row = Math.floor(i / size);
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = humanPlayer;
    // setTimeout(() =>{
      squares[aiPick] = this.state.computer;
    // }, 250)
  
    console.log(squares.length);
    this.setState({
      history: history.concat([{
        squares: squares,
        col: col,
        row: row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  computerPick() {
  }

  setSymbol = (symbol) => {
    alert("The game has begun :D enjoy");
    this.setState({
      squares: Array(9).fill(null),
      symbolPicked: true,
      human: symbol,
      computer: symbol === "X" ? "O" : "X"
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

  onClick(i) {
    if (this.state.symbolPicked) {
      this.handleClick(i);
    }
    this.computerPick();
  }


  render() {
    const history = this.state.history;
    const start = this.state.gameStarted;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " at position: (" + step.col + ", " + step.row + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? "currentMove" : ""}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.movesAscending) {
      moves.reverse();
    }

    let status;
    let bold;
    if (winner) {
      status = current.squares[winner[0]] === this.state.human ? "YOU WON!" : "YOU LOSE!";
      bold = true;
    } else if (winner === false) {
      status = 'TIE GAME!!!!';
      bold = true;
    } else if (!this.state.symbolPicked) {
      status = <div className="setSymbol">Player one pick <button
        onClick={() => this.setSymbol("X")}> X </button> <span>or </span>
        <button onClick={() => this.setSymbol("O")}> O </button> ? </div>
    } else {
      status = 'You Picked: ' + this.state.human;
    }

    return (
      <div className="game">
        <div className="game-board">
          <h1>{"Tic Tac Toe"}</h1>
          <div className={bold ? "gameResult" : "info"}> {status}</div>
          <Board
            winner={winner}
            squares={current.squares}
            onClick={(i) => this.onClick(i)}
          />
          <button onClick={() => this.toggleMoves()}>Reorder Moves</button>
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================
function calculateWinner(squares, player) {
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

// function wins(board, player) {
//   if (
//     (board[0] == player && board[1] == player && board[2] == player) ||
//     (board[3] == player && board[4] == player && board[5] == player) ||
//     (board[6] == player && board[7] == player && board[8] == player) ||
//     (board[0] == player && board[3] == player && board[6] == player) ||
//     (board[1] == player && board[4] == player && board[7] == player) ||
//     (board[2] == player && board[5] == player && board[8] == player) ||
//     (board[0] == player && board[4] == player && board[8] == player) ||
//     (board[2] == player && board[4] == player && board[6] == player)
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function emptyIndexies(board){
//   return  board.filter(squares => squares != "O" && squares != "X");
// }

// let freeSquares = emptyIndexies(board);

// if (win(cloneBoard, humanPlayer)) {
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
