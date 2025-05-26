import { useState } from 'react';
import { Instagram, Heart, MessageCircle, Calendar } from 'lucide-react';

interface Post {
  id: string;
  username: string;
  date: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    username: 'strength_gym_fitness',
    date: '2024-03-15',
    imageUrl: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    likes: 1234,
    comments: 89,
    caption: '💪 Push your limits! Another amazing workout session with our dedicated members. #FitnessGoals #GymLife'
  },
  {
    id: '2',
    username: 'strength_gym_fitness',
    date: '2024-03-14',
    imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg',
    likes: 956,
    comments: 45,
    caption: '🏋️‍♀️ New equipment alert! Come check out our latest additions to help you crush your fitness goals. #GymEquipment #FitnessJourney'
  },
  {
    id: '3',
    username: 'strength_gym_fitness',
    date: '2024-03-13',
    imageUrl: 'https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg',
    likes: 2341,
    comments: 156,
    caption: '🎯 Success stories in the making! Proud of our members\' dedication and progress. #TransformationTuesday #FitnessMotivation'
  },
  {
    id: '4',
    username: 'strength_gym_fitness',
    date: '2024-03-12',
    imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
    likes: 1567,
    comments: 92,
    caption: '🌟 Morning motivation! Start your day with a powerful workout. Join us for our 6AM sessions! #MorningWorkout #FitnessLife'
  },
  {
    id: '5',
    username: 'strength_gym_fitness',
    date: '2024-03-11',
    imageUrl: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg',
    likes: 1890,
    comments: 134,
    caption: '🎵 New playlist alert! Working out is better with the right beats. Check out our latest gym playlist! #GymMusic #WorkoutMotivation'
  },
  {
    id: '6',
    username: 'strength_gym_fitness',
    date: '2024-03-10',
    imageUrl: 'https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg',
    likes: 2156,
    comments: 167,
    caption: '🥗 Nutrition tips! Remember, great results start in the kitchen. Book a session with our nutrition expert! #HealthyLifestyle #FitnessTips'
  }
];

const SocialFeed = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Instagram className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-white">Social Footprints</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{post.username}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </div>

              <div className="aspect-square relative">
                <img 
                  src={post.imageUrl} 
                  alt={`Instagram post by ${post.username}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart className="w-5 h-5" />
                    <span className="text-white">{formatNumber(post.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-white">{formatNumber(post.comments)}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm line-clamp-2">{post.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;