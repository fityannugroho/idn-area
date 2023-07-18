import { Test, TestingModule } from '@nestjs/testing';
import IdnArea, {
  DistrictTransformed,
  VillageTransformed,
} from 'idn-area-data';
import { MockDistrictService } from './__mocks__/district.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { getValues, sortArray } from '@/common/utils/array';
import { NotFoundException } from '@nestjs/common';

describe('DistrictController', () => {
  const testDistrictCode = '110101';

  let districts: DistrictTransformed[];
  let villages: VillageTransformed[];
  let controller: DistrictController;

  beforeAll(async () => {
    districts = await IdnArea.districts({ transform: true });
    villages = await IdnArea.villages({ transform: true });
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
    let filteredDistrictsByName: DistrictTransformed[];

    beforeAll(() => {
      filteredDistrictsByName = districts.filter((p) =>
        p.name.toLowerCase().includes(testDistrictName.toLowerCase()),
      );
    });

    it('should return all districts', async () => {
      const testDistricts = await controller.find();

      expect(testDistricts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            regencyCode: expect.any(String),
          }),
        ]),
      );
      expect(testDistricts).toHaveLength(districts.length);
    });

    it('should return districts filtered by name', async () => {
      const testDistricts = await controller.find({
        name: testDistrictName,
      });

      expect(testDistricts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testDistrictName, 'i')),
            regencyCode: expect.any(String),
          }),
        ]),
      );
      expect(testDistricts).toHaveLength(filteredDistrictsByName.length);
    });

    it('should return empty array if there is no district with the corresponding name', async () => {
      const testDistricts = await controller.find({
        name: 'unknown district',
      });

      expect(testDistricts).toEqual([]);
    });

    it('should return districts filtered and sorted by name ascending', async () => {
      const testDistricts = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
      });

      expect(getValues(testDistricts, 'code')).toEqual(
        getValues(sortArray(filteredDistrictsByName, 'name'), 'code'),
      );
    });

    it('should return districts filtered and sorted by name descending', async () => {
      const testDistricts = await controller.find({
        name: testDistrictName,
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(getValues(testDistricts, 'code')).toEqual(
        getValues(sortArray(filteredDistrictsByName, 'name', 'desc'), 'code'),
      );
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
    let expectedVillages: VillageTransformed[];

    beforeAll(() => {
      expectedVillages = villages.filter(
        (p) => p.districtCode === testDistrictCode,
      );
    });

    it('should return all villages in the matching district', async () => {
      const testVillages = await controller.findVillages({
        code: testDistrictCode,
      });

      expect(testVillages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.stringMatching(
              new RegExp(`^${testDistrictCode}\\d{4}$`),
            ),
            name: expect.any(String),
            districtCode: testDistrictCode,
          }),
        ]),
      );
      expect(testVillages).toHaveLength(
        villages.filter((p) => p.districtCode === testDistrictCode).length,
      );
    });

    it('should throw NotFoundException if there is no matching district', async () => {
      await expect(
        controller.findVillages({ code: '000000' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return all villages in the matching district sorted by name ascending', async () => {
      const testVillages = await controller.findVillages(
        { code: testDistrictCode },
        { sortBy: 'name' },
      );

      expect(getValues(testVillages, 'code')).toEqual(
        getValues(sortArray(expectedVillages, 'name'), 'code'),
      );
    });

    it('should return all villages in the matching district sorted by name descending', async () => {
      const testVillages = await controller.findVillages(
        { code: testDistrictCode },
        { sortBy: 'name', sortOrder: 'desc' },
      );

      expect(getValues(testVillages, 'code')).toEqual(
        getValues(sortArray(expectedVillages, 'name', 'desc'), 'code'),
      );
    });
  });
});
