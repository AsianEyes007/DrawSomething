// ---------- Idea collections ----------
// To add ideas later: just add a new line to any list below.
// Keep each item in double quotes, followed by a comma.

const categories = {
  objects: {
    label: "Objects",
    subjects: [
      "a samurai helmet", "a pocket watch", "a glowing sword", "an antique lantern",
      "a teapot", "a pair of old boots", "a music box", "a compass",
      "a treasure chest", "a sewing machine", "a vintage camera", "a rusty key",
      "a crystal ball", "a typewriter", "a gramophone", "a spyglass",
      "a leather satchel", "a candle in a jar", "a spell book", "an hourglass",
      "a feather quill", "a cracked mirror", "a bronze telescope", "a wooden birdhouse",
      "an old radio", "a paper umbrella", "a ceramic mug", "a ring with a gem",
      "a wind-up toy", "a violin", "a set of dice", "a cuckoo clock",
      "a kite", "a bicycle", "a skateboard", "a pair of headphones",
      "a game controller", "a vintage suitcase", "a watering can", "a pair of round glasses",
      "a snow globe", "a message in a bottle", "a medieval shield", "a battle axe",
      "a bow and quiver", "a katana", "a war drum", "a ceremonial mask",
      "a paper lantern", "a folding fan", "a suit of armour", "a magic wand",
      "a potion bottle", "a bubbling cauldron", "an anchor", "a ship's wheel",
      "a pirate hat", "a treasure map", "a beach umbrella", "a surfboard",
      "a spiral seashell", "a pair of binoculars", "a street lamp", "a mailbox",
      "a cup of ramen", "a stack of old books", "a pair of scissors", "a paintbrush and palette",
      "a lighthouse lens", "a mechanical heart", "a jar of fireflies", "a fishing rod",
      "a camping stove", "a lantern fish in a jar", "a bonsai tree", "a pair of dancing shoes",
      "a pocket knife", "a jar of marbles", "a vintage microphone", "a lighthouse lamp",
      "a spinning top", "a coat rack", "a teddy bear", "a pair of roller skates",
      "a rocking chair", "a grandfather clock", "a diving helmet", "a space helmet",
      "a toolbox", "a hammer and nails", "a candle holder", "a stained glass window",
      "a chess set", "a deck of tarot cards", "a brass bell", "a wind chime",
      "a hot air balloon basket", "a ship in a bottle", "a paper boat", "a paper crane",
      "a rubber duck", "a bar of soap with bubbles", "a cup of coffee", "a stack of pancakes",
      "a bowl of fruit", "a birthday cake", "a picnic basket", "a lunchbox",
      "an old television", "a rotary phone", "a film reel", "a boombox",
      "a cassette tape", "a vinyl record", "a piano keyboard", "an acoustic guitar",
      "a saxophone", "a drum kit", "a pair of ice skates", "a tennis racket",
      "a football", "a baseball glove", "a fishing net", "a crab trap",
      "a driftwood sculpture", "a sandcastle", "a snorkel and mask", "a lifebuoy",
      "a beach ball", "a pair of flip-flops", "a sunhat", "a pair of sunglasses",
      "a bonfire", "a camping tent", "a sleeping bag", "a hiking boot",
      "a backpack", "a map and compass", "a lantern on a hook", "a coil of rope",
      "an ice axe", "a mountain bike", "a motorcycle helmet", "a vintage car",
      "a bicycle basket of flowers", "a vase of sunflowers", "a cactus in a pot", "a terrarium",
      "a bouquet of wildflowers", "a carved pumpkin", "a Christmas ornament", "a snowman",
      "a pair of mittens", "a woollen scarf", "a leather jacket", "a pair of sneakers",
      "a high heel shoe", "a crown", "a jewelled dagger", "a wizard's staff",
      "a dragon egg", "a phoenix feather", "a haunted doll", "a skull with flowers",
      "a robot arm", "a circuit board", "a drone", "a jetpack",
      "a ray gun", "a futuristic helmet", "a holographic keyboard", "a mechanical owl",
      "a clockwork butterfly", "a pair of steampunk goggles", "a pile of brass gears", "a pocket telescope"
    ]
  },
  environments: {
    label: "Environments",
    subjects: [
      "a lighthouse", "a ramen shop", "a rooftop garden", "a floating market",
      "a mountain temple", "a small harbour", "a treehouse village", "a train station",
      "a desert outpost", "a hidden waterfall", "a night market", "a clock tower",
      "a snowy cabin", "a coral reef city", "a bamboo forest", "a cliffside monastery",
      "a floating island", "a lantern-lit bridge", "an abandoned theme park", "a greenhouse",
      "a library with endless shelves", "a mountain pass", "a sunken ship", "a space elevator",
      "a rainy city street", "a village square", "a castle courtyard", "a volcano crater",
      "a salt flat", "a cherry blossom path", "a hot spring", "a fishing village",
      "a circle of standing stones", "a cave of crystals", "a pirate cove", "a windmill on a hill",
      "a Japanese garden", "a street food alley", "a canal city", "a retro arcade",
      "a diner at night", "an observatory", "a subway platform", "a cosy bookshop",
      "a rooftop at sunset", "a mossy ruin", "a frozen lake", "a desert oasis",
      "a jungle temple", "a beach hut", "a tidal pool", "a seaside boardwalk",
      "a sea cave", "a mountain village", "a lakeside dock", "a farmhouse in a field",
      "a floating lantern festival", "a dragon's nest", "a haunted mansion", "a wizard's tower",
      "an underwater cave", "a spaceship corridor", "a cyberpunk alley", "an old lighthouse keeper's cottage",
      "a tea house", "a market in the clouds", "a stone bridge", "a campsite under the stars",
      "a ruined castle", "a crooked town on a hill", "a harbour at dawn", "an overgrown greenhouse",
      "a lighthouse in a storm", "a cliffside village", "a rice terrace", "a lakeside cabin",
      "a quiet beach at dawn", "a rocky coastline", "a seaside cafe", "a fishing pier",
      "a surf shack", "a harbour market", "a lagoon", "a mangrove swamp",
      "a savanna at sunset", "a baobab tree plain", "a coral lagoon", "a tropical waterfall",
      "a rainforest canopy", "a misty mountain valley", "a glacier cave", "an ice palace",
      "a northern lights camp", "a snowy village", "a frozen waterfall", "a pine forest",
      "an autumn path", "a field of lavender", "a sunflower field", "a wheat field",
      "an orchard", "a vineyard", "a farm at dawn", "a barn in the snow",
      "a countryside road", "a covered bridge", "a village well", "a medieval market",
      "a castle on a cliff", "a drawbridge", "a dungeon", "a throne room",
      "an armoury", "a blacksmith's forge", "a tavern at night", "an inn on a hill",
      "a witch's cottage", "a wizard's library", "an alchemist's lab", "a crystal palace",
      "an elven city in the trees", "a dwarven mine", "a goblin market", "a dragon's hoard",
      "a pirate ship deck", "a ghost ship", "an island with one palm tree", "a hidden lagoon",
      "a sunken temple", "a deep-sea research base", "an underwater city", "a kelp forest",
      "a space station window", "a moon base", "a Martian landscape", "an alien jungle",
      "a ringed planet horizon", "an asteroid mining outpost", "a starship bridge", "a cyberpunk street at night",
      "a rooftop with neon signs", "a ramen alley in the rain", "a convenience store at midnight", "a laundromat at night",
      "a bus stop in the rain", "a small train crossing", "an empty classroom", "a school rooftop",
      "a shrine staircase", "a torii gate path", "a koi pond", "a zen rock garden",
      "a bamboo teahouse", "a hot spring in the snow", "a festival street", "a fireworks hillside",
      "a lantern river", "a night train window", "a cosy attic", "a messy artist studio",
      "a kitchen at dawn", "a greenhouse in the rain", "an old workshop", "a garage with a vintage car",
      "a barn dance", "a campfire circle"
    ]
  },
  anime: {
    label: "Anime and manga",
    subjects: [
      "a swordswoman", "a ninja on a rooftop", "a mecha pilot", "a magical girl",
      "a wandering ronin", "a cat spirit", "a student with a mysterious power", "a demon hunter",
      "an idol on stage", "a fox-eared warrior", "a samurai in the rain", "a shrine maiden",
      "a dragon rider", "a school club room", "a street racer", "a witch on a broom",
      "a boy with a giant sword", "a masked vigilante", "an alchemist", "a ghost girl",
      "a sky pirate", "a monster tamer", "a quiet girl with an umbrella", "a pair of rivals",
      "a cyberpunk hacker", "a mask festival", "a girl with a katana", "a demon lord",
      "a gentle giant", "a mage duel", "a chef in a cooking contest", "a detective in a trench coat",
      "a transforming hero", "a ghost-hunting club", "a swordsman and his shadow", "a robot companion",
      "a ninja cat", "a school rooftop at dusk", "a battle at sunset", "a lone traveller on a cliff",
      "a spirit guardian", "a time-travelling student", "a samurai and a dragon", "a magical academy student",
      "a mecha hangar", "a cherry blossom duel", "a gunslinger in a neon city", "a vampire hunter",
      "an exorcist", "a thief with a secret", "a martial arts master", "a young hero with a scarf",
      "a girl and her giant robot", "a kitsune in a shrine", "a pair of friends on a train", "a schoolgirl and a ghost",
      "a pirate crew", "a wolf-eared girl", "a knight and a princess", "a swordsman in a bamboo forest",
      "a magical familiar", "an idol backstage", "a sky island adventurer", "a school festival",
      "a duelist in a ruined city", "a street musician in the rain", "a spirit festival", "a samurai cat",
      "a swordsman on a bridge", "a schoolgirl with a sword", "a magical boy", "a mecha duel",
      "a giant robot in a city", "a pilot and her robot", "a ninja clan", "a shinobi in the snow",
      "a shrine festival couple", "a girl with a red umbrella", "a boy with headphones", "a girl on a rooftop at night",
      "a bike ride at sunset", "a train platform farewell", "a summer fireworks festival", "a cat girl cafe",
      "a maid cafe", "an idol duo", "a band on stage", "a guitar girl",
      "a violinist in the rain", "a chef battle", "a ramen master", "a sports rivals duel",
      "a basketball showdown", "a volleyball team", "a swimmer at dawn", "a track runner",
      "a martial arts tournament", "a dojo at dawn", "a demon slayer in a bamboo forest", "an oni mask warrior",
      "a kitsune mask girl", "a tengu in the mountains", "a yokai parade", "a ghost bride",
      "a spirit fox shrine", "a dragon girl", "a dragon prince", "a knight and a dragon",
      "a mage with a spellbook", "a wizard school", "an elf archer", "a half-demon swordsman",
      "a sorceress queen", "a dark knight", "a holy paladin", "a fallen angel",
      "a guardian angel", "a vampire prince", "a werewolf pack", "a witch and her cat",
      "a forest spirit", "a sky whale", "a flying castle", "an airship crew",
      "a steampunk inventor", "a clockwork girl", "a cyborg samurai", "a space cowboy",
      "a bounty hunter in space", "a hacker in a neon room", "a virtual world player", "a gamer girl",
      "a detective duo", "a masked thief", "a phantom thief", "a secret agent",
      "a time loop student", "a transfer student", "a class president", "a quiet library girl",
      "a rooftop lunch", "a festival yukata", "a cherry blossom confession", "a rainy day umbrella share",
      "a sunset on the beach", "a stargazing night", "a winter school walk", "a snow spirit",
      "a lantern festival", "a swordsman and a fox", "a samurai duel at dusk", "a tea ceremony",
      "a calligraphy master", "a magical pet", "a mascot character", "a chibi squad",
      "a hero transformation", "a villain monologue", "a final boss", "a training arc",
      "a rival's return", "an opening scene on a hill"
    ]
  },
  characters: {
    label: "Characters",
    subjects: [
      "an old wizard", "a retired robot", "a lighthouse keeper", "a space pirate",
      "a village baker", "a fox spirit", "a tired knight", "a clockmaker",
      "a deep-sea diver", "a travelling merchant", "a forest witch", "a dragon tamer",
      "a blind swordsman", "a street musician", "a lost astronaut", "an elderly fisherman",
      "a mischievous goblin", "a mermaid", "a pirate captain", "a mountain hermit",
      "a royal guard", "a plague doctor", "a tea shop owner", "a bounty hunter",
      "a sky sailor", "a young alchemist", "a ghost butler", "a giant and a mouse",
      "a gardener of strange plants", "a circus performer", "a time traveller", "a retired superhero",
      "a talking cat", "a snow queen", "a desert nomad", "a travelling bard",
      "an orc blacksmith", "a librarian", "a beekeeper", "a cyborg detective",
      "a vampire chef", "a shy dragon", "a masked dancer", "a lonely scarecrow",
      "a ship's cook", "an owl wizard", "a tiny knight", "a storm caller",
      "a lantern maker", "a swamp witch", "a lighthouse ghost", "a young inventor",
      "a mountain guide", "a fortune teller", "a space botanist", "a knight with a broken sword",
      "a crow who collects keys", "a ferryman", "a candle seller", "a robot gardener",
      "a pirate parrot", "a hooded stranger", "a retired sea captain", "a sleepy giant",
      "a child with a paper crown", "a fisherman and his cat", "a toymaker", "a stargazer",
      "a lone wolf", "a friendly ghost", "a baker of magic bread", "a sailor in a storm",
      "a mountain king", "a fisherwoman", "a lighthouse witch", "a river spirit",
      "a cat burglar", "a street artist", "a travelling circus clown", "a stagecoach driver",
      "a cowboy at dusk", "a samurai farmer", "a samurai potter", "a female knight",
      "a squire", "a jester", "a queen in exile", "a young prince",
      "an old king", "a court wizard", "a runaway princess", "a bandit leader",
      "a monk on a mountain", "a priestess", "a shaman", "a druid",
      "a ranger", "a thief in the rain", "an assassin", "a gladiator",
      "a pirate quartermaster", "a mermaid queen", "a sea captain's daughter", "a siren",
      "a kraken tamer", "a lost child with a lantern", "an orphan inventor", "a girl with a pet dragon",
      "a boy and his robot", "a space explorer", "an alien diplomat", "a robot barista",
      "a robot tailor", "a robot musician", "a cyborg monk", "a hacker",
      "a mech mechanic", "a smuggler", "a sky courier", "a train conductor",
      "a lighthouse mechanic", "a mad scientist", "a plague bird", "a necromancer",
      "a lich", "a ghost child", "a haunted painter", "a ghost pianist",
      "a cursed knight", "a vampire butler", "a werewolf baker", "a skeleton musician",
      "a zombie gardener", "a friendly monster", "a dragon librarian", "a goblin merchant",
      "a troll bridge keeper", "a dwarf miner", "a halfling cook", "a giant gardener",
      "a fairy mechanic", "a phoenix keeper", "a unicorn rider", "a wolf pack leader",
      "a bear in a coat", "a fox in a waistcoat", "a rabbit detective", "an owl professor",
      "a raccoon thief", "a frog prince", "a duck captain", "a crow scholar",
      "a cat barista", "a dog sheriff", "an old woman with a lantern", "a granny wizard",
      "a little girl with a giant umbrella", "a boy in a paper crown", "a baker's apprentice", "a chimney sweep",
      "a flower seller", "a violinist on a rooftop", "a ballet dancer", "a street dancer",
      "a samurai drummer", "a painter at an easel", "a sculptor", "a tattoo artist",
      "a barber", "a night-shift nurse", "a lighthouse cat"
    ]
  }
};

// For each mood: "settings" and "details" build detailed ideas,
// "feels" are short phrases for simple ideas (Draw a compass, calm and gentle.)
const moodData = {
  peaceful: {
    settings: [
      "on a quiet mountain", "beside a calm lake", "in a sunny meadow",
      "in a cosy cabin", "on a slow summer afternoon", "in a sleepy village",
      "beside a gentle stream", "in a field of flowers", "on a quiet beach",
      "under a big old tree", "in a garden after rain", "on a still morning",
      "on a hillside at golden hour", "in a quiet fishing village", "beside a slow river",
      "in a sleepy seaside town", "on a porch in the afternoon", "in a windless snowy forest",
      "in a small greenhouse", "by an old stone well", "on a wooden dock at dawn",
      "in a hammock between two trees", "in a library on a rainy day", "in a cottage garden"
    ],
    details: [
      "bathed in soft morning light", "with gentle falling petals", "surrounded by sleeping animals",
      "under a warm sunset", "with a light breeze moving everything", "with warm lamplight in the windows",
      "with soft clouds drifting by", "with butterflies nearby", "with a cup of tea steaming",
      "in pastel colours", "with long golden shadows", "with a calm, slow feeling",
      "with a gentle breeze in the grass", "with a sleeping cat nearby", "with soft rain on the window",
      "with smoke curling from a chimney", "with a warm cup of tea", "with drifting dandelion seeds",
      "in warm pastel colours", "with sunlight through the leaves", "with a quiet, slow feeling",
      "with laundry swaying on a line", "with fireflies starting to appear", "with a flock of birds crossing the sky"
    ],
    feels: [
      "calm and gentle", "soft and quiet", "warm and relaxed",
      "slow and sleepy", "gentle and dreamy", "cosy and still",
      "light and airy", "sunny and carefree"
    ]
  },
  dark: {
    settings: [
      "in a ruined cathedral", "in a foggy graveyard", "deep in a cursed forest",
      "in a collapsed mine", "in a flooded crypt", "on a stormy cliff",
      "in an abandoned asylum", "in a burned-out village", "on a moonless night",
      "in a cellar with no light", "along a lonely, dead road", "in a swamp at midnight",
      "in a rain-soaked alley at night", "in a burnt-out chapel", "in a dead orchard",
      "in a forgotten crypt", "on a fog-covered moor", "in a cave with dripping water",
      "in a derelict hospital", "at the edge of a black lake", "in a ruined fortress",
      "in a storm-battered lighthouse", "in a field of scarecrows", "in a haunted theatre"
    ],
    details: [
      "lit by a single flickering candle", "covered in cracks and shadows", "watched by glowing eyes",
      "wrapped in creeping thorns", "with long, twisted shadows", "with a cold mist rolling in",
      "with crows circling overhead", "with a faint red glow in the distance", "with chains hanging from above",
      "half swallowed by darkness", "with something moving behind it", "in deep, heavy contrast",
      "with a cold blue moon overhead", "with torn banners hanging", "with rats in the shadows",
      "with deep red lighting", "with broken stained glass", "with a figure standing in the distance",
      "with thick black smoke", "with barbed vines", "with a lantern about to go out",
      "with whispering shadows", "with rusted bars and chains", "with a single beam of light"
    ],
    feels: [
      "dark and moody", "gloomy and ominous", "cold and brooding",
      "eerie and shadowy", "heavy and grim", "haunting and bleak",
      "menacing and tense", "stormy and sinister"
    ]
  },
  mysterious: {
    settings: [
      "inside an abandoned train station", "in a hidden library", "at the end of a foggy pier",
      "in a room with no doors", "in a house with one lit window", "in a maze of tall hedges",
      "below an old observatory", "in a shop that only opens at night", "at a crossroads in the fog",
      "inside a locked greenhouse", "in a forgotten museum", "at the bottom of a spiral staircase",
      "in a lighthouse with no keeper", "in a station that appears on no map", "on a staircase that leads nowhere",
      "in a locked garden", "in a train carriage stopped in the fog", "in a house where all the clocks stopped",
      "in a market that vanishes at dawn", "on an island that appears at low tide", "in a hall of mirrors",
      "in a cellar beneath a bakery", "on a bridge in thick fog", "in an attic full of covered furniture"
    ],
    details: [
      "with a locked door that hums", "with strange symbols on the walls", "half hidden in mist",
      "with a note nobody can read", "with footprints that stop suddenly", "with a clock that runs backwards",
      "with a single glowing keyhole", "with a shadow that doesn't match", "with a door slightly open",
      "with a hooded figure watching", "with floating pages in the air", "with a map missing its centre",
      "with a lantern floating by itself", "with a letter sealed in wax", "with a door in the wrong place",
      "with a shadow cast by nothing", "with a trail of glowing footprints", "with a locked box that rattles",
      "with a single red umbrella", "with a melody coming from nowhere", "with a staircase that spirals up forever",
      "with an unreadable sign", "with a hand-drawn map", "with a candle that never burns down"
    ],
    feels: [
      "strange and secretive", "hazy and enigmatic", "curious and uncanny",
      "hidden and cryptic", "foggy and uncertain", "puzzling and dreamlike",
      "quiet and unexplained", "shadowed and intriguing"
    ]
  },
  futuristic: {
    settings: [
      "in a neon-lit alley", "on a floating city platform", "inside a space station",
      "in a rain-soaked cyber market", "on a rooftop above a glowing city", "in an orbital greenhouse",
      "on a maglev train", "in a robot repair shop", "at a spaceport at night",
      "in a city built into a mega-tower", "on a sky bridge between towers", "in a hologram arcade",
      "on an orbital ring at night", "in a floating night market", "in a rain-lit megacity",
      "in a repair bay full of robots", "inside a hover-train station", "in a neon ramen bar",
      "on a skybridge above the clouds", "in a domed garden city", "at a dock for flying ships",
      "in a quiet android cafe", "in an abandoned data centre", "on a rooftop with antenna forests"
    ],
    details: [
      "glowing with holographic light", "with robotic parts showing", "reflected in wet neon streets",
      "surrounded by drifting drones", "with glowing wires and cables", "with giant ads flickering overhead",
      "with a soft blue glow", "with visible circuitry", "with steam rising from vents",
      "in sharp neon pink and cyan", "with floating interface screens", "with a quiet, lonely feeling",
      "with holographic signs flickering", "with glowing cables on the floor", "with steam and neon reflections",
      "with tiny drones buzzing", "with a transparent display glowing", "with chrome and glass everywhere",
      "with a purple and teal glow", "with a lone figure in a long coat", "with rain streaking the light",
      "with floating lanterns of light", "with a huge planet filling the sky", "with a faint hum of machines"
    ],
    feels: [
      "sleek and neon", "high-tech and glowing", "cold and metallic",
      "cyber and chrome", "bright and digital", "robotic and polished",
      "electric and bold", "space-age and clean"
    ]
  },
  fantasy: {
    settings: [
      "floating above the clouds", "inside a giant tree", "at the edge of a dragon's nest",
      "in a crystal cave", "in a castle made of ice", "in a floating garden",
      "in a forest of glowing mushrooms", "on a bridge between two mountains", "in a village of tiny houses",
      "at the foot of an ancient tower", "inside a giant shell", "on the back of a sleeping giant",
      "in a village built on a giant lily pad", "in a floating library", "on the back of a giant turtle",
      "in a castle of clouds", "in a hollow tree house", "in a valley of giant flowers",
      "in a city carved into a cliff", "in a lantern-lit forest clearing", "at the bottom of a magic well",
      "on a bridge made of light", "in a market for magical creatures", "in a tower that touches the stars"
    ],
    details: [
      "covered in glowing runes", "with tiny fairies circling", "wrapped in ancient magic",
      "with a faint golden aura", "with enchanted lanterns floating nearby", "with a sleeping dragon in the background",
      "with strange glowing plants", "with swirling magical dust", "with a moon that is much too big",
      "with ancient carved stone", "with a hidden door in the roots", "with a spell half cast",
      "with a dragon curled around it", "with glowing butterflies", "with ancient runes in the stone",
      "with a staff humming with power", "with tiny lanterns drifting up", "with a rainbow-coloured sky",
      "with enchanted vines creeping", "with a golden aura around it", "with a sleeping giant in the distance",
      "with floating islands in the sky", "with a hidden door in the wall", "with an old map glowing on the table"
    ],
    feels: [
      "magical and glowing", "epic and storybook", "whimsical and enchanted",
      "ancient and mythical", "heroic and legendary", "wondrous and golden",
      "mystical and grand", "sparkling and enchanted"
    ]
  }
};
