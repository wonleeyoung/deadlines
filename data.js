/* =====================================================================
   Deadline data — this is the only file you normally edit.

   ADD YOUR OWN DEADLINE: copy one block into the PERSONAL array below
   and fill it in. Use category: "Personal".

   Each field:
     name       short title shown big         "ICLR 2027"
     full       full name / description        "Intl Conf on Learning Representations"
     category   picks color + filter chip      (see CATEGORY_ORDER in app.js)
     abstract   abstract/registration ISO date, or null
     paper      paper deadline ISO date        (required)
     tz         timezone label for humans      "AoE"
     where      location                       "Hong Kong"
     when       event dates                    "Oct 2027"
     link       official CFP / website URL
     estimated  true = date guessed from past years (shows a "~est" badge)
     note       optional one-liner

   Timezone tip: write the deadline as ISO 8601 *with the offset*, so the
   countdown is exact for anyone, anywhere. AoE (Anywhere on Earth) = UTC-12:
        "2026-09-24T23:59:00-12:00"
   KST (Korea) = +09:00 · PST = -08:00 · US Eastern = -04:00/-05:00.

   Conference data researched 2026-06-06. Entries marked estimated are based
   on previous years — ALWAYS confirm on the official site before relying on one.
   ===================================================================== */

// =====================================================================
//  YOUR PERSONAL DEADLINES — add grants, reports, visas, anything.
//  (Uncomment the example, or copy it, to get started.)
// =====================================================================
const PERSONAL = [
  // {
  //   name: "Progress report",
  //   full: "Annual Ph.D. progress report",
  //   category: "Personal",
  //   abstract: null,
  //   paper: "2026-07-31T23:59:00+09:00",
  //   tz: "KST",
  //   where: "Yonsei University",
  //   when: "",
  //   link: "",
  //   estimated: false,
  //   note: "",
  // },
];

// =====================================================================
//  CONFERENCES — curated for real-time / embedded / mobile / on-device ML,
//  plus ML / vision / systems / robotics flagships.
//  Delete any you don't track; update dates as official CFPs are posted.
// =====================================================================
const CONFERENCES = [
  // ---------------- Real-Time & Embedded ----------------
  { name: "RTSS 2027", full: "IEEE Real-Time Systems Symposium", category: "Real-Time & Embedded",
    abstract: null, paper: "2027-05-20T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Dec 2027", link: "https://2026.rtss.org/", estimated: true,
    note: "RTSS 2026 (May 21) has passed; 2027 deadline clusters in mid-May." },

  { name: "RTAS 2027", full: "Real-Time and Embedded Technology and Applications Symposium", category: "Real-Time & Embedded",
    abstract: null, paper: "2026-11-12T23:59:00-12:00", tz: "AoE",
    where: "New York, USA", when: "Spring 2027 · CPS-IoT Week", link: "https://cps-iot-week.org/", estimated: true,
    note: "Part of CPS-IoT Week 2027 (New York confirmed; deadline est. ~mid-Nov)." },

  { name: "ECRTS 2027", full: "Euromicro Conference on Real-Time Systems", category: "Real-Time & Embedded",
    abstract: null, paper: "2027-02-25T23:59:00-12:00", tz: "AoE",
    where: "Europe (TBD)", when: "Jul 2027", link: "https://www.ecrts.org/", estimated: true,
    note: "Single deadline, no separate abstract. Stable late-Feb pattern." },

  { name: "EMSOFT 2027", full: "Intl Conference on Embedded Software", category: "Real-Time & Embedded",
    abstract: "2027-03-19T23:59:00-12:00", paper: "2027-03-26T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Oct 2027 · ESWEEK", link: "https://esweek.org/emsoft/", estimated: true,
    note: "Journal-integrated track (ACM TECS / IEEE TCAD)." },

  { name: "RTCSA 2027", full: "Embedded and Real-Time Computing Systems and Applications", category: "Real-Time & Embedded",
    abstract: null, paper: "2027-03-06T23:59:00-12:00", tz: "AoE",
    where: "Asia-Pacific (TBD)", when: "Aug 2027", link: "https://rtcsa2026.github.io/", estimated: true,
    note: "" },

  { name: "DATE 2027", full: "Design, Automation and Test in Europe", category: "Real-Time & Embedded",
    abstract: "2026-09-13T23:59:00-12:00", paper: "2026-09-20T23:59:00-12:00", tz: "AoE",
    where: "Dresden, Germany", when: "Mar 22-24, 2027", link: "https://www.date-conference.com/date-2027-call-papers", estimated: false,
    note: "" },

  { name: "DAC 2027", full: "Design Automation Conference", category: "Real-Time & Embedded",
    abstract: "2026-11-09T17:00:00-08:00", paper: "2026-11-16T17:00:00-08:00", tz: "PST (17:00)",
    where: "San Jose, USA", when: "Jul 10-16, 2027", link: "https://dac.com/2026/events/dac-2027", estimated: true,
    note: "Dates/venue confirmed; deadline est. from stable mid-Nov pattern. Note: PST, not AoE." },

  // ---------------- Mobile & Sensing ----------------
  { name: "PerCom 2027", full: "Pervasive Computing and Communications", category: "Mobile & Sensing",
    abstract: "2026-09-04T23:59:00-12:00", paper: "2026-09-11T23:59:00-12:00", tz: "AoE",
    where: "Goa, India", when: "Mar 8-12, 2027", link: "https://percom.org/", estimated: false,
    note: "Abstract date = mandatory paper registration." },

  { name: "MobiCom 2027", full: "Mobile Computing and Networking", category: "Mobile & Sensing",
    abstract: null, paper: "2026-09-03T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Fall 2027", link: "https://www.sigmobile.org/mobicom/", estimated: false,
    note: "Summer round; a winter round follows ~Feb/Mar 2027." },

  { name: "MobiSys 2027", full: "Mobile Systems, Applications, and Services", category: "Mobile & Sensing",
    abstract: "2026-11-28T23:59:00-12:00", paper: "2026-12-05T23:59:00-12:00", tz: "AoE",
    where: "Ho Chi Minh City, Vietnam", when: "Jun 2027", link: "https://www.sigmobile.org/mobisys/", estimated: true,
    note: "Paper date from tracker; abstract est. Venue tentative." },

  { name: "SenSys 2027", full: "Embedded Networked Sensor Systems", category: "Mobile & Sensing",
    abstract: "2026-11-06T23:59:00-12:00", paper: "2026-11-14T23:59:00-12:00", tz: "AoE",
    where: "New York, USA", when: "2027", link: "https://sensys.acm.org/2027/", estimated: false,
    note: "Now merges SenSys + IPSN + IoTDI. Round-2 deadline shown (Round 1 was Jun 2026)." },

  { name: "IMWUT / UbiComp", full: "Interactive, Mobile, Wearable and Ubiquitous Technologies", category: "Mobile & Sensing",
    abstract: null, paper: "2026-11-01T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Fall 2027", link: "https://www.ubicomp.org/", estimated: false,
    note: "Journal with rolling deadlines: Feb / May / Aug / Nov 1. (Aug 1 = revisions only.)" },

  { name: "INFOCOM 2027", full: "IEEE Conference on Computer Communications", category: "Mobile & Sensing",
    abstract: "2026-07-17T23:59:00-12:00", paper: "2026-07-24T23:59:00-12:00", tz: "AoE",
    where: "Honolulu, USA", when: "May 2027", link: "https://infocom2027.ieee-infocom.org/", estimated: true,
    note: "Very stable late-July pattern; exact day + venue tentative." },

  // ---------------- Systems ----------------
  { name: "ASPLOS 2027", full: "Architectural Support for Programming Languages and OS", category: "Systems",
    abstract: null, paper: "2026-09-09T23:59:00-12:00", tz: "AoE",
    where: "Crete, Greece", when: "Apr 11-15, 2027", link: "https://www.asplos-conference.org/asplos2027/cfp/", estimated: false,
    note: "September submission cycle (April cycle already closed). No separate abstract." },

  { name: "NSDI 2027", full: "Networked Systems Design and Implementation", category: "Systems",
    abstract: "2026-09-10T23:59:00-04:00", paper: "2026-09-17T23:59:00-04:00", tz: "US Eastern",
    where: "Providence, USA", when: "May 11-13, 2027", link: "https://www.usenix.org/conference/nsdi27", estimated: false,
    note: "Fall round. Deadlines are US Eastern time, NOT AoE." },

  { name: "EuroSys 2027", full: "European Conference on Computer Systems", category: "Systems",
    abstract: "2026-09-17T23:59:00-12:00", paper: "2026-09-24T23:59:00-12:00", tz: "AoE",
    where: "Rabat, Morocco", when: "Apr 19-24, 2027", link: "https://2027.eurosys.org/", estimated: false,
    note: "Fall submission round (spring round already closed)." },

  { name: "OSDI 2027", full: "Operating Systems Design and Implementation", category: "Systems",
    abstract: "2026-12-04T23:59:00-08:00", paper: "2026-12-11T23:59:00-08:00", tz: "PST",
    where: "Baltimore, USA", when: "Jul 7-9, 2027", link: "https://www.usenix.org/conference/osdi27", estimated: true,
    note: "Dates/venue listed on trackers; CFP not yet posted by USENIX." },

  { name: "SOSP 2027", full: "ACM Symposium on Operating Systems Principles", category: "Systems",
    abstract: "2027-03-26T23:59:00-12:00", paper: "2027-04-01T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "2027", link: "https://sigops.org/s/conferences/sosp/", estimated: true,
    note: "Low confidence — SOSP 2027 not yet announced. Placeholder; re-check sosp.org." },

  // ---------------- Machine Learning ----------------
  { name: "AAAI 2027", full: "AAAI Conference on Artificial Intelligence", category: "Machine Learning",
    abstract: "2026-07-21T23:59:00-12:00", paper: "2026-07-28T23:59:00-12:00", tz: "AoE",
    where: "Montréal, Canada", when: "Feb 16-23, 2027", link: "https://aaai.org/conference/aaai/aaai-27/", estimated: false,
    note: "Main technical track. Track-specific dates may differ." },

  { name: "ICLR 2027", full: "Intl Conference on Learning Representations", category: "Machine Learning",
    abstract: "2026-09-19T23:59:00-12:00", paper: "2026-09-24T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Apr/May 2027", link: "https://iclr.cc/", estimated: true,
    note: "Imminent & estimated — watch iclr.cc for the official CFP (usually Jul/Aug)." },

  { name: "ICML 2027", full: "Intl Conference on Machine Learning", category: "Machine Learning",
    abstract: "2027-01-23T23:59:00-12:00", paper: "2027-01-28T23:59:00-12:00", tz: "AoE",
    where: "TBD", when: "Jul 2027", link: "https://icml.cc/", estimated: true,
    note: "" },

  { name: "NeurIPS 2027", full: "Neural Information Processing Systems", category: "Machine Learning",
    abstract: "2027-05-04T23:59:00-12:00", paper: "2027-05-06T23:59:00-12:00", tz: "AoE",
    where: "Europe (TBD)", when: "Dec 2027", link: "https://neurips.cc/", estimated: true,
    note: "2027 location confirmed as Europe; deadline est. from 2026." },

  // ---------------- Computer Vision ----------------
  { name: "CVPR 2027", full: "Computer Vision and Pattern Recognition", category: "Computer Vision",
    abstract: "2026-11-07T23:59:00-12:00", paper: "2026-11-13T23:59:00-12:00", tz: "AoE",
    where: "Seattle, USA", when: "Jun 19-26, 2027", link: "https://cvpr.thecvf.com/", estimated: true,
    note: "Dates/venue confirmed; deadline est. from 2026." },

  { name: "ICCV 2027", full: "Intl Conference on Computer Vision", category: "Computer Vision",
    abstract: "2027-03-04T23:59:00+00:00", paper: "2027-03-08T23:59:00+00:00", tz: "UTC+0",
    where: "Hong Kong", when: "Oct 2027", link: "https://www.thecvf.com/", estimated: true,
    note: "Odd-year conference. Day approximate." },

  { name: "ECCV 2028", full: "European Conference on Computer Vision", category: "Computer Vision",
    abstract: "2028-03-01T23:59:00-08:00", paper: "2028-03-05T23:59:00-08:00", tz: "UTC-8",
    where: "TBD", when: "2028", link: "https://eccv.ecva.net/", estimated: true,
    note: "Even-year conference — ECCV 2026 deadline already passed, next paper round is 2028." },

  // ---------------- Robotics ----------------
  { name: "ICRA 2027", full: "IEEE Intl Conference on Robotics and Automation", category: "Robotics",
    abstract: null, paper: "2026-09-15T23:59:00-08:00", tz: "PST",
    where: "Seoul, Korea", when: "May 24-28, 2027", link: "https://2027.ieee-icra.org/", estimated: true,
    note: "Seoul confirmed; Sep-15 deadline rock-steady across years but CFP not yet posted." },

  { name: "IROS 2027", full: "Intelligent Robots and Systems", category: "Robotics",
    abstract: null, paper: "2027-03-01T23:59:00-12:00", tz: "AoE",
    where: "Florence, Italy", when: "Sep 26 - Oct 1, 2027", link: "https://www.ieee-ras.org/conferences-workshops/financially-co-sponsored/iros", estimated: true,
    note: "Preliminary date from the IEEE-RAS calendar." },
];

// The app reads this combined list.
const DEADLINES = [...CONFERENCES, ...PERSONAL];
