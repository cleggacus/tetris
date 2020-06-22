export const blockTypes = [
    { // I
        structure: [
            [false,false,false,false,false],
            [false,false,false,false,false],
            [false,true,true,true,true],
            [false,false,false,false,false],
            [false,false,false,false,false]
        ],
        color: "#0ff"
    },{ // J
        structure: [
            [true,false,false],
            [true,true,true],
            [false,false,false]
        ],
        color: "#00f"
    },{ // L
        structure: [
            [false,false,true],
            [true,true,true],
            [false,false,false]
        ],
        color: "#fa0"
    },{ // O
        structure: [
            [false,true,true],
            [false,true,true],
            [false,false,false]
        ],
        color: "#ff0"
    },{ // S
        structure: [
            [false,true,true],
            [true,true,false],
            [false,false,false]
        ],
        color: "#0f0"
    },{ // T
        structure: [
            [false,true,false],
            [true,true,true],
            [false,false,false]
        ],
        color: "#a0f"
    },{ // Z
        structure: [
            [true,true,false],
            [false,true,true],
            [false,false,false]
        ],
        color: "#f00"
    }
]

export const randomBlock = (gridWidth: number) => {
    let b = new Block(Math.floor(Math.random() * 7));
    b.x = Math.floor(Math.random() * (gridWidth + 1 - b.structure[0].length)) ;
    return b;
}

const blockOffsetsJLSTZ = [
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    [[0,0], [0,0], [0,0], [0,0], [0,0]],
    [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
]

const blockOffsetsI = [
    [[0,0], [-1,0], [2,0], [-1,0], [2,0]],
    [[-1,0], [0,0], [0,0], [0,1], [0,-2]],
    [[-1,1], [1,1], [-2,1], [1,0], [-2,0]],
    [[0,1], [0,1], [0,1], [0,-1], [0,2]]
]

const blockOffsetsO = [
    [[0,0]],
    [[0,-1]],
    [[-1,-1]],
    [[-1,0]],
]

export default class Block{
    structure: boolean[][];
    type: number;
    x: number;
    y: number;
    r: number;

    constructor(type: number){
        this.structure = blockTypes[type].structure;
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.r = 0;
    }

    getOffset(left: boolean, testBlock: boolean[][], grid: number[][]){
        let r = this.r + (left ? -1 : 1);
        r = r == -1 ? 3 : r == 4 ? 0 : r;
        
        if(this.type == 0){
            for(let i = 0; i < blockOffsetsI[this.r].length; i++){
                const x = blockOffsetsI[this.r][i][0] - blockOffsetsI[r][i][0];
                const y = -(blockOffsetsI[this.r][i][1] - blockOffsetsI[r][i][1]);
                
                if(this.testOffset(grid, testBlock, x, y))
                    return [x, y];
            }
        }else if(this.type == 4){
            for(let i = 0; i < blockOffsetsO[this.r].length; i++){
                const x = blockOffsetsO[this.r][i][0] - blockOffsetsO[r][i][0];
                const y = -(blockOffsetsO[this.r][i][1] - blockOffsetsO[r][i][1]);
                
                if(this.testOffset(grid, testBlock, x, y)){
                    return [x, y];
                }
            }
        }else{
            for(let i = 0; i < blockOffsetsJLSTZ[this.r].length; i++){
                const x = blockOffsetsJLSTZ[this.r][i][0] - blockOffsetsJLSTZ[r][i][0];
                const y = -(blockOffsetsJLSTZ[this.r][i][1] - blockOffsetsJLSTZ[r][i][1]);
                
                if(this.testOffset(grid, testBlock, x, y)){
                    return [x, y];
                }
            }
        }
        
        return false;
    }

    testOffset(grid: number[][], testBlock: boolean[][], x, y){
        y += this.y;
        x += this.x;

        for(let i = 0; i < testBlock.length; i++){
            for(let j = 0; j < testBlock[i].length; j++){
                if(testBlock[i][j]){
                    if(grid[i + y][j + x] != -1)
                        return false;
                }
            }
        }

        return true;
    }

    rotateRight(grid: number[][]){
        const newArr = [...Array(this.structure[0].length)].map(x=>Array(this.structure.length).fill(false));
        
        this.structure.reverse();

        for(let i = 0; i < newArr.length; i++){
            for(let j = 0; j < newArr.length; j++){
                newArr[i][j] = this.structure[j][i];
            }
        }

        this.structure.reverse()

        const offset = this.getOffset(false, newArr, grid);



        if(offset){
            this.x += offset[0];
            this.y += offset[1];
            this.structure = newArr;
            this.r = this.r +1 == 4 ? 0 : this.r +1;
        }
    }

    rotateLeft(grid: number[][]){
        let newArr = [...Array(this.structure[0].length)].map(x=>Array(this.structure.length).fill(false));

        for(let i = 0; i < newArr.length; i++){
            for(let j = 0; j < newArr.length; j++){
                newArr[i][j] = this.structure[j][i];
            }
        }

        newArr.reverse();

        const offset = this.getOffset(true, newArr, grid)

        if(offset){
            this.x += offset[0];
            this.y += offset[1];
            this.structure = newArr;
            this.r = this.r -1 == -1 ? 3 : this.r -1;
        }
    }
}