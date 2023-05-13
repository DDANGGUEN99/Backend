getLocationName = (location_id) => {
  switch (location_id) {
    case 0:
      return '서울시';
    case 1:
      return '경기도';
    case 2:
      return '강원도';
    case 3:
      return '충청북도';
    case 4:
      return '충청남도';
    case 5:
      return '전라북도';
    case 6:
      return '전라남도';
    case 7:
      return '경상북도';
    case 8:
      return '경상남도';
    case 9:
      return '제주';
  }
};
module.exports = getLocationName;
