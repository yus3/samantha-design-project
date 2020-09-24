import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { exportComponentAsJPEG } from "react-component-export-image";

import Konva from 'konva';
import {Stage, Layer, Rect, RegularPolygon, Circle, Text} from 'react-konva';

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const CIRCLE_RADIUS = 25;
const RETRY_LIMIT = 500;
const SHAPE_TYPE_CIRCLE = 'circle';
const SHAPE_TYPE_SQUARE = 'square';
const SHAPE_TYPE_TRIANGLE = 'triangle';

class BoundingRectangle {
    constructor(x, y, width, height) {
        // this.id = i;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    toString = () => { return 'x: ' + this.x + ', y: ' + this.y + ', width: ' + this.width + ', height: ' + this.height };

    isOffCanvas() {
        return (this.x < 0 || this.y < 0 ||
            this.y + this.height > CANVAS_HEIGHT ||
            this.x + this.width > CANVAS_WIDTH);
    }

    hasIntersection(br){
        // if (br.getID() === this.i) { return false; };
        if (br.x === this.x && br.y === this.y && br.width === this.width && br.height === this.height) {
            return false;
        }
        return !(br.x > this.x + this.width ||
        br.x + br.width < this.x ||
        br.y > this.y + this.height ||
        br.y + br.height < this.y)
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

    componentDidMount() {
        document.title = 'Art or Not';
    }

    rectCalculateBoundingRectangle = (x, y, multiplier) => {
        return this.circleCalculateBoundingRectangle(x, y, multiplier);
    };

    circleCalculateBoundingRectangle = (x, y, multiplier) => {
        const r = CIRCLE_RADIUS * multiplier;
        return new BoundingRectangle(x-r, y-r, 2*r, 2*r);
    };

    triangleCalculateBoundingRectangle = (x, y, multiplier) => {
        return this.circleCalculateBoundingRectangle(x, y, multiplier);
    };

    checkCollision = (current) => {
        for (let i = 0; i < this.state.boundingRectangles.length; i++) {
            if (current.hasIntersection(this.state.boundingRectangles[i])) {
                return true;
            }
        }
        return false;
    };

    getShapeWithRetry = (shapeType) => {
        let shapeAdded = false;
        let newShape, boundingRect;
        for (let i = 0; i < RETRY_LIMIT; i++) {
            const multiplier = this.getRandomSizeMultiplier();
            const shapeRadius = CIRCLE_RADIUS * multiplier;
            const shapeLength = shapeRadius * 2;
            switch(shapeType) {
                case SHAPE_TYPE_SQUARE:
                    newShape = [Math.random()*(CANVAS_WIDTH-shapeLength), Math.random()*(CANVAS_HEIGHT-shapeLength), multiplier, Math.random()*90, this.getRandomColor()];
                    boundingRect = this.rectCalculateBoundingRectangle(newShape[0], newShape[1], newShape[2], newShape[3]);
                    break;
                case SHAPE_TYPE_CIRCLE:
                    newShape = [shapeRadius+Math.random()*(CANVAS_WIDTH-shapeRadius), shapeRadius+Math.random()*(CANVAS_HEIGHT-shapeRadius*2), multiplier, 0, this.getRandomColor()];
                    boundingRect = this.circleCalculateBoundingRectangle(newShape[0], newShape[1], newShape[2]);
                    break;
                case SHAPE_TYPE_TRIANGLE:
                    newShape = [Math.random()*(CANVAS_WIDTH-shapeRadius), Math.random()*(CANVAS_HEIGHT-shapeRadius), multiplier, Math.random()*120, this.getRandomColor()];
                    boundingRect = this.triangleCalculateBoundingRectangle(newShape[0], newShape[1], newShape[2]);
                    break;
                default:
                    break;
            }
            if (boundingRect.isOffCanvas() || this.checkCollision(boundingRect)) {
                continue;
            } else {
                shapeAdded = true;
                break;
            }
        }
        return [shapeAdded, newShape, boundingRect];
    };

    handleClick = () => {
        this.setState(state => {
            let newShapes = state.shapes;
            let newBoundingRectangles = state.boundingRectangles;
            let shapeResult;
            switch (state.shapes.length % 15) {
                case 0:
                    shapeResult = this.getShapeWithRetry(SHAPE_TYPE_SQUARE);
                    break;
                case 5:
                    shapeResult = this.getShapeWithRetry(SHAPE_TYPE_CIRCLE);
                    break;
                case 10:
                    shapeResult = this.getShapeWithRetry(SHAPE_TYPE_TRIANGLE);
                    break;
                default:
                    break;
            }
            const shapeAdded = shapeResult[0];
            const newShape = shapeResult[1];
            const boundingRect = shapeResult[2];
            if (shapeAdded) {
                newShapes = state.shapes.concat(newShape);
                newBoundingRectangles = state.boundingRectangles.concat(boundingRect);
            } else {
                window.alert("Canvas is full\nYou can scroll down to export your masterpiece or reset the canvas");
            }
            return {
                shapes: newShapes,
                boundingRectangles: newBoundingRectangles,
            };
        });
    };

    getRandomColor() {
        return Konva.Util.getRandomColor();
    }

    getRandomSizeMultiplier() {
        // 1, 2 or 3
        return Math.floor(Math.random() * 3 + 1);
    }

    getSquare(x, y, multiplier, rotation, fillColor) {
        return (<RegularPolygon
                x={x}
                y={y}
                sides={4}
                radius={CIRCLE_RADIUS*multiplier}
                fill={fillColor}
                rotation={rotation}
            />);
    }

    getCircle(x, y, multiplier, rotation, fillColor) {
        return (<Circle
            x={x}
            y={y}
            radius={CIRCLE_RADIUS*multiplier}
            fill={fillColor}
        />);
    }

    getTriangle(x, y, multiplier, rotation, fillColor) {
        return (<RegularPolygon
            x={x}
            y={y}
            sides={3}
            radius={CIRCLE_RADIUS*multiplier}
            fill={fillColor}
            rotation={rotation}
        />);
    };

    getBoundingRectangles(x, y, w, h) {
        return (<Rect x={x} y={y} width={w} height={h} stroke={"green"}/>);
    }

    render() {
        const shapeComponents = [];
        const boundingRectangles = [];

        for (let i = 0; i < this.state.shapes.length; i+=5) {
            switch(i % 15) {
                case 0:
                    shapeComponents.push(this.getSquare(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3], this.state.shapes[i+4]));
                    break;
                case 5:
                    shapeComponents.push(this.getCircle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3], this.state.shapes[i+4]));
                    break;
                case 10:
                    shapeComponents.push(this.getTriangle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3], this.state.shapes[i+4]));
                    break;
                default:
                    break;
            }
        }

        // for (let j = 0; j < this.state.boundingRectangles.length; j++) {
        //     const br = this.state.boundingRectangles[j];
        //     boundingRectangles.push(this.getBoundingRectangles(br.x, br.y, br.width, br.height));
        // }

        return (
            <div className="centered">
                <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={this.handleClick}>
                    <Layer>
                        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} stroke={"white"} fill={"white"}/>
                        {shapeComponents.length === 0 && <Text x={CANVAS_WIDTH/2-95} y={CANVAS_HEIGHT/2} text={"click to add a random shape"} fontSize={15} align={'center'}></Text>}
                        {shapeComponents.length === 0 && <Text x={CANVAS_WIDTH/2-100} y={CANVAS_HEIGHT-30} text={"scroll down for saving options"} fontSize={15} align={'center'}></Text>}
                        {shapeComponents}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

export default class ShapeFillerWithButton extends React.Component {
    constructor(props) {
        super(props);
        this.componentRef = React.createRef();
    }

    render() {
        return (
            <React.Fragment>
                <RandomShapeFiller ref={this.componentRef} />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <button onClick={() => exportComponentAsJPEG(this.componentRef)} style={{margin: "5px"}}>Export as JPEG</button>
                    <button onClick={() => window.location.reload()} style={{margin: "5px"}}>Reset Canvas</button>
                </div>
            </React.Fragment>);
    }
}

ReactDOM.render(<ShapeFillerWithButton />, document.getElementById('root'));
