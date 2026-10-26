// Contact details and links used across the site. Change them here only.
export const WHATSAPP_NUMBER = '918862059910'
export const WHATSAPP_DISPLAY = '+91 88620 59910'
export const PHONE = '+917709682109'
export const PHONE_DISPLAY = '+91 77096 82109'
export const ADDRESS_LINE = 'Opp. Seaview Hotel, Malvan Terminal Parking Road'
export const ADDRESS_CITY = 'Malvan, Sindhudurg, Maharashtra 416606'
export const MAPS_URL =
  'https://www.google.com/maps/place/Laxmi+Beach+Homestay+and+Restaurant/@16.0545129,73.4658403,17z'
export const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1510.2784968925332!2d73.46584028515635!3d16.054512856198357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3beaa9ed7923253f%3A0x3e39478199b3ac59!2sLaxmi%20Beach%20Homestay%20and%20Restaurant!5e1!3m2!1sen!2sin!4v1780148865867!5m2!1sen!2sin'
export const GOOGLE_REVIEWS =
  'https://www.google.com/travel/search?q=laxmi%20beach%20homestay%20malvan&ap=MAC6AQdyZXZpZXdz&ictx=111'
export const TOUR_HOMESTAY = 'https://gothru.co/PSTNvrZa3?index=scene_1'
export const TOUR_SCUBA = 'https://gothru.co/PSTNvrZa3?index=scene_3'
export const CHECK_IN = '11:30 AM'
export const CHECK_OUT = '10:00 AM'
export const RATING = '4.5'

export const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const img = (name, small = false) => `/images/${name}${small ? '-sm' : ''}.webp`

/** Small and medium versions, so the browser picks the size the layout needs. */
export const srcset = (name) => `/images/${name}-xs.webp 420w, /images/${name}-sm.webp 760w`

export const NAV = [
  { href: '#rooms', label: 'Rooms' },
  { href: '#water-sports', label: 'Water Sports' },
  { href: '#food', label: 'Food' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#explore', label: 'Explore Malvan' },
  { href: '#book', label: 'Contact' },
]

export const REVIEWS = [
  { name: 'Rohan Jadhav', ago: '3 months ago', text: 'The rooms were very clean, neat, and comfortable. The view of Sindhudurg Fort from the room was absolutely amazing. Staff service and overall arrangements were excellent. Perfect place for peace, beauty, and relaxation.' },
  { name: 'Yogeshwari Adsul', ago: '6 months ago', text: 'Great location, beautiful surrounding of Malvan Beach. Most friendly and helpful receptionist and staff ever. Hotel was clean, food was good and great value for money. Room had beach view from window and balcony.' },
  { name: 'Nirbhay Rawool', ago: 'a year ago', text: 'Best option for clean rooms next to the beach with sea view. Free WiFi available with Netflix. Staff so friendly that you won’t face any problem. Water sports are also available just ahead of the hotel.' },
  { name: 'Yash', ago: 'a month ago', text: 'We had a memorable stay! The ocean views were breathtaking, and the staff were so accommodating. The room was comfortable with all amenities needed. Perfect for a peaceful coastal experience.' },
  { name: 'Santosh Rathod', ago: 'a month ago', text: 'I was pleasantly surprised by the spacious, clean rooms. The sea view was a highlight of our stay. It felt like a slice of paradise — we can’t wait to come back.' },
  { name: 'Perry Almeida', ago: 'a month ago', text: 'The ambiance here is so relaxing. We enjoyed our evenings on the balcony, sipping tea and listening to the waves. The room was clean and cozy — a wonderful retreat after a day of exploring Malvan.' },
  { name: 'SK Tours & Travels', ago: 'a month ago', text: 'Staff is very good, service is excellent and the view from the hotel is amazing. Entire sea visible right in front. Space for parking the car. Rooms very clean and neat. Owner is very cooperative.' },
  { name: 'Soham Kambli', ago: 'a month ago', text: 'I absolutely loved the beachfront location. Waking up to the sound of waves was magical. Staff were incredibly helpful and made our stay comfortable. Budget-friendly — perfect for our group trip.' },
]

export const CERTS = [
  { src: img('padi-logo', true), name: 'PADI certified instructors' },
  { src: img('cert4'), name: 'MMB Maharashtra approved' },
]
