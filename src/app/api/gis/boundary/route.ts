// import { NextRequest, NextResponse } from "next/server";

// const GIS_BASE_URL =
//   "https://mapservice.gov.in/mapserviceserv176/rest/services/Panchayat/AdminGPHierarchy/MapServer";

// export const dynamic = "force-dynamic";

// export async function GET(
//   request: NextRequest
// ) {
//   const searchParams =
//     request.nextUrl.searchParams;

//   const layer =
//     searchParams.get("layer");

//   const where =
//     searchParams.get("where");

//   if (!layer || !where) {
//     return NextResponse.json(
//       {
//         error:
//           "layer and where are required",
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   const params =
//     new URLSearchParams();

//   params.set(
//     "where",
//     where
//   );

//   params.set(
//     "outFields",
//     "*"
//   );

//   params.set(
//     "returnGeometry",
//     "true"
//   );

//   params.set(
//     "outSR",
//     "4326"
//   );

//   params.set(
//     "f",
//     "geojson"
//   );

//   const gisUrl =
//     `${GIS_BASE_URL}/${layer}/query?${params.toString()}`;

//   console.log(
//     "\n================ GIS REQUEST ================"
//   );

//   console.log(
//     "Layer:",
//     layer
//   );

//   console.log(
//     "Where:",
//     where
//   );

//   console.log(
//     "URL:",
//     gisUrl
//   );

//   console.log(
//     "=============================================\n"
//   );

//   const controller =
//     new AbortController();

//   const timeout =
//     setTimeout(() => {
//       controller.abort();
//     }, 30000);

//   try {
//     const response =
//       await fetch(gisUrl, {
//         method: "GET",

//         headers: {
//           Accept:
//             "application/json, text/plain, */*",

//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0.0.0 Safari/537.36",

//           Referer:
//             "https://mapservice.gov.in/",
//         },

//         cache: "no-store",

//         signal:
//           controller.signal,
//       });

//     clearTimeout(timeout);

//     console.log(
//       "GIS STATUS:",
//       response.status
//     );

//     const text =
//       await response.text();

//     console.log(
//       "GIS RESPONSE LENGTH:",
//       text.length
//     );

//     if (!response.ok) {
//       console.error(
//         "GIS HTTP ERROR:",
//         response.status,
//         text
//       );

//       return NextResponse.json(
//         {
//           error:
//             "GIS server returned an error",
//           status:
//             response.status,
//           details:
//             text,
//         },
//         {
//           status: 502,
//         }
//       );
//     }

//     let data: any;

//     try {
//       data =
//         JSON.parse(text);
//     } catch (parseError) {
//       console.error(
//         "GIS JSON PARSE ERROR:",
//         parseError
//       );

//       console.error(
//         "RAW GIS RESPONSE:",
//         text.substring(
//           0,
//           1000
//         )
//       );

//       return NextResponse.json(
//         {
//           error:
//             "GIS server returned invalid JSON",
//           details:
//             text.substring(
//               0,
//               1000
//             ),
//         },
//         {
//           status: 502,
//         }
//       );
//     }

//     console.log(
//       "GIS FEATURES:",
//       data?.features?.length ?? 0
//     );

//     console.log(
//       "GIS GEOMETRY:",
//       Boolean(
//         data?.features?.[0]
//           ?.geometry
//       )
//     );

//     return NextResponse.json(
//       data
//     );
//   } catch (error) {
//     clearTimeout(timeout);

//     console.error(
//       "\n============== GIS FETCH ERROR =============="
//     );

//     console.error(error);

//     console.error(
//       "==============================================\n"
//     );

//     const message =
//       error instanceof Error
//         ? error.message
//         : String(error);

//     const isAbort =
//       error instanceof Error &&
//       error.name === "AbortError";

//     return NextResponse.json(
//       {
//         error:
//           isAbort
//             ? "GIS server request timed out"
//             : "Unable to connect to GIS server",

//         details:
//           message,

//         url:
//           gisUrl,
//       },
//       {
//         status: 502,
//       }
//     );
//   }
// }








import { NextRequest, NextResponse } from "next/server";

const GIS_BASE_URL =
  "https://mapservice.gov.in/mapserviceserv176/rest/services/Panchayat/AdminGPHierarchy/MapServer";

function escapeSql(value: string) {
  return value.trim().replace(/'/g, "''");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const layer = searchParams.get("layer");
    const where = searchParams.get("where");

    if (!layer || !where) {
      return NextResponse.json(
        {
          error: "layer and where are required",
        },
        {
          status: 400,
        }
      );
    }

    const allowedLayers = ["0", "1", "2", "3"];

    if (!allowedLayers.includes(layer)) {
      return NextResponse.json(
        {
          error: "Invalid GIS layer",
        },
        {
          status: 400,
        }
      );
    }

    const params = new URLSearchParams({
      where,
      outFields: "*",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
    });

    const url = `${GIS_BASE_URL}/${layer}/query?${params.toString()}`;

    console.log("=================================");
    console.log("GIS BOUNDARY REQUEST");
    console.log("Layer:", layer);
    console.log("Where:", where);
    console.log("URL:", url);
    console.log("=================================");

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error(
        "GIS SERVER ERROR:",
        response.status,
        text
      );

      return NextResponse.json(
        {
          error: `GIS server returned ${response.status}`,
          details: text,
        },
        {
          status: 502,
        }
      );
    }

    const data = await response.json();

    console.log(
      "GIS FEATURES:",
      data?.features?.length ?? 0
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GIS Boundary API Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to connect to GIS server",
      },
      {
        status: 502,
      }
    );
  }
}