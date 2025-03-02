import EventEmitter from "events";

const emitter = new EventEmitter();

export const emit = (event: string, data: UpdateEvent) => {
  emitter.emit(event, data);
};

export const register = (event: string, callbackFn: (...args: any[]) => void) => {
  emitter.on(event, callbackFn);
};