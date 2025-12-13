import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Booking, BookingStatus, Language, Coordinates } from './types';
import { TRANSLATIONS, CROPS, PESTICIDES } from './constants';
import { mockLogin, logout, getUser, createBooking, getBookings, updateBookingStatus } from './services/mockService';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';

// --- Icons ---
const LeafIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const ListIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<'LOGIN' | 'FARMER_HOME' | 'FARMER_BOOK' | 'ADMIN_HOME'>('LOGIN');

  // Load user on mount
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setView(storedUser.role === UserRole.ADMIN ? 'ADMIN_HOME' : 'FARMER_HOME');
    }
  }, []);

  const t = TRANSLATIONS[language];

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('LOGIN');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // --- Views ---

  const LoginView = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const sendOtp = () => {
      if (!name.trim()) return alert('Please enter your name');
      if (phone.length < 10) return alert('Invalid phone number');
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1000);
    };

    const verifyOtp = async () => {
      setLoading(true);
      const u = await mockLogin(phone, name);
      setUser(u);
      setLoading(false);
      setView(u.role === UserRole.ADMIN ? 'ADMIN_HOME' : 'FARMER_HOME');
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-primary">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">{t.app_name}</h1>
            <button onClick={toggleLanguage} className="text-sm font-semibold text-primary bg-green-100 px-3 py-1 rounded-full">
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-6">{t.login_title}</h2>
          
          {step === 1 ? (
            <>
              <Input 
                label={t.name_label}
                type="text"
                placeholder={t.enter_name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label={t.phone_label} 
                type="tel" 
                placeholder="9876543210" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <Button fullWidth onClick={sendOtp} disabled={loading}>
                {loading ? t.loading : t.send_otp}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4 text-center">OTP sent to {phone}</p>
              <Input 
                label={t.enter_otp} 
                type="number" 
                placeholder="123456" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
              <Button fullWidth onClick={verifyOtp} disabled={loading}>
                {loading ? t.loading : t.verify_otp}
              </Button>
              <button 
                onClick={() => setStep(1)} 
                className="mt-4 text-sm text-center w-full text-gray-500 underline"
              >
                Change Details
              </button>
            </>
          )}
          
          <div className="mt-8 text-xs text-center text-gray-400">
            For Admin Demo use: 9999999999
          </div>
        </div>
      </div>
    );
  };

  const FarmerBookView = () => {
    const [crop, setCrop] = useState('');
    const [acres, setAcres] = useState('');
    const [pesticide, setPesticide] = useState('');
    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    const getGeoLocation = () => {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by this browser.');
          return;
        }
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocLoading(false);
          },
          (error) => {
            alert('Unable to retrieve location.');
            setLocLoading(false);
          }
        );
    };

    const handleSubmit = async () => {
        if (!crop || !acres || !pesticide || !coords) {
            alert('Please fill all fields and capture location');
            return;
        }
        setLoading(true);
        await createBooking({
            userId: user!.id,
            userPhone: user!.phone,
            cropType: crop,
            acres: Number(acres),
            pesticide,
            location: coords,
            locationAddress: '',
        });
        setLoading(false);
        alert(t.success_booking);
        setView('FARMER_HOME');
    };

    const cropOptions = CROPS.map(c => ({ 
        value: c.en, 
        label: language === 'hi' ? c.hi : c.en 
    }));

    const pestOptions = PESTICIDES.map(p => ({ value: p, label: p }));

    return (
        <div className="pb-20">
            <Header title={t.book_service} showBack onBack={() => setView('FARMER_HOME')} />
            <div className="p-4 space-y-4">
                <Select label={t.select_crop} options={cropOptions} value={crop} onChange={e => setCrop(e.target.value)} />
                <Input label={t.land_size} type="number" value={acres} onChange={e => setAcres(e.target.value)} />
                <Select label={t.select_pesticide} options={pestOptions} value={pesticide} onChange={e => setPesticide(e.target.value)} />
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">{t.location}</label>
                    <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {coords ? `${t.loc_found}: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Location not set'}
                        </span>
                        <button 
                            onClick={getGeoLocation}
                            className="flex items-center text-primary font-semibold text-sm"
                            disabled={locLoading}
                        >
                            <MapPinIcon />
                            {locLoading ? '...' : t.get_location}
                        </button>
                    </div>
                </div>

                <Button fullWidth onClick={handleSubmit} disabled={loading}>
                    {loading ? t.loading : t.submit_request}
                </Button>
            </div>
        </div>
    );
  };

  const FarmerHomeView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getBookings(user).then(res => {
                setBookings(res);
                setLoading(false);
            });
        }
    }, []);

    const LangButton = (
        <button onClick={toggleLanguage} className="text-xs bg-green-800 text-white px-2 py-1 rounded border border-green-600">
            {language === 'en' ? 'हिन्दी' : 'EN'}
        </button>
    );

    return (
        <div className="pb-24">
            <Header title={t.app_name} rightContent={LangButton} />
            
            {/* Action Card */}
            <div className="p-4">
                <div className="bg-primary rounded-2xl p-6 text-white shadow-lg flex flex-col items-start">
                    <h2 className="text-xl font-bold mb-2">{t.welcome}, {user?.name || user?.phone}</h2>
                    <p className="mb-6 opacity-90 text-sm">Protect your crops today.</p>
                    <Button variant="secondary" fullWidth onClick={() => setView('FARMER_BOOK')}>
                        + {t.book_service}
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="px-4">
                <h3 className="font-bold text-lg mb-3 text-gray-800">{t.my_bookings}</h3>
                {loading ? <p className="text-center text-gray-500 py-4">{t.loading}</p> : (
                    <div className="space-y-3">
                        {bookings.length === 0 && <p className="text-center text-gray-400 py-4">{t.no_bookings}</p>}
                        {bookings.map(b => (
                            <BookingCard key={b.id} booking={b} t={t} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe max-w-md mx-auto right-0">
                <NavBtn icon={<LeafIcon />} label={t.home} active />
                <NavBtn icon={<ListIcon />} label={t.my_bookings} />
                <NavBtn icon={<UserIcon />} label={t.logout} onClick={handleLogout} />
            </div>
        </div>
    );
  };

  const AdminHomeView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    
    const refresh = useCallback(() => {
        if (user) {
            getBookings(user).then(setBookings);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleStatus = async (id: string, status: BookingStatus) => {
        await updateBookingStatus(id, status);
        refresh();
    };

    return (
        <div className="pb-20">
            <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">{t.admin_panel}</h1>
                <div className="flex gap-4 items-center">
                    <button onClick={toggleLanguage} className="text-sm font-semibold text-primary">
                        {language === 'en' ? 'HI' : 'EN'}
                    </button>
                    <button onClick={handleLogout} className="text-red-500 text-sm font-semibold">
                        Exit
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800">{b.cropType}</h4>
                                <p className="text-sm text-gray-500">{b.userPhone}</p>
                            </div>
                            <StatusBadge status={b.status} t={t} />
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p>Farmer: {user?.role === UserRole.ADMIN ? (b as any).userName : ''}</p>
                            <p>Area: {b.acres} Acres</p>
                            <p>Pesticide: {b.pesticide}</p>
                            <p>Date: {new Date(b.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">Loc: {b.location?.lat.toFixed(4)}, {b.location?.lng.toFixed(4)}</p>
                        </div>
                        
                        <div className="flex gap-2">
                            {b.status === BookingStatus.REQUESTED && (
                                <Button size="sm" className="flex-1 py-2 text-sm" onClick={() => handleStatus(b.id, BookingStatus.SCHEDULED)}>
                                    {t.mark_scheduled}
                                </Button>
                            )}
                            {b.status === BookingStatus.SCHEDULED && (
                                <Button size="sm" className="flex-1 py-2 text-sm bg-green-600" onClick={() => handleStatus(b.id, BookingStatus.COMPLETED)}>
                                    {t.mark_completed}
                                </Button>
                            )}
                            {b.status !== BookingStatus.COMPLETED && b.status !== BookingStatus.CANCELLED && (
                                <Button size="sm" variant="danger" className="py-2 text-sm" onClick={() => handleStatus(b.id, BookingStatus.CANCELLED)}>
                                    X
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  // --- Wrapper ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative">
            {view === 'LOGIN' && <LoginView />}
            {view === 'FARMER_HOME' && <FarmerHomeView />}
            {view === 'FARMER_BOOK' && <FarmerBookView />}
            {view === 'ADMIN_HOME' && <AdminHomeView />}
        </div>
    </div>
  );
}

// --- Sub Components ---

const Header: React.FC<{ title: string, showBack?: boolean, onBack?: () => void, rightContent?: React.ReactNode }> = ({ title, showBack, onBack, rightContent }) => (
    <div className="bg-primary p-4 sticky top-0 z-10 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center">
            {showBack && (
                <button onClick={onBack} className="mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <h1 className="text-lg font-bold">{title}</h1>
        </div>
        {rightContent && <div>{rightContent}</div>}
    </div>
);

const NavBtn: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full ${active ? 'text-primary' : 'text-gray-400'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const BookingCard: React.FC<{ booking: Booking, t: any }> = ({ booking, t }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
        <div>
            <h4 className="font-bold text-gray-800">{booking.cropType}</h4>
            <p className="text-sm text-gray-500">{booking.acres} Acres • {new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        <StatusBadge status={booking.status} t={t} />
    </div>
);

const StatusBadge: React.FC<{ status: BookingStatus, t: any }> = ({ status, t }) => {
    let color = 'bg-gray-100 text-gray-600';
    let label = t.status_requested;

    switch(status) {
        case BookingStatus.REQUESTED: color = 'bg-yellow-100 text-yellow-800'; label=t.status_requested; break;
        case BookingStatus.SCHEDULED: color = 'bg-blue-100 text-blue-800'; label=t.status_scheduled; break;
        case BookingStatus.COMPLETED: color = 'bg-green-100 text-green-800'; label=t.status_completed; break;
        case BookingStatus.CANCELLED: color = 'bg-red-100 text-red-800'; label=t.status_cancelled; break;
    }

    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>
            {label}
        </span>
    );
};