import { useParams, Link } from 'react-router-dom';

const VideoPlayer = () => {
  const { id } = useParams();

  // Sample video data
  const videos = {
    1: {
      title: 'Football: Mastering Ball Control',
      instructor: 'Coach Mike',
      duration: '12:45',
      level: 'Beginner',
      description: 'Learn the fundamentals of ball control in football. This comprehensive tutorial covers dribbling techniques, first touch, and close control skills that will elevate your game.',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      relatedVideos: [2, 5]
    },
    2: {
      title: 'Cricket: Perfect Batting Technique',
      instructor: 'Coach Sarah',
      duration: '15:30',
      level: 'Intermediate',
      description: 'Master the art of batting with proper stance, grip, and shot selection. Learn from professional techniques to improve your batting average.',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      relatedVideos: [1, 6]
    }
  };

  const video = videos[id] || videos[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/learning"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6"
        >
          ← Back to Learning Hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Video Player */}
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    video.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    video.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {video.level}
                  </span>
                  <span className="text-gray-600">⏱️ {video.duration}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {video.instructor.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{video.instructor}</div>
                      <div className="text-sm text-gray-600">Professional Coach</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">{video.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                    👍 Like
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                    💾 Save
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all">
                    📤 Share
                  </button>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Master the fundamental techniques</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Practice regularly for improvement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700">Apply these skills in real games</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quiz Suggestion */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-3">🎮 Test Your Knowledge!</h3>
              <p className="mb-4 opacity-90">Take a quiz to reinforce what you've learned</p>
              <Link
                to="/quiz/1"
                className="block w-full bg-white text-purple-600 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-all"
              >
                Start Quiz
              </Link>
            </div>

            {/* Related Videos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📺 Related Videos</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    to={`/video/${i}`}
                    className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-157462981036${i}?w=120`}
                      alt="Video thumbnail"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        Advanced Techniques for Beginners
                      </h4>
                      <p className="text-xs text-gray-600">Coach Mike • 10:30</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
