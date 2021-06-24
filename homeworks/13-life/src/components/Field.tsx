import React from 'react';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

const Field = observer(() => {
    const lifeStore = useStore('LifeStore');
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    React.useLayoutEffect(() => {
        if (canvasRef.current) {
            lifeStore.setContext(canvasRef.current.getContext('2d')!);

            const dpr = window.devicePixelRatio || 1;
            const { width, height } = canvasRef.current.getBoundingClientRect();

            canvasRef.current.width = width * dpr;
            canvasRef.current.height = height * dpr;
            if (lifeStore.ctx) {
                lifeStore.ctx.scale(dpr, dpr);
                canvasRef.current.style.height = height + 'px';
                canvasRef.current.style.width = width + 'px';
            }
        }
    }, [lifeStore]);

    return (
        <div>
            <canvas
                width={lifeStore.canvasWidth}
                height={lifeStore.canvasHeight}
                ref={canvasRef}
                onClick={lifeStore.addCell}
            />
            <div>{lifeStore.status}</div>
            <div>
                <button onClick={lifeStore.setField}>Set Field</button>
                <button
                    onClick={lifeStore.status === 'in progress' ? lifeStore.pauseGame : lifeStore.startGame}
                    disabled={!lifeStore.grid.length}
                >
                    {lifeStore.status === 'in progress' ? 'Pause Game' : 'Start Game'}
                </button>
                <button onClick={lifeStore.clearField}>Clear Field</button>
            </div>
        </div>
    );
});

export default Field;
