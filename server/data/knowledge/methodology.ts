/**
 * Phương pháp luận giải Tinh bàn theo Trung Châu Phái (Vương Đình Chi)
 * Dựa trên tài liệu: "Trung Châu Phái Tử Vi Đẩu Số Sơ Cấp Giảng Nghĩa"
 */

export interface MethodologyPrinciple {
  step: number
  title: string
  corePhilosophy: string
  actionableGuide: string
  concreteExample?: string
}

export const TRUNG_CHAU_METHODOLOGY: {
  overview: string
  steps: MethodologyPrinciple[]
  specialTechniques: Array<{
    name: string
    description: string
    application: string
  }>
} = {
  overview:
    'Học tập Tử Vi Đẩu Số Trung Châu Phái cần nắm vững 3 trụ cột: (1) Phép an sao, (2) Tính chất cơ bản của các tinh hệ, và (3) Phương pháp thôi đoán Tinh bàn. Tuyệt đối tránh thói quen chỉ tập trung nhìn hẹp vào Mệnh - Tài - Quan mà bỏ sót bức tranh toàn cục cuộc đời.',

  steps: [
    {
      step: 1,
      title: 'Tiên khán Phụ Mẫu, tái khán Điền Trạch (Khảo sát xuất thân và nền tảng)',
      corePhilosophy:
        'Từ hai cung Phụ Mẫu và Điền Trạch có thể luận đoán được cội nguồn xuất thân, hoàn cảnh gia đình thuở ấu thơ cùng mức độ che chở, nâng đỡ từ cha mẹ.',
      actionableGuide:
        'Phân định người này thuộc loại "Bạch thủ hưng gia" (tay trắng tự lực khai sáng cơ nghiệp) hay "Khắc thiệu cơ cừu" (kế thừa gìn giữ cơ nghiệp gia đình). Nếu Phụ Mẫu và Điền Trạch đều tốt đẹp mà Mệnh lại mang xu hướng tự lập, có thể đương số phải trải qua một biến cố gia đình để tự đứng trên đôi chân mình. Ngược lại nếu Phụ Điền xấu mà vận trình không có đột phá, đương số sẽ khó bứt phá nếu chỉ an phận.',
    },
    {
      step: 2,
      title: 'Tương quan Mệnh Thân và Phúc Đức (Cân bằng Vật chất và Tinh thần)',
      corePhilosophy:
        'Mệnh Thân cùng Tam phương Tứ chính thể hiện thực chất vật chất bên ngoài: tiền tài, địa vị, thành tựu cụ thể. Phúc Đức cùng Tam phương Tứ chính phản ánh chiều sâu tinh thần: sự thanh thản nội tâm, quan niệm sống, tư tưởng và hưởng thụ tinh thần.',
      actionableGuide:
        'Cả hai cung đều tốt: đời người trọn vẹn cả công danh lẫn niềm vui an lạc. Nếu Mệnh tốt nhưng Phúc Đức xấu: có thể giàu có về tiền bạc nhưng nội tâm dày vò, cô đơn, hôn nhân trục trặc hoặc mang bệnh mãn tính. Ngược lại nếu Phúc Đức tốt mà Mệnh bình thường: đương số tuy không giàu sang tột đỉnh nhưng tâm hồn an nhiên, biết đủ là vui.',
    },
    {
      step: 3,
      title: 'Truy tìm cung khởi nguồn sự việc (Nhận diện mắt xích tạo nên nghịch cảnh)',
      corePhilosophy:
        'Dựa trên sự khập khiễng giữa Mệnh và Phúc Đức, tìm kiếm chính xác cung vị chịu trách nhiệm phát sinh vấn đề.',
      actionableGuide:
        'Nếu nghi ngờ đời sống tinh thần bất an do hôn nhân: kiểm tra sâu cung Phu Thê. Nếu do thể chất suy nhược hoặc bệnh tật âm ỉ: đối chiếu cung Tật Ách. Nhất định phải tìm ra tổ hợp tinh hệ tại cung đó có sự liên đới hỗ trợ lý giải cho sự bất an ở Mệnh và Phúc Đức.',
    },
    {
      step: 4,
      title: 'Truy xét Vận hạn đa tầng (Đại hạn - Lưu niên - Lưu nguyệt - Lưu nhật - Lưu thời)',
      corePhilosophy:
        'Lá số nguyên cục là gốc rễ tiềm năng, nhưng biến cố chỉ phát tác khi có sự trùng điệp kích động của các tầng Vận hạn.',
      actionableGuide:
        'Quan sát sự dịch chuyển của Mệnh bàn theo từng Đại hạn 10 năm và từng Lưu niên. Chú ý hiện tượng Lưu diệu trùng điệp: ví dụ Lưu Kình Dương của Lưu niên bay vào trùng động với Kình Dương của Đại hạn hoặc nguyên cục, kích động các sao Hóa Kỵ xung chiếu tạo thành biến động lớn.',
    },
  ],

  specialTechniques: [
    {
      name: 'Tá Tinh An Cung (Đại pháp luận đoán Cung Vô Chính Diệu)',
      description:
        'Khi một cung vị không có chính tinh tọa thủ (Vô Chính Diệu), Trung Châu Phái áp dụng phép Tá Tinh: mượn toàn bộ chính diệu từ cung xung đối (Phong cung) đưa về bản cung để phân tích tính chất cát hung.',
      application:
        'Sao được tá mượn vẫn giữ nguyên ngũ hành và tính chất cơ bản, nhưng phát huy sức mạnh ở mức độ gián tiếp (khoảng 70-80% so với tọa thủ trực tiếp) và chịu sự chi phối mạnh của các phụ tá sát diệu ngự sẵn tại bản cung.',
    },
    {
      name: 'Tinh Diệu Hỗ Thiệp (Sự can thiệp làm biến chất tinh hệ)',
      description:
        'Một tổ hợp cát tinh (như Lộc Văn củng Mệnh, Tam Hóa liên châu) có thể bị biến đổi hoàn toàn bản chất nếu có sự xuất hiện bất ngờ của các tạp diệu đào hoa hoặc sát tinh.',
      application:
        'Ví dụ: Người có cách Lộc tinh Văn tinh tề tập lẽ ra thi cử đại đỗ đạt, nhưng nếu gặp thêm Hàm Trì, Đại Hao, Thiên Diêu đồng độ hoặc xung chiếu thì tính chất lại chuyển thành đắm say tình ái, đam mê hưởng lạc làm sa sút công danh thi cử.',
    },
    {
      name: 'Kiến Tinh Tầm Ngẫu (Quan sát theo cặp Đối Tinh)',
      description:
        'Nguyên tắc vàng của Trung Châu Phái: Đẩu số vận hành theo từng cặp đối tinh (Thiên Phủ - Thiên Tướng, Thái Dương - Thái Âm, Tả Phụ - Hữu Bật, Xương - Khúc, Lộc - Mã).',
      application:
        'Khi thấy một sao xuất hiện, lập tức phải truy tìm vị trí của sao còn lại. Nếu cả hai cùng hội tụ (Đồng cung, Xung đối, hoặc Song phi hồ điệp ở tam hợp), sức mạnh cát/hung sẽ được nhân lên gấp bội.',
    },
  ],
}
