const ItemController = require("../../../controllers/item.controller");

let mockMypageService = {
  getMyWorldcups: jest.fn(),
  getMyWorldcupResults: jest.fn(),
};

let mockRequest = {
  params: jest.fn(),
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: {
    user: {
      userId: 1,
    },
  },
};

let mockNext = jest.fn();

let itemController = new ItemController();
itemController.itemService = mockItemService;

describe("ItemController Unit Test", () => {

  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  /**
   1. mypageService의 getMyWorldcups() 메소드를 잘 호출하는지 검증
   2. res.status는 200을 반환하는지 검증
   3. getMyWorldcups()에서 얻은 myWorldcupsExample을 잘 반환하는지 검증
   */
  test("getMyWorldcups success test", async () => {
    // Given
    const myWorldcupsExample = [
      {
        title: "최애 라면 월드컵",
        content: "최애 라면을 골라요",
      },
      {
        title: "점메추",
        content: "점심 메뉴 추천 월드컵입니다.",
      },
    ];
    mockMypageService.getMyWorldcups = jest.fn(() => myWorldcupsExample);

    // When
    await mypageController.getMyWorldcups(mockRequest, mockResponse, mockNext);

    // Then
    // 1. mypageService의 getMyWorldcups() 메소드를 잘 호출하는지 검증
    expect(mockMypageService.getMyWorldcups).toHaveBeenCalledTimes(1);

    // 2. res.status는 200을 반환하는지 검증
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. getMyWorldcups()에서 얻은 myWorldcupsExample을 잘 반환하는지 검증
    expect(mockResponse.json).toHaveBeenCalledWith({
      results: myWorldcupsExample,
    });
  });


  /**
   1. mypageService의 getMyWorldcupResults 메소드를 잘 호출하는지 검증
   2. res.status는 200을 반환하는지 검증
   3. getMyWorldcupResults()에서 얻은 myWorldcupResultsExample을 잘 반환하는지 검증
   */
  test("getMyWorldcupResults success test", async () => {
    // Given
    const myWorldcupResultsExample = [
      {
        title: "최애 라면 월드컵",
        choice_name: "신라면",
      },
      {
        title: "점메추",
        choice_name: "원숭이골",
      },
    ];
    mockMypageService.getMyWorldcupResults = jest.fn(() => myWorldcupResultsExample);

    // When
    await mypageController.getMyWorldcupResults(mockRequest, mockResponse, mockNext);

    // Then
    // 1. mypageService의 getMyWorldcupResults 메소드를 잘 호출하는지 검증
    expect(mockMypageService.getMyWorldcupResults).toHaveBeenCalledTimes(1);

    // 2. res.status는 200을 반환하는지 검증
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. getMyWorldcupResults()에서 얻은 myWorldcupResultsExample을 잘 반환하는지 검증
    expect(mockResponse.json).toHaveBeenCalledWith({
      results: myWorldcupResultsExample,
    });
  });
});
