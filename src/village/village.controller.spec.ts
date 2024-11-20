import { getValues, sortArray } from '@/common/utils/array';
import { getVillages } from '@/common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Village } from '@prisma/client';
import { MockVillageService } from './__mocks__/village.service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

describe('VillageController', () => {
  const testVillageCode = '1101012001';

  let villages: Village[];
  let controller: VillageController;

  beforeAll(async () => {
    villages = await getVillages();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillageController],
      providers: [
        { provide: VillageService, useValue: new MockVillageService(villages) },
      ],
    }).compile();

    controller = module.get<VillageController>(VillageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    const testVillageName = 'ubud';
    let filteredVillagesByName: Village[];

    beforeAll(() => {
      filteredVillagesByName = villages.filter((p) =>
        p.name.toLowerCase().includes(testVillageName.toLowerCase()),
      );
    });

    it('should return all villages', async () => {
      const { data } = await controller.find();

      for (const village of data) {
        expect(village).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
            districtCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(villages.length);
    });

    it('should return filtered villages by name', async () => {
      const { data } = await controller.find({ name: testVillageName });

      for (const village of data) {
        expect(village).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testVillageName, 'i')),
            districtCode: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(filteredVillagesByName.length);
    });

    it('should return empty array if there is no village with the corresponding name', async () => {
      const { data } = await controller.find({ name: 'unknown village' });

      expect(data).toEqual([]);
    });

    it('should return villages filtered and sorted by name ascending', async () => {
      const { data } = await controller.find({
        name: testVillageName,
        sortBy: 'name',
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(sortArray(filteredVillagesByName, 'name'), 'code'),
      );
    });

    it('should return villages filtered and sorted by name descending', async () => {
      const { data } = await controller.find({
        name: testVillageName,
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(data, 'code')).toEqual(
        getValues(
          sortArray(filteredVillagesByName, 'name', SortOrder.DESC),
          'code',
        ),
      );
    });

    it('should return filtered villages by district code', async () => {
      const districtCode = '110101';
      const expectedVillage = villages.filter(
        (v) => v.districtCode === districtCode,
      );
      const { data } = await controller.find({ districtCode });

      for (const village of data) {
        expect(village).toEqual(expect.objectContaining({ districtCode }));
      }

      expect(data).toHaveLength(expectedVillage.length);
    });
  });

  describe('findByCode', () => {
    it('should return a village with matching code', async () => {
      const testRegency = await controller.findByCode({
        code: testVillageCode,
      });
      const expectedVillage = villages.find(
        (village) => village.code === testVillageCode,
      );

      expect(testRegency).toEqual(expect.objectContaining(expectedVillage));
    });

    it('should throw NotFoundException if there is no matching villages', async () => {
      await expect(
        controller.findByCode({ code: '0000' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
