const defaultPalette: number[][] = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [75, 192, 192],
    [153, 102, 255],
    [255, 159, 64],
    [56, 105, 201],
    [230, 37, 79],
    [172, 237, 43],
    [250, 107, 12],
    [70, 189, 84],
    [53, 44, 171]
  ]
  export const bluePalette: number[][] = [
    [0, 0, 255],
    [54, 162, 235],
    [255, 206, 86],
    [75, 192, 192],
    [153, 102, 255],
    [255, 159, 64],
    [56, 105, 201],
    [230, 37, 79],
    [172, 237, 43],
    [250, 107, 12],
    [70, 189, 84],
    [53, 44, 171]
  ]
  
  export const getRgbaString = (palette: number[][], i: number, alpha = 1) : string => {
    const [red, green, blue] = palette[i]
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }
  
  export const getColours = function * (palette: number[][]) : any {
    let colourIndex = 0
  
    while (true) {
      yield {
        backgroundColor: getRgbaString(palette, colourIndex % palette.length, 0.2),
        borderColor: getRgbaString(palette, colourIndex % palette.length)
      }
      colourIndex++
    }
  }
  
  export default defaultPalette
  