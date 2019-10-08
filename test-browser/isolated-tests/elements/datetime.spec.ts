import { Elements } from '../../../lib';

describe('DateTimeElement', () => {
  it(`Checks DateTimeElement with valid date`, () => {
    const element = new Elements.DateTimeElement({
      contentItemSystem: {} as any,
      rawElement: {
        name: 'name',
        type: '',
        value: '2014-11-18T00:00:00Z'
      },
      propertyName: 'resolvedName'
    });
    expect(element.name).toEqual('name');
    expect(element.value).toEqual(jasmine.any(Date));
    expect(element.value).toEqual(new Date('2014-11-18T00:00:00Z'));
  });

  it(`Checks DateTimeElement with null date`, () => {
    const element = new Elements.DateTimeElement({
      contentItemSystem: {} as any,
      rawElement: {
        name: 'name',
        type: '',
        value: null
      },
      propertyName: 'resolvedName'
    });
    expect(element.name).toEqual('name');
    expect(element.value).toBeNull();
  });
});
