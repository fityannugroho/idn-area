import { getValues, sortArray } from '@/common/utils/array';
import { getProvinces } from '@/common/utils/data';
import { SortOrder } from '@/sort/sort.dto';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Province } from '@prisma/client';
import { MockProvinceService } from './__mocks__/province.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

describe('ProvinceController', () => {
  const testProvCode = '32';

  let controller: ProvinceController;
  let provinces: Province[];

  beforeAll(async () => {
    provinces = await getProvinces();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvinceController],
      providers: [
        {
          provide: ProvinceService,
          useValue: new MockProvinceService(provinces),
        },
      ],
    }).compile();

    controller = module.get<ProvinceController>(ProvinceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should return all provinces', async () => {
      const { data } = await controller.find();

      for (const province of data) {
        expect(province).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
          }),
        );
      }

      expect(data).toHaveLength(provinces.length);
    });

    it('should return all provinces sorted by name ascending', async () => {
      const testProvinces = await controller.find({
        sortBy: 'name',
        sortOrder: SortOrder.ASC,
      });

      expect(getValues(testProvinces.data, 'code')).toEqual(
        getValues(sortArray(provinces, 'name'), 'code'),
      );
    });

    it('should return all provinces sorted by name descending', async () => {
      const testProvinces = await controller.find({
        sortBy: 'name',
        sortOrder: SortOrder.DESC,
      });

      expect(getValues(testProvinces.data, 'code')).toEqual(
        getValues(sortArray(provinces, 'name', 'desc'), 'code'),
      );
    });

    it('should return all provinces filtered by name', async () => {
      const testProvName = 'jawa';
      const { data } = await controller.find({
        name: testProvName,
      });

      for (const province of data) {
        expect(province).toEqual(
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testProvName, 'i')),
          }),
        );
      }

      expect(data.length).toEqual(
        provinces.filter((p) =>
          p.name.toLowerCase().includes(testProvName.toLowerCase()),
        ).length,
      );
    });
  });

  describe('findByCode', () => {
    it('should return a province with matching code', async () => {
      const testProvince = await controller.findByCode({ code: testProvCode });
      const expectedProvince = provinces.find((p) => p.code === testProvCode);

      expect(testProvince).toEqual(expect.objectContaining(expectedProvince));
    });

    it('should throw NotFoundException if there is no matching province', async () => {
      await expect(controller.findByCode({ code: '00' })).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
