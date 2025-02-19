// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/** @jsxImportSource @emotion/react */
import * as React from "react";
import {
    TUpdateViewRangeTimeFunction,
    ViewRange,
    ViewRangeTimeUpdate,
    TNil,
} from "../..";
import DraggableManager, {
    DraggableBounds,
    DraggingUpdate,
    EUpdateTypes,
} from "../../utils/DraggableManager";
import Button from "@mui/material/Button";
import { css } from "@emotion/react";

import GraphTicks from "./GraphTicks";
import Scrubber from "./Scrubber";
import styled from "@emotion/styled";
const ViewingLayerResetZoomHoverClassName =
    "JaegerUiComponents__ViewingLayerResetZoomHoverClassName";

const ViewingLayerResetZoom = css`
    display: none;
    position: absolute;
    right: 1%;
    top: 10%;
    z-index: 1;
    background-color: hsla(210, 12%, 16%, 16%);
    color: hsl(210, 12%, 16%);
    &:hover {
        background-color: hsla(210, 12%, 16%, 20%);
        color: hsl(210, 12%, 16%);
        
    }
`;
const ViewingLayer = styled.div`
    cursor: vertical-text;
    position: relative;
    z-index: 1;
    &:hover > .${ViewingLayerResetZoomHoverClassName} {
        display: unset;
    }
`;
const ViewingLayerGraph = styled.svg<{theme:any}>`
    border: 1px solid ${({theme})=> theme.buttonBorder};
    /* need !important here to overcome something from semantic UI */
    overflow: visible !important;
    position: relative;
    transform-origin: 0 0;
    width: 100%;
`;
const ViewingLayerFullOverlay = styled.div`
    bottom: 0;
    cursor: col-resize;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    user-select: none;
`;
const ViewingLayerInactive = styled.rect`
    fill: rgba(214, 214, 214, 0.5);
`;
const ViewingLayerCursorGuide = styled.line`
    stroke: #f44;
    stroke-width: 1;
`;
const ViewingLayerDrag = styled.rect`
    fill: #44f;
`;
const ViewingLayerDraggedShift2 = styled.rect`
    fill-opacity: 0.2;
    fill: #44f;
`;

type ViewingLayerProps = {
    theme:any;
    height: number;
    numTicks: number;
    updateViewRangeTime: TUpdateViewRangeTimeFunction;
    updateNextViewRangeTime: (update: ViewRangeTimeUpdate) => void;
    viewRange: ViewRange;
};

type ViewingLayerState = {
    /**
     * Cursor line should not be drawn when the mouse is over the scrubber handle.
     */
    preventCursorLine: boolean;
};

/**
 * Designate the tags for the different dragging managers. Exported for tests.
 */
export const dragTypes = {
    /**
     * Tag for dragging the right scrubber, e.g. end of the current view range.
     */
    SHIFT_END: "SHIFT_END",
    /**
     * Tag for dragging the left scrubber, e.g. start of the current view range.
     */
    SHIFT_START: "SHIFT_START",
    /**
     * Tag for dragging a new view range.
     */
    REFRAME: "REFRAME",
};

/**
 * Returns the layout information for drawing the view-range differential, e.g.
 * show what will change when the mouse is released. Basically, this is the
 * difference from the start of the drag to the current position.
 *
 * @returns {{ x: string, width: string, leadginX: string }}
 */
function getNextViewLayout(start: number, position: number) {
    const [left, right] =
        start < position ? [start, position] : [position, start];
    return {
        x: `${left * 100}%`,
        width: `${(right - left) * 100}%`,
        leadingX: `${position * 100}%`,
    };
}

/**
 * `ViewingLayer` is rendered on top of the Canvas rendering of the minimap and
 * handles showing the current view range and handles mouse UX for modifying it.
 */
export class UnthemedViewingLayer extends React.PureComponent<
    ViewingLayerProps,
    ViewingLayerState
> {
    state: ViewingLayerState;

    _root: Element | TNil;

    /**
     * `_draggerReframe` handles clicking and dragging on the `ViewingLayer` to
     * redefined the view range.
     */
    _draggerReframe: DraggableManager;

    /**
     * `_draggerStart` handles dragging the left scrubber to adjust the start of
     * the view range.
     */
    _draggerStart: DraggableManager;

    /**
     * `_draggerEnd` handles dragging the right scrubber to adjust the end of
     * the view range.
     */
    _draggerEnd: DraggableManager;

    constructor(props: ViewingLayerProps) {
        super(props);

        this._draggerReframe = new DraggableManager({
            getBounds: this._getDraggingBounds,
            onDragEnd: this._handleReframeDragEnd,
            onDragMove: this._handleReframeDragUpdate,
            onDragStart: this._handleReframeDragUpdate,
            onMouseMove: this._handleReframeMouseMove,
            onMouseLeave: this._handleReframeMouseLeave,
            tag: dragTypes.REFRAME,
        });

        this._draggerStart = new DraggableManager({
            getBounds: this._getDraggingBounds,
            onDragEnd: this._handleScrubberDragEnd,
            onDragMove: this._handleScrubberDragUpdate,
            onDragStart: this._handleScrubberDragUpdate,
            onMouseEnter: this._handleScrubberEnterLeave,
            onMouseLeave: this._handleScrubberEnterLeave,
            tag: dragTypes.SHIFT_START,
        });

        this._draggerEnd = new DraggableManager({
            getBounds: this._getDraggingBounds,
            onDragEnd: this._handleScrubberDragEnd,
            onDragMove: this._handleScrubberDragUpdate,
            onDragStart: this._handleScrubberDragUpdate,
            onMouseEnter: this._handleScrubberEnterLeave,
            onMouseLeave: this._handleScrubberEnterLeave,
            tag: dragTypes.SHIFT_END,
        });

        this._root = undefined;
        this.state = {
            preventCursorLine: false,
        };
    }

    componentWillUnmount() {
        this._draggerReframe.dispose();
        this._draggerEnd.dispose();
        this._draggerStart.dispose();
    }

    _setRoot = (elm: SVGElement | TNil) => {
        this._root = elm;
    };

    _getDraggingBounds = (tag: string | TNil): DraggableBounds => {
        if (!this._root) {
            throw new Error("invalid state");
        }
        const { left: clientXLeft, width } = this._root.getBoundingClientRect();
        const [viewStart, viewEnd] = this.props.viewRange.time.current;
        let maxValue = 1;
        let minValue = 0;
        if (tag === dragTypes.SHIFT_START) {
            maxValue = viewEnd;
        } else if (tag === dragTypes.SHIFT_END) {
            minValue = viewStart;
        }
        return { clientXLeft, maxValue, minValue, width };
    };

    _handleReframeMouseMove = ({ value }: DraggingUpdate) => {
        this.props.updateNextViewRangeTime({ cursor: value });
    };

    _handleReframeMouseLeave = () => {
        this.props.updateNextViewRangeTime({ cursor: null });
    };

    _handleReframeDragUpdate = ({ value }: DraggingUpdate) => {
        const shift = value;
        const { time } = this.props.viewRange;
        const anchor = time.reframe ? time.reframe.anchor : shift;
        const update = { reframe: { anchor, shift } };
        this.props.updateNextViewRangeTime(update);
    };

    _handleReframeDragEnd = ({ manager, value }: DraggingUpdate) => {
        const { time } = this.props.viewRange;
        const anchor = time.reframe ? time.reframe.anchor : value;
        const [start, end] = value < anchor ? [value, anchor] : [anchor, value];
        manager.resetBounds();
        this.props.updateViewRangeTime(start, end, "minimap");
    };

    _handleScrubberEnterLeave = ({ type }: DraggingUpdate) => {
        const preventCursorLine = type === EUpdateTypes.MouseEnter;
        this.setState({ preventCursorLine });
    };

    _handleScrubberDragUpdate = ({
        event,
        tag,
        type,
        value,
    }: DraggingUpdate) => {
        if (type === EUpdateTypes.DragStart) {
            event.stopPropagation();
        }
        if (tag === dragTypes.SHIFT_START) {
            this.props.updateNextViewRangeTime({ shiftStart: value });
        } else if (tag === dragTypes.SHIFT_END) {
            this.props.updateNextViewRangeTime({ shiftEnd: value });
        }
    };

    _handleScrubberDragEnd = ({ manager, tag, value }: DraggingUpdate) => {
        const [viewStart, viewEnd] = this.props.viewRange.time.current;
        let update: [number, number];
        if (tag === dragTypes.SHIFT_START) {
            update = [value, viewEnd];
        } else if (tag === dragTypes.SHIFT_END) {
            update = [viewStart, value];
        } else {
            // to satisfy flow
            throw new Error("bad state");
        }
        manager.resetBounds();
        this.setState({ preventCursorLine: false });
        this.props.updateViewRangeTime(update[0], update[1], "minimap");
    };

    /**
     * Resets the zoom to fully zoomed out.
     */
    _resetTimeZoomClickHandler = () => {
        this.props.updateViewRangeTime(0, 1);
    };

    /**
     * Renders the difference between where the drag started and the current
     * position, e.g. the red or blue highlight.
     *
     * @returns React.Node[]
     */
    _getMarkers(from: number, to: number) {
        // const styles = getStyles(this.props.theme);
        const layout = getNextViewLayout(from, to);
        return [
            <ViewingLayerDraggedShift2
                key="fill"
                x={layout.x}
                y="0"
                width={layout.width}
                height={this.props.height - 2}
            />,
            <ViewingLayerDrag
                key="edge"
                x={layout.leadingX}
                y="0"
                width="1"
                height={this.props.height - 2}
            />,
        ];
    }

    render() {
        const { height, viewRange, numTicks /* , theme */ } = this.props;
        const { preventCursorLine } = this.state;
        const { current, cursor, shiftStart, shiftEnd, reframe } =
            viewRange.time;
        const haveNextTimeRange =
            shiftStart != null || shiftEnd != null || reframe != null;
        const [viewStart, viewEnd] = current;
        let leftInactive = 0;
        if (viewStart) {
            leftInactive = viewStart * 100;
        }
        let rightInactive = 100;
        if (viewEnd) {
            rightInactive = 100 - viewEnd * 100;
        }
        let cursorPosition: string | undefined;
        if (!haveNextTimeRange && cursor != null && !preventCursorLine) {
            cursorPosition = `${cursor * 100}%`;
        }
        // const styles = getStyles(theme);

        return (
            <ViewingLayer aria-hidden style={{ height }}>
                {(viewStart !== 0 || viewEnd !== 1) && (
                    <Button
                        onClick={this._resetTimeZoomClickHandler}
                        css={ViewingLayerResetZoom}
                        className={ViewingLayerResetZoomHoverClassName}
                        type="button"
                        variant="contained"
                    >
                        Reset Selection
                    </Button>
                )}
                <ViewingLayerGraph 
                    theme={this.props.theme}
                    height={height}
                    ref={this._setRoot}
                    onMouseDown={this._draggerReframe.handleMouseDown}
                    onMouseLeave={this._draggerReframe.handleMouseLeave}
                    onMouseMove={this._draggerReframe.handleMouseMove}
                >
                    {leftInactive > 0 && (
                        <ViewingLayerInactive
                            x={0}
                            y={0}
                            height="100%"
                            width={`${leftInactive}%`}
                        />
                    )}
                    {rightInactive > 0 && (
                        <ViewingLayerInactive
                            x={`${100 - rightInactive}%`}
                            y={0}
                            height="100%"
                            width={`${rightInactive}%`}
                        />
                    )}
                    <GraphTicks numTicks={numTicks} />
                    {cursorPosition && (
                        <ViewingLayerCursorGuide
                            x1={cursorPosition}
                            y1="0"
                            x2={cursorPosition}
                            y2={height - 2}
                            strokeWidth="1"
                        />
                    )}
                    {shiftStart != null &&
                        this._getMarkers(viewStart, shiftStart)}
                    {shiftEnd != null && this._getMarkers(viewEnd, shiftEnd)}
                    <Scrubber
                        isDragging={shiftStart != null}
                        onMouseDown={this._draggerStart.handleMouseDown}
                        onMouseEnter={this._draggerStart.handleMouseEnter}
                        onMouseLeave={this._draggerStart.handleMouseLeave}
                        position={viewStart || 0}
                    />
                    <Scrubber
                        isDragging={shiftEnd != null}
                        position={viewEnd || 1}
                        onMouseDown={this._draggerEnd.handleMouseDown}
                        onMouseEnter={this._draggerEnd.handleMouseEnter}
                        onMouseLeave={this._draggerEnd.handleMouseLeave}
                    />
                    {reframe != null &&
                        this._getMarkers(reframe.anchor, reframe.shift)}
                </ViewingLayerGraph>
                {/* fullOverlay updates the mouse cursor blocks mouse events */}
                {haveNextTimeRange && <ViewingLayerFullOverlay />}
            </ViewingLayer>
        );
    }
}

export default /* withTheme2( */ UnthemedViewingLayer /* ) */;
