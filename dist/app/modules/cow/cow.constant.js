'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.bookFilterableFields =
  exports.bookSearchableFields =
  exports.category =
  exports.label =
  exports.breed =
  exports.location =
    void 0;
exports.location = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];
exports.breed = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];
exports.label = ['for sale', 'sold out'];
exports.category = ['Dairy', 'Beef', 'DualPurpose'];
exports.bookSearchableFields = ['name', 'location', 'breed', 'category'];
exports.bookFilterableFields = [
  'searchTerm',
  'name',
  'age',
  'location',
  'breed',
  'maxPrice',
  'minPrice',
];
