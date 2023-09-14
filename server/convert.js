import fs from "fs"
import wav from "node-wav"
import ffmepeg from "fluent-ffmpeg"
import ffmppegStatic from "ffmpeg-static"

const filePath = "./tmp/audio.mp4"
const outputPath = filePath.replace(".mp4", ".wav")

export const convert = () =>
  new Promise((resolve, reject) => {
    console.log("Convertendo o vídeo...")

    ffmepeg.setFfmpegPath(ffmppegStatic)
    ffmepeg()
      .input(filePath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        const file = fs.readFileSync(outputPath)
        const fileDecode = wav.decode(file)

        const audioData = fileDecode.channelData[0]
        const floatArray = new Float32Array(audioData)

        console.log("Vídeo convertido com Sucesso!")

        resolve(floatArray)
        fs.unlinkSync(outputPath)
      })
      .on("error", (error) => {
        console.log("Erro ao decodificar o vídeo")
        reject(error)
      })
      .save(outputPath)
  })
