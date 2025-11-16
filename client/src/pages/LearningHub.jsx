import { useState } from 'react';
import { Link } from 'react-router-dom';

const LearningHub = () => {
  const [selectedSport, setSelectedSport] = useState('all');
  const [activeTab, setActiveTab] = useState('videos');

  const videos = [
    {
      id: 1,
      title: 'Football: Mastering Ball Control',
      sport: 'football',
      duration: '12:45',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      views: '2.5K',
      instructor: 'Coach Mike',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Cricket: Perfect Batting Technique',
      sport: 'cricket',
      duration: '15:30',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
      views: '3.2K',
      instructor: 'Coach Sarah',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Basketball: Shooting Fundamentals',
      sport: 'basketball',
      duration: '10:20',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
      views: '1.8K',
      instructor: 'Coach John',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 4,
      title: 'Tennis: Serve Like a Pro',
      sport: 'tennis',
      duration: '18:15',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
      views: '4.1K',
      instructor: 'Coach Emma',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 5,
      title: 'Football: Advanced Dribbling Skills',
      sport: 'football',
      duration: '14:50',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
      views: '5.3K',
      instructor: 'Coach Mike',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 6,
      title: 'Cricket: Bowling Masterclass',
      sport: 'cricket',
      duration: '20:00',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
      views: '2.9K',
      instructor: 'Coach Raj',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Football Rules & Regulations',
      sport: 'football',
      questions: 15,
      difficulty: 'Easy',
      points: 150,
      icon: '⚽',
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 2,
      title: 'Cricket Strategy Quiz',
      sport: 'cricket',
      questions: 20,
      difficulty: 'Medium',
      points: 200,
      icon: '🏏',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 3,
      title: 'Basketball Tactics Challenge',
      sport: 'basketball',
      questions: 12,
      difficulty: 'Easy',
      points: 120,
      icon: '🏀',
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 4,
      title: 'Tennis Grand Slam Trivia',
      sport: 'tennis',
      questions: 25,
      difficulty: 'Hard',
      points: 300,
      icon: '🎾',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 5,
      title: 'Football Legends Quiz',
      sport: 'football',
      questions: 18,
      difficulty: 'Medium',
      points: 180,
      icon: '⚽',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 6,
      title: 'Cricket World Cup History',
      sport: 'cricket',
      questions: 30,
      difficulty: 'Hard',
      points: 350,
      icon: '🏏',
      color: 'from-red-400 to-pink-500'
    }
  ];

  const filteredVideos = selectedSport === 'all' 
    ? videos 
    : videos.filter(v => v.sport === selectedSport);

  const filteredQuizzes = selectedSport === 'all'
    ? quizzes
    : quizzes.filter(q => q.sport === selectedSport);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">🎓 Learning Hub</h1>
          <p className="text-xl opacity-90">Master your game with expert videos and fun quizzes!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sport Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSport('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSport === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              All Sports
            </button>
            <button
              onClick={() => setSelectedSport('football')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSport === 'football'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              ⚽ Football
            </button>
            <button
              onClick={() => setSelectedSport('cricket')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSport === 'cricket'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              🏏 Cricket
            </button>
            <button
              onClick={() => setSelectedSport('basketball')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSport === 'basketball'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              🏀 Basketball
            </button>
            <button
              onClick={() => setSelectedSport('tennis')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSport === 'tennis'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              🎾 Tennis
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📹 Video Tutorials
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'quizzes'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎮 Interactive Quizzes
            </button>
          </div>
        </div>

        {/* Videos Section */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {video.duration}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      video.level === 'Beginner' ? 'bg-green-500 text-white' :
                      video.level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {video.level}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>👨‍🏫 {video.instructor}</span>
                    <span>👁️ {video.views}</span>
                  </div>
                  <Link
                    to={`/video/${video.id}`}
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Watch Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quizzes Section */}
        {activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${quiz.color} p-6 text-white`}>
                  <div className="text-6xl mb-3 text-center">{quiz.icon}</div>
                  <h3 className="font-bold text-xl text-center">{quiz.title}</h3>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{quiz.questions}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{quiz.points}</div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                  </div>
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className={`block w-full text-center bg-gradient-to-r ${quiz.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}
                  >
                    Start Quiz 🎯
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'videos' && filteredVideos.length === 0) || 
          (activeTab === 'quizzes' && filteredQuizzes.length === 0)) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No content found</h3>
            <p className="text-gray-600">Try selecting a different sport or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningHub;
