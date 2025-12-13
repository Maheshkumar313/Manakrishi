import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Booking, BookingStatus, Language, Coordinates } from './types';
import { TRANSLATIONS, CROPS, PESTICIDES } from './constants';
import { mockLogin, logout, getUser, createBooking, getBookings, updateBookingStatus, updateBooking } from './services/mockService';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';

// --- Icons ---
const LeafIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const ListIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const UserIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BatteryIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SignalIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
const EditIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;

// --- Components ---

const DroneHUD = ({ user, t }: { user: User | null, t: any }) => (
    <div className="relative h-72 w-full bg-gray-900 overflow-hidden shadow-2xl rounded-b-[3rem] border-b-4 border-primary">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
        />
        <div className="absolute inset-0 drone-overlay bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute top-4 left-4 right-4 flex justify-between text-xs font-mono text-green-400">
                <div className="flex items-center bg-black/50 px-3 py-1.5 rounded-full border border-green-500/30 backdrop-blur-sm">
                    <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-red-500"></span> LIVE FEED
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center"><BatteryIcon /> 84%</div>
                    <div className="flex items-center"><SignalIcon /> 5G</div>
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                 <div className="w-48 h-48 border border-green-400/30 rounded-full flex items-center justify-center relative animate-pulse-slow">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-40 h-40 border border-white/10 rounded-full"></div>
                    <div className="absolute w-4 h-[1px] bg-green-400 -left-2"></div>
                    <div className="absolute w-4 h-[1px] bg-green-400 -right-2"></div>
                    <div className="absolute h-4 w-[1px] bg-green-400 -top-2"></div>
                    <div className="absolute h-4 w-[1px] bg-green-400 -bottom-2"></div>
                 </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-400/30 shadow-[0_0_15px_rgba(74,222,128,0.6)] animate-scan"></div>
            <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold drop-shadow-md tracking-tight">{t.welcome}, {user?.name?.split(' ')[0]}</h2>
                <p className="text-xs font-mono text-green-300 bg-black/60 px-2 py-1 rounded inline-block mt-2 border border-green-900/50">
                    {t.drone_status}
                </p>
            </div>
             <div className="absolute bottom-6 right-6 text-right">
                <p className="text-xs font-mono text-white/90 bg-black/30 px-2 py-1 rounded">{t.weather}</p>
            </div>
        </div>
    </div>
);

type ViewState = 'LOGIN' | 'FARMER_HOME' | 'FARMER_BOOK' | 'FARMER_PROFILE' | 'BOOKING_DETAIL' | 'ADMIN_HOME';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<ViewState>('LOGIN');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
    setLanguage(prev => prev === 'en' ? 'te' : 'en');
  };

  const LangButton = (
    <button onClick={toggleLanguage} className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition-all backdrop-blur-md shadow-lg">
        {language === 'en' ? '🇺🇸 EN' : '🇮🇳 తెలుగు'}
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
      <div className="flex flex-col items-center justify-end md:justify-center min-h-screen relative overflow-hidden">
        {/* Immersive Background */}
        <div 
            className="absolute inset-0 bg-cover bg-center z-0 scale-105"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1530266986504-ec88029519c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
                filter: 'brightness(0.85)'
            }}
        />
        {/* Rich Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/60 to-transparent z-0"></div>

        {/* Floating Glass Card */}
        <div className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-8 mx-4 z-10 transition-all duration-700 animate-[scan_0.5s_ease-out] border-t border-white/40 mb-0 md:mb-10">
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-xl">
                    <LeafIcon className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.app_name}</h1>
            </div>
            <button onClick={toggleLanguage} className="text-[10px] font-bold bg-green-50 text-green-800 px-3 py-1.5 rounded-full border border-green-100 hover:bg-green-100 transition-colors uppercase tracking-wider">
                {language === 'en' ? 'Eng' : 'Tel'}
            </button>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-950 mb-2">{t.login_title}</h2>
            <p className="text-green-700/70 font-medium">{t.login_subtitle}</p>
          </div>
          
          {step === 1 ? (
            <div className="space-y-2 animate-pulse-slow" style={{ animationDuration: '0.3s', animationIterationCount: 1 }}>
              <Input 
                label={t.name_label}
                type="text"
                placeholder="Ex: Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label={t.phone_label} 
                type="tel" 
                placeholder="98765 43210" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <div className="pt-2">
                <Button fullWidth onClick={sendOtp} disabled={loading} className="shadow-green-500/30">
                    {loading ? t.loading : t.send_otp}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 animate-pulse-slow" style={{ animationDuration: '0.3s', animationIterationCount: 1 }}>
              <div className="bg-green-50/80 border border-green-100 p-4 rounded-2xl text-sm text-green-800 text-center mb-6 shadow-sm">
                 OTP sent to <span className="font-bold">{phone}</span>
              </div>
              <Input 
                label={t.enter_otp} 
                type="number" 
                placeholder="• • • • • •" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="text-center text-2xl tracking-widest"
              />
              <div className="pt-2">
                <Button fullWidth onClick={verifyOtp} disabled={loading} className="shadow-green-500/30">
                    {loading ? t.loading : t.verify_otp}
                </Button>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="mt-6 text-sm font-semibold text-center w-full text-green-600 hover:text-green-800 transition-colors"
              >
                Change Details
              </button>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-green-100 text-[10px] text-center text-green-600/60 font-medium uppercase tracking-widest">
            Powered by Manakrishi Drone Tech
          </div>
        </div>
      </div>
    );
  };

  const FarmerBookView = () => {
    // If editing, preload data
    const isEditing = !!selectedBooking;
    const [crop, setCrop] = useState(selectedBooking?.cropType || '');
    const [acres, setAcres] = useState(selectedBooking?.acres.toString() || '');
    const [pesticide, setPesticide] = useState(selectedBooking?.pesticide || '');
    const [coords, setCoords] = useState<Coordinates | null>(selectedBooking?.location || null);
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
        
        if (isEditing && selectedBooking) {
            await updateBooking(selectedBooking.id, {
                cropType: crop,
                acres: Number(acres),
                pesticide,
                location: coords
            });
            alert(t.success_update);
        } else {
            await createBooking({
                userId: user!.id,
                userPhone: user!.phone,
                cropType: crop,
                acres: Number(acres),
                pesticide,
                location: coords,
                locationAddress: '',
            });
            alert(t.success_booking);
        }
        
        setLoading(false);
        setSelectedBooking(null);
        setView('FARMER_HOME');
    };

    const cropOptions = CROPS.map(c => ({ 
        value: c.en, 
        label: language === 'te' ? c.te : c.en 
    }));

    const pestOptions = PESTICIDES.map(p => ({ value: p, label: p }));

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            <Header title={isEditing ? t.update_request : t.book_service} showBack onBack={() => { setSelectedBooking(null); setView('FARMER_HOME'); }} />
            <div className="p-5 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <Select label={t.select_crop} options={cropOptions} value={crop} onChange={e => setCrop(e.target.value)} />
                    <Input label={t.land_size} type="number" value={acres} onChange={e => setAcres(e.target.value)} />
                    <Select label={t.select_pesticide} options={pestOptions} value={pesticide} onChange={e => setPesticide(e.target.value)} />
                </div>
                
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <label className="block text-green-900 font-semibold mb-3 ml-1 text-sm">{t.location}</label>
                    <div className="p-6 border-2 border-dashed border-green-200 rounded-2xl bg-green-50/50 flex flex-col items-center justify-center gap-3 text-center group hover:bg-green-50 transition-colors">
                         {coords ? (
                            <div className="text-green-700 flex flex-col items-center animate-[pulse_0.5s_ease-out]">
                                <div className="bg-green-100 p-3 rounded-full mb-2 shadow-inner"><MapPinIcon /></div>
                                <span className="font-bold text-lg">{t.loc_found}</span>
                                <span className="text-xs font-mono mt-1 text-green-600/70 bg-white px-2 py-1 rounded border border-green-100">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</span>
                            </div>
                         ) : (
                            <div className="text-gray-400 text-sm mb-2">GPS required for drone accuracy</div>
                         )}
                        
                        <Button 
                            variant="outline" 
                            onClick={getGeoLocation}
                            disabled={locLoading}
                            className="mt-2 text-sm border-green-300 text-green-700 hover:bg-green-100"
                            size="sm"
                        >
                            {locLoading ? t.loading : coords ? 'Update Location' : t.get_location}
                        </Button>
                    </div>
                </div>

                <Button fullWidth onClick={handleSubmit} disabled={loading} className="shadow-xl shadow-green-200 py-5 text-lg">
                    {loading ? t.loading : (isEditing ? t.update_request : t.submit_request)}
                </Button>
            </div>
        </div>
    );
  };

  const BookingDetailView = () => {
    if (!selectedBooking) return null;

    const canEdit = selectedBooking.status === BookingStatus.REQUESTED;

    const handleCancel = async () => {
        if(confirm('Are you sure you want to cancel?')) {
            await updateBookingStatus(selectedBooking.id, BookingStatus.CANCELLED);
            setView('FARMER_HOME');
        }
    };

    const handleEdit = () => {
        setView('FARMER_BOOK');
    };

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
             <Header title={t.booking_details} showBack onBack={() => setView('FARMER_HOME')} />
             <div className="p-5 space-y-5">
                 {/* Status Card */}
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-400 font-mono text-xs tracking-wider">ID: #{selectedBooking.id.slice(-6)}</span>
                    <StatusBadge status={selectedBooking.status} t={t} />
                 </div>

                 {/* Map Placeholder */}
                 <div className="bg-green-100 h-56 rounded-3xl relative overflow-hidden shadow-inner border-4 border-white">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-green-800/40 bg-[radial-gradient(#166534_1px,transparent_1px)] [background-size:16px_16px]">
                        <MapPinIcon />
                        <span className="text-xs mt-2 font-mono">LAT: {selectedBooking.location?.lat.toFixed(4)}</span>
                        <span className="text-xs font-mono">LNG: {selectedBooking.location?.lng.toFixed(4)}</span>
                    </div>
                 </div>

                 {/* Details */}
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <DetailRow label={t.select_crop} value={selectedBooking.cropType} />
                    <DetailRow label={t.land_size} value={`${selectedBooking.acres} Acres`} />
                    <DetailRow label={t.select_pesticide} value={selectedBooking.pesticide} />
                    <DetailRow label="Requested On" value={new Date(selectedBooking.createdAt).toLocaleDateString()} />
                 </div>

                 {/* Actions */}
                 {canEdit && (
                     <div className="flex gap-3">
                         <Button variant="secondary" fullWidth onClick={handleEdit} className="flex items-center justify-center gap-2">
                             <EditIcon /> {t.edit}
                         </Button>
                         <Button variant="danger" fullWidth onClick={handleCancel}>
                             {t.cancel_job}
                         </Button>
                     </div>
                 )}
             </div>
        </div>
    );
  };

  const FarmerProfileView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if (user) {
            getBookings(user).then(setBookings);
        }
    }, [user]);

    const totalAcres = bookings.reduce((acc, curr) => acc + curr.acres, 0);

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title={t.profile} />
            <div className="p-5 space-y-6">
                
                {/* User Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-green-50 to-transparent"></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary mb-4 shadow-lg border-4 border-green-50 relative z-10">
                        <UserIcon className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 font-medium">{user?.phone}</p>
                    <div className="mt-6">
                        <button onClick={toggleLanguage} className="text-xs font-bold bg-gray-50 text-green-800 px-5 py-2.5 rounded-full border border-green-200 hover:bg-green-100 transition-colors uppercase tracking-wider">
                            {language === 'en' ? 'Switch to Telugu (తెలుగు)' : 'Switch to English'}
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <h3 className="text-3xl font-bold text-primary">{bookings.length}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 font-bold">{t.total_bookings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <h3 className="text-3xl font-bold text-yellow-500">{totalAcres}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2 font-bold">{t.acres_covered}</p>
                    </div>
                </div>

                <Button variant="outline" fullWidth onClick={handleLogout} className="mt-4 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200">
                    {t.logout}
                </Button>
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around py-3 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] max-w-md mx-auto right-0 z-50">
                <NavBtn icon={<LeafIcon />} label={t.home} onClick={() => setView('FARMER_HOME')} />
                <NavBtn icon={<UserIcon />} label={t.profile} active />
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
    }, [user, view]); // Reload when view changes (e.g. back from edit)

    const handleBookingClick = (b: Booking) => {
        setSelectedBooking(b);
        setView('BOOKING_DETAIL');
    };

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* Drone Header with HUD */}
            <div className="relative">
                <div className="absolute top-4 right-4 z-20">
                    {LangButton}
                </div>
                <DroneHUD user={user} t={t} />
            </div>
            
            {/* Quick Action */}
            <div className="px-4 -mt-8 relative z-10">
                <Button variant="secondary" fullWidth onClick={() => { setSelectedBooking(null); setView('FARMER_BOOK'); }} className="shadow-2xl shadow-yellow-500/20 py-5 border-4 border-gray-50 flex justify-center items-center gap-3 text-lg rounded-[2rem]">
                    <span className="text-2xl font-light">+</span> <span className="font-bold">{t.book_service}</span>
                </Button>
            </div>

            {/* List */}
            <div className="px-4 mt-8">
                <div className="flex justify-between items-end mb-4 px-2">
                    <h3 className="font-bold text-xl text-gray-900">{t.my_bookings}</h3>
                </div>
                
                {loading ? <p className="text-center text-gray-500 py-10 italic">{t.loading}</p> : (
                    <div className="space-y-4">
                        {bookings.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400">
                                {t.no_bookings}
                            </div>
                        )}
                        {bookings.map(b => (
                            <div key={b.id} onClick={() => handleBookingClick(b)}>
                                <BookingCard booking={b} t={t} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around py-3 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] max-w-md mx-auto right-0 z-50">
                <NavBtn icon={<LeafIcon />} label={t.home} active />
                <NavBtn icon={<UserIcon />} label={t.profile} onClick={() => setView('FARMER_PROFILE')} />
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
                         {language === 'en' ? 'EN' : 'TE'}
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
            {view === 'FARMER_PROFILE' && <FarmerProfileView />}
            {view === 'BOOKING_DETAIL' && <BookingDetailView />}
            {view === 'ADMIN_HOME' && <AdminHomeView />}
        </div>
    </div>
  );
}

// --- Sub Components ---

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <span className="font-bold text-gray-900">{value}</span>
    </div>
);

const Header: React.FC<{ title: string, showBack?: boolean, onBack?: () => void, rightContent?: React.ReactNode }> = ({ title, showBack, onBack, rightContent }) => (
    <div className="bg-primary p-4 sticky top-0 z-10 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center">
            {showBack && (
                <button onClick={onBack} className="mr-3 p-2 hover:bg-white/10 rounded-full transition-colors -ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <h1 className="text-lg font-bold tracking-wide">{title}</h1>
        </div>
        {rightContent && <div>{rightContent}</div>}
    </div>
);

const NavBtn: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
        <div className={active ? 'drop-shadow-sm' : ''}>{icon}</div>
        <span className={`text-[10px] uppercase tracking-wider mt-1 font-bold ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    </button>
);

const BookingCard: React.FC<{ booking: Booking, t: any }> = ({ booking, t }) => (
    <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 flex justify-between items-center transition-all hover:shadow-md cursor-pointer hover:-translate-y-0.5 hover:border-green-100 group">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <span className="bg-green-50 text-green-700 p-2 rounded-xl group-hover:bg-green-100 transition-colors"><LeafIcon className="w-5 h-5" /></span>
                <h4 className="font-bold text-gray-900 text-lg">{booking.cropType}</h4>
            </div>
            <p className="text-xs text-gray-500 ml-10 font-medium">{booking.acres} Acres • {new Date(booking.createdAt).toLocaleDateString()}</p>
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
        case BookingStatus.CANCELLED: color = 'bg-red-50 text-red-800 border border-red-100'; label=t.status_cancelled; break;
    }

    return (
        <span className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold shadow-sm ${color}`}>
            {label}
        </span>
    );
};