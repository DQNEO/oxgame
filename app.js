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
        if (locked) {
            return;
        }
        if (this.score !== 0) {
            return;
        }

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
    
    render(text) {
        this.td.innerText = text;
    }
}
document.addEventListener("DOMContentLoaded", function(){
    const trs = document.querySelectorAll('tr');
    trs.forEach(function(tr){
        let tds = tr.querySelectorAll("td");
        tds.forEach(function(td){
            const cell = new Cell(td);
            td.addEventListener("click", function(){
                if (isGameEnd) {
                    return;
                }
                if (locked) {
                    return;
                }
                cell.markByMe();
                locked = true;
                const isEnd = judge();
                if (isEnd) {
                    return;
                }
                playCPU();
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
    console.log("game started:" + isO)
    IamO = isO;
    if (!isO) {
        setTimeout(function(){
            cells[4].markByCPU();
            locked = false;
        }, 1000);
    } else {
        locked = false;
    }
}

function endGame(win) {
    locked = true;
    isGameEnd = true;
    if (win) {
        alert("You win !")
    } else {
        alert("You loose !")
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
function judge(){
    console.log("judging...");
    judgeLines.forEach(function(line){
        console.log(line);
        const sum = cells[line[0]].score + cells[line[1]].score + cells[line[2]].score;
        console.log("score is " + sum);
        if (sum === 3) {
            endGame(true);
            return true;
        }
        if (sum === -3) {
            endGame(false);
            return true;
        }
    })
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
