export type Callback = (...args: any[]) => any;

type CallbackTable = Record<string, Record<string, Callback[]>>;

type NameParts = {
  original: string;
  value: string;
  namespace: string;
};

export default class EventBus {
  private callbacks: CallbackTable;

  constructor() {
    this.callbacks = { base: {} }; // стабільний об’єкт base
  }

  on(_names: string, callback: Callback): this | false {
    if (!_names) return false;
    if (!callback) return false;

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      if (!this.callbacks[name.namespace]) {
        this.callbacks[name.namespace] = {};
      }

      if (!this.callbacks[name.namespace][name.value]) {
        this.callbacks[name.namespace][name.value] = [];
      }

      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string): this | false {
    if (!_names) return false;
    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace];
      } else {
        if (name.namespace === 'base') {
          for (const ns in this.callbacks) {
            delete this.callbacks[ns]?.[name.value];
            if (Object.keys(this.callbacks[ns]).length === 0) {
              delete this.callbacks[ns];
            }
          }
        } else {
          delete this.callbacks[name.namespace]?.[name.value];
          if (
            this.callbacks[name.namespace] &&
            Object.keys(this.callbacks[name.namespace]).length === 0
          ) {
            delete this.callbacks[name.namespace];
          }
        }
      }
    });

    return this;
  }

  trigger(_name: string, _args?: any[]): any {
    if (!_name) return false;

    let finalResult: any;
    const args = Array.isArray(_args) ? _args : [];

    const names = this.resolveNames(_name);
    const name = this.resolveName(names[0]);

    if (name.namespace === 'base') {
      for (const namespace in this.callbacks) {
        const arr = this.callbacks[namespace][name.value];
        if (arr) {
          arr.forEach((callback) => {
            const result = callback(...args);
            if (finalResult === undefined) {
              finalResult = result;
            }
          });
        }
      }
    } else {
      const arr = this.callbacks[name.namespace]?.[name.value];
      if (arr) {
        arr.forEach((callback) => {
          const result = callback(...args);
          if (finalResult === undefined) {
            finalResult = result;
          }
        });
      }
    }

    return finalResult;
  }

  private resolveNames(_names: string): string[] {
    return _names.replace(/[^a-zA-Z0-9 ,/.]/g, '').replace(/[,/]+/g, ' ').split(' ').filter(Boolean);
  }

  private resolveName(name: string): NameParts {
    const parts = name.split('.');
    return {
      original: name,
      value: parts[0],
      namespace: parts[1] || 'base',
    };
  }
}
