import Link from 'next/link';

interface VideoCardProps {
  _id: string;
  title: string;
  creator: string;
  thumbnailUrl?: string;
  views?: number;
}

const VideoCard = ({ _id, title, creator, thumbnailUrl, views }: VideoCardProps) => {
  return (
    <Link href={`/video/${_id}`}>
      <div className="bg-gray-800 text-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer">
        <div className="aspect-video rounded-xl overflow-hidden bg-black mb-3">
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Thumbnail
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-sm text-gray-400">By {creator}</p>
        {views !== undefined && (
          <p className="text-xs text-gray-500 mt-1">{views} views</p>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;
