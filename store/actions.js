export const startVideo = (medias) => {
    navigator.mediaDevices.getUserMedia(medias).then(
        function(stream) { video.srcObject = stream }
        ).catch(
            function(err) {
                var stop = clearInterval(this.capt)
                window.alert("カメラの使用が許可されませんでした")
            }
        );
}

export const getCapture = (height, width, img) => {
    const video = document.querySelector("video")
    const canv  = document.querySelector("canvas")
    canv.height = height
    canv.width  = width
    const contexts = canv.getContext("2d")
    contexts.drawImage(video, 0, 0, width, height)
    img = canv.toDataURL('image/jpeg')
    contexts.commit('GET_CAPTURE',img)
}
