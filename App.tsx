import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Booking, BookingStatus, Language, Coordinates } from './types';
import { TRANSLATIONS, CROPS, PESTICIDES } from './constants';
import { mockLogin, logout, getUser, createBooking, getBookings, updateBookingStatus } from './services/mockService';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';

// --- Icons ---
const LeafIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const ListIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const UserIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BatteryIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SignalIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;

// --- Components ---

const DroneHUD = ({ user, t }: { user: User | null, t: any }) => (
    <div className="relative h-72 w-full bg-gray-900 overflow-hidden shadow-2xl rounded-b-3xl">
        {/* Background Image - Aerial Farm View */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
        />
        
        {/* HUD Overlays */}
        <div className="absolute inset-0 drone-overlay">
            {/* Top Bar Data */}
            <div className="absolute top-4 left-4 right-4 flex justify-between text-xs font-mono text-green-400">
                <div className="flex items-center bg-black/50 px-2 py-1 rounded border border-green-500/30">
                    <span className="animate-pulse mr-2">●</span> REC
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center"><BatteryIcon /> 84%</div>
                    <div className="flex items-center"><SignalIcon /> 5G</div>
                </div>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="w-48 h-48 border border-green-400/30 rounded-full flex items-center justify-center relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-40 h-40 border border-white/10 rounded-full"></div>
                    {/* Crosshairs */}
                    <div className="absolute w-4 h-[1px] bg-green-400 -left-2"></div>
                    <div className="absolute w-4 h-[1px] bg-green-400 -right-2"></div>
                    <div className="absolute h-4 w-[1px] bg-green-400 -top-2"></div>
                    <div className="absolute h-4 w-[1px] bg-green-400 -bottom-2"></div>
                 </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-scan"></div>

            {/* Bottom Data */}
            <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl font-bold drop-shadow-md">{t.welcome}, {user?.name?.split(' ')[0]}</h2>
                <p className="text-xs font-mono text-green-300 bg-black/40 px-2 py-1 rounded inline-block mt-1">
                    {t.drone_status}
                </p>
            </div>
            
             <div className="absolute bottom-4 right-4 text-right">
                <p className="text-xs font-mono text-white/80">{t.weather}</p>
                <p className="text-xs font-mono text-green-400">ALT: 45m • SPD: 12m/s</p>
            </div>
        </div>
    </div>
);

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
    setLanguage(prev => {
        if (prev === 'en') return 'hi';
        if (prev === 'hi') return 'te';
        return 'en';
    });
  };

  const LangButton = (
    <button onClick={toggleLanguage} className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full border border-white/40 transition-all backdrop-blur-sm">
        {language === 'en' ? '🇺🇸 EN' : language === 'hi' ? '🇮🇳 हिन्दी' : '🇮🇳 తెలుగు'}
    </button>
  );

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 to-green-800">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 mx-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <LeafIcon className="w-8 h-8" />
                {t.app_name}
            </h1>
            <button onClick={toggleLanguage} className="text-xs font-bold bg-gray-100 text-primary px-3 py-1 rounded-full border border-gray-200">
                {language === 'en' ? 'EN' : language === 'hi' ? 'HI' : 'TE'}
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-6 text-gray-800">{t.login_title}</h2>
          
          {step === 1 ? (
            <div className="space-y-4">
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
              <Button fullWidth onClick={sendOtp} disabled={loading} className="mt-2">
                {loading ? t.loading : t.send_otp}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 text-center mb-4">
                 OTP sent to <strong>{phone}</strong>
              </div>
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
                className="mt-4 text-sm text-center w-full text-gray-500 hover:text-primary transition-colors"
              >
                Change Details
              </button>
            </div>
          )}
          
          <div className="mt-8 text-xs text-center text-gray-400 border-t pt-4">
            Manakrishi Secure Login
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
        label: language === 'hi' ? c.hi : language === 'te' ? c.te : c.en 
    }));

    const pestOptions = PESTICIDES.map(p => ({ value: p, label: p }));

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <Header title={t.book_service} showBack onBack={() => setView('FARMER_HOME')} />
            <div className="p-5 space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <Select label={t.select_crop} options={cropOptions} value={crop} onChange={e => setCrop(e.target.value)} />
                    <Input label={t.land_size} type="number" value={acres} onChange={e => setAcres(e.target.value)} />
                    <Select label={t.select_pesticide} options={pestOptions} value={pesticide} onChange={e => setPesticide(e.target.value)} />
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <label className="block text-gray-700 font-medium mb-3">{t.location}</label>
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 text-center">
                         {coords ? (
                            <div className="text-green-700 flex flex-col items-center">
                                <div className="bg-green-100 p-2 rounded-full mb-2"><MapPinIcon /></div>
                                <span className="font-bold">{t.loc_found}</span>
                                <span className="text-xs font-mono mt-1 text-gray-500">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
                            </div>
                         ) : (
                            <div className="text-gray-400 text-sm mb-2">GPS required for drone accuracy</div>
                         )}
                        
                        <Button 
                            variant="outline" 
                            onClick={getGeoLocation}
                            disabled={locLoading}
                            className="mt-2 text-sm"
                            size="sm"
                        >
                            {locLoading ? t.loading : coords ? 'Update Location' : t.get_location}
                        </Button>
                    </div>
                </div>

                <Button fullWidth onClick={handleSubmit} disabled={loading} className="shadow-xl shadow-green-200">
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

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* Drone Header with HUD */}
            <div className="relative">
                <div className="absolute top-4 right-4 z-20">
                    {LangButton}
                </div>
                <DroneHUD user={user} t={t} />
            </div>
            
            {/* Quick Action - Overlapping the Drone View */}
            <div className="px-4 -mt-6 relative z-10">
                <Button variant="secondary" fullWidth onClick={() => setView('FARMER_BOOK')} className="shadow-lg py-4 border-2 border-white flex justify-center items-center gap-2 text-lg">
                    <span className="text-2xl">+</span> {t.book_service}
                </Button>
            </div>

            {/* List */}
            <div className="px-4 mt-6">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="font-bold text-lg text-gray-800">{t.my_bookings}</h3>
                </div>
                
                {loading ? <p className="text-center text-gray-500 py-10 italic">{t.loading}</p> : (
                    <div className="space-y-4">
                        {bookings.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                                {t.no_bookings}
                            </div>
                        )}
                        {bookings.map(b => (
                            <BookingCard key={b.id} booking={b} t={t} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around py-3 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] max-w-md mx-auto right-0 z-50">
                <NavBtn icon={<LeafIcon />} label={t.home} active />
                <NavBtn icon={<ListIcon />} label={t.my_bookings} />
                <NavBtn icon={<UserIcon />} label={t.profile} onClick={handleLogout} />
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
        <div className="pb-20 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">{t.admin_panel}</h1>
                <div className="flex gap-4 items-center">
                    <button onClick={toggleLanguage} className="text-xs font-bold bg-gray-100 text-primary px-3 py-1 rounded-full">
                         {language === 'en' ? 'EN' : language === 'hi' ? 'HI' : 'TE'}
                    </button>
                    <button onClick={handleLogout} className="text-red-500 text-sm font-semibold hover:bg-red-50 px-2 py-1 rounded">
                        Exit
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{b.cropType}</h4>
                                <p className="text-sm text-gray-500 font-medium">{b.userPhone}</p>
                            </div>
                            <StatusBadge status={b.status} t={t} />
                        </div>
                        <div className="text-sm text-gray-600 space-y-2 mb-5 bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Farmer:</span>
                                <span className="font-medium">{user?.role === UserRole.ADMIN ? (b as any).userName : ''}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Area:</span>
                                <span className="font-medium">{b.acres} Acres</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Chemical:</span>
                                <span className="font-medium">{b.pesticide}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Date:</span>
                                <span className="font-medium">{new Date(b.createdAt).toLocaleDateString()}</span>
                            </div>
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
                                    Cancel
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
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl relative border-x border-gray-200">
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
                <button onClick={onBack} className="mr-3 p-1 hover:bg-white/10 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <h1 className="text-lg font-bold tracking-wide">{title}</h1>
        </div>
        {rightContent && <div>{rightContent}</div>}
    </div>
);

const NavBtn: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-colors ${active ? 'text-primary font-semibold' : 'text-gray-400 hover:text-gray-600'}`}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider mt-1">{label}</span>
    </button>
);

const BookingCard: React.FC<{ booking: Booking, t: any }> = ({ booking, t }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-800 p-1.5 rounded-lg"><LeafIcon className="w-4 h-4" /></span>
                <h4 className="font-bold text-gray-800">{booking.cropType}</h4>
            </div>
            <p className="text-xs text-gray-500 ml-9">{booking.acres} Acres • {new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
        <StatusBadge status={booking.status} t={t} />
    </div>
);

const StatusBadge: React.FC<{ status: BookingStatus, t: any }> = ({ status, t }) => {
    let color = 'bg-gray-100 text-gray-600';
    let label = t.status_requested;

    switch(status) {
        case BookingStatus.REQUESTED: color = 'bg-yellow-100 text-yellow-800 border border-yellow-200'; label=t.status_requested; break;
        case BookingStatus.SCHEDULED: color = 'bg-blue-100 text-blue-800 border border-blue-200'; label=t.status_scheduled; break;
        case BookingStatus.COMPLETED: color = 'bg-green-100 text-green-800 border border-green-200'; label=t.status_completed; break;
        case BookingStatus.CANCELLED: color = 'bg-red-100 text-red-800 border border-red-200'; label=t.status_cancelled; break;
    }

    return (
        <span className={`text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-bold ${color}`}>
            {label}
        </span>
    );
};