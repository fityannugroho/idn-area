import { getValues, sortArray } from '@/common/utils/array';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import IdnArea, { Province, RegencyTransformed } from 'idn-area-data';
import { MockProvinceService } from './__mocks__/province.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

describe('ProvinceController', () => {
  const testProvCode = '32';

  let controller: ProvinceController;
  let provinces: Province[];
  let regencies: RegencyTransformed[];

  beforeAll(async () => {
    provinces = await IdnArea.provinces({ transform: true });
    regencies = await IdnArea.regencies({ transform: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvinceController],
      providers: [
        {
          provide: ProvinceService,
          useValue: new MockProvinceService(provinces, regencies),
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
      const testProvinces = await controller.find();

      expect(testProvinces).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      );
      expect(testProvinces).toHaveLength(provinces.length);
    });

    it('should return all provinces sorted by name ascending', async () => {
      const testProvinces = await controller.find({
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(getValues(testProvinces, 'code')).toEqual(
        getValues(sortArray(provinces, 'name'), 'code'),
      );
    });

    it('should return all provinces sorted by name descending', async () => {
      const testProvinces = await controller.find({
        sortBy: 'name',
        sortOrder: 'desc',
      });

      expect(getValues(testProvinces, 'code')).toEqual(
        getValues(sortArray(provinces, 'name', 'desc'), 'code'),
      );
    });

    it('should return all provinces filtered by name', async () => {
      const testProvName = 'jawa';
      const testProvinces = await controller.find({
        name: testProvName,
      });

      expect(testProvinces).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.any(String),
            name: expect.stringMatching(new RegExp(testProvName, 'i')),
          }),
        ]),
      );

      expect(testProvinces.length).toEqual(
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

  describe('findRegencies', () => {
    let expectedRegencies: RegencyTransformed[];

    beforeAll(() => {
      expectedRegencies = regencies.filter(
        (r) => r.provinceCode === testProvCode,
      );
    });

    it('should return all regencies in the matching province', async () => {
      const testRegencies = await controller.findRegencies({
        code: testProvCode,
      });

      expect(testRegencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: expect.stringMatching(new RegExp(`^${testProvCode}\\d{2}$`)),
            name: expect.any(String),
            provinceCode: testProvCode,
          }),
        ]),
      );
      expect(testRegencies).toHaveLength(expectedRegencies.length);
    });

    it('should throw NotFoundException if there is no matching province', async () => {
      await expect(
        controller.findRegencies({ code: '00' }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return all regencies in the matching province sorted by name ascending', async () => {
      const testRegencies = await controller.findRegencies(
        { code: testProvCode },
        { sortBy: 'name', sortOrder: 'asc' },
      );

      expect(getValues(testRegencies, 'code')).toEqual(
        getValues(sortArray(expectedRegencies, 'name'), 'code'),
      );
    });

    it('should return all regencies in the matching province sorted by name descending', async () => {
      const testRegencies = await controller.findRegencies(
        { code: testProvCode },
        { sortBy: 'name', sortOrder: 'desc' },
      );

      expect(getValues(testRegencies, 'code')).toEqual(
        getValues(sortArray(expectedRegencies, 'name', 'desc'), 'code'),
      );
    });
  });
});
