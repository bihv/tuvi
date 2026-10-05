/**
 * Tri thức về Các Đại Cách Cục và Tứ Hóa theo Trung Châu Phái
 * Dựa trên tài liệu: "Trung Châu Phái Tử Vi Đẩu Số Sơ Cấp Giảng Nghĩa" - Vương Đình Chi
 */

export interface PatternKnowledge {
  name: string
  category: 'Major' | 'Special' | 'Mutagen'
  characteristics: string
  careerTendency: string
  wealthTendency: string
  strategicAdvice: string
}

export const PATTERNS_KNOWLEDGE: Record<string, PatternKnowledge> = {
  // --- CÁC ĐẠI CÁCH CỤC CHÍNH (MAJOR PATTERNS) ---
  'Tử Phủ Vũ Tướng': {
    name: 'Tử Phủ Vũ Tướng',
    category: 'Major',
    characteristics:
      'Bộ sao vương giả gồm Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng hội tụ về tam phương tứ chính. Đại diện cho sự ổn định, uy quyền, tư duy lãnh đạo, năng lực quản trị hệ thống quy mô lớn và khả năng tích lũy tài sản bền vững theo năm tháng.',
    careerTendency:
      'Rất phù hợp với vai trò lãnh đạo cấp cao, giám đốc điều hành, quản trị doanh nghiệp quy mô, hành chính công vụ hoặc đứng đầu các tổ chức tài chính ngân hàng uy tín.',
    wealthTendency:
      'Tài chính tăng trưởng vững chắc theo thời gian, có nguồn tích lũy lớn từ Thiên Phủ và Vũ Khúc; không chuộng đầu cơ chớp nhoáng mà chú trọng tính trường tồn.',
    strategicAdvice:
      'Phát huy phong thái vương giả điềm đạm, lắng nghe cấp dưới và tránh sa vào thói độc đoán gia trưởng. Uy tín thương hiệu chính là đòn bẩy lớn nhất của bạn.',
  },

  'Phủ Tướng Triều Viên': {
    name: 'Phủ Tướng Triều Viên',
    category: 'Major',
    characteristics:
      'Thiên Phủ và Thiên Tướng là cặp "Đối Tinh" chính diệu quan trọng hàng đầu trong Trung Châu Phái. Khi hai sao này ngự tại tam hợp hoặc xung chiếu về Mệnh, tạo thành cách cục danh giá: một bên giữ kho ngân khố quốc gia, một bên nắm giữ ấn tín quyền lực điều hành.',
    careerTendency:
      'Thích hợp với các vị trí quản trị chủ chốt, giám đốc tài chính, cố vấn cấp cao, chưởng quản hành chính hoặc lãnh đạo các tổ chức công quyền.',
    wealthTendency:
      'Tài lộc dồi dào, nguồn tiền ổn định bền lâu, có năng lực quản lý chi tiêu và tích lũy bất động sản xuất sắc.',
    strategicAdvice:
      'Duy trì sự công tâm và kỷ luật. Phủ Tướng cần đi đôi với sự liêm chính; tránh để sự bảo thủ làm chậm nhịp đổi mới.',
  },

  'Sát Phá Lang': {
    name: 'Sát Phá Lang',
    category: 'Major',
    characteristics:
      'Bộ ba sao hành động và chuyển biến mang tính cách mạng: Thất Sát (tướng tinh túc sát), Phá Quân (tiên phong đột phá) và Tham Lang (dục vọng và biến hóa). Ba sao này vĩnh viễn nằm ở tam hợp của nhau, đại diện cho bản lĩnh khai phá thị trường mới, tinh thần quật khởi trước nghịch cảnh và năng lực đổi mới sáng tạo.',
    careerTendency:
      'Thích hợp với môi trường khởi nghiệp, công nghệ tiên phong, thị trường nhiều biến động, quân sự, kỹ thuật, sáng tạo đột phá hoặc làm chủ doanh nghiệp tự do.',
    wealthTendency:
      'Dòng tiền có tính chất thăng trầm rõ rệt, có thể phát tài nhanh chóng khi gặp thời thế thuận lợi; cần quản trị rủi ro chặt chẽ để tránh hao tổn bất ngờ.',
    strategicAdvice:
      'Luôn chuẩn bị phương án dự phòng khi thành công rực rỡ. Kỷ luật thép và biết điểm dừng đúng lúc sẽ giúp chuyển hóa năng lượng bùng nổ thành thành tựu trường cửu.',
  },

  'Sát Phá Tham': {
    name: 'Sát Phá Tham',
    category: 'Major',
    characteristics:
      'Tên gọi dân gian phổ biến của Sát Phá Lang. Đại diện cho tinh thần tiên phong, dám nghĩ dám làm, mạo hiểm, năng lực khai phá thị trường mới và tinh thần quật khởi trước mọi thử thách khắc nghiệt.',
    careerTendency:
      'Khởi nghiệp, công nghệ cao, quản trị rủi ro, dự án đổi mới sáng tạo hoặc các ngành nghề cạnh tranh cao độ.',
    wealthTendency:
      'Phát triển theo đường đồ thị xoắn ốc; kiếm tiền nhanh nhưng cần hệ thống phòng thủ tài chính vững chắc.',
    strategicAdvice:
      'Rèn luyện tính kiên nhẫn; thành công lớn nhất của người có cách này là chiến thắng sự nóng vội của chính mình.',
  },

  'Cơ Nguyệt Đồng Lương': {
    name: 'Cơ Nguyệt Đồng Lương',
    category: 'Major',
    characteristics:
      'Bộ sao trí thức và phụng sự nhân văn gồm Thiên Cơ (mưu sĩ mẫn tiệp), Thái Âm (phú quý chu toàn), Thiên Đồng (phúc khí nhân từ) và Thiên Lương (ấm áp che chở giải tai). Đại diện cho tư duy chiến lược, sự khéo léo trong lập kế hoạch, lòng nhân ái và tính cẩn trọng.',
    careerTendency:
      'Rất hợp với các ngành nghề chuyên môn cao: nghiên cứu khoa học, công nghệ thông tin, giáo dục đào tạo, y tế chăm sóc sức khỏe, tư vấn chiến lược, công chức nhà nước.',
    wealthTendency:
      'Thu nhập ổn định, nguồn tiền tăng trưởng đều đặn qua năng lực chuyên môn và thói quen tích lũy thông minh. Duyên phận tốt với đầu tư đất đai nhà cửa nhờ Thái Âm.',
    strategicAdvice:
      'Tập trung mài sắc chuyên môn sâu để trở thành chuyên gia không thể thay thế trong lĩnh vực của mình. Tự tin bước ra khỏi vùng an toàn khi cơ hội lớn xuất hiện.',
  },

  'Cự Nhật Hội Chiếu': {
    name: 'Cự Nhật Hội Chiếu',
    category: 'Major',
    characteristics:
      'Bộ sao của ngôn luận và danh tiếng gồm Cự Môn (khẩu tài, tư duy phản biện) và Thái Dương (quang minh chính đại, sức lan tỏa). Đại diện cho tài hùng biện sắc sảo, khả năng kết nối cộng đồng và uy tín lan xa.',
    careerTendency:
      'Phù hợp với truyền thông, báo chí, luật sư tư pháp, ngoại giao đối ngoại, thương mại quốc tế, giảng dạy học thuật hoặc các dự án hợp tác đa văn hóa.',
    wealthTendency:
      'Tài lộc đến từ danh tiếng, uy tín cá nhân và kỹ năng giao tiếp thuyết phục; càng có tiếng vang trong ngành thì nguồn thu nhập càng dồi dào.',
    strategicAdvice:
      'Lời nói là vàng bạc nhưng cũng là khởi nguồn của thị phi. Giữ tâm chính trực, dùng ngôn từ để nâng đỡ và kết nối người khác thay vì tranh cãi hơn thua.',
  },

  'Dương Lương Xương Lộc': {
    name: 'Dương Lương Xương Lộc',
    category: 'Major',
    characteristics:
      'Kỳ cách khoa bảng số một trong Đẩu Số theo Trung Châu Phái. Gồm Thái Dương, Thiên Lương hội tụ cùng Văn Xương và Lộc Tồn (hoặc Hóa Lộc). Biểu trưng cho sự tinh anh kiệt xuất trong học thuật, thi cử đỗ đạt đỉnh cao, được tuyển bạt giữ trọng trách quốc gia.',
    careerTendency:
      'Học giả danh tiếng, chuyên gia nghiên cứu chính sách, viện sĩ, thẩm phán, công chức cấp cao hoặc lãnh đạo các viện nghiên cứu, trường đại học.',
    wealthTendency:
      'Tài lộc đến từ bổng lộc chính thức, chức vị cao quý và các giải thưởng học thuật; danh tiếng mang lại sự thịnh vượng bền vững.',
    strategicAdvice:
      'Giữ vững chuẩn mực đạo đức nghề nghiệp; dùng tri thức và uy tín của mình để phụng sự xã hội và dìu dắt thế hệ kế cận.',
  },

  // --- CÁC CÁCH CỤC ĐẶC BIỆT (SPECIAL PATTERNS) ---
  'Tài Ấm Giáp Ấn': {
    name: 'Tài Ấm Giáp Ấn',
    category: 'Special',
    characteristics:
      'Đại cát cách độc đáo nhất của Thiên Tướng trong Trung Châu Phái. Thiên Tướng (Ấn tinh) tọa thủ được Hóa Lộc hoặc Lộc Tồn (Tài) cùng Thiên Lương (Ấm tinh) ở hai lân cung giáp hộ. Chủ về một đời hưởng thụ sung sướng, ít gặp thăng trầm gian lao, sự nghiệp tiến ích không ngừng.',
    careerTendency:
      'Lãnh đạo cơ quan tài chính, chưởng quản ngân khố, quản lý tài sản doanh nghiệp, kinh doanh địa sản hoặc thừa kế sự nghiệp lớn.',
    wealthTendency:
      'Tài chính dồi dào, gia sản đồ sộ. Đặc biệt nếu cách này tọa thủ Điền Trạch cung thì chủ là trùm sỏ bất động sản, gia trạch hưng vượng tiến tài.',
    strategicAdvice:
      'Tận dụng nguồn lực dồi dào để đầu tư vào các giá trị bền vững; kết hợp quyền lực của Ấn và sự che chở của Ấm để bảo trợ cấp dưới.',
  },

  'Hình Kỵ Giáp Ấn': {
    name: 'Hình Kỵ Giáp Ấn',
    category: 'Special',
    characteristics:
      'Hiểm cách cần đặc biệt lưu tâm của Thiên Tướng trong Trung Châu Phái. Thiên Tướng bị Kình Dương (Hình) và Hóa Kỵ (Kỵ) ở hai lân cung kẹp chặt. Đại diện cho áp lực bao vây, nguy cơ vướng vào vòng lao lý pháp luật, tranh chấp hợp đồng hoặc tai nạn tổn hại thân thể.',
    careerTendency:
      'Dễ gặp trắc trở trong công việc do bị cấp trên nghi kỵ, đồng nghiệp chèn ép hoặc bị liên lụy bởi các sai sót hành chính, pháp lý.',
    wealthTendency:
      'Nguy cơ hao tài tốn của vì kiện tụng, tranh chấp bất động sản hoặc bị phạt hành chính; kị đứng tên vay mượn hộ.',
    strategicAdvice:
      'Tuyệt đối tuân thủ pháp luật, minh bạch trong sổ sách hợp đồng, không ký tá mập mờ. Giữ thái độ nhẫn nhịn, khiêm tốn chờ vận hạn xấu qua đi.',
  },

  'Hỏa Tham & Linh Tham': {
    name: 'Hỏa Tham & Linh Tham',
    category: 'Special',
    characteristics:
      'Tham Lang đồng độ hoặc hội tụ Hỏa Tinh hoặc Linh Tinh tại các cung vị miếu vượng (đặc biệt tại Thìn, Tuất, Sửu, Mùi). Biểu trưng cho sự bùng nổ danh tài, "Hỏa Tham chủ bạo phát, Linh Tham chủ âm thầm phát phúc", lập nên thành tựu vượt bậc trong thời gian ngắn.',
    careerTendency:
      'Kinh doanh mạo hiểm, công nghệ đột phá, đầu tư tài chính, bất động sản hoặc nắm bắt các xu hướng thị trường mới nổi.',
    wealthTendency:
      'Khả năng nhân bội tài sản thần tốc, hoạch tài bất ngờ; tuy nhiên nếu gặp thêm Kình Đà Không Kiếp thì bạo phát cũng đi liền bạo tàn.',
    strategicAdvice:
      'Khi phát tài rực rỡ, lập tức trích lập dòng tiền an toàn và chia sẻ phúc lộc làm việc thiện. Đừng để lòng tham dẫn dắt sa đà vào các cuộc phiêu lưu vô độ.',
  },

  'Bách Quan Triều Củng': {
    name: 'Bách Quan Triều Củng',
    category: 'Special',
    characteristics:
      'Tử Vi hoặc Thiên Phủ được đầy đủ các Phụ diệu (Tả Phụ, Hữu Bật, Khôi, Việt), Tá diệu (Xương, Khúc, Lộc, Mã) và Tạp diệu quý hiển (Thai Tọa, Ân Quý, Thai Cáo) hội tụ chầu về. Tựa như bậc minh quân ngự trên ngai vàng có quần thần trăm quan phò tá đắc lực.',
    careerTendency:
      'Đại phú đại quý, nguyên thủ, chính khách tầm cỡ, chủ tịch tập đoàn đa quốc gia, người đứng đầu các liên minh lớn.',
    wealthTendency:
      'Tài sản vô lượng, tích lũy từ uy tín cá nhân, hệ thống tổ chức rộng lớn và mạng lưới tinh hoa.',
    strategicAdvice:
      'Dùng quyền uy đi liền lòng nhân từ; tạo dựng cơ chế công bằng để quần thần cấp dưới phát huy hết tài năng.',
  },

  'Tại Dã Cô Quân': {
    name: 'Tại Dã Cô Quân',
    category: 'Special',
    characteristics:
      'Tử Vi tọa thủ đơn độc, không có Bách Quan Triều Củng phò tá, bị Quần thần viễn ly. Tựa như vị vua cô đơn nơi thôn dã, tính tình lập dị không hòa đồng, nhưng có tư tưởng vượt trội hơn người thường, không rơi vào sự dung tục tầm thường.',
    careerTendency:
      'Học giả tư tưởng độc lập, nhà triết học, tôn giáo, nghệ thuật gia, nhà thiết kế sáng tạo độc bản.',
    wealthTendency:
      'Tài chính đủ dùng, không quá màng danh lợi thực dụng; nếu gặp thêm Sát Không thì càng phát triển về chiều sâu tinh thần.',
    strategicAdvice:
      'Chấp nhận sự khác biệt độc bản của mình; tìm kiếm những cộng sự hiểu được tầm nhìn của bạn để cùng hiện thực hóa ý tưởng.',
  },

  'Mệnh Vô Chính Diệu': {
    name: 'Mệnh Vô Chính Diệu',
    category: 'Special',
    characteristics:
      'Cung Mệnh không có chính tinh tọa thủ, ví như căn phòng không có chủ nhà trực tiếp, phải đón nhận năng lượng chiếu về từ cung xung đối (Thiên Di) theo đại pháp "Tá Tinh An Cung" của Trung Châu Phái. Người có cách này cực kỳ nhạy bén, khả năng thích ứng linh hoạt vô song.',
    careerTendency:
      'Linh hoạt đa năng, làm việc xuất sắc trong vai trò cố vấn, trợ thủ đắc lực, nhà đàm phán trung gian hoặc các vị trí đòi hỏi thích nghi nhanh với bối cảnh mới.',
    wealthTendency:
      'Tài chính phụ thuộc nhiều vào hoàn cảnh và người dẫn dắt; tích lũy tốt nhất khi làm ăn dựa trên sự hợp tác minh bạch hoặc làm người thừa hành giỏi.',
    strategicAdvice:
      'Nên chọn môi trường ổn định hoặc có người dẫn dắt vững chãi để nương tựa phát triển. Tránh ôm đồm quá nhiều việc cùng lúc và xây dựng nội lực kiên định từ bên trong.',
  },

  'Nhật Nguyệt Tịnh Minh': {
    name: 'Nhật Nguyệt Tịnh Minh',
    category: 'Special',
    characteristics:
      'Thái Dương tại Mão/Tị/Ngọ (tỏa sáng ban ngày) và Thái Âm tại Hợi/Tý/Sửu (thanh quang ban đêm) đều ở vị trí miếu vượng soi sáng cung Mệnh. Biểu tượng của vầng nhật nguyệt cùng tỏa sáng rạng ngời, trí tuệ kiệt xuất, phong thái thanh tao quý hiển.',
    careerTendency:
      'Sự nghiệp xán lạn, dễ đạt thành tựu sớm, nổi bật trong giới học thuật, văn hóa, quản lý cấp cao hoặc các hoạt động xã hội tầm cỡ.',
    wealthTendency:
      'Phú quý song toàn, tài lộc dồi dào cả về tiền mặt lẫn bất động sản, cuộc sống sung túc an nhàn.',
    strategicAdvice:
      'Duy trì sự khiêm tốn trước thành công, chia sẻ may mắn và tri thức cho cộng đồng để phúc đức ngày càng sinh sôi trường tồn.',
  },

  'Lộc Mã Giao Trì': {
    name: 'Lộc Mã Giao Trì',
    category: 'Special',
    characteristics:
      'Hóa Lộc (hoặc Lộc Tồn) đồng cung hoặc hội chiếu với Thiên Mã tại các cung sinh vượng (Dần, Thân, Tị, Hợi). Biểu trưng cho cỗ xe chở đầy vàng bạc đi khắp muôn phương, buôn bán phát tài, năng động di chuyển sinh tài lộc dồi dào.',
    careerTendency:
      'Kinh doanh thương mại, xuất nhập khẩu, logistics vận tải, đầu tư tài chính, du lịch hoặc các dự án công tác xa, mở rộng thị trường quốc tế.',
    wealthTendency:
      'Tiền bạc càng kiếm càng nhiều khi chịu khó đi xa và đổi mới phương thức làm ăn; cực kỳ nhạy bén đón đầu dòng tiền mới.',
    strategicAdvice:
      'Càng năng động xông pha thì tài vận càng hanh thông; hãy mạnh dạn mở rộng địa bàn hoạt động ra bên ngoài.',
  },

  'Lộc Văn Củng Mệnh': {
    name: 'Lộc Văn Củng Mệnh',
    category: 'Special',
    characteristics:
      'Lộc tinh (Lộc Tồn / Hóa Lộc) hội tụ cùng Văn tinh (Văn Xương, Văn Khúc) củng chiếu bản Mệnh. Chủ về người vừa có tài năng văn hoa kiệt xuất, thi cử đỗ đạt, vừa có nguồn tài lộc sung túc đi kèm.',
    careerTendency:
      'Chuyên gia truyền thông, tác giả sách, luật sư, giảng viên cao cấp, kiến trúc sư hoặc chuyên viên phân tích tài chính.',
    wealthTendency:
      'Thu nhập cao từ tài năng trí tuệ và danh tiếng chuyên môn; tiền tài chính đáng và bền vững.',
    strategicAdvice:
      'Cẩn trọng đề phòng "Tinh diệu hỗ thiệp": nếu có các tạp diệu Đào hoa, Đại Hao xen vào thì tránh ham mê thanh sắc làm xao nhãng công danh sự nghiệp.',
  },

  'Linh Xương Đà Vũ': {
    name: 'Linh Xương Đà Vũ',
    category: 'Special',
    characteristics:
      'Tổ hợp gồm Linh Tinh, Văn Xương, Đà La và Vũ Khúc hội tụ tại các cung Thìn, Tuất hoặc khi vận hạn bay đến. Cổ ngữ gọi là "Linh Xương Đà Vũ hạn chí đầu hà", cảnh báo giai đoạn biến động tinh thần lớn, bế tắc tâm lý hoặc khủng hoảng tài chính bất ngờ.',
    careerTendency:
      'Gặp hạn này cần hết sức thận trọng trong công việc, không mở rộng đầu tư rủi ro, kiểm tra kỹ hợp đồng văn tự pháp lý.',
    wealthTendency:
      'Nguy cơ thất thoát tiền bạc do quyết định bốc đồng hoặc sai lầm trên giấy tờ sổ sách; tuyệt đối không vay mượn đòn bẩy cao.',
    strategicAdvice:
      'Bình tâm đón nhận, tìm kiếm sự tư vấn từ chuyên gia đáng tin cậy. Bảo vệ sự bình an của thân tâm, kiên nhẫn vượt qua thời khắc đen tối.',
  },

  'Dương Đà Giáp Kỵ': {
    name: 'Dương Đà Giáp Kỵ',
    category: 'Special',
    characteristics:
      'Hóa Kỵ tọa thủ bị Kình Dương và Đà La ở hai lân cung kẹp chặt. Tình thế như người bị bao vây tứ phía, công việc gặp nhiều trở ngại cản trở, dễ chịu hàm oan hoặc cô lập.',
    careerTendency:
      'Thích hợp với việc lui về nghiên cứu chuyên sâu, hoàn thiện quy trình nội bộ, tránh xuất đầu lộ diện hoặc đối đầu trực tiếp.',
    wealthTendency:
      'Tài chính bị bó hẹp, thu nhập chậm trễ; cần thắt chặt chi tiêu và duy trì quỹ dự phòng khẩn cấp.',
    strategicAdvice:
      'Nhẫn nhịn là vàng. Dùng giai đoạn này để tôi luyện bản lĩnh và rèn giũa kỹ năng; khi vận trình dịch chuyển, thế kẹp sẽ tự động được tháo gỡ.',
  },
}

// --- TRI THỨC VỀ TỨ HÓA (MUTAGENS KNOWLEDGE) THEO TRUNG CHÂU PHÁI ---
export const MUTAGENS_KNOWLEDGE: Record<
  string,
  {
    name: string
    element: string
    meaning: string
    auspiciousPalaces: string
    tabooPalaces: string
    advice: string
  }
> = {
  'Lộc': {
    name: 'Hóa Lộc',
    element: 'Âm Thổ',
    meaning:
      'Chủ về tài lộc, may mắn tài chính, sự hòa nhã vui tươi, nhân duyên tốt đẹp và niềm vui cuộc sống. Thể hiện tính chất nuôi dưỡng, sinh sôi của hành Thổ.',
    auspiciousPalaces: 'Hỉ cư Dần, Thân; đặc biệt tối hỉ kiến Lộc Tồn, Thiên Mã thành cách Lộc Mã Giao Trì.',
    tabooPalaces: 'Kị Không Kiếp, kị cư Tý, Ngọ, Mão, Dậu.',
    advice:
      'Tận dụng thời cơ tài chính thuận lợi để tái đầu tư vào các giá trị bền vững và tri thức; tránh chi tiêu xa xỉ phung phí.',
  },

  'Quyền': {
    name: 'Hóa Quyền',
    element: 'Âm Mộc',
    meaning:
      'Chủ về quyền lực, ý chí kiên định, năng lực chỉ huy, tính cạnh tranh quyết liệt và tinh thần tự chủ cao. Thể hiện sự vươn lên mạnh mẽ của hành Mộc.',
    auspiciousPalaces: 'Hỉ Cự Môn, Vũ Khúc; tối hỉ cư Sửu. Không sợ chư Hung.',
    tabooPalaces: 'Kị Tứ sát khi không nằm ở Sửu, Mão, Tuất.',
    advice:
      'Sử dụng quyền lực với sự thấu cảm và bao dung; lắng nghe tiếng nói của tập thể để tránh tạo ra sự đối kháng ngầm từ cấp dưới.',
  },

  'Khoa': {
    name: 'Hóa Khoa',
    element: 'Dương Thủy',
    meaning:
      'Đệ nhất cứu giải tai ương trong Đẩu Số, chủ về danh dự, học vấn, thi cử bảng vàng, thanh danh và sự quý nhân phò trợ. Thể hiện tính chất thanh lọc, nhu nhuận của hành Thủy.',
    auspiciousPalaces: 'Tối hỉ Sửu, Ngọ, Thân; hỉ kiến Khôi Việt tương trợ.',
    tabooPalaces: 'Kị Không Kiếp và Nhật Nguyệt hãm địa.',
    advice:
      'Không ngừng học tập nâng cao trình độ; danh tiếng và trí tuệ chính là chiếc áo giáp bảo vệ bạn vững vàng trước mọi sóng gió cuộc đời.',
  },

  'Kỵ': {
    name: 'Hóa Kỵ',
    element: 'Dương Thủy',
    meaning:
      'Chủ về bài học thử thách, thị phi, sự trắc trở, dính mắc tâm lý hoặc những mối quan hệ cần được chữa lành. Trong Trung Châu Phái, Hóa Kỵ là động lực tôi luyện con người trưởng thành.',
    auspiciousPalaces: 'Hỉ cư Tý, Sửu; hợp người Mệnh Thủy cục và người sinh năm Thân, Tý, Thìn.',
    tabooPalaces: 'Kị cư Dần, Ngọ, Tuất, Tị, Hợi; kị người Mệnh Hỏa cục.',
    advice:
      'Hóa Kỵ không phải là tai họa tuyệt vọng mà là bài kiểm tra bản lĩnh. Bình tâm đón nhận, minh bạch trong ứng xử, buông bỏ sự cố chấp để chuyển hóa nghịch cảnh.',
  },
}
