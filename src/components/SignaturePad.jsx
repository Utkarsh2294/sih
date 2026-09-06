import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Eraser, PenLine } from 'lucide-react';
import Button from './ui/Button';

const SignaturePad = ({ onConfirm }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);

  const point = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const source = event.touches?.[0] || event;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const start = (event) => {
    event.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (event) => {
    if (!drawing.current) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = point(event);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f766e';
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStroke(true);
  };

  const stop = () => { drawing.current = false; };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-dashed border-accent-400 bg-accent-50 p-3 text-sm font-semibold text-accent-950 dark:border-accent-700 dark:bg-accent-950/30 dark:text-accent-100">
        This is a demo signature for prototype purposes and is not legally binding.
      </div>
      <canvas
        ref={canvasRef}
        width="720"
        height="220"
        className="h-48 w-full touch-none rounded-2xl border border-slate-300 bg-white shadow-inner dark:border-slate-600"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
        aria-label="Draw your demo signature"
      />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" icon={Eraser} onClick={clear}>Clear</Button>
        <Button icon={PenLine} disabled={!hasStroke} onClick={onConfirm}>Confirm signature</Button>
      </div>
    </div>
  );
};

SignaturePad.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

export default SignaturePad;
