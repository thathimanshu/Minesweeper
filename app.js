let rows = 10;
let grid = new Array(rows).fill().map(() => new Array(rows).fill(0));

let visited = new Array(rows).fill().map(() => new Array(rows).fill(-1));
let TotalBombs = Math.floor(15*rows*rows/100);
let bombCount = TotalBombs;
let board = document.querySelector(".board");

let placed = 0;
let incorrect = 0;

let left = document.querySelector(".totalBombs");
left.textContent = `Bombs left = ${bombCount}`;

function changeTotalBombs(placed){
    let total = document.querySelector(".placed");
    total.textContent = `Placed = ${placed}`;
    left.textContent = `Bombs left = ${TotalBombs-placed}`;
    if(placed==TotalBombs && incorrect==0){
        alert("Won");
    }
}
changeTotalBombs(placed);


function getRandom(){
    return Math.floor(Math.random()*rows);
}
function isSafe(grid,i,j){
    if(i<0 || j<0 || i>=rows || j>=rows || grid[i][j]!=-1){
        return false;
    }
    return true;
}

function assignBombAndNum(grid) {
    let x = [-1,-1,-1,0,0,1,1,1];
    let y = [-1,0,1,-1,1,-1,0,1];
    while(bombCount!==0){
        let r = getRandom();
        let c = getRandom();
        if(grid[r][c]===-1) continue;

        bombCount-=1;
        grid[r][c] = -1;
        
        for(let k = 0;k<8;k++){
            let newRow = r+x[k];
            let newCol = c+y[k];
            if(newRow>=0 && newRow<rows && newCol>=0 && newCol<rows && grid[newRow][newCol]!=-1){
                grid[newRow][newCol]+=1;
            }
        }
    }
}

assignBombAndNum(grid);

function lost(){
    let bomb = document.querySelector(".bomb-display");
    if(bomb!=null && bomb.classList.contains("bomb-display")){
        bomb.classList.remove("bomb-display");
        setTimeout(() => {
            lost();
        }, 50);
    }
    else{
        banner();
    }
}

function banner(){
    let banner = document.createElement("div");
    banner.classList.add("banner");
    document.querySelector(".board").appendChild(banner);

    let para = document.createElement("p");
    banner.appendChild(para);
    para.innerText = "You Lost";
    para.classList.add("bannertext");
    
    let tryagain = document.createElement("button");
    tryagain.innerText = "Play Again";
    tryagain.classList.add("reset-button");
    banner.appendChild(tryagain);
}

function openEmpty(grid,i,j){
    let x = [1,-1,0,0];
    let y = [0,0,1,-1];

    for(let k = 0;k<4;k++){
        let newRow = i + x[k];
        let newCol = j + y[k];
        if(newRow>=0 && newRow<rows && newCol>=0 && newCol<rows && visited[newRow][newCol]==-1){
            if(grid[newRow][newCol]===0){
                showNum(newRow,newCol);
                openEmpty(grid,newRow,newCol);
            }
            else if(grid[newRow][newCol]>0){
                showNum(newRow,newCol);
            }
        }
    }

}


function getRow(cls){
    for(let i = 0;i<cls.length;i++){
        if(cls[i]=='-'){
            return cls.substring(1,i);
        }
    }
}
function getCol(cls){
    for(let i = 0;i<cls.length;i++){
        if(cls[i]=='-'){
            return cls.substring(i+1);
        }
    }
}
function showNum(i,j){
    const butt = document.querySelector(`.g${i}-${j}`); 
    const p = butt.querySelector('p');
    if (p!=null && p.classList.contains("near-bomb")) {
        visited[i][j] = 1;
        p.classList.remove("near-bomb");
        if(grid[i][j]==0)
        openEmpty(grid,i,j);
    }
    }
function showBomb(event,i,j){
    const img = event.currentTarget.querySelector('.bomb');
    if(img!=null && img.classList.contains("bomb-display")){
        img.classList.remove("bomb-display");
        
        setTimeout(() => {
            lost();
        }, 200);
    }
}
function btnPress(event){
    let i = parseInt(getRow(this.classList[1]));
    let j = parseInt(getCol(this.classList[1]));
    if(visited[i][j]===1 || visited[i][j] === 4){
        return;
    }
    if(grid[i][j]!=-1) showNum(i,j);
    else
    showBomb(event,i,j);
    
}

function rightClick(event){
    event.preventDefault();
    let i = getRow(this.classList[1]);
    let j = getCol(this.classList[1]);

    //visited
    if(visited[i][j]===1){
        return;
    }
    //not visited
    else if(visited[i][j]===-1){
        this.innerHTML = '<img class="flag" src="assets/flag.png">';
        placed++;
        if(grid[i][j]!=-1){
            incorrect++;
        }
        visited[i][j] = 4;
    }
    //flagged
    else{
        placed--;
        
        if(grid[i][j]!=-1){
            incorrect--;
            this.textContent=grid[i][j];
            this.innerHTML = `<p class="near-bomb">${grid[i][j]}</p>`;
            
        }
        else{
            this.innerHTML = '<img class="bomb bomb-display" src="assets/bomb.png">';
        }
        visited[i][j]=-1
    }
    changeTotalBombs(placed);
    
}
for(let i = 0; i<rows;i++){
    let row = document.createElement("div");
    row.classList.add("row");
    for(let j = 0;j<rows;j++){
        let button =  document.createElement("button");
        button.classList.add("button");
        button.classList.add(`g${i}-${j}`);
        row.appendChild(button);
        if(grid[i][j]!=-1){
            button.textContent=grid[i][j];
            button.innerHTML = `<p class="near-bomb">${grid[i][j]}</p>`;

        }
        else{
            button.innerHTML = '<img class="bomb bomb-display" src="assets/bomb.png">';
        }

        button.addEventListener("click",btnPress);
        button.addEventListener("contextmenu",rightClick);

    }
    board.appendChild(row);
}




