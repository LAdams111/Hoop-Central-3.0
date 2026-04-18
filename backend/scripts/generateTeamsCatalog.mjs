/**
 * One-off generator: node scripts/generateTeamsCatalog.mjs > data/teamsCatalog.json
 * (Or run and copy.) Prefer committing data/teamsCatalog.json so deploys need no extra step.
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const season = '2025-26';

const nbaIds = [
  ['Atlanta Hawks', 1610612737],
  ['Boston Celtics', 1610612738],
  ['Brooklyn Nets', 1610612751],
  ['Charlotte Hornets', 1610612766],
  ['Chicago Bulls', 1610612741],
  ['Cleveland Cavaliers', 1610612739],
  ['Dallas Mavericks', 1610612742],
  ['Denver Nuggets', 1610612743],
  ['Detroit Pistons', 1610612765],
  ['Golden State Warriors', 1610612744],
  ['Houston Rockets', 1610612745],
  ['Indiana Pacers', 1610612754],
  ['LA Clippers', 1610612746],
  ['Los Angeles Lakers', 1610612747],
  ['Memphis Grizzlies', 1610612763],
  ['Miami Heat', 1610612748],
  ['Milwaukee Bucks', 1610612749],
  ['Minnesota Timberwolves', 1610612750],
  ['New Orleans Pelicans', 1610612740],
  ['New York Knicks', 1610612752],
  ['Oklahoma City Thunder', 1610612760],
  ['Orlando Magic', 1610612753],
  ['Philadelphia 76ers', 1610612755],
  ['Phoenix Suns', 1610612756],
  ['Portland Trail Blazers', 1610612757],
  ['Sacramento Kings', 1610612758],
  ['San Antonio Spurs', 1610612759],
  ['Toronto Raptors', 1610612761],
  ['Utah Jazz', 1610612762],
  ['Washington Wizards', 1610612764],
];

const NBA = nbaIds.map(([name, id]) => ({
  name,
  season,
  logoUrl: `https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`,
}));

// WNBA — ESPN CDN team codes (500 px)
const wnba = [
  ['Atlanta Dream', 'atl'],
  ['Chicago Sky', 'chi'],
  ['Connecticut Sun', 'con'],
  ['Dallas Wings', 'dal'],
  ['Golden State Valkyries', 'gs'],
  ['Indiana Fever', 'ind'],
  ['Las Vegas Aces', 'lv'],
  ['Los Angeles Sparks', 'la'],
  ['Minnesota Lynx', 'min'],
  ['New York Liberty', 'ny'],
  ['Phoenix Mercury', 'phx'],
  ['Seattle Storm', 'sea'],
  ['Washington Mystics', 'was'],
];

const WNBA = wnba.map(([name, abbr]) => ({
  name,
  season,
  logoUrl: `https://a.espncdn.com/i/teamlogos/wnba/500/${abbr}.png`,
}));

// G League — ESPN d-league logos where available
const gleague = [
  ['Birmingham Squadron', 'birm'],
  ['Capital City Go-Go', 'ccg'],
  ['College Park Skyhawks', 'cps'],
  ['Delaware Blue Coats', 'del'],
  ['Grand Rapids Gold', 'grg'],
  ['Greensboro Swarm', 'grs'],
  ['Iowa Wolves', 'iow'],
  ['Long Island Nets', 'lin'],
  ['Maine Celtics', 'mcc'],
  ['Memphis Hustle', 'mh'],
  ['Motor City Cruise', 'mccr'],
  ['Oklahoma City Blue', 'okc'],
  ['Ontario Clippers', 'ont'],
  ['Osceola Magic', 'osm'],
  ['Raptors 905', 'r9'],
  ['Rip City Remix', 'rcr'],
  ['Salt Lake City Stars', 'slc'],
  ['Santa Cruz Warriors', 'scw'],
  ['Sioux Falls Skyforce', 'sfs'],
  ['South Bay Lakers', 'sbl'],
  ['Stockton Kings', 'stk'],
  ['Texas Legends', 'txl'],
  ['Valley Suns', 'vs'],
  ['Westchester Knicks', 'wkn'],
  ['Windy City Bulls', 'wcb'],
  ['Wisconsin Herd', 'wis'],
  ['Austin Spurs', 'aus'],
  ['Cleveland Charge', 'cle'],
  ['Indiana Mad Ants', 'fw'],
  ['Mexico City Capitanes', 'mxc'],
];

const GLeague = gleague.map(([name, abbr]) => ({
  name,
  season,
  logoUrl: `https://a.espncdn.com/i/teamlogos/d-league/500/${abbr}.png`,
}));

// NCAA D-I — ESPN school IDs (subset of major programs)
const ncaaEspn = [
  ['Duke Blue Devils', 150],
  ['North Carolina Tar Heels', 153],
  ['Kentucky Wildcats', 96],
  ['Kansas Jayhawks', 2305],
  ['Gonzaga Bulldogs', 2250],
  ['UConn Huskies', 41],
  ['Houston Cougars', 248],
  ['Purdue Boilermakers', 2509],
  ['Arizona Wildcats', 12],
  ['Baylor Bears', 239],
  ['Alabama Crimson Tide', 333],
  ['Tennessee Volunteers', 2633],
  ['Creighton Bluejays', 156],
  ['Marquette Golden Eagles', 269],
  ['Michigan State Spartans', 127],
  ['Florida Gators', 57],
  ['Texas Longhorns', 251],
  ['UCLA Bruins', 26],
  ['Villanova Wildcats', 222],
  ['Virginia Cavaliers', 258],
  ['Wisconsin Badgers', 275],
  ['Iowa Hawkeyes', 2294],
  ['Illinois Fighting Illini', 356],
  ['Ohio State Buckeyes', 194],
  ['Miami Hurricanes', 2390],
  ['San Diego State Aztecs', 21],
  ['Florida State Seminoles', 52],
  ['Louisville Cardinals', 97],
  ['Syracuse Orange', 183],
  ['Memphis Tigers', 235],
  ['Xavier Musketeers', 2752],
  ['Saint Mary\'s Gaels', 2608],
  ['San Francisco Dons', 2539],
  ['Colorado Buffaloes', 38],
  ['Texas A&M Aggies', 245],
  ['Arkansas Razorbacks', 8],
  ['Auburn Tigers', 2],
  ['South Carolina Gamecocks', 2579],
  ['BYU Cougars', 252],
  ['Texas Tech Red Raiders', 2641],
  ['Iowa State Cyclones', 66],
  ['Kansas State Wildcats', 2306],
  ['Oklahoma Sooners', 201],
  ['TCU Horned Frogs', 2628],
  ['West Virginia Mountaineers', 277],
  ['Georgetown Hoyas', 46],
  ['Providence Friars', 2507],
  ['Seton Hall Pirates', 2550],
  ['Butler Bulldogs', 2086],
  ['Dayton Flyers', 2168],
  ['Clemson Tigers', 228],
  ['Northwestern Wildcats', 77],
  ['Washington Huskies', 264],
  ['USC Trojans', 30],
  ['Stanford Cardinal', 24],
  ['Oregon Ducks', 2483],
];

const NCAA = ncaaEspn.map(([name, id]) => ({
  name,
  season,
  logoUrl: `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`,
}));

const USports = [
  { name: 'Carleton Ravens', season, logoUrl: null },
  { name: 'UPEI Panthers', season, logoUrl: null },
  { name: 'Dalhousie Tigers', season, logoUrl: null },
  { name: 'UBC Thunderbirds', season, logoUrl: null },
  { name: 'Alberta Golden Bears', season, logoUrl: null },
  { name: 'McGill Redbirds', season, logoUrl: null },
  { name: 'Ottawa Gee-Gees', season, logoUrl: null },
  { name: 'Toronto Varsity Blues', season, logoUrl: null },
  { name: 'Western Mustangs', season, logoUrl: null },
  { name: 'Queen\'s Gaels', season, logoUrl: null },
  { name: 'Laval Rouge et Or', season, logoUrl: null },
  { name: 'Victoria Vikes', season, logoUrl: null },
];

const OTE = [
  { name: 'City Reapers', season, logoUrl: null },
  { name: 'Cold Hearts', season, logoUrl: null },
  { name: 'YNG Dreamerz', season, logoUrl: null },
  { name: 'City Elite', season, logoUrl: null },
  { name: 'RWE', season, logoUrl: null },
];

const HS = [
  { name: 'Montverde Academy (FL)', season, logoUrl: null },
  { name: 'Sierra Canyon (CA)', season, logoUrl: null },
  { name: 'IMG Academy (FL)', season, logoUrl: null },
  { name: 'Oak Hill Academy (VA)', season, logoUrl: null },
  { name: 'La Lumiere (IN)', season, logoUrl: null },
  { name: 'Link Academy (MO)', season, logoUrl: null },
  { name: 'AZ Compass Prep (AZ)', season, logoUrl: null },
  { name: 'Wasatch Academy (UT)', season, logoUrl: null },
  { name: 'Long Island Lutheran (NY)', season, logoUrl: null },
  { name: 'Sunrise Christian (KS)', season, logoUrl: null },
];

const AAU = [
  { name: 'Mac Irvin Fire', season, logoUrl: null },
  { name: 'Team Takeover', season, logoUrl: null },
  { name: 'Bradley Beal Elite', season, logoUrl: null },
  { name: 'Expressions Elite', season, logoUrl: null },
  { name: 'NYC Rens', season, logoUrl: null },
  { name: 'George Hill All Indy', season, logoUrl: null },
  { name: 'CP25', season, logoUrl: null },
  { name: 'Team Thad', season, logoUrl: null },
  { name: 'Southern Stampede', season, logoUrl: null },
  { name: 'Texas Titans', season, logoUrl: null },
];

const EuroLeague = [
  ['Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/3/3f/Real_Madrid_Baloncesto_logo.svg'],
  ['FC Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_logo_%282019%29.svg'],
  ['Olympiacos', 'https://upload.wikimedia.org/wikipedia/en/5/5f/Olympiacos_BC_logo.svg'],
  ['Panathinaikos', 'https://upload.wikimedia.org/wikipedia/en/9/9d/Panathinaikos_BC_logo.svg'],
  ['Maccabi Tel Aviv', 'https://upload.wikimedia.org/wikipedia/en/1/1e/Maccabi_Tel_Aviv_BC_logo.svg'],
  ['Fenerbahçe', "https://upload.wikimedia.org/wikipedia/en/9/9b/Fenerbah%C3%A7e_Men's_Basketball_logo.svg"],
  ['Anadolu Efes', 'https://upload.wikimedia.org/wikipedia/en/6/60/Anadolu_Efes_SK_logo.svg'],
  ['Virtus Bologna', 'https://upload.wikimedia.org/wikipedia/en/6/6b/Virtus_Bologna_logo.svg'],
  ['Olimpia Milano', 'https://upload.wikimedia.org/wikipedia/en/4/49/Pallacanestro_Olimpia_Milano_logo.svg'],
  ['Partizan', 'https://upload.wikimedia.org/wikipedia/en/6/63/KK_Partizan_logo.svg'],
  ['Crvena zvezda', 'https://upload.wikimedia.org/wikipedia/en/4/4f/KK_Crvena_zvezda_logo.svg'],
  ['Bayern Munich', 'https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_Munich_logo_%282017%29.svg'],
  ['ASVEL', 'https://upload.wikimedia.org/wikipedia/en/8/8a/ASVEL_Basket-logo.png'],
  ['Baskonia', 'https://upload.wikimedia.org/wikipedia/en/3/37/Saski_Baskonia_logo.svg'],
  ['Valencia Basket', 'https://upload.wikimedia.org/wikipedia/en/e/e8/Valencia_Basket_logo.svg'],
  ['Žalgiris', 'https://upload.wikimedia.org/wikipedia/en/5/54/BC_Žalgiris_logo.svg'],
  ['ALBA Berlin', 'https://upload.wikimedia.org/wikipedia/en/4/40/Alba_Berlin_logo.svg'],
  ['Paris Basketball', 'https://upload.wikimedia.org/wikipedia/en/2/2e/Paris_Basketball_logo.png'],
];

const EuroLeagueTeams = EuroLeague.map(([name, logoUrl]) => ({ name, season, logoUrl }));

const ACB = [
  ['Real Madrid', 'https://upload.wikimedia.org/wikipedia/en/3/3f/Real_Madrid_Baloncesto_logo.svg'],
  ['FC Barcelona', 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_logo_%282019%29.svg'],
  ['Baskonia', 'https://upload.wikimedia.org/wikipedia/en/3/37/Saski_Baskonia_logo.svg'],
  ['Valencia Basket', 'https://upload.wikimedia.org/wikipedia/en/e/e8/Valencia_Basket_logo.svg'],
  ['Unicaja', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Unicaja_logo.svg'],
  ['Joventut Badalona', 'https://upload.wikimedia.org/wikipedia/en/1/1a/Joventut_Badalona_logo.svg'],
  ['Gran Canaria', 'https://upload.wikimedia.org/wikipedia/en/7/7c/CB_Gran_Canaria_logo.svg'],
  ['Murcia', 'https://upload.wikimedia.org/wikipedia/en/0/0d/UCAM_Murcia_CB_logo.svg'],
  ['Tenerife', 'https://upload.wikimedia.org/wikipedia/en/4/4d/Iberostar_Tenerife_logo.png'],
  ['Manresa', 'https://upload.wikimedia.org/wikipedia/en/2/2f/Bàsquet_Manresa_logo.svg'],
  ['Bilbao Basket', 'https://upload.wikimedia.org/wikipedia/en/3/3d/Bilbao_Basket_logo.svg'],
  ['Zaragoza', 'https://upload.wikimedia.org/wikipedia/en/6/6a/Basket_Zaragoza_logo.svg'],
];

const ACBTeams = ACB.map(([name, logoUrl]) => ({ name, season, logoUrl }));

const NBL = [
  ['Sydney Kings', 'https://upload.wikimedia.org/wikipedia/en/8/8a/Sydney_Kings_logo.svg'],
  ['Melbourne United', 'https://upload.wikimedia.org/wikipedia/en/7/7a/Melbourne_United_logo.svg'],
  ['Perth Wildcats', 'https://upload.wikimedia.org/wikipedia/en/4/4a/Perth_Wildcats_logo.svg'],
  ['Brisbane Bullets', 'https://upload.wikimedia.org/wikipedia/en/1/1f/Brisbane_Bullets_logo.svg'],
  ['Adelaide 36ers', 'https://upload.wikimedia.org/wikipedia/en/6/6a/Adelaide_36ers_logo.svg'],
  ['South East Melbourne Phoenix', 'https://upload.wikimedia.org/wikipedia/en/9/9d/South_East_Melbourne_Phoenix_logo.svg'],
  ['Illawarra Hawks', 'https://upload.wikimedia.org/wikipedia/en/2/2f/Illawarra_Hawks_logo.svg'],
  ['Cairns Taipans', 'https://upload.wikimedia.org/wikipedia/en/5/5a/Cairns_Taipans_logo.svg'],
  ['New Zealand Breakers', 'https://upload.wikimedia.org/wikipedia/en/3/3a/New_Zealand_Breakers_logo.svg'],
  ['Tasmania JackJumpers', 'https://upload.wikimedia.org/wikipedia/en/1/1c/Tasmania_JackJumpers_logo.svg'],
];

const NBLTeams = NBL.map(([name, logoUrl]) => ({ name, season, logoUrl }));

const BAL = [
  { name: 'Petro de Luanda', season, logoUrl: null },
  { name: 'US Monastir', season, logoUrl: null },
  { name: 'Zamalek SC', season, logoUrl: null },
  { name: 'Cape Town Tigers', season, logoUrl: null },
  { name: 'REG', season, logoUrl: null },
  { name: 'Stade Malien', season, logoUrl: null },
  { name: 'Kwara Falcons', season, logoUrl: null },
  { name: 'Ferroviário de Maputo', season, logoUrl: null },
];

const CBA = [
  { name: 'Liaoning Flying Leopards', season, logoUrl: null },
  { name: 'Guangdong Southern Tigers', season, logoUrl: null },
  { name: 'Xinjiang Flying Tigers', season, logoUrl: null },
  { name: 'Zhejiang Golden Bulls', season, logoUrl: null },
  { name: 'Shanghai Sharks', season, logoUrl: null },
  { name: 'Beijing Ducks', season, logoUrl: null },
  { name: 'Shandong Heroes', season, logoUrl: null },
  { name: 'Shenzhen Leopards', season, logoUrl: null },
  { name: 'Jilin Northeast Tigers', season, logoUrl: null },
  { name: 'Nanjing Monkey Kings', season, logoUrl: null },
];

const BLeague = [
  { name: 'Alvark Tokyo', season, logoUrl: null },
  { name: 'Chiba Jets', season, logoUrl: null },
  { name: 'Utsunomiya Brex', season, logoUrl: null },
  { name: 'Ryukyu Golden Kings', season, logoUrl: null },
  { name: 'SeaHorses Mikawa', season, logoUrl: null },
  { name: 'Shimane Susanoo Magic', season, logoUrl: null },
  { name: 'Levanga Hokkaido', season, logoUrl: null },
  { name: 'Osaka Evessa', season, logoUrl: null },
  { name: 'Sunrockers Shibuya', season, logoUrl: null },
  { name: 'Yokohama B-Corsairs', season, logoUrl: null },
];

const out = {
  NBA,
  WNBA,
  'G-League': GLeague,
  NCAA,
  USports,
  OTE,
  HS,
  AAU,
  EuroLeague: EuroLeagueTeams,
  ACB: ACBTeams,
  NBL: NBLTeams,
  BAL,
  CBA,
  BLeague,
};

const path = join(__dirname, '../data/teamsCatalog.json');
writeFileSync(path, JSON.stringify(out, null, 2));
console.log('Wrote', path);
