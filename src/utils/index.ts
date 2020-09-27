import howler from 'howler'

const SE = {
  boxRotate: new howler.Howl({ src: './box_rotate.mp3' }),
  boxAppear: new howler.Howl({ src: './box_appear.mp3' }),
  win: new howler.Howl({ src: './win.mp3' }),
}

export function sePlay(name: keyof typeof SE) {
  SE[name].play()
}

export function range(begin: number, end: number, interval = 1): number[] {
  const array: number[] = []
  for (let i = begin; i <= end; i += interval) {
    array.push(i)
  }
  return array
}
