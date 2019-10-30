import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Konva from 'konva';
import { Stage, Layer, Rect, Arc } from 'react-konva';

const CANVAS_SIZE = 300;
const RECT_WIDTH = 20;
const RECT_HEIGHT = 100;
const CIRCLE_RADIUS = 50;
const CIRCLE_ROTATION = 90;

class RandomShapeFiller extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shapes : [],
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        this.setState(state => {
            let newShapes;
            if (state.shapes.length % 8 === 0) {
                newShapes = state.shapes.concat([Math.random()*(CANVAS_SIZE-RECT_WIDTH), Math.random()*(CANVAS_SIZE-RECT_HEIGHT), true, this.getRandomColor()]);
            } else {
                newShapes = state.shapes.concat([CIRCLE_RADIUS+Math.random()*(CANVAS_SIZE-CIRCLE_RADIUS), CIRCLE_RADIUS+Math.random()*(CANVAS_SIZE-CIRCLE_RADIUS*2), CIRCLE_ROTATION, this.getRandomColor()]);
            }
            return {
                shapes: newShapes,
            };
        });
    };

    getRandomColor() {
        return Konva.Util.getRandomColor();
    };

    getRectangle(x, y, isFilled, fillColor) {
        return (<Rect
                x={x}
                y={y}
                width={RECT_WIDTH}
                height={RECT_HEIGHT}
                fill={isFilled ? fillColor :""}
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

    render() {
        // {this.getSemiCircle(100, 100, 50, 90, this.getRandomColor())}
        // {this.getRectangle(100, 100, 20, 100, true, this.getRandomColor(), false)}
        const shapeComponents = [];

        for (let i = 0; i < this.state.shapes.length; i+=4) {
            if (i % 8 === 0) {
                shapeComponents.push(this.getRectangle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
            } else {
                shapeComponents.push(this.getSemiCircle(this.state.shapes[i+0], this.state.shapes[i+1], this.state.shapes[i+2], this.state.shapes[i+3]));
            }
        }

        return (
            <div className="centered">
                <p>{this.state.shapes.length}</p>
                <Stage width={CANVAS_SIZE} height={CANVAS_SIZE} onClick={this.handleClick}>
                    <Layer>
                        <Rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} stroke={"black"}/>
                        {shapeComponents}
                    </Layer>
                </Stage>
            </div>
        )
    }
}




ReactDOM.render(<RandomShapeFiller />, document.getElementById('root'));
