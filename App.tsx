import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Booking, BookingStatus, Language, Coordinates } from './types';
import { TRANSLATIONS, CROPS, PESTICIDES } from './constants';
import { mockLogin, logout, getUser, createBooking, getBookings, updateBookingStatus, updateBooking } from './services/mockService';
import { Button } from './components/Button';
import { Input, Select } from './components/Input';

// --- Image Assets ---
const IMAGES = {
  SPLASH: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  LOGIN_BG: "https://images.unsplash.com/photo-1530266986504-ec88029519c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  HUD_FEED: "https://images.unsplash.com/photo-1473960104873-49d799008272?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  FARM_GENERAL: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  CROPS: {
    'Rice (Paddy)': "https://images.unsplash.com/photo-1536630596251-b12ba0d7f7eb?auto=format&fit=crop&w=600&q=80",
    'Wheat': "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=600&q=80",
    'Cotton': "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=600&q=80",
    'Sugarcane': "https://images.unsplash.com/photo-1596435349474-539091807693?auto=format&fit=crop&w=600&q=80",
    'Maize': "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    'Vegetables': "https://images.unsplash.com/photo-1566385925601-57f585144663?auto=format&fit=crop&w=600&q=80",
    'Chilli': "https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?auto=format&fit=crop&w=600&q=80",
  }
};

const getCropImage = (crop: string) => (IMAGES.CROPS as any)[crop] || IMAGES.FARM_GENERAL;

// --- Icons ---
const LeafIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const UserIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BatteryIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SignalIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
const EditIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const PhoneIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const CheckIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CloseIcon = ({ className = "w-6 h-6" }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Components ---

const DroneHUD = ({ user, t }: { user: User | null, t: any }) => (
    <div className="relative h-80 w-full bg-gray-900 overflow-hidden shadow-2xl rounded-b-[3.5rem] border-b-4 border-accent/30">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-90 scale-105"
            style={{ backgroundImage: `url('${IMAGES.HUD_FEED}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40">
            <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] font-mono text-green-400">
                <div className="flex items-center bg-black/70 px-3 py-1.5 rounded-full border border-green-500/50 backdrop-blur-md">
                    <span className="animate-pulse mr-2 w-2 h-2 rounded-full bg-red-500"></span> RECON FEED: {new Date().toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-3 bg-black/70 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    <div className="flex items-center text-yellow-400"><BatteryIcon /> 92%</div>
                    <div className="flex items-center text-blue-400"><SignalIcon /> 5G</div>
                </div>
            </div>
            
            {/* Crosshair HUD */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <div className="w-64 h-64 border border-green-400/20 rounded-full flex items-center justify-center relative">
                    <div className="w-full h-[1px] bg-green-400/10 absolute"></div>
                    <div className="h-full w-[1px] bg-green-400/10 absolute"></div>
                    <div className="w-4 h-4 border-2 border-green-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute top-0 text-green-400 font-mono text-[8px] -mt-4">ALT: 15.4m</div>
                    <div className="absolute right-0 text-green-400 font-mono text-[8px] -mr-6">DIST: 240m</div>
                 </div>
            </div>

            <div className="absolute bottom-10 left-8 text-white">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black drop-shadow-lg tracking-tighter uppercase">{t.welcome}, {user?.name?.split(' ')[0]}</h2>
                        <p className="text-[10px] font-mono text-accent bg-black/40 px-2 py-0.5 rounded inline-block border border-accent/20">
                           {t.drone_status} • AUTOPILOT ON
                        </p>
                    </div>
                </div>
            </div>
             <div className="absolute bottom-10 right-8 text-right">
                <p className="text-[10px] font-mono text-white/80 bg-black/50 px-3 py-1.5 rounded-full border border-white/10">{t.weather}</p>
            </div>
        </div>
    </div>
);

const FlyingDrone = ({ className = "" }: { className?: string }) => (
    <div className={`absolute top-[15%] -left-20 z-0 animate-fly pointer-events-none drop-shadow-2xl ${className}`}>
      <svg width="220" height="130" viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="65" r="45" fill="#4ade80" fillOpacity="0.15" className="animate-pulse" />
        <path d="M70 75 L50 95" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
        <path d="M150 75 L170 95" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
        <path d="M70 55 L50 35" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
        <path d="M150 55 L170 35" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
        <g className="animate-[prop_0.1s_linear_infinite] origin-[50px_35px]"><ellipse cx="50" cy="35" rx="40" ry="5" fill="rgba(200,255,200,0.5)" /></g>
        <g className="animate-[prop_0.1s_linear_infinite] origin-[170px_35px]"><ellipse cx="170" cy="35" rx="40" ry="5" fill="rgba(200,255,200,0.5)" /></g>
        <g className="animate-[prop_0.1s_linear_infinite] origin-[50px_95px]"><ellipse cx="50" cy="95" rx="40" ry="5" fill="rgba(200,255,200,0.5)" /></g>
        <g className="animate-[prop_0.1s_linear_infinite] origin-[170px_95px]"><ellipse cx="170" cy="95" rx="40" ry="5" fill="rgba(200,255,200,0.5)" /></g>
        <path d="M80 50 H140 L130 80 H90 L80 50Z" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
        <g transform="translate(110, 85)"><circle r="12" fill="#1f2937" /><circle r="6" fill="#10b981" className="animate-ping" opacity="0.5" /><circle r="4" fill="#059669" /></g>
        <rect x="75" y="48" width="8" height="4" fill="#ef4444" className="animate-pulse" />
        <rect x="137" y="48" width="8" height="4" fill="#ef4444" className="animate-pulse" />
      </svg>
    </div>
);

const CallSupportFab = ({ t, hasNav }: { t: any, hasNav: boolean }) => (
    <a 
        href="tel:18001234567" 
        className={`fixed right-4 md:right-8 z-50 bg-white text-green-700 px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-green-50 hover:scale-105 active:scale-95 transition-all border border-green-100 animate-bounce ${hasNav ? 'bottom-24' : 'bottom-10'}`}
        aria-label={t.call_support}
    >
        <div className="bg-green-100 p-2.5 rounded-full shadow-inner">
            <PhoneIcon className="w-5 h-5" />
        </div>
        <span className="font-black tracking-tight text-sm uppercase">{t.call_support}</span>
    </a>
);

const SplashScreen = ({ t }: { t: any }) => (
    <div className="fixed inset-0 z-[100] bg-green-950 flex flex-col items-center justify-center overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-110"
            style={{ backgroundImage: `url('${IMAGES.SPLASH}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/80 via-transparent to-green-950"></div>
        
        <div className="relative w-full h-full flex items-center justify-center">
             <FlyingDrone className="!top-[40%] !left-1/2 !-translate-x-1/2 !scale-150 drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]" />
             
             <div className="relative z-10 flex flex-col items-center animate-[scan_2s_ease-in-out] mt-32">
                <div className="bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-3xl border border-white/30 shadow-2xl mb-8 group hover:scale-110 transition-transform">
                    <LeafIcon className="w-16 h-16 text-accent group-hover:rotate-12 transition-transform" />
                </div>
                <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl italic uppercase">{t.app_name}</h1>
                <p className="text-accent font-mono mt-6 tracking-[0.4em] text-[10px] uppercase font-bold animate-pulse">Scanning Agricultural Horizon</p>
             </div>
        </div>
        
        <div className="absolute bottom-16 flex flex-col items-center gap-4">
             <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-accent animate-[scan_3s_infinite] w-1/3 rounded-full"></div>
             </div>
             <p className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-bold">DroneTech Solutions India</p>
        </div>
    </div>
);

type ViewState = 'LOGIN' | 'FARMER_HOME' | 'FARMER_BOOK' | 'FARMER_PROFILE' | 'BOOKING_DETAIL' | 'ADMIN_HOME';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<ViewState>('LOGIN');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Load user on mount and handle splash
  useEffect(() => {
    const splashTimer = setTimeout(() => {
        setShowSplash(false);
    }, 3500);

    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setView(storedUser.role === UserRole.ADMIN ? 'ADMIN_HOME' : 'FARMER_HOME');
    }

    return () => clearTimeout(splashTimer);
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
    <button onClick={toggleLanguage} className="text-xs font-black bg-white/20 hover:bg-white/40 text-white px-5 py-2.5 rounded-full border border-white/30 transition-all backdrop-blur-xl shadow-2xl uppercase tracking-widest">
        {language === 'en' ? 'EN' : 'తెలుగు'}
    </button>
  );

  const showCallSupport = !showSplash && view !== 'ADMIN_HOME';
  const hasBottomNav = view === 'FARMER_HOME' || view === 'FARMER_PROFILE';

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
        <div 
            className="absolute inset-0 bg-cover bg-center z-0 scale-110"
            style={{ backgroundImage: `url('${IMAGES.LOGIN_BG}')`, filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-green-950/40 to-transparent z-0"></div>
        <FlyingDrone />

        <div className="w-full max-w-sm bg-white/95 backdrop-blur-3xl rounded-t-[3.5rem] md:rounded-[3.5rem] shadow-[0_35px_80px_-20px_rgba(0,0,0,0.6)] p-10 mx-4 z-10 transition-all duration-700 border-t border-white/50 mb-16 md:mb-10">
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-2xl shadow-inner">
                    <LeafIcon className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{t.app_name}</h1>
            </div>
            <button onClick={toggleLanguage} className="text-[10px] font-black bg-green-100 text-green-950 px-4 py-2 rounded-full border border-green-200 hover:bg-green-200 transition-all uppercase tracking-widest">
                {language === 'en' ? 'Eng' : 'Tel'}
            </button>
          </div>
          
          <div className="mb-10">
            <h2 className="text-4xl font-black text-green-950 mb-3 leading-none tracking-tight">{t.login_title}</h2>
            <p className="text-green-700/80 font-bold uppercase tracking-widest text-xs">{t.login_subtitle}</p>
          </div>
          
          {step === 1 ? (
            <div className="space-y-4">
              <Input 
                label={t.name_label}
                type="text"
                placeholder="Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                label={t.phone_label} 
                type="tel" 
                placeholder="+91 00000 00000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <div className="pt-4">
                <Button fullWidth onClick={sendOtp} disabled={loading} className="py-5 shadow-green-500/40 rounded-[2rem]">
                    {loading ? t.loading : t.send_otp}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-200 p-5 rounded-3xl text-sm text-green-950 text-center mb-8 font-bold shadow-sm">
                 OTP SENT TO <span className="text-primary text-lg ml-1">{phone}</span>
              </div>
              <Input 
                label={t.enter_otp} 
                type="number" 
                placeholder="• • • • • •" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                className="text-center text-3xl tracking-[0.5em] font-black"
              />
              <div className="pt-4">
                <Button fullWidth onClick={verifyOtp} disabled={loading} className="py-5 shadow-green-500/40 rounded-[2rem]">
                    {loading ? t.loading : t.verify_otp}
                </Button>
              </div>
              <button onClick={() => setStep(1)} className="mt-8 text-xs font-black text-center w-full text-green-700/60 uppercase tracking-widest hover:text-primary transition-colors">
                Change Details
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const FarmerBookView = () => {
    const isEditing = !!selectedBooking;
    const [crop, setCrop] = useState(selectedBooking?.cropType || '');
    const [acres, setAcres] = useState(selectedBooking?.acres.toString() || '');
    const [pesticide, setPesticide] = useState(selectedBooking?.pesticide || '');
    const [date, setDate] = useState(selectedBooking?.preferredDate || '');
    const [time, setTime] = useState(selectedBooking?.preferredTime || '');
    const [coords, setCoords] = useState<Coordinates | null>(selectedBooking?.location || null);
    const [loading, setLoading] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    const getGeoLocation = () => {
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
          () => { alert('GPS failed'); setLocLoading(false); }
        );
    };

    const handleSubmit = async () => {
        if (!crop || !acres || !pesticide || !coords || !date || !time) return alert('Fill all fields including date and time');
        setLoading(true);
        if (isEditing && selectedBooking) {
            await updateBooking(selectedBooking.id, { cropType: crop, acres: Number(acres), pesticide, location: coords, preferredDate: date, preferredTime: time });
        } else {
            await createBooking({ userId: user!.id, userPhone: user!.phone, cropType: crop, acres: Number(acres), pesticide, location: coords, locationAddress: '', preferredDate: date, preferredTime: time });
        }
        setLoading(false);
        setSelectedBooking(null);
        setView('FARMER_HOME');
    };

    const cropOptions = CROPS.map(c => ({ value: c.en, label: language === 'te' ? c.te : c.en }));
    const pestOptions = PESTICIDES.map(p => ({ value: p, label: p }));

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title={isEditing ? t.update_request : t.book_service} showBack onBack={() => { setSelectedBooking(null); setView('FARMER_HOME'); }} />
            <div className="p-6 space-y-6">
                <div className="relative h-44 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl border-4 border-white">
                    <img src={getCropImage(crop)} className="w-full h-full object-cover transition-all duration-1000" alt="Crop view" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                        <span className="text-white font-black text-2xl uppercase tracking-tighter">{crop || "Field View"}</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-2">
                    <Select label={t.select_crop} options={cropOptions} value={crop} onChange={e => setCrop(e.target.value)} />
                    <Input label={t.land_size} type="number" value={acres} onChange={e => setAcres(e.target.value)} />
                    <Select label={t.select_pesticide} options={pestOptions} value={pesticide} onChange={e => setPesticide(e.target.value)} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input label={t.pref_date} type="date" value={date} onChange={e => setDate(e.target.value)} />
                        <Input label={t.pref_time} type="time" value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <label className="block text-green-950 font-black uppercase tracking-widest mb-4 ml-1 text-[10px]">{t.location}</label>
                    <div className="p-8 border-2 border-dashed border-green-100 rounded-[2rem] bg-green-50/30 flex flex-col items-center justify-center gap-4 text-center">
                         {coords ? (
                            <div className="text-primary flex flex-col items-center animate-[scan_1s_ease-out]">
                                <div className="bg-white p-4 rounded-3xl shadow-lg border border-green-100 mb-2"><MapPinIcon /></div>
                                <span className="font-black text-lg uppercase">{t.loc_found}</span>
                                <span className="text-[10px] font-mono mt-2 bg-green-100 px-3 py-1 rounded-full">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                            </div>
                         ) : (
                            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">{t.get_location}</div>
                         )}
                        <Button variant="outline" onClick={getGeoLocation} disabled={locLoading} className="mt-2 text-xs border-green-200 rounded-full" size="sm">
                            {locLoading ? t.loading : t.get_location}
                        </Button>
                    </div>
                </div>

                <Button fullWidth onClick={handleSubmit} disabled={loading} className="py-6 rounded-[2.5rem] text-xl shadow-2xl shadow-green-900/20">
                    {loading ? t.loading : (isEditing ? t.update_request : t.submit_request)}
                </Button>
            </div>
        </div>
    );
  };

  const BookingDetailView = () => {
    if (!selectedBooking) return null;
    const canEdit = selectedBooking.status === BookingStatus.REQUESTED;

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
             <Header title={t.booking_details} showBack onBack={() => setView('FARMER_HOME')} />
             <div className="relative h-64 w-full">
                <img src={getCropImage(selectedBooking.cropType)} className="w-full h-full object-cover" alt="Detail View" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-black/30"></div>
                <div className="absolute bottom-6 left-6">
                    <StatusBadge status={selectedBooking.status} t={t} />
                </div>
             </div>
             <div className="p-6 -mt-10 relative z-10 space-y-6">
                 <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                         <h3 className="text-2xl font-black text-gray-950 uppercase italic tracking-tighter">{selectedBooking.cropType}</h3>
                         <span className="text-[10px] font-mono text-gray-400">ID: #{selectedBooking.id.slice(-6)}</span>
                    </div>
                    <DetailRow label={t.land_size} value={`${selectedBooking.acres} ACRES`} />
                    <DetailRow label={t.select_pesticide} value={selectedBooking.pesticide} />
                    <DetailRow label={t.pref_date} value={selectedBooking.preferredDate || 'N/A'} />
                    <DetailRow label={t.pref_time} value={selectedBooking.preferredTime || 'N/A'} />
                    <DetailRow label="DATE REQUESTED" value={new Date(selectedBooking.createdAt).toLocaleDateString()} />
                    {selectedBooking.location && (
                        <div className="pt-4 mt-4 border-t border-gray-50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Farm Coordinates</p>
                            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
                                <MapPinIcon />
                                <span className="font-mono text-xs">{selectedBooking.location.lat.toFixed(6)}, {selectedBooking.location.lng.toFixed(6)}</span>
                            </div>
                        </div>
                    )}
                 </div>

                 {canEdit && (
                     <div className="flex gap-4">
                         <Button variant="secondary" fullWidth onClick={() => setView('FARMER_BOOK')} className="rounded-[2rem] py-5">
                             <EditIcon /> {t.edit}
                         </Button>
                         <Button variant="danger" fullWidth onClick={async () => { if(confirm('Cancel?')) { await updateBookingStatus(selectedBooking.id, BookingStatus.CANCELLED); setView('FARMER_HOME'); } }} className="rounded-[2rem] py-5">
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
    useEffect(() => { if (user) getBookings(user).then(setBookings); }, [user]);
    const totalAcres = bookings.reduce((acc, curr) => acc + curr.acres, 0);

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title={t.profile} />
            <div className="p-6 space-y-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: `url('${IMAGES.FARM_GENERAL}')` }}></div>
                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-2xl border-8 border-green-50 relative z-10 overflow-hidden">
                        <UserIcon className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">{user?.name}</h2>
                    <p className="text-gray-400 font-bold mt-1 tracking-widest text-xs">{user?.phone}</p>
                    <div className="mt-10">
                        <button onClick={toggleLanguage} className="text-[10px] font-black bg-accent text-green-950 px-6 py-3 rounded-full border border-yellow-500/20 hover:scale-105 active:scale-95 transition-all shadow-lg uppercase tracking-widest">
                            {language === 'en' ? 'తెలుగుకు మారండి' : 'SWITCH TO ENGLISH'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all">
                        <h3 className="text-4xl font-black text-primary">{bookings.length}</h3>
                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-3 font-black">{t.total_bookings}</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all">
                        <h3 className="text-4xl font-black text-yellow-500">{totalAcres}</h3>
                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-3 font-black">{t.acres_covered}</p>
                    </div>
                </div>

                <Button variant="outline" fullWidth onClick={handleLogout} className="mt-8 border-red-100 text-red-500 hover:bg-red-50 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs">
                    {t.logout}
                </Button>
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around py-4 pb-safe shadow-2xl max-w-md mx-auto right-0 z-50">
                <NavBtn icon={<LeafIcon />} label={t.home} onClick={() => setView('FARMER_HOME')} />
                <NavBtn icon={<UserIcon />} label={t.profile} active />
            </div>
        </div>
    );
  };

  const FarmerHomeView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { if (user) getBookings(user).then(res => { setBookings(res); setLoading(false); }); }, [user, view]);

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <div className="relative">
                <div className="absolute top-6 right-6 z-20">{LangButton}</div>
                <DroneHUD user={user} t={t} />
            </div>
            <div className="px-6 -mt-12 relative z-10">
                <Button variant="secondary" fullWidth onClick={() => { setSelectedBooking(null); setView('FARMER_BOOK'); }} className="shadow-[0_20px_50px_rgba(250,204,21,0.3)] py-6 border-4 border-gray-50 flex justify-center items-center gap-4 text-xl rounded-[2.5rem] uppercase italic font-black">
                    <span className="text-3xl">+</span> <span>{t.book_service}</span>
                </Button>
            </div>
            <div className="px-6 mt-12">
                <h3 className="font-black text-2xl text-gray-950 mb-6 uppercase italic tracking-tighter">{t.my_bookings}</h3>
                {loading ? <p className="text-center text-gray-400 py-10 font-bold uppercase tracking-widest text-xs">Syncing Cloud...</p> : (
                    <div className="space-y-6">
                        {bookings.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 text-gray-400 font-bold uppercase tracking-widest text-[10px]">{t.no_bookings}</div>
                        )}
                        {bookings.map(b => (
                            <div key={b.id} onClick={() => { setSelectedBooking(b); setView('BOOKING_DETAIL'); }}>
                                <BookingCard booking={b} t={t} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around py-4 pb-safe shadow-2xl max-w-md mx-auto right-0 z-50">
                <NavBtn icon={<LeafIcon />} label={t.home} active />
                <NavBtn icon={<UserIcon />} label={t.profile} onClick={() => setView('FARMER_PROFILE')} />
            </div>
        </div>
    );
  };

  const AdminHomeView = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
    const refresh = useCallback(() => { if (user) getBookings(user).then(setBookings); }, [user]);
    useEffect(() => { refresh(); }, [refresh]);

    const pendingBookings = bookings.filter(b => b.status === BookingStatus.REQUESTED);
    const otherBookings = bookings.filter(b => b.status !== BookingStatus.REQUESTED);
    const displayBookings = activeTab === 'PENDING' ? pendingBookings : otherBookings;

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <div className="bg-primary pt-8 pb-20 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${IMAGES.HUD_FEED}')` }}></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary"></div>
                 <div className="relative z-10 flex justify-between items-center text-white mb-8">
                    <h1 className="text-3xl font-black flex items-center gap-3 italic uppercase tracking-tighter">
                        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md"><LeafIcon className="w-6 h-6"/></div>
                        {t.admin_panel}
                    </h1>
                    <button onClick={handleLogout} className="text-white/60 hover:text-white bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Exit</button>
                 </div>
                 <div className="flex gap-4 relative z-10">
                     <div onClick={() => setActiveTab('PENDING')} className={`flex-1 p-6 rounded-[2rem] transition-all cursor-pointer ${activeTab === 'PENDING' ? 'bg-white text-primary shadow-2xl scale-105' : 'bg-white/10 text-white border border-white/20'}`}>
                        <div className="text-4xl font-black">{pendingBookings.length}</div>
                        <div className="text-[9px] uppercase font-black tracking-widest mt-1 opacity-80">{t.pending_requests}</div>
                     </div>
                     <div onClick={() => setActiveTab('ALL')} className={`flex-1 p-6 rounded-[2rem] transition-all cursor-pointer ${activeTab === 'ALL' ? 'bg-white text-primary shadow-2xl scale-105' : 'bg-white/10 text-white border border-white/20'}`}>
                        <div className="text-4xl font-black">{otherBookings.length}</div>
                        <div className="text-[9px] uppercase font-black tracking-widest mt-1 opacity-80">{t.active_jobs}</div>
                     </div>
                 </div>
            </div>

            <div className="px-6 -mt-10 relative z-20 space-y-6">
                {displayBookings.map(b => (
                    <div key={b.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <img src={getCropImage(b.cropType)} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt="Crop" />
                                <div>
                                    <h4 className="font-black text-gray-950 uppercase italic tracking-tighter text-lg">{b.cropType}</h4>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{(b as any).userName} • {b.userPhone}</p>
                                </div>
                            </div>
                            <StatusBadge status={b.status} t={t} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-gray-500 mb-6 bg-gray-50 p-4 rounded-3xl uppercase tracking-widest">
                            <div>SIZE: <span className="text-gray-900">{b.acres} ACRES</span></div>
                            <div>PROD: <span className="text-gray-900">{b.pesticide}</span></div>
                            <div>DATE: <span className="text-gray-900">{b.preferredDate || 'ANY'}</span></div>
                            <div>TIME: <span className="text-gray-900">{b.preferredTime || 'ANY'}</span></div>
                        </div>
                        <div className="flex gap-3">
                            {b.status === BookingStatus.REQUESTED && (
                                <>
                                    <button onClick={async () => { await updateBookingStatus(b.id, BookingStatus.SCHEDULED); refresh(); }} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-900/20 flex justify-center items-center gap-2 transition-all hover:scale-105 active:scale-95"><CheckIcon className="w-4 h-4" /> {t.accept}</button>
                                    <button onClick={async () => { await updateBookingStatus(b.id, BookingStatus.CANCELLED); refresh(); }} className="px-5 border-2 border-red-50 text-red-500 rounded-2xl hover:bg-red-50 transition-all"><CloseIcon /></button>
                                </>
                            )}
                            {b.status === BookingStatus.SCHEDULED && (
                                <Button size="sm" fullWidth className="py-4 text-xs uppercase" onClick={async () => { await updateBookingStatus(b.id, BookingStatus.COMPLETED); refresh(); }}>{t.mark_completed}</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 overflow-x-hidden">
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl relative border-x border-gray-200">
            {showSplash && <SplashScreen t={t} />}
            <div className={`transition-opacity duration-1000 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {view === 'LOGIN' && <LoginView />}
                {view === 'FARMER_HOME' && <FarmerHomeView />}
                {view === 'FARMER_BOOK' && <FarmerBookView />}
                {view === 'FARMER_PROFILE' && <FarmerProfileView />}
                {view === 'BOOKING_DETAIL' && <BookingDetailView />}
                {view === 'ADMIN_HOME' && <AdminHomeView />}
                {showCallSupport && <CallSupportFab t={t} hasNav={hasBottomNav} />}
            </div>
        </div>
    </div>
  );
}

// --- Sub Components ---
const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between border-b border-gray-50 last:border-0 pb-4 last:pb-0">
        <span className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
        <span className="font-black text-gray-950 uppercase tracking-tighter italic">{value}</span>
    </div>
);

const Header: React.FC<{ title: string, showBack?: boolean, onBack?: () => void }> = ({ title, showBack, onBack }) => (
    <div className="bg-primary/95 backdrop-blur-xl p-6 sticky top-0 z-[60] flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-4">
            {showBack && (
                <button onClick={onBack} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{title}</h1>
        </div>
    </div>
);

const NavBtn: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-gray-400 opacity-60'}`}>
        <div className={`p-2 rounded-2xl transition-all ${active ? 'bg-primary/5 shadow-inner' : ''}`}>{icon}</div>
        <span className="text-[8px] uppercase tracking-widest mt-1 font-black">{label}</span>
    </button>
);

const BookingCard: React.FC<{ booking: Booking, t: any }> = ({ booking, t }) => (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 flex items-center gap-5 transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer group active:scale-95">
        <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-lg border-2 border-white relative">
            <img src={getCropImage(booking.cropType)} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="Crop" />
            <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="flex-1">
            <h4 className="font-black text-gray-950 text-xl uppercase italic tracking-tighter mb-1">{booking.cropType}</h4>
            <div className="flex items-center gap-3">
                <StatusBadge status={booking.status} t={t} />
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{booking.acres} AC</span>
            </div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: BookingStatus, t: any }> = ({ status, t }) => {
    let color = 'bg-gray-100 text-gray-600';
    let label = t.status_requested;
    switch(status) {
        case BookingStatus.REQUESTED: color = 'bg-yellow-50 text-yellow-700 border-yellow-100'; label=t.status_requested; break;
        case BookingStatus.SCHEDULED: color = 'bg-blue-50 text-blue-700 border-blue-100'; label=t.status_scheduled; break;
        case BookingStatus.COMPLETED: color = 'bg-green-50 text-green-700 border-green-100'; label=t.status_completed; break;
        case BookingStatus.CANCELLED: color = 'bg-red-50 text-red-600 border-red-100'; label=t.status_cancelled; break;
    }
    return <span className={`text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full font-black border shadow-inner ${color}`}>{label}</span>;
};