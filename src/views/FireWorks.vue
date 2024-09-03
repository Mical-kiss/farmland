<template>
  <div class="fire-works">
    <canvas ref="canvasRef" width="300" height="600"></canvas>
  </div>
</template>

<script>
let ctx
let balls = []
let fires = []
let points1 = []
let textFires = []
let id
class Ball {
  constructor(options) {
    this.settings = Object.assign({
      color: 'yellow',
      r: 5,
      g: 0.1,
      end() {}
    }, options)
    for (let attr in this.settings) {
      this[attr] = this.settings[attr]
    }
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.g
  }
  render() {
    ctx.beginPath()
    ctx.fillStyle = this.color
    // console.log(this.x, this.y, this.r)
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    this.end()
  }
}
class Fire {
  constructor(options) {
    this.settings = Object.assign({
      color: 'yellow',
      r: 5,
      g: 0.1,
      fs: 0.95,
      life: 100,
      end() {}
    }, options)
    for (let attr in this.settings) {
      this[attr] = this.settings[attr]
    }
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.g
    this.vx *= this.fs
    this.vy *= this.fs
    if (this.life > 0 && this.life < 300) {
      this.life--
    }
  }
  render() {
    ctx.beginPath()
    ctx.fillStyle = this.color
    // console.log(this.x, this.y, this.r)
    ctx.arc(this.x, this.y, this.r * Math.min(this.life, 100) / 100, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    this.end()
  }
}
class TextFire {
  constructor(options) {
    this.settings = Object.assign({
      color: 'yellow',
      r: 5,
      g: 0.1,
      fs: 0.95,
      life: 100,
      end() {}
    }, options)
    for (let attr in this.settings) {
      this[attr] = this.settings[attr]
    }
  }
  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.life < 150) {
      this.vy += this.g
    }
    this.vx *= this.fs
    this.vy *= this.fs
    if (this.life > 0 && this.life < 300) {
      this.life--
    }
  }
  render() {
    ctx.beginPath()
    ctx.fillStyle = this.color
    // console.log(this.x, this.y, this.r)
    ctx.arc(this.x, this.y, this.r * Math.min(this.life, 100) / 100, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    this.end()
  }
}
function loadStatic(arr) {
  let promises = []
  for (let i = 0; i < arr.length; i++) {
    let promise = new Promise((res) => {
      let img = new Image()
      img.src = arr[i]
      img.onload = function() {
        res(img)
      }
    })
    promises.push(promise)
  }
  return Promise.all(promises)
}
function getImagePoints(img, level = 6) {
  let width = img.width
  let height = img.height
  let points = []
  let x = Math.floor(width / level)
  let y = Math.floor(height / level)
  let imgData = null
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.drawImage(img, 0, 0)
  ctx.closePath()
  imgData = ctx.getImageData(0, 0, width, height)
  ctx.clearRect(0, 0, width, height)
  points.w = width
  points.h = height

  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      let colors = getImageColor(imgData, j * level, i * level)
      // console.log(x, y, colors)
      if (colors[0] == 65) {
        points.push({x: j * level, y: i * level})
      }
    }
  }
  return points
}
function getImageColor(imgData, x, y) {
  let w = imgData.width
  // let h = imgData.height
  let d = imgData.data
  let colors = []
  colors[0] = d[(y * w + x) * 4]
  colors[1] = d[(y * w + x) * 4 + 1]
  colors[2] = d[(y * w + x) * 4 + 2]
  colors[3] = d[(y * w + x) * 4 + 3]
  return colors
}
export default {
  data() {
    return {}
  },
  mounted() {
    let canvas = this.$refs.canvasRef
    ctx = canvas.getContext('2d')
    let timer = null
    let count = 0
    let ballAll = 5
    let width = 300
    let height = 600

    timer = setInterval(() => {
      if (count === ballAll) {
        clearInterval(timer)
        count = 0
        timer = null
        balls.push(new Ball({
          r: 5,
          x: width / 2,
          y: height,
          vx: 0,
          vy: -10,
          end() {
            if (this.vy > 1) {
              balls.splice(balls.indexOf(this), 1)
              for (let i = 0; i < 60; i++) {
                let power = Math.random() * 10
                let vx = Math.cos(i * 6 * Math.PI / 180) * power
                let vy = Math.sin(i * 6 * Math.PI / 180) * power
                fires.push(new Fire({
                  r: 3,
                  x: this.x,
                  y: this.y,
                  vx,
                  vy,
                  life: 290,
                  g: 0.05,
                  end() {
                    if (this.life < 10) {
                      fires.splice(fires.indexOf(this), 1)
                    }
                  }
                }))
              }
              // console.log(points1)
              // debugger
              for (let i = 0; i < points1.length; i++) {
                let power = 0.05
                let vx = (points1[i].x - points1.w / 2) * power
                let vy = (points1[i].y - points1.h / 2) * power
                // debugger
                textFires.push(new TextFire({
                  x: this.x,
                  y: this.y,
                  vx,
                  vy,
                  g: 0.03,
                  life: 200,
                  r: 2.5,
                  color: '#41b883',
                  end() {
                    if (this.life < 10) {
                      textFires.splice(textFires.indexOf(this), 1)
                    }
                  }
                }))
              }
            }
          }
        }))
      } else {
        count++
        balls.push(new Ball({
          r: 3,
          x: Math.random() * width / 3 + width / 3,
          y: height,
          vx: Math.random() * 2 - 1,
          vy: -(Math.random() * 2 + 9),
          end() {
            if (this.vy > 1) {
              balls.splice(balls.indexOf(this), 1)
              let size = Math.random() * 10
              for (let i = 0; i < 60; i++) {
                let power = Math.random() * size
                let vx = Math.cos(i * 6 * Math.PI / 180) * power
                let vy = Math.sin(i * 6 * Math.PI / 180) * power
                fires.push(new Fire({
                  r: 3,
                  x: this.x,
                  y: this.y,
                  vx,
                  vy,
                  life: 290,
                  g: 0.05,
                  end() {
                    if (this.life < 10) {
                      fires.splice(fires.indexOf(this), 1)
                    }
                  }
                }))
              }
            }
          }
        }))
      }
    }, 500)
    loop()
    function loop() {
      if (balls.length) {
        ctx.fillStyle = 'rgba(85, 153, 238, 0.2)'
        ctx.fillRect(0, 0, width, height)
      } else {
        ctx.fillStyle = 'rgba(85, 153, 238)'
        ctx.fillRect(0, 0, width, height)
      }

      for(let i = 0; i < balls.length; i++) {
        balls[i].update()
        balls[i].render()
      }
      for(let i = 0; i < fires.length; i++) {
        fires[i].update()
        fires[i].render()
      }
      for(let i = 0; i < textFires.length; i++) {
        textFires[i].update()
        textFires[i].render()
      }
      id = requestAnimationFrame(loop)
    }

    loadStatic(['/img/logo.82b9c7a5.png']).then(res => {
      console.log(points1 = getImagePoints(res[0]))
    })
  },
  destroyed() {
    cancelAnimationFrame(id)
    console.log(222)
  }
}
</script>

<style lang="scss">
.fire-works {
  background: #5599ee;
  canvas {
    display: block;
    margin: 0 auto;
  }
}
</style>