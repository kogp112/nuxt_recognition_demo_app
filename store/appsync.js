import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        hidden: false,
        img: null,
        capt: null
    },
    actions: {
        startVideo: () => {
            navigator.mediaDevices.getUserMedia(medias).then(
                function(stream) { video.srcObject = stream }
              ).catch(
                function(err) {
                  var stop = clearInterval(this.capt)
                  window.alert("カメラの使用が許可されませんでした")
                }
              );  
        },
        getCapture: () => {
            const video   = document.querySelector("video")
            const canv    = document.querySelector("canvas")
            canv.height   = this.height
            canv.width    = this.width
            const context = canv.getContext("2d")
            context.drawImage(video, 0, 0, this.width, this.height)
            this.img      = canv.toDataURL('image/jpeg')
        }
    }
})