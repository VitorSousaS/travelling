type QueryConfigType = {
  field: string;
  operation?: string;
  insensitive?: boolean;
  transform?: (value: string) => unknown;
};

export class QueryConfigDto {
  [key: string]: QueryConfigType;
}

export class AverageDto {
  value: number;
}
