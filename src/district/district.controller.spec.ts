import { getValues, sortArray } from '@/common/utils/array';
import { getDistricts, getVillages } from '@/common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { District, Village } from '@prisma/client';
import { MockDistrictService } from './__mocks__/district.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

describe('DistrictController', () => {
  const testDistrictCode = '110101';

  let districts: District[];
  let villages: Village[];
  let controller: DistrictController;

  beforeAll(async () => {
    districts = await getDistricts();
    villages = await getVillages();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictController],
      providers: [
        {
          provide: DistrictService,
          useValue: new MockDistrictService(districts, villages),
        },
      ],
    }).compile();

    controller = module.get<DistrictController>(DistrictController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    const testDistrictName = 'bandung';
    let filteredDistrictsByName: District[];

    beforeAll(() => {
      filteredDistrictsByName = districts.filter((p) =>
        p.name.toLowerCase().includes(testDistrictName.toLowerCase()),
      );
    });

    it('should return all districts', async () => {
      const { data } = await controller.find();

      for (const district of data) {
        expect(district).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            regencyCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(districts.length);
    });

    it('should return districts filtered by name', async () => {
      const { data } = await controller.find({
        name: testDistrictName,
      });

      for (const district of data) {
        expect(district).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testDistrictName, 'i')),
            regencyCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(filteredDistrictsByName.length);
    });

    it('should return empty array if there is no district with the corresponding name', async () => {
      const { data } = await controller.find({
        name: 'unknown district',
      });

      expect(data).toEqual([]);
    });

    it('should return districts filtered and sorted by name ascending', async () => {
      const { data } = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredDistrictsByName, 'name'), 'code'),
      );
    });

    it('should return districts filtered and sorted by name descending', async () => {
      const { data } = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredDistrictsByName, 'name', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return districts filtered by regency code', async () => {
      const regencyCode = '1101';
      const filteredDistrictsByRegencyCode = districts.filter(
        (p) => p.regencyCode === regencyCode,
      );
      const { data } = await controller.find({ regencyCode });

      for (const district of data) {
        expect(district).toEqual(expect.objectContaining({ regencyCode }));
      }

      expect(data).toHaveLength(filteredDistrictsByRegencyCode.length);
    });
  });

  describe('findByCode', () => {
    it('should return a district with matching code', async () => {
      const testDistrict = await controller.findByCode({
        code: testDistrictCode,
      });
      const expectedDistrict = districts.find(
        (district) => district.code === testDistrictCode,
      );

      expect(testDistrict).toEqual(expect.objectContaining(expectedDistrict));
    });

    it('should throw NotFoundException if there is no district with the corresponding code', async () => {
      await expect(
        controller.findByCode({ code: '000000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findVillages', () => {
    let expectedVillages: Village[];

    beforeAll(() => {
      expectedVillages = villages.filter(
        (p) => p.districtCode === testDistrictCode,
      );
    });

    it('should return all villages in the matching district', async () => {
      const { data } = await controller.findVillages({
        code: testDistrictCode,
      });

      for (const village of data) {
        expect(village).toEqual(
          expect.objectContaining({
            code: expect.stringMatching(
              new RegExp(`^${testDistrictCode}\\d{4}$`),
            ),
            name: expect.any(String),
            districtCode: testDistrictCode,
          }),
        );
      }

      expect(data).toHaveLength(
        villages.filter((p) => p.districtCode === testDistrictCode).length,
      );
    });

    it('should throw NotFoundException if there is no matching district', async () => {
      await expect(
        controller.findVillages({ code: '000000' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return all villages in the matching district sorted by name ascending', async () => {
      const { data } = await controller.findVillages(
        { code: testDistrictCode },
        { sortBy: 'name' },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedVillages, 'name'), 'code'),
      );
    });

    it('should return all villages in the matching district sorted by name descending', async () => {
      const { data } = await controller.findVillages(
        { code: testDistrictCode },
        { sortBy: 'name', sortOrder: SortOrder.DESC },
      );

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(expectedVillages, 'name', SortOrder.DESC), 'code'),
      );
    });
  });
});
