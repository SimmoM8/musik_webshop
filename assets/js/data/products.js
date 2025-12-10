import { Product } from '../classes/product.js';

export const products = [
  // Gitarrer
  new Product(
      1, 
      "Fender Player Strat MN", 
      8990, 
      "guitars", 
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop", 
      "Klassisk strat med modern spelkänsla och kristallklart ljud."
  ),
  // NY BILD HÄR (Lite mörkare, cool Les Paul-stil):
new Product(
      2, 
      "Gibson Les Paul Standard", 
      28990, 
      "guitars", 
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=800&auto=format&fit=crop", 
      "Den ikoniska rockgitarren med fylligt sound och oslagbar sustain."
  ),
  new Product(
      3, 
      "Ibanez RG550", 
      9490, 
      "guitars", 
      "https://images.unsplash.com/photo-1605020420620-20c943cc4669?q=80&w=800&auto=format&fit=crop", 
      "Perfekt för snabbt spel, metal och teknisk briljans."
  ),

  // Piano
  new Product(
      4, 
      "Roland FP-30X", 
      10990, 
      "pianos", 
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop", 
      "Portabelt digitalpiano med kraftigt speakersystem och Bluetooth."
  ),
  new Product(
      5, 
      "Yamaha P-125", 
      7490, 
      "pianos", 
      "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop", 
      "Kompakt piano med autentisk känsla, perfekt för hemmastudion."
  ),

  // Trummor
  new Product(
      6, 
      "Yamaha Stage Custom", 
      13590, 
      "drums", 
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop", 
      "Proffskit i björk med punchigt sound för scen och studio."
  ),
  new Product(
      7, 
      "Roland TD-17KVX", 18900, "drums", 
      "https://images.unsplash.com/photo-1571327073757-71d13c24de30?q=80&w=800&auto=format&fit=crop", 
      "Elektroniskt trumset med naturlig respons och mesh-skinn."
  )
];