const spacesRegexp = / +/g;

export const getBattleVariations = bnBattleProperty => {
  const typeName = bnBattleProperty.name.toLowerCase();
  const typeNameVariations = [typeName, ...bnBattleProperty.aliases];
  typeNameVariations.forEach(variation => {
    if (variation.includes(' ')) {
      const noSpaceName = variation.replace(spacesRegexp, '');
      if (!typeNameVariations.includes(noSpaceName)) {
        typeNameVariations.push(noSpaceName);
      }
    }
  });

  return typeNameVariations;
};

export const parseBattleVariations = (input, bnProperties) => {
  const lowerCaseInput = input ? input.toLowerCase() : '';
  return bnProperties.reduce((acc, property) => {
    const nameVariations = getBattleVariations(property);
    const hasProperty = nameVariations.some(variation =>
      lowerCaseInput.includes(variation),
    );
    return hasProperty ? [...acc, property.name] : acc;
  }, []);
};
