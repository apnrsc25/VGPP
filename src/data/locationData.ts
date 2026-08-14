// export interface Panchayat {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
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
//   latitude: number;
//   longitude: number;
//   zoom: number;
//   districts: District[];
// }

// export const locationData: State[] = [
//   {
//     id: "jharkhand",
//     name: "Jharkhand",
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
//                 name: "Kanke Gram Panchayat",
//                 latitude: 23.45,
//                 longitude: 85.31,
//               },
//               {
//                 id: "sukurhutu",
//                 name: "Sukurhutu",
//                 latitude: 23.48,
//                 longitude: 85.28,
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
//               },
//               {
//                 id: "sidraul",
//                 name: "Sidraul",
//                 latitude: 23.31,
//                 longitude: 85.38,
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
}

export interface Block {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  panchayats: Panchayat[];
}

export interface District {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  blocks: Block[];
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
];