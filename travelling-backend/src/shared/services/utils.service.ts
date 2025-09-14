import * as bcrypt from 'bcrypt';
import { AverageDto, QueryConfigDto } from './dto/utils.dto';
import { FiltersAttractionDto } from 'src/modules/attraction/dto/filters-attraction.dto';
import { FiltersEstablishmentDto } from 'src/modules/establishment/dto/filters-establishment.dto';

export class UtilsService {
  public encryptPassword(rawPassword: string) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hash(rawPassword, SALT);
  }

  public comparePasswords(rawPassword: string, hashPassword: string) {
    return bcrypt.compare(rawPassword, hashPassword);
  }

  public generateWhereByParams(
    filters: FiltersAttractionDto | FiltersEstablishmentDto,
    queryConfig: QueryConfigDto,
  ): [number, object] {
    // Construa o objeto de consulta dinamicamente
    const where = {};

    for (const queryParam in filters) {
      const config = queryConfig[queryParam];

      if (config && filters[queryParam] !== undefined) {
        const { field, operation, transform, insensitive } = config;
        const value = filters[queryParam];
        const transformedValue = transform ? transform(value) : value;
        if (insensitive) {
          where[field] = {
            ...where[field],
            [operation ?? 'deletable_column']: transformedValue,
            mode: 'insensitive',
          };
        } else {
          where[field] = {
            ...where[field],
            [operation ?? 'deletable_column']: transformedValue,
          };
        }

        // Caso não tenha uma operação, a operation com valor undefined é removida e é considerada o transform
        if (!operation) {
          delete where['deletable_column'];
          where[field] = {
            ...where[field],
            ...transformedValue,
          };
        }
      }
    }

    // console.log(where);

    return [Object.keys(where).length, where];
  }

  public calculateAverage(ratings: AverageDto[]) {
    if (ratings.length === 0) {
      return 5;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0);
    const averageRating = totalRating / ratings.length;

    return averageRating;
  }
}
