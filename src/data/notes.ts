export interface Note {
    id: string;
    title: string;
    date: string;
    preview: string;
    content: string;
}

export const NOTES: Note[] = [
    {
        "id": "1",
        "title": "notes",
        "date": "Just now",
        "preview": "notes",
        "content": "# notes"
    },
    {
        "id": "2",
        "title": "buy hdmi cable",
        "date": "Today at 9:41 AM",
        "preview": "buy hdmi cable",
        "content": "buy hdmi cable"
    },
    {
        "id": "3",
        "title": "founder agent",
        "date": "Yesterday",
        "preview": "what if the whole thing is just: type your idea, it validate...",
        "content": "## founder agent\n\nwhat if the whole thing is just: type your idea, it validates it, checks competitors, checks if the name's taken, drafts a landing page, tells you if it's worth building\n\nbasically an ai cofounder for the first 48 hrs of an idea\n\nbiggest problem rn is validation is soft. need real signal not just \"sounds good gpt response\"\n\npull reddit + producthunt + trends maybe. combine into one score\n\npricing - not sure yet. come back to this"
    },
    {
        "id": "4",
        "title": "renew domain !!! (again)",
        "date": "2 days ago",
        "preview": "renew domain !!! (again)",
        "content": "renew domain !!! (again)"
    },
    {
        "id": "5",
        "title": "things to buy this month",
        "date": "Last week",
        "preview": "things to buy this month",
        "content": "things to buy this month\n- desk lamp, current one flickers\n- new charger, mine frayed\n- maybe a second monitor if money allows"
    },
    {
        "id": "6",
        "title": "2am thought",
        "date": "July 12, 2026",
        "preview": "2am thought",
        "content": "2am thought\n\nwhy does every ai wrapper startup feel the same lol\n\nchatgpt wrapper > landing page > waitlist > dies in 2 weeks\n\nif founder agent is just another wrapper i should kill it now"
    },
    {
        "id": "7",
        "title": "books to read",
        "date": "July 10, 2026",
        "preview": "books to read",
        "content": "books to read\n- zero to one (reread)\n- the mom test\n- something about distribution, ask hayden what he's reading\n- maybe a fiction one too, been only reading business books and it's making me boring"
    },
    {
        "id": "8",
        "title": "movie night list",
        "date": "July 4, 2026",
        "preview": "movie night list",
        "content": "movie night list\n- oldboy\n- 3 idiots (rewatch, always good)\n- some tarantino one i haven't seen\n- ask if anyone wants to actually watch these or if this list just exists forever"
    },
    {
        "id": "9",
        "title": "bug",
        "date": "June 28, 2026",
        "preview": "bug",
        "content": "bug\n\nviva ecosystem - agent repeats same question twice if student answer too short\n\nprobably not enough context passed after first turn. check prompt template tomorrow\n\ntemp fix: min length check before sending to next agent. works for now, not the real fix"
    },
    {
        "id": "10",
        "title": "mom asked when i'm coming home...",
        "date": "June 15, 2026",
        "preview": "mom asked when i'm coming home next. said \"soon\" without che...",
        "content": "mom asked when i'm coming home next. said \"soon\" without checking calendar. check calendar."
    },
    {
        "id": "11",
        "title": "things i learned today",
        "date": "Older",
        "preview": "things i learned today",
        "content": "things i learned today\n- soroban contracts don't refund gas the way i assumed\n- groq is stupid fast for small models, good for realtime stuff\n- cosine similarity rec engine is basically free accuracy for almost no code"
    },
    {
        "id": "12",
        "title": "coffee places near college wor...",
        "date": "Older",
        "preview": "coffee places near college worth remembering",
        "content": "coffee places near college worth remembering\n- the one with good wifi but slow service\n- the cheap one, chai is actually better than the coffee there ironically\n- need to find one that's quiet after 6pm, everywhere gets loud"
    },
    {
        "id": "13",
        "title": "meeting w hayden",
        "date": "Older",
        "preview": "meeting w hayden",
        "content": "meeting w hayden\n\n- he thinks founder agent should target indian first time founders specifically, not global\n- pricing needs to be in rupees not usd, obvious in hindsight\n- pushing for a discord community before we even have a product. not sure. feels early\n- action: i build validator flow this week, he talks to 5 people\n\nask him again about the equity split conversation. keep putting this off"
    },
    {
        "id": "14",
        "title": "weekend plan (tentative)",
        "date": "Older",
        "preview": "weekend plan (tentative)",
        "content": "weekend plan (tentative)\n- sleep properly for once\n- clean the room, it's genuinely bad\n- maybe go somewhere just to get out of the house\n- no laptop for at least half a day. we'll see if that actually happens"
    },
    {
        "id": "15",
        "title": "desktop is a mess again. 40 so...",
        "date": "Older",
        "preview": "desktop is a mess again. 40 something files just sitting the...",
        "content": "desktop is a mess again. 40 something files just sitting there. clean this weekend maybe"
    },
    {
        "id": "16",
        "title": "erika",
        "date": "Older",
        "preview": "remembered why i started this - wanted a discord bot that ac...",
        "content": "## erika\n\nremembered why i started this - wanted a discord bot that actually remembers convos instead of resetting every session\n\nmemory works but gets messy after like 200 messages. need a summarization layer instead of storing everything raw\n\nwhat if i summarize every 50 messages into a compressed block and keep last 20 raw. test this"
    },
    {
        "id": "17",
        "title": "grocery list",
        "date": "Older",
        "preview": "grocery list",
        "content": "grocery list\n- eggs\n- bread\n- maggi (buy more than last time, ran out too fast)\n- something green, i keep buying vegetables and not cooking them"
    },
    {
        "id": "18",
        "title": "random observation",
        "date": "Older",
        "preview": "random observation",
        "content": "random observation\n\neveryone building ai companion apps is chasing the \"girlfriend\" use case. feels oversaturated and honestly a bit sad. erika should just feel like a friend/coworker vibe not that"
    },
    {
        "id": "19",
        "title": "haircut. should've gone last m...",
        "date": "Older",
        "preview": "haircut. should've gone last month. going to keep looking me...",
        "content": "haircut. should've gone last month. going to keep looking messy until i actually do this"
    },
    {
        "id": "20",
        "title": "dealvaulthq audit notes",
        "date": "Older",
        "preview": "dealvaulthq audit notes",
        "content": "dealvaulthq audit notes\n\ngoing line by line through the escrow contract. soroban's new enough i can't just copy stackoverflow answers, actually reading docs for once\n\ncheck:\n- reentrancy on release function\n- can arbiter be changed after deposit locked\n- what happens if buyer just disappears, is there a timeout\n\nfound one issue where dispute state can be triggered twice. write this up properly tmrw, too tired now"
    },
    {
        "id": "21",
        "title": "remember to remove console.log...",
        "date": "Older",
        "preview": "remember to remove console.logs before submitting the audit ...",
        "content": "remember to remove console.logs before submitting the audit report lol"
    },
    {
        "id": "22",
        "title": "songs on repeat this week",
        "date": "Older",
        "preview": "songs on repeat this week",
        "content": "songs on repeat this week\n- that one arijit song again, can't stop\n- some lofi playlist for coding, don't even know the name anymore just hit shuffle\n- need new music honestly, stuck in a loop"
    },
    {
        "id": "23",
        "title": "why do i own 4 water bottles a...",
        "date": "Older",
        "preview": "why do i own 4 water bottles and still can't find one when i...",
        "content": "why do i own 4 water bottles and still can't find one when i need it"
    },
    {
        "id": "24",
        "title": "macos portfolio",
        "date": "Older",
        "preview": "spent 3 hrs today just on window drag physics. needs to feel...",
        "content": "## macos portfolio\n\nspent 3 hrs today just on window drag physics. needs to feel slightly heavy, not snappy. real macos has this weight to it\n\nleft to do\n- [ ] menu bar clock (real time)\n- [ ] finder window with actual project files\n- [ ] sound on window close (maybe too much?)\n- [ ] mobile fallback, concept doesn't really work on phone\n\nprobably a stupid amount of effort for a portfolio site but having fun so whatever"
    },
    {
        "id": "25",
        "title": "idea - what if resumes were ju...",
        "date": "Older",
        "preview": "idea - what if resumes were just... apps",
        "content": "idea - what if resumes were just... apps\n\ninteractive instead of a pdf. probably been done. research this"
    },
    {
        "id": "26",
        "title": "need new notebook. current one...",
        "date": "Older",
        "preview": "need new notebook. current one almost full of half finished ...",
        "content": "need new notebook. current one almost full of half finished diagrams no one but me will ever understand"
    },
    {
        "id": "27",
        "title": "friday project",
        "date": "Older",
        "preview": "live2d face thing is way harder than expected. rigging is an...",
        "content": "## friday project\n\nlive2d face thing is way harder than expected. rigging is an art skill not a dev skill\n\nmight scope down to just voice + animated waveform instead of full face. more realistic to ship\n\ndiscord ppl who joined: 2 devs 1 designer, been quiet a week. check in with them"
    },
    {
        "id": "28",
        "title": "things to research",
        "date": "Older",
        "preview": "things to research",
        "content": "things to research\n- how whisper handles hinglish, probably bad\n- local tts that doesn't sound robotic\n- if building a \"native laptop assistant\" without os level permissions is even sane"
    },
    {
        "id": "29",
        "title": "email rahul tomorrow re: parse...",
        "date": "Older",
        "preview": "email rahul tomorrow re: parsewave harbor task, oracle check...",
        "content": "email rahul tomorrow re: parsewave harbor task, oracle check failing on edge case"
    },
    {
        "id": "30",
        "title": "should i get a plant for the r...",
        "date": "Older",
        "preview": "should i get a plant for the room. saw someone's setup with ...",
        "content": "should i get a plant for the room. saw someone's setup with one and it looked nice. probably going to kill it in a week but might be worth trying"
    },
    {
        "id": "31",
        "title": "shipd - httpie bug",
        "date": "Older",
        "preview": "shipd - httpie bug",
        "content": "shipd - httpie bug\n\npatch format has to match exactly or it silently fails, no error message which is annoying\n\nlesson: read CONTRIBUTING.md fully before writing a single line next time. wasted 2 hrs guessing format"
    },
    {
        "id": "32",
        "title": "quick idea dump before i forge...",
        "date": "Older",
        "preview": "quick idea dump before i forget",
        "content": "quick idea dump before i forget\n- app that tracks which subscriptions you forgot you have\n- tool that turns a messy voice note into a structured todo list\n- browser extension showing \"real\" price after fake discounts\n- ai that reads your notion and tells you what you're actually working on this week vs what you think you are\n\nnot building any of these rn, just don't want to lose them"
    },
    {
        "id": "33",
        "title": "things to pack if the trip act...",
        "date": "Older",
        "preview": "things to pack if the trip actually happens",
        "content": "things to pack if the trip actually happens\n- charger\n- power bank\n- earphones (the good ones not the tangled backup pair)\n- figure out train tickets before prices go up"
    },
    {
        "id": "34",
        "title": "thrivia internship",
        "date": "Older",
        "preview": "thrivia internship",
        "content": "thrivia internship\n\napplied. now the annoying part - waiting\n\nshould build something small specific to what they do instead of just resume + generic message. think about this"
    },
    {
        "id": "35",
        "title": "why is this happening",
        "date": "Older",
        "preview": "why is this happening",
        "content": "why is this happening\n\nwise account payment purpose code took way longer than it should have. picked p0802 for it/consulting, hope that's right, ask someone who's done this before"
    },
    {
        "id": "36",
        "title": "3am. brain not working anymore...",
        "date": "Older",
        "preview": "3am. brain not working anymore. sleep.",
        "content": "3am. brain not working anymore. sleep."
    },
    {
        "id": "37",
        "title": "recipe i want to try (again, k...",
        "date": "Older",
        "preview": "recipe i want to try (again, keep saying this)",
        "content": "recipe i want to try (again, keep saying this)\nmaggi but actually add vegetables this time instead of just chili flakes and calling it a meal"
    },
    {
        "id": "38",
        "title": "learnhub retro",
        "date": "Older",
        "preview": "things that worked",
        "content": "## learnhub retro\n\nthings that worked\n- jwt auth, no issues\n- cosine similarity recs, surprisingly solid for how little code\n\nthings i'd do differently\n- sqlite fine for a final exam project but i kept mentally hitting its limits, knew it wouldn't scale and that bugged me the whole time\n- should've written tests as i went not after. classic mistake, keep making it\n\nclaude generated the architecture diagrams which saved hours, would've spent a whole night drawing boxes otherwise"
    },
    {
        "id": "39",
        "title": "pay electricity bill before th...",
        "date": "Older",
        "preview": "pay electricity bill before the 5th this time, not after",
        "content": "pay electricity bill before the 5th this time, not after"
    },
    {
        "id": "40",
        "title": "is \"founder agent\" even the ri...",
        "date": "Older",
        "preview": "is \"founder agent\" even the right name",
        "content": "is \"founder agent\" even the right name\n\n- founderagent.ai available? check\n- feels a bit generic but clear, which matters more than clever right now\n\ndon't overthink the name. ship first."
    },
    {
        "id": "41",
        "title": "things to buy before winter",
        "date": "Older",
        "preview": "things to buy before winter",
        "content": "things to buy before winter\n- proper blanket, last year's is basically dead\n- socks. always need more socks somehow"
    },
    {
        "id": "42",
        "title": "withdrew crypto today, solana ...",
        "date": "Older",
        "preview": "withdrew crypto today, solana gas fees ate more than expecte...",
        "content": "withdrew crypto today, solana gas fees ate more than expected. note to self - always check gas before moving anything. obviously. keep forgetting anyway"
    },
    {
        "id": "43",
        "title": "tabs open rn that i should pro...",
        "date": "Older",
        "preview": "tabs open rn that i should probably close",
        "content": "tabs open rn that i should probably close\n- 14 stackoverflow tabs, half unrelated to what i was even debugging\n- a hacker news thread from 3 days ago\n- some paper i said i'd read, still haven't"
    },
    {
        "id": "44",
        "title": "things to test before shipping...",
        "date": "Older",
        "preview": "things to test before shipping viva ecosystem v2",
        "content": "things to test before shipping viva ecosystem v2\n- multi agent handoff under bad network\n- what if student just says \"i don't know\" to everything, does it gracefully end or loop forever (pretty sure it loops, fix this)\n- load test w 30 concurrent students, prof said this might actually get used in a real dept"
    },
    {
        "id": "45",
        "title": "idea for erika v2 maybe",
        "date": "Older",
        "preview": "idea for erika v2 maybe",
        "content": "idea for erika v2 maybe\n\nwhat if it has moods based on how the conversation's been going instead of always the same tone. probably overkill. still kinda want to try it"
    },
    {
        "id": "46",
        "title": "remember: passport expiry, che...",
        "date": "Older",
        "preview": "remember: passport expiry, check the date, keep forgetting t...",
        "content": "remember: passport expiry, check the date, keep forgetting to check"
    },
    {
        "id": "47",
        "title": "random shower thought",
        "date": "Older",
        "preview": "random shower thought",
        "content": "random shower thought\n\nwe spend so much time building tools to save time and then spend that saved time building more tools. is this productive or just a loop"
    },
    {
        "id": "48",
        "title": "startup idea that's probably s...",
        "date": "Older",
        "preview": "startup idea that's probably stupid but",
        "content": "startup idea that's probably stupid but\n\nmarketplace where devs sell \"unfinished side projects\" to other devs who want to finish and ship instead of starting from scratch\n\nhalf the value of a side project is the boring setup someone already did\n\nmight be nothing. write down anyway"
    },
    {
        "id": "49",
        "title": "fix desk. cables everywhere ag...",
        "date": "Older",
        "preview": "fix desk. cables everywhere again, how does this keep happen...",
        "content": "fix desk. cables everywhere again, how does this keep happening within a week of cleaning it"
    },
    {
        "id": "50",
        "title": "mac shortcuts i always forget ...",
        "date": "Older",
        "preview": "mac shortcuts i always forget and have to google again",
        "content": "mac shortcuts i always forget and have to google again\n- cmd + shift + 4 for screenshot area (why can i never remember this)\n- cmd + option + esc force quit"
    },
    {
        "id": "51",
        "title": "birthday gift ideas for a frie...",
        "date": "Older",
        "preview": "birthday gift ideas for a friend, still thinking",
        "content": "birthday gift ideas for a friend, still thinking\n- something they'd actually use not just something nice looking\n- ask what they're into lately, been out of touch a bit"
    },
    {
        "id": "52",
        "title": "idea",
        "date": "Older",
        "preview": "idea",
        "content": "idea\n\nwhat if founder agent could automatically...\n\nactually no"
    },
    {
        "id": "53",
        "title": "favorite fonts lately",
        "date": "Older",
        "preview": "favorite fonts lately",
        "content": "favorite fonts lately\n- inter for ui stuff\n- something monospace that isn't jetbrains for once, been using it forever, bored of it"
    },
    {
        "id": "54",
        "title": "pricing",
        "date": "Older",
        "preview": "pricing",
        "content": "pricing\n\nfree\npro\nenterprise\n\nneed to calculate api costs first"
    },
    {
        "id": "55",
        "title": "animation",
        "date": "Older",
        "preview": "animation",
        "content": "animation\n\nwindow drag still feels"
    },
    {
        "id": "56",
        "title": "things i keep saying i'll do a...",
        "date": "Older",
        "preview": "things i keep saying i'll do and don't",
        "content": "things i keep saying i'll do and don't\n- learn to cook something beyond maggi\n- go to the gym consistently\n- read fiction before bed instead of scrolling\n- reply to that one email from 2 weeks ago"
    },
    {
        "id": "57",
        "title": "downloads folder has 90+ files...",
        "date": "Older",
        "preview": "downloads folder has 90+ files again. half of them screensho...",
        "content": "downloads folder has 90+ files again. half of them screenshots i took \"just in case\" and never opened again"
    },
    {
        "id": "58",
        "title": "overheard someone at college t...",
        "date": "Older",
        "preview": "overheard someone at college talking about their startup ide...",
        "content": "overheard someone at college talking about their startup idea, sounded almost exactly like something i thought of 6 months ago and dropped. weird feeling. not sure what to do with that"
    },
    {
        "id": "59",
        "title": "accidentally closed the tab wi...",
        "date": "Older",
        "preview": "accidentally closed the tab with the audit findings i hadn't...",
        "content": "accidentally closed the tab with the audit findings i hadn't saved yet. rewriting from memory now. lesson learned, save more often"
    },
    {
        "id": "60",
        "title": "things to google later",
        "date": "Older",
        "preview": "things to google later",
        "content": "things to google later\n- why does npm suddenly feel slower this week\n- best budget mechanical keyboard india\n- is there a non annoying way to do dark mode toggle that doesn't flash white first"
    },
    {
        "id": "61",
        "title": "mac battery dying way faster t...",
        "date": "Older",
        "preview": "mac battery dying way faster than it used to. probably need ...",
        "content": "mac battery dying way faster than it used to. probably need to check what's running in background. or just accept it and buy a new cable"
    },
    {
        "id": "62",
        "title": "quote i saved somewhere and ac...",
        "date": "Older",
        "preview": "quote i saved somewhere and actually think about sometimes: ...",
        "content": "quote i saved somewhere and actually think about sometimes: \"make something people want.\" simple but keeps being true every time i overcomplicate an idea"
    },
    {
        "id": "63",
        "title": "grocery list pt 2 (forgot half...",
        "date": "Older",
        "preview": "grocery list pt 2 (forgot half of last one)",
        "content": "grocery list pt 2 (forgot half of last one)\n- milk\n- rice\n- something for headache, ran out"
    },
    {
        "id": "64",
        "title": "don't update packages before a...",
        "date": "Older",
        "preview": "don't update packages before a demo. learned this the hard w...",
        "content": "don't update packages before a demo. learned this the hard way more than once and will probably learn it again"
    },
    {
        "id": "65",
        "title": "launch checklist draft (very r...",
        "date": "Older",
        "preview": "launch checklist draft (very rough)",
        "content": "launch checklist draft (very rough)\n- [ ] landing page live\n- [ ] waitlist form actually working, test it myself first\n- [ ] one clear sentence describing what this even is\n- [ ] tell 5 people directly, not just post somewhere and hope"
    },
    {
        "id": "66",
        "title": "random - saw a really well des...",
        "date": "Older",
        "preview": "random - saw a really well designed app today, spent 10 min ...",
        "content": "random - saw a really well designed app today, spent 10 min just studying the onboarding flow instead of using it for what it's for. that's probably a sign of something"
    },
    {
        "id": "67",
        "title": "should get another notebook, t...",
        "date": "Older",
        "preview": "should get another notebook, this one's basically a graveyar...",
        "content": "should get another notebook, this one's basically a graveyard of half diagrams only i understand"
    },
    {
        "id": "68",
        "title": "people keep getting stuck afte...",
        "date": "Older",
        "preview": "people keep getting stuck after signup on the viva thing",
        "content": "people keep getting stuck after signup on the viva thing\n\nneed to actually watch someone use it instead of guessing why"
    },
    {
        "id": "69",
        "title": "grabbed chai at 1am while debu...",
        "date": "Older",
        "preview": "grabbed chai at 1am while debugging, somehow the best decisi...",
        "content": "grabbed chai at 1am while debugging, somehow the best decision of the night"
    },
    {
        "id": "70",
        "title": "things to not forget before tr...",
        "date": "Older",
        "preview": "things to not forget before travel",
        "content": "things to not forget before travel\n- adapter if it's somewhere with different plugs\n- tell someone the actual dates, not just \"around then\""
    },
    {
        "id": "71",
        "title": "idk why but today felt like a ...",
        "date": "Older",
        "preview": "idk why but today felt like a good day to just build instead...",
        "content": "idk why but today felt like a good day to just build instead of plan. sometimes that's the move"
    },
    {
        "id": "72",
        "title": "parcel still not delivered. tr...",
        "date": "Older",
        "preview": "parcel still not delivered. tracking says \"out for delivery\"...",
        "content": "parcel still not delivered. tracking says \"out for delivery\" since yesterday. sure"
    },
    {
        "id": "73",
        "title": "weird bug today, fixed it, don...",
        "date": "Older",
        "preview": "weird bug today, fixed it, don't actually know why it's fixe...",
        "content": "weird bug today, fixed it, don't actually know why it's fixed. noting this so future me doesn't trust past me blindly"
    },
    {
        "id": "74",
        "title": "things i want in my next phone...",
        "date": "Older",
        "preview": "things i want in my next phone (far future, not buying anyti...",
        "content": "things i want in my next phone (far future, not buying anytime soon)\n- actually good battery\n- camera doesn't matter as much as everyone says it does\n- less bloatware, that's it really"
    },
    {
        "id": "75",
        "title": "should i learn to swim. random...",
        "date": "Older",
        "preview": "should i learn to swim. random thought. no context. just occ...",
        "content": "should i learn to swim. random thought. no context. just occurred to me"
    },
    {
        "id": "76",
        "title": "reminder: gift for hayden's th...",
        "date": "Older",
        "preview": "reminder: gift for hayden's thing coming up, don't forget li...",
        "content": "reminder: gift for hayden's thing coming up, don't forget like last time"
    },
    {
        "id": "77",
        "title": "startup observation",
        "date": "Older",
        "preview": "startup observation",
        "content": "startup observation\n\nmost \"ai for x\" pitches i see are really just \"chatgpt wrapped in a nicer ui for x\" - fine business model honestly, just wish people would say that instead of pretending it's some huge innovation"
    },
    {
        "id": "78",
        "title": "need another power strip, runn...",
        "date": "Older",
        "preview": "need another power strip, running out of sockets in the room...",
        "content": "need another power strip, running out of sockets in the room again"
    },
    {
        "id": "79",
        "title": "thinking about switching my co...",
        "date": "Older",
        "preview": "thinking about switching my coding music to something withou...",
        "content": "thinking about switching my coding music to something without lyrics, keep getting distracted mouthing along instead of typing"
    },
    {
        "id": "80",
        "title": "should text back that group i ...",
        "date": "Older",
        "preview": "should text back that group i left on read three days ago. w...",
        "content": "should text back that group i left on read three days ago. will probably do it tomorrow. definitely tomorrow"
    },
    {
        "id": "81",
        "title": "random idea, probably terrible...",
        "date": "Older",
        "preview": "random idea, probably terrible: an app that just tells you w...",
        "content": "random idea, probably terrible: an app that just tells you which of your open tabs you can honestly close right now. might just be me projecting my own problem onto a product idea"
    },
    {
        "id": "82",
        "title": "things that made today good",
        "date": "Older",
        "preview": "things that made today good",
        "content": "things that made today good\n- fixed the bug that was annoying me for two days\n- good chai\n- didn't check phone first thing in the morning for once"
    }
];
