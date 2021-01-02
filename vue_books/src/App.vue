<template>
  <div id="app">
    <canvas id="canvas"> </canvas>
    <el-backtop></el-backtop>
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "app",
  mounted() {
    var can = document.getElementById("canvas");
    var ctx = can.getContext("2d");
    var wid = window.innerWidth;
    var hei = window.innerHeight - 60;
    can.width = wid;
    can.height = hei;
    var snow = 100; //雪花数量
    var arr = []; //保存雪花坐标，半径
    for (var i = 0; i < snow; i++) {
      arr.push({
        x: Math.random() * wid,
        y: Math.random() * (hei + 60),
        r: Math.random() * 7,
      });
    }
    function DrawSnow() {
      ctx.clearRect(0, 0, wid, hei);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#fff";
      for (var i = 0; i < snow; i++) {
        var p = arr[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, true);
        ctx.fillStyle = "rgba(255,255,255,1)";
      }
      ctx.fill();
      ctx.stroke();
      SnowFall();
      ctx.closePath();
    }
    //雪花飘落
    function SnowFall() {
      for (var i = 0; i < snow; i++) {
        var p = arr[i];
        p.y += Math.random() * 10 + 1;
        if (p.y > hei) {
          p.y = 0;
        }
        p.x += Math.random() * 10 + 1;
        if (p.x > wid) {
          p.x = 0;
        }
      }
    }
    setInterval(DrawSnow, 100);
  },
};
</script>
