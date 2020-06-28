import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Line = styled.div`
background-color: purple;
height: 3px;
width: ${props => props.height}px;
transform: rotateZ(${props => props.angle}deg);
position: absolute;
top: ${props => props.top}px;
left: ${props => props.left}px;
z-index: 5;
@media (max-width: 680px) {
  display: none;
}
`


export const MovementArrow = ({ lastMove, refs }) => {
    const [arrowLength, setArrowLength] = useState(0)
    const [arrowOriginTop, setArrowOriginTop] = useState(0)
    const [arrowOriginLeft, setArrowOriginLeft] = useState(0)
    const [arrowAngle, setArrowAngle] = useState(0)

    useEffect(() => {
        if (lastMove.movedFrom.row) {
            setArrowAngle(0)
            const movedFrom = refs[lastMove.movedFrom.row.toString() + lastMove.movedFrom.column.toString()].current.getBoundingClientRect()
            const movedTo = refs[lastMove.movedTo.row.toString() + lastMove.movedTo.column.toString()].current.getBoundingClientRect()
            const x1 = movedFrom.left + (movedFrom.width / 2)
            const x2 = movedTo.left + (movedFrom.width / 2)
            const y1 = movedFrom.top + (movedFrom.width / 2)
            const y2 = movedTo.top + (movedFrom.width / 2)
            const midX = (x1 + x2) / 2
            const midY = (y1 + y2) / 2
            const slope = Math.atan2(y1 - y2, x1 - x2)
            const distance = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))

            setArrowAngle((slope * 180) / Math.PI)
            setArrowLength(distance)
            setArrowOriginTop(midY)
            setArrowOriginLeft(midX - (distance / 2))

        } else {
            setArrowLength(0)
            setArrowOriginLeft(0)
            setArrowOriginTop(0)
            setArrowAngle(0)
        }

    }, [lastMove, refs])

    return (
        <Line height={arrowLength}
            top={arrowOriginTop}
            left={arrowOriginLeft}
            angle={arrowAngle}>
        </Line>
    )
}