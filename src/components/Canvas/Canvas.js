import { useOnDraw } from '../../hooks/useOnDraw';
import './Canvas.scss';

export const Canvas = ({ width, height }) => {
  const setCanvasRef = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, '#000', 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  return (
    <canvas
      className="canvas"
      width={width}
      height={height}
      ref={setCanvasRef}
    />
  );
};
