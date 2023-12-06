import React, { useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

const Carousel = ({
  children,
  ...props
}: {
  children: React.ReactNode
  [key: string]: any
}) => {
  const sliderRef = useRef<Slider>(null)

  const goToPrevSlide = () => {
    const currentSlide = sliderRef.current?.innerSlider?.state.currentSlide
    const slidesToScroll = sliderRef.current?.props.slidesToScroll ?? 1
    const prevSlide =
      (currentSlide !== undefined ? currentSlide : 0) - slidesToScroll
    sliderRef.current?.slickGoTo(prevSlide)
  }

  const goToNextSlide = () => {
    const currentSlide = sliderRef.current?.innerSlider?.state.currentSlide
    const slidesToScroll = sliderRef.current?.props.slidesToScroll ?? 1
    const NextSlide =
      (currentSlide !== undefined ? currentSlide : 0) + slidesToScroll
    sliderRef.current?.slickGoTo(NextSlide)
  }

  const CustomPrevArrow = () => {
    const isDisabled = sliderRef.current?.innerSlider?.state.currentSlide === 0

    return (
      <div className="absolute left-0 top-1/2 z-50 -translate-y-1/2 transform">
        <button
          onClick={goToPrevSlide}
          className={`rounded-full bg-white p-2 text-gray-500 shadow-lg hover:text-gray-200 ${
            isDisabled ? 'invisible' : ''
          }`}
          disabled={isDisabled}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      </div>
    )
  }

  const CustomNextArrow = () => {
    const childrenLength = Array.isArray(children) ? children.length : 0

    const currentSlide =
      sliderRef.current?.innerSlider?.state.currentSlide ?? childrenLength - 3

    const isDisabled = currentSlide === childrenLength - 3

    return (
      <div className="absolute right-0 top-1/2 z-50 -translate-y-1/2 transform">
        <button
          onClick={goToNextSlide}
          className={`rounded-full bg-white p-2 text-gray-500 shadow-lg hover:text-gray-200 ${
            isDisabled ? 'invisible' : ''
          }`}
          disabled={isDisabled}
        >
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>
    )
  }

  const initialSlide = Array.isArray(children) ? children.length - 3 : 0

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    ...props,
  }

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
    </div>
  )
}

export default Carousel
