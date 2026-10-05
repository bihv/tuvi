/**
 * Tri thức về Phụ tá sát diệu, Tạp diệu và Các cặp Đối tinh
 * Dựa trên tài liệu: "Trung Châu Phái Tử Vi Đẩu Số Sơ Cấp Giảng Nghĩa" - Vương Đình Chi
 */

export interface MinorStarKnowledge {
  name: string
  category: 'Phụ diệu' | 'Tá diệu' | 'Sát diệu' | 'Tạp diệu'
  element: string
  yinYang: 'Âm' | 'Dương'
  coreNature: string
  auspiciousEffect: string // Cát thì...
  inauspiciousEffect: string // Hung thì...
  favoritePalaces: string // Hỉ cư
  tabooPalaces: string // Kị cư
  advice: string
}

export const ASSISTANT_STARS_KNOWLEDGE: Record<string, MinorStarKnowledge> = {
  // --- TỨ PHỤ DIỆU: Tả Phụ, Hữu Bật, Thiên Khôi, Thiên Việt ---
  'Tả Phụ': {
    name: 'Tả Phụ',
    category: 'Phụ diệu',
    element: 'Dương Thổ',
    yinYang: 'Dương',
    coreNature: 'Chủ về sự trợ lực, phò tá đắc lực, hành thiện lệnh, tính cách khoan dung, trọng nghĩa khí.',
    auspiciousEffect: 'Cát thì được bạn bè, cấp dưới tận tâm phò tá, tăng thêm sự ổn định và quy mô của sự nghiệp.',
    inauspiciousEffect: 'Hung thì dễ bị can thiệp, lấn lướt quyền hạn hoặc chịu phiền toái vì người khác.',
    favoritePalaces: 'Thập nhị cung đều cát, ngoại trừ Mão và Dậu.',
    tabooPalaces: 'Cung Mão, Dậu.',
    advice: 'Phát huy năng lực liên kết đội ngũ; sự chân thành và hào sảng sẽ chiêu cảm quý nhân và thuộc cấp trung thành.',
  },

  'Hữu Bật': {
    name: 'Hữu Bật',
    category: 'Phụ diệu',
    element: 'Âm Thủy',
    yinYang: 'Âm',
    coreNature: 'Chủ về sự mưu lược, trợ lực quyền biến, chế lệnh mềm mỏng, khả năng hòa giải và kết nối sâu sắc.',
    auspiciousEffect: 'Cát thì mưu lược thành công, có trợ thủ đắc lực trong bóng tối, biến chuyển nguy thành an.',
    inauspiciousEffect: 'Hung thì dễ bị chiếm đoạt công lao, tranh chấp ngầm hoặc tình cảm đa đoan.',
    favoritePalaces: 'Thập nhị cung đều cát, ngoại trừ Mão và Dậu.',
    tabooPalaces: 'Cung Mão, Dậu.',
    advice: 'Dùng trí tuệ và sự linh hoạt để hóa giải mâu thuẫn; giữ gìn ranh giới rõ ràng trong quan hệ tình cảm và hợp tác.',
  },

  'Thiên Khôi': {
    name: 'Thiên Khôi',
    category: 'Phụ diệu',
    element: 'Dương Hỏa',
    yinYang: 'Dương',
    coreNature: 'Dương quý nhân, chủ về tài danh, sự đề bạt công khai, cơ hội xuất đầu lộ diện từ bậc trưởng bối.',
    auspiciousEffect: 'Cát thì đắc trợ công khai từ người có địa vị cao, thi cử đỗ đạt, sự nghiệp thăng tiến chính đạo.',
    inauspiciousEffect: 'Hung thì gặp trở ngại do kỳ vọng quá cao hoặc sự đố kỵ từ đối thủ.',
    favoritePalaces: 'Thập nhị cung đều tốt (đặc biệt thích hợp cho người sinh ban ngày).',
    tabooPalaces: 'Không có vị trí hãm tuyệt đối, nhưng kị ngộ Không Kiếp triệt tiêu quý khí.',
    advice: 'Tận dụng thời cơ khi được bề trên trao cơ hội; luôn giữ phong thái chính trực và lòng khiêm nhường.',
  },

  'Thiên Việt': {
    name: 'Thiên Việt',
    category: 'Phụ diệu',
    element: 'Âm Hỏa',
    yinYang: 'Âm',
    coreNature: 'Âm quý nhân, chủ về cơ hội may mắn ngầm, sự nâng đỡ âm thầm, duyên phận dị tính và giải nguy bất ngờ.',
    auspiciousEffect: 'Cát thì được nâng đỡ kín đáo lúc ngặt nghèo, gặp dữ hóa lành, nhân duyên tốt lành.',
    inauspiciousEffect: 'Hung thì dễ vướng vào mối quan hệ phức tạp, rắc rối tình cảm do sự giúp đỡ mang tính riêng tư.',
    favoritePalaces: 'Thập nhị cung đều miếu (đặc biệt thích hợp cho người sinh ban đêm).',
    tabooPalaces: 'Kị ngộ Sát Kị đào hoa hỗn tạp.',
    advice: 'Biết ơn những sự giúp đỡ thầm lặng; minh bạch trong tình cảm để tránh thị phi không đáng có.',
  },

  // --- TỨ TÁ DIỆU: Văn Xương, Văn Khúc, Lộc Tồn, Thiên Mã ---
  'Văn Xương': {
    name: 'Văn Xương',
    category: 'Tá diệu',
    element: 'Dương Kim',
    yinYang: 'Dương',
    coreNature: 'Chủ về khoa giáp, tài năng văn chương kinh điển, bằng cấp, quy tắc chính thống và sự tao nhã.',
    auspiciousEffect: 'Cát thì ưu nhã thanh cao, học rộng hiểu sâu, công danh xán lạn, thi cử bảng vàng.',
    inauspiciousEffect: 'Hung thì bên ngoài hào nhoáng nhưng bên trong trống rỗng, phết son điểm phấn dối trá, văn tự rắc rối.',
    favoritePalaces: 'Cư tại Thìn, Tị, Dậu, Sửu.',
    tabooPalaces: 'Cư tại Dần, Ngọ, Tuất.',
    advice: 'Dùng thực tài để chứng minh giá trị; cẩn trọng tuyệt đối trong các văn bản, hợp đồng, giấy tờ pháp lý.',
  },

  'Văn Khúc': {
    name: 'Văn Khúc',
    category: 'Tá diệu',
    element: 'Âm Thủy',
    yinYang: 'Âm',
    coreNature: 'Chủ về tài ăn nói, biện luận sắc sảo, cảm thụ nghệ thuật, trực giác linh hoạt và văn hóa phong nhã.',
    auspiciousEffect: 'Cát thì ăn nói lưu loát, có tài năng dị biệt, thu hút lòng người, thành công trong nghệ thuật hoặc truyền thông.',
    inauspiciousEffect: 'Hung thì khéo mồm khéo miệng nhưng xảo ngôn, tính tình phù phiếm, phong lưu đa đoan.',
    favoritePalaces: 'Cư tại Thìn, Tị, Dậu, Sửu.',
    tabooPalaces: 'Cư tại Dần, Ngọ, Tuất.',
    advice: 'Dùng lời nói chân thành để xây dựng niềm tin; kiểm soát cảm xúc lãng mạn để không ảnh hưởng sự nghiệp.',
  },

  'Lộc Tồn': {
    name: 'Lộc Tồn',
    category: 'Tá diệu',
    element: 'Âm Thổ',
    yinYang: 'Âm',
    coreNature: 'Bắc Đẩu đệ tam tinh, chủ về tước lộc, tài phú thiên định, phúc thọ và sự tích lũy an toàn.',
    auspiciousEffect: 'Cát thì tài lộc dồi dào, kinh tế vững vàng, tiêu tai giải nạn; tối hỉ gặp Thiên Mã thành cách Lộc Mã Giao Trì.',
    inauspiciousEffect: 'Hung thì cô độc (vì luôn bị Kình Dương và Đà La giáp hai bên), tính toán keo kiệt hoặc dễ mắc bệnh mạn tính.',
    favoritePalaces: 'Tý, Ngọ, Mão, Dậu, Dần, Thân, Tị, Hợi.',
    tabooPalaces: 'Bất cư tứ Mộ (Thìn, Tuất, Sửu, Mùi); tối kị Không Vong (Địa Không, Địa Kiếp, Triệt, Tuần).',
    advice: 'Tài lộc cần đi kèm sự rộng lượng; sẵn sàng đầu tư và chia sẻ để phá vỡ thế giáp kẹp của Dương Đà.',
  },

  'Thiên Mã': {
    name: 'Thiên Mã',
    category: 'Tá diệu',
    element: 'Dương Hỏa',
    yinYang: 'Dương',
    coreNature: 'Chủ về sự chuyển dịch, bôn ba, tính năng động, cơ hội biến đổi và dòng tiền lưu thông.',
    auspiciousEffect: 'Cát thì linh hoạt tháo vát, xuất ngoại lập nghiệp phát đạt, gặp Lộc Tồn thì như xe chở tiền tài.',
    inauspiciousEffect: 'Hung thì lao lực vất vả, bôn ba ngược xuôi mà không tụ tài, dễ gặp trắc trở khi đi xa.',
    favoritePalaces: 'Bốn cung sinh vượng: Dần, Thân, Tị, Hợi.',
    tabooPalaces: 'Kị gặp Không Vong hoặc lạc vào cung Bệnh, Tử, Tuyệt.',
    advice: 'Càng chủ động di chuyển mở rộng biên giới hoạt động thì cơ hội càng mở ra; quản trị tốt sức khỏe trên hành trình.',
  },

  // --- LỤC SÁT DIỆU: Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp ---
  'Kình Dương': {
    name: 'Kình Dương',
    category: 'Sát diệu',
    element: 'Dương Kim',
    yinYang: 'Dương',
    coreNature: 'Chủ về hình thương, mũi nhọn xung kích, tính cương liệt, sự quyết liệt và va chạm công khai.',
    auspiciousEffect: 'Cát (nhập Miếu tại Tứ Mộ Thìn Tuất Sửu Mùi) thì có quyền uy cương nghị, dám xông pha đột phá cục diện khó.',
    inauspiciousEffect: 'Hung thì dễ dẫn đến hình thương, tai nạn phẫu thuật, kiện tụng hoặc tính khí bạo liệt tự hại bản thân.',
    favoritePalaces: 'Thìn, Tuất, Sửu, Mùi (Tứ Mộ).',
    tabooPalaces: 'Tý, Ngọ, Mão, Dậu.',
    advice: 'Chuyển hóa tính xung kích thành tinh thần dấn thân vào các lĩnh vực kỹ thuật, chuyên môn cao hoặc rèn luyện thể chất.',
  },

  'Đà La': {
    name: 'Đà La',
    category: 'Sát diệu',
    element: 'Âm Kim',
    yinYang: 'Âm',
    coreNature: 'Chủ về sự trì hoãn, dây dưa, trở ngại ngầm, rào cản tâm lý và sự đào sâu nghiền ngẫm.',
    auspiciousEffect: 'Cát thì thâm trầm bền bỉ, âm thầm tích lũy quyền lực, năng lực nghiên cứu kiên nhẫn đến cùng.',
    inauspiciousEffect: 'Hung thì bị bài trừ ngầm, dùng dằng không dứt, tự dằn vặt nội tâm, hao tổn thời gian và tinh lực.',
    favoritePalaces: 'Thìn, Tuất, Sửu, Mùi.',
    tabooPalaces: 'Dần, Thân, Tị, Hợi.',
    advice: 'Học cách buông bỏ sự do dự; thiết lập thời hạn dứt khoát cho mọi quyết định để tránh rơi vào vòng xoáy trì trệ.',
  },

  'Hỏa Tinh': {
    name: 'Hỏa Tinh',
    category: 'Sát diệu',
    element: 'Dương Hỏa',
    yinYang: 'Dương',
    coreNature: 'Chủ về tính bộc phát mãnh liệt, xung đột nhanh chóng, ngọn lửa thử thách và năng lượng đột phá.',
    auspiciousEffect: 'Cát (nhất là đồng độ Tham Lang thành Hỏa Tham) thì bộc phát danh tài, anh hoa phát tiết nhanh chóng.',
    inauspiciousEffect: 'Hung thì hoành chiêu tai ách bất ngờ, nóng nảy làm hỏng việc lớn, dễ bị sốt nóng hoặc hỏa hoạn.',
    favoritePalaces: 'Dần, Ngọ, Tuất.',
    tabooPalaces: 'Thân, Tý, Thìn.',
    advice: 'Giữ tâm bình khí hòa trước nghịch cảnh; năng lượng bùng nổ chỉ đem lại thành tựu khi có kỷ luật và định hướng rõ ràng.',
  },

  'Linh Tinh': {
    name: 'Linh Tinh',
    category: 'Sát diệu',
    element: 'Âm Hỏa',
    yinYang: 'Âm',
    coreNature: 'Chủ về sự sắc sảo thâm trầm, tính bền gan âm ỉ, mưu lược ngầm và sự cảnh giác cao độ.',
    auspiciousEffect: 'Cát (nhất là đồng độ Tham Lang thành Linh Tham) thì âm thầm phát phúc, lập nên kỳ tích bất ngờ.',
    inauspiciousEffect: 'Hung thì chứa chấp hận thù, ghen tuông ám hại, tinh thần căng thẳng lo âu kéo dài.',
    favoritePalaces: 'Dần, Ngọ, Tuất.',
    tabooPalaces: 'Thân, Tý, Thìn.',
    advice: 'Chuyển hóa sự sắc sảo thành năng lực tư duy chiến lược; học cách tha thứ và giải tỏa cảm xúc tiêu cực.',
  },

  'Địa Không': {
    name: 'Địa Không',
    category: 'Sát diệu',
    element: 'Âm Hỏa',
    yinYang: 'Âm',
    coreNature: 'Chủ về sự hư không, tư tưởng kỳ dị vượt thế tục, tính chất làm trống rỗng vật chất nhưng mở rộng tâm linh.',
    auspiciousEffect: 'Cát thì độ lượng bao dung, tư tưởng sáng tạo độc đáo vượt thời đại, có năng khiếu triết học, tôn giáo, thiết kế.',
    inauspiciousEffect: 'Hung thì nửa đường gãy gánh, mất mát tài sản bất ngờ, tâm lý hụt hẫng cô đơn.',
    favoritePalaces: 'Cung Kim và Hỏa (Tị, Ngọ, Thân, Dậu).',
    tabooPalaces: 'Cung Thủy và Mộc (Hợi, Tý, Dần, Mão).',
    advice: 'Xem nhẹ sự hơn thua vật chất, phát triển chiều sâu trí tuệ và trực giác sáng tạo để biến ý tưởng độc lạ thành giá trị.',
  },

  'Địa Kiếp': {
    name: 'Địa Kiếp',
    category: 'Sát diệu',
    element: 'Dương Hỏa',
    yinYang: 'Dương',
    coreNature: 'Chủ về sự hao hớt, trắc trở sóng gió, tinh thần dám phá cách, biến động bất ngờ.',
    auspiciousEffect: 'Cát thì có chí tiến thủ khác thường, dám đi con đường mới lạ chưa ai đi, khai phá tiềm năng ẩn giấu.',
    inauspiciousEffect: 'Hung thì tiền tài thất thoát, trắc trở thăng trầm trong sự nghiệp, dễ gặp cảnh làm nhiều hưởng ít.',
    favoritePalaces: 'Thìn, Tuất.',
    tabooPalaces: 'Các cung còn lại đều có mức độ tác động hao tổn.',
    advice: 'Xây dựng kế hoạch tài chính có phòng hộ rủi ro nghiêm ngặt; biến nghịch cảnh thành bàn đạp rèn luyện ý chí thép.',
  },
}

/**
 * Các cặp Đối Tinh (Đôi Tinh) trọng yếu và Nguyên lý "Kiến Tinh Tầm Ngẫu" theo Trung Châu Phái
 */
export const PAIRED_STARS_KNOWLEDGE = {
  ruleName: 'Kiến Tinh Tầm Ngẫu (Gặp sao này phải tìm cặp với nó)',
  description:
    'Trong Trung Châu Phái, các sao luôn vận hành theo từng cặp đối tinh. Nếu chỉ xuất hiện đơn lẻ thì lực tác động vừa phải, nhưng khi hội đủ cả cặp thì sức mạnh gia tăng gấp bội phần.',
  pairs: [
    {
      type: 'Chính diệu Đối tinh',
      pairs: [
        { pair: ['Thiên Phủ', 'Thiên Tướng'], meaning: 'Phủ Tướng tương cố, một bên giữ kho ngân khố, một bên cầm ấn quyền chỉ huy.' },
        { pair: ['Thái Dương', 'Thái Âm'], meaning: 'Nhật Nguyệt đối xứng, một bên chủ quý hiển danh vọng, một bên chủ phú quý tích tài.' },
        { pair: ['Thiên Đồng', 'Thiên Lương'], meaning: 'Đồng Lương điều hòa, một bên hưởng thụ phúc khí, một bên ấm áp che chở giải tai ách.' },
        { pair: ['Liêm Trinh', 'Tham Lang'], meaning: 'Liêm Tham đối đãi, một bên thứ đào hoa âm nhu sắc sảo, một bên đào hoa dương cương đa dục.' },
      ],
    },
    {
      type: 'Phụ diệu Đối tinh',
      pairs: [
        { pair: ['Tả Phụ', 'Hữu Bật'], meaning: 'Trợ lực tả hữu, nâng đỡ công danh và sự nghiệp quy mô.' },
        { pair: ['Thiên Khôi', 'Thiên Việt'], meaning: 'Dương quý nhân và Âm quý nhân tương trợ, công khai và ngầm ẩn.' },
      ],
    },
    {
      type: 'Tá diệu Đối tinh',
      pairs: [
        { pair: ['Văn Xương', 'Văn Khúc'], meaning: 'Văn hóa chính quy và tài năng biện luận nghệ thuật.' },
        { pair: ['Lộc Tồn', 'Thiên Mã'], meaning: 'Lộc Mã Giao Trì, xe chở đầy tài lộc đi khắp muôn phương.' },
      ],
    },
    {
      type: 'Tạp diệu Đối tinh trọng yếu',
      pairs: [
        { pair: ['Hồng Loan', 'Thiên Hỷ'], meaning: 'Hỷ khánh hôn nhân, sinh sôi nảy nở, nhân duyên tốt đẹp.' },
        { pair: ['Hàm Trì', 'Đại Hao'], meaning: 'Đào hoa sắc dục hao tán, tiêu pha vì vui chơi hưởng lạc.' },
        { pair: ['Long Trì', 'Phượng Các'], meaning: 'Năng khiếu thủ công tinh tế, thẩm mỹ thanh nhã, văn chương khoa giáp.' },
        { pair: ['Tam Thai', 'Bát Tọa'], meaning: 'Tăng cường thanh thế, uy nghi đĩnh đạc của chủ tinh.' },
        { pair: ['Ân Quang', 'Thiên Quý'], meaning: 'Ân tình nâng đỡ, quý nhân tương trợ xuất phát từ tình cảm chân thành.' },
        { pair: ['Cô Thần', 'Quả Tú'], meaning: 'Tính cô độc, thu mình, kén chọn trong giao tiếp và tình cảm.' },
        { pair: ['Thiên Khốc', 'Thiên Hư'], meaning: 'Lo âu, phiền muộn, tiếng tăm hư danh hoặc nỗi buồn nội tâm.' },
        { pair: ['Thiên Tài', 'Thiên Thọ'], meaning: 'Tài hoa phát tiết kết hợp với sự điềm tĩnh trường thọ.' },
        { pair: ['Thai Phụ', 'Phong Cáo'], meaning: 'Thăng hàm tước, được khen thưởng, công nhận thành tích.' },
      ],
    },
  ],
  interactionLevels: [
    { level: 1, name: 'Đối tinh Đồng cung', strength: 'Mạnh nhất', description: 'Hai sao cùng ngự tại một cung (ví dụ Sửu cung có Thái Dương Thái Âm).' },
    { level: 2, name: 'Đối tinh Hỗ chiếu (Xung đối)', strength: 'Rất mạnh', description: 'Hai sao nằm ở hai cung đối xứng xung chiếu lẫn nhau.' },
    { level: 3, name: 'Song phi hồ điệp thức (Tam hợp cân đối)', strength: 'Khá mạnh', description: 'Hai sao nằm ở hai cung tam hợp bên tả bên hữu hội chiếu về bản cung.' },
    { level: 4, name: 'Thiên tà thức', strength: 'Yếu hơn', description: 'Hai sao nằm ở vị trí không cân xứng (một ở bản cung, một ở tam hợp lệch).' },
  ],
}
