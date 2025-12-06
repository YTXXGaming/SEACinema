'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Star, Ticket, ChevronLeft, QrCode, Download } from 'lucide-react';

// ============================================
// MOCK DATABASE - Eventi
// ============================================
const EVENTS_DB = [
  {
    id: 1,
    title: "Zauvijek Tvoja",
    type: "film",
    genre: "Romantična Drama",
    description: "Priča o dvoje mladih ljudi koji pronalaze ljubav u neočekivanim trenucima. Svaki pogled, svaki osmijeh, svaki trenutak - sve vodi do jednog zaključka: sudbina postoji.",
    location: "SEA Cinema Hall 1",
    date: "2025-12-14",
    time: "20:00",
    duration: "127 min",
    prices: { standard: 15, vip: 25, premium: 40 },
    rating: 9.8,
    message: "Amila, ovaj film te čeka kao Emir što te čeka svakog dana.",
    posterUrl:"/events/event1slika.png"
  },
  {
    id: 2,
    title: "Noćni Šapat",
    type: "predstava",
    genre: "Romantična Komedija",
    description: "Kada se dvoje ljudi sretnu pod zvijezdama, čarolija počinje. Predstava koja slavi ljubav kroz smijeh, suze i beskrajne razgovore do zore.",
    location: "SEA Theatre",
    date: "2025-12-20",
    time: "19:30",
    duration: "95 min",
    prices: { standard: 20, vip: 35, premium: 50 },
    rating: 9.5,
    message: "Svaki šapat noći nosi tvoje ime.",
    posterUrl:"/events/event2slika.png"
  },
  {
    id: 3,
    title: "Ples pod Mjesecom",
    type: "event",
    genre: "Specijalni Događaj",
    description: "Ekskluzivna večer romanike uz muziku, ples i nezaboravne trenutke. Ovaj događaj je kreiran za one koji vjeruju da ljubav nije mit nego najljepša stvarnost.",
    location: "SEA Garden Terrace",
    date: "2025-12-31",
    time: "21:00",
    duration: "180 min",
    prices: { standard: 30, vip: 50, premium: 75 },
    rating: 10.0,
    message: "Emir i Amila - vaša priča zaslužuje ovaj trenutak.",
    posterUrl:"/events/event3slika.png"
  },
  {
    id: 4,
    title: "Putovanje Kroz Vrijeme",
    type: "film",
    genre: "Naučna Fantastika",
    description: "Kada vrijeme stane za dvoje ljudi, ništa nije nemoguće. Film koji istražuje šta znači pronaći osobu sa kojim svaki trenutak postaje vječnost.",
    location: "SEA Cinema Hall 2",
    date: "2025-12-15",
    time: "18:00",
    duration: "142 min",
    prices: { standard: 15, vip: 25, premium: 40 },
    rating: 9.3,
    message: "Vrijeme staje kada ste zajedno.",
    posterUrl:"/events/event4slika.png"
  },
  {
    id: 5,
    title: "Café Susreti",
    type: "predstava",
    genre: "Drama",
    description: "U malom kafiću, dvoje stranaca sjede za susjednim stolovima. Nijedno ne zna da će taj dan promijeniti njihove živote zauvijek.",
    location: "SEA Small Stage",
    date: "2025-12-18",
    time: "20:30",
    duration: "85 min",
    prices: { standard: 18, vip: 30, premium: 45 },
    rating: 9.6,
    message: "Svaki susret može biti početak nečeg prekrasnog.",
    posterUrl:"/events/event5slika.png"
  },
  {
    id: 6,
    title: "Zimska Bajka",
    type: "event",
    genre: "Blagdanski Događaj",
    description: "Magična večer puna svjetla, topline i ljubavi. Doživite čaroliju zime kroz priče, muziku i trenutke koji će ostati u srcu zauvijek.",
    location: "SEA Winter Wonderland",
    date: "2025-12-24",
    time: "19:00",
    duration: "150 min",
    prices: { standard: 25, vip: 40, premium: 60 },
    rating: 9.9,
    message: "Kao snježne pahuljice, jedinstveni ste i savršeni zajedno.",
    posterUrl:"/events/event6slika.png"
  }
];

// ============================================
// KOMPONENTE
// ============================================

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
  prices: { standard: number; vip: number; premium: number; };
  rating: number;
  message: string;
  posterUrl: string;
  selectedTier?: string;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // ============================================
  // HOME PAGE
  // ============================================
  const HomePage = () => {
    const [filter, setFilter] = useState('all');

    const filteredEvents = filter === 'all'
      ? EVENTS_DB
      : EVENTS_DB.filter(e => e.type === filter);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-pink-600 to-purple-800 p-6 flex flex-col justify-end">
          <div className="absolute top-4 right-4">
            <Heart className="text-pink-300 animate-pulse" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SEA Cinema</h1>
          <p className="text-pink-100 text-sm leading-relaxed">
            Svijet koji dijele Emir i Amila<br/>
            Gdje svaki trenutak postaje uspomena
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 p-4 overflow-x-auto">
          {[
            { key: 'all', label: 'Sve' },
            { key: 'film', label: 'Filmovi' },
            { key: 'predstava', label: 'Predstave' },
            { key: 'event', label: 'Događaji' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat.key
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
<div className="p-4 grid gap-4 pb-24">
  {filteredEvents.map((event: AppEvent) => (
    <div
      key={event.id}
      onClick={() => {
        setSelectedEvent({...event});  // ⭐ Spread to match AppEvent type
        setCurrentPage('details');
      }}
      className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-pink-500/20 transition-all cursor-pointer"
    >

              {/* Poster Placeholder */}
              <div className="relative w-full aspect-video">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover"
               />
              </div>

              {/* Event Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                    {event.genre}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString('bs-BA')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
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

  // ============================================
  // EVENT DETAILS PAGE
  // ============================================
 const EventDetailsPage = () => {
  if (!selectedEvent) return null;

  return (
    <div className="min-h-screen bg-gray-900">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center gap-3">
        <button onClick={() => setCurrentPage('home')} className="text-white">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-white">Detalji</h2>
      </div>

      {/* Wrapper */}
      <div>

        {/* Poster */}
        <div className="relative w-full aspect-video">
          <img src={selectedEvent.posterUrl} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
            <Star className="text-yellow-400" size={20} fill="currentColor" />
            <span className="text-white text-lg font-bold">{selectedEvent.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h1>
            <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full">
              {selectedEvent.genre}
            </span>
          </div>

          {/* Message */}
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Heart className="text-pink-400 mt-1 flex-shrink-0" size={20} />
              <p className="text-pink-200 text-sm italic leading-relaxed">
                {selectedEvent.message}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white font-semibold mb-2">O događaju</h3>
            <p className="text-gray-400">{selectedEvent.description}</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <MapPin className="text-pink-400 mb-2" size={20} />
              <p className="text-gray-400 text-xs mb-1">Lokacija</p>
              <p className="text-white text-sm font-medium">{selectedEvent.location}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <Calendar className="text-pink-400 mb-2" size={20} />
              <p className="text-gray-400 text-xs mb-1">Datum</p>
              <p className="text-white text-sm font-medium">
                {new Date(selectedEvent.date).toLocaleDateString('bs-BA')}
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <Clock className="text-pink-400 mb-2" size={20} />
              <p className="text-gray-400 text-xs mb-1">Vrijeme</p>
              <p className="text-white text-sm font-medium">{selectedEvent.time}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <Star className="text-pink-400 mb-2" size={20} />
              <p className="text-gray-400 text-xs mb-1">Trajanje</p>
              <p className="text-white text-sm font-medium">{selectedEvent.duration}</p>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-white font-semibold mb-3">Odaberi tip karte</h3>
            <div className="space-y-3">
              {[
                { key: 'standard', label: 'Standard', desc: 'Klasično iskustvo' },
                { key: 'vip', label: 'VIP', desc: 'Premium sjedišta' },
                { key: 'premium', label: 'Love Premium', desc: 'Za posebne trenutke ❤️' }
              ].map((tier: {key: string; label: string; desc: string}) => (
                <button
                  key={tier.key}
                  onClick={() => {
                    setSelectedEvent({ ...selectedEvent!, selectedTier: tier.key });
                    setCurrentPage('checkout');
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{tier.label}</p>
                    <p className="text-gray-400 text-sm">{tier.desc}</p>
                  </div>
                  <p className="text-pink-400 text-xl font-bold">
                    {selectedEvent.prices[tier.key]}€
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};


  // ============================================
  // CHECKOUT PAGE
  // ============================================
  const CheckoutPage = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      date: selectedEvent?.date || ''
    });

    const handleSubmit = () => {
      if (formData.name && formData.email && formData.phone && formData.date) {
        setShowPaymentPopup(true);
      }
    };

    const generateTicket = () => {
  const ticket = {
    id: Date.now(),
    eventTitle: selectedEvent!.title,
    userName: formData.name.trim(),   // ⭐ ALWAYS store name
    date: formData.date,
    time: selectedEvent!.time,
    location: selectedEvent!.location,
    seat: `${String.fromCharCode(65 + Math.floor(Math.random() * 10))}${Math.floor(Math.random() * 20) + 1}`,
    ticketNumber: `SEA-${Date.now().toString().slice(-6)}`,
    tier: selectedEvent!.selectedTier || 'standard',     // ⭐ fallback to avoid crash
    price: selectedEvent!.prices[selectedEvent!.selectedTier!] || 0, // ⭐ fallback
    qrCode: `SEA-${Date.now()}`
  };

  setTickets(prev => [...prev, ticket]);
  setCurrentTicket(ticket);
  setShowPaymentPopup(false);
  setCurrentPage('ticket');
};


    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center gap-3">
          <button onClick={() => setCurrentPage('details')} className="text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">Kupovina Karte</h2>
        </div>

        <div className="p-6">
          {/* Event Summary */}
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <h3 className="text-white font-bold mb-2">{selectedEvent!.title}</h3>
            <div className="space-y-1 text-sm text-gray-400">
              <p>{new Date(selectedEvent!.date).toLocaleDateString('bs-BA')} • {selectedEvent!.time}</p>
              <p className="text-pink-400 font-medium capitalize">
                {selectedEvent!.selectedTier} - {selectedEvent!.prices[selectedEvent!.selectedTier!]}€
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Ime i Prezime</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Unesite vaše ime"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="vas@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Broj Telefona</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="+387 6X XXX XXX"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Odabir Termina</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={selectedEvent!.date}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all mt-8"
            >
              Plati {selectedEvent!.prices[selectedEvent!.selectedTier!]}€
            </button>
          </div>
        </div>

        {/* Payment Popup */}
        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-pink-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Zar ste stvarno mislili
                </h3>
                <p className="text-gray-400">
                  da ćete plaćati event? 😄
                </p>
              </div>
              <button
                onClick={generateTicket}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl"
              >
                Preuzmi Kartu
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // TICKET PAGE
  // ============================================
  const TicketPage = () => {
    if (!currentTicket) return null;

    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Vaša Karta</h2>
            <p className="text-gray-400 text-sm">Spremno za nezaboravno iskustvo</p>
          </div>

          {/* Ticket */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-pink-500/20">
            {/* Top Section */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-1">
                {currentTicket.eventTitle}
              </h3>
              <p className="text-pink-100 text-sm">SEA Cinema</p>
            </div>

            {/* QR Code */}
            <div className="p-6 flex justify-center">
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center">
                <QrCode size={160} className="text-gray-800" />
              </div>
            </div>

            {/* Ticket Info */}
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Ime</p>
                  <p className="text-white font-medium">Amila Agincic</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Sjedalo</p>
                  <p className="text-white font-medium">{currentTicket.seat}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Datum</p>
                  <p className="text-white font-medium">
                    {new Date(currentTicket.date).toLocaleDateString('bs-BA')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Vrijeme</p>
                  <p className="text-white font-medium">{currentTicket.time}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs mb-1">Lokacija</p>
                <p className="text-white">{currentTicket.location}</p>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-500 text-xs mb-1">Broj Karte</p>
                <p className="text-pink-400 font-mono font-bold">{currentTicket.ticketNumber}</p>
              </div>
            </div>

            {/* Love Message */}
            <div className="bg-pink-500/10 border-t border-pink-500/20 px-6 py-4">
              <p className="text-pink-200 text-center text-sm italic">
                Za Amilu i Emira — ljubav je ulaznica. ❤️
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full bg-gray-800 text-white font-medium py-3 rounded-xl hover:bg-gray-700 transition-all"
            >
              Nazad na Početnu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MY TICKETS PAGE
  // ============================================
  const MyTicketsPage = () => {
    return (
      <div className="min-h-screen bg-gray-900 pb-24">
        <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
          <h2 className="text-xl font-bold text-white">Moje Karte</h2>
        </div>

        <div className="p-4 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="text-gray-600 mx-auto mb-4" size={64} />
              <p className="text-gray-400">Nemate kupljenih karata</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all"
              >
                Istraži Događaje
              </button>
            </div>
          ) : (
            tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => {
                  setCurrentTicket(ticket);
                  setCurrentPage('ticket');
                }}
                className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-750 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold mb-1">{ticket.eventTitle}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(ticket.date).toLocaleDateString('bs-BA')} • {ticket.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                    {ticket.seat}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{ticket.ticketNumber}</span>
                  <span className="text-pink-400 font-medium capitalize">{ticket.tier}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-around">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Star size={24} />
            <span className="text-xs">Početna</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-pink-500">
            <Ticket size={24} />
            <span className="text-xs">Karte</span>
          </button>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'details' && <EventDetailsPage />}
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'ticket' && <TicketPage />}
      {currentPage === 'tickets' && <MyTicketsPage />}
    </div>
  );
};

export default App;
