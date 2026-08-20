// export interface Panchayat {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   gpcode: string;
// }

// export interface Block {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   panchayats: Panchayat[];
// }

// export interface District {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   blocks: Block[];
// }

// export interface State {
//   id: string;
//   name: string;
//   gisName: string;
//   latitude: number;
//   longitude: number;
//   zoom: number;
//   districts: District[];
// }

// export const locationData: State[] = [
//   {
//     id: "jharkhand",
//     name: "Jharkhand",
//     gisName: "JHARKHAND",
//     latitude: 23.6102,
//     longitude: 85.2799,
//     zoom: 7,

//     districts: [
//       {
//         id: "ranchi",
//         name: "Ranchi",
//         latitude: 23.3441,
//         longitude: 85.3096,

//         blocks: [
//           {
//             id: "kanke",
//             name: "Kanke",
//             latitude: 23.4341,
//             longitude: 85.3206,

//             panchayats: [
//               {
//                 id: "kanke-gp",
//                 name: "Kanke (North)",
//                 latitude: 23.45,
//                 longitude: 85.31,
//                 gpcode: "114685",
//               },
//               {
//                 id: "sukurhutu",
//                 name: "Sukurhutu",
//                 latitude: 23.48,
//                 longitude: 85.28,
//                 gpcode: "",
//               },
//             ],
//           },

//           {
//             id: "namkum",
//             name: "Namkum",
//             latitude: 23.3422,
//             longitude: 85.393,

//             panchayats: [
//               {
//                 id: "namkum-gp",
//                 name: "Namkum Gram Panchayat",
//                 latitude: 23.35,
//                 longitude: 85.41,
//                 gpcode: "",
//               },
//               {
//                 id: "sidraul",
//                 name: "Sidraul",
//                 latitude: 23.31,
//                 longitude: 85.38,
//                 gpcode: "",
//               },
//             ],
//           },
//         ],
//       },

//       {
//         id: "hazaribagh",
//         name: "Hazaribagh",
//         latitude: 23.9966,
//         longitude: 85.3691,

//         blocks: [
//           {
//             id: "barhi",
//             name: "Barhi",
//             latitude: 24.305,
//             longitude: 85.417,

//             panchayats: [
//               {
//                 id: "barhi-gp",
//                 name: "Barhi Gram Panchayat",
//                 latitude: 24.31,
//                 longitude: 85.42,
//                 gpcode: "",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     id: "karnataka",
//     name: "Karnataka",
//     gisName: "KARNATAKA",
//     latitude: 15.3173,
//     longitude: 75.7139,
//     zoom: 7,

//     districts: [
//       {
//         id: "dharwad",
//         name: "Dharwad",
//         latitude: 15.4589,
//         longitude: 75.0078,

//         blocks: [
//           {
//             id: "dharwad-block",
//             name: "Dharwad",
//             latitude: 15.46,
//             longitude: 75.01,

//             panchayats: [
//               {
//                 id: "dharwad-gp",
//                 name: "Dharwad Gram Panchayat",
//                 latitude: 15.47,
//                 longitude: 75.02,
//                 gpcode: "",
//               },
//             ],
//           },
//         ],
//       },

//       {
//         id: "bagalkot",
//         name: "Bagalkot",
//         latitude: 16.1691,
//         longitude: 75.6615,

//         blocks: [
//           {
//             id: "bagalkot-block",
//             name: "Bagalkot",
//             latitude: 16.18,
//             longitude: 75.69,

//             panchayats: [
//               {
//                 id: "kaladagi",
//                 name: "Kaladagi",
//                 latitude: 16.16,
//                 longitude: 75.63,
//                 gpcode: "",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     id: "odisha",
//     name: "Odisha",
//     gisName: "ODISHA",
//     latitude: 20.9517,
//     longitude: 85.0985,
//     zoom: 7,

//     districts: [
//       {
//         id: "khordha",
//         name: "Khordha",
//         latitude: 20.182,
//         longitude: 85.616,

//         blocks: [
//           {
//             id: "bhubaneswar",
//             name: "Bhubaneswar",
//             latitude: 20.2961,
//             longitude: 85.8245,

//             panchayats: [
//               {
//                 id: "bhubaneswar-gp",
//                 name: "Bhubaneswar Gram Panchayat",
//                 latitude: 20.3,
//                 longitude: 85.82,
//                 gpcode: "",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     id: "chhattisgarh",
//     name: "Chhattisgarh",
//     gisName: "CHHATTISGARH",
//     latitude: 21.2787,
//     longitude: 81.8661,
//     zoom: 7,

//     districts: [
//       {
//         id: "kanker",
//         name: "Kanker",
//         gisName: "Uttar Bastar Kanker",
//         latitude: 20.2719,
//         longitude: 81.4917,

//         blocks: [
//           {
//             id: "kanker-block",
//             name: "Kanker",
//             gisName: "KANKER",
//             latitude: 20.2719,
//             longitude: 81.4917,

//             panchayats: [
//               {
//                 id: "sureli",
//                 name: "Sureli",
//                 latitude: 20.258828,
//                 longitude: 81.293894,
//                 gpcode: "447809",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];



export interface Panchayat {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  gpcode: string;

  // Optional GIS/API name
  gisName?: string;
}

export interface Block {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  panchayats: Panchayat[];

  // Optional GIS/API name
  gisName?: string;
}

export interface District {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  blocks: Block[];

  // Optional GIS/API name
  gisName?: string;
}

export interface State {
  id: string;
  name: string;
  gisName: string;
  latitude: number;
  longitude: number;
  zoom: number;
  districts: District[];
}

export const locationData: State[] = [
  // ============================================================
  // JHARKHAND
  // ============================================================
  {
    id: "jharkhand",
    name: "Jharkhand",
    gisName: "JHARKHAND",
    latitude: 23.6102,
    longitude: 85.2799,
    zoom: 7,

    districts: [
      {
        id: "ranchi",
        name: "Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,

        blocks: [
          {
            id: "kanke",
            name: "Kanke",
            latitude: 23.4341,
            longitude: 85.3206,

            panchayats: [
              {
                id: "kanke-gp",
                name: "Kanke (North)",
                latitude: 23.45,
                longitude: 85.31,
                gpcode: "114685",
              },
              {
                id: "sukurhutu",
                name: "Sukurhutu",
                latitude: 23.48,
                longitude: 85.28,
                gpcode: "",
              },
            ],
          },

          {
            id: "namkum",
            name: "Namkum",
            latitude: 23.3422,
            longitude: 85.393,

            panchayats: [
              {
                id: "namkum-gp",
                name: "Namkum Gram Panchayat",
                latitude: 23.35,
                longitude: 85.41,
                gpcode: "",
              },
              {
                id: "sidraul",
                name: "Sidraul",
                latitude: 23.31,
                longitude: 85.38,
                gpcode: "",
              },
            ],
          },
        ],
      },

      {
        id: "hazaribagh",
        name: "Hazaribagh",
        latitude: 23.9966,
        longitude: 85.3691,

        blocks: [
          {
            id: "barhi",
            name: "Barhi",
            latitude: 24.305,
            longitude: 85.417,

            panchayats: [
              {
                id: "barhi-gp",
                name: "Barhi Gram Panchayat",
                latitude: 24.31,
                longitude: 85.42,
                gpcode: "",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // KARNATAKA
  // ============================================================
  {
    id: "karnataka",
    name: "Karnataka",
    gisName: "KARNATAKA",
    latitude: 15.3173,
    longitude: 75.7139,
    zoom: 7,

    districts: [
      {
        id: "dharwad",
        name: "Dharwad",
        latitude: 15.4589,
        longitude: 75.0078,

        blocks: [
          {
            id: "dharwad-block",
            name: "Dharwad",
            latitude: 15.46,
            longitude: 75.01,

            panchayats: [
              {
                id: "dharwad-gp",
                name: "Dharwad Gram Panchayat",
                latitude: 15.47,
                longitude: 75.02,
                gpcode: "",
              },
            ],
          },
        ],
      },

      {
        id: "bagalkot",
        name: "Bagalkot",
        latitude: 16.1691,
        longitude: 75.6615,

        blocks: [
          {
            id: "bagalkot-block",
            name: "Bagalkot",
            latitude: 16.18,
            longitude: 75.69,

            panchayats: [
              {
                id: "kaladagi",
                name: "Kaladagi",
                latitude: 16.16,
                longitude: 75.63,
                gpcode: "",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // ODISHA
  // ============================================================
  {
    id: "odisha",
    name: "Odisha",
    gisName: "ODISHA",
    latitude: 20.9517,
    longitude: 85.0985,
    zoom: 7,

    districts: [
      {
        id: "khordha",
        name: "Khordha",
        latitude: 20.182,
        longitude: 85.616,

        blocks: [
          {
            id: "bhubaneswar",
            name: "Bhubaneswar",
            latitude: 20.2961,
            longitude: 85.8245,

            panchayats: [
              {
                id: "bhubaneswar-gp",
                name: "Bhubaneswar Gram Panchayat",
                latitude: 20.3,
                longitude: 85.82,
                gpcode: "",
              },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CHHATTISGARH
  // ============================================================
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    gisName: "CHHATTISGARH",
    latitude: 21.2787,
    longitude: 81.8661,
    zoom: 7,

    districts: [
      {
        id: "kanker",

        // UI/display name
        name: "Kanker",

        // GIS API uses "Uttar Bastar Kanker"
        gisName: "Uttar Bastar Kanker",

        latitude: 20.2719,
        longitude: 81.4917,

        blocks: [
          {
            id: "kanker-block",

            // UI/display name
            name: "Kanker",

            // GIS API uses "KANKER"
            gisName: "KANKER",

            latitude: 20.2719,
            longitude: 81.4917,

            panchayats: [
              {
                id: "sureli",
                name: "Sureli",
                latitude: 20.258828,
                longitude: 81.293894,
                gpcode: "447809",
              },
            ],
          },
        ],
      },
    ],
  },
];