export class ObjectUtils {

  static listNoNumberProperties(object: object) {
    return Object.keys(object).filter((item) => {
      return isNaN(Number(item));
    });
  }

  static listUnsetdProperties(object: object) {
    return Object.keys(object).filter((key: keyof typeof object) => {
      return object[key] === undefined || object[key] === null
    })
  }

  objectGroupBy<T>(
    data: T[],
    referenceKey: keyof typeof data[number],
    verify: (item: typeof data[number], currentCategory: string) => boolean
  ) {

    let currentCategory = ''
    const groupByCategory = data.reduce((group: Record<string, typeof data>, item) => {
      const category = item[referenceKey];
      if (currentCategory == '') {
        currentCategory = String(category)
      }
      if (verify(item, currentCategory)) {
        currentCategory = String(category)
      }
      group[currentCategory] = [...(group[currentCategory] ?? []), item];
      return group;
    }, {});

    return groupByCategory

  }

  orderArrayOfObjects<T>(
    objects: T[],
    referenceKey: keyof typeof objects[number],
    order: 'asc' | 'desc'
  ) {
    objects
      .sort((previousObject, currentObject) => {
        if (previousObject[referenceKey] > currentObject[referenceKey]) {
          return order === 'asc' ? 1 : -1
        }
        if (previousObject[referenceKey] < currentObject[referenceKey]) {
          return order === 'asc' ? -1 : 1
        }
        return 0
      })
  }

}
