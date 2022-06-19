let cells = []; // array of 9 elements

// game status
let IamO;
let locked = true;
let isGameEnd = false;

class Cell {
    constructor(td) {
        this.td = td;
        this.score = 0;
    }
    markByMe() {
        const text = (IamO ? "O" : "X");
        this.mark(1, text);
    }

    markByCPU() {
        if (this.score !== 0) {
            throw new Exception("internal error");
        }

        const text = (IamO ? "X" : "O");
        this.mark(-1, text);
    }
    
    mark(score, text) {
        this.score = score;
        this.render(text);
    }

    marked() {
        return  this.score !== 0;
    }
    
    render(text) {
        this.td.innerText = text;
    }

    paint(won) {
        const bgcolor = won ? 'forestgreen' : 'red';
        this.td.style.backgroundColor = bgcolor;
    }
}

function cellOnClick(cell) {
    if (isGameEnd) {
        return;
    }
    if (locked) {
        return;
    }
    if (cell.marked()) {
        return;
    }
    cell.markByMe();
    locked = true;
    const isEnd = judge();
    if (isEnd) {
        return;
    }
    playCPU();
}

document.addEventListener("DOMContentLoaded", function(){
    const trs = document.querySelectorAll('tr');
    trs.forEach(function(tr){
        let tds = tr.querySelectorAll("td");
        tds.forEach(function(td){
            const cell = new Cell(td);
            td.addEventListener("click", function(){
                cellOnClick(cell);
            });
            cells.push(cell);
        });
    });

    document.getElementById("first").addEventListener("click", function(e){
        e.currentTarget.style.background = '#fefefe';
        theOtherStyle = document.getElementById("second").style;
        theOtherStyle.color = '#eee';
        theOtherStyle.background = '#ddd';
        theOtherStyle.border = 'dotted';
        startGame(true);
    });
    document.getElementById("second").addEventListener("click", function(e){
        e.currentTarget.style.background = '#fefefe';
        theOtherStyle = document.getElementById("first").style;
        theOtherStyle.color = '#eee';
        theOtherStyle.background = '#ddd';
        theOtherStyle.border = 'dotted';
        startGame(false);
    });
    document.getElementById("reset").addEventListener("click", function(){
        location.reload();
    });
});

function startGame(isO) {
    IamO = isO;
    if (!isO) {
        setTimeout(function(){
            cells[4].markByCPU();
            locked = false;
        }, 500);
    } else {
        locked = false;
    }
}

const judgeLines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// return true if it ends.
function judge(){
    console.log("judging...");
    judgeLines.forEach(function(line, i){
        let sum = 0;
        line.forEach(function(idx){
            sum += cells[idx].score;
        });
        console.log("score is " + sum);
        if (sum === 3 || sum === -3) {
            locked = true;
            isGameEnd = true;
            const won = (sum === 3);
            line.forEach(function(cellID){
                cells[cellID].paint(won);
            });
            return true;
        }
    });
    return false;
}

function playCPU() {
    locked = true;
    if (isGameEnd) {
        return;
    }
    console.log("CPU is thinking...");
    setTimeout(function(){
        for (let i=0;i<cells.length;i++) {
            const cell = cells[i];
            if (cell.score === 0) {
                cell.markByCPU();
                const isEnd = judge();
                if (!isEnd) {
                    locked = false;
                }
                return;
            }
        }
    }, 1500);
}
