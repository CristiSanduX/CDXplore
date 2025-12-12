export type Country = {
  code: string;
  name: string;
  continent: string;
};

export type Page =
  | {
      kind: "cover";
      issued: string;
      visited: number;
      continents: number;
      progress: number;
    }
  | {
      kind: "summary";
      visited: number;
      continents: number;
      progress: number;
      total: number;
    }
  | {
      kind: "stamps";
      pageIndex: number;
      pageCount: number;
      stamps: Country[];
    }
  | { kind: "empty" };
