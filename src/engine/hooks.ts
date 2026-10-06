/**
 * Character hooks.
 *
 * A small recursive grammar: rules are arrays of strings, and a string may
 * reference another rule with `#symbol#`. Species and background vocabularies
 * are merged in under reserved `sp_*` / `bg_*` keys, so a hook inherits the
 * texture of whatever the user selected without needing a bespoke template
 * per combination.
 *
 * Hooks are suggestive, not prescriptive: they hand the player a situation and
 * leave the personality open.
 */

import type { BackgroundSpec, HookVocabulary, SpeciesSpec } from '../types/index.ts';
import { Rng } from './rng.ts';

export type Grammar = Record<string, readonly string[]>;

const SYMBOL = /#([a-z0-9_]+)(?:\.([a-z]+))*#/gi;
const TOKEN = /#([a-z0-9_]+)((?:\.[a-z]+)*)#/gi;

function applyModifier(value: string, modifier: string): string {
  switch (modifier) {
    case 'cap':
      return value.charAt(0).toUpperCase() + value.slice(1);
    case 'a':
      return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
    case 'lower':
      return value.toLowerCase();
    default:
      return value;
  }
}

/**
 * Expand `symbol` against `grammar`. `used` prevents the same literal phrase
 * appearing twice in one hook, which is the most common way a template grammar
 * produces nonsense.
 */
export function expand(
  rng: Rng,
  grammar: Grammar,
  symbol: string,
  used: Set<string> = new Set(),
  depth = 0,
): string {
  if (depth > 12) return '';
  const rules = grammar[symbol];
  if (!rules || rules.length === 0) return '';

  // Prefer a phrase not already used in this hook.
  const fresh = rules.filter((r) => !used.has(r));
  const pool = fresh.length > 0 ? fresh : rules;
  const chosen = pool[rng.int(pool.length)] as string;
  used.add(chosen);

  TOKEN.lastIndex = 0;
  return chosen.replace(TOKEN, (_match, key: string, mods: string) => {
    let value = expand(rng, grammar, key, used, depth + 1);
    if (!value) return '';
    for (const modifier of mods.split('.').filter(Boolean)) {
      value = applyModifier(value, modifier);
    }
    return value;
  });
}

// ---------------------------------------------------------------------------
// Base grammar
// ---------------------------------------------------------------------------

/**
 * Fallbacks for the injected keys, used when the user left species or
 * background unspecified. Keeping them here means a hook never has an empty
 * slot and never says "undefined".
 */
const FALLBACK: Grammar = {
  bg_place: ['a town they have stopped naming', 'a house that has changed hands twice', 'a crossroads market',
    'a river port', 'a border village', 'a garrison that was stood down', 'a trade road'],
  bg_object: ['a package they were asked not to open', 'a key with no label', 'a ledger in someone else’s hand',
    'a map with a correction in fresh ink', 'a letter of introduction to a stranger', 'a coin that is not currency'],
  bg_person: ['someone who stopped writing', 'a creditor with excellent manners',
    'a sibling who chose differently', 'a stranger who knew their name'],
  bg_deed: ['settled a dispute nobody else would touch', 'carried something a long way for free',
    'told the truth at a bad moment', 'walked away from an easy arrangement'],
  bg_trouble: ['the arrangement they relied on has collapsed', 'the person who vouched for them has died',
    'the money ran out two towns ago', 'the question they asked has started to follow them'],
  bg_habit: ['counts the exits', 'pays for things in advance', 'writes down what people promise'],
  sp_place: ['a place they describe differently every time', 'somewhere they have not been in years'],
  sp_thing: ['an inheritance they have not opened', 'a token from before'],
  sp_trait: ['is extremely good at one useless thing', 'answers questions slightly too precisely'],
};

const BASE: Grammar = {
  // --- top level -----------------------------------------------------------
  hook: [
    '#role_phrase.cap# who #quirk#.',
    '#role_phrase.cap# who #quirk#, and #second_clause#.',
    '#past_opener.cap#, #present_turn#.',
    'Carries #object#, and #object_reason#.',
    'Keeps #object#. #object_reason.cap#.',
    'Left #bg_place# after #departure#, and #aftermath#.',
    'Looking for #quarry# — #complication#.',
    'Looking for #quarry#, though #complication#.',
    'Is quietly trying to find #quarry#.',
    '#role_phrase.cap#. #secret.cap#.',
    'Owes #bg_person# #debt#, and #debt_attitude#.',
    'Has been travelling with #companion# since #when#.',
    'Was #bg_deed#, which is not how the story gets told.',
    'Collects #collection#, and will not say what for.',
    'Will not return to #bg_place#, and gives #excuse# when asked.',
    'Carries #letter#, addressed to #recipient#.',
    'Can #skill#, which keeps being the wrong skill for the situation.',
    'Took #work# on the understanding that #understanding#, and #understanding_turn#.',
    '#role_phrase.cap# who #quirk# — #complication#.',
    'Everyone at #bg_place# assumed #assumption#; #correction#.',
    'Is being paid by #patron# to #errand#, and has not asked why.',
    'Has one #object_plain# left from #bg_place#, and #keepsake_reason#.',
    'Spent #duration# at #bg_place#. #residue.cap#.',
    'Says they are #cover_story#. #cover_truth.cap#.',
    'Has #skill_noun#, #skill_origin#.',
    'Promised #bg_person# #promise#, and the deadline has passed.',
    'Walked out of #bg_place# with #object#, and nobody has come looking yet.',
    '#past_opener.cap#, and now #sp_trait#.',
    'Arrived with #arrival#, and intends to leave with #departure_goal#.',
    'Keeps a list of #list_subject#. It is longer than it was.',
    'Was told #told#, and has structured the last several years around it.',
    'Can be hired for #price#, though #price_caveat#.',
    'Is the only person who knows #knowledge#, and #knowledge_turn#.',
    'Lost #loss# somewhere between #bg_place# and here.',
    'Has been mistaken for #mistaken# twice, and found it useful both times.',
    'Turned down #offer#, and thinks about it more than they should.',
    'Is carrying out #errand# on behalf of someone who #patron_state#.',
    '#role_phrase.cap#, retired, allegedly.',
    'Signed #document#, and has been reading it again ever since.',
    'Remembers #memory# with suspicious clarity.',
    'Carries #object_plain.a# that #object_behaviour#.',
    'Is looking for somewhere to put down #burden#.',
    'Does #service# for free, and charges a great deal for #other_service#.',
    'Will tell you about #bg_place# at length and about #evasion# not at all.',
    'Has a standing invitation to #invitation#, and has never accepted it.',
    'Finishes other people’s #finishes#, usually uninvited.',
  ],

  // --- role ----------------------------------------------------------------
  role_phrase: [
    '#article# #role_adj# #role#', '#article# #role#', '#article# former #role#',
    '#article# #role_adj# #role#', '#article# #role# of some standing',
    '#article# #role# between positions', '#article# retired #role#',
    '#article# #role# with #role_detail#',
  ],
  article: ['a'],
  role_adj: ['travelling', 'itinerant', 'unlicensed', 'semi-retired', 'reluctant', 'much-recommended',
    'briefly famous', 'locally notorious', 'scrupulous', 'disorganised', 'overqualified', 'self-taught',
    'unusually patient', 'habitually early', 'formerly bonded', 'off-season'],
  role: ['cartographer', 'archivist', 'surveyor', 'courier', 'translator', 'auditor', 'appraiser', 'tutor',
    'physician', 'engineer', 'notary', 'horse-trader', 'glassblower', 'bookbinder', 'navigator', 'herbalist',
    'cook', 'quartermaster', 'interpreter', 'bell-founder', 'locksmith', 'ferryman', 'veterinarian',
    'cartwright', 'stonecutter', 'fence-mender', 'tax collector', 'census-taker', 'lamplighter',
    'well-digger', 'rope-maker', 'tide-reader', 'bridge inspector', 'inventory clerk', 'coroner’s assistant',
    'beekeeper', 'sign-painter', 'debt collector', 'piano tuner', 'orchard warden', 'bookkeeper',
    'dowser', 'wet-nurse turned bodyguard', 'funeral singer', 'draughtsman'],
  role_detail: ['excellent references and no fixed address', 'one unresolved complaint against them',
    'a specialism nobody asks for', 'a letter of commendation they did not earn',
    'three languages and no small talk', 'an unusual tolerance for boredom'],

  // --- quirks and habits ---------------------------------------------------
  quirk: [
    'quietly #alters# every #work_product# they #produce#',
    'keeps a second set of #records# that disagree with the first',
    'has never once been where they said they would be',
    'refuses to work on #refusal#, and will not explain',
    'remembers every #remembered# they have ever #encountered#',
    'asks for payment in #payment# rather than coin',
    'is unwilling to be thanked in public',
    'makes a note of #noted# and consults it later',
    'leaves #leaves_behind# wherever they stay',
    'will not begin anything until #precondition#',
    'tells the same story three different ways depending on who is listening',
    'apologises in advance for things that have not happened',
    'has an opinion about #opinion_subject# that nobody has asked for',
    'cannot sleep unless #sleep_condition#',
    'treats #treats_seriously# as a matter of professional honour',
    'has not used their real #real_thing# since #since_when#',
    'always knows what time it is, to the minute, and refuses to say how',
    'sends #sends# to someone who has never replied',
    'eats exactly the same meal in every town',
    'is building #building#, slowly, and in secret',
    '#sp_trait#',
    '#bg_habit#',
  ],
  alters: ['edits', 'corrects', 'omits a detail from', 'improves', 'softens', 'annotates', 'redates', 'signs'],
  work_product: ['map', 'ledger', 'letter', 'invoice', 'report', 'contract', 'manifest', 'inventory', 'receipt'],
  produce: ['sells', 'files', 'hands over', 'copies', 'certifies', 'delivers'],
  records: ['accounts', 'notes', 'charts', 'measurements', 'minutes', 'correspondence'],
  refusal: ['the first day of a month', 'anything that has already been started',
    'commissions from people who will not meet in person', 'the far bank of a particular river',
    'work that has to be finished by a specific date'],
  remembered: ['face', 'door', 'debt', 'song', 'route', 'signature', 'handshake', 'coastline'],
  encountered: ['seen', 'owed', 'been shown', 'been sung', 'walked', 'witnessed'],
  payment: ['favours', 'letters of introduction', 'passage', 'information', 'a meal and a bed',
    'books', 'salt', 'safe conduct', 'an hour of someone’s time'],
  noted: ['who speaks first in a room', 'what everyone orders', 'which doors are kept locked',
    'what people say they do for a living', 'the exact wording of promises'],
  leaves_behind: ['the room tidier than they found it', 'a small coin under the pillow',
    'a note of thanks nobody reads', 'a chalk mark by the door', 'the bill already settled'],
  precondition: ['they have walked the ground themselves', 'someone else has gone first',
    'the terms are in writing', 'they have had a proper breakfast', 'the weather turns'],
  opinion_subject: ['bridges', 'how a letter should be folded', 'the correct way to ford a river',
    'inn mattresses', 'other people’s handwriting', 'the pricing of lamp oil', 'rope'],
  sleep_condition: ['the door is wedged', 'someone else is awake', 'they can hear running water',
    'their boots are within reach'],
  treats_seriously: ['punctuality', 'the correct spelling of a name', 'settling a tab before leaving',
    'returning borrowed tools', 'remembering what people take in their tea'],
  real_thing: ['name', 'signature', 'accent', 'handwriting', 'profession'],
  since_when: ['a specific winter', 'the matter at #bg_place#', 'the day they left home',
    'an afternoon they decline to date'],
  sends: ['a letter every quarter', 'money every month', 'a single line of verse each year',
    'a parcel at midwinter'],
  building: ['a model of a city they have never visited', 'a dictionary of a dying dialect',
    'a complete list of everyone who has ever helped them', 'an instrument nobody has heard played'],

  // --- past and present ----------------------------------------------------
  past_opener: [
    'once employed by #employer#', 'raised at #bg_place#', 'apprenticed to #bg_person#',
    'trained for #training# and never used it', 'present when #witnessed_event#',
    'paid off after #paid_off#', 'the last person to leave #bg_place#',
    'named in #named_in#', 'written out of #written_out#',
    'sent away from #bg_place# for #sent_reason#', 'having spent #duration# at #bg_place#',
  ],
  employer: ['a noble household', 'a shipping concern', 'a provincial court', 'a guild that has since dissolved',
    'a mining company', 'a temple treasury', 'a surveying office', 'a family firm', 'a mercenary company',
    'a university', 'a river authority', 'a quarantine office'],
  training: ['a profession that no longer exists', 'a war that was called off',
    'a ceremony that was cancelled', 'an expedition that never sailed', 'a post that was abolished'],
  witnessed_event: ['the ledgers were burned', 'the treaty was signed', 'the bridge came down',
    'the verdict was read', 'the last shipment arrived', 'the gate was closed for the season'],
  paid_off: ['a reorganisation', 'an inquiry', 'a quiet scandal', 'a change of ownership', 'a bad harvest'],
  named_in: ['a will they had not expected', 'a report they were not shown', 'a song they find embarrassing',
    'a contract as a guarantor'],
  written_out: ['a family record', 'the official account', 'a guild register', 'a map of their own making'],
  sent_reason: ['their own safety', 'an argument they still think they won', 'reasons given only in writing',
    'a mistake that was not theirs'],
  present_turn: [
    'they now #present_activity#', 'they are now #present_state#', 'they have taken up #present_activity#',
    'they currently #present_activity#', 'they travel with #companion# and #present_activity#',
  ],
  present_activity: ['carry #letter# addressed to #recipient#', 'work for whoever asks first',
    'keep to small towns', 'take only short contracts', 'avoid anywhere with a harbour',
    'audit things nobody asked them to audit', 'teach, badly, and for very little',
    'look after #companion#', 'collect debts owed to the dead', 'walk a circuit of the same six towns'],
  present_state: ['between obligations', 'owed money by three separate parties', 'travelling light and quickly',
    'trying to be unremarkable', 'without papers', 'better funded than they look',
    'under a name they chose themselves'],
  second_clause: ['will not discuss #evasion#', 'is unexpectedly good company',
    'keeps turning up where they are needed', 'has never been caught at it',
    'assumes everyone already knows'],
  aftermath: ['has not written since', 'has not stopped moving', 'has never corrected the version people tell',
    'has been waiting for a letter that has not come', 'intends to go back once #condition#'],
  condition: ['a particular person has died', 'the debt is cleared', 'the season turns',
    'someone apologises', 'they can afford to'],

  // --- objects -------------------------------------------------------------
  object: ['#article# #object_adj# #object_plain#', '#bg_object#', '#sp_thing#', '#article# #object_plain#'],
  object_adj: ['sealed', 'half-finished', 'water-damaged', 'unsigned', 'mislabelled', 'borrowed', 'inherited',
    'confiscated', 'duplicate', 'annotated', 'very old', 'conspicuously new'],
  object_plain: ['ledger', 'chart', 'letter', 'key', 'ring', 'instrument', 'casebook', 'contract', 'receipt',
    'portrait', 'set of tools', 'bottle', 'lamp', 'bundle of correspondence', 'bill of sale', 'carved token',
    'logbook', 'strongbox', 'deed', 'petition', 'vial', 'compass'],
  object_reason: ['they have never opened it', 'it was not theirs to take',
    'returning it would mean going back', 'nobody has asked for it in years',
    'it is worth less than the trouble of keeping it', 'it is the only proof of something that happened',
    'they intend to hand it over in person', 'they have been told it is a forgery and do not believe it'],
  object_behaviour: ['does not behave as its maker intended', 'was last inventoried a century ago',
    'has another name scratched out on the base', 'is slightly too heavy for its size',
    'came with instructions in the wrong language'],
  letter: ['a letter', 'a sealed letter', 'a bundle of letters', 'an unsent reply', 'a letter of introduction',
    'a letter marked "do not open before"'],
  recipient: ['someone who died a century ago', 'a house that has been demolished',
    'a name that appears in no register', 'an address that is now underwater',
    'a person who has changed their name twice', 'the writer’s own younger self',
    'an office that was abolished', 'whoever currently holds a particular post'],
  keepsake_reason: ['will not explain what it is', 'has refused three offers for it',
    'does not know what it unlocks', 'intends to put it back'],
  loss: ['a name', 'a travelling companion', 'a year', 'their licence', 'the only copy',
    'a case of instruments', 'the thread of an argument'],

  // --- errands and complications ------------------------------------------
  quarry: ['someone who does not want to be found', 'a book that was never catalogued',
    'the other half of #object_plain.a#', 'a witness', 'a map of a coastline that has changed',
    'whoever signed #document#', 'the person who taught #bg_person# their trade',
    'a town that appears on one map and no others'],
  complication: ['they are not certain they want to succeed', 'the trail has been deliberately warmed',
    'somebody else is looking too, and politely', 'the last three leads were planted',
    'they have been given the wrong name on purpose', 'finding it would settle a question they prefer open',
    'the funding has stopped and they have not noticed', '#bg_trouble#'],
  errand: ['deliver #object#', 'verify #verification#', 'escort #companion#', 'close an account',
    'retrieve something from #bg_place#', 'make a very specific apology', 'sit in on a hearing',
    'count something that is not supposed to be counted'],
  verification: ['a boundary', 'a death', 'a signature', 'an inventory', 'a claim of descent',
    'the date on a document'],
  patron: ['a solicitor acting for an estate', 'a guild with an internal problem', 'a widow with excellent records',
    'a temple that prefers not to be named', 'a shipping clerk with unexplained authority',
    'a university committee', 'someone who pays in advance and in full'],
  patron_state: ['will not meet them', 'has died since the contract was signed',
    'communicates only by letter', 'may not exist', 'has changed the terms twice'],
  offer: ['a partnership', 'a pardon', 'a permanent post', 'a share of something enormous',
    'the chance to go home', 'an apology they had waited years for'],
  work: ['a contract', 'a commission', 'a passage', 'a post', 'an apprenticeship', 'a retainer'],
  understanding: ['it was a single season’s work', 'nobody would ask questions',
    'the previous holder had left voluntarily', 'the route was already surveyed',
    'they would be home by midwinter'],
  understanding_turn: ['none of that was true', 'two of those things were true',
    'it has been three years', 'it is going surprisingly well'],
  price: ['board and a day’s notice', 'passage to anywhere coastal', 'the return of a specific item',
    'an introduction to someone specific', 'a sum they name differently each time'],
  price_caveat: ['they will refuse outright if they dislike the client',
    'the figure has not changed in a decade', 'they always underquote and never renegotiate',
    'payment is due only on success'],

  // --- knowledge, secrets, memory -----------------------------------------
  secret: ['nobody has yet asked the one question that would unravel this',
    'they have been in this town before, under another arrangement',
    'the references are real; the name is not',
    'they are the reason #bg_trouble#',
    'the person they are travelling to meet already knows they are coming',
    'they have already done the job and are deciding whether to say so',
    'half of what they know, they learned by reading someone else’s post'],
  knowledge: ['where the second copy is', 'what was actually agreed', 'who paid for it',
    'the real date', 'which of the two brothers survived', 'the route through',
    'what the inventory omitted'],
  knowledge_turn: ['is in no hurry to say', 'has written it down in three places',
    'would rather be asked properly', 'has told exactly one person, by accident'],
  told: ['they would be sent for', 'the matter was closed', 'it was not their concern',
    'someone would explain later', 'the position would be held for them'],
  memory: ['a conversation they were not part of', 'a room they were in once',
    'the exact wording of a refusal', 'a face from a crowd', 'a price list from thirty years ago'],
  assumption: ['they were someone’s relation', 'they could not read',
    'they were only passing through', 'they had been sent officially',
    'they would not stay the winter'],
  correction: ['two of those were wrong', 'they let it stand', 'it was simpler than correcting them',
    'they have stopped correcting people'],
  evasion: ['the years in between', 'how they came by #object_plain#', 'the matter at #bg_place#',
    'who taught them', 'why they left'],
  cover_story: ['#article# #role#', 'on their way to #bg_place#', 'here for the season',
    'nobody in particular', 'expected elsewhere'],
  cover_truth: ['this is almost entirely true', 'this was true last year',
    'only the destination is a lie', 'nobody has checked', 'the papers support it'],

  // --- people and company --------------------------------------------------
  companion: ['a mule with strong opinions', 'an apprentice who asks too many questions',
    'a dog that belonged to someone else', 'a child who is not theirs',
    'a colleague who speaks only in the morning', 'a ledger-clerk with no field experience',
    'an elderly relative who insisted', 'someone they are not supposed to be seen with',
    'a bird that follows the cart'],
  when: ['the thaw', 'an incident at #bg_place#', 'the day the contract lapsed', 'a funeral',
    'last winter', 'an arrangement that suited both of them'],
  creditor: ['a bank with a long memory', 'a family', 'a temple', 'a guild', 'someone they like'],
  debt: ['a sum', 'a favour', 'an explanation', 'three seasons’ wages', 'an apology'],
  debt_attitude: ['is in no hurry to settle it', 'has settled it twice already by their reckoning',
    'intends to pay it in person', 'is waiting to be asked'],
  promise: ['to come back', 'to find out what happened', 'to say nothing', 'to deliver it personally',
    'to stop'],

  // --- miscellany -----------------------------------------------------------
  collection: ['keys to doors they have never seen', 'recipes written by strangers',
    'bad maps of good places', 'the last page of unfinished books', 'hand-written apologies',
    'receipts from establishments that no longer exist', 'buttons', 'river stones from each crossing',
    'the names of everyone who has ever lied to them'],
  list_subject: ['people who owe them nothing', 'things they have been wrong about',
    'towns with a decent bridge', 'words that do not translate', 'promises still outstanding',
    'the dead they did not know personally'],
  excuse: ['a different reason each time', 'a reason that is technically accurate',
    'the same six words', 'a long answer about the roads'],
  skill: ['read a ledger faster than its author', 'tell a forged seal by touch',
    'sleep standing up', 'estimate a crowd to within ten', 'pick a lock and relock it behind them',
    'navigate by sound', 'copy any hand after seeing it twice', 'calm a panicking animal',
    'find water anywhere', 'speak a language that has no living speakers'],
  skill_noun: ['an unusual tolerance for cold', 'a memory for faces that unsettles people',
    'a reading knowledge of three dead scripts', 'a steady hand', 'an ear for a lie',
    'a head for figures', 'perfect pitch'],
  skill_origin: ['acquired for a reason they do not discuss', 'inherited, apparently',
    'developed during a very long wait', 'the only thing they kept from a previous life',
    'taught by someone who is now a problem'],
  arrival: ['one bag and a letter of credit', 'nothing they will admit to', 'more money than makes sense',
    'a companion and no explanation', 'a wound that has healed badly'],
  departure_goal: ['the same bag and a clear conscience', 'somebody else’s name cleared',
    'an answer', 'considerably less than they came with', 'company'],
  burden: ['an obligation they inherited', 'somebody else’s secret', 'a title they never wanted',
    'a grudge that has outlived its subject', 'a child’s guardianship'],
  document: ['articles they had not fully read', 'a confession on someone else’s behalf',
    'a surety for a stranger', 'a settlement with an unusual clause', 'a petition they helped draft'],
  mistaken: ['a official of some kind', 'somebody’s long-lost relation', 'a person of consequence',
    'an inspector', 'the one who was supposed to be meeting them'],
  service: ['small repairs', 'reading letters aloud', 'settling arguments', 'sitting with the dying',
    'finding lost animals'],
  other_service: ['anything involving a signature', 'travel after dark', 'talking to magistrates',
    'work that requires discretion'],
  invitation: ['a house they will not enter', 'a yearly dinner', 'a guild they declined to join',
    'a wedding that keeps being postponed'],
  finishes: ['sentences', 'inventories', 'arguments', 'repairs', 'drinks'],
  residue: ['the habits have not worn off', 'it still comes up in conversation',
    'they count in that dialect when tired', 'nobody there would recognise them now'],
  duration: ['two seasons', 'four years', 'most of a decade', 'one very long winter', 'eleven months'],
  departure: ['a disagreement about method', 'an audit', 'a death', 'an offer they could not refuse',
    'a reorganisation', 'a flood', 'a misunderstanding that was never cleared up'],
};

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

function mergeVocabulary(target: Record<string, string[]>, vocab?: HookVocabulary): void {
  if (!vocab) return;
  for (const [key, values] of Object.entries(vocab)) {
    if (!values || values.length === 0) continue;
    const existing = target[key];
    target[key] = existing ? [...existing, ...values] : [...values];
  }
}

/**
 * Build the grammar for one generation request. Species and background
 * vocabulary is *added* to the fallbacks rather than replacing them, so a hook
 * still has range even for a species with only a handful of entries.
 */
export function buildGrammar(species?: SpeciesSpec | null, background?: BackgroundSpec | null): Grammar {
  const merged: Record<string, string[]> = {};
  for (const [key, values] of Object.entries(BASE)) merged[key] = [...values];

  // Injected keys start from the fallbacks, then gain the specific entries.
  for (const [key, values] of Object.entries(FALLBACK)) merged[key] = [...values];

  if (species?.hookVocabulary) {
    // Specific entries are repeated so they outweigh the generic fallbacks.
    mergeVocabulary(merged, species.hookVocabulary);
    mergeVocabulary(merged, species.hookVocabulary);
  }
  if (background?.hookVocabulary) {
    mergeVocabulary(merged, background.hookVocabulary);
    mergeVocabulary(merged, background.hookVocabulary);
    mergeVocabulary(merged, background.hookVocabulary);
  }
  return merged;
}

function tidyHook(text: string): string {
  let out = text
    .replace(/\s{2,}/g, ' ')
    // Tighten space before close punctuation — but an em dash takes a space
    // on both sides, so it must not be in this class.
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s*—\s*/g, ' — ')
    .replace(/\ba\s+([aeiou])/gi, (match, vowel: string) =>
      `${match.startsWith('A') ? 'An' : 'an'} ${vowel}`)
    .trim();
  if (out && !/[.!?]$/.test(out)) out += '.';
  if (out) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

export interface HookOptions {
  rng: Rng;
  species?: SpeciesSpec | null;
  background?: BackgroundSpec | null;
  /**
   * Openings already used. The engine passes a bounded, instance-scoped set
   * so a party assembled one card at a time — five separate batches — still
   * avoids repeating an opener. Instance-scoped rather than module-scoped
   * keeps a fresh engine with a fixed seed exactly reproducible.
   */
  seen?: Set<string>;
}


/** Generate one character hook. Always returns a usable sentence. */
export function generateHook({ rng, species, background, seen }: HookOptions): string {
  const grammar = buildGrammar(species, background);
  let best = '';
  for (let attempt = 0; attempt < 10; attempt++) {
    const raw = expand(rng, grammar, 'hook');
    const hook = tidyHook(raw);
    if (hook.length < 24 || hook.includes('##')) continue;
    best = hook;
    const opener = hook.slice(0, 22).toLowerCase();
    if (!seen || !seen.has(opener)) {
      seen?.add(opener);
      break;
    }
  }
  return best || 'Arrived recently, with one bag and a reason they have not given.';
}

export const __testing = { BASE, FALLBACK, tidyHook, SYMBOL };
