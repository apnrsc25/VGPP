export interface LocationQuery {
  layer: number;
  where: string;
}

function escapeSql(value: string) {
  return value.trim().replace(/'/g, "''");
}

export function getStateQuery(
  stateName: string
): LocationQuery {
  const state = escapeSql(
    stateName.toUpperCase()
  );

  return {
    layer: 0,
    where: `STNAME='${state}'`,
  };
}

export function getDistrictQuery(
  stateName: string,
  districtName: string
): LocationQuery {
  const state = escapeSql(
    stateName.toUpperCase()
  );

  const district = escapeSql(
    districtName.toUpperCase()
  );

  return {
    layer: 1,
    where:
      `stname='${state}' ` +
      `AND D_Pan_Name='${district}'`,
  };
}

export function getBlockQuery(
  stateName: string,
  districtName: string,
  blockName: string
): LocationQuery {
  const state = escapeSql(
    stateName.toUpperCase()
  );

  const district = escapeSql(
    districtName.toUpperCase()
  );

  const block = escapeSql(
    blockName.toUpperCase()
  );

  return {
    layer: 2,
    where:
      `state='${state}' ` +
      `AND district='${district}' ` +
      `AND block_name='${block}'`,
  };
}

export function getPanchayatQuery(
  stateName: string,
  districtName: string,
  blockName: string,
  panchayatName: string
): LocationQuery {
  const state = escapeSql(
    stateName.toUpperCase()
  );

  const district = escapeSql(
    districtName.toUpperCase()
  );

  const block = escapeSql(
    blockName.toUpperCase()
  );

  const panchayat = escapeSql(
    panchayatName.toUpperCase()
  );

  return {
    layer: 3,
    where:
      `STNAME='${state}' ` +
      `AND DTNAME='${district}' ` +
      `AND blkname='${block}' ` +
      `AND GPNAME='${panchayat}'`,
  };
}