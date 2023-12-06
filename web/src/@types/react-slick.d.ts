import 'react-slick'

declare module 'react-slick' {
  export interface InnerSlider {
    state: {
      currentSlide: number
    }
  }
}
