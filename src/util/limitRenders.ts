export const throttleExecution = <T extends (...args: any) => void>(fn: T, maxFps = 30): T => {
    let lastExecution = 0;
    return ((...args: any) => {
        const now = performance.now();
        if (now - lastExecution > 1000 / maxFps) {
            lastExecution = now;
            return fn(...args);
        }
    }) as T;
};

export const getFpsMeasure = (callback: (fps: number) => void) => {
    let thisSecond = 0;
    let framesThisSecond = 0;
    return () => {
        const second = Math.floor(performance.now() / 1000);
        if (thisSecond !== second) {
            thisSecond = second;

            callback(framesThisSecond);
            framesThisSecond = 0;
        }
        framesThisSecond++;
    };
};
