import { Product } from '../classes/product.js';

export const products = [
  // --- GITARRER ---
  new Product(
      1, 
      "Fender Player Strat MN", 
      8990, 
      "guitars", 
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop", 
      "Klassisk stratocaster med modern spelkänsla, al-kropp och kristallklart ljud som passar allt från funk till rock."
  ),
  new Product(
      2, 
      "Gibson Les Paul Standard", 
      28990, 
      "guitars", 
      "https://images.unsplash.com/photo-1550985543-f4423c9d7481?q=80&w=800&auto=format&fit=crop", 
      "Den ikoniska rockgitarren med mahognykropp, lönntopp och en oslagbar sustain som definierat generationer."
  ),
  new Product(
      3, 
      "Ibanez RG550", 
      9490, 
      "guitars", 
      "https://images.unsplash.com/photo-1605020420620-20c943cc4669?q=80&w=800&auto=format&fit=crop", 
      "En shred-maskin av rang! Supertunn hals, Edge-svaj och pickups som levererar hög output för metal och fusion."
  ),
  new Product(
      4, 
      "Martin D-28 Acoustic", 
      34900, 
      "guitars", 
      "https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?q=80&w=800&auto=format&fit=crop", 
      "Legendaren inom akustiska gitarrer. Massiv sitkagran och ostindisk jakaranda ger ett varmt och kraftfullt ljud."
  ),

  // --- PIANO ---
  new Product(
      5, 
      "Roland FP-30X", 
      7990, 
      "pianos", 
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop", 
      "Vårt mest sålda digitalpiano. Kompakt design, SuperNATURAL-ljudmotor och fantastisk klaviaturkänsla."
  ),
  new Product(
      6, 
      "Nord Stage 3", 
      38900, 
      "pianos", 
      "https://images.unsplash.com/photo-1621617637734-772922119136?q=80&w=800&auto=format&fit=crop", 
      "Det ultimata instrumentet för scenmusiker. Orgel, piano och synth i världsklass samlat i ett rött kraftpaket."
  ),
  new Product(
      7, 
      "Yamaha P-125", 
      7490, 
      "pianos", 
      "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop", 
      "Kompakt och stilrent digitalpiano med Yamahas autentiska Pure CF-ljudmotor. Perfekt för hemmabruk."
  ),

  // --- TRUMMOR ---
  new Product(
      8, 
      "Yamaha Stage Custom", 
      13590, 
      "drums", 
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop", 
      "Ett komplett trumset i 100% björk. Känd för sitt tydliga, punchiga sound som funkar lika bra live som i studion."
  ),
  new Product(
      9, 
      "Roland TD-17KVX", 
      18900, 
      "drums", 
      "https://images.unsplash.com/photo-1571327073757-71d13c24de30?q=80&w=800&auto=format&fit=crop", 
      "V-Drums när de är som bäst. Mesh-skinn för naturlig känsla och Bluetooth för att spela med i dina favoritlåtar."
  ),
  new Product(
      10, 
      "Zildjian K Custom Dark", 
      4590, 
      "drums", 
      "https://images.unsplash.com/photo-1574516709328-9844d4f40f29?q=80&w=800&auto=format&fit=crop", 
      "En mörk och komplex crash-cymbal som svarar snabbt. Perfekt för jazz, funk och studioinspelning."
  ),

  // --- STUDIO ---
  new Product(
      11, 
      "Shure SM7B", 
      4290, 
      "studio", 
      "https://images.unsplash.com/photo-1524678606372-987d11df920b?q=80&w=800&auto=format&fit=crop", 
      "Den legendariska sång- och podcastmikrofonen. Ger ett varmt, professionellt radio-sound direkt ur lådan."
  ),
  new Product(
      12, 
      "Focusrite Scarlett 2i2", 
      1990, 
      "studio", 
      "https://images.unsplash.com/photo-1598653222004-65517be42d54?q=80&w=800&auto=format&fit=crop", 
      "Världens mest sålda ljudkort. Två ingångar med kristallklara preamps. Allt du behöver för att börja spela in."
  ),
  new Product(
      13, 
      "KRK Rokit 5 G4", 
      1790, 
      "studio", 
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=800&auto=format&fit=crop", 
      "Professionell studiomonitor med inbyggd DSP och grafisk EQ. Ger dig ärlig lyssning för dina mixar."
  ),

  // --- TILLBEHÖR ---
  new Product(
      14, 
      "Ernie Ball Regular Slinky", 
      89, 
      "accessories", 
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=800&auto=format&fit=crop", 
      "Världens mest populära elgitarrsträngar. Balanserad ton och hållbarhet som älskas av proffs över hela världen."
  ),
  new Product(
      15, 
      "Marshall Major IV", 
      1490, 
      "accessories", 
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", 
      "Trådlösa hörlurar med ikonisk Marshall-design, 80+ timmars batteritid och trådlös laddning."
  ),
  new Product(
      16, 
      "Boss TU-3 Tuner", 
      990, 
      "accessories", 
      "https://images.unsplash.com/photo-1620138546344-7b2c38516edf?q=80&w=800&auto=format&fit=crop", 
      "Industristandarden för stämpedaler. Oförstörbar konstruktion och exakt stämning även på mörka scener."
  ),

  // --- NYHETER ---
  new Product(
      17, 
      "Teenage Engineering OP-1", 
      13990, 
      "news", 
      "https://images.unsplash.com/photo-1626848777033-68e37a287a17?q=80&w=800&auto=format&fit=crop", 
      "Den heta portabla synten och workstationen som alla pratar om. Skapa musik var du än är med oändliga möjligheter."
  ),
  new Product(
      18, 
      "Fender Tone Master Pro", 
      18490, 
      "news", 
      "https://images.unsplash.com/photo-1563351984-75466b0c2a29?q=80&w=800&auto=format&fit=crop", 
      "Fenders senaste flaggskepp inom digital förstärkarmodellering. Tusentals klassiska ljud i en enda enhet."
  )
];