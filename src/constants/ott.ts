import { OTTService, Operator } from '../types';

// OTT Services with their respective operators
export const OTT_SERVICES: OTTService[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    operators: ['airtel', 'jio'],
    icon: 'netflix.png'
  },
  {
    id: 'amazon_prime',
    name: 'Amazon Prime',
    operators: ['airtel', 'jio'],
    icon: 'amazon_prime.png'
  },
  {
    id: 'hotstar',
    name: 'JioHotstar',
    operators: ['airtel', 'jio'],
    icon: 'jiohotstar.png'
  },
  {
    id: 'airtel_xtreme',
    name: 'Airtel Xstream Play Premium',
    operators: ['airtel'],
    icon: 'airtel_xtreme.png'
  },
  {
    id: 'zee5',
    name: 'Zee5',
    operators: ['airtel', 'jio'],
    icon: 'zee5.png'
  },
  {
    id: 'jio_tv',
    name: 'JioTV',
    operators: ['jio'],
    icon: 'jiotv.png'
  },
  {
    id: 'jio_cloud',
    name: 'JioCloud',
    operators: ['jio'],
    icon: 'jioaicloud.png'
  },
  {
    id: 'jio_saavn',
    name: 'JioSaavn Pro',
    operators: ['jio'],
    icon: 'jio_saavn.png'
  },
  {
    id: 'sony_liv',
    name: 'Sony LIV',
    operators: ['jio'],
    icon: 'sony_liv.png'
  },
  {
    id: 'lionsgate_play',
    name: 'Lionsgate Play',
    operators: ['jio'],
    icon: 'lionsgate_play.png'
  },
  {
    id: 'discovery_plus',
    name: 'Discovery+',
    operators: ['jio'],
    icon: 'discovery.png'
  },
  {
    id: 'sun_nxt',
    name: 'Sun NXT',
    operators: ['jio'],
    icon: 'sun_nxt.png'
  },
  {
    id: 'kanccha_lannka',
    name: 'Kanccha Lannka',
    operators: ['jio'],
    icon: 'kanchha_lannka.png'
  },
  {
    id: 'planet_marathi',
    name: 'Planet Marathi',
    operators: ['jio'],
    icon: 'planet_marathi.png'
  },
  {
    id: 'chaupal',
    name: 'Chaupal',
    operators: ['jio'],
    icon: 'chaupal.png'
  },
  {
    id: 'hoichoi',
    name: 'Hoichoi',
    operators: ['jio'],
    icon: 'hoichoi.png'
  },
  {
    id: 'fancode',
    name: 'FanCode',
    operators: ['jio'],
    icon: 'fancode.png'
  },
  {
    id: 'youtube_premium',
    name: 'YouTube Premium',
    operators: ['jio'],
  },
  {
    id: 'etv_win',
    name: 'ETV Win',
    operators: ['jio'],
  },
  {
    id: 'times_play',
    name: 'Times Play',
    operators: ['jio'],
  },
  {
    id: 'tarang_plus',
    name: 'Tarang Plus',
    operators: ['jio'],
  },
  // VI OTT services are loaded dynamically from the plans database
];

// Get OTT services available for a specific operator
export const getOTTServicesForOperator = (operator: Operator): OTTService[] => {
  return OTT_SERVICES.filter(service => service.operators.includes(operator));
};
