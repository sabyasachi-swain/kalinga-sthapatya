// d:\Personal\AI_Experiment\kalinga-sthapatya\scripts\build\journeyWiring.mjs
export const ISOMETRIC_BY_TEMPLE_ID = {
  parasuramesvara: "V-63",
  mukteshwar: "V-68",
  lingaraj: "V-73",
  "jagannath-puri": "V-78",
  konark: "V-84",
};

export const TEMPLE_TOURS = {
  parasuramesvara: [
    { elementId: "jagamohana", highlight: ["jagamohana"], claimPaths: ["sections.special.1", "sections.special.2"] },
    { elementId: "bada", highlight: ["bada"], claimPaths: ["sections.special.0"] },
    { elementId: "gandi", highlight: ["gandi", "mastaka"], claimPaths: ["sections.special.3"] }
  ]
};

