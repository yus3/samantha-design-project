import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Konva from 'konva';
import { Stage, Layer, Rect, Arc } from 'react-konva';

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;
const RECT_WIDTH = 20;
const RECT_HEIGHT = 100;
const CIRCLE_RADIUS = 50;
const RETRY_LIMIT = 500;

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

    componentWillMount() {
        document.title = 'Art or Not';
    }

    rectCalculateBoundingRectangle = (x, y, rotation) => {
        const rad = rotation * Math.PI / 180;
        const sine = Math.sin(rad);
        const cosine = Math.cos(rad);
        if (rotation <= 90) {
            return new BoundingRectangle(x-sine*RECT_HEIGHT, y, sine*RECT_HEIGHT+cosine*RECT_WIDTH, cosine*RECT_HEIGHT+sine*RECT_WIDTH);
        }
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

    checkCollision = (current) => {
        for (let i = 0; i < this.state.boundingRectangles.length; i++) {
            if (current.hasIntersection(this.state.boundingRectangles[i])) {
                return true;
            }
        }
        return false;
    };

    handleClick = () => {
        this.setState(state => {
            let shapeAdded = false;
            let newShapes = state.shapes;
            let newBoundingRectangles = state.boundingRectangles;
            let newShape, boundingRect;
            if (state.shapes.length % 8 === 0) {
                for (let i = 0; i < RETRY_LIMIT; i++) {
                    newShape = [Math.random()*(CANVAS_WIDTH-RECT_WIDTH), Math.random()*(CANVAS_HEIGHT-RECT_HEIGHT), Math.random()*180, this.getRandomColor()];
                    boundingRect = this.rectCalculateBoundingRectangle(newShape[0], newShape[1], newShape[2]);
                    if (boundingRect.isOffCanvas() || this.checkCollision(boundingRect)) {
                        continue;
                    } else {
                        shapeAdded = true;
                        break;
                    }
                }
            } else {
                for (let j = 0; j < RETRY_LIMIT; j++) {
                    newShape = [CIRCLE_RADIUS+Math.random()*(CANVAS_WIDTH-CIRCLE_RADIUS), CIRCLE_RADIUS+Math.random()*(CANVAS_HEIGHT-CIRCLE_RADIUS*2), Math.random()*360, this.getRandomColor()];
                    boundingRect = this.semiCircleCalculateBoundingRectangle(newShape[0], newShape[1], newShape[2]);
                    if (boundingRect.isOffCanvas() || this.checkCollision(boundingRect)) {
                        continue;
                    } else {
                        shapeAdded = true;
                        break;
                    }
                }

            }
            if (shapeAdded) {
                newShapes = state.shapes.concat(newShape);
                newBoundingRectangles = state.boundingRectangles.concat(boundingRect);
            } else {
                window.alert("Canvas Full");
                window.location.reload();
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
        // const boundingRectangles = [];

        for (let i = 0; i < this.state.shapes.length; i+=4) {
            if (i % 8 === 0) {
                shapeComponents.push(this.getRectangle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
            } else {
                shapeComponents.push(this.getSemiCircle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
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
                        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} stroke={"black"}/>
                        {shapeComponents}
                    </Layer>
                </Stage>
            </div>
        )
    }
}

ReactDOM.render(<RandomShapeFiller />, document.getElementById('root'));
