import getFingerprintSecret from "./server/getFingerprintSecret";
import encode from "./encoder";

// Generators

async function canvasFingerprint() {
  const canvas = document.createElement("canvas");

  canvas.id = "tracker-canvas";
  canvas.width = 200;
  canvas.height = 40;
  canvas.style.border = "1px solid #000000";
  canvas.style.display == "none";

  document.body.appendChild(canvas);

  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgb(240,240,240)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function drawCircle(x, y, radius, fillStyle, strokeStyle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }

  drawCircle(100, 100, 70, "rgba(255, 0, 255, 0.6)", "rgba(0, 0, 0, 0.6)");
  drawCircle(150, 150, 50, "rgba(0, 255, 255, 0.7)", "rgba(255, 0, 0, 0.6)");
  drawCircle(200, 80, 40, "rgba(255, 255, 0, 0.5)", "rgba(0, 0, 255, 0.7)");

  ctx.beginPath();
  ctx.moveTo(300, 50);
  ctx.lineTo(350, 150);
  ctx.lineTo(250, 150);
  ctx.closePath();
  ctx.fillStyle = "rgba(128, 0, 128, 0.5)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 128, 128, 0.7)";
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(400, 200, 100, 50, Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 69, 0, 0.5)";
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
  ctx.stroke();
  ctx.closePath();

  ctx.save();
  ctx.translate(50, 300);
  ctx.rotate(-0.05);
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  const text = "✨🔍 This is a fingerprint generator 🎨🎉";
  const gradient = ctx.createLinearGradient(0, 0, 400, 0);
  gradient.addColorStop(0, "rgb(255,0,255)");
  gradient.addColorStop(1, "rgb(0,255,255)");
  ctx.font = '20px "Arial Black"';
  ctx.fillStyle = gradient;
  ctx.fillText(text, 0, 0);
  ctx.restore();

  ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
  ctx.fillRect(450, 50, 100, 100);
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillRect(480, 80, 100, 100);

  const txt = "abz190#$%^@£éú";
  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.font = '17px "Arial 17"';
  ctx.fillStyle = "rgb(255,5,5)";
  ctx.rotate(0.03);
  ctx.fillText(txt, 4, 17);
  ctx.restore();

  ctx.fillStyle = "rgb(155,255,5)";
  ctx.shadowBlur = 8;
  ctx.shadowColor = "red";
  ctx.fillRect(20, 12, 100, 5);

  const fixedCircles = [
    {
      x: 30,
      y: 30,
      radius: 15,
      fill: "rgba(255, 0, 0, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 60,
      y: 60,
      radius: 20,
      fill: "rgba(0, 255, 0, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 90,
      y: 90,
      radius: 25,
      fill: "rgba(0, 0, 255, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 120,
      y: 120,
      radius: 10,
      fill: "rgba(255, 255, 0, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 150,
      y: 150,
      radius: 30,
      fill: "rgba(255, 165, 0, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 180,
      y: 30,
      radius: 20,
      fill: "rgba(255, 105, 180, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 200,
      y: 50,
      radius: 35,
      fill: "rgba(0, 255, 255, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 30,
      y: 150,
      radius: 40,
      fill: "rgba(128, 0, 128, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 100,
      y: 170,
      radius: 18,
      fill: "rgba(255, 20, 147, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
    {
      x: 150,
      y: 190,
      radius: 22,
      fill: "rgba(255, 69, 0, 0.7)",
      stroke: "rgba(0, 0, 0, 0.5)",
    },
  ];

  for (const circle of fixedCircles) {
    drawCircle(circle.x, circle.y, circle.radius, circle.fill, circle.stroke);
  }

  let src = canvas.toDataURL();

  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    let char = src.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  canvas.remove();

  return hash;
}

export default async function generateFingerPrint() {
  let expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 2);
  let fingerprint = encode(
    {
      canvasFingerPrint: await canvasFingerprint(),
      createDate: expiry,
      expiry: expiry,
      random: Math.floor(1000000000 + Math.random() * 9000000000),
    },
    await getFingerprintSecret()
  );
  return await fingerprint;
}
