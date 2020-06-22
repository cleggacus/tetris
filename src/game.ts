import Display from "./display";
import Block, {blockTypes, randomBlock} from './Block'

export default class Game{
    isGameOver: boolean;
    isPaused: boolean;
    display: Display;
    then: number;
    fallTime: number;
    grid: number[][];
    block: Block;
    
    constructor(display: Display, w: number, h: number){
        this.display = display;
        this.then = 0;
        this.grid = [...Array(h)].map(x=>Array(Math.floor(w)).fill(-1));
        this.fallTime = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.addBorder();
    }

    addBorder(){
        for(let i = 0; i < this.grid.length; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                if(i == 0 || j == 0 || i == this.grid.length - 1 || j == this.grid[i].length - 1)
                    this.grid[i][j] = -2;
            }
        }
    }

    drawGrid(x: number, y: number, cellSize: number){
        for(let i = 0; i < this.grid.length; i++){
            for(let j = 0; j < this.grid[i].length; j++){
                this.display.drawRect(j * cellSize + x, i * cellSize + y, cellSize, cellSize, "#131313", "#000", 3);
                if(this.grid[i][j] != -1){
                    const color = this.grid[i][j] == -2 ? "#aaa" : blockTypes[this.grid[i][j]].color;
                    this.display.drawImg(j * cellSize + x, i * cellSize + y, cellSize, cellSize, "block.png", color);
                }
            }
        }
    }

    drawBlock(x: number, y: number, cellSize: number){
        for(let i = 0; i < this.block.structure.length; i++){
            for(let j = 0; j < this.block.structure[i].length; j++){
                if(this.block.structure[i][j]){
                    this.display.drawImg((this.block.x + j) * cellSize + x, (this.block.y + i) * cellSize + y, cellSize, cellSize, "block.png", blockTypes[this.block.type].color);
                }
            }
        }
    }

    start(){
        this.newBlock();
        requestAnimationFrame((now) => this.gameLoop(now));

        document.addEventListener('keydown', e => {
            if (e.keyCode == 37 && !this.isCollideLeft()) {
                this.block.x--;
            }else if (e.keyCode == 39 && !this.isCollideRight()) {
                this.block.x++;
            }else if (e.keyCode == 40 && !this.isCollideBelow()) {
                this.block.y ++;
            }else if (e.key.toLowerCase() == "a") {
                this.block.rotateLeft(this.grid);
            }else if (e.key.toLowerCase() == "d") {
                this.block.rotateRight(this.grid);
            }else if (e.keyCode == 32) {
                this.isPaused = !this.isPaused;
            }
        })
    }

    newBlock(){
        if(typeof this.block != "undefined"){
            for(let i = 0; i < this.block.structure.length; i++){
                for(let j = 0; j < this.block.structure[i].length; j++){
                    if(this.block.structure[i][j]){
                        this.grid[i+ this.block.y][j+ this.block.x] = this.block.type;
                    }
                }
            }
        }

        this.block = randomBlock(this.grid[0].length - 2);
        this.block.x ++;
        this.block.y ++;
    }

    draw(){
        const displayRatio = this.display.getWidth() / this.display.getHeight();
        const gridRatio = this.grid[0].length / this.grid.length;
        
        let cellSize = 0;
        let x = 0;
        let y = 0;
        
        if(displayRatio > gridRatio){
            cellSize = this.display.getHeight() / this.grid.length;
            x = (this.display.getWidth() - cellSize * this.grid[0].length) / 2;
        }else{
            cellSize = this.display.getWidth() / this.grid[0].length;
            y = (this.display.getHeight() - cellSize * this.grid.length) / 2;
        }

        this.drawGrid(x, y, cellSize);
        this.drawBlock(x, y, cellSize);
    }

    isCollideBelow(){
        for(let i = 0; i < this.block.structure.length; i++){
            for(let j = 0; j < this.block.structure[i].length; j++){
                if(this.block.structure[i][j]){
                    if(this.grid[i + this.block.y + 1][j+ this.block.x] != -1)
                        return true;
                }
            }
        }
        return false;
    }

    isCollideLeft(){
        for(let i = 0; i < this.block.structure.length; i++){
            for(let j = 0; j < this.block.structure[i].length; j++){
                if(this.block.structure[i][j]){
                    if(this.grid[i + this.block.y][j+ this.block.x - 1] != -1)
                        return true;
                }
            }
        }
        return false;
    }

    isCollideRight(){for(let i = 0; i < this.block.structure.length; i++){
            for(let j = 0; j < this.block.structure[i].length; j++){
                if(this.block.structure[i][j]){
                    if(this.grid[i + this.block.y][j+ this.block.x + 1] != -1)
                        return true;
                }
            }
        }
        return false;
    }

    updateRows(){
        for(let i = 1; i < this.grid.length-1; i++){
            let complete = true;

            for(let j = 1; j < this.grid[i].length - 1; j++){
                if(i == 1 && this.grid[i][j] >= 0){
                    this.gameOver();
                }

                if(this.grid[i][j] < 0){
                    complete = false;
                }
            }

            if(complete){
                this.grid.splice(i, 1);
                this.grid.splice(0, 1);
                this.grid.unshift(Array(this.grid[0].length).fill(-1));
                this.grid[0][0] = -2;
                this.grid[0][this.grid[0].length-1] = -2;
                this.grid.unshift(Array(this.grid[0].length).fill(-2));
            }
        }
    }

    gameOver(){
        this.isGameOver = true;
        alert("your bad");
    }

    gameLoop(now){
        if(!this.isGameOver){
            const t = (now - this.then) / 1000;
            this.then = now;
            this.fallTime += t;
    
            if(this.fallTime > 1 && !this.isPaused){
                this.fallTime = 0;
    
                if(this.isCollideBelow()){
                    this.newBlock();
                    this.updateRows();
                }else{
                    this.block.y ++;
                }
            }
    
            this.draw();
            this.display.render();
    
            requestAnimationFrame((now) => this.gameLoop(now));
        }
    }
}