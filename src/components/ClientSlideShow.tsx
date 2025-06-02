import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const ClientSlideShow = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef);
  const controls = useAnimation();

  const images = [
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902624/IMG_1130_okrpa4.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902623/0250e939-6894-4359-ab2e-54f03827ee02_myvsmw.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902623/2e7c345e-b97a-4c29-9806-00ea624a5daf_2_tkcvti.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/983ecf4e-efa3-4231-8886-2aac7e619b98_yfv42q.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902622/8033ccbe-c9e0-47e6-b2af-89699b34a67e_tqskc8.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/5fc74786-a26c-4dfb-9b32-9c1e769ce484_ihl2fs.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902621/80b83e26-3edc-47c1-9366-9d43ad6a8e71_i61yej.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902620/f6cc1f43-2430-4c07-8216-0922e043d559_jouenq.jpg",
    "https://res.cloudinary.com/dmt4dj8ft/image/upload/v1748902620/dd9ecb1e-759f-48ae-86b2-2733ebb0b62e_c9wi8f.jpg"
  ];

  // Double the images array for seamless infinite scroll
  const doubledImages = [...images, ...images];

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: [0, -50 * images.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isInView, images.length]);

  return (
    <div className="w-full bg-[#15171b] py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Our Happy Clients
        </h2>
      </div>
      
      <div ref={scrollRef} className="relative w-full overflow-hidden px-4">
        <motion.div
          animate={controls}
          className="flex gap-8"
          style={{
            width: `${doubledImages.length * 320}px`, // Increased width to prevent overlap
          }}
        >
          {doubledImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[280px] md:w-[300px] bg-black/20 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative aspect-video group">
                <img
                  src={image}
                  alt={`Client ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientSlideShow;