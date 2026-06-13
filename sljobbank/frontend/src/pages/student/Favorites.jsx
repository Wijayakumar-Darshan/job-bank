import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteApi, jobApi } from '@/api';
import toast from 'react-hot-toast';
import { Heart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await favoriteApi.getMyFavorites();
      setFavorites(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load favorites");
    }
  };

  const removeFavorite = async (jobId) => {
  try {
    await favoriteApi.remove(jobId);

    setFavorites(prev =>
      prev.filter(f => f.job?.id !== jobId)
    );

    toast.success("Removed from favorites");
  } catch (err) {
    toast.error("Failed to remove");
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0A2E1C] mb-2">Saved Careers ❤️</h1>
        <p className="text-gray-600 mb-8">{favorites.length} saved careers</p>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center">
            <Heart className="mx-auto text-gray-300" size={80} />
            <p className="mt-6 text-xl">No saved careers yet</p>
            <button
              onClick={() => navigate('/student/jobs')}
              className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700"
            >
              Browse Careers
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {favorites.map(({ job }) => (
              <div key={job.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{job.title}</h3>
                    <p className="text-teal-700">{job.cluster?.name}</p>
                  </div>
                  <button onClick={() => removeFavorite(job.id)} className="text-red-500">
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>
                <div className="mt-6 flex justify-between items-center">
                  <div className="font-medium text-teal-600">
                    LKR {job.salaryMin} – {job.salaryMax}
                  </div>
                  <button
                    onClick={() => navigate(`/student/jobs/${job.id}`)}
                    className="px-5 py-2 border border-teal-600 text-teal-700 rounded-2xl hover:bg-teal-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}