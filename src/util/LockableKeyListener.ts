import { KeyListener } from 'react-game-kit';

export type KeyLock = symbol;

export class LockableKeyListener extends KeyListener {
    private locks: KeyLock[] = [];

    public readonly KEY_I = 73;
    public readonly KEY_P = 80;
    public readonly ENTER = 13;

    public acquireLock(): KeyLock {
        const lock: KeyLock = Symbol();
        this.locks.push(lock);
        return lock;
    }

    public releaseLock(lock: KeyLock) {
        this.locks = this.locks.filter(l => l !== lock);
    }

    public forceClearLock() {
        this.locks = [];
    }

    public isDown(key: number, lock?: KeyLock) {
        return (this.locks.length === 0 || this.locks[this.locks.length - 1] === lock) && super.isDown(key);
    }
}
