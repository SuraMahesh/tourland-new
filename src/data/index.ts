import type { Destination, Region, Activity, Hotel, Season, Review, HowItWorks, Vehicle } from '../types';

const U = (id: string, w: number = 1600) => {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;
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
    img: U('1578519050142-afb511e518de'),
    desc: 'Ella is a misty hill town cradled in the heart of Sri Lanka\'s tea country, where lush green plantations cascade down emerald hillsides. The town is most famous for the Nine Arches Bridge—a breathtaking colonial-era railway viaduct—and Little Adam\'s Peak, a short hike offering 360-degree views of the surrounding valleys. The cool mountain air, friendly locals, and authentic tea plantations create an enchanting escape from Sri Lanka\'s coastal heat.\n\nStaying in Ella means waking to mist-covered valleys, taking train rides past impossible cliff faces, and wandering through working tea estates where you can meet the women who pick the leaves for your morning cup. The town has evolved into a traveler\'s haven without losing its soul—simple guesthouses dot the hillside, and the local cuisine takes full advantage of fresh mountain vegetables.',
    best: 'Feb–Sep · all day', fee: 'Free',
    nearby: ['nuwaraeliya', 'haputale'],
  },
  {
    id: 'yala', name: 'Yala National Park', region: 'Wildlife',
    tag: 'Leopard country', lat: 6.37, lng: 81.51,
    img: U('1705936981588-a4192f66fcfb'),
    desc: 'Yala National Park is one of the world\'s oldest and most bio-diverse wildlife sanctuaries, protecting Sri Lanka\'s most elusive treasure: the Sri Lankan leopard. With the highest concentration of wild leopards anywhere on Earth, Yala offers the most authentic safari experience in Asia. Visitors also encounter sloth bears, Asian elephants, mugger crocodiles, and over 200 bird species in this vast reserve of thorny scrubland and lagoons.\n\nA dawn safari through Yala is a sensory awakening—the sound of trumpeting elephants, the sight of a spotted cat padding across rocky outcrops, and the knowledge that you\'re witnessing one of nature\'s rarest predators in its natural habitat. The park\'s diverse ecosystems, from coastal wetlands to rocky plateaus, ensure that every journey yields different encounters and landscapes.',
    best: 'Feb–Jul · dawn safari', fee: '$45 jeep',
    nearby: ['mirissa', 'udawalawe'],
  },
  {
    id: 'mirissa', name: 'Mirissa', region: 'Coastal Belt · South',
    tag: 'Blue whale coast', lat: 5.95, lng: 80.46,
    img: U('1704797390501-37d39f2f6921'),
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
    img: U('1704797390325-b057758d8c3d'),
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
    nearby: ['pasikuda', 'arugambay'],
  },
  {
    id: 'polonnaruwa', name: 'Polonnaruwa', region: 'Cultural Triangle',
    tag: 'Medieval capital', lat: 7.94, lng: 81.00,
    img: U('1566299589192-bdf059d4b0be'),
    desc: 'Polonnaruwa was Sri Lanka\'s medieval capital, and its ruins remain remarkably legible nine centuries later: royal palaces, monastic colleges, image houses, and the sublime Gal Vihara, where four Buddha figures are carved from a single sweep of granite. Unlike many ancient sites, Polonnaruwa is compact and flat — most visitors explore it by bicycle, pedalling between monuments along shaded avenues where toque macaques watch from the trees.\n\nThe city\'s engineering is as impressive as its art. The Parakrama Samudra, a vast twelfth-century reservoir, still irrigates the surrounding rice country, and its bund makes a beautiful sunset walk. Come early, ride the loop slowly, and finish at Rankoth Vehera as the light turns gold on the brickwork.',
    best: 'May–Sep · morning', fee: '$25',
    nearby: ['sigiriya', 'minneriya'],
  },
  {
    id: 'dambulla', name: 'Dambulla', region: 'Cultural Triangle',
    tag: 'Golden cave temples', lat: 7.86, lng: 80.65,
    img: U('1756670164679-83f5fa92d1e1'),
    desc: 'Dambulla\'s cave temple complex is the best-preserved in Sri Lanka — five sanctuaries cut into a granite outcrop, their ceilings and walls covered in over two thousand square metres of painted murals. Inside, more than 150 Buddha statues sit in candlelit rows, some dating back over two millennia. The short climb to the caves rewards you twice: once with the art, and again with a wide view over the plains toward Sigiriya.\n\nThe temple has been a place of continuous worship for twenty-two centuries, and it still functions as one — pilgrims arrive with lotus flowers at dawn, and the smell of incense hangs in the cool cave air. Pair it with Sigiriya for the Cultural Triangle\'s finest single day.',
    best: 'Year-round · early', fee: '$10',
    nearby: ['sigiriya', 'kandy'],
  },
  {
    id: 'anuradhapura', name: 'Anuradhapura', region: 'Cultural Triangle',
    tag: 'Sacred stupas', lat: 8.31, lng: 80.40,
    img: U('1651683576689-4f331989e697'),
    desc: 'Anuradhapura was the island\'s first great capital, a city that flourished for thirteen hundred years and remains one of Buddhism\'s most sacred places. Its skyline is still defined by colossal white and brick stupas — Ruwanwelisaya, Jetavanarama, Abhayagiri — some of which were among the tallest structures of the ancient world. At the heart of it grows the Sri Maha Bodhi, a tree raised from a cutting of the very bodhi under which the Buddha attained enlightenment, tended continuously for over 2,200 years.\n\nThe sacred city rewards unhurried exploration: cycle between the monasteries, watch white-clad pilgrims circle the stupas at dusk, and let the scale of the place sink in. It is living heritage, not a museum.',
    best: 'May–Sep', fee: '$25',
    nearby: ['wilpattu', 'sigiriya'],
  },
  {
    id: 'haputale', name: 'Haputale', region: 'Hill Country',
    tag: 'Lipton\'s Seat views', lat: 6.77, lng: 80.96,
    img: U('1633753826024-2aeb02968a24'),
    desc: 'Haputale sits on a knife-edge ridge at the southern rim of the hill country, and on a clear morning the view runs unbroken from tea terraces at your feet to the southern coastline seventy kilometres away. This is Lipton country — Sir Thomas Lipton built his empire on these slopes, and the viewpoint where he surveyed his estates, Lipton\'s Seat, is reached by a beautiful early-morning walk or tuk-tuk ride through the Dambatenne plantations.\n\nThe town itself is refreshingly untouristed: a working hill-country bazaar strung along the ridge, wrapped in cloud by afternoon. Visit the Dambatenne tea factory, walk the railway line toward Idalgashinna, and be at the Seat before nine, when the mists roll in.',
    best: 'Jan–Mar · clear mornings', fee: 'Free',
    nearby: ['ella', 'hortonplains'],
  },
  {
    id: 'adamspeak', name: 'Adam\'s Peak', region: 'Hill Country',
    tag: 'Pilgrim\'s summit', lat: 6.81, lng: 80.50,
    img: U('1566893298691-bfd8e0e62e10'),
    desc: 'Adam\'s Peak — Sri Pada to Sri Lankans — is the island\'s holy mountain, a 2,243-metre pyramid bearing a footprint-shaped hollow revered by Buddhists, Hindus, Muslims, and Christians alike. The pilgrimage is done at night: 5,500 steps climbed by lamplight in a slow river of pilgrims of every age, tea stalls glowing along the trail, until you reach the summit shrine for the moment everyone came for — sunrise breaking over an ocean of clouds.\n\nAs the sun lifts, the mountain performs its famous trick: a perfect triangular shadow cast onto the mist to the west, seeming to hang in the air. In season the trail hums with devotion; it is less a hike than a shared act of faith you are welcomed into.',
    best: 'Dec–May · night climb', fee: 'Free',
    nearby: ['nuwaraeliya', 'hortonplains'],
  },
  {
    id: 'hortonplains', name: 'Horton Plains', region: 'Hill Country',
    tag: 'World\'s End', lat: 6.80, lng: 80.79,
    img: U('1580635849305-4399d586ac5c'),
    desc: 'Horton Plains is a high, silent plateau above two thousand metres — cloud forest and golden grassland roamed by sambar deer, ending abruptly at World\'s End, where the land simply stops and falls 870 metres to the valley floor. On a clear morning the view stretches across ridge after ridge toward the southern plains; by mid-morning the clouds boil up and shut the window, which is why everyone starts at dawn.\n\nThe nine-kilometre loop trail takes in Baker\'s Falls and Little World\'s End along the way, through a landscape unlike anywhere else on the island — closer to the Scottish Highlands than the tropics, down to the frost on the grass in January.',
    best: 'Jan–Mar · before 9am', fee: '$30',
    nearby: ['nuwaraeliya', 'haputale'],
  },
  {
    id: 'knuckles', name: 'Knuckles Range', region: 'Hill Country',
    tag: 'Cloud-forest treks', lat: 7.45, lng: 80.78,
    img: U('1656495783008-172d887b9530'),
    desc: 'The Knuckles Range — named for its resemblance to a closed fist — is the wildest corner of the hill country, a UNESCO-listed massif of thirty-four peaks, cloud forest, and remote villages where life has changed little in a century. This is Sri Lanka\'s best trekking: paths over grassy ridgelines, through bamboo groves and pygmy forest, past waterfalls and terraced paddies, with barely another traveller in sight.\n\nRoutes run from half-day walks to multi-day traverses with village homestays, and a local guide is both required and genuinely worth it — the weather shifts fast, and the stories are half the experience. Base yourself in Kandy or a village on the range\'s edge and give it at least a full day.',
    best: 'Jan–Sep', fee: '$10',
    nearby: ['kandy', 'sigiriya'],
  },
  {
    id: 'udawalawe', name: 'Udawalawe National Park', region: 'Wildlife',
    tag: 'Elephant herds', lat: 6.44, lng: 80.89,
    img: U('1719807633728-7ff13f7f2b61'),
    desc: 'Udawalawe is the surest place in Asia to see wild elephants — the park\'s open grasslands around its great reservoir hold several hundred, and sightings on a game drive are effectively guaranteed. Herds graze in the open rather than hiding in scrub, so you watch whole family groups: matriarchs shepherding calves, young bulls sparring, elephants bathing in the shallows against a backdrop of distant hill-country peaks.\n\nThe park also shelters crocodiles, water buffalo, and superb birdlife, from painted storks to hovering kestrels. Just outside the gate, the Elephant Transit Home rehabilitates orphaned calves for release — feeding times are open to visitors and worth planning around.',
    best: 'Year-round · dawn', fee: '$30 jeep',
    nearby: ['yala', 'tangalle'],
  },
  {
    id: 'wilpattu', name: 'Wilpattu National Park', region: 'Wildlife',
    tag: 'Leopard lakes', lat: 8.43, lng: 80.00,
    img: U('1627401099591-4772d63b86a4'),
    desc: 'Wilpattu is Sri Lanka\'s largest and oldest national park, a wilderness of dense jungle strung with dozens of "villus" — natural rain-fed lakes that give the park its name and its rhythm. Leopards, sloth bears, and elephants move between the water and the forest, and game drives here feel like genuine exploration: long sandy tracks under a high canopy, opening suddenly onto a lake shore where anything might be drinking.\n\nBecause Wilpattu sees a fraction of Yala\'s traffic, sightings are quieter and wilder — often yours alone. It pairs naturally with Anuradhapura, forty minutes away, making a perfect culture-and-wildlife day in the island\'s northwest.',
    best: 'Feb–Oct', fee: '$40 jeep',
    nearby: ['anuradhapura', 'kalpitiya'],
  },
  {
    id: 'minneriya', name: 'Minneriya National Park', region: 'Wildlife',
    tag: 'The Gathering', lat: 8.03, lng: 80.90,
    img: U('1619183318129-cd95bc882275'),
    desc: 'Each dry season, as water vanishes elsewhere, elephants converge on the receding shores of the ancient Minneriya reservoir — a third-century tank still doing its job seventeen centuries on. At its peak, "The Gathering" brings three hundred or more elephants onto the grassy lakebed at once: the largest regular meeting of Asian elephants in the world, and one of the great wildlife spectacles anywhere.\n\nAfternoon drives are best, when herds stream out of the treeline to graze and bathe in the golden light. Minneriya sits minutes from Sigiriya and Dambulla, so the Gathering slots effortlessly into any Cultural Triangle itinerary — a safari between the citadels.',
    best: 'Jul–Oct · afternoon', fee: '$35 jeep',
    nearby: ['sigiriya', 'polonnaruwa'],
  },
  {
    id: 'sinharaja', name: 'Sinharaja Rainforest', region: 'Wildlife',
    tag: 'UNESCO rainforest', lat: 6.41, lng: 80.45,
    img: U('1703566324597-9aa71bbab450'),
    desc: 'Sinharaja is the island\'s last great stretch of primary lowland rainforest, a UNESCO World Heritage wilderness where more than half the trees, and a remarkable share of the birds, butterflies, and amphibians, exist nowhere else on Earth. Walking its trails is an immersion in green: towering dipterocarps, curtains of liana, the constant chorus of cicadas, and mixed feeding flocks that can hold a dozen endemic bird species in a single tree.\n\nGo with one of the superb local guides — they hear and spot what you never would, from green pit vipers coiled on branches to the blue flash of a Sri Lanka magpie. Mornings are best, leeches are part of the deal, and the forest after rain is unforgettable.',
    best: 'Jan–Apr, Aug–Sep', fee: '$12',
    nearby: ['udawalawe', 'galle'],
  },
  {
    id: 'unawatuna', name: 'Unawatuna', region: 'Coastal Belt · South',
    tag: 'Jungle-backed bay', lat: 6.01, lng: 80.25,
    img: U('1649856092355-eee498b1d0f2'),
    desc: 'Unawatuna is the south coast\'s most famous crescent — a jungle-backed bay of golden sand and calm, swimmable water just ten minutes from Galle Fort. Protected by its reef, the sea here stays gentle most of the year, which made the beach a traveller favourite decades ago and keeps families coming back today. Above the western headland, the Japanese Peace Pagoda offers the classic sunset view along the coast.\n\nBehind the beach, a lively lane of cafés, dive schools, and guesthouses winds toward hidden Jungle Beach and the rock temples of Rumassala. Snorkel the reef in the morning, take lunch barefoot at a beach restaurant, and wander into Galle for the evening ramparts walk.',
    best: 'Nov–Apr', fee: 'Free',
    nearby: ['galle', 'hikkaduwa'],
  },
  {
    id: 'tangalle', name: 'Tangalle', region: 'Coastal Belt · South',
    tag: 'Quiet coves', lat: 6.02, lng: 80.79,
    img: U('1642753037126-8bb09cae6c26'),
    desc: 'Tangalle is where the south coast empties out: kilometre after kilometre of wide, wild beach broken into rocky coves, with barely a beach bar in sight. This is the coast for readers, walkers, and anyone who measures a good day by how few people crossed it. The surf is powerful on the open stretches, while lagoon-sheltered corners like Silent Beach offer calmer water.\n\nThe area rewards slow exploration — Mulkirigala\'s clifftop rock temple half an hour inland, mangrove lagoons alive with kingfishers, and night walks where sea turtles haul out to nest at Rekawa, one of the island\'s most important nesting beaches. Yala and Udawalawe are both within striking distance for a safari day.',
    best: 'Nov–Apr', fee: 'Free',
    nearby: ['mirissa', 'yala'],
  },
  {
    id: 'hikkaduwa', name: 'Hikkaduwa', region: 'Coastal Belt · South',
    tag: 'Reef & surf', lat: 6.14, lng: 80.10,
    img: U('1682368593766-1f788256c116'),
    desc: 'Hikkaduwa was Sri Lanka\'s original beach town, and it still delivers the classic combination: a long golden strip, mellow reef breaks that suit improving surfers, and a coral sanctuary where green turtles graze in water shallow enough to snorkel from the sand. The beach scene runs from morning yoga to candlelit seafood dinners with the waves a few metres away.\n\nThe town sits on the coastal railway, so it is an easy first or last stop between Colombo and Galle. Surf lessons fill the mornings, glass-bottom boats and snorkelling the afternoons, and the evening ritual is simple — a king coconut, a west-facing beach chair, and the sunset.',
    best: 'Nov–Apr', fee: 'Free',
    nearby: ['galle', 'bentota'],
  },
  {
    id: 'bentota', name: 'Bentota', region: 'Coastal Belt · South',
    tag: 'River & beach', lat: 6.42, lng: 79.99,
    img: U('1706257023817-851555857321'),
    desc: 'Bentota occupies a rare piece of geography: a long spit of golden beach with the Indian Ocean on one side and the slow, mangrove-lined Bentota River on the other. The result is two holidays in one — mornings jet-skiing or lazing on a calm, resort-groomed beach, afternoons drifting upriver by boat through mangrove tunnels where water monitors bask and kingfishers dart.\n\nThis stretch is also the island\'s watersports capital and home to some of its most romantic hotels, including several by Geoffrey Bawa, whose garden estate at Lunuganga sits just inland and is open for visits. Turtle hatcheries, the Kande Viharaya temple, and easy transfers from Colombo round it out.',
    best: 'Nov–Apr', fee: 'Free',
    nearby: ['hikkaduwa', 'negombo'],
  },
  {
    id: 'weligama', name: 'Weligama', region: 'Coastal Belt · South',
    tag: 'Learn-to-surf bay', lat: 5.97, lng: 80.43,
    img: U('1453210110568-1384e93a200e'),
    desc: 'Weligama means "sandy village," and its huge, gently shelving bay is the best place in Sri Lanka to learn to surf — soft beach-break waves rolling in all day, water warm enough to live in, and a line of surf schools and board rentals along the sand. Progress comes fast here, and more experienced surfers have reef points at either end of the bay.\n\nBeyond the waves, Weligama keeps its fishing-town soul: outrigger boats land the morning catch, stilt fishermen perch offshore at Koggala nearby, and the taprobane of guidebook legend — a tiny private island with a colonial villa — floats just off the beach. Mirissa\'s whales and Galle Fort are both twenty minutes away.',
    best: 'Nov–Apr', fee: 'Free',
    nearby: ['mirissa', 'galle'],
  },
  {
    id: 'arugambay', name: 'Arugam Bay', region: 'Coastal Belt · East',
    tag: 'Surf point breaks', lat: 6.84, lng: 81.84,
    img: U('1552055568-f8c4fb8c6320'),
    desc: 'Arugam Bay is Sri Lanka\'s surf mecca — a fishing village on the dry southeast coast whose long right-hand point breaks rank among the best in Asia. From May to September, Main Point peels for hundreds of metres on its day, with quieter waves at Whiskey Point and Peanut Farm suiting every level in between. The town itself is a single sandy street of surf camps, juice bars, and restaurants that comes alive after the evening glass-off.\n\nThe wild surroundings are half the appeal: elephants wander the lagoon edges at dusk, Kumana National Park\'s birdlife lies just south, and the crocodile-watched rock temple of Muhudu Maha Viharaya sits right on the beach.',
    best: 'May–Sep', fee: 'Free',
    nearby: ['yala', 'pasikuda'],
  },
  {
    id: 'pasikuda', name: 'Pasikuda', region: 'Coastal Belt · East',
    tag: 'Shallow lagoon bay', lat: 7.92, lng: 81.56,
    img: U('1596967829313-0fe1918d3358'),
    desc: 'Pasikuda\'s claim is simple and true: one of the longest stretches of shallow, flat-calm sea anywhere — a bay where you can wade out hundreds of metres through knee-deep, bath-warm turquoise water over pale sand. Protected by its reef, the bay is essentially waveless in season, making it the east coast\'s best swimming beach and a favourite with families.\n\nThe strip of resorts along the sand stays low-key, and the surrounding coast remains real Sri Lanka — fishing fleets at neighbouring Kalkudah, kola-canopied lanes, and Batticaloa\'s lagoon-side fort half an hour south. Come between May and September when the east is dry, sunny, and glassy.',
    best: 'May–Sep', fee: 'Free',
    nearby: ['trincomalee', 'arugambay'],
  },
  {
    id: 'negombo', name: 'Negombo', region: 'Coastal Belt · West',
    tag: 'Fishing-fleet coast', lat: 7.21, lng: 79.84,
    img: U('1581420456035-58b8efadcdea'),
    desc: 'Negombo is most travellers\' first or last taste of Sri Lanka — ten minutes from the international airport, yet a genuine place in its own right. Its lagoon has fed the town for centuries, and the daily spectacle is the fish market and beach at dawn, when hundreds of oruva outrigger canoes and colourful trawlers land their catch under wheeling seabirds. The long beach faces west, so the sunsets over the fleet are a nightly event.\n\nDutch-era canals thread the town — explored by boat or bicycle — and the skyline belongs to grand Catholic churches that earned Negombo the name "Little Rome." It is the ideal soft landing: one good sunset, one dawn at the market, then onward.',
    best: 'Dec–Apr', fee: 'Free',
    nearby: ['bentota', 'kalpitiya'],
  },
  {
    id: 'kalpitiya', name: 'Kalpitiya', region: 'Coastal Belt · West',
    tag: 'Kitesurf lagoons', lat: 8.23, lng: 79.77,
    img: U('1564499504739-bc4fc2ae8cba'),
    desc: 'Kalpitiya is a ribbon of peninsula between a huge flat lagoon and the open Indian Ocean, and that geography has made it one of Asia\'s premier kitesurfing destinations — steady cross-shore wind from May to October, butter-flat lagoon water for learning and freestyle, and ocean waves a short downwinder away. Kite camps and boutique eco-lodges line the dunes, but the peninsula still feels frontier-quiet.\n\nOff the water, Kalpitiya offers Sri Lanka\'s best dolphin watching — spinner pods hundreds strong on calm mornings — seasonal sperm whale sightings, and boat trips to the Bar Reef sanctuary. Wilpattu\'s leopards are an easy detour east, making a rare surf-and-safari pairing.',
    best: 'May–Oct · kite season', fee: 'Free',
    nearby: ['wilpattu', 'negombo'],
  },
];

export const REGIONS: Region[] = [
  { id: 'hill', name: 'Hill Country', blurb: 'Tea, mist, and the great train rides.' },
  { id: 'coast', name: 'Coastal Belt', blurb: 'Surf, whales, and Galle Fort sundowns.' },
  { id: 'triangle', name: 'Cultural Triangle', blurb: 'Ancient capitals, rock fortresses, frescoes.' },
  { id: 'wild', name: 'Wildlife Parks', blurb: 'Yala leopards, Udawalawe elephants, Wilpattu.' },
];

/** Tour pricing is per vehicle, per day — never per person. */
export const DAILY_KM_ALLOWANCE = 200;

export const VEHICLES: Vehicle[] = [
  {
    id: 'hatchback', name: 'Hatchback', perDay: 80, seats: '1–2 travellers',
    blurb: 'Compact and nimble — ideal for solo travellers and couples with light luggage.',
  },
  {
    id: 'sedan', name: 'Sedan', perDay: 100, seats: '1–3 travellers',
    blurb: 'A/C comfort with a full boot. The classic choice for couples.',
  },
  {
    id: 'suv', name: 'SUV', perDay: 120, seats: '1–4 travellers',
    blurb: 'Extra space and higher clearance for hill-country roads.',
  },
  {
    id: 'kdh', name: 'KDH Van', perDay: 150, seats: '4–8 travellers',
    blurb: 'The Sri Lanka favourite — roomy van for families and small groups.',
  },
  {
    id: 'bus', name: 'Tour Bus', perDay: 250, seats: '9+ travellers',
    blurb: 'Full-size coach for large groups and events.',
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'safari', name: 'Leopard Safari, Yala', category: 'Wildlife', duration: '½ day', difficulty: 'Easy',
    img: U('1705936981588-a4192f66fcfb'),
    overview: 'Dawn or dusk jeep safaris through Block 1, with the highest leopard density on Earth.',
    steps: ['Pickup at 4:30am from your hotel', '2–3 hour drive through scrubland', 'Lunch packed by our partner camp', 'Return by midday or sunset'],
  },
  {
    id: 'train', name: 'Kandy → Ella Train', category: 'Adventure', duration: '7 hrs', difficulty: 'Easy',
    img: U('1578519050142-afb511e518de'),
    overview: 'The world\'s most scenic rail ride. Tea fields, viaducts, and doorways you can sit in.',
    steps: ['Book reserved 1st class 30 days out', 'Board at Kandy 08:47', 'Sit on the right for tea views', 'Disembark Ella 15:30'],
  },
  {
    id: 'perahera', name: 'Esala Perahera, Kandy', category: 'Festivals', duration: 'Evening', difficulty: 'Easy',
    img: U('1665849050430-5e8c16bacf7e'),
    overview: 'Sri Lanka\'s grandest cultural procession — 100+ elephants, fire dancers, drummers. July/August only.',
    steps: ['Reserve grandstand seats 2 months ahead', 'Arrive 2 hours early', 'Watch the Randoli Perahera (final night)', 'Stay over in Kandy'],
  },
  {
    id: 'whale', name: 'Blue Whale Watching', category: 'Wildlife', duration: '4 hrs', difficulty: 'Easy',
    img: U('1704797390501-37d39f2f6921'),
    overview: 'Mirissa\'s continental shelf draws the largest animal on Earth between December and April.',
    steps: ['Pre-book a slow, eco-rated boat', 'Depart 6:30am', 'Spot blow plumes 8–11km offshore', 'Back to harbour by 11'],
  },
  {
    id: 'cook', name: 'Village Curry Cookery', category: 'Food', duration: '3 hrs', difficulty: 'Easy',
    img: U('1747164628765-9394c8496a9c'),
    overview: 'Hand-grind spices, make pol sambol, simmer dhal — eat your work with a Ceylon family.',
    steps: ['Market visit at Nuwara Eliya', 'Cook 6 dishes with our host', 'Sit-down lunch on the verandah', 'Take recipes home'],
  },
  {
    id: 'hike', name: 'Adam\'s Peak Pilgrimage', category: 'Adventure', duration: 'Overnight', difficulty: 'Hard',
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
    text: 'Sigiriya at sunrise, then a hot-air balloon over Dambulla — Modotravels built the trip around a couple of bucket-list ideas and the rest was their suggestions. All bullseyes.',
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
