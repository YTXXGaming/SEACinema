'use client';

import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Clock, Star, Ticket, ChevronLeft, QrCode } from 'lucide-react';

// -----------------------------
// Types
// -----------------------------
type TierKey = 'standard' | 'vip' | 'premium';

interface AppEvent {
  id: number;
  title: string;
  type: string;
  genre: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  prices: Record<TierKey, number>;
  rating: number;
  message: string;
  posterUrl: string;
  selectedTier?: TierKey;
}

interface TicketItem {
  id: number;
  eventTitle: string;
  userName: string;
  date: string;
  time: string;
  location: string;
  seat: string;
  ticketNumber: string;
  tier: TierKey;
  price: number;
  qrCode: string;
}

// -----------------------------
// Mock data
// -----------------------------
const EVENTS_DB: AppEvent[] = [
  {
    id: 1,
    title: "Zauvijek Tvoja",
    type: "film",
    genre: "Romantična Drama",
    description: "Priča o dvoje mladih ljudi koji pronalaze ljubav u neočekivanim trenucima.",
    location: "SEA Cinema Hall 1",
    date: "2025-12-14",
    time: "20:00",
    duration: "127 min",
    prices: { standard: 15, vip: 25, premium: 40 },
    rating: 9.8,
    message: "Amila, ovaj film te čeka kao Emir što te čeka svakog dana.",
    posterUrl: "/events/event1slika.png"
  },
  {
    id: 2,
    title: "Noćni Šapat",
    type: "predstava",
    genre: "Romantična Komedija",
    description: "Kada se dvoje ljudi sretnu pod zvijezdama, čarolija počinje.",
    location: "SEA Theatre",
    date: "2025-12-20",
    time: "19:30",
    duration: "95 min",
    prices: { standard: 20, vip: 35, premium: 50 },
    rating: 9.5,
    message: "Svaki šapat noći nosi tvoje ime.",
    posterUrl: "/events/event2slika.png"
  }
  // add more if needed
];

// -----------------------------
// Page component
// -----------------------------
export default function Page(): JSX.Element {
  // NOTE: explicit generics so TS does not infer DOM Event
  const [currentPage, setCurrentPage] = useState<'home' | 'details' | 'checkout' | 'ticket' | 'tickets'>('home');
  const [selectedAppEvent, setSelectedAppEvent] = useState<AppEvent | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [currentTicket, setCurrentTicket] = useState<TicketItem | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false);

  // HOME
  const HomeView = () => {
    const [filter, setFilter] = useState<'all' | 'film' | 'predstava' | 'event'>('all');

    const visible = filter === 'all' ? EVENTS_DB : EVENTS_DB.filter(e => e.type === filter);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <div className="relative h-64 bg-gradient-to-br from-pink-600 to-purple-800 p-6 flex flex-col justify-end">
          <div className="absolute top-4 right-4">
            <Heart className="text-pink-300 animate-pulse" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SEA Cinema</h1>
          <p className="text-pink-100 text-sm leading-relaxed">
            Svijet koji dijele Emir i Amila — gdje svaki trenutak postaje uspomena
          </p>
        </div>

        <div className="flex gap-2 p-4 overflow-x-auto">
          {[
            { key: 'all', label: 'Sve' },
            { key: 'film', label: 'Filmovi' },
            { key: 'predstava', label: 'Predstave' },
            { key: 'event', label: 'Događaji' }
          ].map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === (c.key as any)
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="p-4 grid gap-4 pb-24">
          {visible.map((ev) => (
            <div
              key={ev.id}
              onClick={() => {
                // use non-conflicting variable names (ev, selectedAppEvent)
                setSelectedAppEvent(ev);
                setCurrentPage('details');
              }}
              className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-pink-500/20 transition-all cursor-pointer"
            >
              <div className="relative w-full aspect-video">
                <img src={ev.posterUrl} alt={ev.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">{ev.genre}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{ev.description}</p>
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <div className="flex items-center gap-1"><Calendar size={14} /><span>{new Date(ev.date).toLocaleDateString('bs-BA')}</span></div>
                  <div className="flex items-center gap-1"><Clock size={14} /><span>{ev.time}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-pink-500">
            <Star size={24} />
            <span className="text-xs">Početna</span>
          </button>
          <button
            onClick={() => setCurrentPage('tickets')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Ticket size={24} />
            <span className="text-xs">Karte</span>
          </button>
        </div>
      </div>
    );
  };

  // DETAILS
  const DetailsView = () => {
    const ev = selectedAppEvent;
    if (!ev) return null;

    const chooseTier = (tier: TierKey) => {
      setSelectedAppEvent({ ...ev, selectedTier: tier });
      setCurrentPage('checkout');
    };

    return (
      <div className="min-h-screen bg-gray-900">
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center gap-3">
          <button onClick={() => setCurrentPage('home')} className="text-white"><ChevronLeft size={24} /></button>
          <h2 className="text-lg font-bold text-white">Detalji</h2>
        </div>

        <div className="relative w-full aspect-video">
          <img src={ev.posterUrl} className="w-full h-full object-cover" alt={ev.title} />
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded-full flex items-center gap-2">
            <Star size={18} />
            <span className="text-white font-bold">{ev.rating}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-white">{ev.title}</h1>
          <p className="text-gray-400">{ev.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl p-4"><MapPin size={18} /><p className="text-white font-medium">{ev.location}</p></div>
            <div className="bg-gray-800 rounded-xl p-4"><Calendar size={18} /><p className="text-white font-medium">{new Date(ev.date).toLocaleDateString('bs-BA')}</p></div>
            <div className="bg-gray-800 rounded-xl p-4"><Clock size={18} /><p className="text-white font-medium">{ev.time}</p></div>
            <div className="bg-gray-800 rounded-xl p-4"><Star size={18} /><p className="text-white font-medium">{ev.duration}</p></div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Odaberi tip karte</h3>
            <div className="space-y-3">
              {(['standard','vip','premium'] as TierKey[]).map(t => (
                <button key={t} onClick={() => chooseTier(t)}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{t.toUpperCase()}</p>
                    <p className="text-gray-400 text-sm">Opis za {t}</p>
                  </div>
                  <p className="text-pink-400 text-xl font-bold">{ev.prices[t]}€</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // CHECKOUT
  const CheckoutView = () => {
    const ev = selectedAppEvent;
    if (!ev) return null;

    const [form, setForm] = useState({ name: '', email: '', phone: '', date: ev.date });

    const onPay = () => setShowPaymentPopup(true);

    const complete = () => {
      const tier = (ev.selectedTier ?? 'standard') as TierKey;
      const price = ev.prices[tier] ?? 0;
      const newTicket: TicketItem = {
        id: Date.now(),
        eventTitle: ev.title,
        userName: form.name || 'Gost',
        date: form.date,
        time: ev.time,
        location: ev.location,
        seat: `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 20) + 1}`,
        ticketNumber: `SEA-${Date.now().toString().slice(-6)}`,
        tier,
        price,
        qrCode: `QR-${Date.now()}`
      };

      setTickets(prev => [...prev, newTicket]);
      setCurrentTicket(newTicket);
      setShowPaymentPopup(false);
      setCurrentPage('ticket');
    };

    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="text-white font-bold">{ev.title}</h3>
          <p className="text-gray-400">{new Date(ev.date).toLocaleDateString('bs-BA')} • {ev.time}</p>
          <p className="text-pink-400 mt-2 font-medium">{(ev.selectedTier ?? 'standard').toUpperCase()} • {ev.prices[ev.selectedTier ?? 'standard']}€</p>
        </div>

        <div className="space-y-4">
          <input placeholder="Ime i prezime" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                 className="w-full bg-gray-800 text-white rounded-lg px-4 py-3" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                 className="w-full bg-gray-800 text-white rounded-lg px-4 py-3" />
          <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                 className="w-full bg-gray-800 text-white rounded-lg px-4 py-3" />
          <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                 min={ev.date} className="w-full bg-gray-800 text-white rounded-lg px-4 py-3" />

          <button onClick={onPay} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl">Plati {ev.prices[ev.selectedTier ?? 'standard']}€</button>
        </div>

        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-white mb-2">Simulacija plaćanja</h3>
              <p className="text-gray-400 mb-6">Kliknite za generisanje karte (demo).</p>
              <button onClick={complete} className="w-full bg-pink-500 text-white py-3 rounded-xl">Preuzmi kartu</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // TICKET VIEW
  const TicketView = () => {
    if (!currentTicket) return null;

    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-pink-500/20">
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-white">{currentTicket.eventTitle}</h3>
              <p className="text-pink-100">SEA Cinema</p>
            </div>

            <div className="p-6 flex justify-center">
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
                <QrCode size={160} />
              </div>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-gray-500 text-xs mb-1">Ime</p><p className="text-white font-medium">{currentTicket.userName}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Sjedalo</p><p className="text-white font-medium">{currentTicket.seat}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Datum</p><p className="text-white font-medium">{new Date(currentTicket.date).toLocaleDateString('bs-BA')}</p></div>
                <div><p className="text-gray-500 text-xs mb-1">Vrijeme</p><p className="text-white font-medium">{currentTicket.time}</p></div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs mb-1">Broj Karte</p>
                <p className="text-pink-400 font-mono font-bold">{currentTicket.ticketNumber}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button onClick={() => setCurrentPage('home')} className="w-full bg-gray-800 text-white font-medium py-3 rounded-xl">Nazad na Početnu</button>
          </div>
        </div>
      </div>
    );
  };

  // MY TICKETS
  const MyTicketsView = () => {
    return (
      <div className="min-h-screen bg-gray-900 pb-24">
        <div className="sticky top-0 z-10 bg-gray-900/95 border-b border-gray-800 p-4">
          <h2 className="text-xl font-bold text-white">Moje Karte</h2>
        </div>

        <div className="p-4 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket size={64} className="mx-auto mb-4" />
              <p className="text-gray-400">Nemate kupljenih karata</p>
              <button onClick={() => setCurrentPage('home')} className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full">Istraži Događaje</button>
            </div>
          ) : (
            tickets.map(t => (
              <div key={t.id} onClick={() => { setCurrentTicket(t); setCurrentPage('ticket'); }} className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold mb-1">{t.eventTitle}</h3>
                    <p className="text-gray-400 text-sm">{new Date(t.date).toLocaleDateString('bs-BA')} • {t.time}</p>
                  </div>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">{t.seat}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t.ticketNumber}</span>
                  <span className="text-pink-400 font-medium capitalize">{t.tier}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // render switch
  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'details' && <DetailsView />}
      {currentPage === 'checkout' && <CheckoutView />}
      {currentPage === 'ticket' && <TicketView />}
      {currentPage === 'tickets' && <MyTicketsView />}
    </div>
  );
}
