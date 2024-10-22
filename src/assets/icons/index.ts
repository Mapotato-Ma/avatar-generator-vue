const filesObj = {
  decoration: import.meta.glob('./decoration*.svg', { eager: true, as: 'raw' }),
  hair: import.meta.glob('./hair*.svg', { eager: true, as: 'raw' }),
  mouth: import.meta.glob('./mouth*.svg', { eager: true, as: 'raw' }),
  eyes: import.meta.glob('./eyes*.svg', { eager: true, as: 'raw' }),
  clothes: import.meta.glob('./clothes*.svg', { eager: true, as: 'raw' }),
  face: import.meta.glob('./face*.svg', { eager: true, as: 'raw' }),
  mask: import.meta.glob('./mask*.svg', { eager: true, as: 'raw' }),
};

export const iconMap: Record<string, Record<string, string>> = {};

// 遍历每个类别
for (const [category, files] of Object.entries(filesObj)) {
  if (files && typeof files === 'object') {
    // 遍历每个文件
    for (const [key, value] of Object.entries(files)) {
      const iconName = key.split('-')[1].split('.')[0];
      if (!iconMap[category]) {
        iconMap[category] = {};
      }
      iconMap[category][iconName] = value;
    }
  } else {
    console.error(`Failed to import files for category: ${category}`);
  }
}
