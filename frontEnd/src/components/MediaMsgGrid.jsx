import PropTypes from "prop-types";
import { DownloadSimple } from "@phosphor-icons/react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Video from "yet-another-react-lightbox/plugins/video";
export default function MediaMsgGrid({ media, incoming }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 pt-4 pb-2 gap-3 rounded-2xl rounded-tl-none ${
        incoming ? "bg-gray dark:bg-boxdark-2" : "bg-transparent"
      }`}
    >
      {media?.slice(0, 4).map((item, index) => (
        <div
          key={item._id || index}
          className="col-span-1 row-span-1 relative rounded-2xl"
        >
          {index === 3 && media.length > 4 ? (
            <div
              onClick={() => openLightbox(3)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-semibold cursor-pointer rounded-2xl"
            >
              +{media.length - 3}
            </div>
          ) : (
            <MediaItem media={item} index={index} openLightbox={openLightbox} />
          )}
        </div>
      ))}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          plugins={[Video]}
          close={() => setLightboxOpen(false)}
          index={currentIndex}
          slides={media.map((item) => ({
            type: item.type === "video" ? "video" : "image",
            src: item.url,
            sources:
              item.type === "video"
                ? [{ src: item.url, type: "video/mp4" }]
                : undefined,
          }))}
        />
      )}
    </div>
  );
}
function MediaItem({ media, index, openLightbox }) {
  const handleDownloadClick = () => {
    const link = document.createElement("a");
    const extension = media.url.split(".").pop().split("?")[0];
    link.href = media.url;
    link.target = "_blank";
    link.download = `media_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      {media.type === "video" ? (
        <video
          src={media.url}
          className="h-full w-full max-h-36 rounded-lg object-cover"
          controls={false}
          autoPlay={false}
          onClick={() => openLightbox(index)}
        />
      ) : (
        <img
          src={media.url}
          alt="Media content"
          className="h-full w-full max-h-36 rounded-lg object-cover cursor-pointer"
          onClick={() => openLightbox(index)}
        />
      )}
      <button
        onClick={handleDownloadClick}
        className="absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white"
      >
        <DownloadSimple size={20} />
      </button>
    </>
  );
}
MediaMsgGrid.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  incoming: PropTypes.bool.isRequired,
};
MediaItem.propTypes = {
  media: PropTypes.shape({
    _id: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
  openLightbox: PropTypes.func,
};