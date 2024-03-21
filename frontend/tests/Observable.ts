export interface ObservableEvent {
  name: string;
  data: any;
}

export class Observable {
  private observers: Function[] = [];

  subscribe(callback: Function) {
    this.observers.push(callback);
  }

  notify(event: ObservableEvent) {
    for (const observer of this.observers) {
      observer(event);
    }
  }
}
