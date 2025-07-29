import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useNavigate } from 'react-router-dom';

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const navigate = useNavigate();

  return (
    <section className="embla h-[200px] flex items-center justify-center">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index: any, i: number) => (
            <div className="embla__slide" key={i} onClick={() => window.location.href = `/movie/${index.id}`}>
              <img
                src={process.env.REACT_APP_API_URL + '/' + index?.cover?.path + '/' + index?.cover?.name}
                alt={index?.title}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />  
              <div className="flex justify-between mt-1">
                <span className='text-gray-600'>{index?.category}</span>
                <span className='text-gray-600 font-bold'>R: {index?._count?.reviews}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
