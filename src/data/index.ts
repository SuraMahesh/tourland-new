import type { Destination, Region, Activity, Hotel, Season, Review, HowItWorks } from '../types';

const U = (id: string, w: number = 1600) => {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
};

export const DESTINATIONS: Destination[] = [
  {
    id: 'sigiriya', name: 'Sigiriya', region: 'Cultural Triangle',
    tag: 'Rock fortress', lat: 7.96, lng: 80.76,
    img: U('1711797750174-c3750dd9d7c9'),
    desc: 'Sigiriya is a 5th-century rock fortress that rises 200 meters from the surrounding plains. This ancient wonder is crowned with the ruins of a royal palace and features intricate frescoes of celestial maidens, a sophisticated mirror wall, and a massive lion gateway. The climb takes about 90 minutes through narrow passages carved into the rock, offering breathtaking views of the Cultural Triangle landscape at sunrise.\n\nBeyond the fortress, Sigiriya symbolizes the pinnacle of Sri Lankan engineering and artistry. The site encompasses vast terraced gardens, reservoirs, and irrigation systems that predate modern engineering by over 1,500 years. Climbers are rewarded not just with panoramic vistas stretching across tea plantations and distant mountains, but with a profound sense of stepping into ancient history.',
    best: 'Jan–Apr · early morning', fee: '$30',
    nearby: ['polonnaruwa', 'dambulla'],
  },
  {
    id: 'ella', name: 'Ella', region: 'Hill Country',
    tag: 'Tea & viaducts', lat: 6.86, lng: 81.05,
    img: U('1571406761758-9a3eed5338ef'),
    desc: 'Ella is a misty hill town cradled in the heart of Sri Lanka\'s tea country, where lush green plantations cascade down emerald hillsides. The town is most famous for the Nine Arches Bridge—a breathtaking colonial-era railway viaduct—and Little Adam\'s Peak, a short hike offering 360-degree views of the surrounding valleys. The cool mountain air, friendly locals, and authentic tea plantations create an enchanting escape from Sri Lanka\'s coastal heat.\n\nStaying in Ella means waking to mist-covered valleys, taking train rides past impossible cliff faces, and wandering through working tea estates where you can meet the women who pick the leaves for your morning cup. The town has evolved into a traveler\'s haven without losing its soul—simple guesthouses dot the hillside, and the local cuisine takes full advantage of fresh mountain vegetables.',
    best: 'Feb–Sep · all day', fee: 'Free',
    nearby: ['nuwaraeliya', 'haputale'],
  },
  {
    id: 'yala', name: 'Yala National Park', region: 'Wildlife',
    tag: 'Leopard country', lat: 6.37, lng: 81.51,
    img: U('1745526180300-443ef46e6a73'),
    desc: 'Yala National Park is one of the world\'s oldest and most bio-diverse wildlife sanctuaries, protecting Sri Lanka\'s most elusive treasure: the Sri Lankan leopard. With the highest concentration of wild leopards anywhere on Earth, Yala offers the most authentic safari experience in Asia. Visitors also encounter sloth bears, Asian elephants, mugger crocodiles, and over 200 bird species in this vast reserve of thorny scrubland and lagoons.\n\nA dawn safari through Yala is a sensory awakening—the sound of trumpeting elephants, the sight of a spotted cat padding across rocky outcrops, and the knowledge that you\'re witnessing one of nature\'s rarest predators in its natural habitat. The park\'s diverse ecosystems, from coastal wetlands to rocky plateaus, ensure that every journey yields different encounters and landscapes.',
    best: 'Feb–Jul · dawn safari', fee: '$45 jeep',
    nearby: ['mirissa', 'udawalawe'],
  },
  {
    id: 'mirissa', name: 'Mirissa', region: 'Coastal Belt · South',
    tag: 'Blue whale coast', lat: 5.95, lng: 80.46,
    img: U('1713516694779-a354da50afec'),
    desc: 'Mirissa is a crescent bay on Sri Lanka\'s southern coast, famous for blue-whale watching during December through March, when these majestic creatures migrate through warm waters. The town perfectly balances adventure and relaxation: mornings on the water seeking the world\'s largest animal, afternoons surfing reef breaks, and sunsets at clifftop bars with the Indian Ocean stretching to the horizon.\n\nThe charm of Mirissa lies in its laid-back atmosphere and diverse offerings—from seasoned surfers chasing perfect waves to marine biologists tracking whale migration patterns. The town\'s restaurants showcase fresh catches of the day, local fishermen still work traditional fishing poles in the shallow waters at sunrise, and the beach remains a gathering place for travelers from every corner of the world.',
    best: 'Dec–Apr · mornings', fee: 'Free',
    nearby: ['galle', 'tangalle'],
  },
  {
    id: 'kandy', name: 'Kandy', region: 'Cultural Triangle',
    tag: 'Sacred city', lat: 7.29, lng: 80.64,
    img: U('1665849050430-5e8c16bacf7e'),
    desc: 'Kandy, the last royal capital of Sri Lanka, is a living temple city where Buddhism remains the pulse of daily life. The Temple of the Tooth—one of Buddhism\'s holiest shrines—houses a relic believed to be Buddha\'s left canine tooth and attracts pilgrims from across the world. Beyond the temple, Kandy offers serene lakeside walks, botanical gardens, traditional Kandyan dance performances, and a vibrant market culture that has remained unchanged for centuries.\n\nThe city serves as the gateway to some of Asia\'s most scenic train journeys, particularly the legendary Kandy-to-Ella route. Kandy\'s position in the central highlands means cool nights, lush surroundings, and a cultural richness that invites slow exploration—wandering through the old town\'s narrow lanes, attending evening prayer ceremonies, and sampling authentic Sri Lankan cuisine in local warungs.',
    best: 'Year-round', fee: '$10',
    nearby: ['ella', 'nuwaraeliya'],
  },
  {
    id: 'galle', name: 'Galle Fort', region: 'Coastal Belt · South',
    tag: 'Colonial walled city', lat: 6.03, lng: 80.21,
    img: U('1744943776860-edee0425bca5'),
    desc: 'Galle Fort is a 17th-century Dutch colonial fortress that stands as one of the best-preserved fortifications in Asia and a UNESCO World Heritage Site. The coral-stone ramparts, built with precision and ingenuity, enclose a perfectly preserved old town where time seems to have paused. Walking the fort\'s walls at sunset, with the Indian Ocean crashing against the ramparts and colonial buildings glowing in golden light, is an experience that connects you directly to centuries of maritime history.\n\nWithin the fort, narrow lanes reveal hidden courtyards, restored colonial mansions that now house boutique hotels and restaurants, art galleries, and shops selling everything from antiques to contemporary crafts. The fort remains a living community, not a museum—residents still occupy the colonial houses, fishermen still repair their nets on the beach, and the atmosphere blends historical preservation with authentic local life.',
    best: 'Nov–Apr · dusk', fee: 'Free',
    nearby: ['mirissa', 'unawatuna'],
  },
  {
    id: 'nuwaraeliya', name: 'Nuwara Eliya', region: 'Hill Country',
    tag: 'Little England', lat: 6.97, lng: 80.78,
    img: U('1747164628765-9394c8496a9c'),
    desc: 'Nuwara Eliya, perched at 1,868 meters above sea level, is Sri Lanka\'s highest city and the heart of the island\'s tea country. Colonial British architecture—Tudor cottages, Victorian hotels, and a golf course established in 1889—creates an atmosphere that visitors swear feels like stepping into an English countryside town transplanted to the tropics. The cool mountain air, fog-shrouded mornings, and surrounding tea plantations painted in infinite shades of green create an otherworldly landscape.\n\nThe town serves as the base for exploring some of Sri Lanka\'s most scenic destinations: Horton Plains National Park, where grassland stretches to cliff edges with 2,000-meter drops, and the trek to World\'s End at sunrise. The tea estates themselves are open to visitors, where you can learn about tea production from leaf to cup, meet tea pickers, and understand why Sri Lankan tea is prized worldwide. Stay in a colonial hotel, take tea on a hillside veranda, and experience the romance of the highlands.',
    best: 'Feb–May', fee: 'Free',
    nearby: ['ella', 'kandy'],
  },
  {
    id: 'trincomalee', name: 'Trincomalee', region: 'Coastal Belt · East',
    tag: 'East-coast bays', lat: 8.58, lng: 81.21,
    img: U('1744156928176-e2488685d619'),
    desc: 'Trincomalee is an eastern-coast treasure that comes alive during the dry season when the monsoon moves elsewhere. The region\'s natural harbor has attracted sailors, traders, and fishermen for millennia, and this maritime heritage remains visible in the bustling harbor, seafaring community, and historic forts. Pigeon Island, just off the coast, offers world-class reef snorkelling where sea turtles, moray eels, and colorful reef fish welcome snorkelers into their underwater world.\n\nNilaveli Beach, stretching for miles of powdery white sand, remains one of Sri Lanka\'s least-visited yet most beautiful stretches of coast. Between May and September, sperm whales migrate through the waters offshore, creating one of Asia\'s premier whale-watching destinations. The calm bays, clear water, and authentic fishing village atmosphere make Trincomalee the perfect choice for travelers seeking authentic coastal Sri Lanka away from the tour-group crowds.',
    best: 'May–Sep', fee: '$10 reef',
    nearby: ['yala', 'kandy'],
  },
];

export const REGIONS: Region[] = [
  { id: 'hill', name: 'Hill Country', blurb: 'Tea, mist, and the great train rides.' },
  { id: 'coast', name: 'Coastal Belt', blurb: 'Surf, whales, and Galle Fort sundowns.' },
  { id: 'triangle', name: 'Cultural Triangle', blurb: 'Ancient capitals, rock fortresses, frescoes.' },
  { id: 'wild', name: 'Wildlife Parks', blurb: 'Yala leopards, Udawalawe elephants, Wilpattu.' },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'safari', name: 'Leopard Safari, Yala', category: 'Wildlife', duration: '½ day', difficulty: 'Easy', price: 'from $85',
    img: U('1745526180300-443ef46e6a73'),
    overview: 'Dawn or dusk jeep safaris through Block 1, with the highest leopard density on Earth.',
    steps: ['Pickup at 4:30am from your hotel', '2–3 hour drive through scrubland', 'Lunch packed by our partner camp', 'Return by midday or sunset'],
  },
  {
    id: 'train', name: 'Kandy → Ella Train', category: 'Adventure', duration: '7 hrs', difficulty: 'Easy', price: '$8 reserved',
    img: U('1571406761758-9a3eed5338ef'),
    overview: 'The world\'s most scenic rail ride. Tea fields, viaducts, and doorways you can sit in.',
    steps: ['Book reserved 1st class 30 days out', 'Board at Kandy 08:47', 'Sit on the right for tea views', 'Disembark Ella 15:30'],
  },
  {
    id: 'perahera', name: 'Esala Perahera, Kandy', category: 'Festivals', duration: 'Evening', difficulty: 'Easy', price: '$15 grandstand',
    img: U('1665849050430-5e8c16bacf7e'),
    overview: 'Sri Lanka\'s grandest cultural procession — 100+ elephants, fire dancers, drummers. July/August only.',
    steps: ['Reserve grandstand seats 2 months ahead', 'Arrive 2 hours early', 'Watch the Randoli Perahera (final night)', 'Stay over in Kandy'],
  },
  {
    id: 'whale', name: 'Blue Whale Watching', category: 'Wildlife', duration: '4 hrs', difficulty: 'Easy', price: 'from $55',
    img: U('1713516694779-a354da50afec'),
    overview: 'Mirissa\'s continental shelf draws the largest animal on Earth between December and April.',
    steps: ['Pre-book a slow, eco-rated boat', 'Depart 6:30am', 'Spot blow plumes 8–11km offshore', 'Back to harbour by 11'],
  },
  {
    id: 'cook', name: 'Village Curry Cookery', category: 'Food', duration: '3 hrs', difficulty: 'Easy', price: '$35',
    img: U('1747164628765-9394c8496a9c'),
    overview: 'Hand-grind spices, make pol sambol, simmer dhal — eat your work with a Ceylon family.',
    steps: ['Market visit at Nuwara Eliya', 'Cook 6 dishes with our host', 'Sit-down lunch on the verandah', 'Take recipes home'],
  },
  {
    id: 'hike', name: 'Adam\'s Peak Pilgrimage', category: 'Adventure', duration: 'Overnight', difficulty: 'Hard', price: 'Guide $40',
    img: U('1711797750174-c3750dd9d7c9'),
    overview: 'Climb 5,500 steps in the dark to a 2,243m summit. Sunrise above the cloud-line. Dec–May.',
    steps: ['Bus to Dalhousie · arrive 9pm', 'Climb starts 2am', 'Summit before 6am sunrise', 'Descend by 9am, sleep all day'],
  },
];

export const HOTELS: Hotel[] = [
  {
    id: 'h1', name: 'Ceylon Tea Trails', city: 'Hatton · Hill Country', price: '$$$$', stars: 5,
    amenities: ['Pool', 'Spa', 'All-inclusive', 'Wi-Fi'],
    img: U('1566073771259-6a8506099945'),
    blurb: 'Five restored 19th-century tea bungalows on a private lake.',
    recommended: true,
  },
  {
    id: 'h2', name: 'Wild Coast Tented Lodge', city: 'Yala · Wildlife', price: '$$$$', stars: 5,
    amenities: ['Pool', 'Game drives', 'Wi-Fi'],
    img: U('1571896349842-33c89424de2d'),
    blurb: 'Cocoon-tents pressed against the jungle line of Yala Block 1.',
    recommended: true,
  },
  {
    id: 'h3', name: 'Amangalla', city: 'Galle Fort · South Coast', price: '$$$$', stars: 5,
    amenities: ['Pool', 'Spa', 'Heritage', 'Wi-Fi'],
    img: U('1582719478250-c89cae4dc85b'),
    blurb: 'Inside Galle\'s 17th-century ramparts. Verandahs, lily ponds, hush.',
    recommended: true,
  },
  {
    id: 'h4', name: '98 Acres Resort', city: 'Ella · Hill Country', price: '$$$', stars: 4,
    amenities: ['Pool', 'Wi-Fi', 'Restaurant'],
    img: U('1520250497591-112f2f40a3f4'),
    blurb: 'Stilted chalets in a working tea estate above Little Adam\'s Peak.',
    recommended: false,
  },
  {
    id: 'h5', name: 'Cape Weligama', city: 'Weligama · South Coast', price: '$$$$', stars: 5,
    amenities: ['Pool', 'Spa', 'Surf', 'Wi-Fi'],
    img: U('1540541338287-41700207dee6'),
    blurb: 'A clifftop village of suites with the Indian Ocean below.',
    recommended: true,
  },
  {
    id: 'h6', name: 'Jetwing Vil Uyana', city: 'Sigiriya · Cultural Triangle', price: '$$$', stars: 5,
    amenities: ['Pool', 'Wi-Fi', 'Bicycles', 'Wildlife'],
    img: U('1582719508461-905c673771fd'),
    blurb: 'Eco-dwellings on a man-made wetland, with Sigiriya rock on the horizon.',
    recommended: false,
  },
];

export const SEASONS: Season[] = [
  { month: 'Jan', region: 'South & West', weather: 'Dry, hot', pick: 'Galle, Mirissa, Yala', festival: 'Duruthu Perahera' },
  { month: 'Feb', region: 'South & West', weather: 'Dry, hot', pick: 'Mirissa whales · peak', festival: 'Independence Day' },
  { month: 'Mar', region: 'South & West', weather: 'Dry, hot', pick: 'Hill Country trekking', festival: 'Maha Sivarathri' },
  { month: 'Apr', region: 'Everywhere', weather: 'Shoulder', pick: 'Tea Country · New Year', festival: 'Sinhala/Tamil New Year' },
  { month: 'May', region: 'East coast', weather: 'SW monsoon', pick: 'East coast opens', festival: 'Vesak' },
  { month: 'Jun', region: 'East coast', weather: 'Dry east', pick: 'Trincomalee, Arugam Bay', festival: 'Poson Poya' },
  { month: 'Jul', region: 'East coast', weather: 'Dry east', pick: 'Surf Arugam · Kandy', festival: 'Esala Perahera' },
  { month: 'Aug', region: 'East coast', weather: 'Dry east', pick: 'Perahera (peak)', festival: 'Esala Perahera' },
  { month: 'Sep', region: 'Cultural Tri.', weather: 'Shoulder', pick: 'Sigiriya, Polonnaruwa', festival: 'Quiet' },
  { month: 'Oct', region: '—', weather: 'Inter-monsoon', pick: 'Off-season pricing', festival: 'Quiet' },
  { month: 'Nov', region: 'South & West', weather: 'Drying', pick: 'South coast reopens', festival: 'Deepavali' },
  { month: 'Dec', region: 'South & West', weather: 'Dry, warm', pick: 'Whales arrive · peak', festival: 'Unduvap Poya' },
];

export const REVIEWS: Review[] = [
  {
    id: 1, name: 'Sofia Mendes', from: 'Lisbon', stars: 5, when: '14 days, Mar 2026',
    text: 'Felt like a private trip designed by a friend who happens to live there. The driver, Pradeep, became part of the holiday — he knew the elephants by name.',
  },
  {
    id: 2, name: 'James Whitaker', from: 'London', stars: 5, when: '10 days, Feb 2026',
    text: 'Sigiriya at sunrise, then a hot-air balloon over Dambulla — TourLand built the trip around a couple of bucket-list ideas and the rest was their suggestions. All bullseyes.',
  },
  {
    id: 3, name: 'Riya Iyer', from: 'Bengaluru', stars: 4, when: '7 days, Dec 2025',
    text: 'The blue-whale boat was the slowest, smallest, best-rated operator and you can tell. We saw four. Hotels were a level above what we\'d booked ourselves on previous trips.',
  },
  {
    id: 4, name: 'Anna & Felix', from: 'Berlin', stars: 5, when: '21 days, Aug 2025',
    text: 'Asked for \'temples, tea, trains, no chains\'. They gave us exactly that. The Kandy → Ella ride is the most beautiful thing we\'ve ever sat through.',
  },
];

export const HOW_IT_WORKS: HowItWorks[] = [
  { n: '01', t: 'Browse', d: 'Eight regions, hundreds of curated experiences. We\'ve travelled every one.' },
  { n: '02', t: 'Plan', d: 'Build your route in four steps. Save drafts, share with your group.' },
  { n: '03', t: 'Customise', d: 'Add airport pickup, private guide, EV-only driver. We confirm in hours.' },
  { n: '04', t: 'Travel', d: '24/7 ground concierge by WhatsApp. One number, every day of your trip.' },
];

export const NAV = [
  ['home', 'Home'],
  ['destinations', 'Destinations'],
  ['seasons', 'Seasons'],
  ['activities', 'Activities'],
  ['planner', 'Plan Tour'],
  ['contact', 'Contact'],
] as const;

export interface CoastData {
  id: string;
  name: string;
  range: string;
  season: boolean[];
  peak: number[];
  spots: string;
  note: string;
  accent: string;
}

export const COAST_DATA: CoastData[] = [
  {
    id: 'sw',
    name: 'South & West',
    range: 'Dec — Apr',
    season: [true, true, true, true, false, false, false, false, false, false, true, true],
    peak: [1, 2],
    spots: 'Galle · Mirissa · Bentota · Tangalle',
    note: 'Calm seas, blue-whale season, surf and Galle Fort sunsets.',
    accent: 'var(--sunset)',
  },
  {
    id: 'east',
    name: 'East Coast',
    range: 'May — Sep',
    season: [false, false, false, false, true, true, true, true, true, false, false, false],
    peak: [6, 7],
    spots: 'Trincomalee · Arugam Bay · Nilaveli · Pasikuda',
    note: 'The monsoon flips. Empty bays, reef snorkelling, world-class point breaks.',
    accent: 'var(--teal)',
  },
  {
    id: 'tri',
    name: 'Cultural Triangle',
    range: 'Year-round, dry Jan–Sep',
    season: [true, true, true, true, true, true, true, true, true, false, false, true],
    peak: [1, 2, 7, 8],
    spots: 'Sigiriya · Kandy · Polonnaruwa · Dambulla',
    note: 'Inland, away from the coasts. Open almost all year — slight October pause.',
    accent: '#c9a14a',
  },
  {
    id: 'hill',
    name: 'Hill Country',
    range: 'Feb — Sep',
    season: [true, true, true, true, true, true, false, false, true, true, true, true],
    peak: [2, 3, 4],
    spots: 'Ella · Nuwara Eliya · Hatton · Haputale',
    note: "Cool mornings, tea-estate hikes, the world's most photogenic train.",
    accent: '#7fae8c',
  },
];
