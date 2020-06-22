export default class Display{
    maxRes: boolean;
    fillColor: string;
    buffer: CanvasRenderingContext2D;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement){
        this.buffer = document.createElement('canvas').getContext('2d');
        this.ctx = canvas.getContext('2d');
        this.resize();
    }

    setViewport(w: number = 0, h: number = 0){
        if (w || h){
            this.maxRes = false;
            this.buffer.canvas.width = w;
            this.buffer.canvas.height = h;
        }else{
            this.maxRes = true;
        }

        this.resize();
    }

    getWidth(){
        return this.buffer.canvas.width;
    }

    getHeight(){
        return this.buffer.canvas.height;
    }

    setFillColor(fillColor: string){
        this.fillColor = fillColor;
        this.fillBackground();
    }

    fillBackground(){
        if(this.fillColor){
            this.buffer.fillStyle = this.fillColor;
            this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
        }
    }

    drawText(x: number, y: number, txt: string, color: string){
        this.buffer.fillStyle = color;
        this.buffer.font = "30px Arial";
        this.buffer.fillText(txt, x, y);
    }

    drawEllipse(x: number, y: number, w: number, h: number, color: string){
        this.buffer.fillStyle = color;
        this.buffer.beginPath();
        this.buffer.ellipse(x, y, w, h, Math.PI / 4, 0, 2 * Math.PI);
        this.buffer.fill();
    }

    drawImg(x: number, y: number, w: number, h: number, imgSrc: string, tint: string = ""){
        let img = new Image();
        img.src = imgSrc;

        this.buffer.globalCompositeOperation='source-atop';
        this.buffer.drawImage(img, x, y, w, h);

        if(tint){
            this.buffer.globalCompositeOperation='color';
            this.buffer.fillStyle = tint;
            this.buffer.fillRect(x, y, w, h);
        }
        this.buffer.globalCompositeOperation='source-over';
        
    }

    drawRect(x: number, y: number, w: number, h: number, fill: string = "#000", stroke: string = "#000", lineWidth: number = 0){
        this.buffer.beginPath();
        this.buffer.rect(x, y, w, h);

        if(fill){
            this.buffer.fillStyle = fill;
            this.buffer.fill();
        }

        if(lineWidth){
            this.buffer.strokeStyle = stroke;
            this.buffer.lineWidth = lineWidth;
            this.buffer.stroke();
        }
    }

    render(){
        const ctxRatio = this.ctx.canvas.width / this.ctx.canvas.height;
        const bufferRatio = this.buffer.canvas.width / this.buffer.canvas.height;

        if(ctxRatio > bufferRatio){
            this.ctx.drawImage(this.buffer.canvas, (this.ctx.canvas.width - this.ctx.canvas.height * bufferRatio)/2, 0, this.ctx.canvas.height * bufferRatio, this.ctx.canvas.height);
        }else{
            this.ctx.drawImage(this.buffer.canvas, 0, (this.ctx.canvas.height - this.ctx.canvas.width / bufferRatio)/2, this.ctx.canvas.width, this.ctx.canvas.width / bufferRatio);
        }

        this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
        this.fillBackground();
    }

    resize(){
        this.ctx.canvas.width = this.ctx.canvas.parentElement.clientWidth;
        this.ctx.canvas.height = this.ctx.canvas.parentElement.clientHeight;
        
        if(this.maxRes){
            this.buffer.canvas.width = this.ctx.canvas.parentElement.clientWidth;
            this.buffer.canvas.height = this.ctx.canvas.parentElement.clientHeight;
        }
    }
}