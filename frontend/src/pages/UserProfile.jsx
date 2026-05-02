import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon,
    MapPinIcon,
    PencilIcon
} from '@heroicons/react/24/outline';
import { authFetch } from '../utils/auth';
import toast from 'react-hot-toast';

function UserProfile() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            const response = await authFetch(`${BASEURL}/api/user/`);
            const data = await response.json();
            setProfile({
                username: data.username || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                pincode: data.pincode || '',
            });
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await authFetch(`${BASEURL}/api/user/update/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                fetchProfile();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">{profile.username}</h2>
                                <p className="text-white/80">{profile.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchProfile();
                                        }}
                                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <UserIcon className="w-5 h-5 inline mr-2" />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <EnvelopeIcon className="w-5 h-5 inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <PhoneIcon className="w-5 h-5 inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                                        isEditing ? 'focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50'
                                    }`}
                                    placeholder="+91 1234567890"
                                />
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPinIcon className="w-5 h-5 inline mr-2" />
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    value={profile.pincode}
                                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                                        isEditing ? 'focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50'
                                    }`}
                                    placeholder="400001"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={profile.city}
                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                                        isEditing ? 'focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50'
                                    }`}
                                    placeholder="Mumbai"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    value={profile.state}
                                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                                        isEditing ? 'focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50'
                                    }`}
                                    placeholder="Maharashtra"
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Address
                                </label>
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    disabled={!isEditing}
                                    rows="3"
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                                        isEditing ? 'focus:ring-2 focus:ring-primary focus:border-primary' : 'bg-gray-50'
                                    }`}
                                    placeholder="Enter your full address"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
