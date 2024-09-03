interface Counter {
  (start: number): string
  interval: number
  reset(): void
  reset1: () => void
}

interface IPoint {
  x: number
  y: number
  drawPoint: () => void
  getDistances: (p: IPoint) => number
}

class Point implements IPoint {
  // x: number
  // y: number
  constructor(public x: number, public y: number = 0) {
    // this.x = x
    // this.y = y
  }
  drawPoint = () => {
    console.log(this.x, this.y)
  }
  getDistances = (p: IPoint) => {
    return Math.pow(p.x - this.x, 2) + Math.pow(p.y = this.y, 2)
  }
}

/* let a = function(): (a: number) => number {
  return function(a: number) {
    console.log(a)
    return 1
  }
} */
