import ProjectImage from './ProjectImage';

export type MediaKind = 'image' | 'video' | 'youtube';

const VIDEO_EXT = /\.(mp4|webm|m4v|mov)(\?|#|$)/i;
const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;

export function mediaKind(src: string): MediaKind {
  if (YOUTUBE_ID.test(src)) return 'youtube';
  if (VIDEO_EXT.test(src)) return 'video';
  return 'image';
}

const youtubeId = (src: string) => src.match(YOUTUBE_ID)?.[1] ?? '';

interface ProjectMediaProps {
  src: string;
  alt: string;
  className?: string;
  poster?: string;
  // 'full' plays with controls; 'thumb' is a static preview for cards and thumbnail strips.
  mode?: 'full' | 'thumb';
}

// Renders a photo, a self-hosted video, or a YouTube embed, depending on the URL.
export default function ProjectMedia({ src, alt, className = '', poster, mode = 'full' }: ProjectMediaProps) {
  const kind = mediaKind(src);

  if (kind === 'image') {
    return <ProjectImage src={src} alt={alt} className={className} loading={mode === 'thumb' ? 'lazy' : undefined} />;
  }

  if (mode === 'thumb') {
    return (
      <div className={`relative ${className}`}>
        {kind === 'youtube' ? (
          <img
            src={`https://img.youtube.com/vi/${youtubeId(src)}/hqdefault.jpg`}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : poster ? (
          <img src={poster} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          // '#t=0.1' makes browsers render the first frame as a poster.
          <video src={`${src}#t=0.1`} muted playsInline preload="metadata" className="w-full h-full object-cover" aria-label={alt} />
        )}
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
            <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
    );
  }

  if (kind === 'youtube') {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId(src)}`}
        title={alt}
        className={`bg-black ${className}`}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    // Letterbox rather than crop, so nothing in the video is cut off.
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={`bg-black ${className.replace('object-cover', 'object-contain')}`}
      aria-label={alt}
    >
      Your browser can't play this video.
    </video>
  );
}
