import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { useNavigate } from 'react-router-dom';
import '../css/embla.css';

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const navigate = useNavigate();

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        <p>Nenhum filme disponível</p>
      </div>
    );
  }

  return (
    <section className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index: any, i: number) => (
            <div className="embla__slide" key={i} onClick={() => navigate(`/movie/${index.id}`)}>
              <div className="w-full flex flex-col items-center">
                {
                  index?.image ? (
                    <img
                      src={index?.image}
                      alt={index?.title || 'Movie poster'}
                      className="w-[100px] h-[150px] object-cover rounded-lg shadow-md mb-2"
                    />
                  ) : (
                    <img
                      src={process.env.REACT_APP_API_URL + '/' + index?.cover?.path + '/' + index?.cover?.name}
                      alt={index?.title || 'Movie poster'}
                      className="w-[100px] h-[150px] object-cover rounded-lg shadow-md mb-2"
                    />
                  )
                }
                <div className="w-full flex flex-col items-center gap-1 px-1">
                  {index?.category && (
                    <span className='text-xs text-gray-600 text-center truncate w-full'>{index.category}</span>
                  )}
                  {index?._count?.reviews !== undefined && (
                    <span className='text-xs text-gray-600 font-bold'>R: {index._count.reviews}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
