const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const text = param("text") || param("q") || "CODE";
let particles = [];
let adjustX = 0;
let adjustY = 0;
let padding = 20;
const widthRatio = window.innerWidth / 1366;
console.log(widthRatio);
let mouse = {
  x: null,
  y: null,
  radius: canvas.width / 10
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener("mousedown", () => (mouse.radius = canvas.width / 2));
window.addEventListener("mouseup", () => (mouse.radius = canvas.width / 10));
ctx.fillStyle = "white";
ctx.font = `${param("res") || 30}px ${param("font") || "monospace"}`;
var _text = ctx.measureText(text);
_text.height = _text.actualBoundingBoxAscent + _text.actualBoundingBoxDescent;
ctx.fillText(text, 0, _text.height);
const data = ctx.getImageData(0, 0, _text.width, _text.height);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.base = {};
    this.base.x = this.x;
    this.base.y = this.y;
    this.density = Math.random() * 40 + 5;
  }
  draw() {
    ctx.fillStyle = this.distance < mouse.radius + 30 ? "#8ff" : "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * widthRatio, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    this.distance = distance;
    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.base.x) {
        let dx = this.x - this.base.x;
        this.x -= dx / 10;
      }
      if (this.y !== this.base.y) {
        let dy = this.y - this.base.y;
        this.y -= dy / 10;
      }
    }
  }
}

function init() {
  particles = [];
  for (let y = 0, y2 = data.height; y < y2; y++) {
    for (let x = 0, x2 = data.width; x < x2; x++) {
      if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
        let scale = _text.height > _text.width ? _text.height : _text.width;
        let cS = canvas.height > canvas.width ? canvas.height : canvas.width;
        cS = cS - padding;
        scale = cS / scale;
        adjustY = (canvas.height / 2 - (_text.height / 2) * scale) / scale;
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particles.push(
          new Particle(positionX * scale + padding / 2, positionY * scale)
        );
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();

function connect() {
  // return;
  let opacityValue = 1;
  let maxDist = parseInt(param("connectionDistance") || 50) * widthRatio;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacityValue = 1 - distance / maxDist;
      if (Math.random() < 0) continue;
      if (distance < maxDist) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
        ctx.lineWidth = Math.round(widthRatio);
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}
function param(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
