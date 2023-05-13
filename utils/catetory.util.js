getCategoryName = (category_id) => {
  switch (category_id) {
    case 0:
      return '디지털/전자기기';
    case 1:
      return '건강/헬스';
    case 2:
      return '의류/생활용품';
    case 3:
      return '가공식품';
    case 4:
      return '가구/인테리어';
    case 5:
      return '기타 중고물품';
  }
}
module.exports = getCategoryName;