import { useState } from 'react';

interface Comment {
  _id: string;
  user: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onPost: (text: string) => void;
}

const CommentSection = ({ comments, onPost }: CommentSectionProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onPost(text);
    setText('');
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-800 p-3 rounded-lg shadow text-sm"
          >
            <p className="font-semibold text-white">{comment.user}</p>
            <p className="text-gray-300 mt-1">{comment.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
