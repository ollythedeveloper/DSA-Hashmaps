const { LinkedList, Node } = require('./LinkedList');

class ChainedMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._hashTable = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      return undefined
    }
    return this._hashTable[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > ChainedMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * ChainedMap.SIZE_RATIO);
    }
    //Find the slot where this key should be in

    const index = this._findSlot(key);
    if (!this._hashTable[index]) {
      this.length++;
    }

    if (this.get(key) === undefined) {
      this._hashTable[index] = {
        key,
        value,
        DELETED: false
      }
    }
    else if (typeof this.get(key) === "string") {
      const list = new LinkedList();
      list.insertLast({ value, DELETED: false })
      this._hashTable[index] = {
        key,
        value: list
      };
    }
    else {
      this.get(key).insertLast({ value, DELETED: false })
    }
  }

  delete(key) {
    const index = this._findSlot(key);
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.DELETED = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = ChainedMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._hashTable[index];
      if (slot === undefined || (slot.key === key && !slot.DELETED)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._hashTable = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.DELETED) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      //Bitwise left shift with 5 0s - this would be similar to
      //hash*31, 31 being the decent prime number
      //but bit shifting is a faster way to do this
      hash = (hash << 5) + hash + string.charCodeAt(i);
      //converting hash to a 32 bit integer
      hash = hash & hash;
    }
    //making sure hash is a non-negtive number. 
    return hash >>> 0;
  }
}

ChainedMap.MAX_LOAD_RATIO = 0.5
ChainedMap.SIZE_RATIO = 3

function main() {
    const lotr = new ChainedMap();
     lotr.set('Hobbit', 'Bilbo')
     lotr.set('Hobbit', 'Frodo')
     lotr.set('Wizard', 'Gandalf')
     lotr.set('Elf', 'Legolas')
     lotr.set('Maiar', 'The Necromancer')
     lotr.set('Maiar', 'Sauron')
     lotr.set('RingBearer', 'Gollum')
     lotr.set('LadyOfLight', 'Galadriel')
     lotr.set('HalfEleven', 'Arwen')
     lotr.set('Ent', 'Treebeard')
     return lotr
}



console.log(main())

module.exports = ChainedMap;