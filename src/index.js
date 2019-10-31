import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Konva from 'konva';
import { Stage, Layer, Rect, Arc } from 'react-konva';

const CANVAS_SIZE = 300;
const RECT_WIDTH = 20;
const RECT_HEIGHT = 100;
const CIRCLE_RADIUS = 50;

class BoundingRectangle {
    constructor(x, y, width, height) {
        // this.id = i;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // getID() { return this.id; };
    getX() { return this.x; };
    getY() { return this.y; };
    getWidth() { return this.width; };
    getHeight() { return this.height; };

    haveIntersection(br) {
        // if (br.getID() === this.i) { return false; };
        if (br.getX() === this.x && br.getY() === this.y && br.getWidth() === this.width && br.getHeight() === this.height) {
            return false;
        }
        return !(br.getX() > this.x + this.width ||
        br.getX() + br.getWidth() < this.x ||
        br.getY() > this.y + this.height ||
        br.getY() + br.getHeight() < this.y)
    };
}

class RandomShapeFiller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shapes : [],
            boundingRectangles : []
        };

        this.handleClick = this.handleClick.bind(this);
    }

    rectCalculateBoundingRectangle = (x, y, rotation) => {
        const rad = rotation * Math.PI / 180;
        const sine = Math.sin(rad);
        const cosine = Math.cos(rad);
        if (rotation <= 90) {
            return new BoundingRectangle(x-sine*RECT_HEIGHT, y, sine*RECT_HEIGHT+cosine*RECT_WIDTH, cosine*RECT_HEIGHT+sine*RECT_WIDTH);
        }
        console.log(x, y, sine*RECT_HEIGHT, cosine*RECT_HEIGHT, sine*RECT_WIDTH, cosine*RECT_WIDTH)
        return new BoundingRectangle(x-sine*RECT_HEIGHT+cosine*RECT_WIDTH, y+cosine*RECT_HEIGHT, sine*RECT_HEIGHT-cosine*RECT_WIDTH, -cosine*RECT_HEIGHT+sine*RECT_WIDTH);
    };

    semiCircleCalculateBoundingRectangle = (x, y, rotation) => {
        const rad = rotation * Math.PI / 180;
        const sine = Math.sin(rad);
        const cosine = Math.cos(rad);

        if (rotation <= 90) {
            return new BoundingRectangle(x-CIRCLE_RADIUS, y-sine*CIRCLE_RADIUS, CIRCLE_RADIUS+cosine*CIRCLE_RADIUS, CIRCLE_RADIUS+sine*CIRCLE_RADIUS);
        } else if (rotation <= 180) {
            return new BoundingRectangle(x-CIRCLE_RADIUS, y-CIRCLE_RADIUS, CIRCLE_RADIUS-cosine*CIRCLE_RADIUS, CIRCLE_RADIUS+sine*CIRCLE_RADIUS);
        } else if (rotation <= 270) {
            return new BoundingRectangle(x+cosine*CIRCLE_RADIUS, y-CIRCLE_RADIUS, CIRCLE_RADIUS-cosine*CIRCLE_RADIUS, CIRCLE_RADIUS-sine*CIRCLE_RADIUS);
        }
        return new BoundingRectangle(x-cosine*CIRCLE_RADIUS, y+sine*CIRCLE_RADIUS, CIRCLE_RADIUS+cosine*CIRCLE_RADIUS, CIRCLE_RADIUS-sine*CIRCLE_RADIUS);
    };

    handleClick = () => {
        this.setState(state => {
            let newShapes;
            let newBoundingRectangles;
            if (state.shapes.length % 8 === 0) {
                const newRect = [Math.random()*(CANVAS_SIZE-RECT_WIDTH), Math.random()*(CANVAS_SIZE-RECT_HEIGHT), Math.random()*180, this.getRandomColor()];
                newShapes = state.shapes.concat(newRect);
                newBoundingRectangles = state.boundingRectangles.concat(this.rectCalculateBoundingRectangle(newRect[0], newRect[1], newRect[2]));
            } else {
                const newSemiCircle = [CIRCLE_RADIUS+Math.random()*(CANVAS_SIZE-CIRCLE_RADIUS), CIRCLE_RADIUS+Math.random()*(CANVAS_SIZE-CIRCLE_RADIUS*2), Math.random()*360, this.getRandomColor()];
                newShapes = state.shapes.concat(newSemiCircle);
                newBoundingRectangles = state.boundingRectangles.concat(this.semiCircleCalculateBoundingRectangle(newSemiCircle[0], newSemiCircle[1], newSemiCircle[2]));
            }
            return {
                shapes: newShapes,
                boundingRectangles: newBoundingRectangles,
            };
        });
    };

    getRandomColor() {
        return Konva.Util.getRandomColor();
    };

    getRectangle(x, y, rotation, fillColor) {
        return (<Rect
                x={x}
                y={y}
                width={RECT_WIDTH}
                height={RECT_HEIGHT}
                fill={fillColor}
                rotation={rotation}
            />
            );
    };

    getSemiCircle(x, y, rotation, fillColor) {
        return (<Arc
            x={x}
            y={y}
            outerRadius={CIRCLE_RADIUS}
            fill={fillColor}
            angle={180}
            rotation={rotation}
        />);
    };

    getBoundingRectangles(x, y, w, h) {
        return (<Rect x={x} y={y} width={w} height={h} stroke={"green"}/>);
    };

    render() {
        const shapeComponents = [];
        const boundingRectangles = [];

        for (let i = 0; i < this.state.shapes.length; i+=4) {
            if (i % 8 === 0) {
                shapeComponents.push(this.getRectangle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
            } else {
                shapeComponents.push(this.getSemiCircle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
            }
        }

        for (let j = 0; j < this.state.boundingRectangles.length; j++) {
            const br = this.state.boundingRectangles[j];
            boundingRectangles.push(this.getBoundingRectangles(br.getX(), br.getY(), br.getWidth(), br.getHeight()));
        }

        return (
            <div className="centered">
                <Stage width={CANVAS_SIZE} height={CANVAS_SIZE} onClick={this.handleClick}>
                    <Layer>
                        <Rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} stroke={"black"}/>
                        {shapeComponents}
                        {boundingRectangles}
                    </Layer>
                </Stage>
            </div>
        )
    }
}




ReactDOM.render(<RandomShapeFiller />, document.getElementById('root'));
