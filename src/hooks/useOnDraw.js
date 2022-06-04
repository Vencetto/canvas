import { useRef } from 'react';
import { useEffectOnce } from './useEffectOnce';

export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  console.log('useOnDraw called')
  const mouseUpListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseMoveListenerRef = useRef(null);

  const prevPointRef = useRef(null);

  useEffectOnce(() => {
    console.log('effect init', new Date().getMilliseconds())
    return () => {
      console.log('effect return', new Date().getMilliseconds())
      if (mouseMoveListenerRef.current) {
        window.removeEventListener('mousemove', mouseMoveListenerRef.current);
        console.log('mouseMoveListener removed');
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener('mouseup', mouseUpListenerRef.current);
        console.log('mouseUpListener removed');
      }
    };
  }, []);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      console.log('mouseDownListener removed');
      canvasRef.current.removeEventListener(
        'mousedown',
        mouseDownListenerRef.current
      );
    }
    canvasRef.current = ref;
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext('2d');

        if (onDraw) onDraw(ctx, point, prevPointRef.current);
        prevPointRef.current = point;
        console.log(point);
      }
    };
    mouseMoveListenerRef.current = mouseMoveListener;
    console.log('initMouseMoveListener called');
    window.addEventListener('mousemove', mouseMoveListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;

    const listener = () => {
      isDrawingRef.current = true;
    };
    mouseDownListenerRef.current = listener;
    console.log('initMouseDownListener called');
    canvasRef.current.addEventListener('mousedown', listener);
  }

  function initMouseUpListener() {
    const listener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };
    mouseUpListenerRef.current = listener;
    console.log('initMouseUpListener called');

    window.addEventListener('mouseup', listener);
  }

  function computePointInCanvas(clientX, clientY) {
    if (!canvasRef.current) return null;

    const boundingRect = canvasRef.current.getBoundingClientRect();

    return { x: clientX - boundingRect.left, y: clientY - boundingRect.top };
  }

  console.log('hook is called');
  return setCanvasRef;
}
