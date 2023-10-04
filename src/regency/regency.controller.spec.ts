import { getValues, sortArray } from '@/common/utils/array';
import { getDistricts, getIslands, getRegencies } from '@/common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { District, Island, Regency } from '@prisma/client';
import { MockRegencyService } from './__mocks__/regency.service';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

describe('RegencyController', () => {
  const testRegencyCode = '1101';

  let regencies: Regency[];
  let districts: District[];
  let islands: Island[];
  let controller: RegencyController;

  beforeAll(async () => {
    regencies = await getRegencies();
    districts = await getDistricts();
    islands = await getIslands();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegencyController],
      providers: [
        {
          provide: RegencyService,
          useValue: new MockRegencyService(regencies, districts, islands),
        },
      ],
    }).compile();

    controller = module.get<RegencyController>(RegencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    const testRegencyName = 'jakarta';
    let filteredRegenciesByName: Regency[];

    beforeAll(() => {
      filteredRegenciesByName = regencies.filter((p) =>
        p.name.toLowerCase().includes(testRegencyName.toLowerCase()),
      );
    });

    it('should return all regencies', async () => {
      const { data } = await controller.find();

      for (const regency of data) {
        expect(regency).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            provinceCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(regencies.length);
    });

    it('should return regencies filtered by name', async () => {
      const { data } = await controller.find({ name: testRegencyName });

      for (const regency of data) {
        expect(regency).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testRegencyName, 'i')),
            provinceCode: expect.any(String),
          }),
        );
      }

      expect(data.length).toEqual(filteredRegenciesByName.length);
    });

    it('should return empty array if there is no regency with the corresponding name', async () => {
      const { data } = await controller.find({ name: 'unknown regency' });

      expect(data).toEqual([]);
    });

    it('should return regencies filtered and sorted by name ascending', async () => {
      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredRegenciesByName, 'name'), 'code'),
      );
    });

    it('should return regencies filtered and sorted by name descending', async () => {
      const { data } = await controller.find({
        name: testRegencyName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredRegenciesByName, 'name', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return regencies filtered by province code', async () => {
      const provinceCode = '11';
      const filteredRegenciesByProvince = regencies.filter(
        (p) => p.provinceCode === provinceCode,
      );
      const { data } = await controller.find({ provinceCode });

      for (const regency of data) {
        expect(regency).toEqual(expect.objectContaining({ provinceCode }));
      }

      expect(data.length).toEqual(filteredRegenciesByProvince.length);
    });
  });

  describe('findByCode', () => {
    it('should return a regency with matching code', async () => {
      const testRegency = await controller.findByCode({
        code: testRegencyCode,
      });
      const expectedRegency = regencies.find(
        (regency) => regency.code === testRegencyCode,
      );

      expect(testRegency).toEqual(expect.objectContaining(expectedRegency));
    });

    it('should throw NotFoundException if there is no matching regency', async () => {
      await expect(
        controller.findByCode({ code: '0000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findDistricts', () => {
    let expectedDistricts: District[];

    beforeAll(() => {
      expectedDistricts = districts.filter(
        (r) => r.regencyCode === testRegencyCode,
      );
    });

    it('should return all districts in the matching regency', async () => {
      const { data } = await controller.findDistricts({
        code: testRegencyCode,
      });

      for (const district of data) {
        expect(district).toEqual(
          expect.objectContaining({
            code: expect.stringMatching(
              new RegExp(`^${testRegencyCode}\\d{2}$`),
            ),
            name: expect.any(String),
            regencyCode: testRegencyCode,
          }),
        );
      }

      expect(data).toHaveLength(expectedDistricts.length);
    });

    it('should throw NotFoundException if there is no matching regency', async () => {
      await expect(
        controller.findDistricts({ code: '0000' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return all districts in the matching regency sorted by name ascending', async () => {
      const { data } = await controller.findDistricts(
        { code: testRegencyCode },
        { sortBy: 'name', sortOrder: SortOrder.ASC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedDistricts, 'name'), 'code'),
      );
    });

    it('should return all districts in the matching regency sorted by name descending', async () => {
      const { data } = await controller.findDistricts(
        { code: testRegencyCode },
        { sortBy: 'name', sortOrder: SortOrder.DESC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedDistricts, 'name', SortOrder.DESC), 'code'),
      );
    });
  });

  describe('findIslands', () => {
    let expectedIslands: Island[];

    beforeAll(() => {
      expectedIslands = islands.filter(
        (r) => r.regencyCode === testRegencyCode,
      );
    });

    it('should return all islands in the matching regency', async () => {
      const { data } = await controller.findIslands({
        code: testRegencyCode,
      });

      for (const island of data) {
        expect(island).toEqual(
          expect.objectContaining({
            code: expect.stringMatching(
              new RegExp(`^${testRegencyCode}\\d{5}$`),
            ),
            coordinate: expect.any(String),
            isOutermostSmall: expect.any(Boolean),
            isPopulated: expect.any(Boolean),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            name: expect.any(String),
            regencyCode: testRegencyCode,
          }),
        );
      }

      expect(data).toHaveLength(expectedIslands.length);
    });

    it('should throw NotFoundException if there is no matching regency', async () => {
      await expect(
        controller.findIslands({ code: '0000' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return all islands in the matching regency sorted by name ascending', async () => {
      const { data } = await controller.findIslands(
        { code: testRegencyCode },
        { sortBy: 'name', sortOrder: SortOrder.ASC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedIslands, 'name'), 'code'),
      );
    });

    it('should return all islands in the matching regency sorted by name descending', async () => {
      const { data } = await controller.findIslands(
        { code: testRegencyCode },
        { sortBy: 'name', sortOrder: SortOrder.DESC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedIslands, 'name', SortOrder.DESC), 'code'),
      );
    });

    it('should return all islands in the matching regency sorted by coordinate ascending', async () => {
      const { data } = await controller.findIslands(
        { code: testRegencyCode },
        { sortBy: 'coordinate', sortOrder: SortOrder.ASC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedIslands, 'coordinate'), 'code'),
      );
    });

    it('should return all islands in the matching regency sorted by coordinate descending', async () => {
      const { data } = await controller.findIslands(
        { code: testRegencyCode },
        { sortBy: 'coordinate', sortOrder: SortOrder.DESC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(expectedIslands, 'coordinate', SortOrder.DESC),
          'code',
        ),
      );
    });
  });
});
