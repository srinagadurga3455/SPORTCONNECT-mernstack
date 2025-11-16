import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const QuizGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);

  // Sample quiz data
  const quizData = {
    title: 'Football Rules & Regulations',
    questions: [
      {
        question: 'How many players are on a football team on the field?',
        options: ['9 players', '10 players', '11 players', '12 players'],
        correct: 2,
        explanation: 'A football team has 11 players on the field at a time.'
      },
      {
        question: 'What is the duration of a standard football match?',
        options: ['80 minutes', '90 minutes', '100 minutes', '120 minutes'],
        correct: 1,
        explanation: 'A standard football match is 90 minutes, divided into two 45-minute halves.'
      },
      {
        question: 'What color card results in a player being sent off?',
        options: ['Yellow Card', 'Red Card', 'Blue Card', 'Green Card'],
        correct: 1,
        explanation: 'A red card means the player must leave the field and cannot be replaced.'
      },
      {
        question: 'What is it called when a player scores three goals in one game?',
        options: ['Double', 'Hat-trick', 'Triple', 'Grand Slam'],
        correct: 1,
        explanation: 'A hat-trick is when a player scores three goals in a single match.'
      },
      {
        question: 'How many substitutions are typically allowed in a match?',
        options: ['3 substitutions', '5 substitutions', '7 substitutions', 'Unlimited'],
        correct: 1,
        explanation: 'Most competitions now allow 5 substitutions per team per match.'
      }
    ]
  };

  // Timer
  useEffect(() => {
    if (showScore || selectedAnswer !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showScore, selectedAnswer]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === quizData.questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    if (correct) {
      const timeBonus = Math.floor(timeLeft / 5);
      const streakBonus = streak * 10;
      setScore(score + 100 + timeBonus + streakBonus);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(30);
    } else {
      setShowScore(true);
    }
  };

  const getScoreRating = () => {
    const percentage = (score / (quizData.questions.length * 100)) * 100;
    if (percentage >= 90) return { text: 'Outstanding! 🏆', color: 'text-yellow-500' };
    if (percentage >= 75) return { text: 'Excellent! 🌟', color: 'text-green-500' };
    if (percentage >= 60) return { text: 'Good Job! 👍', color: 'text-blue-500' };
    if (percentage >= 40) return { text: 'Keep Practicing! 💪', color: 'text-orange-500' };
    return { text: 'Try Again! 📚', color: 'text-red-500' };
  };

  if (showScore) {
    const rating = getScoreRating();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">{score}</div>
            <div className="text-gray-600">Total Points</div>
          </div>

          <div className={`text-2xl font-bold mb-6 ${rating.color}`}>
            {rating.text}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800">{quizData.questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{Math.floor((score / (quizData.questions.length * 100)) * 100)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Try Again
            </button>
            <Link
              to="/learning"
              className="block w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Back to Learning Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-bold">
              Question {currentQuestion + 1}/{quizData.questions.length}
            </div>
            {streak > 0 && (
              <div className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded-full font-bold animate-pulse">
                🔥 {streak} Streak!
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-800">
            💎 {score}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">Time Left</span>
            <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
              ⏱️ {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-blue-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left font-semibold transition-all transform hover:scale-105 ${
                  selectedAnswer === null
                    ? 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-gray-200'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-500 text-white border-2 border-green-600'
                      : 'bg-red-500 text-white border-2 border-red-600'
                    : index === question.correct
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {selectedAnswer !== null && (
          <div className={`mb-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <div className="flex items-start">
              <span className="text-2xl mr-3">{isCorrect ? '✅' : '❌'}</span>
              <div>
                <div className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <div className="text-gray-700 text-sm">{question.explanation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        {selectedAnswer !== null && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            {currentQuestion + 1 === quizData.questions.length ? 'See Results 🎉' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
