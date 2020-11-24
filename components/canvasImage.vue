<template>
    <div id="canvasimg">　　
        <img :src="img" class="img-responsive"/>
        <canvas id="canvas"></canvas>
    </div>
</template>

<style>
.img {
  width: 700px;
  height: 550px;
}
#canvas {
  width: 700px;
  height: 550px;
  position: absolute;
  left: 0px;
}
#canvasimg {
  position: relative;
  width: 700px;
  height: 550px;
}
</style>