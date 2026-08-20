export interface ProposalLocation {
  state: {
    id: string;
    name: string;
  };

  district: {
    id: string;
    name: string;
  };

  block: {
    id: string;
    name: string;
  };

  panchayat: {
    id: string;
    name: string;
    gpcode: string;
  };
}